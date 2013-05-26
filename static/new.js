
wz.app.addScript( 8, 'new', function( win, app, lang, params ){
    
    win
    
        .on( 'click', '.content-send', function(){
            alert('I\'m sorry but you can\'t send messages right now.');
        });

    $( '.wz-win-menu span', win ).text( lang.newEmail );
    $( '.content-to span', win ).text( lang.to + ':' );
    $( '.content-to input', win ).val( params );
    $( '.content-subject span', win ).text( lang.subject + ':' );
    $( '.content-from span', win ).text( lang.from + ':' );
    $( '.content-send span', win ).text( lang.send );
    
});
