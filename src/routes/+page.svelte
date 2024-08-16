<script lang="ts">
	import Canvas from "$lib/components/Canvas.svelte";
	import Circle from "$lib/components/Circle.svelte";
	import Rectangle from "$lib/components/Rectangle.svelte";
	import Sidebar from "./components/Sidebar.svelte";
	import type { CircleOptions, RectangleOptions, Shape } from "$lib/types/Shapes";

  let shapes = $state<Shape[]>([])
  let focusedShape = $state<number | null>(null)
  let canvas = $state<Canvas>()

  let id = 0
  let mounted = false

  $effect(() => {
    if(!mounted) {
      canvas!.context.start()
      mounted = true
    }
  })

  function addCircle(options: CircleOptions) {
    shapes.push({
      ...options,
      id: id++,
      type: 'circle'
    })
  }

  function addRectangle(options: RectangleOptions) {
    shapes.push({
      ...options,
      id: id++,
      type: 'rectangle'
    })
  }

  function removeShape(id: number) {
    shapes = shapes.filter(r => r.id !== id)
  }

  function toggleFocusedShape(id: number) {
    if(focusedShape === id) {
      focusedShape = null
    } else {
      focusedShape = id
    }
  }
</script>

<div class="main">
  <Sidebar
    {addCircle}
    {addRectangle}
    {removeShape}
    {toggleFocusedShape}
    {shapes}
    {focusedShape}
    {canvas}
  />
  <Canvas
    width='100%'
    height='100%'
    gravity={{ scale: 0.0005 }}
    interactive
    bind:this={canvas}
  >
    <div class="canvas-container">
      {#each shapes as s (s.id)}
        {#if s.type === 'circle'}
          <Circle
            class="shape circle"
            size={s.size}
            density={s.density}
            friction={s.friction}
            frictionAir={s.frictionAir}
            frictionStatic={s.frictionStatic}
            restitution={s.restitution}
            isStatic={s.isStatic}
            randomBackground>
            {#if focusedShape === s.id}
              <div class="focus-ring"></div>
            {/if}
          </Circle>
        {:else}
          <Rectangle
            class="shape rectangle"
            style="width: {s.width}px; height: {s.height}px;"
            density={s.density}
            friction={s.friction}
            frictionAir={s.frictionAir}
            frictionStatic={s.frictionStatic}
            restitution={s.restitution}
            radius={s.radius}
            isStatic={s.isStatic}
            randomBackground>
            {#if focusedShape === s.id}
              <div class="focus-ring"></div>
            {/if}
          </Rectangle>
        {/if}
      {/each}
    </div>
  </Canvas>
</div>

<style lang="scss">
  @import '$routes/scss/variables';

  .main {
    display: grid;
    grid-template-columns: 250px auto;
    width: 100%;
    height: 100vh;
    max-height: -webkit-fill-available;
  }

  .canvas-container {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
  }

  :global(.shape) {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-family: sans-serif;
    position: relative;
    pointer-events: none;
  }

  .focus-ring {
    position: absolute;
    inset: 0;
    z-index: 1;
    outline: 2px solid $gray-900;
    outline-offset: 3px;
    border-radius: inherit;
  }
</style>