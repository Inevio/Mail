
wz.app.addScript( 8, 'main', function( win, app, lang, params ){
    
    var attachments = $( '.content-attachments', win );
    var openedAccount = $( '.left-column-top span', win );
    var openedMailbox = $( '.middle-column-top span', win );
    var mailColumn = $( '.left-column-content-scroll', win );
    var mailAccount = $( '.account.wz-prototype', mailColumn );
    var addAccount = $( '.add-account', mailColumn );
    var messagesColumn = $( '.middle-column-content-scroll', win );
    var messagePrototype = $( '.message.wz-prototype', messagesColumn );
    var messageSqueleton = $();

    var contentSubject = $( '.mail-subject', win );
    var contentColumn = $( '.right-column-content', win );
    var contentName = $( '.content-origin-name', contentColumn );
    var contentMail = $( '.content-origin-mail', contentColumn );
    var contentDate = $( '.content-origin-date', contentColumn );
    var contentStar = $( '.message-star', contentColumn );
    var contentMessage = $( '.content-message', contentColumn );
    var contentMessageText = $( '.content-message-text', contentMessage );
    var contentHr = $( 'hr', contentColumn );

    wz.mail.getAccounts( function( error, accounts ){

        if( error ){
            console.log( error );
        }else if( accounts.length ){

            mailAccount.clone().removeClass( 'wz-prototype' ).appendTo( mailColumn ).addClass( 'general' ).children( 'span' ).text( lang.general );

            accounts.map( function( element ){ 

                var accountSqueleton = mailAccount.clone();

                accountSqueleton
                    .removeClass( 'wz-prototype' )
                    .appendTo( mailColumn )
                    .data({ 'mail' : element.address , 'id' : element.id })
                    .children( 'span' ).text( element.description );

                element.getBoxes( false, function( error, boxes ){

                    var mailboxSqueleton = accountSqueleton.find( '.mailbox.wz-prototype' );

                    if( error ){
                        console.log( error );
                    }else{

                        if( boxes.inbox ){

                            mailboxSqueleton
                                .clone()
                                .removeClass( 'wz-prototype' )
                                .addClass( 'inbox' )
                                .data( 'path', boxes.inbox[0].path )
                                .appendTo( accountSqueleton )
                                .children( 'span' ).text( lang.inbox );

                        }

                        if( boxes.flagged ){

                            mailboxSqueleton
                                .clone()
                                .removeClass( 'wz-prototype' )
                                .addClass( 'starred' )
                                .data( 'path', boxes.flagged[0].path )  
                                .appendTo( accountSqueleton )
                                .children( 'span' ).text( lang.starred );

                        }

                        if( boxes.sent ){

                            mailboxSqueleton
                                .clone()
                                .removeClass( 'wz-prototype' )
                                .addClass( 'sent' )
                                .data( 'path', boxes.sent[0].path )
                                .appendTo( accountSqueleton )
                                .children( 'span' ).text( lang.sent );

                        }

                        if( boxes.drafts ){

                            mailboxSqueleton
                                .clone()
                                .removeClass( 'wz-prototype' )
                                .addClass( 'drafts' )
                                .data( 'path', boxes.drafts[0].path )
                                .appendTo( accountSqueleton )
                                .children( 'span' ).text( lang.drafts );

                        }

                        if( boxes.junk ){

                            mailboxSqueleton
                                .clone()
                                .removeClass( 'wz-prototype' )
                                .addClass( 'spam' )
                                .data( 'path', boxes.junk[0].path )
                                .appendTo( accountSqueleton )
                                .children( 'span' ).text( lang.spam );

                        }

                        if( boxes.trash ){

                            mailboxSqueleton
                                .clone()
                                .removeClass( 'wz-prototype' )
                                .addClass( 'trash' )
                                .data( 'path', boxes.trash[0].path )
                                .appendTo( accountSqueleton )
                                .children( 'span' ).text( lang.trash );

                        }

                    }

                });

            })

            addAccount.appendTo( mailColumn );

        }

    });

    var toDate = function( date ){

        var sentToday = false;
        var sentYesterday = false;

        var todayDate = new Date();
        var todayDateInfo = todayDate.getDate() + '' + todayDate.getMonth() + '' + todayDate.getFullYear();

        var yesterdayDate = new Date( todayDate.getTime() - 86400000 );
        var yesterdayDateInfo = yesterdayDate.getDate() + '' + yesterdayDate.getMonth() + '' + yesterdayDate.getFullYear();

        var sentDate = new Date( date );

        if( todayDateInfo === ( sentDate.getDate() + '' + sentDate.getMonth() + '' + sentDate.getFullYear() ) ){
            sentToday = true;
        }else if( yesterdayDateInfo === ( sentDate.getDate() + '' + sentDate.getMonth() + '' + sentDate.getFullYear() ) ){
            sentYesterday = true;
        }
 
        var sentDay = sentDate.getDate();
            if( sentDay < 10 ){ sentDay = '0' + sentDay }
        var sentMonth = sentDate.getMonth() + 1;
            if( sentMonth < 10 ){ sentMonth = '0' + sentMonth }
        var sentYear = sentDate.getFullYear();
        
        var sentHour = sentDate.getHours();
            if( sentHour < 10 ){ sentHour = '0' + sentHour }
        var sentMinute = sentDate.getMinutes();
            if( sentMinute < 10 ){ sentMinute = '0' + sentMinute }
        var sentSecond = sentDate.getSeconds();
            if( sentSecond < 10 ){ sentSecond = '0' + sentSecond }

        return({ 

            'sentToday' : sentToday,
            'sentYesterday' : sentYesterday, 
            'sentHour' : sentHour, 
            'sentMinute' : sentMinute, 
            'sentSecond' : sentSecond, 
            'sentDay' : sentDay, 
            'sentMonth' : sentMonth, 
            'sentYear' : sentYear

        });

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

                        messagesColumn.children().not( '.wz-prototype' ).remove();

                        for( var i = 0 ; i < list.length ; i++ ){

                            messageSqueleton = messagePrototype
                                                        .clone()
                                                        .removeClass( 'wz-prototype' )
                                                        .data( 'message', list[i] )
                                                        .appendTo( messagesColumn );

                            if( !list[i].isSeen() ){
                                messageSqueleton.addClass( 'unread' );
                            }

                            messageSqueleton.find( '.message-origin' ).text( list[i].from.name );

                            if( list[i].attachments.length ){
                                messageSqueleton.find( '.message-clip' ).addClass( 'attached' );
                            }

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

    var showMessage = function( message ){

        contentSubject.text( message.title );
        contentName.text( message.from.name );
        contentMail.text( message.from.address );

        if( message.isFlagged() ){
            contentStar.addClass( 'active' );
        }else{
            contentStar.removeClass( 'active' );
        }

        attachments.children().not( '.content-attachments-title' ).remove();

        if( message.attachments.length ){

            contentColumn.addClass( 'attachments' );

            if( attachments.children().size() < 3 ){

                attachments.height( 66 );
                contentMessage.height( 244 );

            }else if( attachments.children().size() === 3 ){

                attachments.height( 88 );
                contentMessage.height( 222 );

            }else{

                attachments.height( 118 );
                contentMessage.height( 192 );

            }

        }else{

            contentColumn.removeClass( 'attachments' );   
            contentMessage.height( 315 );
            contentHr.css( 'margin-bottom', 15 );

        }

        var messageDate = toDate( message.date.getTime() );

        if( messageDate.sentToday ){
            contentDate.text( lang.today + ' ' + messageDate.sentHour + ':' + messageDate.sentMinute );
        }else if( messageDate.sentYesterday ){
            contentDate.text( lang.yesterday + ' ' + messageDate.sentHour + ':' + messageDate.sentMinute );
        }else{
            contentDate.text( messageDate.sentDay + '/' + messageDate.sentMonth + ', ' + messageDate.sentHour + ':' + messageDate.sentMinute );
        }

        message.getFullMessage( function( error, fullMessage ){

            contentMessageText.contents().find( 'body' ).html( fullMessage.message );

            contentMessageText.contents().on( 'mousewheel', function( event, delta, deltaX, deltaY ){
                contentMessage.scrollTop( contentMessage.scrollTop() + ( deltaY * -20 ) );
                contentMessage.scrollLeft( contentMessage.scrollLeft() + ( deltaX * -20 ) );
            });

            contentMessageText.height( contentMessageText.contents().find( 'html' ).height() );

        });       

    }
    
    $(win)
    
        .on( 'click', '.account', function(){

            if( $(this).hasClass('display') ){

                $(this).removeClass('display');
                $(this).transition({ height: 38 }, 250);

            }else{

                openedAccount.text( $(this).children( 'span' ).text() );
                $('.display').transition({ height: 38 }, 250).removeClass('display');
                $(this).addClass('display');
                $(this).transition({ height: 250 }, 250);

            }

        })
        
        .on( 'click', '.mailbox', function(e){

            openedMailbox.text( $(this).children( 'span' ).text() );
            showMails( $(this).parent( '.account' ).data( 'id' ), $(this).data( 'path' ) );
            e.stopPropagation();

        })
        
        .on( 'click', '.message', function(){

            if( !$(this).hasClass('selected') ){

                showMessage( $(this).data( 'message' ) );

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

                    .add( lang.renameAccount, function(){
                        wz.app.createWindow( 8, mailData, 'account' );
                    })

                    .add( lang.changeConfig, function(){
                        
                    })

                    .add( lang.deleteAccount, function() {

                        wz.mail.removeAccount( idData, function( error ){

                            if( error ){
                                console.log( error );
                            }else{

                                wz.banner()
                                    .title( lang.accountDeleted )
                                    .text( mailData + ' ' + lang.deleteSuccesfull )
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
            wz.app.createWindow(8, null, 'hosting');
        });

    $( '.new-mail span', win ).text( lang.newEmail );
    $( '.add-account span', win ).text( lang.addAccount );
    $( '.content-attachments-title span', win ).not( '.light' ).text( lang.attachments );
    $( '.content-attachments-view', win ).text( lang.view );
    $( '.content-attachments-download', win ).text( lang.download );
    $( '.content-attachments-import', win ).text( lang.import );
    $( '.middle-column-top input', win ).attr( 'placeholder', lang.search );

});
