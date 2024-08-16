<script lang="ts">
	import Matter from 'matter-js'
	import debounce from 'lodash.debounce'
	import { setCanvasContext } from '$lib/context/canvasContext.svelte'

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
		children?: () => any
	}

	const {
		width,
		height,
		bounded = true,
		interactive = false,
		gravity = { x: 0, y: 1, scale: 0.001 },
		children
	}: Props = $props()

	let canvas = $state<HTMLDivElement | null>(null)
	const ctx = setCanvasContext({ element: canvas, bounded, interactive, gravity })

	$effect(() => {
		if (canvas) {
			ctx.canvasElement = canvas
		}
		return () => {
			if (ctx.state === 'running') ctx.stop()
		}
	})

	export { ctx as context }
</script>

<div bind:this={canvas} class="canvas" style="width: {width}; height: {height};">
	{#if children}
		{@render children()}
	{/if}
</div>

<style>
	.canvas {
		overflow: hidden;
		position: relative;
	}
</style>
