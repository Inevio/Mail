
wz.app.addScript( 8, 'account', function( win, app, lang, params ){

	var content = $( '.content', win );
	var email = '';
	var pass = '';
    var name = '';
    var description = '';
	var username = '';
    var inHost = '';
    var inPort = 0;
    var inSecure = false;
	var outHost = '';
	var outPort = 0;
    var outSecure = false;
    var mailExpresion = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    $( '.name', content ).find( 'input' ).val( wz.info.user().fullName );
    $( '.mail', content ).find( 'input' ).focus();

    var whichName = function(){

        win.transition( { 'height' : '256' }, 250);
        content.transition( { 'height' : '146' }, 250);

        $( '.description', content ).text( '¿Con qué nombre quieres que se muestre tu cuenta de correo en la barra lateral?' );

        $( '.name', content ).removeClass( 'name' ).addClass( 'account-name' ).find( 'span' ).text( 'Nombre de la cuenta:' );
        $( '.username', content ).removeClass( 'username' ).addClass( 'account-name' ).find( 'span' ).text( 'Nombre de la cuenta:' );

        $( '.account-name', content ).find( 'input' ).val( email ).focus();

        $( '.next', content ).appendTo( content ).removeClass( 'next' ).addClass( 'finish' ).text( 'Terminar' );
        $( '.save', content ).appendTo( content ).removeClass( 'save' ).addClass( 'finish' ).text( 'Terminar' );

        content.children().not( '.finish , .account-name, .description' ).remove();

    }

    var moreData = function(){

        win.transition( { 'height' : '502' }, 250);
        content.transition( { 'height' : '392' }, 250);

        $( '.description', content ).text( 'Rellena los siguientes datos sobre tu cuenta de correo para terminar.' );
        $( '.name', content ).removeClass( 'name' ).addClass( 'username' ).find( 'span' ).text( 'Nombre de usuario:' );
        $( '.mail', content ).remove();
        $( '.pass', content ).remove();

        var object = $( '.username', content );

        object.find( 'input' ).val( '' );
        object.find( 'input' ).focus();
        $( '.wz-prototype.select', content ).clone().appendTo( content ).removeClass( 'wz-prototype' ).addClass( 'in-protocol' ).find( 'span' ).text( 'Conexión entrante:' );
        object.clone().appendTo( content ).removeClass( 'username' ).addClass( 'in-host' ).find( 'span' ).text( 'Servidor entrante:' );
        object.clone().appendTo( content ).removeClass( 'username' ).addClass( 'in-port' ).find( 'span' ).text( 'Puerto entrante:' );
        $( '.wz-prototype.checkbox', content ).clone().appendTo( content ).removeClass( 'wz-prototype' ).addClass( 'in-secure' ).find( 'span' ).text( 'Conexión entrante segura:' );
        object.clone().appendTo( content ).removeClass( 'username' ).addClass( 'out-host' ).find( 'span' ).text( 'Servidor saliente:' );
        object.clone().appendTo( content ).removeClass( 'username' ).addClass( 'out-port' ).find( 'span' ).text( 'Puerto saliente:' );
        $( '.wz-prototype.checkbox', content ).clone().appendTo( content ).removeClass( 'wz-prototype' ).addClass( 'out-secure' ).find( 'span' ).text( 'Conexión saliente segura:' );

        $( '.next', content ).appendTo( content ).removeClass( 'next' ).addClass( 'save' ).text( 'Guardar' );

    }

    var finish = function(){

        if( params ){

            wz.app.closeWindow( win );
            wz.banner()
                .title( 'Account name changed' )
                .text( email + ' ' + 'is now called' + ' ' + description )
                .image( 'https://static.weezeel.com/app/8/envelope.png' )
                .render();

        }else{

            wz.app.closeWindow( win );
            wz.banner()
                .title( 'Mail account added' )
                .text( email + ' ' + 'has been added to weeMail' )
                .image( 'https://static.weezeel.com/app/8/envelope.png' )
                .render();

        }

    }

    if( params ){
        email = params;
        whichName();
    }
    
    win
    
        .on( 'click', '.next', function(){

        	email = $( '.mail', content ).find( 'input' ).val();
        	pass = $( '.pass', content ).find( 'input' ).val();
            name = $( '.name', content ).find( 'input' ).val();

            if( mailExpresion.test( email ) && pass && name ){

                wz.mail.addAccount(

                    {
                        address : email,
                        password : pass,
                        name : name
                    },

                    function( error, details ){

                        if( error ){

                            if( details.indexOf( 'ACCOUNT CAN NOT BE AUTOCONFIGURED' ) === -1 ){

                                console.log( error );
                                console.log( details );
                                alert( 'I\'m sorry but an error has occur' );

                            }else{

                                moreData();

                            }

                        }else{

                            whichName();

                        }

                    }

                );

            }else if( !mailExpresion.test( email ) ){
                alert( 'Please introduce your mail correctly' );
            }else if( !pass ){
                alert( 'Please introduce your password' );
            }else if( !name ){
                alert( 'Please introduce your name' );
            }   	

        })

		.on( 'click', '.save', function(){

        	username = $( '.username', content ).find( 'input' ).val();
            inProtocol = $( '.in-protocol', content ).find( 'option:selected' ).val();
            inHost = $( '.in-host', content ).find( 'input' ).val();
            inPort = parseInt( $( '.in-port', content ).find( 'input' ).val(), 10);
            inSecure = $( '.in-secure', content ).find( 'input' ).is( ':checked' );
        	outHost = $( '.out-host', content ).find( 'input' ).val();
        	outPort = parseInt( $( '.out-port', content ).find( 'input' ).val(), 10);
            outSecure = $( '.out-secure', content ).find( 'input' ).is( ':checked' );

            if( username && outHost && !isNaN( outPort ) && outPort > 1 && outPort < 65535 && inHost && !isNaN( inPort ) && inPort > 1 && inPort < 65535 ){

                whichName();

            }else if( !username ){
                alert( 'Please introduce your username' );
            }else if( !outHost ){
                alert( 'Please introduce your SMTP host' );
            }else if( isNaN( outPort ) || outPort < 1 || outPort > 65535 ){
                alert( 'Please introduce a correct SMTP port' );
            }else if( !inHost ){
                alert( 'Please introduce your IMAP host' );
            }else if( isNaN( inPort ) || inPort < 1 || inPort > 65535 ){
                alert( 'Please introduce a correct IMAP port' );
            }        	

        })

        .on( 'click', '.finish', function(){

            description = $( '.account-name', content ).find( 'input' ).val();

            if( username ){

                wz.mail.addAccount( 

                    {
                        address : email,
                        password : pass,
                        name : name,
                        description : description,
                        username : username,
                        inProtocol : inProtocol,
                        inHost : inHost,
                        inPort : inPort,
                        inSecure : inSecure,
                        outHost : outHost,
                        outPort : outPort,
                        outSecure : outSecure
                    },

                    function( error, details ){

                        if( error ){

                            console.log( error );
                            console.log( details );
                            alert( 'I\'m sorry but an error has occur' );

                        }else{
                            
                            finish();

                        }

                    }

                );

            }else{

                wz.mail.getAccounts( function( error, accounts ){

                    if( error ){
                        console.log( error );
                    }else{

                        var account = {};

                        for( var i = 0 ; i < accounts.length ; i++ ){

                            if( accounts[i].address === email ){

                                account = accounts[i];
                                break;

                            }

                        }

                        if( description !== account.description ){

                            account.changeDescription( description, function( error ){

                                if( error ){
                                    console.log( error );
                                }else{
                                    finish();
                                }

                            });

                        }else{

                            finish();

                        }         

                    }

                });

            }

        })

        .key( 'enter', function( e ){

            if( $( e.target ).is( 'input' ) ){
                $( 'button', win ).click();
            }

        });
    
});
