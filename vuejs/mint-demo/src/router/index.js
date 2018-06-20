import Vue from 'vue'
import Router from 'vue-router'
import HomeIndex from '@/components/home/index'
import NewsIndex from '@/components/news/index'
import NewsList from '@/components/news/list'
import CollectIndex from '@/components/collect/index'
import MyIndex from '@/components/my/index'

Vue.use(Router)

export default new Router({
	routes: [
	    {
	    	path: '/',
	    	name: 'home',
	    	component: HomeIndex
	    },
	    {
	    	path: '/home',
	    	name: 'home',
	    	component: HomeIndex
	    },
	    {
	    	path: '/news',
	    	name: 'news',
	    	component: NewsIndex
	    },
	    {
	    	path: '/news/list/:type',
	    	name: 'newsList',
	    	component: NewsList
	    },
	    {
	    	path: '/collect',
	    	name: 'collect',
	    	component: CollectIndex
	    },
	    {
	    	path: '/my',
	    	name: 'my',
	    	component: MyIndex
	    },
    ]
})
