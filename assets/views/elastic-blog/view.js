$(document).ready(function() {
/*
	var lastItem = $('#section .portfolio-item').not('#default-portfolio-item').last(); 

	if(lastItem.length == 0) {

		lastItem = '';

	} else {

		lastItem = $(lastItem).attr('data-id');
	}

	var getComments = $.ajax({
		type: "POST", 
		url: '{{pages.apiGetMany.uri}}', 
		data: { 
			last   : lastItem,
			index  : 'comments',
			type   : 'comment',
			limit  : 15
		}
	});

	getComments.done(function(result) {

		if(result == null) {

			window.location.replace("/error");

		} else {

			if(result.success == true) {

				if(result.message.length > 0) {

					$('#section .portfolio-quote').remove();

					var portfolioItem = $('#default-portfolio-item').clone();

					$(portfolioItem).removeAttr('id');

					$(portfolioItem).addClass('portfolio-quote');

					$(portfolioItem).show();

					var dataItem = result.message.pop();
					
					$(portfolioItem).find('#edit-button').attr('href', '{{pages.newQuote.uri}}/' + dataItem.uri);

					$(portfolioItem).append(textile.parse(dataItem.content));
	
					$('#section .portfolio-item:first').after(portfolioItem)
				} else {

					$('#more-button').hide();

					$('#empty-portfolio-item').show();		
				}
			}
		}
	});

	getComments.fail(errorHandler);


	$('#more-button').click(function() {

		getItems();
	});

	getItems();
*/
});
