
var win = $( this );

win
.on( 'click', '.gmail', function(){

    wz.mail.addGmailAccount();
    wz.view.remove();

})

.on( 'click', '.hotmail, .outlook', function(){

    wz.mail.addOutlookAccount( params, 'account' );
    wz.view.remove();

})

.on( 'click', '.yahoo, .other', function(){

    wz.app.createView( params, 'account' );
    wz.view.remove();

});

$('.hosting-title').text( lang.chooseServer );
$('.hosting-image-other').text( lang.chooseOther );
