
wz.app.addScript( 8, 'hosting', function( win, app, lang, params ){

	$(win)

        .on( 'click', '.gmail', function(){

            wz.mail.addGmailAccount();
            wz.app.closeWindow( win );

        })

        .on( 'click', '.other', function(){

            wz.app.createWindow( 8, params, 'account' );
            wz.app.closeWindow( win );

        });

    $( '.hosting-title', win ).text( lang.chooseServer );
    $( '.hosting-image-other', win ).text( lang.chooseOther );
    
});