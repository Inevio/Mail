
wz.app.addScript( 8, 'main', function( win, app, lang, params ){
    
    var attachments = $( '.content-attachments', win );
    var mailColumn = $( '.left-column-content-scroll', win );
    var mailAccount = $( '.account.prototype', mailColumn );
    var addAccount = $( '.add-account', mailColumn );

    wz.mail.getAccounts( function( error, accounts ){

        if( accounts.length ){

            mailAccount.clone().removeClass( 'prototype' ).appendTo( mailColumn ).children( 'span' ).text( 'General' );

            for( var i = 0 ; i < accounts.length ; i++ ){
                mailAccount.clone().removeClass( 'prototype' ).appendTo( mailColumn ).children( 'span' ).text( accounts[i].username );
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
            wz.app.createWindow(8, null, 'new');
        })

        .on( 'contextmenu', '.account', function(){

            wz.menu()

                .add( 'Renombrar cuenta', function(){

                })

                .add( 'Cambiar configuración', function(){

                })

                .add( 'Eliminar cuenta', function() {

                }, 'warning')

                .render();

        });

    addAccount

        .on( 'click', function(){
            wz.app.createWindow(8, null, 'account');
        });
    
    if( attachments.children().size() < 3 ){
        attachments.height( 60 );
        $('.content-message').height( 244 );
    }else if( attachments.children().size() === 3 ){
        attachments.height( 85 );
        $('.content-message').height( 222 );
    }else{
        attachments.height( 110 );
        $('.content-message').height( 192 );
    }

});
