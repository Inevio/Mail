
    var win           = $( this );
    var mailExpresion = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,4}))$/;

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

    if( params.to ){

        var to = params.to[ 0 ];

        for( var i = 1 ; i < params.to.length ; i++ ){

            to = to + ', ' + params.to[ i ];

        }

        $( '.content-to input', win ).val( to );

        /*
        if( params.cc ){

            $( '.content-left-container', win ).addClass( 'show' );
            win.transition({ height : '+=40' }, 100 );

            var cc = params.cc[ 0 ];

            for( var i = 1 ; i < params.cc.length ; i++ ){

                cc = cc + ', ' + params.cc[ i ];

            }

            $( '.content-cc input', win ).val( cc );

        }
        */

        if( params.subject ){
            $( '.content-subject input', win ).val( params.reply? params.subject : 'Re: ' + params.subject );
        }
        
        //$( '.content-compose', win ).html( params.message );

    }
    
    win

    /*
    .on( 'click', '.content-show', function(){

        if( $( '.content-left-container', win ).hasClass( 'show' ) ){
            $( '.content-left-container', win ).removeClass( 'show' );
            win.transition({ height : '-=40' }, 100 );
        }else{
            $( '.content-left-container', win ).addClass( 'show' );
            win.transition({ height : '+=40' }, 100 );
        }

    })
    */

    .on( 'click', '.content-send figure', function(){
        
        if( $( '.content-to input', win ).val().length && $( '.content-from option:selected', win ).text().length ){

            $( '.content-from option:selected', win ).data( 'account' ).send(

                {

                    to : $( '.content-to input', win ).val(),
                    cc : $( '.content-cc input', win ).val(),
                    bcc : $( '.content-cco input', win ).val(),
                    subject : $( '.content-subject input', win ).val(),
                    content : $( '.content-compose', win ).html()

                },

                function( error ){

                    if( error ){
                        console.log( error );
                        alert( error );
                    }else{

                        wz.banner()
                            .setTitle( lang.mailSent )
                            .setText( lang.beenSent )
                            .setIcon( 'https://static.weezeel.com/app/8/envelope.png' )
                            .render();

                        wz.view.remove();

                    }

                }

            );

        }else if( !$( '.content-to input', win ).val() ){
            alert( lang.introduceTo );
        }else if( !mailExpresion.test( $( '.content-to input', win ).val() ) ){
            alert( lang.introduceToCorrect );
        }else if( !$( '.content-from option:selected', win ).text() ){
            alert( lang.introduceFrom );
        }

    });

    $( '.wz-view-menu span', win ).text( lang.newEmail );
    $( '.content-to span', win ).append( lang.to + ':' );
    $( '.content-subject span', win ).text( lang.subject + ':' );
    $( '.content-from span', win ).text( lang.from + ':' );
    $( '.content-send span', win ).text( lang.send );
