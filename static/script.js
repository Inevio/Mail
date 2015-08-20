
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
var linePrototype					= $('.line.wz-prototype');
var fullMailPrototype			= $('.full-mail.wz-prototype');

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



var initCalendar = function(){

	wz.mail.getAccounts( function(error, list){

		if( error ){
			return alert(error);
		}

		if( !list.length ){
			return alert('añada una cuenta');
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

				var accUnread = 0;

				for ( var i=0; i<boxes.length; i++ ){

					var boxItem = boxPrototype.clone().removeClass('wz-prototype');
					boxItem.addClass('box-' + boxes[i].name);
					boxItem.children('.mailbox-info').children('span').text(boxes[i].path);
					boxItem.data(boxes[i]);
					if( boxes[i].unread > 0 ){
						boxItem.children('.mailbox-info').children('.bullet').text( boxes[i].unread );
						accUnread += boxes[i].unread;
					}
					//childrenList.append(boxItem);
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
				if( accUnread > 0 ){
					accountItem.children('.account-info').children('.bullet').text( accUnread );
				}

			});

		});

	});

}


$('.composeButton').on('click', function(){
	wz.app.createView(null, 'new');
})

win.on('click','.mailbox', function(e){

	$('.full-mail-complete').remove();
	$('.mailbox-info.active').removeClass('active');
	$(this).children('.mailbox-info').addClass('active');

	var mailboxApi = $(this).data();
	console.log(mailboxApi);

	mailboxApi.getMessages(0,20,function(error, messages){

		mailList.children().not(':first').remove();

		if(error){
			return alert(error);
		}

		console.log(messages);

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

			var line = linePrototype.clone().removeClass('wz-prototype');
			mailList.append(message);
			mailList.append(line);



		}

	});

	e.stopPropagation();

})

.on('click', '.mailbox .arrow' ,function(e){

	if($(this).parents('.mailbox').first().hasClass('arrow-opened')){

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

.on('click', '.single-mail', function(e){

	if( e.ctrlKey || e.metaKey ){

			if( $( this ).hasClass( 'active' ) ){
					$( this ).removeClass( 'active' );
			}else{
					$( this ).addClass( 'active' );
			}

	}else{

		if(!$(this).hasClass('active')){

			var messageApi = $(this).data();
			var mailboxApi = $('.mailbox-info.active').parent().data();
			var messageDom = $(this);

			if(	messageApi.flags.indexOf('\\Seen') === -1 && $(this).hasClass('unread') ){

				var options = {
    			add_flags: ['\\Seen']
				};

				messageApi.modifyMessage( options, function(error, message){

					if(error){
						return alert(error);
					}

					console.log(messageDom);
					messageDom.removeClass('unread');

				});

			}

			console.log(messageApi.id);
			mailboxApi.getMessage( messageApi.id , function(error, message){

				console.log(arguments);
				if(error){
					return alert(error);
				}

				var fullMailItem = fullMailPrototype.clone().removeClass('wz-prototype');
				console.log(message);

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

.on( 'click', '.mail-options .unread', function(){

	var selected = $('.subcontent1 .active');

	console.log(selected);

	var selectedList = [];

	if( selected.length){

		for( var i = 0; i < selected.length; i++){
			selectedList.push(selected[i]);
		}

	}

	selectedList.forEach( function(item){

		console.log(item);
		var apiMessage = $(item).data();

		console.log(apiMessage.flags.indexOf('\\Seen'));
		console.log($(item).hasClass('unread'));

		if( apiMessage.flags.indexOf('\\Seen') !== -1 && !($(item).hasClass('unread')) ){

			var options = {
				remove_flags : ['\\Seen']
			}

			apiMessage.modifyMessage(options, function(error, message){

				console.log(arguments);
				if(error){
					return alert(error);
				}

				$(item).data(message);
				$(item).addClass('unread');

			});
		}
	});

})

.on( 'click', '.mail-options .read', function(){

	var selected = $('.subcontent1 .active');

	console.log(selected);

	var selectedList = [];

	if( selected.length){

		for( var i = 0; i < selected.length; i++){
			selectedList.push(selected[i]);
		}

	}

	selectedList.forEach( function(item){

		console.log(item);
		var apiMessage = $(item).data();

		if( apiMessage.flags.indexOf('\\Seen') === -1 && $(item).hasClass('unread') ){

			var options = {
				add_flags : ['\\Seen']
			}

			apiMessage.modifyMessage(options, function(error, message){

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

	/*var selected = $('.subcontent1 .active');

	console.log(selected);

	var selectedList = [];

	if( selected.length){

		for( var i = 0; i < selected.length; i++){
			selectedList.push(selected[i]);
		}

	}

	selectedList.forEach( function(item){

		console.log(item);
		var apiMessage = $(item).data();
		apiMessage.removeMessage( function(error){

			if(error){
				return alert(error);
			}

			item.remove();

		});

	});*/

})

.on('click', '.single-mail .important', function(e){



	/*if( $(this).hasClass('active') ){



	}else{



	}*/

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

		if( $('.full-mail-complete').hasClass('active') ){

			$('.full-mail .full-important').removeClass('active');
			$('.full-mail-complete').removeClass('flagged');

		}else{

			$('.full-mail .full-important').removeClass('active');
			$('.full-mail-complete').removeClass('flagged');


		}

	})*/

})

.on('click', '.add-account', function(e){
	wz.app.createView( null, 'account' );
})

.on('wz-dragstart' , '.single-mail', function( e,drag ){

	console.log('empiezo a dragear por la vida');
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

.on( 'mail-flagChanged' , function( accountId, path, uid, flags ){

  console.log('Cambio de flags: ');
  console.log(arguments);

});

initCalendar();
