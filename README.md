**require.js加载js文件的好处**

 1. 可以防止JS加载时候阻塞页面渲染（JS运行时候DOM停止渲染的情况）
 2. 使用require.js调用的方式加载JS，不用在像以前那样多个`<script>`标签引入JS文件

所有代码的目录结构如图
![这里写图片描述](http://img.blog.csdn.net/20160802220949367)
[代码存放的Github地址](https://github.com/Wscats/requirejs-demo)

## 传统的引入
**start.html**
```
<!DOCTYPE html>
<html>
	<head>
		<script type="text/javascript" src="js/require.js"></script>
		<script type="text/javascript" src="js/a.js" ></script>
	</head>
	<body>
		<p>wsscat</p>
	</body>
</html>
```
传统方法引入可以看到会先弹出alert，内容被阻塞没有渲染

**a.js**
```
function cat(){
   alert("hello");
}

cat();
```

## require.js的引入
**start.html**
```
<!DOCTYPE html>
<html>
	<head>
		<script type="text/javascript" src="js/require.js"></script>
		<script>
			require(["js/a"]);
		</script>
	</head>
	<body>
		<p>wsscat</p>
	</body>
</html>
```

**a.js**
```
define(function(){
    function cat(){
      alert("hello");
    }

    cat();
})
```
现在应require里面写可以避免以前的写法导致alert弹窗时候页面的`p`标签内容被阻塞无法渲染

现在这种写法格式是用define定义一个模块，并在页面中调用require方法引入

要注意的是，require接受的是一个数组，它注入的依赖是一个数组，哪怕数组只有一个依赖，而它第二个参数则可以传入一个回调函数，就是党数组中的依赖都加载完毕后，执行这个回调函数，比如我们可以加载jQuery的依赖，然后再回调函数中调用jQuery的库

```
require(["js/a"]);
```
## config方法
我们可以在上面代码上继续改进，可以用require.js的config方法，通过paths属性，就不用每次都写这么长的引入地址，有点像angular的服务注册，然后在控制器中注入相应的服务

**base.js**
```
require.config({
	paths:{
		"jq":["http://wsa.wsscat.com/jquery","js/jquery"],
		"a":"js/wsscat"
	}
})
```
注意加载模块时不用写.js后缀，写了会报错
我们可以把配置这样引入到主页里面
```
<script type="text/javascript" src="js/require.js"></script>
<script type="text/javascript" src="js/base.js" ></script>
```
##path属性
用paths还有一个好处就是让我们配置多个路径去加载js，当我们请求第一个路径不成功时候，可以继续往后面请求第二个js路径代替
![这里写图片描述](http://img.blog.csdn.net/20160802130441636)

##data-main
我们还可以这样引入，在require引入的script标签中加入**data-main**属性，后面就不用在显式用`<script>`标签引入其他脚本文件了
```
<script type="text/javascript" data-main="js/base" src="js/require.js"></script>
```

**base.js**
```
require.config({
	baseUrl:'js',
	paths:{
		jq:["http://wsa.wsscat.com/jquery","jquery"],
		a:"wsscat"
	}
})
require(["jq","a"],function(){
	$('span').css('color','#673AB7');
});
```
可以看到已经成功加载到我们所需要的依赖了
![这里写图片描述](http://img.blog.csdn.net/20160802151550959)

RequireJS的模块语法允许它尽快地加载多个模块，虽然加载的顺序不定，但依赖的顺序最终是正确的，就是说模块是异步不按顺序加载，但使用的时候只要依赖的顺序正确那就会按依赖摆放的顺序执行

上面我们可以把之前的代码改进成这样，用define采用AMD规范，把方法写进模块里面，并以对象传递出来
**wsscat.js**
```
define(
	function() {
		function fun1() {
			alert("wsscat");
		}

		function fun2() {
			alert("autumns");
		}
		return {
			f1: fun1,
			f2: fun2
		}
	}
)
```
**base.js**
```
require.config({
	baseUrl: 'js',
	paths: {
		jquery: ["http://wsa.wsscat.com/jquery", "jquery"],
		a: "wsscat"
	},
})
require(["jquery", "a"], function($, a) {
	console.log($('span'));
	$('span').css('color', '#673AB7');
	console.log(a);
});
```
然后注入a的JS，并依赖此服务，是输出a，就能看到我们刚才模块给的对象里面的两个函数
![这里写图片描述](http://img.blog.csdn.net/20160802181235976)

##模块依赖另一个模块
如果我们在一个依赖中还要再去依赖另一个JS，理解来相当于angular在服务中还需要注入其他服务来扩展
我们就可以继续这样改，在define中加入一个数组，让我们想把需要的依赖给填充进去，记得回调函数里面需要把这个依赖也加进去形参里面
**wsscat.js**

```
define(['wsscat2'],
	function(wsscat2) {
		function fun1() {
			alert("wsscat");
		}

		function fun2() {
			alert("autumns");
		}
		
		return {
			f1:fun1,
			f2:fun2,
			f3:wsscat2.f1
		}
	}
)
```
**wsscat2.js**
```
define(
	function() {
		function fun1() {
			return "wsscat2.js's wsscat";
		}

		function fun2() {
			return "wsscat2.js's autumns";
		}
		return {
			f1:fun1,
			f2:fun2
		}
	}
)
```
上面我们就完成了wsscat这个模块依赖了wsscat2模块，然后再次输出新的对象方法
![这里写图片描述](http://img.blog.csdn.net/20160802194021644)

##shim(非AMD写法的兼容)导入单个变量
当我们遇到非AMD兼容写法的时候，我们要可以用exports方法，注意的是export方法只能输出一个方法或者对象
**base.js**
```
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
		d: "wsscat4"
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
		}
	}
})
//注入对应依赖，当依赖都请求成功后执行对应的回调函数
require(["jquery", "a", "c", "d"], function($, a, c, d) {
	console.log($('span'));
	$('span').css('color', '#673AB7');
	console.log(a.f3());
	console.log(c);
	console.log(d);
});
```
wsscat3.js

```
function fun1() {
	return "wsscat3.js's wsscat";
}

function fun2() {
	return "wsscat3.js's autumns";
}
var obj = {
	f1: fun1,
	f2: fun2
}
```
wsscat4

```
function fun4() {
	return "wsscat4.js's wsscat";
}
```
上面我们就可以用exports方法分别把wsscats3和wsscat4里面的对象和方法暴露出来了

##init(非AMD写法的兼容)导入多个变量

```
e: {
				init: function() {
					return {
						fun5: fun5,
						fun6: fun6
					}
				}
			}
```
我们可以用init方法来导入多个变量，比shim属性导入单个零活，注意return里面的属性值是没有双引号的
