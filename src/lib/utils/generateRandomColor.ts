export default function generateRandomColor() {
  function random(min: number, max: number) {
    return ((Math.random() * (max - min)) + min).toFixed(2)
  }
  return `hsl(${random(0, 360)} 75% ${random(25, 75)}%)`
}