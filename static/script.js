
var win                 	= $( this );
var singleMail       			= $('.single-mail');
var allInbox        			= $('.general-options .all-inbox');
var starred       				= $('.general-options .starred');
var drafts        				= $('.general-options .drafts');
var sent        					= $('.general-options .sent');
var spam        					= $('.general-options .spam');
var trash        					= $('.general-options .trash');
var opcionesGlobales			= $('.general-options .options');
//var mailBox 							= $('.mail-account .options');
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
				console.log(boxes);

				for ( var i=0; i<boxes.length; i++ ){

					var boxItem = boxPrototype.clone().removeClass('wz-prototype');
					boxItem.addClass('box-' + boxes[i].name);
					boxItem.children('.mailbox-info').children('span').text(boxes[i].path);
					boxItem.data(boxes[i]);
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

			});

		});

	});

}


$('.composeButton').on('click', function(){
	wz.app.createView(null, 'new');
})

win.on('click','.mailbox', function(e){


	console.log('capturo click');

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

	console.log($(this));

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

			mailboxApi.getMessage( messageApi.id , function(error, message){

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

				fullMailItem.insertAfter( fullMailPrototype );

			});



			$('.emails .active').removeClass('active');
			$(this).addClass('active');

		}

	}


})

.on( 'click', '.subcontent1 .unread', function(){

	/*var selected = $('.subcontent1 .active');

	console.log(selected);

	if( selected.length && selected.length > 1 ){

		var selectedList = [];
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

.on( 'click', '.subcontent1 .read', function(){

	/*var selected = $('.subcontent1 .active');

	console.log(selected);

	if( selected.length && selected.length > 1 ){

		var selectedList = [];
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

.on( 'click', '.subcontent1 .delete', function(){

	var selected = $('.subcontent1 .active');

	console.log(selected);

	if( selected.length && selected.length > 1 ){

		var selectedList = [];
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

	});

});


initCalendar();
