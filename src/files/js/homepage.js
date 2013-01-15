$(document).ready(function() {

//if sessionstorage is set go to that tab
	//set nav
	$('ul#filter .current').removeClass('current');
	var selection = sessionStorage.getItem('navSelection');
	$('ul#filter > #'+selection).addClass('current');
	if (selection != 'all')
		filterItemBoxes(selection);

	$('ul#filter a').click(function() {
		$(this).css('outline','none');
		$('ul#filter .current').removeClass('current');
		$(this).parent().addClass('current');

		var filterVal = $(this).contents().filter(function() {
			return this.nodeType == 3;
		}).text().toLowerCase().replace(' ','-');

		if (Modernizr.localstorage) {
		  sessionStorage.setItem('navSelection', filterVal);
		} else {
		  // no native support for HTML5 storage :(
		  // maybe try dojox.storage or a third-party solution
		}
		filterItemBoxes(filterVal);
	});


	$('.itembox').on('mouseenter', function(event){
		var img = $(this).find('img');
		var width = img[0].width;
		var height = img[0].height;
		var clipwidth = Math.floor( $(this).width() );
		var clipheight = Math.floor( $(this).height() );
		
		var widthrange = width - clipwidth;
		var heightrange = height - clipheight;

		var x = Math.floor(Math.random() * widthrange);
		var y = Math.floor(Math.random() * heightrange);
		var x2 = x + clipwidth;
		var y2 = y + clipheight;

		img.css('clip', 'rect('+y+'px, '+x2+'px, '+y2+'px, '+x+'px)');
		img.css('left', -x+'px');
		img.css('top', -y+'px');

		$(this).children('.itemboxbg').css('visibility','visible');
		$(this).css({'color' : 'white', 'text-shadow' : '0 0 2px #000'});

	});
	$('.itembox').on('mouseleave', function(event){
		$(this).children('.itemboxbg').css('visibility','hidden');
		$(this).css({'color' : 'black', 'text-shadow' : ''});
	});

});


	var filterItemBoxes = function (filterVal) {

		if(filterVal == 'all') {
			$('.itembox.hidden').fadeIn('slow').removeClass('hidden');
		}
		else {

			$('.itembox').each(function() {

				if(!$(this).hasClass(filterVal)) {
					$(this).fadeOut('normal').addClass('hidden');
				} else {
					$(this).fadeIn('slow').removeClass('hidden');
				}
			});
		}
		return false;
	};