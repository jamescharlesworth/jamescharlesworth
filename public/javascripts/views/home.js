/*globals Raphael */
define(['jQuery',
		'Underscore',
		'Backbone',
		'views/menu',
		'text!templates/home/red-dot/me.html',
		'text!templates/home/red-dot/inception.html',
		'text!templates/home/red-dot/simplicity.html',
		'text!templates/home/red-dot/the-dot-is-me.html',
		'globals'
], function( $, _, Backbone, Menu, meTemplate, inceptionTemplate, simplicityTemplate, thdDotIsMeTemplate, globals) {

	var Page = Backbone.View.extend({
		initialize: function( options ) {
			this.router = options.router;
			this.redDots = [meTemplate, inceptionTemplate, simplicityTemplate, thdDotIsMeTemplate];
			this.redDotIndex = 1;
		},
		events: {
			
		},
		getTemplate: function( ){
			var $template = $(this.model.get('template'));

			$('.raphael-canvas',$template).css({height: globals.screenContentHeight +'px'});
			
			var menu = new Menu({page: this.model.get('name')});
			$('.container', $template).prepend(menu.render().el);
			
			$template.wrap('<div class="someclass" />');
			
			return $template.html();
		},

		render: function() {
			var router   = this.router,
				template = this.getTemplate(),
				self     = this;
	


			this.$el.html( template );

			
			
			var paper = new Raphael($('.raphael-canvas', this.$el).get(0));

			// Creates circle at x = 50, y = 40, with radius 10
			var circle = paper.circle(50, 50, 10);
			// Sets the fill attribute of the circle to red (#f00)
			circle.attr({fill: '#a23a35',stroke:'none'});
			circle.click(function(){
				var html = self.redDots[self.redDotIndex];
				
				$('.red-dot-text').html(html);
				if ( (self.redDotIndex +1) === self.redDots.length) {
					self.redDotIndex = 0;
				} else {
					self.redDotIndex++;
				}
				
			});
			circle.hover(function(){
				this.attr({cursor:'pointer'});
				this.animate({r:13}, 1000, 'elastic');
				
			},
			function(){
				this.animate({r:10}, 1000, 'elastic');
			});
				

			$('.menu a',this.$el).click(function(){
				var url = $(this).attr('href');
				router.navigate(url, true);
				return false;
			});

			return this;
		}
	});

	return Page;
});