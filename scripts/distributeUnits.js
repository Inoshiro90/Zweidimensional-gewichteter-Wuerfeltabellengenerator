function distributeUnits(weights, total, minOne) {
	const n = weights.length;
	let units = new Array(n).fill(minOne ? 1 : 0);
	let rest = total - (minOne ? n : 0);
	const sum = weights.reduce((a, b) => a + b, 0);
	let raw = weights.map((w) => (w / sum) * rest);
	let base = raw.map(Math.floor);
	let frac = raw.map((v, i) => ({i, r: v - base[i]}));
	base.forEach((v, i) => (units[i] += v));
	rest -= base.reduce((a, b) => a + b, 0);
	frac.sort((a, b) => b.r - a.r);
	for (let i = 0; i < rest; i++) units[frac[i].i]++;
	return units;
}
