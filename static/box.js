
    var win = $( this );
    var account = params.account;
    var content = $( '.content', win );

    $( '.name', content ).find( 'input' ).focus();

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
    .on( 'click', '.finish', function(){

        var newName = $( '.name', content ).find( 'input' ).val();

        console.log(newName);

        if( account && params.cmd === 'create'){

            account.createBox(newName, function(err, newMailBox){

                if(err){
                    return alert(lang.error);
                }

                console.log(newMailBox);
                finish();
            });
        }
    })

    .key( 'enter', function( e ){

        if( $( e.target ).is( 'input' ) ){
            $( 'button', win ).click();
        }

    });

    $( '.finish', win ).text( lang.finish );

    if( params ){

        win.css( { 'height' : '256' } );
        content.css( { 'height' : '146' } );

        $( '.wz-view-menu span', win ).text( (params.cmd === 'create') ? lang.createBox : lang.renameBox  );
        $( '.description', win ).text( (params.cmd === 'create') ? lang.createBoxDescription : lang.renameBoxDescription);
        $( '.name span', win ).text( lang.boxName + ':' );

        $( '.name', content ).find( 'input' ).focus();

        content.children().not( '.finish , .name, .description' ).remove();
    }
