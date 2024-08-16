export interface CircleOptions {
	density: number
	friction: number
	frictionAir: number
	frictionStatic: number
	restitution: number
	isStatic: boolean
	size: number
}

export interface RectangleOptions {
	density: number
	friction: number
	frictionAir: number
	frictionStatic: number
	restitution: number
	radius: number
	isStatic: boolean
	width: number
	height: number
}

export type Shape = (
	| ({ type: 'circle' } & CircleOptions)
	| ({ type: 'rectangle' } & RectangleOptions)
) & { id: number }
