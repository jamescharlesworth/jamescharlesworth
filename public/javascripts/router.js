/*globals app, Backbone, $, resize*/
// Filename: router.js
define([
	'jQuery',
	'Underscore',
	'Backbone',
	'views/page',
	'views/menu',
	'models/page',
	'globals',
	'my.raphael',
	'text!templates/home/red-dot/me.html',
	'text!templates/home/red-dot/inception.html',
	'text!templates/home/red-dot/simplicity.html',
	'text!templates/home/red-dot/the-dot-is-me.html',
	'jQueryUI'
], function( $, _, Backbone, PageView, MenuView, PageModel, globals, rData, meHtml, inceptionHtml, simplicityHtml, dotIsMe){

	var AppRouter = Backbone.Router.extend({
		initialize: function(options) {
			this.options = options;
			this.pages = options.pages;
			this.redDots = [meHtml, inceptionHtml, simplicityHtml, dotIsMe];
			this.redDotIndex = 1;
			
		},
		routes: {
			// Define some URL routes
			"": "default",
			"/": "default",
			":p": 'showPage',
			":p/:sp": 'showPage'

		},
		showPage: function( pageName, subPage) {
		
			//load the menu
			var router = this;
			//@todo refactor menu
			var menu = new MenuView({page: pageName});

			$('.menu-wrapper').html(menu.render().el);

			var pageModel = this.pages.getByName( pageName );
			//need 404 handling here
			//also, dont like this. needs to be cleaner...
			if (subPage) {
				pageModel.set('subPage', subPage );
				
			}

			var page     = new PageView({model: pageModel, router: router}),
				pageHtml = page.render().el;


			$('.pages').append( pageHtml );

						
			this.stylize();
			//if multiple pages exist, the transition needs to happen
			//goal is to determine the direction to slide, left to
			//right or right to left. Then slide one in and one out
			//and finally remove the page that was slided out.
			//At this point I have two pages in the dom if a menu
			//link is clicked
			if ($('.pages .page').length > 1) {
				var $firstPage = $('.pages .page:first'),
					$lastPage  = $('.pages .page:last');

				//use the menu as the key to which direction to slide
				//basing the current page on the class `active`
				var $firstPageMenu = $('.menu li a',$firstPage),
					$lastPageMenu = $('.menu li a',$lastPage);

					var indexOfOldActiveLink = $firstPageMenu.map(function(index, a){
						if ($(a).hasClass('active')){
							return index;
						}
					})[0];

					var indexOfNewActiveLink = $lastPageMenu.map(function(index,a){
						if ($(a).hasClass('active')){
							return index;
						}
					})[0];

				var direction = {
					in: (indexOfNewActiveLink > indexOfOldActiveLink) ? 'right' : 'left',
					out: (indexOfNewActiveLink > indexOfOldActiveLink) ? 'left' : 'right',
				};
			
				//setting the position to absolute makes the transition smoother
				$lastPage.css({position:'absolute',top: '90px'});
				
				$lastPage.show('slide', {direction: direction.in });
				$firstPage.hide('slide',{direction: direction.out });
				setTimeout(function(){
					//finally, remove the page that slide out and reset the position
					//of thenew page
					$firstPage.parent().parent().remove();
					$lastPage.css({position:'relative',top: '0px'});
					router.loadPaper();
				
				}, 350 );//350 is how long it takes to slide in/out
			}

			$(function(){
				router.loadPaper();

			})			
			
		},

		stylize: function(lp){
			var wrapperHeight = $('.page:last').height();
			//if the page is larger than the content
			
			if ( (globals.pageHeight - globals.footerHeight) > wrapperHeight ) {
				
				wrapperHeight = globals.pageHeight - globals.footerHeight;	
			
				$('.page:last').css({height:wrapperHeight + 'px'});
				//make the content a bit longer
			}

			if ($('.about-column').length) {
				var maxColumnHeight = 0;
				$('.about-column').each(function(i,col){
					
					if ($(col).height() > maxColumnHeight) {
						maxColumnHeight = $(col).height();
					}
				});
				$('.about-column').css({height:maxColumnHeight+ 'px'});
			}

			
			$('.footer').css({top: wrapperHeight +'px'});
		},
		//refactor pages later
		default: function() {
			this.showPage('home');


		},
		loadPaper: function(){
			var self = this;
			if ($('.raphael-canvas').length) {

				var paper = Raphael($('.raphael-canvas').get(0));

				// Creates circle at x = 50, y = 40, with radius 10
				var circle = paper.circle(50, 50, 10);
				// Sets the fill attribute of the circle to red (#f00)
				circle.attr({fill: '#a23a35',stroke:'none'})
				circle.click(function(){
					var html = self.redDots[self.redDotIndex];
					
					$('.red-dot-text').html(html);
					if ( (self.redDotIndex +1) === self.redDots.length) {
						self.redDotIndex = 0;
					} else {
						self.redDotIndex++;	
					}
					
				});
				var g;
				circle.hover(function(){
					var self = this;
					this.attr({cursor:'pointer'})
					
					this.animate({r:13}, 1000, 'elastic', function(){
						

					});
					
				},
				function(){
					this.animate({r:10}, 1000, 'elastic', function(){

						
					});
				})
				
			}
		}

	});

	
	var initialize = function(options){
		var appRouter = new AppRouter(options);

		Backbone.history.start({pushState:true});
	};

	return {
		initialize: initialize
	};
});
	
