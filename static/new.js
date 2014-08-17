
    var win                 = $( this );
    var content             = $('.content');
    var mailExpresion       = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,4}))$/;
    var attachments         = $('.content-attachments');
    var attachmentPrototype = $('.attachment.wz-prototype');
    var attachmentsList     = [];

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
    .on( 'click', '.content-send figure', function(){
        
        if( $( '.content-to input', win ).val().length && $( '.content-from option:selected', win ).text().length ){

            $( '.content-from option:selected', win ).data( 'account' ).send(

                {

                    to          : $( '.content-to input', win ).val(),
                    cc          : $( '.content-cc input', win ).val(),
                    bcc         : $( '.content-cco input', win ).val(),
                    subject     : $( '.content-subject input', win ).val(),
                    content     : $( '.content-compose', win ).html(),
                    attachments : attachmentsList

                },

                function( error ){

                    if( error ){
                        alert( error );
                        return;
                    }

                    wz.banner()
                        .setTitle( lang.mailSent )
                        .setText( lang.beenSent )
                        .setIcon( 'https://static.inevio.com/app/8/envelope.png' )
                        .render();

                    wz.view.remove();

                }

            );

        }else if( !$( '.content-to input', win ).val() ){
            alert( lang.introduceTo );
        }else if( !mailExpresion.test( $( '.content-to input', win ).val() ) ){
            alert( lang.introduceToCorrect );
        }else if( !$( '.content-from option:selected', win ).text() ){
            alert( lang.introduceFrom );
        }

    })

    .on( 'click', '.show-cc', function(){

        var diff = 0;
        if( $(this).hasClass('active') ){

            diff -= $('.content-cc').css( 'display', 'none' ).outerHeight( true );
            diff -= $('.content-cco').css( 'display', 'none' ).outerHeight( true );

        }else{

            diff += $('.content-cc').css( 'display', 'block' ).outerHeight( true );
            diff += $('.content-cco').css( 'display', 'block' ).outerHeight( true );

        }

        $(this).toggleClass('active');

        $('.content, .content-info').add( win ).height( diff < 0 ? '-=' + Math.abs( diff ) : '+=' + diff );

    })

    .on( 'click', '.content-add-attachments-button', function(){
        
        wz.fs.selectFile( 'root', lang.attachFile, function( error, list ){

            if( error ){
                return;
            }

            var attachmentsHeight = 0;
            var generalHeight     = 0;

            if( attachments.css('display') === 'none' ){

                attachments.show();

                attachmentsHeight += $('.content-attachments-title').outerHeight( true );
                generalHeight     += attachments.outerHeight( true ) + attachmentsHeight;

            }

            list.map( function( item ){

                var attachment = attachmentPrototype.clone().removeClass('wz-prototype');

                attachment.data( 'id', item );
                attachments.append( attachment );

                attachmentsHeight += attachment.outerHeight( true );
                generalHeight     += attachment.outerHeight( true );
                
                attachmentsList.push( item );

                wz.fs( item, function( error, item ){

                    if( error ){
                        // To Do
                        return;
                    }

                    attachment.find('.name').text( item.name );
                    attachment.find('.size').text( '(' + wz.tool.bytesToUnit( item.size ) + ')' );

                });

            });

            win.height( '+=' + generalHeight );
            content.height( '+=' + generalHeight );
            attachments.height( '+=' + attachmentsHeight );

        });

    })

    .on( 'click', '.content-attachments-delete', function(){

        var attachment   = $(this).parent();
        var attachmentId = attachment.data('id');

        attachments.height( '-=' + attachment.outerHeight( true ) );
        content.height( '-=' + attachment.outerHeight( true ) );
        win.height( '-=' + attachment.outerHeight( true ) );

        attachment.remove();

        if( !$('.attachment').not('.wz-prototype').length ){

            win.height( '-=' + attachments.outerHeight( true ) );
            content.height( '-=' + attachments.outerHeight( true ) );
            attachments.height( '-=' + $('.content-attachments-title').outerHeight( true ) );

            attachments.hide();

        }

        attachmentsList[ attachmentsList.indexOf( attachmentId ) ] = null;

        attachmentsList = attachmentsList.filter( function( item ){
            return item;
        });

    });

    $('.wz-view-menu span').text( lang.newEmail );
    $('.content-to span').append( lang.to + ':' );
    $('.content-subject span').text( lang.subject + ':' );
    $('.content-from span').text( lang.from + ':' );
    $('.content-send span').text( lang.send );
    $('.content-attachments-title span').not( '.stats' ).text( lang.attachments );
    $('.content-attachments-delete').text( lang.delete );
    $('.content-add-attachments span').text( lang.attachFile );
