<script lang="ts">
  import Matter from 'matter-js'
  import debounce from 'lodash.debounce'
  const { Engine, Render, Runner, Composites, MouseConstraint, Mouse, Composite, Bodies } = Matter
  
  interface Props {
    /** Width of the canvas */
    width: string
    /** Height of the canvas */
    height: string
    /** Whether the canvas has walls on all sides. Defaults to true. */
    bounded?: boolean
    /** Whether the canvas can be interactive with using the mouse. Defaults to false. */
    interactive?: boolean
    children: () => any
  }

  const {
    width,
    height,
    bounded = true,
    interactive = false,
    children
  }: Props = $props()

  let canvas: HTMLDivElement

  $effect(() => {
    const width = () => canvas.clientWidth
    const height = () => canvas.clientHeight

    const engine = Engine.create(),
          world = engine.world
 
    // const render = Render.create({
    //   element: canvas,
    //   engine,
    //   options: {
    //     width: width(),
    //     height: height()
    //   }
    // })

    // Render.run(render)

    const runner = Runner.create()
    Runner.run(runner, engine)

    // add bodies
    // const stack = Composites.stack(25, 20, 10, 5, 0, 0, function(x: number, y: number) {
    //   return Bodies.rectangle(x, y, 25, 25)
    // });
    // Composite.add(world, stack);

    function createBodiesFromHTML(elements: HTMLElement[]) {
      return elements.map(el => {
        const { x: elementX, y: elementY, width, height } = el.getBoundingClientRect()
        const { x: canvasX, y: canvasY } = canvas.getBoundingClientRect()
        console.log(elementX, elementY, canvasX, canvasY)

        return {
          body: Bodies.rectangle(
            (elementX - canvasX) + (width / 2),
            (elementY - canvasY) + (height / 2),
            width,
            height
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

    const bodies = createBodiesFromHTML(Array.from(canvas.querySelectorAll('.element')) as HTMLElement[])
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

    // fit the render viewport to the scene
    // Render.lookAt(render, {
    //     min: { x: 0, y: 0 },
    //     max: { x: width(), y: height() }
    // });

    const updateRenderBounds = debounce(() => {
      // https://github.com/liabru/matter-js/issues/955
      // const w = width(),
      //       h = height()
      // render.bounds.max.x = w;
      // render.bounds.max.y = h;
      // render.options.width = w;
      // render.options.height = h;
      // render.canvas.width = w;
      // render.canvas.height = h;

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
        // keep the mouse in sync with rendering
        // render.mouse = mouse
      }
    }, 100)

    updateRenderBounds()
    // TODO: Change this to a resize observer on the actual element
    window.addEventListener('resize', updateRenderBounds);

    let animationFrame: number

    (function rerender() {
      for(const body of bodies) {
        body.render()
      }
      Matter.Engine.update(engine);
      animationFrame = requestAnimationFrame(rerender);
    })();

    return () => {
      window.removeEventListener('resize', updateRenderBounds)
      cancelAnimationFrame(animationFrame)
      // Render.stop(render)
      Engine.clear(engine)
      // render.canvas.remove()
      // render.textures = {}
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