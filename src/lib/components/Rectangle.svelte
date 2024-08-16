<script lang="ts">
	import { getCanvasContext, type CanvasElement } from '$lib/context/canvasContext.svelte'
	import generateRandomColor from '$lib/utils/generateRandomColor'

	interface Props {
		class?: string
		style?: string
		children?: () => any
		/** @default 0.001 */
		density?: number
		/** @default 0.1 */
		friction?: number
		/** @default 0.01 */
		frictionAir?: number
		/** @default false */
		isStatic?: boolean
		/** @default 0 */
		restitution?: number
		/** @default 0.5 */
		frictionStatic?: number
		/** @default 0 */
		radius?: number
		/** Whether to generate a random background
		 * @default false
		 */
		randomBackground?: boolean
	}

	const {
		class: classname,
		style,
		children,
		density = 0.001,
		friction = 0.1,
		frictionAir = 0.01,
		isStatic = false,
		restitution = 0,
		frictionStatic = 0.5,
		radius = 0,
		randomBackground = false
	}: Props = $props()

	let element: HTMLElement
	let mounted = false
  let canvasElement = $state<CanvasElement | null>(null)
  let canvasElementPromise: Promise<CanvasElement | null>
	const canvas = getCanvasContext()

	$effect(() => {
		// stop this shit from being a dependency of the $effect
		// surely there's a better way to have the equivalent of onMount and onDestroy???
		setTimeout(async () => {
			if (!mounted) {
				mounted = true
				canvas.addElement(element)
			}
		})

		return () => {
			if (mounted) canvas.removeElement(element)
		}
	})

  $effect(() => {
    if(canvas.state === 'stopped') {
      canvasElement = null
    } else if(canvas.state === 'running') {
      updateCanvasElement()
    }
  })

  async function updateCanvasElement() {
    canvasElement = await canvas.getElement(element)
  }

  export async function applyForce(force: { x: number, y: number }) {
    if(canvasElementPromise) await canvasElementPromise
    if(canvasElement) {
      canvasElement.body().force = force
    }
  }

  export async function getBody() {
    if(canvasElementPromise) await canvasElementPromise
    if(canvasElement) {
      return canvasElement.body()
    }
  }
</script>

<div
	bind:this={element}
	data-shape="rectangle"
	data-density={density}
	data-friction={friction}
	data-friction-air={frictionAir}
	data-is-static={isStatic}
	data-restitution={restitution}
	data-friction-static={frictionStatic}
	data-radius={radius}
	class="rectangle {classname}"
	style="--radius: {radius}px; {style} {randomBackground
		? `background-color: ${generateRandomColor()};`
		: ''}"
>
	{#if children}
		{@render children()}
	{/if}
</div>

<style>
	.rectangle {
		border-radius: var(--radius);
	}
</style>
