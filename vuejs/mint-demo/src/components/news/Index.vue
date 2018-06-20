<template>
	<div>
		<mt-header fixed title="新闻"></mt-header>
		
		<div class="container">
			<h1>
				<router-link to="/news/list/0">全部</router-link>
			</h1>
			<h1>
				<router-link to="/news/list/1">推荐</router-link>
			</h1>
			<h1>
				<router-link to="/news/list/2">热点</router-link>
			</h1>
		</div>
	</div>
</template>

<script>

</script>

<style>
.container {
	margin-top: 40px;
}
</style>