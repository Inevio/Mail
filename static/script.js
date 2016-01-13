
var win                 	= $( this );
var singleMail       			= $('.single-mail');
var allInbox        			= $('.general-options .all-inbox');
var starred       				= $('.general-options .starred');
var drafts        				= $('.general-options .drafts');
var sent        					= $('.general-options .sent');
var spam        					= $('.general-options .spam');
var trash        					= $('.general-options .trash');
var opcionesGlobales			= $('.general-options .options');
var accountPrototype			= $('.mail-account.wz-prototype');
var accountList						= $('.subcontent0 .accounts');
var mailList							= $('.emails');
var mailPrototype 				= $('.emails .single-mail.wz-prototype');
var boxPrototype					= $('.mailbox.wz-prototype');
//var linePrototype					= $('.line.wz-prototype');
var fullMailPrototype			= $('.full-mail.wz-prototype');
var attachmentsPrototype	= $('.full-mail .full-mail-attachments.wz-prototype');
var dragPrototype					= $('.drag-image.wz-prototype');

var initMail = function(){

	wz.mail.getAccounts( function(error, list){

		if( error ){
			return alert(error);
		}

		if( !list.length ){
			return alert('Añada una cuenta');
		}

		console.log('Cuentas asignadas: ', list);

		list.forEach( function( item ){

			var accountItem = accountPrototype.clone().removeClass('wz-prototype');

			accountItem.addClass( 'account-' + item.id )
			.data(
				item
			)
			.children('.account-info')
			.children('span').text( item.address );

			/*console.log(accountItem);*/
			accountList.append(accountItem);
			var childrenList = accountItem.children('.children');

			item.getBoxes( function( error, boxes ){

				if (error){
					return alert(error);
				}

				var boxList = [];
				console.log('Boxes de la cuenta ' + item.address, boxes);

				for ( var i=0; i<boxes.length; i++ ){

					var boxItem = boxPrototype.clone().removeClass('wz-prototype');
					boxItem.addClass('box-' + boxes[i].name.replace(' ', '-') );
					boxItem.addClass('account-' + item.id );
					boxItem.children('.mailbox-info').children('span').text(boxes[i].path);
					boxItem.data(boxes[i]);

					if( boxes[i].children.length > 0 ){
						var childrens = addBoxChildrens(boxes[i], boxItem, item.id);
					}

					boxList.push(boxItem);

				}

				var sortedList = boxList.sort( function( a, b ){

            var aOrder = a.data('order');
            var bOrder = b.data('order');

            if( aOrder - bOrder ){
                return aOrder - bOrder;
            }

            return a.data('name').localeCompare( b.data('name') );
				});

				childrenList.append(sortedList);
				refreshUnreads( item.id );

			});

		});

	});

}

var addBoxChildrens = function (boxApi, boxFather, accId){

	var boxList = [];
	boxFather.removeClass('hide-arrow').addClass('arrow-closed');

	for( var i=0; i< boxApi.children.length; i++ ){

		var boxItem = boxPrototype.clone().removeClass('wz-prototype');
		boxItem.addClass('box-' + boxApi.children[i].name.replace(' ', '-') );
		boxItem.children('.mailbox-info').children('span').text(boxApi.children[i].name);
		boxItem.addClass('account-' + accId );
		boxItem.data( boxApi.children[i] );

		if( boxApi.children[i].children.length > 0 ){
			addBoxChildrens( boxApi.children[i], boxItem );
		}

		boxList.push(boxItem);

	}

	var sortedList = boxList.sort( function( a, b ){

			var aOrder = a.data('order');
			var bOrder = b.data('order');

			if( aOrder - bOrder ){
					return aOrder - bOrder;
			}

			return a.data('name').localeCompare( b.data('name') );
	});

	boxFather.children('.children').append(sortedList);

};

var generateSelectorString = function ( path, iterations ){

	var splittedPath = path.split('/');
	var finalString = '';

	if( splittedPath.length === 1 ){
		finalString = '.mailbox.box-' + path.replace(' ', '-');
	}else{

		var maximumIterations = splittedPath.length;
		if ( typeof iterations !== "undefined" ){
			if( iterations < maximumIterations ){
				maximumIterations = iterations;
			}
		}

		for( var i = 0 ; i < maximumIterations; i++ ){
			finalString += ' .mailbox.box-' + splittedPath[i].replace(' ', '-');
		}

	}

	return finalString;

}

var refreshUnreads = function( accId, box ){

	var accountDom = $('.account-' + accId);
	var accountApi = accountDom.data();
	console.log('Argumentos:', arguments);

	if( typeof box !== "undefined" ){

		var splittedPath = box.split('/');
		console.log( splittedPath );

		if( splittedPath.length === 1 ){

			accountApi.getBox( box, function( error, boxApi ){

				if(error){
					alert(error);
				}

				var boxDom = $( '.account-' + accId + '.box-' + boxApi.name.replace(' ', '-') );
				var oldUnread = parseInt( boxDom.children('.mailbox-info').children('.bullet').text() ) || 0;
				var totalUnread = parseInt( accountDom.children('.account-info').children('.bullet').text() ) || 0;
				var newUnread = boxApi.unread;

				if ( totalUnread == '' ){
					totalUnread = 0;
				}

				if( oldUnread == '' ){
					oldUnread = 0;
				}

				totalUnread = totalUnread + newUnread - oldUnread;

				if( newUnread == 0 ){
					newUnread = '';
				}
				if( totalUnread == -1 || totalUnread == 0 ){
					totalUnread = '';
				}

				boxDom.children('.mailbox-info').children('.bullet').text( newUnread );
				console.log(boxApi);
				if( boxApi.type === "inbox" ){
					accountDom.children('.account-info').children('.bullet').text( totalUnread );
				}

			});

		}else{

			var pathToCheck = '';
			console.log('longitud del path: ' + splittedPath.length);
			var incrementalUnreads = 0;

			for( var i = splittedPath.length ; i > 0 ; i-- ){

				var jquerySelector = generateSelectorString( box, i );
				console.log('jquerySelector: ' + jquerySelector)

				var boxToCheck = $(jquerySelector);
				var boxToCheckApi = boxToCheck.data();

				accountApi.getBox( boxToCheckApi.path, function( error, boxApi ){

					if(error){
						alert(error);
					}

					var oldUnread = parseInt( boxToCheck.children('.mailbox-info').children('.bullet').text() ) || 0;
					var totalUnread = parseInt( accountDom.children('.account-info').children('.bullet').text() ) || 0;
					var newUnread = boxApi.unread;
					if( i != splittedPath.length ){
						incrementalUnreads += newUnread;
					}else{
						incrementalUnreads = newUnread;
					}

					if ( totalUnread == '' ){
						totalUnread = 0;
					}

					if( oldUnread == '' ){
						oldUnread = 0;
					}

					totalUnread = totalUnread + newUnread - oldUnread;

					if( newUnread == 0 ){
						newUnread = '';
					}
					if( totalUnread == 0 ){
						totalUnread = '';
					}
					if(incrementalUnreads == 0){
						incrementalUnreads = '';
					}

					boxToCheck.children('.mailbox-info').children('.bullet').text( incrementalUnreads );
					console.log(boxApi);
					if( boxApi.type === "inbox" ){
						accountDom.children('.account-info').children('.bullet').text( totalUnread );
					}

				});

			}

		}

	}else{

		var totalUnread = 0;
		var boxes = accountDom.find( '.mailbox.account-' + accId );

		for( var i = 0; i < boxes.length; i++ ){

			var unread = boxes.eq(i).data().unread;

			if ( unread > 0  ){

				boxes.eq(i).children('.mailbox-info').children('.bullet').text( unread );

				if( boxes.eq(i).data().type === "inbox" ){
					totalUnread += unread;
				}

			}

		}

		if( totalUnread > 0 ){
			accountDom.children('.account-info').children('.bullet').text( totalUnread );
		}

	}

}

win.on('click','.mailbox', function(e){

	$('.full-mail-complete').remove();
	$('.mailbox.active').removeClass('active');
	$('.mailbox-info.active').removeClass('active');
	$(this).children('.mailbox-info').addClass('active');
	$(this).addClass('active')

	var mailboxApi = $(this).data();
	//console.log(mailboxApi);

	if( mailboxApi.tags.length && mailboxApi.tags.indexOf( '\\Noselect' ) !== -1 ){

		alert( 'Bandeja no seleccionable' );

	}else{

		mailboxApi.getMessages(0,20,function(error, messages){

			console.log(messages);

			mailList.children().not(':first').remove();

			if(error){
				console.log(error);
				return alert(error);
			}

			//console.log(messages);

			for (var i=0; i<messages.length; i++){

				var message = mailPrototype.clone().removeClass('wz-prototype');
				message.data(messages[i]);
				message.find('.mail-from').text(messages[i].from.name);
				message.find('.mail-subject').text(messages[i].title);
				message.find('.mail-date').text(messages[i].date);
				message.addClass('message-' + messages[i].id);

				if( messages[i].flags.indexOf('\\Seen') === -1 ){
					message.addClass('unread');
				}

				if( messages[i].flags.indexOf('\\Flagged') !== -1 ){
					message.addClass('flagged');
					message.find('.important').addClass('active');
				}

				//var line = linePrototype.clone().removeClass('wz-prototype');
				mailList.append(message);
				//mailList.append(line);

			}

		});

	}

	e.stopPropagation();

})

.on('click', '.mailbox .arrow' ,function(e){

	if( $(this).parents('.mailbox').first().hasClass('arrow-opened') ){

		$(this).parents('.mailbox').first().removeClass('arrow-opened');
		$(this).parents('.mailbox').first().addClass('arrow-closed');
		$(this).parents('.mailbox').first().children('.children').first().css('display', 'none');

	}else{

		$(this).parents('.mailbox').first().removeClass('arrow-closed');
		$(this).parents('.mailbox').first().addClass('arrow-opened');
		$(this).parents('.mailbox').first().children('.children').first().css('display', 'block');

	}

	e.stopPropagation();

})


.on('click', '.mail-account' ,function(e){

	$('.full-mail-complete').remove();

	if( !$(this).hasClass('arrow-opened') ){

		$(this).removeClass('arrow-closed');
		$(this).addClass('arrow-opened');
		$(this).children('.children').first().css('display', 'block');

	}else{

		$(this).removeClass('arrow-opened');
		$(this).addClass('arrow-closed');
		$(this).children('.children').first().css('display', 'none');

	}
	e.stopPropagation();

})

/*.on('mousemove', '.single-mail', function(e){
	console.log('Capturando mousemove');
})
.on('mousedown', '.single-mail', function(e){
	console.log('Capturando mousedown');
})*/

.on('click', '.single-mail', function(e){

	if( e.ctrlKey || e.metaKey ){

			if( $( this ).hasClass( 'active' ) ){
					$( this ).removeClass( 'active' );
			}else{
					$( this ).addClass( 'active' );
			}

	}else{

		if( !$(this).hasClass('active') ){

			var messageApi = $(this).data();
			var mailboxApi = $('.mailbox-info.active').parent().data();
			var messageDom = $(this);

			if(	messageApi.flags.indexOf('\\Seen') === -1 && $(this).hasClass('unread') ){

				var options = {
    			add_flags: ['\\Seen']
				};

				console.log('voy a marcar como leido');
				messageApi.modifyMessage( options, function(error, message){

					if(error){
						return alert(error);
					}

					messageDom.removeClass('unread');
					var newMessageApi = messageDom.data();
					newMessageApi.flags.push('\\Seen');
					messageDom.data(newMessageApi);

				});

			}

			mailboxApi.getMessage( messageApi.id , function(error, message){

				if(error){
					return alert(error);
				}

				console.log(message);
				$('.full-mail-complete').remove();

				var fullMailItem = fullMailPrototype.clone().removeClass('wz-prototype');
				fullMailItem.find('.full-mail-title').text( message.title );
				fullMailItem.find('.full-mail-delivery').text( message.from.name );
				var date = message.time.toString();
				fullMailItem.find('.full-mail-date').text( date.slice(0,15) );
				fullMailItem.find('.full-mail-text span').html( message.message );

				if( message.flags.indexOf('\\Flagged') !== -1 ){

					fullMailItem.find('.full-important').addClass('active');
					fullMailItem.addClass('flagged');

				}

				if( message.attachments.length > 0 ){

					var attachments = fullMailItem.find('.full-mail-attachments.wz-prototype').clone();
					attachments.removeClass('wz-prototype');
					console.log(attachments);
					attachments.find('.attachments-information').text( message.attachments.length + ' adjuntos' );
					var singleAttachmentPrototype = attachments.find('.attachment.wz-prototype');

					for( var i = 0; i < message.attachments.length; i++ ){

						var attachment = singleAttachmentPrototype.clone().removeClass('wz-prototype');
						attachment.find('div').text( message.attachments[i].name );
						attachment.addClass('attachment-' + i);
						attachment.data( message.attachments[i] );
						attachment.insertAfter( singleAttachmentPrototype );

					}

					attachments.insertAfter( fullMailItem.find('.full-mail-attachments.wz-prototype') );

				}

				fullMailItem.addClass('full-mail-complete');
				fullMailItem.addClass('full-mail-id-' + message.id);
				fullMailItem.data( message );
				fullMailItem.insertAfter( fullMailPrototype );


			});

			$('.emails .active').removeClass('active');
			$(this).addClass('active');

		}

	}


})

.on( 'click', '.mail-options .mark-as-unread', function(){

	var selected = $('.subcontent1 .active');
	var selectedList = [];

	if( selected.length){

		for( var i = 0; i < selected.length; i++){
			selectedList.push(selected[i]);
		}

	}

	selectedList.forEach( function(item){

		var apiMessage = $(item).data();

		if( apiMessage.flags.indexOf('\\Seen') !== -1 && !($(item).hasClass('unread')) ){

			console.log('voy a marcar como no leido');
			var options = {
				remove_flags : ['\\Seen']
			}

			apiMessage.modifyMessage(options, function(error, message){

				if(error){
					return alert(error);
				}

				var index = apiMessage.flags.indexOf('\\Seen');
				apiMessage.flags.splice(index,1);
				console.log('marco como no leido');
				$(item).data(apiMessage);
				$(item).addClass('unread');

			});
		}
	});

})

.on( 'click', '.mail-options .mark-as-read', function(){

	var selected = $('.subcontent1 .active');

	var selectedList = [];

	if( selected.length){

		for( var i = 0; i < selected.length; i++){
			selectedList.push(selected[i]);
		}

	}

	selectedList.forEach( function(item){

		var apiMessage = $(item).data();
		console.log(apiMessage);

		if( apiMessage.flags.indexOf('\\Seen') === -1 && $(item).hasClass('unread') ){

			var options = {
				add_flags : ['\\Seen']
			}

			apiMessage.modifyMessage(options, function(error, message){

				console.log(arguments);
				if(error){
					return alert(error);
				}

				apiMessage.flags.push('\\Seen');
				$(item).data(apiMessage);
				$(item).removeClass('unread');

			});
		}
	});

})

.on( 'click', '.mail-options .delete', function(){

	var selected = $('.subcontent1 .active');
	var selectedList = [];

	if( selected.length){

		for( var i = 0; i < selected.length; i++){
			selectedList.push(selected[i]);
		}

	}

	if( $('.mailbox-info.active span').text() === 'Trash' ){

		confirm('¿Seguro que desea eliminar?', function( input ){

			if( input ){
				selectedList.forEach( function(item){
					var apiMessage = $(item).data();
					apiMessage.removeMessage( function(error){
						if(error){
							return alert(error);
						}
						item.remove();
					});
				});
			}
			
		});

	}else{

		selectedList.forEach( function(item){

			var apiMessage = $(item).data();
			var options = {
				move_to_box : 'Trash'
			}

			apiMessage.modifyMessage(options, function(error){

				if(error){
					return alert(error);
				}

				item.remove();

			});

		});

	}

})

.on( 'click', '.mail-options .mark-as-spam', function(){

	var selected = $('.subcontent1 .active');
	var selectedList = [];

	if( selected.length){

		for( var i = 0; i < selected.length; i++){
			selectedList.push(selected[i]);
		}

	}

	if( $('.mailbox-info.active span').text() !== 'Spam' ){

		selectedList.forEach( function(item){

			var apiMessage = $(item).data();
			var options = {
				move_to_box : 'Spam'
			}

			apiMessage.modifyMessage(options, function(error){

				if(error){
					return alert(error);
				}

				item.remove();

			});

		});

	}

})

.on('click', '.single-mail .toggle-fav', function(e){

	/*var messageApi = $(this).parents('.single-mail').data();
	var options;

	if( $(this).hasClass('active') ){
		options = {
			remove_flags : ['\\Flagged']
		}
	}else{
		options = {
			add_flags : ['\\Flagged']
		}
	}

	messageApi.modifyMessage(options , function(error, message){

		if(error){
			return alert(error);
		}
		console.log(arguments);

		if( $('.full-mail-complete').hasClass('flagged') ){

			$('.full-mail .full-important').removeClass('active');
			$('.full-mail-complete').removeClass('flagged');
			$('.message-' + messageApi.id).addClass('flagged');
			$('.message-' + messageApi.id + ' .important').addClass('active');

		}else{

			$('.full-mail .full-important').removeClass('active');
			$('.full-mail-complete').removeClass('flagged');
			$('.message-' + messageApi.id).removeClass('flagged');
			$('.message-' + messageApi.id + ' .important').removeClass('active');

		}

	})*/

})

.on('click', '.full-mail .full-important', function(e){

	/*var messageApi = $('full-mail-complete').data();
	var options;

	if( $(this).hasClass('active') ){
		options = {
			remove_flags : ['\\Flagged']
		}
	}else{
		options = {
			add_flags : ['\\Flagged']
		}
	}

	messageApi.modifyMessage(options , function(error, message){

		if(error){
			return alert(error);
		}
		console.log(arguments);

		if( $('.full-mail-complete').hasClass('flagged') ){

			$('.full-mail .full-important').removeClass('active');
			$('.full-mail-complete').removeClass('flagged');
			$('.message-' + messageApi.id).addClass('flagged');
			$('.message-' + messageApi.id + ' .important').addClass('active');

		}else{

			$('.full-mail .full-important').removeClass('active');
			$('.full-mail-complete').removeClass('flagged');
			$('.message-' + messageApi.id).removeClass('flagged');
			$('.message-' + messageApi.id + ' .important').removeClass('active');

		}

	})*/

})

.on('click', '.add-account', function(e){
	wz.app.createView( null, 'account' );
})

.on('wz-dragstart' , '.single-mail', function( e,drag ){

	console.log('empiezo a dragear por la vida');
	/*console.log(drag);
	console.log(drag.origin);
	console.log(drag.origin.left);
	console.log(drag.origin['left']);
	console.log(drag.origin.clientY);*/
  var ghost = dragPrototype.cloneWithStyle().removeClass( 'wz-prototype' ).css( {

                        margin : 0,
                        top    : 'auto',
                        left   : 'auto',
                        bottom : 'auto',
                        right  : 'auto'

  } );

  drag.ghost(ghost);

})

.on( 'wz-dropenter', '.mailbox-info', function( e,item ){

  $(this).addClass('dragging-active');

})

.on( 'wz-dropleave', '.mailbox-info', function( e,item ){

  $(this).removeClass('dragging-active');

})

.on( 'wz-drop', '.wz-drop-area', function( e,item ){

  var boxDestino = $(this).parent().data().path;

  if( boxDestino ){

		var options = {
			move_to_box : boxDestino
		}

		console.log( $('.mailbox.active').data().path );
		console.log( boxDestino );
		if( $('.mailbox.active').data().path != boxDestino ){

			item.data().modifyMessage(options ,function(error){
				console.log(arguments);
				if(error){
					return alert(error);
				}
	    });

		}

  }
	//return alert('Drag and drop no implementado');

})

.on('click', '.attachment' , function(){

	console.log( $(this).data() );
	/*$(this).data().import( function( error ){
		console.log( arguments );
	});*/

})

.on('click', '.composeButton' , function(){
	wz.app.createView(null, 'new');
})

.on( 'contextmenu', '.mailbox', function(e){

  var boxApi = $(this).data();

  wz.menu().
		addOption( lang.renameBox, function(){
			//boxApi.renameBox();
		})
		.addOption( lang.deleteBox, function(){
			//boxApi.removeBox();
		})
		.addOption( 'Cambiar tipo', function(){

		})
		.render();

})

.on( 'contextmenu', '.mail-account', function(e){

	if( $(e.target).closest('.mailbox').length ){
		return;
	}

  var accountApi = $(this).data();

  wz.menu().
		addOption( lang.renameAccount, function(){
			//boxApi.renameBox();
		})
		.addOption( lang.deleteAccount, function(){
			//boxApi.removeBox();
		})
		.render();

});

wz.mail.on( 'flagChanged' , function( accountId, path, uid, flags ){

  console.log('Cambio de flags: ', arguments);

	var selector = generateSelectorString(path);
	selector += '.active';
	console.log(selector);

	if( $(selector + '.active').length !== 0 ){

		var message = $( '.single-mail.message-' + uid );
		var apiMessage = message.data();
		apiMessage.flags = flags;

		if( message.length !== 0 ){

			if( flags.indexOf('\\Seen') === -1 ){
				message.addClass('unread');
			}
			else{
				message.removeClass('unread');
			}

			if( flags.indexOf('\\Flagged') !== -1 ){
				message.addClass('flagged');
				//message.find('.important').addClass('active');
			}else{
				message.removeClass('flagged');
			}

		}

	}

	refreshUnreads( accountId, path );

})

.on( 'modifyMessage' , function( mailAccountId, boxId, options, mods ){
	console.log('Modify message', arguments);
})

.on( 'messageIn' , function( mailAccountId, boxId, options, mods ){

	console.log('Message in', arguments);
	console.log('.account-' + mailAccountId + '.box-' + boxId + '.active');
	var boxDom = $('.account-' + mailAccountId + '.box-' + boxId + '.active');


	if ( boxDom.lenght > 0 ){

		var boxApi 	= boxDom.data();
		var message = mailPrototype.clone().removeClass('wz-prototype');

		boxApi.getMessage( options[2] , function(error, message){

			if(error){
				return alert(error);
			}

			message.data( message );
			message.find('.mail-from').text( message.from.name );
			message.find('.mail-subject').text( message.title );
			message.find('.mail-date').text( message.date );
			message.addClass('message-' + message.id);

			if( message.flags.indexOf('\\Seen') === -1 ){
				message.addClass('unread');
			}

			if( message.flags.indexOf('\\Flagged') !== -1 ){
				message.addClass('flagged');
				message.find('.important').addClass('active');
			}

			message.insertAfter( mailPrototype );

		});
	}

})

.on( 'messageOut' , function( mailAccountId, boxId, options, mods ){

	console.log('Message out', arguments);
	var boxDom = $('.account-' + mailAccountId + '.box-' + boxId + '.active');

	if ( boxDom.length > 0 ){
		console.log('.single-mail.message-' + options);
		$('.single-mail.message-' + options).remove();
	}

});

initMail();
