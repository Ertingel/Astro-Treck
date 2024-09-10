var viewport
var ui
var ctx

function init_elements() {
	viewport = document.getElementById("viewport")
	ui = document.getElementById("ui")
	ctx = viewport.getContext("2d")

	window.onresize = resize_viewport
	resize_viewport()
}

function resize_viewport() {
	viewport.width = window.innerWidth
	viewport.height = window.innerHeight
}

window.onload = () => {
	init_elements()
}
