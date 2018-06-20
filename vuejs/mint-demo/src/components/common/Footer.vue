<template>
	
	<footer>
		<mt-tabbar>
			<router-link to="/" tag="div">
		  		<mt-tab-item id="首页">
		    		首页
		  		</mt-tab-item>
		  	</router-link>
		  	<router-link to="/news" tag="div">
			  	<mt-tab-item id="新闻">
			    	新闻
			  	</mt-tab-item>
		  	</router-link>
		  	<router-link to="/collect" tag="div">
			  	<mt-tab-item id="收藏">
			    	收藏
			  	</mt-tab-item>
		  	</router-link>
		  	<router-link to="/my" tag="div">
		  	<mt-tab-item id="我的">
		    	我的
		  	</mt-tab-item>
		  	</router-link>
		</mt-tabbar>
	</footer>
	
</template>
<script>

</script>

<style>
.mint-tabbar>div {
	flex: 1;
}
</style>