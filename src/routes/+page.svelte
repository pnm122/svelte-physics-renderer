<script>
	import Canvas from "$lib/components/Canvas.svelte";
	import Circle from "$lib/components/Circle.svelte";
	import Rectangle from "$lib/components/Rectangle.svelte";

</script>
<Canvas
  width='100%'
  height='100vh'
  gravity={{ scale: 0.0008 }}
  interactive
>
  <div class="container">
    <!-- <Rectangle
      radius={10}
      style="width: 100px; height: 50px;"
      density={0.0001}
      restitution={0.5}
      randomBackground>
    </Rectangle>
    <Circle
      style="width: 100px;"
      density={0.0001}
      restitution={0.8}
      randomBackground>
    </Circle> -->
    {#each new Array(24) as _}
      <Circle
        class="ball"
        density={0.0000001}
        restitution={0.8}
        randomBackground>
        Hello world!
      </Circle>
    {/each}
    <Rectangle density={0.01} style="width: 150px; height: 150px; position: absolute; left: 50%; bottom: 0;" randomBackground>
      
    </Rectangle>
  </div>
</Canvas>

<style lang="scss">
  :global(body) {
    margin: 0;
    background-color: black;
  }

  .container {
    display: flex;
    flex-wrap: wrap;
  }

  :global(.ball) {
    width: 64px;
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 12px;
  }
</style>