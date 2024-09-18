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

class Orbit extends Object {
	constructor({
		parent,
		semimajor_axis,
		eccentricity,
		argument_of_periapsis,
	}) {
		super({ parent })
		this.orbit = new KeplerianOrbit(
			semimajor_axis,
			eccentricity || 0.0,
			argument_of_periapsis || 0.0
		)
	}

	update(canvas) {
		const { x, y } = new MeanAnomaly(
			canvas.time /
				(this.orbit.semimajor_axis * this.orbit.semimajor_axis)
		).point(this.orbit)
		this.x = x
		this.y = y
	}

	draw_orbit_lines(canvas) {
		canvas.context.save()
		canvas.context.setTransform(this.parent.transform)
		canvas.context.rotate(this.orbit.argument_of_periapsis)

		canvas.context.strokeStyle = "#888888"
		canvas.context.lineWidth = 0.01

		canvas.context.beginPath()
		canvas.context.ellipse(
			-this.orbit.focal_point(),
			0,
			this.orbit.semimajor_axis,
			this.orbit.semiminor_axis(),
			0,
			0,
			Math.PI * 2
		)
		canvas.context.stroke()
		canvas.context.restore()
	}

	draw_orbit_points(canvas) {
		canvas.context.save()
		canvas.context.setTransform(this.parent.transform)

		canvas.context.fillStyle = "#ffffff"

		for (let i = 0; i < 1; i += 0.1) {
			const { x, y } = new MeanAnomaly(
				(canvas.time * 3) /
					(this.orbit.semimajor_axis * this.orbit.semimajor_axis) +
					i * Math.PI * 2
			).point(this.orbit)

			canvas.context.beginPath()
			canvas.context.arc(x, -y, 0.02, 0, Math.PI * 2)
			canvas.context.fill()
		}

		canvas.context.restore()
	}
}

class Planet extends Orbit {
	constructor({ radius, ...params }) {
		super(params)
		this.radius = radius
	}

	draw(canvas) {
		this.draw_orbit_lines(canvas)
		this.draw_orbit_points(canvas)

		// Drawing Planet
		canvas.context.fillStyle = "#aaaaaa"
		canvas.context.strokeStyle = "#888888"
		canvas.context.lineWidth = 0.1

		canvas.context.beginPath()
		canvas.context.arc(0.0, 0.0, this.radius, 0, Math.PI * 2)
		canvas.context.fill()
		canvas.context.stroke()
	}
}
