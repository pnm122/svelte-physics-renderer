<script lang="ts">
  interface Props {
    class?: string
    children: () => any
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
  }

  const {
    class: classname,
    children,
    density = 0.001,
    friction = 0.1,
    frictionAir = 0.01,
    isStatic = false,
    restitution = 0,
    frictionStatic = 0.5
  }: Props = $props()
</script>

<div
  data-rectangle
  data-density={density}
  data-friction={friction}
  data-friction-air={frictionAir}
  data-is-static={isStatic}
  data-restitution={restitution}
  data-friction-static={frictionStatic}
  class="rectangle {classname}">
  {@render children()}
</div>

<style lang="scss">
  .rectangle {
    width: fit-content;
  }
</style>