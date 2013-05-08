
wz.app.addScript( 8, 'main', function( win, app, lang, params ){
    
    var attachments = $( '.content-attachments', win );
    var mailColumn = $( '.left-column-content-scroll', win );
    var mailAccount = $( '.account.prototype', mailColumn );
    var addAccount = $( '.add-account', mailColumn );
    var messagesColumn = $( '.middle-column-content-scroll', win );
    var accountSqueleton = $();
    var mailboxSqueleton = $();
    var messageSqueleton = $();

    wz.mail.getAccounts( function( error, accounts ){

        if( error ){
            console.log( error );
        }else if( accounts.length ){

            mailAccount.clone().removeClass( 'prototype' ).appendTo( mailColumn ).addClass( 'general' ).children( 'span' ).text( 'General' );

            for( var i = 0 ; i < accounts.length ; i++ ){

                accountSqueleton = mailAccount.clone();

                accountSqueleton
                    .removeClass( 'prototype' )
                    .appendTo( mailColumn )
                    .data({ 'mail' : accounts[i].address , 'id' : accounts[i].id })
                    .children( 'span' ).text( accounts[i].description );

                accounts[i].getBoxes( false, function( error, boxes ){

                    mailboxSqueleton = accountSqueleton.find( '.mailbox.prototype' );

                    if( error ){
                        console.log( error );
                    }else{

                        if( boxes.inbox ){

                            mailboxSqueleton
                                .clone()
                                .removeClass( 'prototype' )
                                .addClass( 'inbox' )
                                .data( 'path', boxes.inbox[0].path )
                                .appendTo( accountSqueleton )
                                .children( 'span' ).text( 'Inbox' );

                        }

                        if( boxes.flagged ){

                            mailboxSqueleton
                                .clone()
                                .removeClass( 'prototype' )
                                .addClass( 'starred' )
                                .data( 'path', boxes.flagged[0].path )  
                                .appendTo( accountSqueleton )
                                .children( 'span' ).text( 'Starred' );

                        }

                        if( boxes.sent ){

                            mailboxSqueleton
                                .clone()
                                .removeClass( 'prototype' )
                                .addClass( 'sent' )
                                .data( 'path', boxes.sent[0].path )
                                .appendTo( accountSqueleton )
                                .children( 'span' ).text( 'Sent' );

                        }

                        if( boxes.drafts ){

                            mailboxSqueleton
                                .clone()
                                .removeClass( 'prototype' )
                                .addClass( 'drafts' )
                                .data( 'path', boxes.drafts[0].path )
                                .appendTo( accountSqueleton )
                                .children( 'span' ).text( 'Drafts' );

                        }

                        if( boxes.junk ){

                            mailboxSqueleton
                                .clone()
                                .removeClass( 'prototype' )
                                .addClass( 'spam' )
                                .data( 'path', boxes.junk[0].path )
                                .appendTo( accountSqueleton )
                                .children( 'span' ).text( 'Spam' );

                        }

                        if( boxes.trash ){

                            mailboxSqueleton
                                .clone()
                                .removeClass( 'prototype' )
                                .addClass( 'trash' )
                                .data( 'path', boxes.trash[0].path )
                                .appendTo( accountSqueleton )
                                .children( 'span' ).text( 'Trash' );

                        }

                    }

                });

            }

            addAccount.appendTo( mailColumn );

        }else{
            addAccount.find( 'span' ).text( 'Add an account' );
        }

    });

    var toDate = function( date ){

        var sentToday = false;
        var userDate = new Date();
        var userDateInfo = userDate.getDate() + '' + userDate.getMonth() + '' + userDate.getFullYear();

        var sentDate = new Date( date );
        if( userDateInfo !== ( sentDate.getDate() + '' + sentDate.getMonth() + '' + sentDate.getFullYear() ) ){
            
            var sentDay = sentDate.getDate();
                if( sentDay < 10 ){ sentDay = '0' + sentDay }
            var sentMonth = sentDate.getMonth() + 1;
                if( sentMonth < 10 ){ sentMonth = '0' + sentMonth }
            var sentYear = sentDate.getFullYear();
                
        }else{
            
            sentToday = true;
            
            var sentHour = sentDate.getHours();
                if( sentHour < 10 ){ sentHour = '0' + sentHour }
            var sentMinute = sentDate.getMinutes();
                if( sentMinute < 10 ){ sentMinute = '0' + sentMinute }
            var sentSecond = sentDate.getSeconds();
                if( sentSecond < 10 ){ sentSecond = '0' + sentSecond }
                
        }

        if( sentToday ){
            return({ 'sentToday' : sentToday, 'sentHour' : sentHour, 'sentMinute' : sentMinute, 'sentSecond' : sentSecond });
        }else{
            return({ 'sentToday' : sentToday, 'sentDay' : sentDay, 'sentMonth' : sentMonth, 'sentYear' : sentYear });
        }

    }

    var showMails = function( id, path ){

        wz.mail( id, function( error, account ){

            if( error ){
                console.log( error );
            }else{

                account.getMessagesFromBox( path, function( error, list ){

                    if( error ){
                        console.log( error );
                    }else{

                        messagesColumn.children().not( '.prototype' ).remove();

                        messageSqueleton = $( '.message.prototype', messagesColumn );

                        for( var i = 0 ; i < list.length ; i++ ){

                            messageSqueleton
                                .clone()
                                .removeClass( 'prototype' )
                                .data( 'message', list[i] )
                                .appendTo( messagesColumn );

                            console.log( list[i] );
                            messageSqueleton.find( '.message-origin' ).text( list[i].from.name );

                            var messageDate = toDate( list[i].date.getTime() );

                            if( messageDate.sentToday ){
                                messageSqueleton.find( '.message-date' ).text( messageDate.sentHour + ':' + messageDate.sentMinute );
                            }else{
                                messageSqueleton.find( '.message-date' ).text( messageDate.sentDay + '/' + messageDate.sentMonth );
                            }

                            messageSqueleton.find( '.message-subject' ).text( list[i].title );

                        }

                    }

                });

            }

        })

    }
    
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
        
        .on( 'click', '.mailbox', function(e){

            showMails( $(this).parent( '.account' ).data( 'id' ), $(this).data( 'path' ) );
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
