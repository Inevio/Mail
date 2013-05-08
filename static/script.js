
wz.app.addScript( 8, 'main', function( win, app, lang, params ){
    
    var attachments = $( '.content-attachments', win );
    var mailColumn = $( '.left-column-content-scroll', win );
    var mailAccount = $( '.account.prototype', mailColumn );
    var addAccount = $( '.add-account', mailColumn );

    wz.mail.getAccounts( function( error, accounts ){

        if( accounts.length ){

            mailAccount.clone().removeClass( 'prototype' ).appendTo( mailColumn ).addClass( 'general' ).children( 'span' ).text( 'General' );

            for( var i = 0 ; i < accounts.length ; i++ ){
                mailAccount.clone().removeClass( 'prototype' ).appendTo( mailColumn ).data({ 'mail' : accounts[i].address , 'id' : accounts[i].id }).children( 'span' ).text( accounts[i].description );
            }

            addAccount.appendTo( mailColumn );

        }else{
            addAccount.find( 'span' ).text( 'Add an account' );
        }

    });
    
    $(win)
    
        .on( 'click', '.account', function(){
            if( $(this).hasClass('display') ){
                $(this).removeClass('display');
                $(this).transition({ height: 38 }, 250);
            }else{
                $('.display').transition({ height: 38 }, 250).removeClass('display');
                $(this).addClass('display');
                $(this).transition({ height: 250 }, 250);
            }
        })
        
        .on( 'click', '.account article', function(e){
            e.stopPropagation();
        })
        
        .on( 'click', '.message', function(){
            if( !$(this).hasClass('selected') ){
                $('.selected').removeClass('selected');
                $(this).addClass('selected');
            }       
        })
        
        .on( 'click', 'input', function(e){
            e.stopPropagation();
        })
        
        .on( 'click', '.message-star', function(e){
            e.stopPropagation();
            if( $(this).hasClass('active') ){
                $(this).removeClass('active');
            }else{
                $(this).addClass('active');
            }
        })
        
        .on( 'click', '.options-reply, .new-mail', function(){
            wz.app.createWindow( 8, $( 'content-origin-mail' ).text(), 'new' );
        })

        .on( 'contextmenu', '.account', function(){

            var mailData = $( this ).data( 'mail' );
            var idData = $( this ).data( 'id' );

            if( !$( this ).hasClass( 'general' ) ){

                wz.menu()

                    .add( 'Renombrar cuenta', function(){
                        wz.app.createWindow( 8, mailData, 'account' );
                    })

                    .add( 'Cambiar configuración', function(){
                        
                    })

                    .add( 'Eliminar cuenta', function() {

                        wz.mail.removeAccount( idData, function( error ){

                            if( error ){
                                console.log( error );
                            }else{

                                wz.banner()
                                    .title( 'Mail account deleted' )
                                    .text( mailData + ' ' + 'has been successfully deleted' )
                                    .image( 'https://static.weezeel.com/app/8/envelope.png' )
                                    .render();

                            }

                        });

                    }, 'warning')

                    .render();

            }                

        })

        .on( 'contextmenu', '.account article', function( e ){

            e.stopPropagation();
            return false;

        });

    addAccount

        .on( 'click', function(){
            wz.app.createWindow(8, null, 'account');
        });
    
    if( attachments.children().size() < 3 ){
        attachments.height( 66 );
        $('.content-message').height( 244 );
    }else if( attachments.children().size() === 3 ){
        attachments.height( 88 );
        $('.content-message').height( 222 );
    }else{
        attachments.height( 118 );
        $('.content-message').height( 192 );
    }

});
