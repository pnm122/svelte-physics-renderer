import debounce from 'lodash.debounce'
import Matter from 'matter-js'
import { getContext, setContext } from 'svelte'
const { Bodies, Composite, Engine, Mouse, MouseConstraint, Runner, Render } = Matter

export interface CanvasElement {
	body: () => Matter.Body
	element: {
		reference: HTMLElement
		initialStyle: string
	}
	render: (queue: (() => void)[]) => void
}

export interface CanvasInitializer {
	element: HTMLElement | null
	interactive: boolean
	bounded: boolean
	gravity: Partial<Matter.Gravity>
}

export class Canvas {
	interactive: boolean
	bounded: boolean
	private gravity: Partial<Matter.Gravity>

	engine: Matter.Engine | null
	world: Matter.World | null
	runner: Matter.Runner | null
	private walls: Matter.Body[] | null
	mouse: Matter.Mouse | null
	mouseConstraint: Matter.MouseConstraint | null

	private resizeObserver: ResizeObserver | null
	private animationFrame: number | null

	state = $state<'running' | 'stopped' | 'paused'>('stopped')
	elements = $state<CanvasElement[]>([])
	/** Elements added while the canvas isn't running.
	 *  Will be added when `start()`/`resume()` is called.
   *  `resolve` is a list of promises to resolve when the element is added to the Canvas. Resolves with null if the element is removed from the Canvas before it can be added to the world
	 */
	private queuedElements: { element: HTMLElement, resolve?: ((el: CanvasElement | null) => void)[] }[] = []
	canvasElement = $state<HTMLElement | null>()

  /**
   * Transformations of elements are computed during their `render()` calls, then the results are applied after all transformations have been calculated.
   * This queue keeps track of all transformations to apply at the end of all `render()` calls during a rerender
   */
  private renderQueue: (() => void)[]

	constructor({ element, interactive, bounded, gravity }: CanvasInitializer) {
		this.canvasElement = element
		this.interactive = interactive
		this.bounded = bounded
		this.gravity = gravity

		this.engine = null
		this.world = null

		this.runner = null

		this.walls = null
		this.mouse = null
		this.mouseConstraint = null

		this.resizeObserver = null
		this.animationFrame = null

    this.renderQueue = []
	}

	private createWalls() {
		if (!this.canvasElement) throw new Error('createWalls() called without canvasElement!')
		const { clientWidth: width, clientHeight: height } = this.canvasElement
		const wallSize = 50
		return [
			Bodies.rectangle(width / 2, wallSize / -2, width, wallSize, { isStatic: true }),
			Bodies.rectangle(width / 2, height + wallSize / 2, width, wallSize, { isStatic: true }),
			Bodies.rectangle(width + wallSize / 2, height / 2, wallSize, height, { isStatic: true }),
			Bodies.rectangle(wallSize / -2, height / 2, wallSize, height, { isStatic: true })
		]
	}

	private updateRenderBounds = debounce(() => {
		if (this.state !== 'running') throw new Error('updateRenderBounds() called on inactive Canvas!')

		// Update dimensions of walls to match new render bounds
		if (this.bounded) {
			if (this.walls) {
				for (const wall of this.walls) {
					Composite.remove(this.world!, wall)
				}
			}
			this.walls = this.createWalls()
			Composite.add(this.world!, this.walls)
		}

		if (this.interactive) {
			if (this.mouseConstraint) {
				Composite.remove(this.world!, this.mouseConstraint)
			}
			this.mouse = Mouse.create(this.canvasElement!)
			this.mouseConstraint = MouseConstraint.create(this.engine!, {
				mouse: this.mouse,
				constraint: {
					stiffness: 0.2,
					render: {
						visible: true
					}
				}
			})
			Composite.add(this.world!, this.mouseConstraint)
		}
	}, 50)

	private rerender() {
		if (!this.engine) throw new Error('rerender() called without engine!')
    this.elements.forEach(element => element.render(this.renderQueue))
    this.renderQueue.forEach(fn => fn())
    this.renderQueue = []

		Engine.update(this.engine)
		this.animationFrame = requestAnimationFrame(this.rerender.bind(this))
	}

	private getElementById(id: number) {
		return this.world?.bodies.find((b) => b.id === id)
	}

	/** Differs from addElement in that it adds directly to `elements` without checking the state of the Canvas.
	 * The state should be checked before calling this.
	 */
	private innerAddElement(el: HTMLElement): CanvasElement {
		const shape = el.getAttribute('data-shape')

		const { x: elementX, y: elementY, width, height } = el.getBoundingClientRect()
		const { x: canvasX, y: canvasY } = this.canvasElement!.getBoundingClientRect()
		const density = parseFloat(el.getAttribute('data-density')!),
			friction = parseFloat(el.getAttribute('data-friction')!),
			frictionAir = parseFloat(el.getAttribute('data-friction-air')!),
			isStatic = el.getAttribute('data-is-static')! === 'true',
			restitution = parseFloat(el.getAttribute('data-restitution')!),
			frictionStatic = parseFloat(el.getAttribute('data-friction-static')!),
			radius = parseFloat(el.getAttribute('data-radius')!)

		const body =
			shape === 'rectangle'
				? Bodies.rectangle(
						elementX - canvasX + width / 2,
						elementY - canvasY + height / 2,
						width,
						height,
						{
							density,
							friction,
							frictionAir,
							isStatic,
							restitution,
							frictionStatic,
							chamfer: {
								radius
							}
						}
					)
				: Bodies.circle(
						elementX - canvasX + width / 2,
						elementY - canvasY + height / 2,
						width / 2,
						{
							density,
							friction,
							frictionAir,
							isStatic,
							restitution,
							frictionStatic
						}
					)

		Composite.add(this.world!, body)

		const element: CanvasElement = {
			// Can't reference body directly?
			// I guess this means Composite.add is creating a clone of the body?
			body: () => this.getElementById(body.id)!,
			element: {
				reference: el,
				initialStyle: el.style.cssText
			},
			render(queue) {
				const { clientWidth: width, clientHeight: height } = this.element.reference
				const {
					angle,
					position: { x, y }
				} = this.body()
        queue.push(() => {
          this.element.reference.style.transform = `translate(${x - width / 2}px, ${y - height / 2}px) rotate(${angle}rad)`
          this.element.reference.style.position = 'absolute'
          this.element.reference.style.top = '0'
          this.element.reference.style.left = '0'
        })
			}
		}

		this.elements.push(element)
		return element
	}

	/** Add an element to the Canvas, queueing for the next `start()` or `resume()` call if the Canvas isn't running.
	 * @return CanvasElement when created, null if removed before added to the Canvas
	 */
	async addElement(el: HTMLElement): Promise<CanvasElement | null> {
    let resolve: (el: CanvasElement | null) => void
    const promise = new Promise<CanvasElement | null>(res => resolve = res)

		if (this.state !== 'running') {
			this.queuedElements.push({ element: el, resolve: [resolve!] })
			return promise
		}

		return this.innerAddElement(el)
	}

	/** Remove an element from the Canvas, resetting any side effects of adding it to the Canvas.
	 * @return removed CanvasElement if Canvas is running and found, null otherwise
	 */
	removeElement(el: HTMLElement): CanvasElement | null {
		if (this.state !== 'stopped') {
			const elementToRemove = this.elements.find((element) => element.element.reference === el)
			if (!elementToRemove) return null

			this.elements = this.elements.filter((element) => element !== elementToRemove)
			Composite.remove(this.world!, this.getElementById(elementToRemove.body().id)!)
			elementToRemove.element.reference.style.cssText = elementToRemove.element.initialStyle
			return elementToRemove
		} else {
			const elementToRemove = this.queuedElements.find((element) => element.element === el)
      // Resolve with null; this happens when the user adds an element and then removes it all while the Canvas isn't running
      if(elementToRemove?.resolve) {
        elementToRemove.resolve.forEach(res => res(null))
      }
			this.queuedElements = this.queuedElements.filter((element) => element !== elementToRemove)
			return null
		}
	}

  /** Get an element from the Canvas.
   * @return CanvasElement if found, null otherwise. Waits until the element is added if the Canvas isn't running.
   */
  async getElement(el: HTMLElement): Promise<CanvasElement | null> {
    if(this.state !== 'stopped') {
      return this.elements.find((element) => element.element.reference === el) ?? null
    } else {
      const element = this.queuedElements.find((element) => element.element === el)
      if(!element) return null

      let resolve: (el: CanvasElement | null) => void
      const promise = new Promise<CanvasElement | null>(res => resolve = res)
      if(element.resolve) {
        element.resolve.push(resolve!)
      } else {
        element.resolve = [resolve!]
      }
      return promise
    }
  }

	/** Start running the Canvas renderer. */
	start() {
		if (!this.canvasElement) throw new Error('start() called without canvasElement!')
		if (this.state === 'running') return

		this.engine = Engine.create({ gravity: this.gravity })
		this.world = this.engine.world

		this.queuedElements.forEach((el) => {
      const element = this.innerAddElement(el.element)
      if(el.resolve) {
        el.resolve.forEach(res => res(element))
      }
    })
		this.queuedElements = []

		this.rerender()

		this.runner = Runner.create()
		Runner.run(this.runner, this.engine)
		this.updateRenderBounds()
		this.resizeObserver = new ResizeObserver(this.updateRenderBounds)
		this.resizeObserver.observe(this.canvasElement)
		this.state = 'running'
	}

	/** Stop the Canvas renderer and clean up all side effects */
	stop() {
		if (this.state === 'stopped') return

		this.resizeObserver?.disconnect()
		if (this.animationFrame) {
			cancelAnimationFrame(this.animationFrame)
		}
		this.state = 'stopped'
		Engine.clear(this.engine!)
		Runner.stop(this.runner!)
		for (const element of this.elements) {
			element.element.reference.style.cssText = element.element.initialStyle
		}

		// Add all current elements to the queue so they will be added back if `start()` is called again
		this.queuedElements = this.elements.map((el) => ({element: el.element.reference}))
		this.elements = []
	}

	/** Pause the rendering of the Canvas. */
	pause() {
		if (this.state !== 'running') return
		if (this.animationFrame) {
			cancelAnimationFrame(this.animationFrame)
		}
		this.state = 'paused'
	}

	/** Resume rendering of the Canvas after pausing. */
	resume() {
		if (this.state !== 'paused') return

		this.queuedElements.forEach((el) => {
      const element = this.innerAddElement(el.element)
      if(el.resolve) {
        el.resolve.forEach(res => res(element))
      }
    })
		this.queuedElements = []

		this.state = 'running'
		this.rerender()
	}
}

const CANVAS_KEY = Symbol('CANVAS')

export function setCanvasContext(init: CanvasInitializer) {
	return setContext(CANVAS_KEY, new Canvas(init))
}

export function getCanvasContext() {
	return getContext<Canvas>(CANVAS_KEY)
}
