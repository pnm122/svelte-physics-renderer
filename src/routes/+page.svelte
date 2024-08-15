<script lang="ts">
	import Canvas from "$lib/components/Canvas.svelte";
	import Circle from "$lib/components/Circle.svelte";
	import Rectangle from "$lib/components/Rectangle.svelte";

  interface CircleOptions {
    density: number
    friction: number
    frictionAir: number
    frictionStatic: number
    restitution: number
    isStatic: boolean
  }

  interface RectangleOptions {
    density: number
    friction: number
    frictionAir: number
    frictionStatic: number
    restitution: number
    radius: number
    isStatic: boolean
  }

  const defaultCircleOptions: CircleOptions = {
    density: 0.001,
    friction: 0.1,
    frictionAir: 0.01,
    frictionStatic: 0.5,
    restitution: 0,
    isStatic: false
  }

  const defaultRectangleOptions: RectangleOptions = {
    density: 0.001,
    friction: 0.1,
    frictionAir: 0.01,
    frictionStatic: 0.5,
    restitution: 0,
    radius: 0,
    isStatic: false
  }

  let circles = $state<(CircleOptions & { id: number })[]>([])
  let rectangles = $state<(RectangleOptions & { id: number })[]>([])
  let addCircleOptions = $state(defaultCircleOptions)
  let addRectangleOptions = $state(defaultRectangleOptions)

  let id = 0

  function addCircle() {
    circles.push({
      ...addCircleOptions,
      id: id++
    })
  }

  function removeCircle(id: number) {
    circles = circles.filter(c => c.id !== id)
  }

  function addRectangle() {
    rectangles.push({
      ...addRectangleOptions,
      id: id++
    })
  }

  function removeRectangle(id: number) {
    rectangles = rectangles.filter(r => r.id !== id)
  }

  function updateCircleOptions(option: keyof CircleOptions, value: any) {
    addCircleOptions = {
      ...addCircleOptions,
      [option]: value
    }
  }

  function updateRectangleOptions(option: keyof RectangleOptions, value: any) {
    addRectangleOptions = {
      ...addRectangleOptions,
      [option]: value
    }
  }
</script>

<div class="main">
  <div class="tools">
    <form class="add-form" onsubmit={addCircle}>
      <div class="input-group">
        <label for="circle-density">Density</label>
        <input
          type="number"
          step="0.0001"
          id="circle-density"
          placeholder={`${defaultCircleOptions.density}`}
          value={addCircleOptions.density}
          onchange={e => updateCircleOptions('density', e.currentTarget.value)}
        >
      </div>
      <div class="input-group">
        <label for="circle-friction">Friction</label>
        <input
          type="number"
          step="0.01"
          id="circle-friction"
          placeholder={`${defaultCircleOptions.friction}`}
          value={addCircleOptions.friction}
          onchange={e => updateCircleOptions('friction', e.currentTarget.value)}
        >
      </div>
      <div class="input-group">
        <label for="circle-air-friction">Air Friction</label>
        <input
          type="number"
          step="0.001"
          id="circle-air-friction"
          placeholder={`${defaultCircleOptions.frictionAir}`}
          value={addCircleOptions.frictionAir}
          onchange={e => updateCircleOptions('frictionAir', e.currentTarget.value)}
        >
      </div>
      <div class="input-group">
        <label for="circle-static-friction">Static Friction</label>
        <input
          type="number"
          step="0.01"
          id="circle-static-friction"
          placeholder={`${defaultCircleOptions.frictionStatic}`}
          value={addCircleOptions.frictionStatic}
          onchange={e => updateCircleOptions('frictionStatic', e.currentTarget.value)}
        >
      </div>
      <div class="input-group">
        <label for="circle-restitution">Restitution</label>
        <input
          type="number"
          step="0.01"
          id="circle-restitution"
          placeholder={`${defaultCircleOptions.restitution}`}
          value={addCircleOptions.restitution}
          onchange={e => updateCircleOptions('restitution', e.currentTarget.value)}
        >
      </div>
      <div class="input-group">
        <label for="circle-restitution">Is Static</label>
        <button
          type="button"
          role="switch"
          aria-checked={addCircleOptions.isStatic}
          onclick={() => updateCircleOptions('isStatic', !addCircleOptions.isStatic)}
        >
          <span class={addCircleOptions.isStatic ? '' : 'active'}>false</span>
          <span class={addCircleOptions.isStatic ? 'active' : ''}>true</span>
        </button>
      </div>
      <button type="submit">Add Circle</button>
    </form>
    <form class="add-form" onsubmit={addRectangle}>
      <div class="input-group">
        <label for="rect-density">Density</label>
        <input
          type="number"
          step="0.0001"
          id="rect-density"
          placeholder={`${defaultRectangleOptions.density}`}
          value={addRectangleOptions.density}
          onchange={e => updateRectangleOptions('density', e.currentTarget.value)}
        >
      </div>
      <div class="input-group">
        <label for="rect-friction">Friction</label>
        <input
          type="number"
          step="0.01"
          id="rect-friction"
          placeholder={`${defaultRectangleOptions.friction}`}
          value={addRectangleOptions.friction}
          onchange={e => updateRectangleOptions('friction', e.currentTarget.value)}
        >
      </div>
      <div class="input-group">
        <label for="rect-air-friction">Air Friction</label>
        <input
          type="number"
          step="0.001"
          id="rect-air-friction"
          placeholder={`${defaultRectangleOptions.frictionAir}`}
          value={addRectangleOptions.frictionAir}
          onchange={e => updateRectangleOptions('frictionAir', e.currentTarget.value)}
        >
      </div>
      <div class="input-group">
        <label for="rect-static-friction">Static Friction</label>
        <input
          type="number"
          step="0.01"
          id="rect-static-friction"
          placeholder={`${defaultRectangleOptions.frictionStatic}`}
          value={addRectangleOptions.frictionStatic}
          onchange={e => updateRectangleOptions('frictionStatic', e.currentTarget.value)}
        >
      </div>
      <div class="input-group">
        <label for="rect-restitution">Restitution</label>
        <input
          type="number"
          step="0.01"
          id="rect-restitution"
          placeholder={`${defaultRectangleOptions.restitution}`}
          value={addRectangleOptions.restitution}
          onchange={e => updateRectangleOptions('restitution', e.currentTarget.value)}
        >
      </div>
      <div class="input-group">
        <label for="rect-radius">Radius</label>
        <input
          type="number"
          step="0.01"
          id="rect-radius"
          placeholder={`${defaultRectangleOptions.radius}`}
          value={addRectangleOptions.radius}
          onchange={e => updateRectangleOptions('radius', e.currentTarget.value)}
        >
      </div>
      <div class="input-group">
        <label for="rect-restitution">Is Static</label>
        <button
          type="button"
          role="switch"
          aria-checked={addRectangleOptions.isStatic}
          onclick={() => updateRectangleOptions('isStatic', !addRectangleOptions.isStatic)}
        >
          <span class={addRectangleOptions.isStatic ? '' : 'active'}>false</span>
          <span class={addRectangleOptions.isStatic ? 'active' : ''}>true</span>
        </button>
      </div>
      <button type="submit">Add Rectangle</button>
    </form>
  </div>
  <Canvas
    width='100%'
    height='100%'
    gravity={{ scale: 0.0008 }}
    interactive
  >
    <div class="canvas-container">
      {#each circles as c (c.id)}
        <Circle
          class="shape circle"
          density={c.density}
          friction={c.friction}
          frictionAir={c.frictionAir}
          frictionStatic={c.frictionStatic}
          restitution={c.restitution}
          isStatic={c.isStatic}
          randomBackground>
        </Circle>
      {/each}
      {#each rectangles as r (r.id)}
        <Rectangle
          class="shape rectangle"
          density={r.density}
          friction={r.friction}
          frictionAir={r.frictionAir}
          frictionStatic={r.frictionStatic}
          restitution={r.restitution}
          radius={r.radius}
          isStatic={r.isStatic}
          randomBackground>
        </Rectangle>
      {/each}
    </div>
  </Canvas>
</div>

<style lang="scss">
  $bg: hsl(0 0% 8.63%);
  $surface: hsl(0 0% 16.08%);
  $button: hsl(0 0% 26.27%);
  $button-hover: hsl(0 0% 35.29%);
  $button-active: hsl(0 0% 40%);
  $label: hsl(0 0% 57%);
  $input: hsl(0 0% 12%);
  $focus: hsl(0 0% 8%);

  *, *::before, *::after {
    box-sizing: border-box;
  }

  :global(body) {
    margin: 0;
    background-color: $bg;
    font-family: Helvetica, sans-serif, system-ui;
  }

  .main {
    display: grid;
    grid-template-columns: 250px auto;
    width: 100%;
    height: 100vh;
    max-height: -webkit-fill-available;
  }

  .tools {
    background: $surface;
    height: 100%;
    overflow: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;

    button:not([role="switch"]) {
      background: $button;
      color: white;
      border: none;
      height: 32px;
      font: inherit;
      font-size: 14px;
      cursor: pointer;
      transition: background 0.15s cubic-bezier(0.215, 0.610, 0.355, 1);

      &:hover {
        background: $button-hover;
      }

      &:active {
        background: $button-active;
      }
    }
  }

  .add-form {
    display: flex;
    flex-direction: column;
    gap: 4px;

    .input-group {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      align-items: center;
      background: $input;
      height: 32px;
      padding-left: 8px;

      &:focus-within {
        background-color: $focus;
      }

      label {
        color: $label;
        font-size: 14px;
        width: 100px;
      }

      input {
        background: none;
        border: none;
        outline: none;
        color: white;
        padding-right: 8px;
        height: 100%;
        font: inherit;
      }

      button[role="switch"] {
        height: 100%;
        background: none;
        border: none;
        font: inherit;
        cursor: pointer;
        color: white;
        padding: 0;
        display: flex;
        align-items: center;

        span {
          flex: 1;
          height: 100%;
          line-height: 32px;
          color: $label;
          
          &.active {
            background-color: $button;
            color: white;
          }
        }
      }
    }
  }

  .canvas-container {
    display: flex;
    flex-wrap: wrap;
  }

  :global(.shape) {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 12px;
    font-family: sans-serif;

    button {
      display: grid;
      place-items: center;
      width: 75%;
      height: 75%;
      outline: none;
      border: none;
      background-color: white;

      &:hover {
        background-color: #FF9C9C;
      }
    }
  }

  :global(.circle) {
    width: 64px;

    button {
      border-radius: 999px;
    }
  }

  :global(.rectangle) {
    width: 128px;
    height: 64px;
  }
</style>