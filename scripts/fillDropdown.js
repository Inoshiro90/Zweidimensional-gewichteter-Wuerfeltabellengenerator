const scaleX = document.getElementById('scaleX');
const scaleY = document.getElementById('scaleY');
const meanX = document.getElementById('meanX');
const meanY = document.getElementById('meanY');

function getScaleX() {
	return scaleX.value
		.split(',')
		.map((c) => c.trim())
		.filter(Boolean);
}

function getScaleY() {
	return scaleY.value
		.split(',')
		.map((c) => c.trim())
		.filter(Boolean);
}

function updateScaleX() {
	const selectX = meanX;
	const scaleX = getScaleX();
	const oldIndex = selectX.selectedIndex;

	selectX.innerHTML = '';
	scaleX.forEach((c, i) => {
		const opt = document.createElement('option');
		opt.value = i;
		opt.textContent = c;
		selectX.appendChild(opt);
	});

	selectX.selectedIndex =
		oldIndex >= 0 && oldIndex < scaleX.length ? oldIndex : Math.floor(scaleX.length / 2);
}

function updateScaleY() {
	const selectY = meanY;
	const scaleY = getScaleY();
	const oldIndex = selectY.selectedIndex;

	selectY.innerHTML = '';
	scaleY.forEach((c, i) => {
		const opt = document.createElement('option');
		opt.value = i;
		opt.textContent = c;
		selectY.appendChild(opt);
	});

	selectY.selectedIndex =
		oldIndex >= 0 && oldIndex < scaleY.length ? oldIndex : Math.floor(scaleY.length / 2);
}

scaleX.addEventListener('change', updateScaleX);
scaleY.addEventListener('change', updateScaleY);
updateScaleX();
updateScaleY();
