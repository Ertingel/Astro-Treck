class Canvas {
	constructor(
		element,
		clearColor = "#888888",
		camera = {
			x: 0.0,
			y: 0.0,
			width: 1.0,
			height: 1.0,
		}
	) {
		if (typeof element == "string")
			element = document.getElementById(element)

		this.element = element
		this.context = element.getContext("2d")
		this.context.imageSmoothingEnabled = true
		this.context.imageSmoothingQuality = "high"
		this.clearColor = clearColor
		this.camera = camera
		this.children = []

		this.time = 0.0
		this.delta = 0.0

		this.resizeObserver = new ResizeObserver(e => {
			for (const entry of e) {
				entry.target.width = entry.contentRect.width
				entry.target.height = entry.contentRect.height
			}
			if (!this.animate) this.redraw()
		}).observe(this.element)
	}

	animation(animationFunction, animate = true) {
		this.animate = animate
		this.animationFunction = animationFunction

		if (animate) play()
		else redraw()
	}

	play() {
		this.animate = true
		var laststamp = null

		const callback = () => {
			const timestamp = new Date()
			if (laststamp === null) laststamp = timestamp

			let delta = (timestamp - laststamp) / 1000.0
			if (delta <= 0.0) delta = 0.0001

			this.step(delta)

			if (this.animate) requestAnimationFrame(callback)

			laststamp = timestamp
		}

		callback()
	}

	step(delta) {
		this.time += delta
		this.delta = delta

		this.update()
		this.redraw()
	}

	update() {
		const recursive = (entity, stack) => {
			if (entity.update) entity.update(this, stack)
			if (entity.children) {
				stack.unshift({ entity })
				entity.children.forEach(child => recursive(child, stack))
				stack.shift()
			}
		}
		this.children.forEach(entity => recursive(entity, []))
	}

	redraw() {
		this.clear()

		const recursive = entity => {
			this.context.save()
			this.transform(entity)
			entity.transform = this.context.getTransform()

			if (entity.draw) entity.draw(this)
			if (entity.children) {
				entity.children.forEach(child => recursive(child))
			}
			this.context.restore()
		}
		this.children.forEach(object => recursive(object))

		if (this.animationFunction) this.animationFunction(this, this.context)
	}

	clear() {
		this.context.reset()
		this.context.fillStyle = this.clearColor
		this.context.fillRect(0, 0, this.element.width, this.element.height)

		const zoom = Math.min(
			this.element.width / this.camera.width / 2.0,
			this.element.height / this.camera.height / 2.0
		)
		this.context.translate(
			this.element.width / 2.0,
			this.element.height / 2.0
		)
		this.context.scale(zoom, zoom)
		this.context.translate(-this.camera.x, this.camera.y)
	}

	pause() {
		this.animate = false
	}

	transform(data) {
		if (data.rotation) this.context.rotate(data.rotation)
		if (data.x && data.y) this.context.translate(data.x, -data.y)
	}

	addChild(child) {
		child.removeParent()
		this.children.push(child)
		child.parent = this
	}

	removeChild(child) {
		this.children = this.children.filter(child => child !== child)
		child.parent = null
	}
}

class Object {
	constructor(data) {
		this.x = data.x
		this.y = data.y
		this.rotation = data.rotation

		this.children = []
		this.setParent(data?.parent)
	}

	addChild(child) {
		child.removeParent()
		this.children.push(child)
		child.parent = this
	}

	removeChild(child) {
		this.children = this.children.filter(child => child !== child)
		child.parent = null
	}

	setParent(parent) {
		if (parent) parent.addChild(this)
		else this.parent = null
	}

	removeParent() {
		if (this.parent) this.parent.removeChild(this)
		else this.parent = null
	}
}
