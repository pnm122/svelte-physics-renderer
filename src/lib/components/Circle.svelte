<script lang="ts">
	import { getCanvasContext } from "$lib/context/canvasContext.svelte";
	import generateRandomColor from "$lib/utils/generateRandomColor";

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
    /** Size of the circle in pixels */
    size?: number
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
    randomBackground = false,
    size
  }: Props = $props()

  let element: HTMLElement
  let mounted = false
  const canvas = getCanvasContext()

  $effect(() => {
    // stop this shit from being a dependency of the $effect
    // surely there's a better way to have the equivalent of onMount and onDestroy???
    setTimeout(() => {
      if(!mounted) {
        canvas.addElement(element)
        mounted = true
      }
    })

    return () => {
      if(mounted) canvas.removeElement(element)
    }
  })
</script>

<div
  bind:this={element}
  data-shape="circle"
  data-density={density}
  data-friction={friction}
  data-friction-air={frictionAir}
  data-is-static={isStatic}
  data-restitution={restitution}
  data-friction-static={frictionStatic}
  class="circle {classname}"
  style="{randomBackground ? `background-color: ${generateRandomColor()};` : ''}{size ? ` width: ${size}px; ` : ''}{style}">
  {#if children}
    {@render children()}
  {/if}
</div>

<style>
  .circle {
    aspect-ratio: 1;
    border-radius: 999px;
  }
</style>