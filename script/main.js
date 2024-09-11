/**
 * @type {HTMLCanvasElement}
 */
var viewport

/**
 * @type {Node}
 */
var ui

/**
 * @type {CanvasRenderingContext2D}
 */
var ctx

window.onload = () => {
	initElements()
}

/**
 * Initializes all the DOM elements on the page is loaded.
 */
function initElements() {
	viewport = document.getElementById("viewport")
	ui = document.getElementById("ui")
	ctx = viewport.getContext("2d")

	resizeViewport = () => {
		viewport.width = window.innerWidth
		viewport.height = window.innerHeight
	}

	window.onresize = resizeViewport
	resizeViewport()
}
