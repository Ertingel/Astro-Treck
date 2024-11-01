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
		clockwise,
	}) {
		super({ parent })
		this.orbit = new KeplerianOrbit(
			semimajor_axis,
			eccentricity || 0.0,
			argument_of_periapsis || 0.0,
			clockwise || false
		)
	}

	update(canvas) {
		const { x, y } = new MeanAnomaly(
			canvas.time /
				(this.orbit.semimajor_axis * this.orbit.semimajor_axis)
		).point2d(this.orbit)
		this.x = x
		this.y = y
	}

	draw_orbit_lines(canvas, width = 0.01, color = "#ffffff88") {
		canvas.context.save()
		canvas.context.setTransform(this.parent.transform)
		canvas.context.rotate(-this.orbit.argument_of_periapsis)

		canvas.context.strokeStyle = color
		canvas.context.lineWidth = width

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

	draw_orbit_points(canvas, width = 0.02, color = "#ffffff", count = 12) {
		canvas.context.save()
		canvas.context.setTransform(this.parent.transform)

		canvas.context.fillStyle = color

		for (let i = 0; i < count; i++) {
			const { x, y } = new MeanAnomaly(
				(canvas.time * 3) /
					(this.orbit.semimajor_axis * this.orbit.semimajor_axis) +
					(i / count) * Math.PI * 2
			).point2d(this.orbit)

			canvas.context.beginPath()
			canvas.context.arc(x, y, width, 0, Math.PI * 2)
			canvas.context.fill()
		}

		canvas.context.restore()
	}

	draw_orbit_dashes(canvas, width = 0.01, color = "#ffffff", count = 12) {
		canvas.context.save()
		canvas.context.setTransform(this.parent.transform)
		canvas.context.rotate(-this.orbit.argument_of_periapsis)

		canvas.context.strokeStyle = color
		canvas.context.lineWidth = width

		let time_shift =
			(canvas.time * 3) /
			(this.orbit.semimajor_axis * this.orbit.semimajor_axis)
		if (this.orbit.is_clockwise()) time_shift = -time_shift

		for (let i = 0; i < count; i++) {
			const a1 = new MeanAnomaly(
				time_shift + (i / count - 0.5 / count) * Math.PI * 2
			).eccentric_anomaly(this.orbit)

			const a2 = new MeanAnomaly(
				time_shift + (i / count) * Math.PI * 2
			).eccentric_anomaly(this.orbit)

			canvas.context.beginPath()
			canvas.context.ellipse(
				-this.orbit.focal_point(),
				0,
				this.orbit.semimajor_axis,
				this.orbit.semiminor_axis(),
				0,

				a1.angle,
				a2.angle
			)
			canvas.context.stroke()
		}

		canvas.context.restore()
	}

	draw_orbit_dashes2(
		canvas,
		width = 0.02,
		color1 = "#ccccffff",
		color2 = "#8888ff66",
		count = 12
	) {
		canvas.context.save()
		canvas.context.setTransform(this.parent.transform)
		canvas.context.rotate(-this.orbit.argument_of_periapsis)

		let time_shift =
			(canvas.time * 3) /
			(this.orbit.semimajor_axis * this.orbit.semimajor_axis)
		if (this.orbit.is_clockwise()) time_shift = -time_shift

		const start_angle = new MeanAnomaly(time_shift).true_anomaly(
			this.orbit
		).angle

		const gradient = canvas.context.createConicGradient(start_angle, 0, 0)

		if (this.orbit.is_clockwise()) {
			gradient.addColorStop(0, color1)
			gradient.addColorStop(1, color2)
		} else {
			gradient.addColorStop(1, color1)
			gradient.addColorStop(0, color2)
		}

		for (
			let i = (Math.PI * 2) / count;
			i < Math.PI * 2;
			i += (Math.PI * 2) / count
		) {
			const angle =
				(new MeanAnomaly(time_shift + i).true_anomaly(this.orbit)
					.angle -
					start_angle) /
					(2 * Math.PI) +
				1.0

			if (this.orbit.is_clockwise()) {
				gradient.addColorStop((angle + 0.001) % 1.0, color1)
				gradient.addColorStop(angle % 1.0, color2)
			} else {
				gradient.addColorStop(angle % 1.0, color1)
				gradient.addColorStop((angle + 0.001) % 1.0, color2)
			}
		}

		canvas.context.strokeStyle = gradient
		canvas.context.lineWidth = width

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
}

class Planet extends Orbit {
	constructor({ radius, ...params }) {
		super(params)
		this.radius = radius
	}

	draw(canvas) {
		/* this.draw_orbit_lines(canvas)
		this.draw_orbit_dashes(canvas)
		this.draw_orbit_points(canvas) */
		this.draw_orbit_dashes2(canvas)

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
