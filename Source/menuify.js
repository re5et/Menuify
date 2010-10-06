/*
---
script: menuify.js

description: Class to create keyboard navigable menus from a group of elements using tabindex, focus, and a few events.

license: MIT-style

authors: [atom smith]

requires:
- core/1.2.4: [Core, Browser, Array, Function, Number, String, Hash, Event, Class.Extras, Element.Event, Selectors]

provides: [Menuify]
...
*/


var Menuify = new Class({

	'Implements': [Options, Events],

	'options': {
	},

	// set options, select items for menu, add reasonable tabindexes and events.
	'initialize': function(selector, options){
		this.setOptions(options);
		this.items = $$(selector);
		this.addTabIndexes();
		this.attach();
		return this;
	},

	// add reasonable tabindexes to our items
	'addTabIndexes': function(){
		var index = this.findStartingTabIndex();
		this.items.each(function(item){
			item.set('tabindex', ++index);
		});
	},

	// find free and reasonable tabindexes to for our menu items
	'findStartingTabIndex': function(){
		this.items.set('tabindex', 0);
		var highestTabIndex = 0;
		$(document.body).getElements('[tabindex]').each(function(e){
			var eTabIndex = e.get('tabindex').toInt();
			if(eTabIndex > highestTabIndex){
				highestTabIndex = eTabIndex;
			}
		});
		return highestTabIndex;
	},

	// bind the necessary events
	'attach': function(){
		this.items.each(function(item){
			item.addEvents({
				'keypress': function(event){
					event = new Event(event);
					if(event.key == 'up' || event.key == 'down'){
						this.nextInMenu(event.key);
					}
					if(event.key == 'left' || event.key == 'right'){
						this.nextNonMenuIndex(event.key)
					}
				}.bind(this),
				'focus': function(){
					this.focused = item;
				}.bind(this)
			});

			['keydown', 'keyup', 'keypress', 'click', 'doubleclick',
			 'focus', 'blur', 'mouseenter', 'mouseleave'].each(function(eventType){
				 item.addEvent(eventType, function(event){
					 this.fireEvent(eventType, [item, event])
				 }.bind(this))
			 }, this);
		}, this);

	},

	// move to the next or previous item in a menu.	 If at the top/bottom and trying to move
	// to the next/previous item, will loop around to the beginning or end.
	'nextInMenu': function(direction){
		direction = direction || 'down';
		var currentIndex = this.items.indexOf(this.focused)
		var toFocus = 0
		if(direction == 'up'){
			if(currentIndex == 0){
				toFocus = this.items.length - 1;
			} else {
				toFocus = currentIndex - 1;
			}
		}
		if(direction == 'down'){
			if(currentIndex == this.items.length - 1){
				toFocus = 0;
			} else {
				toFocus = currentIndex + 1;
			}
		}
		this.items[toFocus].focus();
	},


	// this is here to let you jump out of an entire menu to whatever is next or previous
	// this is very handy for jumping between menus, or just moving out of a menu
	// without having to tab through all of the items.
	'nextNonMenuIndex': function(direction){
		if(direction == 'right'){
			var toFocus = this.items.getLast().get('tabindex') + 1;
		} else {
			var toFocus = this.items[0].get('tabindex') - 1;
		}

		var nextFocusable = $(document.body).getElement('[tabindex="'+toFocus+'"]');
		if(nextFocusable){
			nextFocusable.focus();
		} else {
			var first = $(document.body).getElement('[tabindex="1"]');
			if(first){
				first.focus();
			} else {
				this.focused.blur();
			}
		}
	}

});
