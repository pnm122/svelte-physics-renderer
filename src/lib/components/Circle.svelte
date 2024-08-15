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
    randomBackground = false
  }: Props = $props()

  let element: HTMLElement
  let mounted = false
  const canvas = getCanvasContext()

  $effect(() => {
    // stop this shit from being a dependency of the $effect
    // surely there's a better way to have the equivalent of onMount and onDestroy???
    setTimeout(() => {
      if(!mounted && canvas.state === 'active') {
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
  style="{style} {randomBackground ? `background-color: ${generateRandomColor()}` : ''}">
  {#if children}
    {@render children()}
  {/if}
</div>

<style lang="scss">
  .circle {
    aspect-ratio: 1;
    border-radius: 999px;
  }
</style>