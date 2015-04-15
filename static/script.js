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
	$('.mail-account .semiactive').removeClass('semiactive');
	$('.general-options .active').removeClass('active');
	$(this).addClass('active');	
});

opcionesParticulares.on('click',function(){
	$('.general-options .active').removeClass('active');
	$('.mail-account .semiactive').removeClass('semiactive');
	$('.mail-account .active').removeClass('active');
	$(this).addClass('active');	
});

$('.accounts > .mail-account').on('click',function(){
	$(this).toggleClass('expanded-options');
});