import { compileJSON, IO } from "./util";

const MAPS = {
	birch: true,
	evergreen: true,
	foliage: true,
	grass: true,
	//mangrove_swamp_foliage
	//swamp_foliage
	//swamp_grass
}
const BIOME_COORDS = {
	plains: [50, 173],
	birch_forest: [101, 162],
	jungle: [11, 36],
	jungle_edge: [12, 60],
	mushroom: [25, 25],
	//held_block: [127, 127],
	forest: [75, 111],
	//taiga: [177, 192],
	taiga: [191, 203],
	mega_taiga: [177, 193],
	water: [127, 191],
	extreme_hills: [203, 239],
	savanna: [0, 255],
	meadow: [178, 193],
	snow: [254, 254],
}

export const VANILLA_COLORS = {
	"plains": {
		"grass": "#91bc58",
		"foliage": "#77ab2e",
		"evergreen": "#619961",
		"birch": "#80a755"
	},
	"birch_forest": {
		"grass": "#88ba66",
		"foliage": "#6ba941",
		"evergreen": "#619961",
		"birch": "#80a755"
	},
	"jungle": {
		"grass": "#58cb3b",
		"foliage": "#30bb0b",
		"evergreen": "#619961",
		"birch": "#80a755"
	},
	"jungle_edge": {
		"grass": "#63c83f",
		"foliage": "#3eb80f",
		"evergreen": "#619961",
		"birch": "#80a755"
	},
	"mushroom": {
		"grass": "#55ca3f",
		"foliage": "#2bbb0f",
		"evergreen": "#619961",
		"birch": "#80a755"
	},
	"held_block": {
		"grass": "#7cbb6c",
		"foliage": "#5bab46",
		"evergreen": "#619961",
		"birch": "#80a755"
	},
	"forest": {
		"grass": "#79bf5a",
		"foliage": "#58af30",
		"evergreen": "#619961",
		"birch": "#80a755"
	},
	"taiga": {
		"grass": "#86b67f",
		"foliage": "#68a464",
		"evergreen": "#619961",
		"birch": "#80a755"
	},
	"mega_taiga": {
		"grass": "#86b67f",
		"foliage": "#68a55e",
		"evergreen": "#619961",
		"birch": "#80a755"
	},
	"water": {
		"grass": "#8db871",
		"foliage": "#71a74d",
		"evergreen": "#619961",
		"birch": "#80a755"
	},
	"extreme_hills": {
		"grass": "#8ab488",
		"foliage": "#6da36b",
		"evergreen": "#619961",
		"birch": "#80a755"
	},
	"meadow": {
		"grass": "#86b67f",
		"foliage": "#68a55f",
		"evergreen": "#619961",
		"birch": "#80a755"
	},
	"savanna": {
		"grass": "#beb654",
		"foliage": "#aea42a",
		"evergreen": "#619961",
		"birch": "#80a755"
	},
	"snow": {
		"grass": "#80b496",
		"foliage": "#60a17b",
		"evergreen": "#619961",
		"birch": "#80a755"
	}
}

import JSZip from 'jszip'
import { saveAs } from "file-saver";

let last_exported;

export async function importFile() {
	let [file] = await new Promise(resolve => {
		IO.import({
			extensions: ['json'],
		}, resolve)
	})
	console.log(file)


	let config = JSON.parse(file.content);
	let all = JSON.parse(JSON.stringify(VANILLA_COLORS))
	for (let biome in all) {
		for (let map_type in all[biome]) {
			if (config.biomes[biome] && config.biomes[biome][map_type]) {
				all[biome][map_type] = config.biomes[biome][map_type];
			}
		}
	}
	console.log(all)
	return all;
}

export async function generateMaps(biome_data) {

	let zip = new JSZip();
	console.log(biome_data)

	for (let map_type in MAPS) {

		let canvas = document.createElement('canvas');
		let ctx = canvas.getContext('2d');
		canvas.width = canvas.height = 256;
		ctx.fillStyle = 'black';
		ctx.fillRect(0, 0, 256, 256)

		for (let biome_id in biome_data) {
			if (!BIOME_COORDS[biome_id]) console.warn(`"${biome_id}" is not a supported biome`);
		}
		for (let biome_id in VANILLA_COLORS) {
			let coords = BIOME_COORDS[biome_id];
			if (!coords) continue;
			console.log(biome_id, coords)
			let r = 4;
			let color = (biome_data[biome_id] && biome_data[biome_id][map_type]) || VANILLA_COLORS[biome_id][map_type];
			ctx.fillStyle = color;
			ctx.fillRect(coords[0] - r, coords[1] - r, r*2+1, r*2+1);
		}

		let data_url = canvas.toDataURL();
		zip.file(`${map_type}.png`, data_url.split(',')[1], {base64: true});
		console.log(canvas);
	}

	let config_content = compileJSON({biomes: biome_data});
	zip.file('_worldincolors.json', config_content);

	zip.generateAsync({type: 'blob'}).then(function(content) {
		console.log(content);
		last_exported = content;
	});
}

export function downloadPackage() {
	if (last_exported) {
		saveAs(last_exported, 'colors.zip');
	}
}
