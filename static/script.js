
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
					boxItem.addClass('box-' + boxes[i].name);
					boxItem.addClass('account-' + item.id );
					boxItem.children('.mailbox-info').children('span').text(boxes[i].path);
					boxItem.data(boxes[i]);

					if( boxes[i].children.length > 0 ){
						var childrens = addBoxChildrens(boxes[i], boxItem);
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

var addBoxChildrens = function (boxApi, boxFather){

	var boxList = [];
	boxFather.removeClass('hide-arrow').addClass('arrow-closed');

	for( var i=0; i< boxApi.children.length; i++ ){

		var boxItem = boxPrototype.clone().removeClass('wz-prototype');
		boxItem.addClass('box-' + boxApi.children[i].name);
		boxItem.children('.mailbox-info').children('span').text(boxApi.children[i].name);
		boxItem.data(boxApi.children[i]);

		if(boxApi.children[i].children.length >0){
			addBoxChildrens(boxApi.children[i], boxItem);
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

var refreshUnreads = function( accId, box ){

	var accountDom = $('.account-' + accId);
	var accountApi = accountDom.data();
	console.log('Argumentos:', arguments);

	if( typeof box !== "undefined" ){

		accountApi.getBox( box, function( error, boxApi ){

			if(error){
				alert(error);
			}

			var boxDom = $( '.account-' + accId + '.box-' + boxApi.name );
			var oldUnread = boxDom.children('.mailbox-info').children('.bullet').text();
			var totalUnread = accountDom.children('.account-info').children('.bullet').text();

			boxDom.data( boxApi );
			console.log( boxApi );
			var newUnread = boxApi.unread;

			if( newUnread == -1 ){
				newUnread = 0;
			}

			if ( totalUnread == '' ){
				totalUnread = 0;
			}

			if( oldUnread == '' ){
				oldUnread = 0;
			}

			console.log( totalUnread );
			console.log( newUnread );
			console.log( oldUnread );

			totalUnread = totalUnread + newUnread - oldUnread;

			if( newUnread == 0 ){
				newUnread = '';
			}
			if( totalUnread == -1 || totalUnread == 0 ){
				totalUnread = '';
			}

			console.log(totalUnread);
			boxDom.children('.mailbox-info').children('.bullet').text( newUnread );
			accountDom.children('.account-info').children('.bullet').text( totalUnread );

		});

	}else{

		var totalUnread = 0;
		var boxes = accountDom.find( '.mailbox.account-' + accId );

		for( var i = 0; i < boxes.length; i++ ){

			var unread = boxes.eq(i).data().unread;

			if ( unread > 0 ){

				boxes.eq(i).children('.mailbox-info').children('.bullet').text( unread );
				totalUnread += unread;

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

					console.log('marco como leido');
					console.log(message);
					messageDom.removeClass('unread');
					messageDom.data(message);
					messageApi = message;

				});

			}

			mailboxApi.getMessage( messageApi.id , function(error, message){

				if(error){
					return alert(error);
				}

				console.log(message);
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

				fullMailItem.addClass('full-mail-complete');
				fullMailItem.addClass('full-mail-id-' + message.id);
				fullMailItem.data(message);

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

				console.log('marco como no leido');
				console.log(arguments);
				$(item).data(message);
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

				$(item).data(message);
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

		selectedList.forEach( function(item){

			var apiMessage = $(item).data();

			apiMessage.removeMessage( function(error){

				if(error){
					return alert(error);
				}

				item.remove();

			});

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

	//console.log('empiezo a dragear por la vida');
  //var ghost = messagePrototype.clone().removeClass( 'wz-prototype' );
  var ghost = $(this).cloneWithStyle().css( {

                        margin : 0,
                        top    : 'auto',
                        left   : 'auto',
                        bottom : 'auto',
                        right  : 'auto'

  } );

  drag.ghost(ghost);

})

.on( 'wz-dropenter', '.mailbox-info', function( e,file ){

  $(this).addClass('active');

})

.on( 'wz-dropleave', '.mailbox-info', function( e,file ){

  $(this).removeClass('active');

})

.on( 'wz-drop', '.wz-drop-area', function( e,item ){

  /*var boxDestino = $(this).parent().data().path;
  if( boxDestino){
		var options = {
			move_to_box : boxDestino
		}
    item.data().modifyMessage(options ,function(error){

			console.log(arguments);

			if(error){
				return alert(error);
			}

    });
  }*/
	return alert('Drag and drop no implementado');


})

.on('click', '.composeButton' , function(){
	wz.app.createView(null, 'new');
});

wz.mail.on( 'flagChanged' , function( accountId, path, uid, flags ){

  console.log('Cambio de flags: ', arguments);
	console.log( '.account-' + accountId + '.box-' + path + '.active' );

	if( $( '.account-' + accountId + '.box-' + path + '.active' ).length !== 0 ){

		var message = $( '.single-mail.message-' + uid );
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
	console.log('Message in2', arguments);
});

initMail();
