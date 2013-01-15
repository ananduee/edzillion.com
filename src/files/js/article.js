$(document).ready(function() {

	//set nav
	$('ul#filter .current').removeClass('current');
	var selection = '#'+sessionStorage.getItem('navSelection');
	$('ul#filter > '+selection).addClass('current');	

	$('.itembox').off('mouseover mouseout');
	$('.itembox').css('cursor','default');

debugger;
	$('ul#filter a').click(function() {
		debugger;
		var filterVal = $(this).contents().filter(function() {
			return this.nodeType == 3;
		}).text().toLowerCase().replace(' ','-');

		if (Modernizr.localstorage) {

		  sessionStorage.setItem('navSelection', filterVal);
		} else {
		  // no native support for HTML5 storage :(
		  // maybe try dojox.storage or a third-party solution
		}
		window.location.href = 'http://edzillion.com';
	});

	//go through the images and make sure they fit within margins. set up a link to view fullsize

	var articleWidth = $('article').width();

	$('article').find('img').load( function() {
		var origWidth = $(this).width();    // Current image width
		var origHeight = $(this).height();  // Current image height
		// Check if the current width is larger than the max
		if (origWidth > articleWidth - 20) {					
			//we will need a lightbox
			if ($('#lightbox').length === 0) { 
				//create HTML markup for lightbox window
				var lightbox =
					'<div id="lightboxfade"><p class="franchisefont">Click to close</p></div>'+
					'<div id="lightbox">' +
					'<div id="lightbox_content">' + 
					'</div>' +
					'</div>';
				//insert lightbox HTML into page
				$('body').append(lightbox);
			}

			$(this).wrap('<div class="zoomcontainer " />');
			$(this).after('<div class="zoomoverlay iconfont">&#182;</div>');
			$(this).after('<div class="zoomblur"></div>');
		
			var ratio = (articleWidth-20) / origWidth;   // get ratio for scaling image
			var width = articleWidth;
			var height = Math.round(height * ratio);

			$(this).css("width", width); // Set new width
			$(this).css("height", height);  // Scale height based on ratio

			var zoomContainer = $(this).parent();
			zoomContainer.css("width", width);
			zoomContainer.css("height", height); 

			var $imgBoxLink = $('<a href="'+$(this).attr('src')+'" class="lightbox_trigger" />');

			$imgBoxLink.click(function(e) {
				//prevent opening new page
				e.preventDefault();
				//Get clicked link href
				var image_href = $(this).attr("href");					
				//place href as img src value
				$('#lightbox_content').html('<img src="' + image_href + '" />');
				//show lightbox window - you could use .show('fast') for a transition
        $('#lightbox').css('top', $(window).scrollTop()+20+'px');

				$('#lightbox').css('visibility','visible');
				$('#lightboxfade').css('visibility','visible');

				$('#lightbox').on('click', function() { 
					$('#lightbox').css('visibility','hidden');
					$('#lightboxfade').css('visibility','hidden');
					$('#lightboxfade').off('click');
				});

				$('#lightboxfade').on('click', function() { 
					$('#lightboxfade').css('visibility','hidden');
					$('#lightbox').css('visibility','hidden');
					$('#lightbox').off('click');
				});
			});
			zoomContainer.wrap($imgBoxLink);

			zoomContainer.mouseover( function() {
				$(this).children('.zoomoverlay').css('visibility','visible');
				$(this).children('.zoomblur').css('visibility','visible');
			});

			zoomContainer.mouseout( function() {
				$(this).children('.zoomoverlay').css('visibility','hidden');
				$(this).children('.zoomblur').css('visibility','hidden');
			});
		}
	});

	$('.relatedbox').on('mouseenter', function(event){
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
	
	$('.relatedbox').on('mouseleave', function(event){
		$(this).children('.itemboxbg').css('visibility','hidden');
		$(this).css({'color' : 'black', 'text-shadow' : ''});
	});


});