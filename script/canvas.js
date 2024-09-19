/**The `Canvas` class encapsulates and provides helper
 * functions to make it easier to animate a HTML canvas.
 */
class Canvas {
	/**Creates `Canvas` class object that encapsulates and provides helper
	 * functions to make it easier to animate a HTML canvas.
	 *
	 * @param {HTMLCanvasElement | string} element The HTML canvas
	 * @param {string} clearColor The clear color
	 * @param {object} camera The camera position of the canvas viewport
	 */
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
		// Set element.
		if (typeof element == "string")
			this.element = document.getElementById(element)
		else this.element = element

		// Set context.
		this.context = this.element.getContext("2d")
		this.context.imageSmoothingEnabled = true
		this.context.imageSmoothingQuality = "high"
		this.clearColor = clearColor

		// Set camera and children.
		this.camera = camera
		this.children = []

		// Set time.
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

	/**The `animation` function assigns a funtion that is called each time a frame i drawn.
	 * It also start animating unless the `animate` parameter is set to **false**.
	 *
	 * @param {Function} animationFunction The animation function.
	 * @param {boolean} animate Whether or not to start animation (**true** by default).
	 */
	animation(animationFunction, animate = true) {
		this.animate = animate
		this.animationFunction = animationFunction

		if (animate) play()
		else redraw()
	}

	/**The `play` function when called starts animating the canvas.
	 */
	play() {
		this.animate = true
		var laststamp = null

		const callback = () => {
			// Get timestamp
			const timestamp = new Date()
			if (laststamp === null) laststamp = timestamp

			// Calculate delta time
			const delta = Math.max(0.0001, (timestamp - laststamp) / 1000.0)

			// Step
			this.step(delta)

			// Request next frame
			if (this.animate) requestAnimationFrame(callback)

			// Set last timestamp
			laststamp = timestamp
		}

		callback()
	}

	/**The `step` function steps the forward in time by `delta` amount and then redraws.
	 *
	 * @param {number} delta The amount of time in seconds to step forward.
	 */
	step(delta) {
		this.time += delta
		this.delta = delta

		this.update()
		this.redraw()
	}

	/**The `update` function runs the `update` funtion on all the child.
	 * ellements that have been attached with the `add_child` function.
	 */
	update() {
		const recursive = entity => {
			if (entity.update) entity.update(this)
			if (entity.children)
				entity.children.forEach(child => recursive(child))
		}
		this.children.forEach(entity => recursive(entity))
	}

	/**The `redraw` function redraws the canvas by calling the draw function on.
	 * all the child ellements that have been attached with the `add_child` function.
	 * And thereafter calls the `animationFunction`.
	 */
	redraw() {
		this.clear()

		const recursive = entity => {
			this.context.save()
			this.transform(entity)
			entity.transform = this.context.getTransform()

			if (entity.draw) entity.draw(this)
			if (entity.children)
				entity.children.forEach(child => recursive(child))

			this.context.restore()
		}
		this.children.forEach(object => recursive(object))

		if (this.animationFunction) this.animationFunction(this, this.context)
	}

	/**The `clear` function clears the canvas and then fills it with the `clearColor`.
	 */
	clear() {
		// Clear the canvas.
		this.context.reset()
		this.context.fillStyle = this.clearColor
		this.context.fillRect(0, 0, this.element.width, this.element.height)

		// Make it so that the canvas 0,0 is at the center.
		this.context.translate(
			this.element.width / 2.0,
			this.element.height / 2.0
		)

		// Calculate and set the zoom level that can fit the camera width and height.
		const zoom = Math.min(
			this.element.width / this.camera.width / 2.0,
			this.element.height / this.camera.height / 2.0
		)
		this.context.scale(zoom, -zoom)

		// Translate the canvas to the camera position.
		this.context.translate(-this.camera.x, -this.camera.y)
	}

	/**The `pause` funtion when called stops the canvas from animating.
	 */
	pause() {
		this.animate = false
	}

	/**The `transform` function transforms the canvas to center the
	 * drawcals to be centered at the `x` and `y` coordinates.
	 * Well as rotating the coordinates by `rotation` angle.
	 *
	 * @param {Object} data
	 */
	transform(data) {
		if (data.rotation) this.context.rotate(data.rotation)
		if (data.x && data.y) this.context.translate(data.x, data.y)
	}

	/**The `add_child` function adds a child to the `Canvas` object.
	 * When the canvas is _steped_ calls the `update` function
	 * and when the canvas is _drawn_ calls the `draw` function.
	 * This is done recursively over the the child objects `children` array.
	 *
	 * @param {Object} child The child objet to be added
	 */
	add_child(child) {
		child.remove_parent()
		this.children.push(child)
		child.parent = this
	}

	/**The `remove_child` function removes a child from the `Canvas` object.
	 *
	 * @param {Object} child The child objet to be removed
	 */
	remove_child(child) {
		this.children = this.children.filter(child => child !== child)
		child.parent = null
	}
}

/**The `Object` class encapsulates and provides helper functions for a `Canvas` class object.
 * It is intended to be base class for other `Canvas` objects.
 */
class Object {
	/**Creates a `Object` class that encapsulates and provides helper functions for a `Canvas` class object.
	 *
	 * @param {Object} data Object params with `x`, `y`, `rotation` and `parent` attributes.
	 */
	constructor(data) {
		this.x = data.x
		this.y = data.y
		this.rotation = data.rotation

		this.children = []
		this.set_parent(data?.parent)
	}

	/**The `add_child` function adds a child object to the `children`
	 * array well as seting the child objects `parent`.
	 *
	 * @param {Object} child The child to be added.
	 */
	add_child(child) {
		child.remove_parent()
		this.children.push(child)
		child.parent = this
	}

	/**The `remove_child` function removes a child object from the `children`
	 * array well as seting the child objects `parent` to **null**.
	 *
	 * @param {Object} childThe child to be removed.
	 */
	remove_child(child) {
		this.children = this.children.filter(child => child !== child)
		child.parent = null
	}

	/**The `set_parent` function sets the `parent` of the object
	 * well as adding the object to the `children` array of the parent.
	 *
	 * @param {Object} parent The parent to be set to.
	 */
	set_parent(parent) {
		if (parent) parent.add_child(this)
		else this.parent = null
	}

	/**The `remove_parent` function sets the `parent` of the object to **null**
	 * well as removing the object from the parent `children` array.
	 */
	remove_parent() {
		if (this.parent) this.parent.remove_child(this)
		else this.parent = null
	}
}
