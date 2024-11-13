const G = 6.6742e-11

/**The `CelestialObject` class encapsulate the data of a _[astronomical object](https://en.wikipedia.org/wiki/Astronomical_object)_.
 *
 * | Name                                                                                      | Notation | Description                                                              |
 * |------------------------------------------------------------------------------------------:|:--------:|:-------------------------------------------------------------------------|
 * | [Mass](https://en.wikipedia.org/wiki/Mass)                                                | _m_      | The mass of an object.                                                   |
 * | [Velocity](https://en.wikipedia.org/wiki/Velocity)                                        | _v_      | The velocity of an object.                                               |
 * | Radius                                                                                    | _r_      | The radius form focal center to orbiting object.                         |
 * | [Gravitational constant](https://en.wikipedia.org/wiki/Gravitational_constant)            | _G_      | The half distance between the apoapsis and periapsis.                    |
 * | [Gravitational parameter](https://en.wikipedia.org/wiki/Standard_gravitational_parameter) | _μ_      | The product of the gravitational constant G and the mass M of that body. |
 */
class CelestialObject {
	/**Creates `CelestialObject` class that encapsulate the data of a _[astronomical object](https://en.wikipedia.org/wiki/Astronomical_object)_.
	 *
	 * @param {number} mass The mass of the celestial object.
	 */
	constructor(mass = 1.0) {
		this.set_mass(mass)
	}

	/**Sets the [Standard gravitational parameter](https://en.wikipedia.org/wiki/Standard_gravitational_parameter) of the celestial object from a given mass.
	 * ```
	 * μ = m * g
	 * ```
	 *
	 * @param {number} mass The new mass.
	 * @returns {CelestialObject} `self`
	 */
	set_mass(mass) {
		this.gravitational_parameter = mass * G
		return this
	}

	/**Gets the mass from the [gravitational parameter](https://en.wikipedia.org/wiki/Standard_gravitational_parameter) of the celestial object.
	 * ```
	 * m = μ / g
	 * ```
	 *
	 * @returns {number} The mass of the celestial object.
	 */
	get_mass() {
		return this.gravitational_parameter / G
	}

	/**Gets the minimum velocity needed for an object to escape from orbit.
	 * Or in other words the [escape velocity](https://en.wikipedia.org/wiki/Escape_velocity).
	 * ```
	 * v = sqrt(2 * G * m / r) = sqrt(2 * μ / r)
	 * ```
	 *
	 * @param {number} radius The distance from the center of the parent object.
	 * @returns {number} The minimum velocity requiered to escape.
	 */
	get_escape_velocity(radius) {
		return Math.sqrt((2.0 * this.gravitational_parameter) / radius)
	}

	/**Gets the minimum velocity needed for an object to get from one radius to another.
	 * The return value is negative if the `from` radius is lower then the `to` radius.
	 * ```
	 * v = ±sqrt(2 * G * m * (1 / r1 - 1 / r2)) = ±sqrt(2 * μ * (1 / r1 - 1 / r2))
	 *
	 * if r1 <= r2: v =  sqrt(2 * μ * (1 / r1 - 1 / r2))
	 * else:        v = -sqrt(2 * μ * (1 / r2 - 1 / r1))
	 * ```
	 *
	 * @param {number} from The starting radius.
	 * @param {number} to The ending radius.
	 * @returns {number} The minimum velocity requiered to achieve desiered transition.
	 */
	get_altidude_delta_velocity(from, to) {
		if (from <= to)
			return Math.sqrt(2.0 * this.gravitational_parameter * (1.0 / from - 1.0 / to))
		else return -Math.sqrt(2.0 * this.gravitational_parameter * (1.0 / to - 1.0 / from))
	}
}

/**
 * The `KeplerianOrbit` class encapsulate the data of a _[Keplerian orbit](https://en.wikipedia.org/wiki/Kepler_orbit)_.
 *
 * | Name                                                                                             | Notation | Description                                                                                              |
 * |-------------------------------------------------------------------------------------------------:|:--------:|:---------------------------------------------------------------------------------------------------------|
 * | [Semimajor axis](https://en.wikipedia.org/wiki/Semi-major_and_semi-minor_axes)                   | _a_      | The half distance between the apoapsis and periapsis.                                                    |
 * | [Semiminor axis](https://en.wikipedia.org/wiki/Semi-major_and_semi-minor_axes)                   | _b_      | The line segment that is at right angles with the semi-major axis.                                       |
 * | [Focal point](https://en.wikipedia.org/wiki/Ellipse#Definition_as_locus_of_points)               | _c_      | The distance between the elipse center and its focal point.                                              |
 * | [directrix](https://en.wikipedia.org/wiki/Conic_section#Eccentricity,_focus_and_directrix)       | _d_      | The directrix of the parabola helps in defining the parabola.                                            |
 * | [semi-latus rectum](https://en.wikipedia.org/wiki/Ellipse#Semi-latus_rectum)                     | _ℓ_      | The length of the chord through one focus, perpendicular to the major axis.                              |
 * | [Eccentricity](https://en.wikipedia.org/wiki/Orbital_eccentricity)                               | _e_      | The shape of the ellipse.                                                                                |
 * | [Energy](https://en.wikipedia.org/wiki/Energy)                                                   | _E_      | The energy of the object.                                                                                |
 * | [Gravitational parameter](https://en.wikipedia.org/wiki/Standard_gravitational_parameter)        | _μ_      | The product of the gravitational constant G and the mass M of that body.                                 |
 * | [Argument of periapsis](https://en.wikipedia.org/wiki/Argument_of_periapsis)                     | _ω_      | The orientation of the ellipse in the orbital plane.                                                     |
 * | [Inclination](https://en.wikipedia.org/wiki/Orbital_inclination)                                 | _i_      | The vertical tilt of the ellipse with respect to the reference plane.                                    |
 * | [Longitude of the ascending node](https://en.wikipedia.org/wiki/Longitude_of_the_ascending_node) | _Ω_      | The Horizontall orientation the ascending node of the ellipse.                                           |
 * | [True anomaly](https://en.wikipedia.org/wiki/True_anomaly)                                       | _ν θ f_  | The position of the orbiting body along the ellipse at a specific time.                                  |
 * | [Eccentric anomaly](https://en.wikipedia.org/wiki/Eccentric_anomaly)                             | _E_      | The angular parameter that defines the position of a body that is moving along an elliptic Kepler orbit. |
 * | [Mean anomaly](https://en.wikipedia.org/wiki/Mean_anomaly)                                       | _M_      | The mathematically convenient fictitious "angle" which varies linearly with time.                        |
 * | Radius                                                                                           | _r_      | The radius form focal center to orbiting object.                                                         |
 */
class KeplerianOrbit {
	/**Creates `KeplerianOrbit` class that encapsulate the data of a _[Keplerian orbit](https://en.wikipedia.org/wiki/Kepler_orbit)_.
	 *
	 * @param {number} semimajor_axis The half distance between the apoapsis and periapsis.
	 * @param {number} eccentricity The shape of the ellipse.
	 * @param {number} argument_of_periapsis The orientation of the ellipse in the orbital plane.
	 * @param {boolean} clockwise Whether or not the orbit is clockwise or not.
	 */
	constructor(semimajor_axis, eccentricity = 0.0, argument_of_periapsis = 0, clockwise = false) {
		this.semimajor_axis = Math.abs(semimajor_axis)
		this.eccentricity = Math.abs(eccentricity)
		this.argument_of_periapsis = argument_of_periapsis
		this.clockwise = clockwise
	}

	/**Gets the _[semiminor axis](https://en.wikipedia.org/wiki/Semi-major_and_semi-minor_axes)_ of the orbit.
	 * ```
	 * b = a * sqrt(1 - e^2)
	 * ```
	 *
	 * @returns {number} The _[semiminor axis](https://en.wikipedia.org/wiki/Semi-major_and_semi-minor_axes)_ of the orbit.
	 */
	semiminor_axis() {
		return this.semimajor_axis * Math.sqrt(1.0 - this.eccentricity * this.eccentricity)
	}

	/**Gets the _[focal point](https://en.wikipedia.org/wiki/Ellipse#Definition_as_locus_of_points)_ of the orbit.
	 * ```
	 * f = e * a
	 * ```
	 *
	 * @returns {number} The _[Focal point](https://en.wikipedia.org/wiki/Ellipse#Definition_as_locus_of_points)_ distance of the orbit.
	 */
	focal_point() {
		return this.eccentricity * this.semimajor_axis
	}

	/**Gets the _[directrix](https://en.wikipedia.org/wiki/Conic_section#Eccentricity,_focus_and_directrix)_ of the orbit.
	 * ```
	 * d = a^2 / f
	 * ```
	 *
	 * @returns {number} The _[directrix](https://en.wikipedia.org/wiki/Conic_section#Eccentricity,_focus_and_directrix)_ of the orbit.
	 */
	directrix() {
		return (this.semimajor_axis * this.semimajor_axis) / this.focal_point()
	}

	/**Gets the _[semi-latus rectum](https://en.wikipedia.org/wiki/Ellipse#Semi-latus_rectum)_ of the orbit.
	 * ```
	 * if e = 0: ℓ = 2 * a
	 * else:     ℓ = b^2 / a = a * (1 - e^2)
	 * ```
	 *
	 * @returns {number} The _[semi-latus rectum](https://en.wikipedia.org/wiki/Ellipse#Semi-latus_rectum)_ of the orbit.
	 */
	Semilatus_rectum() {
		if (this.eccentricity === 1.0) return 2 * this.semimajor_axis
		return this.semimajor_axis * (1.0 - this.eccentricity * this.eccentricity)
	}

	/**Gets the _[periapsis](https://en.wikipedia.org/wiki/Apsis)_ radius of the orbit.
	 * That is is the nearest point in the orbit of a planetary body about its primary body.
	 * ```
	 * periapsis = a * (1 - e)
	 * ```
	 *
	 * @returns {number} The nearest point in the orbit.
	 */
	periapsis() {
		return (1.0 - this.eccentricity) * this.semimajor_axis
	}

	/**Gets the _[apoapsis](https://en.wikipedia.org/wiki/Apsis)_ radius of the orbit.
	 * That is is the farthest point in the orbit of a planetary body about its primary body.
	 * ```
	 * apoapsis = a * (1 + e)
	 * ```
	 *
	 * @returns {number} The farthest point in the orbit.
	 */
	apoapsis() {
		return (1.0 + this.eccentricity) * this.semimajor_axis
	}

	/**Gets the _[specific orbital energy](https://en.wikipedia.org/wiki/Specific_orbital_energy)_ of the orbit.
	 * The _[specific orbital energy](https://en.wikipedia.org/wiki/Specific_orbital_energy)_ is notated with the _ε_ symbol.
	 * ```
	 * ε = εk + εp = V² / 2 - μ / r = -1/2 * μ^2 / h^2 * (1 - e^2) = -μ / (2 * a)
	 *
	 * if e = 0: ε = 0
	 * else:     ε = -μ / (2 * a)
	 * ```
	 *
	 * @param {CelestialObject} parent_boddy The parameters of the parent object.
	 * @param {number} gravitational_parameter The gravitational parameter of the orbiting object.
	 * @returns {number} The energy of the orbit.
	 */
	energy(parent_boddy, gravitational_parameter) {
		if (this.eccentricity == 1.0) return 0.0

		return (
			-(parent_boddy.gravitational_parameter * gravitational_parameter) /
			(2.0 * this.semimajor_axis)
		)
	}

	/**Gets the _[orbital period](https://en.wikipedia.org/wiki/Orbital_period)_ of the orbit when orbiting a given parent boddy.
	 * ```
	 * T = 2π * sqrt(a^3 / (G * M)) = 2π * sqrt(a^3 / μ)
	 * ```
	 *
	 * @param {CelestialObject} parent_boddy The parameters of the parent object.
	 * @returns The time in seconds.
	 */
	orbital_period(parent_boddy) {
		return (
			2.0 *
			Math.PI *
			Math.sqrt(
				(this.semimajor_axis * this.semimajor_axis * this.semimajor_axis) /
					parent_boddy.gravitational_parameter
			)
		)
	}

	/**Rotates a point from mathematical coordinates into local coordinates.
	 *
	 * @param {*} point
	 * @returns The rotated point.
	 */
	rotate_point({ x, y }) {
		y = this.clockwise ? -y : y

		const cos = Math.cos(this.argument_of_periapsis)
		const sin = Math.sin(this.argument_of_periapsis)
		return {
			x: x * cos + y * sin,
			y: y * cos - x * sin,
		}
	}

	/****Unique to 2D orbits!**
	 * Gets whether or not the orbit is clockwise or not.
	 *
	 * @returns {bool} Boolean indicating clockwise orbit.
	 */
	is_clockwise() {
		return this.clockwise
	}
}

/**
 * The `TrueAnomaly` class encapsulate the data of a _[True anomaly](https://en.wikipedia.org/wiki/True_anomaly)_.
 *
 * | Name                                                                                       | Notation | Description                                                                                              |
 * |-------------------------------------------------------------------------------------------:|:--------:|:---------------------------------------------------------------------------------------------------------|
 * | [Semimajor axis](https://en.wikipedia.org/wiki/Semi-major_and_semi-minor_axes)             | _a_      | The half distance between the apoapsis and periapsis.                                                    |
 * | [Focal point](https://en.wikipedia.org/wiki/Ellipse#Definition_as_locus_of_points)         | _c_      | The distance between the elipse center and its focal point.                                              |
 * | [Eccentricity](https://en.wikipedia.org/wiki/Orbital_eccentricity)                         | _e_      | The shape of the ellipse.                                                                                |
 * | [semi-latus rectum](https://en.wikipedia.org/wiki/Ellipse#Semi-latus_rectum)               | _ℓ_      | The length of the chord through one focus, perpendicular to the major axis.                              |
 * | [True anomaly](https://en.wikipedia.org/wiki/True_anomaly)                                 | _ν θ f_  | The position of the orbiting body along the ellipse at a specific time.                                  |
 * | [Eccentric anomaly](https://en.wikipedia.org/wiki/Eccentric_anomaly)                       | _E_      | The angular parameter that defines the position of a body that is moving along an elliptic Kepler orbit. |
 * | [Mean anomaly](https://en.wikipedia.org/wiki/Mean_anomaly)                                 | _M_      | The mathematically convenient fictitious "angle" which varies linearly with time.                        |
 * | Radius                                                                                     | _r_      | The radius form focal center to orbiting object.                                                         |
 */
class TrueAnomaly {
	/**Creates `TrueAnomaly` class that encapsulate the data of a _[True anomaly](https://en.wikipedia.org/wiki/True_anomaly)_.
	 *
	 * @param {number} angle The angle in **radians**.
	 */
	constructor(angle = 0) {
		this.angle = angle
	}

	/**Sets the _[True anomaly](https://en.wikipedia.org/wiki/True_anomaly)_ angle in **degrees**.
	 *
	 * @param {number} angle The angle in **degrees**.
	 * @returns {TrueAnomaly} `self`
	 */
	set_degrees(angle) {
		this.angle = angle * (Math.PI / 180.0)
		return this
	}

	/**Gets the _[True anomaly](https://en.wikipedia.org/wiki/True_anomaly)_ angle in **degrees**.
	 *
	 * @returns {number} The angle in **degrees**.
	 */
	get_degrees() {
		return this.angle * (180.0 / Math.PI)
	}

	/**Gets the radius form _focal center_ to _orbiting object_ given a _[true anomaly](https://en.wikipedia.org/wiki/True_anomaly)_.
	 * ```
	 * r = a * (1 - e^2) / (1 + e * cos(θ)) ) = ℓ / (1 + e * cos(θ))
	 *
	 * if e > 1: r = -ℓ / (1 + e * cos(θ))
	 * else:     r =  ℓ / (1 + e * cos(θ))
	 * ```
	 *
	 * @param {KeplerianOrbit} orbit The orbit in question.
	 * @returns {number} The radius form _focal center_ to orbiting object.
	 */
	radius(orbit) {
		const radius = orbit.Semilatus_rectum() / (1.0 + orbit.eccentricity * Math.cos(this.angle))

		return this.eccentricity > 1.0 ? -radius : radius
	}

	/**Gets a **point** object from a given _[true anomaly](https://en.wikipedia.org/wiki/True_anomaly)_ of the orbit in mathematical space.
	 * ```
	 * p = (r * cos(θ), r * sin(θ))
	 * ```
	 *
	 * @param {KeplerianOrbit} orbit The orbit in question.
	 * @returns {object} The **point** object.
	 */
	point(orbit) {
		const radius = this.radius(orbit)
		const angle = this.angle + orbit.argument_of_periapsis

		return {
			x: Math.cos(angle) * radius,
			y: Math.sin(angle) * radius,
		}
	}

	/**Gets a **point** object from a given _[true anomaly](https://en.wikipedia.org/wiki/True_anomaly)_ of the orbit in local space.
	 * ```
	 * p = (r * cos(θ), r * sin(θ))
	 * ```
	 *
	 * @param {KeplerianOrbit} orbit The orbit in question.
	 * @returns {object} The **point** object.
	 */
	point2d(orbit) {
		return orbit.rotate_point(this.point(orbit))
	}

	/**Converts a given _[true anomaly](https://en.wikipedia.org/wiki/True_anomaly)_ in to a _[eccentric anomaly](https://en.wikipedia.org/wiki/Eccentric_anomaly)_.
	 * ```
	 * atan2( (point(θ) + (f, 0)) / (a, b) )
	 * ```
	 *
	 * @param {KeplerianOrbit} orbit The orbit in question.
	 * @returns {EccentricAnomaly} The _[Eccentric anomaly](https://en.wikipedia.org/wiki/Eccentric_anomaly)_ of the orbit.
	 */
	eccentric_anomaly(orbit) {
		const { x, y } = this.point(orbit)

		const angle = Math.atan2(
			y / orbit.semiminor_axis(),
			(x + orbit.focal_point()) / orbit.semimajor_axis
		)

		return new EccentricAnomaly(angle)
	}

	/**Converts a given _[true anomaly](https://en.wikipedia.org/wiki/True_anomaly)_ in to a _[mean anomaly](https://en.wikipedia.org/wiki/Mean_anomaly)_.
	 *
	 * @param {KeplerianOrbit} orbit The orbit in question.
	 * @returns {MeanAnomaly} The _[Mean anomaly](https://en.wikipedia.org/wiki/Mean_anomaly)_ of the orbit.
	 */
	mean_anomaly(orbit) {
		return this.eccentric_anomaly(orbit).mean_anomaly(orbit)
	}
}

/**
 * The `EccentricAnomaly` class encapsulate the data of a _[Eccentric anomaly](https://en.wikipedia.org/wiki/Eccentric_anomaly)_.
 *
 * | Name                                                                                       | Notation | Description                                                                                              |
 * |-------------------------------------------------------------------------------------------:|:--------:|:---------------------------------------------------------------------------------------------------------|
 * | [Semimajor axis](https://en.wikipedia.org/wiki/Semi-major_and_semi-minor_axes)             | _a_      | The half distance between the apoapsis and periapsis.                                                    |
 * | [Semiminor axis](https://en.wikipedia.org/wiki/Semi-major_and_semi-minor_axes)             | _b_      | The line segment that is at right angles with the semi-major axis.                                       |
 * | [Focal point](https://en.wikipedia.org/wiki/Ellipse#Definition_as_locus_of_points)         | _c_      | The distance between the elipse center and its focal point.                                              |
 * | [Eccentricity](https://en.wikipedia.org/wiki/Orbital_eccentricity)                         | _e_      | The shape of the ellipse.                                                                                |
 * | [True anomaly](https://en.wikipedia.org/wiki/True_anomaly)                                 | _ν θ f_  | The position of the orbiting body along the ellipse at a specific time.                                  |
 * | [Eccentric anomaly](https://en.wikipedia.org/wiki/Eccentric_anomaly)                       | _E_      | The angular parameter that defines the position of a body that is moving along an elliptic Kepler orbit. |
 * | [Mean anomaly](https://en.wikipedia.org/wiki/Mean_anomaly)                                 | _M_      | The mathematically convenient fictitious "angle" which varies linearly with time.                        |
 * | Radius                                                                                     | _r_      | The radius form focal center to orbiting object.                                                         |
 */
class EccentricAnomaly {
	/**Creates `EccentricAnomaly` class that encapsulate the data of a _[Eccentric anomaly](https://en.wikipedia.org/wiki/Eccentric_anomaly)_.
	 *
	 * @param {number} angle The angle in **radians**.
	 */
	constructor(angle = 0) {
		this.angle = angle
	}

	/**Sets the _[Eccentric anomaly](https://en.wikipedia.org/wiki/Eccentric_anomaly)_ angle in **degrees**.
	 *
	 * @param {number} angle The angle in **degrees**.
	 * @returns {TrueAnomaly} `self`
	 */
	set_degrees(angle) {
		this.angle = angle * (Math.PI / 180.0)
		return this
	}

	/**Gets the _[Eccentric anomaly](https://en.wikipedia.org/wiki/Eccentric_anomaly)_ angle in **degrees**.
	 *
	 * @returns {number} The angle in **degrees**.
	 */
	get_degrees() {
		return this.angle * (180.0 / Math.PI)
	}

	/**Gets the radius form _focal center_ to _orbiting object_ given a _[eccentric anomaly](https://en.wikipedia.org/wiki/Eccentric_anomaly)_.
	 * ```
	 * r = len( p )
	 * ```
	 *
	 * @param {KeplerianOrbit} orbit The orbit in question.
	 * @returns {number} The radius form _focal center_ to orbiting object.
	 */
	radius(orbit) {
		//this.true_anomaly(orbit).radius(orbit)
		const { x, y } = this.position(orbit)
		return Math.sqrt(x * x + y * y)
	}

	/**Gets a **point** object from a given _[eccentric anomaly](https://en.wikipedia.org/wiki/Eccentric_anomaly)_ of the orbit in mathematical space.
	 * ```
	 * p = Rotation_Matrix * (a * cos(E) - f, b * sin(E))
	 * ```
	 *
	 * @param {KeplerianOrbit} orbit The orbit in question.
	 * @returns {object} The **point** object.
	 */
	point(orbit) {
		return {
			x: Math.cos(this.angle) * orbit.semimajor_axis - orbit.focal_point(),
			y: Math.sin(this.angle) * orbit.semiminor_axis(),
		}
	}

	/**Gets a **point** object from a given _[eccentric anomaly](https://en.wikipedia.org/wiki/Eccentric_anomaly)_ of the orbit in local space.
	 * ```
	 * p = Rotation_Matrix * (a * cos(E) - f, b * sin(E))
	 * ```
	 *
	 * @param {KeplerianOrbit} orbit The orbit in question.
	 * @returns {object} The **point** object.
	 */
	point2d(orbit) {
		return orbit.rotate_point(this.point(orbit))
	}

	/**Converts a given _[eccentric anomaly](https://en.wikipedia.org/wiki/Eccentric_anomaly)_ in to a _[true anomaly](https://en.wikipedia.org/wiki/True_anomaly)_.
	 * ```
	 * θ = atan2( p )
	 * ```
	 *
	 * @param {KeplerianOrbit} orbit The orbit in question.
	 * @returns {TrueAnomaly} The _[Eccentric anomaly](https://en.wikipedia.org/wiki/Eccentric_anomaly)_ of the orbit.
	 */
	true_anomaly(orbit) {
		const { x, y } = this.point(orbit)
		const angle = Math.atan2(y, x)
		return new TrueAnomaly(angle)
	}

	/**Converts a given _[eccentric anomaly](https://en.wikipedia.org/wiki/Eccentric_anomaly)_ in to a _[mean anomaly](https://en.wikipedia.org/wiki/Mean_anomaly)_.
	 *
	 * @param {KeplerianOrbit} orbit The orbit in question.
	 * @returns {MeanAnomaly} The _[Mean anomaly](https://en.wikipedia.org/wiki/Mean_anomaly)_ of the orbit.
	 */
	mean_anomaly(orbit) {
		return new MeanAnomaly(this.angle - orbit.eccentricity * Math.sin(this.angle))
	}
}

/**
 * The `MeanAnomaly` class encapsulate the data of a _[Mean anomaly](https://en.wikipedia.org/wiki/Mean_anomaly)_.
 *
 * | Name                                                                                       | Notation | Description                                                                                              |
 * |-------------------------------------------------------------------------------------------:|:--------:|:---------------------------------------------------------------------------------------------------------|
 * | [Semimajor axis](https://en.wikipedia.org/wiki/Semi-major_and_semi-minor_axes)             | _a_      | The half distance between the apoapsis and periapsis.                                                    |
 * | [Semiminor axis](https://en.wikipedia.org/wiki/Semi-major_and_semi-minor_axes)             | _b_      | The line segment that is at right angles with the semi-major axis.                                       |
 * | [directrix](https://en.wikipedia.org/wiki/Conic_section#Eccentricity,_focus_and_directrix) | _d_      | The directrix of the parabola helps in defining the parabola.                                            |
 * | [Eccentricity](https://en.wikipedia.org/wiki/Orbital_eccentricity)                         | _e_      | The shape of the ellipse.                                                                                |
 * | [True anomaly](https://en.wikipedia.org/wiki/True_anomaly)                                 | _ν θ f_  | The position of the orbiting body along the ellipse at a specific time.                                  |
 * | [Eccentric anomaly](https://en.wikipedia.org/wiki/Eccentric_anomaly)                       | _E_      | The angular parameter that defines the position of a body that is moving along an elliptic Kepler orbit. |
 * | [Mean anomaly](https://en.wikipedia.org/wiki/Mean_anomaly)                                 | _M_      | The mathematically convenient fictitious "angle" which varies linearly with time.                        |
 * | Radius                                                                                     | _r_      | The radius form focal center to orbiting object.                                                         |
 */
class MeanAnomaly {
	/**Creates `MeanAnomaly` class that encapsulate the data of a _[Mean anomaly](https://en.wikipedia.org/wiki/Mean_anomaly)_.
	 *
	 * @param {number} angle The angle in **radians**.
	 */
	constructor(angle = 0) {
		this.angle = angle
	}

	/**Sets the _[Mean anomaly](https://en.wikipedia.org/wiki/Mean_anomaly)_ angle in **degrees**.
	 *
	 * @param {number} angle The angle in **degrees**.
	 * @returns {TrueAnomaly} `self`
	 */
	set_degrees(angle) {
		this.angle = angle * (Math.PI / 180.0)
		return this
	}

	/**Gets the _[Mean anomaly](https://en.wikipedia.org/wiki/Mean_anomaly)_ angle in **degrees**.
	 *
	 * @returns {number} The angle in **degrees**.
	 */
	get_degrees() {
		return this.angle * (180.0 / Math.PI)
	}

	/**Gets the radius form _focal center_ to _orbiting object_ given a _[mean anomaly](https://en.wikipedia.org/wiki/Mean_anomaly)_.
	 *
	 * @param {KeplerianOrbit} orbit The orbit in question.
	 * @returns {number} The radius form _focal center_ to orbiting object.
	 */
	radius(orbit) {
		this.true_anomaly(orbit).radius(orbit)
	}

	/**Gets a **DVec2** point from a given _[mean anomaly](https://en.wikipedia.org/wiki/Mean_anomaly)_ of the orbit in mathematical space.
	 *
	 * @param {KeplerianOrbit} orbit The orbit in question.
	 * @returns {object} The **point** object.
	 */
	point(orbit) {
		return this.eccentric_anomaly(orbit).point(orbit)
	}

	/**Gets a **DVec2** point from a given _[mean anomaly](https://en.wikipedia.org/wiki/Mean_anomaly)_ of the orbit in local space.
	 *
	 * @param {KeplerianOrbit} orbit The orbit in question.
	 * @returns {object} The **point** object.
	 */
	point2d(orbit) {
		return this.eccentric_anomaly(orbit).point2d(orbit)
	}

	/**Converts a given _[mean anomaly](https://en.wikipedia.org/wiki/Mean_anomaly)_ in to a _[true anomaly](https://en.wikipedia.org/wiki/True_anomaly)_.
	 *
	 * @param {KeplerianOrbit} orbit The orbit in question.
	 * @returns {TrueAnomaly} The _[Eccentric anomaly](https://en.wikipedia.org/wiki/Eccentric_anomaly)_ of the orbit.
	 */
	true_anomaly(orbit) {
		return this.eccentric_anomaly(orbit).true_anomaly(orbit)
	}

	/**Converts a given _[mean anomaly](https://en.wikipedia.org/wiki/Mean_anomaly)_ in to a _[eccentric anomaly](https://en.wikipedia.org/wiki/Eccentric_anomaly)_ using [Newton's method](https://en.wikipedia.org/wiki/Newton%27s_method).
	 *
	 * @param {KeplerianOrbit} orbit The orbit in question.
	 * @returns {EccentricAnomaly} The _[Eccentric anomaly](https://en.wikipedia.org/wiki/Eccentric_anomaly)_ of the orbit.
	 */
	eccentric_anomaly(orbit) {
		const tolerance = 0.00001 * (Math.PI / 180)
		let eccentric_anomaly = this.angle

		for (let i = 0; i < 10; i++) {
			const f =
				eccentric_anomaly - orbit.eccentricity * Math.sin(eccentric_anomaly) - this.angle

			const clamp = (x, min, max) => Math.min(Math.max(x, min), max)

			eccentric_anomaly -= clamp(
				f / (1.0 - orbit.eccentricity * Math.cos(eccentric_anomaly)),
				-orbit.eccentricity / 2.0,
				orbit.eccentricity / 2.0
			)

			if (Math.abs(f) < tolerance) return new EccentricAnomaly(eccentric_anomaly)
		}

		return new EccentricAnomaly(eccentric_anomaly)
	}
}
