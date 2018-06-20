<template>
	<div>
		<mt-header fixed title="首页"></mt-header>
		<div class="container">
			{{$store.state.FooterTitle}}
		</div>
	</div>
</template>

<script>
import store from "../../store/index.js"

export default {
	data(){
	
	},
	store
}
</script>

<style>
.container {
	margin-top: 40px;
}
</style>