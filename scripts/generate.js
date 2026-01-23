// function generate() {
// 	const preset = document.getElementById('sigmaPreset').value;
// 	const xS = parseScale('scaleX');
// 	const yS = parseScale('scaleY');
// 	const size = 100;
// 	const minOne = (minOneCheckbox = document.getElementById('minOne').checked);
// 	const mx = Number(meanX.value),
// 		my = Number(meanY.value);

// 	let sigmaFactor;

// 	switch (preset) {
// 		case 'sehr steil':
// 			sigmaFactor = 10;
// 			break;
// 		case 'steil':
// 			sigmaFactor = 8;
// 			break;
// 		case 'flach':
// 			sigmaFactor = 4;
// 			break;
// 		case 'sehr flach':
// 			sigmaFactor = 2;
// 			break;
// 		case 'normal':
// 		default:
// 			sigmaFactor = 6;
// 	}

// 	console.log('Sigma Factor:', preset, sigmaFactor);

// 	const sx = xS.length / sigmaFactor;
// 	const sy = yS.length / sigmaFactor;

// 	let weights = [],
// 		values = [];
// 	for (let y = 0; y < yS.length; y++) {
// 		values[y] = [];
// 		for (let x = 0; x < xS.length; x++) {
// 			const v = normal2D(x, y, mx, my, sx, sy);
// 			values[y][x] = v;
// 			weights.push(v);
// 		}
// 	}

// 	const unitsFlat = distributeUnits(weights, size, minOne);
// 	let idx = 0,
// 		slots = [],
// 		json = {},
// 		current = 1;

// 	let header = '<tr><th></th>' + xS.map((v) => `<th>${v}</th>`).join('') + '</tr>';
// 	let rT = header,
// 		sT = header,
// 		pT = header;

// 	const totalW = weights.reduce((a, b) => a + b, 0);

// 	for (let y = 0; y < yS.length; y++) {
// 		rT += `<tr><th>${yS[y]}</th>`;
// 		sT += `<tr><th>${yS[y]}</th>`;
// 		pT += `<tr><th>${yS[y]}</th>`;

// 		for (let x = 0; x < xS.length; x++) {
// 			const u = unitsFlat[idx];
// 			const percent = (values[y][x] / totalW) * 100;
// 			let from = 0,
// 				to = 0,
// 				label = '0';

// 			if (u > 0) {
// 				from = current;
// 				to = current + u - 1;
// 				label = u === 1 ? from : `${from}-${to}`;
// 				json[from] = {
// 					nameX: xS[x],
// 					nameY: yS[y],
// 					from,
// 					to,
// 					slots: u,
// 					percent: +percent.toFixed(2),
// 				};
// 				current += u;
// 			}

// 			rT += `<td>${label}</td>`;
// 			sT += `<td>${u}</td>`;
// 			pT += `<td>${percent.toFixed(2).replace('.', ',')}</td>`;
// 			idx++;
// 		}
// 		rT += '</tr>';
// 		sT += '</tr>';
// 		pT += '</tr>';
// 	}

// 	rangeTable.innerHTML = `<table class="table table-bordered">${rT}</table>`;
// 	slotTable.innerHTML = `<table class="table table-bordered">${sT}</table>`;
// 	percentTable.innerHTML = `<table class="table table-bordered">${pT}</table>`;
// 	jsonOutput.value = JSON.stringify(json, null, 2);
// }

// function copyTableToClipboard(tableContainerId) {
// 	const container = document.getElementById(tableContainerId);
// 	if (!container) return;

// 	const table = container.querySelector('table');
// 	if (!table) return;

// 	let text = '';

// 	for (const row of table.rows) {
// 		const cells = Array.from(row.cells).map((cell) =>
// 			cell.innerText.replace(/\s+/g, ' ').trim(),
// 		);
// 		text += cells.join('\t') + '\n';
// 	}

// 	navigator.clipboard.writeText(text);
// }

// function copyJSONToClipboard(textareaId) {
// 	const textarea = document.getElementById(textareaId);
// 	if (!textarea) return;

// 	navigator.clipboard.writeText(textarea.value);
// }

function generate() {
	const preset = document.getElementById('sigmaPreset').value;
	const xS = parseScale('scaleX');
	const yS = parseScale('scaleY');
	const size = 100;
	const enforceMinOne = document.getElementById('minOne').checked;
	const mx = Number(meanX.value);
	const my = Number(meanY.value);

	let sigmaFactor;
	switch (preset) {
		case 'sehr steil':
			sigmaFactor = 10;
			break;
		case 'steil':
			sigmaFactor = 8;
			break;
		case 'flach':
			sigmaFactor = 4;
			break;
		case 'sehr flach':
			sigmaFactor = 2;
			break;
		case 'normal':
		default:
			sigmaFactor = 6;
	}

	const sx = xS.length / sigmaFactor;
	const sy = yS.length / sigmaFactor;

	// --- Gewichte berechnen ---
	let weights = [];
	let values = [];

	for (let y = 0; y < yS.length; y++) {
		values[y] = [];
		for (let x = 0; x < xS.length; x++) {
			const v = normal2D(x, y, mx, my, sx, sy);
			values[y][x] = v;
			weights.push(v);
		}
	}

	// --- Slots verteilen ---
	const unitsFlat = distributeUnits(weights, size, enforceMinOne);

	let idx = 0;
	let current = 1;
	let json = {};
	let jsonIndex = 1;

	const totalWeight = weights.reduce((a, b) => a + b, 0);

	// Tabellenköpfe
	let header = '<tr><th></th>' + xS.map((v) => `<th>${v}</th>`).join('') + '</tr>';

	let rangeTableHTML = header;
	let slotTableHTML = header;
	let percentTableHTML = header;

	for (let y = 0; y < yS.length; y++) {
		rangeTableHTML += `<tr><th>${yS[y]}</th>`;
		slotTableHTML += `<tr><th>${yS[y]}</th>`;
		percentTableHTML += `<tr><th>${yS[y]}</th>`;

		for (let x = 0; x < xS.length; x++) {
			const slots = unitsFlat[idx];
			const percent = totalWeight > 0 ? (values[y][x] / totalWeight) * 100 : 0;

			let label = '0';

			if (slots > 0) {
				const from = current;
				const to = current + slots - 1;

				label = slots === 1 ? `${from}` : `${from}-${to}`;

				json[jsonIndex] = {
					nameX: xS[x],
					nameY: yS[y],
					from,
					to,
					slots,
					percent: +percent.toFixed(2),
				};

				jsonIndex++;
				current += slots;
			}

			rangeTableHTML += `<td>${label}</td>`;
			slotTableHTML += `<td>${slots}</td>`;
			percentTableHTML += `<td>${percent.toFixed(2).replace('.', ',')}</td>`;

			idx++;
		}

		rangeTableHTML += '</tr>';
		slotTableHTML += '</tr>';
		percentTableHTML += '</tr>';
	}

	// Sicherheitscheck
	if (current !== size + 1) {
		console.warn(
			'Skala nicht vollständig oder überlaufend:',
			'current =',
			current,
			'expected =',
			size + 1,
		);
	}

	rangeTable.innerHTML = `<table class="table table-bordered">${rangeTableHTML}</table>`;
	slotTable.innerHTML = `<table class="table table-bordered">${slotTableHTML}</table>`;
	percentTable.innerHTML = `<table class="table table-bordered">${percentTableHTML}</table>`;

	jsonOutput.value = JSON.stringify(json, null, 2);
}
