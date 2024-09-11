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
	constructor(parent, semimajor, radius) {
		super({ x: radius, parent })
		this.semimajor = semimajor
		this.radius = radius
	}

	update(canvas) {
		this.x = Math.cos(canvas.time / this.semimajor) * this.semimajor
		this.y = Math.sin(canvas.time / this.semimajor) * this.semimajor
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
