<script lang="ts">
	import Canvas from '$lib/components/Canvas.svelte'
	import Circle from '$lib/components/Circle.svelte'
	import Rectangle from '$lib/components/Rectangle.svelte'
	import Sidebar from './components/Sidebar.svelte'
	import type { CircleOptions, RectangleOptions, Shape } from '$lib/types/Shapes'

	let shapes = $state<{ shape: Shape; element?: Circle | Rectangle }[]>([])
	let focusedShape = $state<number | null>(null)
	let canvas = $state<Canvas>()

	let id = 0
	let mounted = false

	$effect(() => {
		if (!mounted) {
			canvas!.context.start()
			mounted = true
		}
	})

  $effect(() => {
    return () => {
      canvas!.context.stop()
    }
  })

	function addCircle(options: CircleOptions) {
		shapes.push({
			shape: {
				...options,
				id: id++,
				type: 'circle'
			}
		})
	}

	function addRectangle(options: RectangleOptions) {
		shapes.push({
			shape: {
				...options,
				id: id++,
				type: 'rectangle'
			}
		})
	}

	function removeShape(id: number) {
		shapes = shapes.filter((r) => r.shape.id !== id)
	}

	function toggleFocusedShape(id: number) {
		if (focusedShape === id) {
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
	<Canvas width="100%" height="100%" gravity={{ scale: 0.0005 }} interactive bind:this={canvas}>
		<div class="test">
      <Rectangle class="test-box">
        Test box
      </Rectangle>
      <Rectangle class="test-box">
        Test box 2
      </Rectangle>
      <Rectangle class="test-box">
        Test box 3
      </Rectangle>
    </div>
    <div class="canvas-container">
			{#each shapes as s (s.shape.id)}
				{#if s.shape.type === 'circle'}
					<Circle
						bind:this={s.element}
						class="shape circle"
						size={s.shape.size}
						density={s.shape.density}
						friction={s.shape.friction}
						frictionAir={s.shape.frictionAir}
						frictionStatic={s.shape.frictionStatic}
						restitution={s.shape.restitution}
						isStatic={s.shape.isStatic}
						randomBackground
					>
						{#if focusedShape === s.shape.id}
							<div class="focus-ring"></div>
						{/if}
					</Circle>
				{:else}
					<Rectangle
						bind:this={s.element}
						class="shape rectangle"
						style="width: {s.shape.width}px; height: {s.shape.height}px;"
						density={s.shape.density}
						friction={s.shape.friction}
						frictionAir={s.shape.frictionAir}
						frictionStatic={s.shape.frictionStatic}
						restitution={s.shape.restitution}
						radius={s.shape.radius}
						isStatic={s.shape.isStatic}
						randomBackground
					>
						{#if focusedShape === s.shape.id}
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

  .test {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

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
