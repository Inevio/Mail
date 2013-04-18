
wz.app.addScript( 8, 'account', function( win, app, lang, params ){

	var content = $( '.content', win );
	var email = '';
	var pass = '';
	var username = '';
	var smtpHost = '';
	var smtpPort = 0;
	var imapHost = '';
	var imapPort = 0;
    
    win
    
        .on( 'click', '.next', function(){

        	email = $( '.mail', content ).val();
        	pass = $( '.pass', content ).val();

        	content.css({ 'height' : '295' });
        	win.transition( { 'height' : '420' }, 250);

        	$( '.description', content ).text( 'Rellena los siguientes datos sobre tu cuenta de correo para terminar.' );
        	$( '.mail', content ).removeClass( 'mail' ).addClass( 'username' ).find( 'span' ).text( 'Nombre de usuario:' );
        	$( '.pass', content ).remove();
        	var object = $( '.username', content );
        	object.clone().appendTo( content ).removeClass( 'username' ).addClass( 'smtp-host' ).find( 'span' ).text( 'Servidor SMTP:' );
        	object.clone().appendTo( content ).removeClass( 'username' ).addClass( 'smtp-port' ).find( 'span' ).text( 'Puerto SMTP:' );
        	object.clone().appendTo( content ).removeClass( 'username' ).addClass( 'imap-host' ).find( 'span' ).text( 'Servidor IMAP:' );
        	object.clone().appendTo( content ).removeClass( 'username' ).addClass( 'imap-port' ).find( 'span' ).text( 'Puerto IMAP:' );

        	$( '.next', content ).appendTo( content ).removeClass( 'next' ).addClass( 'save' ).text( 'Guardar' );

        })

		.on( 'click', '.save', function(){

			console.log( 'Entro' );

        	username = $( '.username', content ).val();
        	smtpHost = $( '.smtp-host', content ).val();
        	smtpPort = $( '.smtp-port', content ).val();
        	imapHost = $( '.imap-host', content ).val();
        	imapPort = $( '.imap-port', content ).val();

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
        		function( error ){

        			console.log( 'Callback' );

        			if( error ){
        				console.log( error );
        			}else{
        				wz.app.closeWindow( win.data( 'win-id' ) );
        				wz.banner()
        					.title( 'Mail account added' )
        					.text( email + ' ' + 'has been added to weeMail' )
        					.image()
        					.render();
        			}

        		}

        	);

        });
    
});
