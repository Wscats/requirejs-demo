require.config({
		//可以把下面共同指向js文件夹写在这个位置
		baseUrl: 'js',
		//path可以让我省略冗长的地址信息
		paths: {
			//可以配置多个路径，当js请求不成功，可以有备选路径
			jquery: ["http://wsa.wsscat.com/jquery", "jquery"],
			//define中再依赖其他模块
			a: "wsscat",
			//define遵从AMD的写法
			b: "wsscat2",
			//export一个对象
			c: "wsscat3",
			//export一个函数
			d: "wsscat4",
			//init暴露多个变量
			e: "wsscat5"
		},
		//非AMD规范时候的兼容写法
		//export暴露出对应的对象和方法
		shim: {
			c: {
				//导出对象
				exports: "obj",
			},
			d: {
				//导出方法
				exports: "fun4"
			},
			e: {
				//导入多个变量
				init: function() {
					return {
						fun5: fun5,
						fun6: fun6
					}
				}
			}
		}
	})
	//注入对应依赖，当依赖都请求成功后执行对应的回调函数
require(["jquery", "a", "c", "d", "e"], function($, a, c, d, e) {
	console.log($('span'));
	$('span').css('color', '#673AB7');
	console.log(a.f3());
	console.log(c);
	console.log(d);
	console.log(e);
});