
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


var initCalendar = function(){

	wz.mail.getAccounts( function(error, list){

		if( error ){
			return alert(error);
		}

		if( !list.length ){
			return alert('añada una cuenta');
		}

		console.log(list);

		for( var i=0 ; i < list.length ; i++ ){

			var accountItem = accountPrototype.clone().removeClass('wz-prototype');

			accountItem.addClass( 'account-' + list[i].id )
			.data(
				list[i]
			)
			.children('.account-info')
			.children('span').text( list[i].address );

			/*console.log(accountItem);
			accountList.append(accountItem);*/
			var boxPrototype; = accountItem.children('.mailbox.wz-prototype');
			var childrenList; = accountItem.children('.children');

			//console.log('testing');

			list[i].getBoxes( function( error, boxes ){

				console.log(boxes);
				console.log('testing callback');

				for ( var j=0; j<boxes.length; j++ ){

					var boxItem = boxPrototype.clone().removeClass('wz-prototype');
					boxItem.children('.mailbox-info')
					.children('span').text();

				}

			});

			console.log('ending log');

		}



	});

}




singleMail.on('click', function(){
	$('.emails .semiactive').removeClass('semiactive');
	if($(this).hasClass('active')){
		$('.emails .active').toggleClass('active');
	}else{
		$('.emails .active').removeClass('active');
		$(this).addClass('active');
	}
});


opcionesGlobales.on('click', function(){
	$('.mail-account .active').removeClass('active');
	$('.general-options .active').removeClass('active');
	$(this).addClass('active');
});

$('.mailbox-info').on('click',function(e){
	$('.mailbox-info.active').removeClass('active');
	$(this).addClass('active');

	/*if( $(this).parent().hasClass('arrow-opened') ){
		e.stopPropagation();
	}*/

});

$('.composeButton').on('click', function(){
	wz.app.createView(null, 'new');
})

win.on('click','.mailbox', function(e){

	e.stopPropagation();
	console.log('capturo click');

	if( !$(this).hasClass('hide-arrow') ){

		if( !$(this).hasClass('arrow-opened') ){

			$(this).removeClass('arrow-closed');
			$(this).addClass('arrow-opened');
			$(this).children('.children').first().css('display', 'block');

		}else{

			$(this).removeClass('arrow-opened');
			$(this).addClass('arrow-closed');
			$(this).children('.children').first().css('display', 'none');

		}
	}


})


.on('click', '.mail-account' ,function(){

	if( !$(this).hasClass('arrow-opened') ){

		$(this).removeClass('arrow-closed');
		$(this).addClass('arrow-opened');
		$(this).children('.children').first().css('display', 'block');

	}else{

		$(this).removeClass('arrow-opened');
		$(this).addClass('arrow-closed');
		$(this).children('.children').first().css('display', 'none');

	}

});

initCalendar();
