
wz.app.addScript( 8, 'new', function( win, app, lang, params ){

    var mailExpresion = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    wz.mail.getAccounts( function( error, accounts ){

        var optionProto = $( '.content-from option.wz-prototype', win );

        for( var i = 0, j = accounts.length; i < j; i++ ){

            if( accounts[ i ].inProtocol !== 'common' ){

                optionProto
                    .clone()
                    .removeClass( 'wz-prototype' )
                    .text( accounts[ i ].address )
                    .data( 'account', accounts[ i ] )
                    .appendTo( $( '.content-from select', win ) );

            }

        }

        optionProto.remove();

    });
    
    win
    
        .on( 'click', '.content-send', function(){
            
            if( mailExpresion.test( $( '.content-to input', win ).val() ) && $( '.content-from option:selected', win ).text() ){

                $( '.content-from option:selected', win ).data( 'account' ).send( 

                    {

                        to : $( '.content-to input', win ).val(),
                        subject : $( '.content-subject input', win ).val(),
                        content : $( '.content-compose', win ).text()

                    },

                    function( error ){

                        if( error ){
                            alert( error );
                        }else{

                            wz.banner()
                                .title( lang.mailSent )
                                .text( lang.beenSent )
                                .image( 'https://static.weezeel.com/app/8/envelope.png' )
                                .render();

                            wz.app.closeWindow( win );

                        }

                    }

                 )

            }else if( !$( '.content-to input', win ).val() ){
                alert( lang.introduceTo );
            }else if( !mailExpresion.test( $( '.content-to input', win ).val() ) ){
                alert( lang.introduceToCorrect );
            }else if( !$( '.content-from option:selected', win ).text() ){
                alert( lang.introduceFrom );
            }

        });

    $( '.wz-win-menu span', win ).text( lang.newEmail );
    $( '.content-to span', win ).text( lang.to + ':' );
    $( '.content-to input', win ).val( params );
    $( '.content-subject span', win ).text( lang.subject + ':' );
    $( '.content-from span', win ).text( lang.from + ':' );
    $( '.content-send span', win ).text( lang.send );
    
});
