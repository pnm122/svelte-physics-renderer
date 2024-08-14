<script lang="ts">
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
</script>

<div
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
    overflow: hidden;
    border-radius: 999px;
  }
</style>