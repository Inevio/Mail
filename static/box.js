
    var win = $( this );
    var account = params.account;
    var content = $( '.content', win );

    $( '.name', content ).find( 'input' ).focus();

    var create = function(){

        if(!params){

            win.transition( { 'height' : '256' }, 250);
            content.transition( { 'height' : '146' }, 250);

        }

        $( '.wz-view-menu span', win ).text( lang.createBox );
        $( '.description', win ).text( lang.createBoxDescription );
        $( '.name span', win ).text( lang.boxName + ':' );

        $( '.name', content ).find( 'input' ).focus();

        content.children().not( '.finish , .name, .description' ).remove();

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

        console.log(params.account);

        if( params.cmd === 'create' ){
            create();
        }else{
            moreData();
        }
        
    }
