function parseScale(id) {
	return document
		.getElementById(id)
		.value.split(',')
		.map((v) => v.trim());
}
