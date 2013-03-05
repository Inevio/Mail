
wz.app.addScript( 8, 'common', function( win ){
    
    $(win)
	
		.on( 'click', '.account', function(){
			if( $(this).hasClass('display') ){
				$(this).removeClass('display');
				$(this).transition({ height: 38 }, 250);
			}else{
				$('.display').transition({ height: 38 }, 250).removeClass('display');
				$(this).addClass('display');
				$(this).transition({ height: 250 }, 250);
			}
		})
		
		.on( 'click', '.account article', function(e){
			e.stopPropagation();
		})
		
		.on( 'click', '.message', function(){
			if( !$(this).hasClass('selected') ){
				$('.selected').removeClass('selected');
				$(this).addClass('selected');
			}		
		})
		
		.on( 'click', 'input', function(e){
			e.stopPropagation();
		})
		
		.on( 'click', '.message-star', function(e){
			e.stopPropagation();
			if( $(this).hasClass('active') ){
				$(this).removeClass('active');
			}else{
				$(this).addClass('active');
			}
		});

});
