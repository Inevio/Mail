
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
