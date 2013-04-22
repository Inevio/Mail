
wz.app.addScript( 8, 'account', function( win, app, lang, params ){

	var content = $( '.content', win );
	var email = '';
	var pass = '';
	var username = '';
	var smtpHost = '';
	var smtpPort = 0;
    var smtpSecure = false;
	var imapHost = '';
	var imapPort = 0;
    var imapSecure = false;

    $( '.mail', content ).find( 'input' ).focus();
    
    win
    
        .on( 'click', '.next', function(){

        	email = $( '.mail', content ).find( 'input' ).val();
        	pass = $( '.pass', content ).find( 'input' ).val();

            if( email && pass ){

                win.transition( { 'height' : '480' }, 250);
                content.transition( { 'height' : '360' }, 250);

                $( '.description', content ).text( 'Rellena los siguientes datos sobre tu cuenta de correo para terminar.' );
                $( '.mail', content ).removeClass( 'mail' ).addClass( 'username' ).find( 'span' ).text( 'Nombre de usuario:' );
                $( '.pass', content ).remove();

                var object = $( '.username', content );

                object.find( 'input' ).val( '' );
                object.find( 'input' ).focus();
                object.clone().appendTo( content ).removeClass( 'username' ).addClass( 'smtp-host' ).find( 'span' ).text( 'Servidor SMTP:' );
                object.clone().appendTo( content ).removeClass( 'username' ).addClass( 'smtp-port' ).find( 'span' ).text( 'Puerto SMTP:' );
                $( '.prototype', content ).clone().appendTo( content ).removeClass( 'prototype' ).addClass( 'smtp-secure' ).find( 'span' ).text( 'Conexión SMTP segura:' );
                object.clone().appendTo( content ).removeClass( 'username' ).addClass( 'imap-host' ).find( 'span' ).text( 'Servidor IMAP:' );
                object.clone().appendTo( content ).removeClass( 'username' ).addClass( 'imap-port' ).find( 'span' ).text( 'Puerto IMAP:' );
                $( '.prototype', content ).clone().appendTo( content ).removeClass( 'prototype' ).addClass( 'imap-secure' ).find( 'span' ).text( 'Conexión IMAP segura:' );

                $( '.next', content ).appendTo( content ).removeClass( 'next' ).addClass( 'save' ).text( 'Guardar' );

            }else if( !email ){
                alert( 'Please introduce your mail' );
            }else if( !pass ){
                alert( 'Please introduce your password' );
            }   	

        })

		.on( 'click', '.save', function(){

        	username = $( '.username', content ).find( 'input' ).val();
        	smtpHost = $( '.smtp-host', content ).find( 'input' ).val();
        	smtpPort = parseInt( $( '.smtp-port', content ).find( 'input' ).val(), 10);
            smtpSecure = $( '.smtp-secure', content ).find( 'input' ).is( ':checked' );
        	imapHost = $( '.imap-host', content ).find( 'input' ).val();
        	imapPort = parseInt( $( '.imap-port', content ).find( 'input' ).val(), 10);
            imapSecure = $( '.imap-secure', content ).find( 'input' ).is( ':checked' );

            if( username && smtpHost && !isNaN( smtpPort ) && smtpPort > 1 && smtpPort < 65535 && imapHost && !isNaN( imapPort ) && imapPort > 1 && imapPort < 65535 ){

                wz.mail.addAccount( 

                    email,

                    {
                        username : username,
                        password : pass,
                        smtp_host : smtpHost,
                        smtp_port : smtpPort,
                        smtp_secure : smtpSecure,
                        imap_host : imapHost,
                        imap_port : imapPort,
                        imap_secure : imapSecure
                    },

                    function( error, details ){

                        if( error ){
                            console.log( error );
                            console.log( details );
                            alert( 'I\'m sorry but an error has occur' );
                        }else{
                            wz.app.closeWindow( win );
                            wz.banner()
                                .title( 'Mail account added' )
                                .text( email + ' ' + 'has been added to weeMail' )
                                .image( 'https://static.weezeel.com/app/8/envelope.png' )
                                .render();
                        }

                    }

                );

            }else if( !username ){
                alert( 'Please introduce your username' );
            }else if( !smtpHost ){
                alert( 'Please introduce your SMTP host' );
            }else if( isNaN( smtpPort ) || smtpPort < 1 || smtpPort > 65535 ){
                alert( 'Please introduce a correct SMTP port' );
            }else if( !imapHost ){
                alert( 'Please introduce your IMAP host' );
            }else if( isNaN( imapPort ) || imapPort < 1 || imapPort > 65535 ){
                alert( 'Please introduce a correct IMAP port' );
            }        	

        })

        .key( 'enter', function( e ){

            if( $( e.target ).is( 'input' ) ){
                $( 'button', win ).click();
            }

        });
    
});
