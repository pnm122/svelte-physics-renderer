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

	interface Props {
		addCircle: (c: CircleOptions) => void
		addRectangle: (r: RectangleOptions) => void
		removeShape: (id: number) => void
		toggleFocusedShape: (id: number) => void
		shapes: Shape[]
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
			{#each shapes as shape}
				<li class="shape-item{focusedShape === shape.id ? ' shape-item--focused' : ''}">
					<button class="shape-item__name" onclick={() => toggleFocusedShape(shape.id)}>
						{shape.type}
						{shape.id}
					</button>
					<button class="shape-item__delete" onclick={() => removeShape(shape.id)}> Delete </button>
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
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin: 0;
				height: 32px;
				font-size: 0.875rem;

				&--focused {
					background-color: $highlight;

					.shape-item__name {
						text-decoration: underline;
					}
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
			}
		}
	}
</style>
