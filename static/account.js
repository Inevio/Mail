
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
    
    win
    
        .on( 'click', '.next', function(){

        	email = $( '.mail', content ).find( 'input' ).val();
        	pass = $( '.pass', content ).find( 'input' ).val();
        	
        	win.transition( { 'height' : '480' }, 250);
            content.transition( { 'height' : '360' }, 250);

        	$( '.description', content ).text( 'Rellena los siguientes datos sobre tu cuenta de correo para terminar.' );
        	$( '.mail', content ).removeClass( 'mail' ).addClass( 'username' ).find( 'span' ).text( 'Nombre de usuario:' );
        	$( '.pass', content ).remove();
        	var object = $( '.username', content );
            object.find( 'input' ).val( '' );
        	object.clone().appendTo( content ).removeClass( 'username' ).addClass( 'smtp-host' ).find( 'span' ).text( 'Servidor SMTP:' );
        	object.clone().appendTo( content ).removeClass( 'username' ).addClass( 'smtp-port' ).find( 'span' ).text( 'Puerto SMTP:' );
            $( '.prototype', content ).clone().appendTo( content ).removeClass( 'prototype' ).addClass( 'smtp-secure' ).find( 'span' ).text( 'Conexión SMTP segura:' );
        	object.clone().appendTo( content ).removeClass( 'username' ).addClass( 'imap-host' ).find( 'span' ).text( 'Servidor IMAP:' );
        	object.clone().appendTo( content ).removeClass( 'username' ).addClass( 'imap-port' ).find( 'span' ).text( 'Puerto IMAP:' );
            $( '.prototype', content ).clone().appendTo( content ).removeClass( 'prototype' ).addClass( 'imap-secure' ).find( 'span' ).text( 'Conexión IMAP segura:' );

        	$( '.next', content ).appendTo( content ).removeClass( 'next' ).addClass( 'save' ).text( 'Guardar' );

        })

		.on( 'click', '.save', function(){

        	username = $( '.username', content ).find( 'input' ).val();
        	smtpHost = $( '.smtp-host', content ).find( 'input' ).val();
        	smtpPort = $( '.smtp-port', content ).find( 'input' ).val();
            smtpSecure = $( '.smtp-secure', content ).find( 'input' ).is( ':checked' );
        	imapHost = $( '.imap-host', content ).find( 'input' ).val();
        	imapPort = $( '.imap-port', content ).find( 'input' ).val();
            imapSecure = $( '.imap-secure', content ).find( 'input' ).is( ':checked' );

        	wz.mail.addAccount( 

        		email,
        		{
        			username : username,
        			password : pass,
        			smtp_host : smtpHost,
        			smtp_port : smtpPort,
        			smtp_secure : false,
        			imap_host : imapHost,
        			imap_port : imapPort,
        			imap_secure : false
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

        });
    
});
