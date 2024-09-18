window.onload = () => {
	viewport = new Canvas("viewport", "#000000")
	ui = document.getElementById("ui")
	clearNode(ui)

	viewport.camera.width = 10
	viewport.camera.height = 10

	const star = new Star(viewport)
	/* const planet1 = new Planet(star, 3, 0.25)
	const planet2 = new Planet(star, 7, 0.5)
	const planet3 = new Planet(planet2, 1, 0.1) */

	const planet1 = new Planet({
		parent: star,
		radius: 0.25,
		semimajor_axis: 3,
		eccentricity: 0,
	})

	const planet2 = new Planet({
		parent: star,
		radius: 0.5,
		semimajor_axis: 7,
		eccentricity: 0.1,
	})

	const planet3 = new Planet({
		parent: planet2,
		radius: 0.1,
		semimajor_axis: 1.25,
		eccentricity: 0.25,
	})

	const planet4 = new Planet({
		parent: star,
		radius: 0.05,
		semimajor_axis: 5,
		eccentricity: 0.75,
		argument_of_periapsis: Math.PI / 2,
	})

	viewport.play()
}
