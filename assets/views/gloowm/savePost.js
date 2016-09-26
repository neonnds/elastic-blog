$(document).ready(function() {

	$('#default-load-select').hide();

	function getItems() {

		$('#load-select').remove();

		$('#load-submit-button').hide();

		var loadSelect = $('#default-load-select').clone();

		$(loadSelect).attr("id", 'load-select');

		$(loadSelect).children().remove();

		$('#default-load-select').after(loadSelect);

		$(loadSelect).show();

		var category = $('#load-category').val();

		var getItems = $.ajax({
			type: "POST",
			url: '{{pages.apiGetMyPosts.uri}}',
			data: {
				from      : '',
				to        : '',
				last      : '',
				category  : category,
				limit     : 1000,
				order     : "asc"
			}
		});

		getItems.done(function(result) {

			var message = result.message;

			for(var i = 0; i < message.length; i++) {
				var item = $('#default-load-select-item').clone();	

				$(item).attr('value', message[i]["_uri"]);
				$(item).removeAttr('id');
				$(item).text(message[i]["_uri"]);

				$('#load-select').append(item);
			}

			$('#load-submit-button').show();
		});

		getItems.fail(function(jqXHR, status, error) {

			var item = $('#default-load-select-item').clone();	

			$(item).removeAttr('id');
			$(item).text("NO ITEMS FOUND!");

			$('#load-select').append(item);

			return;
		});

		$('#load-window').show();
	}

	$('#menu-load-button').click(function() {
		getItems();
	});

	$("#load-category").change(function() {
		getItems();
	});

	$('#load-submit-button').click(function() {

		var uri = $('#load-select').val();

		var getPost = $.ajax({
			type: "POST",
			url: '{{pages.apiGetPost.uri}}',
			data: {
				uri : uri
			}
		});

		getPost.done(function(result) {

			var message = result.message.pop();

			$('#uri').val(message._uri);
			$('#content').val(message._content);

			$('#load-window').hide();

			$("#uri").trigger("input");
		});

		getPost.fail(errorHandler);
	});

	$('#menu-save-button').click(function() {

		var category = $('#category').val();
		var uri = $('#uri').val();
		var content = $('#content').val();
		var isLive = false;

		if($('#live-button').text() == 'PRIVATE') {
			isLive = true;
		}
	
		var savePost = $.post('{{pages.apiSavePost.uri}}', {
			'uri'      : uri, 
			'content'  : content, 
			'live'     : isLive, 
			'category' : category
		});

		savePost.success(function(result) {

			arrayIntoUL($("#save-message"), ["Your post has been saved!"]);
		});

		savePost.error(errorHandler);
	});

	$('#menu-live-button').click(function(event) {

		var uri = $('#uri').val();

		var getPost = $.ajax({
			type: "POST",
			url: '{{pages.apiGetPost.uri}}',
			data: {
				uri : uri
			}
		});

		getPost.done(function(result) {

			if($(this).text() == "PUBLIC") {
		
				$(this).text("PRIVATE");

			} else {
	
				$(this).text("PUBLIC");
			}
		});

		getPost.fail(function(jqXHR, status, error) {

			arrayIntoUL($("#live-message"), ["You need to save the post first!"]);
		});
		
   		event.preventDefault();
	});

	$('#menu-preview-button').click(function(event) {

		var uri = $('#uri').val();

		var getPost = $.ajax({
			type: "POST",
			url: '{{pages.apiGetPost.uri}}',
			data: {
				uri : uri
			}
		});

		getPost.done(function(result) {

			window.open(`{{pages.viewPost.base}}/${uri}`, '_blank');
		});

		getPost.fail(function(jqXHR, status, error) {

			$('#preview-window').show();

			arrayIntoUL($("#preview-message"), ["You need to save the post first!"]);
		});

   		event.preventDefault();
	});

	$('#menu-delete-button').click(function(event) {

		var uri = $('#uri').val();

		$('#delete-window .modal-body').children().hide();

		var getPost = $.ajax({
			type: "POST",
			url: '{{pages.apiGetPost.uri}}',
			data: {
				uri : uri
			}
		});

		getPost.done(function(result) {

			$('#delete-submit-button').show();
			$('#delete-cancel-button').show();

			arrayIntoUL($("#delete-message"), ["Really delete this post?"]);
		});

		getPost.fail(function(jqXHR, status, error) {

			$('#delete-close-button').show();

			arrayIntoUL($("#delete-message"), ["You need to save the post first!"]);
		});

   		event.preventDefault();
	});

	$('#delete-submit-button').click(function() {

		var uri = $('#uri').val();

		$('#delete-window .modal-body').children().hide();
		$('#delete-close-button').show();

		var deletePost = $.post('{{pages.apiDeletePost.uri}}', {
			'uri' : uri
		});

		deletePost.success(function(result) {

			$('#uri').val('');
			$('#content').val('');

			updateFire();

			arrayIntoUL($("#delete-message"), ["Your post has been deleted!"]);
		});

		deletePost.error(errorHandler);
	});
	
	/* Based on the state of the URI and CONTENT fields update page */
	function updateFire() {

		var uri = $('#uri').val();
		var content = $('#content').val();

		if(uri == "" && content == "") {
	
			$('#menu-delete-button').hide();
			$('#menu-preview-button').hide();
			$('#menu-live-button').hide();

		} else {

			$('#menu-delete-button').show();
			$('#menu-preview-button').show();
			$('#menu-live-button').show();
		}

		var contentText = $('#content').val();

		$('#preview').height($('#content').height());

		if(contentText && contentText == last) {
			return; 
		}

		last = contentText;

		var previewHTML = rho.toHtml(contentText);
		
		$('#preview').html(previewHTML);
	}

	$('#content').on('input', function() {
		updateFire();
	}).focus();

	$('#uri').on('input', function() {
		updateFire();
	});

	$("#content").trigger("input");
	$("#uri").trigger("input");
});
