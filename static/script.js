var singleMail       			= $('.single-mail');
var allInbox        			= $('.general-options .all-inbox');
var starred       				= $('.general-options .starred');
var drafts        				= $('.general-options .drafts');
var sent        					= $('.general-options .sent');
var spam        					= $('.general-options .spam');
var trash        					= $('.general-options .trash');
var opcionesGlobales			= $('.general-options .options');
var opcionesParticulares 	= $('.mail-account .options');


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

opcionesParticulares.on('click',function(e){
	$('.general-options .active').removeClass('active');
	$('.mail-account .active').removeClass('active');
	$(this).addClass('active');
	e.stopPropagation();
});

$('.mail-account').on('click',function(){
	console.log('entro en click');
	if( !$(this).hasClass('expanded-options') ){
		$('.mail-account').removeClass('expanded-options');
		$(this).toggleClass('expanded-options');
		$(this).height( 313 );
	}else{
		$(this).toggleClass('expanded-options');
		$(this).height( 31 );
	}
});
