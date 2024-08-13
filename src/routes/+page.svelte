<script>
	import Canvas from "$lib/components/Canvas.svelte";

</script>
<Canvas
  width='100%'
  height='500px'
  interactive
>
  <div class="container">
    <div class="element">Hello</div>
    <div class="element">World</div>
  </div>
</Canvas>

<style lang="scss">
  .container {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .element {
    width: 120px;
    height: 40px;
    background-color: #e8a0f1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: sans-serif;
  }
</style>