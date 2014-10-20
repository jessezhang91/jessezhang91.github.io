$(document).ready(function () {
	var layers = 10;
	var contactSlideStart = 2;

	var jsOverride = ($(".layer-bg")[0].getBoundingClientRect().width != $(".layer-bg").width());
	if (jsOverride) {
		initSlides();
	}

	$(window).on("resize", function () {
		$(".container").trigger("scroll");
	});
	$(".container").on("scroll", function () {
		var viewHeight = $(window).height();

		handleContact(viewHeight);
		if (jsOverride) {
			handleSlides(viewHeight);
		}
	}).trigger("scroll");

	function handleContact(viewHeight) {
		var contact = $(".contact"),
			scroll = $(".container").scrollTop(),
			height = contact.outerHeight() * 1.1; // 1.1 due to fonts loading, might not be exact size when initialized

		var position = (scroll - viewHeight * (contactSlideStart - 1)) / viewHeight * height;

		contact.css("bottom", Math.min(0, position));
	}

	function initSlides() {
		$(".slide .layer").each(function () {
			var layer = $(this).attr("class").match(/layer-([\w]+)/i);
			if (layer) {
				if (layer[1] == "bg") {
					layer = layers;
				} else {
					layer = Number(layer[1]);
				}
				$(this).data("layer", layer);
			}
			$(this).css("transform", "translateZ(0)");
		});
	}

	function handleSlides(viewHeight) {
		$(".slide").each(function () {
			var rect = this.getBoundingClientRect();
			if (inView(rect, viewHeight)) {
				handleSlide(this, rect.top, viewHeight);
			}
		});
	}

	function handleSlide(slide, scroll, viewHeight) {
		$(slide).find(".layer").each(function () {
			var $this = $(this),
				z = $this.data("layer");
			$this.css("top", -scroll * z / (layers + 1));
		});
	}

	function inView(rect, viewHeight) {
		var top = rect.top,
			height = rect.height;
		if (top + height < 0 || top > viewHeight) {
			return false;
		}
		return true;
	}
});