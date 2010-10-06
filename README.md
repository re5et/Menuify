Menuify
===========

Menuify is a class that allows you to turn groups of elements into keyboard navigable menus.  Automatically adds arrow key navigation and does not interfere with tabbing as usual, and allows for easy event binding to all menu items.

![Screenshot](http://re5et.github.com/projects/menuify/assets/images/screenshot.png)

How to use
----------

You can use Menuify to create a menu by doing the following:

	var myMenu = new Menuify($$('#my-list li a'));

You can add events easily like so:

	myMenu.addEvents({
		'focus': function(item){
			console.log(item + ' focused');
		},
		'blur': function(item){
			console.log(item + ' blurred');
		}
	});
