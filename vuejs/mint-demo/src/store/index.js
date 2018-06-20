import Vue from 'vue';
import Vuex from 'vuex'

Vue.use(Vuex);

const state = {
	FooterTitle: ["首页", "新闻", "收藏", "我的"]
}
export default new Vuex.Store({
	state
})