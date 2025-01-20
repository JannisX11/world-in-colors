<script setup>
import Preview from './components/Preview.vue'
</script>

<template>
	<header>
		<button @click="newProject()">New Project</button>
		<button @click="loadFile()">Import Config</button>
		<button @click="generate(); save()" class="export_button">Export Colors</button>
	</header>
	<main>
		<div id="biome_list" class="panel" v-if="data">
			<h2>BIOMES</h2>
			<ul>
				<li v-for="(biome_data, biome_id) in biomes" :key="biome_id" :class="{selected: selected_biome == biome_id}" @click="select(biome_id, selected_map)">
					{{ biome_id }}
				</li>
			</ul>
		</div>
		<div id="map_list" class="panel" v-if="data && selected_biome">
			<ul>
				<li v-for="(map, map_id) in color_maps" :key="map_id" :class="{selected: selected_map == map_id}" @click="select(selected_biome, map_id)">
					{{ map_id }}
					<div class="color_preview" :style="{backgroundColor: selected_biome ? data[selected_biome][map_id] : ''}" />
				</li>
			</ul>
			<Chrome id="color_picker" v-model="selected_color" />
		</div>
		<Preview id="preview" v-if="data && selected_biome" :biomecolors="data && data[selected_biome]" :biome_id="selected_biome" />
	</main>
</template>

<script>
import {downloadPackage, generateMaps, getEmptyProject, importFile} from './scripts/generate'
import {Chrome} from '@ckpack/vue-color';

export default {
	components: {
		Chrome
	},
	data() {return {
		color_maps: {
			grass: {},
			birch: {},
			evergreen: {},
			foliage: {},
		},
		selected_color: '#000000',
		data: null,
		selected_biome: '',
		selected_map: 'grass'
	}},
	watch: {
		selected_color(color) {
				console.log(color, color.hex)
			if (this.data && this.selected_biome && this.selected_map && color.hex) {
				this.data[this.selected_biome][this.selected_map] = color.hex;
			}
		}
	},
	computed: {
		biomes() {
			return this.data ? this.data : {};
		}
	},
	methods: {
		async loadFile() {
			let data = await importFile();
			if (data) this.data = data;
		},
		newProject() {
			this.data = getEmptyProject();
		},
		generate() {
			generateMaps(this.data)
		},
		save() {
			downloadPackage()
		},
		select(biome, map) {
			this.selected_biome = biome;
			this.selected_map = map;
			if (this.selected_color && this.selected_map) {
				this.selected_color = this.data[this.selected_biome][this.selected_map];
			}
		}
	}
}
</script>

<style scoped>
header {
	line-height: 1.5;
	gap: 4px;
	padding: 4px;
	display: flex;
}
header button {
	padding: 8px 10px;
}
button.export_button {
	background-color: #97df58;
    color: #141414;
	margin-left: auto;
}
button.export_button:hover {
	background-color: #c0f878;
    color: #141414;
	margin-left: auto;
}


main {
	display: flex;
	flex-direction: row;
	flex-grow: 1;
}
.panel {
	width: 30%;
}
#biome_list {
	border-right: 1px solid #445;
}
#map_list {
	border-right: 1px solid #445;
}
#preview {
	width: 40%;
}
.panel h2 {
	padding: 2px 10px;
}
.panel ul {
	padding: 4px;
}
.panel ul li {
	cursor: pointer;
	padding: 6px 10px;
    border-radius: 6px;
}
.panel ul li:hover {
	color: var(--color-text-highlight);
}
.panel ul li.selected {
	background-color: #3d3d3e;
	color: var(--color-text-highlight);
}
.color_preview {
	height: 22px;
	min-width: 100px;
	display: inline-block;
}
#color_picker {
	width: calc(100% - 25px);
	margin: auto;
	margin-top: 30px;
}



</style>
