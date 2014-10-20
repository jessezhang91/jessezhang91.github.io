$(document).ready(function () {
	/**
	 * Handle Menu
	 **/
	var scrollEase = 8,
		scrollMaxRatio = .25;

	$("a[href^='#']").each(function () {
		var $this = $(this),
			target = $this.attr("href").substr(1);
		$this.attr("href", null);
		$this.on("click", function () {
			var scroll = $(".container").scrollTop();
			window.location.hash = "#" + target;
			$(".container").trigger("scroll");
			$(".container").scrollTop(scroll);

			smoothScroll($("#" + target)[0].getBoundingClientRect().top + scroll);
		});
	});

	function smoothScroll(target) {
		var scrolling = true,
			$container = $(".container"),
			current = $container.scrollTop(),
			viewHeight = $(window).height(),
			scrollMax = scrollMaxRatio * viewHeight;

		setTimeout(function () {
			$(document).off("mousedown.stopSmoothScroll keydown.stopSmoothScroll mousewheel.stopSmoothScroll touchstart.stopSmoothScroll");
			$(document).one("mousedown.stopSmoothScroll keydown.stopSmoothScroll mousewheel.stopSmoothScroll touchstart.stopSmoothScroll", function (e) {
				scrolling = false;
				$(document).off("mousedown.stopSmoothScroll keydown.stopSmoothScroll mousewheel.stopSmoothScroll touchstart.stopSmoothScroll");
			});
		});

		var scroll = function () {
			current += Math.min(scrollMax, Math.abs(target - current) / scrollEase) * (target > current ? 1 : -1);
			if (Math.abs(current - target) < 1) {
				current = target;
				$(document).trigger("mousewheel");
			}
			$container.scrollTop(current);
			$(".container").trigger("scroll");
			if (scrolling) {
				window.requestAnimationFrame(scroll);
			}
		};
		window.requestAnimationFrame(scroll);
	}

	/**
	 * Handle scrolling
	 **/
	var layers = 10;
	var contactSlideStart = 2;

	var jsOverride = ($(".layer-bg")[0].getBoundingClientRect().width != $(".layer-bg").width());
	if (jsOverride) {
		initSlides();
	}

	$(window).on("resize", function () {
		$(".container").trigger("scroll");
	});
	$(".container").on("scroll", function (e) {
		var viewHeight = $(window).height(),
			scroll = $(".container").scrollTop();

		handleMenu(scroll);
		handleContact(scroll, viewHeight);
		if (jsOverride) {
			handleSlides(viewHeight);
		}
	}).trigger("scroll");

	/**
	 * Menu/Contact repositioning
	 **/
	function handleMenu(scroll) {
		$(".menu-container").css("top", scroll);
	}

	function handleContact(scroll, viewHeight) {
		var contact = $(".contact"),
			height = contact.outerHeight() * 1.1; // 1.1 due to fonts loading, might not be exact size when initialized

		var position = (scroll - viewHeight * (contactSlideStart - 1)) / viewHeight * height;

		contact.css("bottom", Math.min(0, position) - scroll);
	}

	/**
	 * JS parallax fallback
	 **/
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

// https://gist.github.com/timhall/4078614
(function () {
	var lastTime = 0,
		vendors = ['ms', 'moz', 'webkit', 'o'],
		// Feature check for performance (high-resolution timers)
		hasPerformance = !!(window.performance && window.performance.now);

	for (var x = 0, max = vendors.length; x < max && !window.requestAnimationFrame; x += 1) {
		window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
	}

	if (!window.requestAnimationFrame) {
		window.requestAnimationFrame = function (callback, element) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function () {
					callback(currTime + timeToCall);
				},
				timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};
	}

	if (!window.cancelAnimationFrame) {
		window.cancelAnimationFrame = function (id) {
			clearTimeout(id);
		};
	}

	// Add new wrapper for browsers that don't have performance
	if (!hasPerformance) {
		// Store reference to existing rAF and initial startTime
		var rAF = window.requestAnimationFrame,
			startTime = +new Date;

		// Override window rAF to include wrapped callback
		window.requestAnimationFrame = function (callback, element) {
			// Wrap the given callback to pass in performance timestamp
			var wrapped = function (timestamp) {
				// Get performance-style timestamp
				var performanceTimestamp = (timestamp < 1e12) ? timestamp : timestamp - startTime;

				return callback(performanceTimestamp);
			};

			// Call original rAF with wrapped callback
			rAF(wrapped, element);
		}
	}
})();