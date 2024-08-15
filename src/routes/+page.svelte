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
    size: number
  }

  interface RectangleOptions {
    density: number
    friction: number
    frictionAir: number
    frictionStatic: number
    restitution: number
    radius: number
    isStatic: boolean
    width: number
    height: number
  }

  const defaultCircleOptions: CircleOptions = {
    density: 0.001,
    friction: 0.1,
    frictionAir: 0.01,
    frictionStatic: 0.5,
    restitution: 0,
    isStatic: false,
    size: 64
  }

  const defaultRectangleOptions: RectangleOptions = {
    density: 0.001,
    friction: 0.1,
    frictionAir: 0.01,
    frictionStatic: 0.5,
    restitution: 0,
    radius: 0,
    isStatic: false,
    width: 128,
    height: 64
  }

  type Shape = (
    ({ type: 'circle' } & CircleOptions) | 
    ({ type: 'rectangle' } & RectangleOptions)
  ) & { id: number }

  let shapes = $state<Shape[]>([])
  let focusedShape = $state<number | null>(null)
  let addCircleOptions = $state(defaultCircleOptions)
  let addRectangleOptions = $state(defaultRectangleOptions)

  let id = 0

  function addCircle() {
    shapes.push({
      ...addCircleOptions,
      id: id++,
      type: 'circle'
    })
  }

  function addRectangle() {
    shapes.push({
      ...addRectangleOptions,
      id: id++,
      type: 'rectangle'
    })
  }

  function removeShape(id: number) {
    shapes = shapes.filter(r => r.id !== id)
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

  function toggleFocusedShape(id: number) {
    if(focusedShape === id) {
      focusedShape = null
    } else {
      focusedShape = id
    }
  }
</script>

<div class="main">
  <div class="tools">
    <div class="add">
      <h2 class="add__title">Add shapes</h2>
      <form class="add-form" onsubmit={addCircle}>
        <div class="input-group">
          <label for="circle-density">Density</label>
          <input
            required
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
            required
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
            required
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
            required
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
            required
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
        <div class="input-group">
          <label for="circle-size">Size</label>
          <input
            required
            type="number"
            step="1"
            max="192"
            min="8"
            id="circle-size"
            placeholder={`${defaultCircleOptions.size}`}
            value={addCircleOptions.size}
            onchange={e => updateCircleOptions('size', e.currentTarget.value)}
          >
        </div>
        <button type="submit">Add Circle</button>
      </form>
      <form class="add-form" onsubmit={addRectangle}>
        <div class="input-group">
          <label for="rect-density">Density</label>
          <input
            required
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
            required
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
            required
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
            required
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
            required
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
            required
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
        <div class="input-group">
          <label for="rectangle-width">Width</label>
          <input
            required
            type="number"
            step="1"
            max="192"
            min="8"
            id="rectangle-width"
            placeholder={`${defaultRectangleOptions.width}`}
            value={addRectangleOptions.width}
            onchange={e => updateRectangleOptions('width', e.currentTarget.value)}
          >
        </div>
        <div class="input-group">
          <label for="rectangle-height">Height</label>
          <input
            required
            type="number"
            step="1"
            max="192"
            min="8"
            id="rectangle-height"
            placeholder={`${defaultRectangleOptions.height}`}
            value={addRectangleOptions.height}
            onchange={e => updateRectangleOptions('height', e.currentTarget.value)}
          >
        </div>
        <button type="submit">Add Rectangle</button>
      </form>
    </div>
    <hr>
    <div class="shapes">
      <h2 class="shapes__title">Shapes</h2>
      <ul class="shapes__list">
        {#each shapes as shape}
          <li class="shape-item{focusedShape === shape.id ? ' shape-item--focused' : ''}">
            <button
              class="shape-item__name"
              onclick={() => toggleFocusedShape(shape.id)}>
              {shape.type} {shape.id}
            </button>
            <button
              class="shape-item__delete"
              onclick={() => removeShape(shape.id)}
            >
              Delete
            </button>
          </li>
        {/each}
      </ul>
    </div>
  </div>
  <Canvas
    width='100%'
    height='100%'
    gravity={{ scale: 0.0008 }}
    interactive
  >
    <div class="canvas-container">
      {#each shapes as s (s.id)}
        {#if s.type === 'circle'}
          <Circle
            class="shape circle"
            style="width: {s.size}px;"
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
  $gray-100: hsl(0 0% 8%);
  $gray-200: hsl(0 0% 12%);
  $gray-300: hsl(0 0% 16%);
  $gray-400: hsl(0 0% 26%);
  $gray-500: hsl(0 0% 35%);
  $gray-600: hsl(0 0% 42%);
  $gray-700: hsl(0 0% 57%);
  $gray-800: hsl(0 0% 70%);
  $gray-900: hsl(0 0% 82%);
  $gray-1000: hsl(0 0% 94%);

  $bg: $gray-100;
  $surface: $gray-300;
  $button: $gray-400;
  $button-hover: $gray-500;
  $button-active: $gray-600;
  $label: $gray-700;
  $input: $gray-200;
  $focus: $gray-100;
  $border: $gray-400;
  $negative: hsl(350.92 100% 76.67%);

  :global(*, *::before, *::after) {
    box-sizing: border-box;
  }

  :global(body) {
    margin: 0;
    background-color: $bg;
    font-family: Helvetica, sans-serif, system-ui;
    color-scheme: dark;
    color: $gray-900;
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
    scrollbar-width: thin;

    button[type="submit"] {
      background: $button;
      color: inherit;
      border: none;
      height: 32px;
      margin-top: 8px;
      font: inherit;
      font-size: 0.875rem;
      cursor: pointer;
      transition: background 0.15s cubic-bezier(0.215, 0.610, 0.355, 1);

      &:hover {
        background: $button-hover;
      }

      &:active {
        background: $button-active;
      }
    }

    hr {
      width: 100%;
      border: none;
      border-top: 1px solid $border;
    }
  }

  .add {
    display: flex;
    flex-direction: column;
    gap: 8px;

    &__title {
      font-size: 1.125rem;
      margin: 0;
    }
  }

  .add-form {
    display: flex;
    flex-direction: column;

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
        font-size: 0.875rem;
        width: 100px;
      }

      input {
        background: none;
        border: none;
        outline: none;
        color: inherit;
        padding-right: 8px;
        height: 100%;
        font: inherit;
        font-size: 0.875rem;
      }

      button[role="switch"] {
        height: 100%;
        background: none;
        border: none;
        font: inherit;
        font-size: 0.875rem;
        cursor: pointer;
        color: inherit;
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

  .shapes {
    display: flex;
    flex-direction: column;
    gap: 8px;

    &__title {
      font-size: 1.125rem;
      margin: 0;
    }

    &__list {
      background-color: $input;
      margin: 0;
      padding: 0;
      height: 400px;
      overflow: auto;
      scrollbar-width: thin;

      .shape-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 0;
        height: 32px;
        font-size: 0.875rem;

        &:hover {
          background-color: $focus;
        }

        &--focused {
          background-color: $focus;

          .shape-item__name {
            text-decoration: underline;
          }
        }

        &__name,
        &__delete {
          background: none;
          border: none;
          height: 100%;
          cursor: pointer;
          font: inherit;
          font-size: 0.875rem;
        }

        &__name {
          padding-left: 8px;
          color: inherit;
        }

        &__delete {
          padding-inline: 8px;
          color: $negative;

          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }

  .canvas-container {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  :global(.shape) {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-family: sans-serif;
    position: relative;
    pointer-events: none;

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

  .focus-ring {
    position: absolute;
    inset: 0;
    z-index: 1;
    outline: 2px solid $gray-900;
    outline-offset: 3px;
    border-radius: inherit;
  }
</style>