
define(['jQuery',
		'Underscore',
		'Backbone',
		'views/menu',
		'globals'
], function( $, _, Backbone, Menu, globals) {

	var Page = Backbone.View.extend({
		initialize: function( options ) {
			
			
			this.router = options.router;
			
			
		},
		events: {
			
		},
		getTemplate: function( ){
			var self      = this,
				$template = $(this.model.get('template')),
				subPage,
				activeIndex;

			

			var menu = new Menu({page: this.model.get('name')});
			$('.container', $template).prepend(menu.render().el);
			
			$template.wrap('<div class="someclass" />');
			
			return $template.html();
		},

		render: function() {
			var router = this.router;
			var template = this.getTemplate();
	


			this.$el.html( template );


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