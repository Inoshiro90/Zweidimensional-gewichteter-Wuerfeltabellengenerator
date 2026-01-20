function normal2D(x, y, mx, my, sx, sy) {
	return Math.exp(-((x - mx) ** 2 / (2 * sx ** 2) + (y - my) ** 2 / (2 * sy ** 2)));
}
