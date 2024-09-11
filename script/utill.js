/**
 * Creates a HTML DOM `Ellement` object from provided input.
 * - `tagName` - The DOM node _type_ of the ellement.
 * - `parent` - The _parent_ ellement to automaticaly be attached to.
 * - `id` - The _id_ of the ellement.
 * - `class` - The css _class_/_classes_ of the ellement.
 * - `innerHTML` - The inner _HTML_ content of the ellement.
 * - `childNodes` - The _child data_ of the ellement(Make is called recursively).
 *
 * @example
 * // creates a p tag node with content 'Hello'.
 * makeNode({ tagName: "p", innerHTML: "Hello" })
 *
 * @param {*} input - The node data.
 * @returns {Node|Node[]} Returns a node or array of nodes.
 */
function makeNode(input) {
	if (input instanceof Node) return input
	if (Array.isArray(input)) return input.map(e => makeNode(e))
	if (typeof input == "string") return document.createTextNode(input)

	const { tagName, parent, class: class_, childNodes, ...data } = input
	const e = document.createElement(tagName)
	if (data) for (const [key, value] of Object.entries(data)) e[key] = value

	if (class_) {
		if (typeof class_ === "string") e.classList.add(class_)
		else e.classList.add(...class_)
	}

	if (childNodes) {
		const parsed = makeNode(childNodes)
		if (Array.isArray(parsed)) parsed.forEach(n => e.appendChild(n))
		else e.appendChild(parsed)
	}

	if (parent) parent.appendChild(e)

	return e
}

/**
 * Removes all the child ellements of a HTML DOM `Node`.
 *
 * @param {Node} node - The node.
 */
function clearNode(node) {
	while (node.firstChild) node.removeChild(node.firstChild)
}
