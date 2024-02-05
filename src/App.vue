<script setup>
import BiomeList from './components/BiomeList.vue'
import ColorList from './components/ColorList.vue'
import Preview from './components/Preview.vue'
</script>

<template>
	<header>
		<button @click="loadFile()">Import Config</button>
		<button @click="generate()">Generate</button>
		<button @click="save()">Save</button>
	</header>
	<main>
		<div id="biome_list" v-if="data">
			<ul>
				<li v-for="(biome_data, biome_id) in biomes" :key="biome_id" :class="{selected: selected_biome == biome_id}" @click="select(biome_id, selected_map)">
					{{ biome_id }}
				</li>
			</ul>
		</div>
		<div id="map_list" v-if="data && selected_biome">
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
import {downloadPackage, generateMaps, importFile} from './scripts/generate'
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
}
main {
	display: flex;
	flex-direction: row;
	flex-grow: 1;
}
#biome_list {
	width: 30%;
	border-right: 1px solid #445;
}
#map_list {
	width: 30%;
	border-right: 1px solid #445;
}
#preview {
	width: 40%;
}
li {
	cursor: pointer;
	padding: 4px;
}
li.selected {
	background-color: #3d3d3e;
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
