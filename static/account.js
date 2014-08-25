
    var win = $( this );
    var account = null;
    var content = $( '.content', win );
    var email = '';
    var pass = '';
    var name = '';
    var description = '';
    var username = '';
    var inHost = '';
    var inPort = 0;
    var inProtocol = '';
    var inSecure = false;
    var outHost = '';
    var outPort = 0;
    var outSecure = false;
    var mailExpresion = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,4}))$/;

    $( '.name', content ).find( 'input' ).val( wz.system.user().fullName );
    $( '.mail', content ).find( 'input' ).focus();

    var whichName = function(){

        if( params ){

            $( '.wz-view-menu span', win ).text( lang.renameAccount );

            win.css( { 'height' : '256' } );
            content.css( { 'height' : '146' } );

        }else{

            win.transition( { 'height' : '256' }, 250);
            content.transition( { 'height' : '146' }, 250);

        }

        $( '.description', content ).text( lang.whichName );

        $( '.name', content ).removeClass( 'name' ).addClass( 'account-name' ).find( 'span' ).text( lang.accountName + ':' );
        $( '.username', content ).removeClass( 'username' ).addClass( 'account-name' ).find( 'span' ).text( lang.accountName + ':' );

        $( '.account-name', content ).find( 'input' ).val( params ? params.account.description : '' ).focus();

        $( '.next', content ).appendTo( content ).removeClass( 'next' ).addClass( 'finish' ).text( lang.finish );
        $( '.save', content ).appendTo( content ).removeClass( 'save' ).addClass( 'finish' ).text( lang.finish );

        content.children().not( '.finish , .account-name, .description' ).remove();

    };

    var moreData = function(){

        if( params ){

            $( '.wz-view-menu span', win ).text( lang.changeConfig );

            win.css( { 'height' : '455' } );
            content.css( { 'height' : '392' } );

        }else{

            win.transition( { 'height' : '455' }, 250);
            content.transition( { 'height' : '392' }, 250);

        }

        $( '.description', content ).text( lang.accountData );
        $( '.name', content ).removeClass( 'name' ).addClass( 'username' ).find( 'span' ).text( lang.username + ':' );
        $( '.mail', content ).remove();
        $( '.pass', content ).remove();

        var object = $( '.username', content );

        object.find( 'input' ).val( '' );
        object.find( 'input' ).focus();
        //$( '.wz-prototype.select', content ).clone().appendTo( content ).removeClass( 'wz-prototype' ).addClass( 'in-protocol' ).find( 'span' ).text( lang.inProtocol + ':' );
        object.clone().appendTo( content ).removeClass( 'username' ).addClass( 'in-host' ).find( 'span' ).text( lang.inHost + ':' );
        object.clone().appendTo( content ).removeClass( 'username' ).addClass( 'in-port' ).find( 'span' ).text( lang.inPort + ':' );
        $( '.wz-prototype.checkbox', content ).clone().appendTo( content ).removeClass( 'wz-prototype' ).addClass( 'in-secure' ).find( 'span' ).text( lang.inSecure + ':' );
        object.clone().appendTo( content ).removeClass( 'username' ).addClass( 'out-host' ).find( 'span' ).text( lang.outHost + ':' );
        object.clone().appendTo( content ).removeClass( 'username' ).addClass( 'out-port' ).find( 'span' ).text( lang.outPort + ':' );
        $( '.wz-prototype.checkbox', content ).clone().appendTo( content ).removeClass( 'wz-prototype' ).addClass( 'out-secure' ).find( 'span' ).text( lang.outSecure + ':' );

        $( '.next', content ).appendTo( content ).removeClass( 'next' ).addClass( 'save' ).text( lang.save );

        if( params ){

            $('.username input').val( params.account.username );
            $('.in-host input').val( params.account.inHost );
            $('.in-port input').val( params.account.inPort );
            $('.in-secure input').attr( 'checked', !!params.account.inSecure );
            $('.out-host input').val( params.account.outHost );
            $('.out-port input').val( params.account.outPort );
            $('.out-secure input').attr( 'checked', !!params.account.outSecure );

        }

    };

    var finish = function(){

        if( params ){

            wz.view.remove();
            wz.banner()
                .setTitle( lang.nameChanged )
                .setText( email + ' ' + lang.nowCalled + ' ' + description )
                .setIcon( 'https://static.inevio.com/app/8/envelope.png' )
                .render();

        }else{

            wz.view.remove();
            wz.banner()
                .setTitle( lang.accountAdded )
                .setText( email + ' ' + lang.beenAdded )
                .setIcon( 'https://static.inevio.com/app/8/envelope.png' )
                .render();

        }

    };

    win
    .on( 'click', '.next', function(){

        email = $( '.mail', content ).find( 'input' ).val();
        pass  = $( '.pass', content ).find( 'input' ).val();
        name  = $( '.name', content ).find( 'input' ).val();

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

                            alert( lang.error );

                        }else{

                            moreData();

                        }

                    }else{

                        account = details;

                        whichName();

                    }

                }

            );

        }else if( !mailExpresion.test( email ) ){
            alert( lang.mailError );
        }else if( !pass ){
            alert( lang.passwordError );
        }else if( !name ){
            alert( lang.nameError );
        }

    })

    .on( 'click', '.save', function(){

        username   = $( '.username', content ).find( 'input' ).val();
        inHost     = $( '.in-host', content ).find( 'input' ).val();
        inPort     = parseInt( $( '.in-port', content ).find( 'input' ).val(), 10 );
        inProtocol = $( '.in-protocol', content ).find( 'option:selected' ).val();
        inSecure   = $( '.in-secure', content ).find( 'input' ).is( ':checked' );
        outHost    = $( '.out-host', content ).find( 'input' ).val();
        outPort    = parseInt( $( '.out-port', content ).find( 'input' ).val(), 10 );
        outSecure  = $( '.out-secure', content ).find( 'input' ).is( ':checked' );

        if( username && outHost && !isNaN( outPort ) && outPort > 1 && outPort < 65535 && inHost && !isNaN( inPort ) && inPort > 1 && inPort < 65535 ){

            whichName();

        }else if( !username ){
            alert( lang.usernameError );
        }else if( !outHost ){
            alert( lang.outHostError );
        }else if( isNaN( outPort ) || outPort < 1 || outPort > 65535 ){
            alert( lang.outPortError );
        }else if( !inHost ){
            alert( lang.inHostError );
        }else if( isNaN( inPort ) || inPort < 1 || inPort > 65535 ){
            alert( lang.inPortError );
        }

    })

    .on( 'click', '.finish', function(){

        description = $( '.account-name', content ).find( 'input' ).val();

        if( !params && !account ){

            wz.mail.addAccount(

                {
                    
                    address     : email,
                    description : description,
                    inHost      : inHost,
                    inPort      : inPort,
                    inProtocol  : inProtocol,
                    inSecure    : inSecure,
                    outHost     : outHost,
                    outPort     : outPort,
                    outSecure   : outSecure,
                    name        : name,
                    password    : pass,
                    username    : username

                },

                function( error, details ){

                    if( error ){
                        alert( lang.error );
                    }else{
                        finish();
                    }

                }

            );

        }else if( !params ){

            account.changeDescription( description, function( error ){

                if( error ){
                    alert( error );
                }else{
                    finish();
                }

            });

        }else{

            if( description !== params.account.description ){

                params.account.changeDescription( description, function( error ){

                    if( error ){
                        alert( error );
                    }else{
                        finish();
                    }

                });

            }else{

                finish();

            }

        }

    })

    .key( 'enter', function( e ){

        if( $( e.target ).is( 'input' ) ){
            $( 'button', win ).click();
        }

    });

    $( '.wz-view-menu span', win ).text( lang.addAccount );
    $( '.description', win ).text( lang.accountAddress );
    $( '.name span', win ).text( lang.name + ':' );
    $( '.mail span', win ).text( lang.address + ':' );
    $( '.pass span', win ).text( lang.password + ':' );
    $( '.next', win ).text( lang.next );

    if( params ){

        if( params.cmd === 'rename' ){
            whichName();
        }else{
            moreData();
        }
        
    }
