
wz.app.addScript( 8, 'new', function( win, app, lang, params ){
    
    win
    
        .on( 'click', '.content-send', function(){
            alert('I\'m sorry but you can\'t send messages right now.');
        });
    
});
