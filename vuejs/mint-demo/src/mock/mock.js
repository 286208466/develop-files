import Mock from 'mockjs'

Mock.mock("/api/news/list", {
	"0": [
		{
			"title": "1",
			"content": "000"
		},
		{
			"title": "2",
			"content": "000"
		},
		{
			"title": "3",
			"content": "000"
		}
	],
	"1": [
		{
			"title": "1",
			"content": "1111"
		},
		{
			"title": "2",
			"content": "1111"
		},
		{
			"title": "3",
			"content": "1111"
		}
	]
})