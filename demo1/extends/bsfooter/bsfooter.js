define(["jquery","text!./bsfooter.html","text!./bsfooter.css"],
	function($,html) {
		var html = html;
		return $.fn.extend({
			bsfooter: function(option) {
				return this.each(function() {
					$(this).html(html);
				});
			}
		});
	}
)