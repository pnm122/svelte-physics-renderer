<script lang="ts">
	import type { RectangleOptions, CircleOptions, Shape } from '$lib/types/Shapes'
	import Canvas from '../../lib/components/Canvas.svelte'
	import MaterialSymbolsPlayArrow from '~icons/material-symbols/play-arrow'
	import IcBaselinePause from '~icons/ic/baseline-pause'
	import IcBaselineStop from '~icons/ic/baseline-stop'
	import IcBaselineRefresh from '~icons/ic/baseline-refresh'
	import IcBaselinePlus from '~icons/ic/baseline-plus'
	import IcBaselineCircle from '~icons/ic/baseline-circle'
	import IcBaselineRectangle from '~icons/ic/baseline-rectangle'
	import IcBaselineArrowRight from '~icons/ic/baseline-arrow-right'
	import Circle from '$lib/components/Circle.svelte'
	import Rectangle from '$lib/components/Rectangle.svelte'

	interface Props {
		addCircle: (c: CircleOptions) => void
		addRectangle: (r: RectangleOptions) => void
		removeShape: (id: number) => void
		toggleFocusedShape: (id: number) => void
		shapes: { shape: Shape; element?: Circle | Rectangle }[]
		focusedShape: number | null
		canvas: Canvas | undefined
	}

	const {
		addCircle,
		addRectangle,
		removeShape,
		toggleFocusedShape,
		shapes,
		focusedShape,
		canvas
	}: Props = $props()

	const defaultCircleOptions: CircleOptions = {
		density: 0.001,
		friction: 0.1,
		frictionAir: 0.01,
		frictionStatic: 0.5,
		restitution: 0,
		isStatic: false,
		size: 64
	}

	const defaultRectangleOptions: RectangleOptions = {
		density: 0.001,
		friction: 0.1,
		frictionAir: 0.01,
		frictionStatic: 0.5,
		restitution: 0,
		radius: 0,
		isStatic: false,
		width: 128,
		height: 64
	}

	let addCircleOptions = $state(defaultCircleOptions)
	let addRectangleOptions = $state(defaultRectangleOptions)

	function updateCircleOptions(option: keyof CircleOptions, value: any) {
		addCircleOptions = {
			...addCircleOptions,
			[option]: value
		}
	}

	function updateRectangleOptions(option: keyof RectangleOptions, value: any) {
		addRectangleOptions = {
			...addRectangleOptions,
			[option]: value
		}
	}

	function handleAddCircle(e: SubmitEvent) {
		e.preventDefault()
		addCircle(addCircleOptions)
	}

	function handleAddRectangle(e: SubmitEvent) {
		e.preventDefault()
		addRectangle(addRectangleOptions)
	}

  function applyForce(e: SubmitEvent, element?: Circle | Rectangle) {
    e.preventDefault()
    const { 'force-x': forceX, 'force-y': forceY } = Object.fromEntries(new FormData(e.target as HTMLFormElement))
    element?.applyForce({ x: parseFloat(forceX.toString()), y: parseFloat(forceY.toString()) })
  }
</script>

<div class="tools">
	{#if canvas}
		<div class="canvas">
			<div class="canvas__title-group">
				<h2 class="canvas__title">Canvas</h2>
				<div
					class="chip {canvas.context.state === 'paused'
						? 'chip--warning'
						: canvas.context.state === 'running'
							? 'chip--positive'
							: ''}"
				>
					{canvas.context.state}
				</div>
			</div>
			<div class="canvas__buttons">
				<button
					class="button-positive"
					aria-disabled={canvas.context.state !== 'stopped'}
					onclick={() => canvas.context.start()}
				>
					<MaterialSymbolsPlayArrow />
					Start
				</button>
				<button
					class="button-default"
					aria-disabled={canvas.context.state !== 'paused'}
					onclick={() => canvas.context.resume()}
				>
					<IcBaselineRefresh />
					Resume
				</button>
				<button
					class="button-negative"
					aria-disabled={canvas.context.state === 'stopped'}
					onclick={() => canvas.context.stop()}
				>
					<IcBaselineStop />
					Stop
				</button>
				<button
					class="button-warning"
					aria-disabled={canvas.context.state !== 'running'}
					onclick={() => canvas.context.pause()}
				>
					<IcBaselinePause />
					Pause
				</button>
			</div>
		</div>
		<hr />
	{/if}
	<div class="add">
		<h2 class="add__title">Add shapes</h2>
		<form class="add-form" onsubmit={handleAddCircle}>
			<h3 class="add-form__title">
				<IcBaselineCircle />
				Circle
			</h3>
			<div class="input-group">
				<label for="circle-density">Density</label>
				<input
					required
					type="number"
					step="0.0001"
					id="circle-density"
					placeholder={`${defaultCircleOptions.density}`}
					value={addCircleOptions.density}
					onchange={(e) => updateCircleOptions('density', e.currentTarget.value)}
				/>
			</div>
			<div class="input-group">
				<label for="circle-friction">Friction</label>
				<input
					required
					type="number"
					step="0.01"
					id="circle-friction"
					placeholder={`${defaultCircleOptions.friction}`}
					value={addCircleOptions.friction}
					onchange={(e) => updateCircleOptions('friction', e.currentTarget.value)}
				/>
			</div>
			<div class="input-group">
				<label for="circle-air-friction">Air Friction</label>
				<input
					required
					type="number"
					step="0.001"
					id="circle-air-friction"
					placeholder={`${defaultCircleOptions.frictionAir}`}
					value={addCircleOptions.frictionAir}
					onchange={(e) => updateCircleOptions('frictionAir', e.currentTarget.value)}
				/>
			</div>
			<div class="input-group">
				<label for="circle-static-friction">Static Friction</label>
				<input
					required
					type="number"
					step="0.01"
					id="circle-static-friction"
					placeholder={`${defaultCircleOptions.frictionStatic}`}
					value={addCircleOptions.frictionStatic}
					onchange={(e) => updateCircleOptions('frictionStatic', e.currentTarget.value)}
				/>
			</div>
			<div class="input-group">
				<label for="circle-restitution">Restitution</label>
				<input
					required
					type="number"
					step="0.01"
					id="circle-restitution"
					placeholder={`${defaultCircleOptions.restitution}`}
					value={addCircleOptions.restitution}
					onchange={(e) => updateCircleOptions('restitution', e.currentTarget.value)}
				/>
			</div>
			<div class="input-group">
				<label for="circle-restitution">Is Static</label>
				<button
					type="button"
					role="switch"
					aria-checked={addCircleOptions.isStatic}
					onclick={() => updateCircleOptions('isStatic', !addCircleOptions.isStatic)}
				>
					<span class={addCircleOptions.isStatic ? '' : 'active'}>false</span>
					<span class={addCircleOptions.isStatic ? 'active' : ''}>true</span>
				</button>
			</div>
			<div class="input-group">
				<label for="circle-size">Size</label>
				<input
					required
					type="number"
					step="1"
					max="192"
					min="8"
					id="circle-size"
					placeholder={`${defaultCircleOptions.size}`}
					value={addCircleOptions.size}
					onchange={(e) => updateCircleOptions('size', e.currentTarget.value)}
				/>
			</div>
			<button type="submit" class="button-default">
				<IcBaselinePlus />
				Add Circle
			</button>
		</form>
		<form class="add-form" onsubmit={handleAddRectangle}>
			<h3 class="add-form__title">
				<IcBaselineRectangle />
				Rectangle
			</h3>
			<div class="input-group">
				<label for="rect-density">Density</label>
				<input
					required
					type="number"
					step="0.0001"
					id="rect-density"
					placeholder={`${defaultRectangleOptions.density}`}
					value={addRectangleOptions.density}
					onchange={(e) => updateRectangleOptions('density', e.currentTarget.value)}
				/>
			</div>
			<div class="input-group">
				<label for="rect-friction">Friction</label>
				<input
					required
					type="number"
					step="0.01"
					id="rect-friction"
					placeholder={`${defaultRectangleOptions.friction}`}
					value={addRectangleOptions.friction}
					onchange={(e) => updateRectangleOptions('friction', e.currentTarget.value)}
				/>
			</div>
			<div class="input-group">
				<label for="rect-air-friction">Air Friction</label>
				<input
					required
					type="number"
					step="0.001"
					id="rect-air-friction"
					placeholder={`${defaultRectangleOptions.frictionAir}`}
					value={addRectangleOptions.frictionAir}
					onchange={(e) => updateRectangleOptions('frictionAir', e.currentTarget.value)}
				/>
			</div>
			<div class="input-group">
				<label for="rect-static-friction">Static Friction</label>
				<input
					required
					type="number"
					step="0.01"
					id="rect-static-friction"
					placeholder={`${defaultRectangleOptions.frictionStatic}`}
					value={addRectangleOptions.frictionStatic}
					onchange={(e) => updateRectangleOptions('frictionStatic', e.currentTarget.value)}
				/>
			</div>
			<div class="input-group">
				<label for="rect-restitution">Restitution</label>
				<input
					required
					type="number"
					step="0.01"
					id="rect-restitution"
					placeholder={`${defaultRectangleOptions.restitution}`}
					value={addRectangleOptions.restitution}
					onchange={(e) => updateRectangleOptions('restitution', e.currentTarget.value)}
				/>
			</div>
			<div class="input-group">
				<label for="rect-radius">Radius</label>
				<input
					required
					type="number"
					step="0.01"
					id="rect-radius"
					placeholder={`${defaultRectangleOptions.radius}`}
					value={addRectangleOptions.radius}
					onchange={(e) => updateRectangleOptions('radius', e.currentTarget.value)}
				/>
			</div>
			<div class="input-group">
				<label for="rect-restitution">Is Static</label>
				<button
					type="button"
					role="switch"
					aria-checked={addRectangleOptions.isStatic}
					onclick={() => updateRectangleOptions('isStatic', !addRectangleOptions.isStatic)}
				>
					<span class={addRectangleOptions.isStatic ? '' : 'active'}>false</span>
					<span class={addRectangleOptions.isStatic ? 'active' : ''}>true</span>
				</button>
			</div>
			<div class="input-group">
				<label for="rectangle-width">Width</label>
				<input
					required
					type="number"
					step="1"
					max="192"
					min="8"
					id="rectangle-width"
					placeholder={`${defaultRectangleOptions.width}`}
					value={addRectangleOptions.width}
					onchange={(e) => updateRectangleOptions('width', e.currentTarget.value)}
				/>
			</div>
			<div class="input-group">
				<label for="rectangle-height">Height</label>
				<input
					required
					type="number"
					step="1"
					max="192"
					min="8"
					id="rectangle-height"
					placeholder={`${defaultRectangleOptions.height}`}
					value={addRectangleOptions.height}
					onchange={(e) => updateRectangleOptions('height', e.currentTarget.value)}
				/>
			</div>
			<button type="submit" class="button-default">
				<IcBaselinePlus />
				Add Rectangle
			</button>
		</form>
	</div>
	<hr />
	<div class="shapes">
		<h2 class="shapes__title">Shapes</h2>
		<ul class="shapes__list">
			{#each shapes as s}
				<li class="shape-item{focusedShape === s.shape.id ? ' shape-item--focused' : ''}">
					<div class="shape-item__main">
						<button class="shape-item__name" onclick={() => toggleFocusedShape(s.shape.id)}>
							<IcBaselineArrowRight class="shape-item__arrow" />
							<span>
								{s.shape.type}
								{s.shape.id}
							</span>
						</button>
						<button class="shape-item__delete" onclick={() => removeShape(s.shape.id)}>
							Delete
						</button>
					</div>
					<div class="dropdown">
						<form onsubmit={(e) => applyForce(e, s.element)}>
							<h3 class="dropdown__title">Apply force</h3>
							<div class="dropdown__ranges">
								<div class="range">
									<label class="range__label" for="force-x-{s.shape.id}">x</label>
									<input
										class="range__input"
										type="range"
										name="force-x"
										id="force-x-{s.shape.id}"
										min="-1"
										max="1"
										step="0.05"
									/>
								</div>
								<div class="range">
									<label class="range__label" for="force-x-{s.shape.id}">y</label>
									<input
										class="range__input"
										type="range"
										name="force-y"
										id="force-y-{s.shape.id}"
										min="-1"
										max="1"
										step="0.05"
									/>
								</div>
							</div>
							<button type="submit" class="button-default"> Apply </button>
						</form>
					</div>
				</li>
			{/each}
		</ul>
	</div>
</div>

<style lang="scss">
	@import '$routes/scss/variables';
	@import '$routes/scss/utilities';

	.tools {
		background: $surface;
		height: 100%;
		overflow: auto;
		padding: 16px;
		display: flex;
		flex-direction: column;
		gap: 12px;
		scrollbar-width: thin;

		button[type='submit'] {
			margin-top: 8px;
		}

		hr {
			width: 100%;
			border: none;
			border-top: 1px solid $border;
		}
	}

	.canvas {
		@include vertical-group;

		&__title-group {
			display: flex;
			align-items: center;
			gap: 8px;
		}

		&__title {
			@include heading-2;
		}

		&__buttons {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 8px;
		}
	}

	.add {
		display: flex;
		flex-direction: column;
		gap: 16px;

		&__title {
			@include heading-2;
		}
	}

	.add-form {
		display: flex;
		flex-direction: column;

		&__title {
			@include heading-3;
			display: flex;
			align-items: center;
			gap: 6px;
			margin-bottom: 8px;
		}

		.input-group {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			align-items: center;
			background: $input;
			height: 32px;
			padding-left: 8px;

			&:focus-within {
				background-color: $focus;
			}

			label {
				@include label;
			}

			input {
				background: none;
				border: none;
				outline: none;
				padding-right: 8px;
				height: 100%;
				font: inherit;
				font-size: 0.875rem;
			}

			button[role='switch'] {
				height: 100%;
				font-size: 0.875rem;
				padding: 0;
				display: flex;
				align-items: center;

				span {
					flex: 1;
					height: 100%;
					line-height: 32px;
					color: $label;

					&.active {
						background-color: $gray-400;
						color: white;
					}
				}
			}
		}
	}

	.shapes {
		@include vertical-group;

		&__title {
			@include heading-2;
		}

		&__list {
			background-color: $input;
			margin: 0;
			padding: 0;
			height: 400px;
			overflow: auto;
			scrollbar-width: thin;

			.shape-item {
				margin: 0;
				font-size: 0.875rem;

				:global(.shape-item__arrow) {
					transition: rotate 0.15s cubic-bezier(0.215, 0.61, 0.355, 1);
				}

				&__main {
					display: flex;
					align-items: center;
					justify-content: space-between;
					height: 32px;
				}

				&__name {
					display: flex;
					align-items: center;
					gap: 4px;
				}

				&__name,
				&__delete {
					height: 100%;
					font-size: 0.875rem;
				}

				&__name {
					padding-left: 8px;
					color: inherit;

					&:hover {
						text-decoration: underline;
					}
				}

				&__delete {
					padding-inline: 8px;
					color: $negative;

					&:hover {
						text-decoration: underline;
					}
				}

				.dropdown {
					display: none;
					flex-direction: column;
					gap: 4px;
					padding: 8px;

					&__title {
						@include heading-4;
						margin-bottom: 4px;
					}

					.range {
						display: flex;
						flex-direction: column;
						gap: 2px;

						&__label {
							@include label;
						}

						&__input {
							appearance: none;
							-webkit-appearance: none;

							@mixin track {
								width: 100%;
								height: 6px;
								background: $gray-400;
								border-radius: 999px;
							}

							@mixin thumb {
								height: 18px;
								width: 18px;
								background: $gray-900;
								border-radius: 999px;
							}

							// Must be separate since the browser will drop comma separated selectors if it doesn't understand one
							&::-webkit-slider-runnable-track {
								@include track;
								appearance: none;
								-webkit-appearance: none;
							}

							&::-moz-range-track {
								@include track;
							}

							&::-ms-track {
								@include track;
							}

							&::-webkit-slider-thumb {
								@include thumb;
								appearance: none;
								-webkit-appearance: none;
								margin-top: -6px;
							}
							&::-moz-range-thumb {
								@include thumb;
							}
							&::-ms-thumb {
								@include thumb;
							}
						}
					}

					[type='submit'] {
						width: 100%;
					}
				}

				&--focused {
					outline: 4px solid $highlight;
					outline-offset: -4px;

					:global(.shape-item__arrow) {
						rotate: 90deg;
					}

					.shape-item__name span {
						text-decoration: underline;
					}

					.dropdown {
						display: flex;
					}
				}
			}
		}
	}
</style>
