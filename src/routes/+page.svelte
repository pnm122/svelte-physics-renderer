<script lang="ts">
	import Canvas from "$lib/components/Canvas.svelte";
	import Circle from "$lib/components/Circle.svelte";
	import Rectangle from "$lib/components/Rectangle.svelte";

  let circles = $state<number[]>([])
  let rectangles = $state<number[]>([])

  let id = 0

  function addCircle() {
    circles.push(id++)
  }

  function removeCircle(value: number) {
    circles = circles.filter(c => c !== value)
  }

  function addRectangle() {
    rectangles.push(id++)
  }

  function removeRectangle(value: number) {
    rectangles = rectangles.filter(c => c !== value)
  }
</script>
<Canvas
  width='100%'
  height='100vh'
  gravity={{ scale: 0.0008 }}
  interactive
>
  <button onclick={addCircle}>Add Circle</button>
  <button onclick={addRectangle}>Add Rectangle</button>
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
    {#each circles as value (value)}
      <Circle
        class="shape circle"
        density={0.0000001}
        restitution={0.8}
        randomBackground>
        <button onclick={() => removeCircle(value)}>
          {value}
        </button>
      </Circle>
    {/each}
    {#each rectangles as value (value)}
      <Rectangle
        class="shape rectangle"
        density={0.0000001}
        restitution={0.8}
        radius={12}
        randomBackground>
        <button onclick={() => removeRectangle(value)}>
          {value}
        </button>
      </Rectangle>
    {/each}

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

  :global(.shape) {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 12px;
    font-family: sans-serif;

    button {
      display: grid;
      place-items: center;
      width: 75%;
      height: 75%;
      outline: none;
      border: none;
      background-color: white;

      &:hover {
        background-color: #FF9C9C;
      }
    }
  }

  :global(.circle) {
    width: 64px;

    button {
      border-radius: 999px;
    }
  }

  :global(.rectangle) {
    width: 128px;
    height: 64px;
  }
</style>