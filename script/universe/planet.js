class Star extends Object {
	constructor(canvas, x = 0, y = 0) {
		super({ x, y, parent: canvas })
	}

	draw(canvas) {
		canvas.context.fillStyle = "#ffff88"
		canvas.context.strokeStyle = "#ffff00"
		canvas.context.lineWidth = 0.1

		canvas.context.beginPath()
		canvas.context.arc(0.0, 0.0, 1, 0, Math.PI * 2)
		canvas.context.fill()
		canvas.context.stroke()
	}
}

class Planet extends Object {
	constructor({ parent, radius, semimajor_axis, eccentricity }) {
		super({ parent })
		this.radius = radius
		this.orbit = new KeplerianOrbit(semimajor_axis, eccentricity)
	}

	update(canvas) {
		const { x, y } = new MeanAnomaly(
			canvas.time /
				(this.orbit.semimajor_axis * this.orbit.semimajor_axis)
		).position(this.orbit)
		this.x = x
		this.y = y
	}

	draw(canvas) {
		canvas.context.fillStyle = "#aaaaaa"
		canvas.context.strokeStyle = "#888888"
		canvas.context.lineWidth = 0.1

		canvas.context.beginPath()
		canvas.context.arc(0.0, 0.0, this.radius, 0, Math.PI * 2)
		canvas.context.fill()
		canvas.context.stroke()
	}
}
