<template>
  	<div id="app">
    	
    	<router-view></router-view>
    	<Footer></Footer>
    	
    	
  	</div>
</template>

<script>
import Footer from "./components/common/Footer.vue"
export default {
  name: 'App',
  components: {
  	Footer
  }
}
</script>

<style>
#app {
	color: #2c3e50;
}
</style>
