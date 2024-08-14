<script lang="ts">
  import Matter from 'matter-js'
  import debounce from 'lodash.debounce'
  const { Engine, Render, Runner, Composites, MouseConstraint, Mouse, Composite, Bodies } = Matter
  
  interface Props {
    /** Width of the canvas */
    width: string
    /** Height of the canvas */
    height: string
    /** Whether the canvas has walls on all sides.
     * @default true
    */
    bounded?: boolean
    /** Whether the canvas can be interactive with using the mouse.
     * @default false
    */
    interactive?: boolean
    /** Gravity within the canvas
     * @default { x: 0, y: 1, scale: 0.001 }
    */
    gravity?: Partial<Matter.Gravity>
    children: () => any
  }

  const {
    width,
    height,
    bounded = true,
    interactive = false,
    gravity = { x: 0, y: 1, scale: 0.001 },
    children
  }: Props = $props()

  let canvas: HTMLDivElement

  $effect(() => {
    const width = () => canvas.clientWidth
    const height = () => canvas.clientHeight

    const engine = Engine.create({ gravity }),
          world = engine.world

    const runner = Runner.create()
    Runner.run(runner, engine)

    function createBodiesFromCanvas(canvas: HTMLElement) {
      const elements = Array.from(canvas.querySelectorAll('[data-shape]')) as HTMLElement[]
      return elements.map(el => {
        const shape = el.getAttribute('data-shape')

        const { x: elementX, y: elementY, width, height } = el.getBoundingClientRect()
        const { x: canvasX, y: canvasY } = canvas.getBoundingClientRect()
        const density = parseFloat(el.getAttribute('data-density')!),
              friction = parseFloat(el.getAttribute('data-friction')!),
              frictionAir = parseFloat(el.getAttribute('data-friction-air')!),
              isStatic = el.getAttribute('data-is-static')! === 'true',
              restitution = parseFloat(el.getAttribute('data-restitution')!),
              frictionStatic = parseFloat(el.getAttribute('data-friction-static')!),
              radius = parseFloat(el.getAttribute('data-radius')!)
        
        return {
          body: shape === 'rectangle' ? Bodies.rectangle(
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
          ),
          element: el,
          render() {
            const { clientWidth: width, clientHeight: height } = this.element
            const { angle, position: { x, y } } = this.body
            this.element.style.position = 'absolute'
            this.element.style.top = '0'
            this.element.style.left = '0'
            this.element.style.transform = `translate(${x - (width / 2)}px, ${y - (height / 2)}px) rotate(${angle}rad)`
          }
        }
      })
    }

    const bodies = createBodiesFromCanvas(canvas)
    Composite.add(world, bodies.map(b => b.body))

    const wallSize = 50
    const createWalls = () => ([
        Bodies.rectangle(width() / 2, wallSize / -2, width(), wallSize, { isStatic: true }),
        Bodies.rectangle(width() / 2, height() + (wallSize / 2), width(), wallSize, { isStatic: true }),
        Bodies.rectangle(width() + (wallSize / 2), height() / 2, wallSize, height(), { isStatic: true }),
        Bodies.rectangle(wallSize / -2, height() / 2, wallSize, height(), { isStatic: true })
    ])
    let walls: Matter.Body[]

    // add mouse control
    let mouse: Matter.Mouse
    let mouseConstraint: Matter.MouseConstraint

    const updateRenderBounds = debounce(() => {
      // Update dimensions of walls to match new render bounds
      if(bounded) {
        if(walls) {
          for(const wall of walls) {
            Composite.remove(world, wall)
          }
        }
        walls = createWalls()
        Composite.add(world, walls)
      }

      if(interactive) {
        if(mouseConstraint) {
          Composite.remove(world, mouseConstraint)
        }
        mouse = Mouse.create(canvas)
        mouseConstraint = MouseConstraint.create(engine, {
          mouse,
          constraint: {
            stiffness: 0.2,
            render: {
              visible: true
            }
          }
        });
        Composite.add(world, mouseConstraint)
      }
    }, 50)

    updateRenderBounds()
    // TODO: Change this to a resize observer on the actual element
    // window.addEventListener('resize', updateRenderBounds);
    const observer = new ResizeObserver(updateRenderBounds)
    observer.observe(canvas)

    let animationFrame: number

    (function rerender() {
      for(const body of bodies) {
        body.render()
      }
      Matter.Engine.update(engine);
      animationFrame = requestAnimationFrame(rerender);
    })();

    return () => {
      // window.removeEventListener('resize', updateRenderBounds)
      observer.disconnect()
      cancelAnimationFrame(animationFrame)
      Engine.clear(engine)
      Runner.stop(runner)
    }
  })
</script>

<div
  bind:this={canvas}
  class="canvas"
  style="width: {width}; height: {height};">
  {@render children()}
</div>

<style lang="scss">
  .canvas {
    overflow: hidden;
    position: relative;
  }
</style>