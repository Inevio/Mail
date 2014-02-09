
var win = $( this );

    $(win)

    .on( 'click', '.gmail', function(){

        wz.mail.addGmailAccount();
        wz.view.remove();

    })

    .on( 'click', '.yahoo, .hotmail, .outlook, .other', function(){

        wz.app.createView( params, 'account' );
        wz.view.remove();

    });

    $( '.hosting-title', win ).text( lang.chooseServer );
    $( '.hosting-image-other', win ).text( lang.chooseOther );
