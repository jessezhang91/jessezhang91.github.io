$(document).ready(function () {
	var scrollScale = 5;

	$(".container").on("scroll", function () {
		var viewHeight = $(window).height();
		var scroll = $(".container").scrollTop();

		var contact = $(".contact");
		var height = contact.outerHeight() * scrollScale;

		var position = (scroll - viewHeight / scrollScale - height) / scrollScale;

		contact.css("bottom", Math.min(0, position));
	}).trigger("scroll");
});