/**The `assert` function is based on the rust langage and prints `error_message` if the test failed.
 *
 * @param {boolean} test The test.
 * @param {string} error_message The message printed on test fail.
 * @returns If the test was successful.
 */
function assert(test, error_message) {
	if (!test) console.error(error_message)
	return test
}

/**The `test` function checks if the provided `value` is equal or within the `tolerance` of the `expected` value.
 * It prints `error_message` if the test failed.
 *
 * @param {string} error_message The message printed on test fail.
 * @param {any} value The resuled value.
 * @param {any} expected The expected value.
 * @param {any} tolerance The error tolerance.
 * @returns If the test was successful.
 */
function test(error_message, value, expected, tolerance = null) {
	//For arrays
	if (Array.isArray(value)) {
		const expected_is_array = Array.isArray(expected)

		if (tolerance) {
			const tolerance_is_array = Array.isArray(tolerance)

			return assert(
				value.every((_, i) =>
					Math.abs(
						value[i] - expected_is_array ? expected[i] : expected
					) <= tolerance_is_array
						? tolerance[i]
						: tolerance
				),
				error_message
			)
		} else {
			return assert(
				value.every((_, i) =>
					value[i] == expected_is_array ? expected[i] : expected
				),
				error_message
			)
		}
	}

	//For objects
	if (typeof value === "object") {
		const expected_is_object = typeof expected === "object"

		const keys = []
		for (var key in value) keys.push(key)

		if (tolerance) {
			const tolerance_is_object = typeof tolerance === "object"

			return assert(
				keys.every(key =>
					Math.abs(
						value[key] - expected_is_object
							? expected[key]
							: expected
					) <= tolerance_is_object
						? tolerance[key]
						: tolerance
				),
				error_message
			)
		} else {
			return assert(
				keys.every(key =>
					value[key] == expected_is_object ? expected[key] : expected
				),
				error_message
			)
		}
	}

	//For number
	if (tolerance)
		return assert(Math.abs(value - expected) <= tolerance, error_message)
	else return assert(value == expected, error_message)
}

apoapsis_periapsis_conversion()
function apoapsis_periapsis_conversion() {
	const target_precision = 0.000001

	for (let e = 0; e < 20; e++) {
		const eccentricity = e / 20.0
		const orbit = new KeplerianOrbit(1.0, eccentricity)

		const periapsis_result = orbit.periapsis()
		var { x, y } = new TrueAnomaly(0.0).point2d(orbit)
		const periapsis_expected = Math.sqrt(x * x + y * y)

		test(
			`'periapsis' for eccentricity ${eccentricity} did not convert correctly! ${periapsis_result} != ${periapsis_expected}`,
			periapsis_expected,
			periapsis_result,
			target_precision
		)

		const apoapsis_result = orbit.apoapsis()
		var { x, y } = new TrueAnomaly(Math.PI).point2d(orbit)
		const apoapsis_expected = Math.sqrt(x * x + y * y)

		test(
			`'apoapsis' for eccentricity ${eccentricity} did not convert correctly! ${apoapsis_result} != ${apoapsis_expected}`,
			apoapsis_expected,
			apoapsis_result,
			target_precision
		)

		assert(
			periapsis_result < apoapsis_result + target_precision,
			`Somehow 'periapsis' for eccentricity ${eccentricity} is greater than 'apoapsis'! ${periapsis_result} > ${apoapsis_result}`
		)
	}
}

true_and_eccentric_anomaly_conversion()
function true_and_eccentric_anomaly_conversion() {
	const target_precision = 0.000001

	for (let e = 0; e < 20; e++) {
		const eccentricity = e / 20.0
		const orbit = new KeplerianOrbit(1.0, eccentricity)

		for (let a = 3 - 180; a < 180; a += 3) {
			const value1 = new EccentricAnomaly().set_degrees(a)
			const value2 = value1.true_anomaly(orbit)
			const value3 = value2.eccentric_anomaly(orbit)

			test(
				`'true_and_eccentric_anomaly_conversion' for eccentricity ${eccentricity} did not convert correctly! ${value1.angle} -> ${value2.angle} -> ${value3.angle}`,
				value1.angle,
				value3.angle,
				target_precision
			)
		}
	}
}

eccentric_and_mean_anomaly_conversion()
function eccentric_and_mean_anomaly_conversion() {
	const target_precision = 0.0000001

	for (let e = 0; e < 20; e++) {
		const eccentricity = e / 20.0
		const orbit = new KeplerianOrbit(1.0, eccentricity)

		for (let a = 3 - 180; a < 180; a += 3) {
			const value1 = new MeanAnomaly().set_degrees(a)
			const value2 = value1.eccentric_anomaly(orbit)
			const value3 = value2.mean_anomaly(orbit)

			test(
				`'eccentric_and_mean_anomaly_conversion' for eccentricity ${eccentricity} did not convert correctly! ${value1.angle} -> ${value2.angle} -> ${value3.angle}`,
				value1.angle,
				value3.angle,
				target_precision
			)
		}
	}
}

point_from_anomaly()
function point_from_anomaly() {
	const target_precision = 0.0000001

	const test2 = (orbit, input, x, y) => {
		// Test that the eccentric anomaly matches.
		const result1 = new EccentricAnomaly().set_degrees(input).point2d(orbit)
		test(
			`'point_from_eccentric_anomaly' did not convert correctly! \nInput:	${input} \nExpected: ${x}, ${y} \nGot:	  ${result1.x}, ${result1.y} \nTarget:   ${target_precision}`,
			result1,
			{ x, y },
			{ x: target_precision, y: target_precision }
		)

		// Test that the true anomaly matches.
		const result2 = new EccentricAnomaly()
			.set_degrees(input)
			.true_anomaly(orbit)
			.point2d(orbit)
		test(
			`'point_from_true_anomaly' did not convert correctly! \nInput:	${input} \nExpected: ${x},${y} \nGot:	  ${result2.x},${result2.y} \nTarget:   ${target_precision}`,
			result2,
			{ x, y },
			{ x: target_precision, y: target_precision }
		)
	}

	// Tests for circular orbit.
	const orbit1 = new KeplerianOrbit(1.0, 0.0)

	test2(orbit1, 0.0, 1.0, 0.0)
	test2(orbit1, 45.0, 0.7071067812, 0.7071067812)
	test2(orbit1, 90.0, 0.0, 1.0)
	test2(orbit1, 135.0, -0.7071067812, 0.7071067812)

	test2(orbit1, 180.0, -1.0, 0.0)
	test2(orbit1, 225.0, -0.7071067812, -0.7071067812)
	test2(orbit1, 270.0, -0.0, -1.0)
	test2(orbit1, 315.0, 0.7071067812, -0.7071067812)

	// Tests for eccentric orbits.
	const orbit2 = new KeplerianOrbit(2.0, 0.5)

	test2(orbit2, 0.0, 1.0, 0.0)
	test2(orbit2, 45.0, 0.4142135623731, 1.2247448713916)
	test2(orbit2, 90.0, -1.0, 1.73205080756888)
	test2(orbit2, 135.0, -2.4142135623731, 1.2247448713916)

	test2(orbit2, 180.0, -3.0, 0.0)
	test2(orbit2, 225.0, -2.4142135623731, -1.2247448713916)
	test2(orbit2, 270.0, -1.0, -1.73205080756888)
	test2(orbit2, 315.0, 0.4142135623731, -1.2247448713916)

	// Tests for very eccentric orbits.
	const orbit3 = new KeplerianOrbit(4.0, 0.75)

	test2(orbit3, 0.0, 1.0, 0.0)
	test2(orbit3, 45.0, -0.1715728752538, 1.870828693387)
	test2(orbit3, 90.0, -3.0, 2.64575131106459)
	test2(orbit3, 135.0, -5.8284271247462, 1.870828693387)

	test2(orbit3, 180.0, -7.0, 0.0)
	test2(orbit3, 225.0, -5.8284271247462, -1.870828693387)
	test2(orbit3, 270.0, -3.0, -2.64575131106459)
	test2(orbit3, 315.0, -0.1715728752538, -1.870828693387)
}
