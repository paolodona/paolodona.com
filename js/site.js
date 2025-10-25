/**
 * Paolo Dona Website - Simplified JavaScript
 * Only essential features for the single-page static site
 */

$(document).ready(function() {

	// Load menu items from menu.json
	$.getJSON('menu.json', function(data) {
		var menuHtml = '';
		$.each(data.menuItems, function(index, item) {
			menuHtml += '<li class="menu-list__item">';
			menuHtml += '<a href="' + item.url + '" title="' + item.title + '" class="menu-list__link">';
			menuHtml += item.name;
			menuHtml += '</a></li>';
		});
		$('.menu-list').html(menuHtml);
	}).fail(function() {
		console.error('Failed to load menu.json');
	});

	// Add body-ready class after page load for animations
	setTimeout(function() {
		$('body').addClass('body-ready');
	}, 1000);

	// Initialize Owl Carousel for header images (if multiple images exist)
	if ($('.header-image').children('.carousel-item').length > 1) {
		$('.owl-carousel').owlCarousel({
			items: 1,
			loop: true,
			mouseDrag: false,
			touchDrag: false,
			pullDrag: false,
			dots: false,
			autoplay: true,
			autoplayTimeout: 6000,
			animateOut: 'fadeOut'
		});
	} else {
		$('.owl-carousel').addClass('owl-loaded');
	}

	// Menu toggle functionality - unified for all devices
	$(document).on('click', '.menu-toggle', function() {
		$('body').toggleClass('menu-on');
		$(this).toggleClass('menu-closed');
	});

	// Close menu when clicking on a menu link
	$(document).on('click', '.menu-list__link', function() {
		$('body').removeClass('menu-on');
		$('.menu-toggle').addClass('menu-closed');
	});

	// Close menu when clicking outside (on the overlay)
	$(document).on('click', '.menu', function(e) {
		if (e.target === this) {
			$('body').removeClass('menu-on');
			$('.menu-toggle').addClass('menu-closed');
		}
	});

	// Scroll to content when clicking the scroll arrow
	$(document).on('click', '.page-intro__scroll', function() {
		var windowHeight = $(window).height();
		$('html, body').animate({
			scrollTop: windowHeight
		}, 600);
	});

	// Scroll to top button
	$('.scroll-top').click(function() {
		$('body, html').animate({
			scrollTop: 0
		}, 800);
		return false;
	});

});
