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