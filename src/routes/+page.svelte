<script lang="ts">
  import Matter from 'matter-js'
  import debounce from 'lodash.debounce'

  const { Engine, Render, Runner, Composites, MouseConstraint, Mouse, Composite, Bodies } = Matter
  
  let canvas: HTMLDivElement

  $effect(() => {
    const width = () => canvas.clientWidth
    const height = () => canvas.clientHeight

    const engine = Engine.create(),
          world = engine.world
 
    const render = Render.create({
      element: canvas,
      engine,
      options: {
        width: width(),
        height: height()
      }
    })

    Render.run(render)

    const runner = Runner.create()
    Runner.run(runner, engine)

    // add bodies
    var stack = Composites.stack(25, 20, 10, 5, 0, 0, function(x: number, y: number) {
      return Bodies.rectangle(x, y, 25, 25)
    });

    Composite.add(world, stack);

    const wallSize = 50
    const createWalls = () => ([
        Bodies.rectangle(width() / 2, wallSize / -2, width(), wallSize, { isStatic: true }),
        Bodies.rectangle(width() / 2, height() + (wallSize / 2), width(), wallSize, { isStatic: true }),
        Bodies.rectangle(width() + (wallSize / 2), height() / 2, wallSize, height(), { isStatic: true }),
        Bodies.rectangle(wallSize / -2, height() / 2, wallSize, height(), { isStatic: true })
    ])
    let walls = createWalls()
    Composite.add(world, walls);

    // add mouse control
    let mouse: Matter.Mouse
    let mouseConstraint: Matter.MouseConstraint

    // fit the render viewport to the scene
    Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: width(), y: height() }
    });

    const updateRenderBounds = debounce(() => {
      // https://github.com/liabru/matter-js/issues/955
      const w = width(),
            h = height()
      render.bounds.max.x = w;
      render.bounds.max.y = h;
      render.options.width = w;
      render.options.height = h;
      render.canvas.width = w;
      render.canvas.height = h;

      // Update dimensions of walls to match new render bounds
      if(walls) {
        for(const wall of walls) {
          Composite.remove(world, wall)
        }
      }
      walls = createWalls()
      Composite.add(world, walls)

      if(mouseConstraint) {
        Composite.remove(world, mouseConstraint)
      }
      mouse = Mouse.create(render.canvas)
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
      render.mouse = mouse
    }, 100)

    updateRenderBounds()
    // TODO: Change this to a resize observer on the actual element
    window.addEventListener('resize', updateRenderBounds)

    return () => {
      window.removeEventListener('resize', updateRenderBounds)
      Render.stop(render)
      Engine.clear(engine)
      render.canvas.remove()
      render.textures = {}
    }
  })
</script>

<div
  bind:this={canvas}
  class="canvas"
  style="width: 100%; height: 400px;">
</div>