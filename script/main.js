window.onload = () => {
	viewport = new Canvas("viewport", "#000000")
	ui = document.getElementById("ui")
	clearNode(ui)

	viewport.camera.width = 10
	viewport.camera.height = 10

	const star = new Star(viewport)
	const planet1 = new Planet(star, 3, 0.25)
	const planet2 = new Planet(star, 7, 0.5)
	const planet3 = new Planet(planet2, 1, 0.1)

	viewport.play()
}
