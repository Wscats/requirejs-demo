require.config({
	//可以把下面共同指向js文件夹写在这个位置
	baseUrl: 'js',
	//path可以让我省略冗长的地址信息
	paths: {
		//可以配置多个路径，当js请求不成功，可以有备选路径
		//jquery: ["http://wsa.wsscat.com/jquery", "jquery"],
		text: ["text"],
		jquery: ["jquery"],
		test: ["test"],
		bsheader: "../extends/bsheader/bsheader",
		bsmain: "../extends/bsmain/bsmain",
		bsfooter: "../extends/bsfooter/bsfooter",
		bsmodal: "../extends/bsmodal/bsmodal"
	}
})
//注入对应依赖，当依赖都请求成功后执行对应的回调函数
require(["jquery", "text", "bsheader", "bsmain", "bsfooter", "test"], function($, text, bsheader, bsmain, bsfooter, test) {
	console.log(test); //undefined
	console.log(text);
	$("bsheader").bsheader();
	$("bsmain").bsmain();
	$("bsfooter").bsfooter();
});