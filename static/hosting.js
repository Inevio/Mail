
var win = $( this );

    $(win)

    .on( 'click', '.gmail', function(){

        wz.mail.addGmailAccount();
        wz.app.closeWindow( win );

    })

    .on( 'click', '.yahoo, .hotmail, .outlook, .other', function(){

        wz.app.createView( params, 'account' );
        wz.app.closeWindow( win );

    });

    $( '.hosting-title', win ).text( lang.chooseServer );
    $( '.hosting-image-other', win ).text( lang.chooseOther );
