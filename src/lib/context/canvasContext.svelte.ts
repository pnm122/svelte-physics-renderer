import debounce from "lodash.debounce"
import Matter from "matter-js"
import { getContext, setContext } from "svelte"
const { Bodies, Composite, Engine, Mouse, MouseConstraint, Runner, Render } = Matter

export interface CanvasElement {
  body: () => Matter.Body
  element: HTMLElement
  render: () => void
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
  gravity: Partial<Matter.Gravity>

  engine: Matter.Engine | null
  world: Matter.World | null
  runner: Matter.Runner | null
  walls: Matter.Body[] | null
  mouse: Matter.Mouse | null
  mouseConstraint: Matter.MouseConstraint | null

  resizeObserver: ResizeObserver | null
  animationFrame: number | null

  state = $state<'inactive' | 'active'>('inactive')
  elements = $state<CanvasElement[]>([])
  canvasElement = $state<HTMLElement | null>()

  constructor({
    element,
    interactive,
    bounded,
    gravity
  }: CanvasInitializer) {
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
  }

  private createWalls() {
    if(!this.canvasElement) throw new Error('createWalls() called without canvasElement!')
    const { clientWidth: width, clientHeight: height } = this.canvasElement
    const wallSize = 50
    return [
      Bodies.rectangle(width / 2, wallSize / -2, width, wallSize, { isStatic: true }),
      Bodies.rectangle(width / 2, height + (wallSize / 2), width, wallSize, { isStatic: true }),
      Bodies.rectangle(width + (wallSize / 2), height / 2, wallSize, height, { isStatic: true }),
      Bodies.rectangle(wallSize / -2, height / 2, wallSize, height, { isStatic: true })
    ]
  }

  private updateRenderBounds = debounce(() => {
    if(this.state !== 'active') throw new Error('updateRenderBounds() called on inactive Canvas!')
      
    // Update dimensions of walls to match new render bounds
    if(this.bounded) {
      if(this.walls) {
        for(const wall of this.walls) {
          Composite.remove(this.world!, wall)
        }
      }
      this.walls = this.createWalls()
      Composite.add(this.world!, this.walls)
    }

    if(this.interactive) {
      if(this.mouseConstraint) {
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
      });
      Composite.add(this.world!, this.mouseConstraint)
    }
  }, 50)

  private rerender() {
    if(!this.engine) throw new Error('rerender() called without engine!')
    for(const element of this.elements) {
      element.render()
    }

    Engine.update(this.engine);
    this.animationFrame = requestAnimationFrame(this.rerender.bind(this));
  }

  private getElementById(id: number) {
    return this.world?.bodies.find(b => b.id === id)
  }

  addElement(el: HTMLElement) {
    if(this.state !== 'active') throw new Error('addElement() called on inactive Canvas!')
    
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
    
    const body = shape === 'rectangle' ? Bodies.rectangle(
      (elementX - canvasX) + (width / 2),
      (elementY - canvasY) + (height / 2),
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
    ) : Bodies.circle(
      (elementX - canvasX) + (width / 2),
      (elementY - canvasY) + (height / 2),
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

    this.elements.push({
      // Can't reference body directly?
      // I guess this means Composite.add is creating a clone of the body?
      body: () => this.getElementById(body.id)!,
      element: el,
      render() {
        const { clientWidth: width, clientHeight: height } = this.element
        const { angle, position: { x, y } } = this.body()
        this.element.style.position = 'absolute'
        this.element.style.top = '0'
        this.element.style.left = '0'
        this.element.style.transform = `translate(${x - (width / 2)}px, ${y - (height / 2)}px) rotate(${angle}rad)`
      }
    })
  }

  removeElement(el: HTMLElement) {
    if(this.state === 'inactive') throw new Error('removeElement(): Tried to remove an element while the Canvas was inactive!')

    const elementToRemove = this.elements.find(element => element.element === el)
    if(!elementToRemove) throw new Error('removeElement(): Tried to remove an element that does not exist!')
    
    this.elements = this.elements.filter(element => element.element !== elementToRemove.element)
    Composite.remove(this.world!, this.getElementById(elementToRemove.body().id)!)
  }

  start() {
    if(!this.canvasElement) throw new Error('start() called without canvasElement!')
    if(this.state === 'active') throw new Error('start() called on active Canvas!')
    console.log('start')

    this.engine = Engine.create({ gravity: this.gravity })
    this.world = this.engine.world

    this.rerender()

    this.runner = Runner.create()
    Runner.run(this.runner, this.engine)
    this.updateRenderBounds()
    this.resizeObserver = new ResizeObserver(this.updateRenderBounds)
    this.resizeObserver.observe(this.canvasElement);
    this.state = 'active'
  }

  stop() {
    if(this.state !== 'active') throw new Error('stop() called on inactive Canvas!')

    console.log('stop')
    this.resizeObserver?.disconnect()
    if(this.animationFrame) {
      cancelAnimationFrame(this.animationFrame)
    }
    this.state = 'inactive'
    Engine.clear(this.engine!)
    Runner.stop(this.runner!)
  }
}

const CANVAS_KEY = Symbol('CANVAS')

export function setCanvasContext(init: CanvasInitializer) {
  return setContext(CANVAS_KEY, new Canvas(init))
}

export function getCanvasContext() {
  return getContext<Canvas>(CANVAS_KEY)
}