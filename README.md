# svelte-physics-renderer

A simple HTML-based physics renderer for Svelte, using MatterJS under the hood.

## Example Usage

```html
<script lang="ts">
  let canvas = $state<Canvas>();

  let id = 0;
  let mounted = false;

  $effect(() => {
    if(!mounted) {
      canvas!.context.start()
      mounted = true
    }
  });
</script>

<Canvas
  width='600px'
  height='400px'
  gravity={{ scale: 0.0005 }}
  interactive
  bind:this={canvas}
>
  <Circle
    size={64}
    friction={0.001}
    restitution={0.8}
    randomBackground>
    <!-- put any HTML you want here! -->
    <span>Hello world!</span>
  </Circle>
  <Rectangle
    style="width: 192px; height: 64px;"
    friction={0.001}
    restitution={0.8}
    randomBackground>
    <!-- put any HTML you want here! -->
    <span>I'm a rectangle!</span>
  </Rectangle>
</Canvas>
```
