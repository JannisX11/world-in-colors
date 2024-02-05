<template>
	<div id="color_preview">
		<ul>
			<li v-for="(texture, key) in texture_previews" :key="key">
				<label>{{key}}</label>
				<div class="preview_rect">
					<img :src="texture.src" height="112" />
					<div class="color_overlay" :style="{backgroundColor: biomecolors[texture.map]}"></div>
					<div class="color_shade" v-if="texture.shade" />
				</div>
				<div class="preview_rect">
					<img :src="texture.src" height="112" />
					<div class="color_overlay" :style="{backgroundColor: vanilla_colors[biome_id][texture.map]}"></div>
					<div class="color_shade" v-if="texture.shade" />
				</div>
			</li>
		</ul>
	</div>
</template>

<script>
import { VANILLA_COLORS } from './../scripts/generate'
export default {
	props: {
		biome_id: String,
		biomecolors: Object
	},
	data() {return {
		vanilla_colors: JSON.parse(JSON.stringify(VANILLA_COLORS)),
		texture_previews: {
			oak: {src: 'src/assets/leaves_oak.png', map: 'foliage', shade: true},
			birch: {src: './src/assets/leaves_birch.png', map: 'birch', shade: true},
			evergreen: {src: 'src/assets/leaves_spruce.png', map: 'evergreen', shade: true},
			tallgrass: {src: 'src/assets/tallgrass.png', map: 'grass'},
			grass: {src: 'src/assets/grass_top.png', map: 'grass', shade: true},
		}
	}}
}
</script>

<style scoped>
	li > label {
		display: block;
	}
	.preview_rect {
		position: relative;
		--size: 112px;
		height: var(--size);
		width: var(--size);
		display: inline-block;
		background: black;
		filter: brightness(1.1);
	}
	img {
		image-rendering: pixelated;
	}
	.color_overlay {
		position: absolute;
		height: var(--size);
		width: var(--size);
		top: 0;
		mix-blend-mode: multiply;
	}
	.color_shade {
		position: absolute;
		bottom: 0;
		height: 37.5%;
		width: 100%;
		background: black;
		opacity: 0.32;
		mix-blend-mode: darken;
	}

</style>
