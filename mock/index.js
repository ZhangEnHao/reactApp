const express = require('express'); //引入express模块
const Mock = require('mockjs'); //引入mock模块
const modules = require('./modules');

let app = express(); //实例化express··

/**
 * 配置路由
 * @param  {[type]} req  [客户端发过来的请求所带数据]
 * @param  {[type]} res  [服务端的相应对象，可使用res.send返回数据，res.json返回json数据，res.down返回下载文件]
 */

app.use('/api/DataOne', function (req, res) {
	res.json(Mock.mock({
		'code': 200,
		'data|1-9': [{
			'key|+1': 1,
			'mockTitle|1': ['肆无忌惮'],
			'mockContent|1': ['角色精湛主题略荒诞', '理由太短 是让人不安', '疑信参半 却无比期盼', '你的惯犯 圆满', '别让纠缠 显得 孤单'],
			'mockAction|1': ['下载', '试听', '喜欢']
		}],
		'message': ''
	}))
})
// 为每个具体的配置创建监听
for(let i=0;i<modules.length;i++){
		let item = modules[i];
    app.all(item.router, function(req, res) {
        res.json(item.data());
    });
}

//解决跨域问题
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	next();
});

/**
 * 监听8080端口
 **/
app.listen('8080', () => {
	console.log('监听端口 8080')
})

