<template>
	
	<div>
		<mt-header fixed title="新闻列表"></mt-header>
		<div class="container">
			<ul>
				<li v-for="item in arr">{{item.title}}</li>
			</ul>
		</div>
	</div>
	
</template>

<script>
export default {
	data(){
		return {
			arr: []
		}
	},
	mounted(){
		var type = this.$route.params.type;
		this.$http.get('/api/news/list?type=' + type)
		  	 .then(function (res) {
		  	     this.arr = res.data[type];
		  	 })
		  	 .catch(function (error) {
		         console.log(error);
		     });
	}
}
</script>

<style>
.container {
	margin-top: 40px;
}
</style>