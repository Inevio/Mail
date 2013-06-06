
wz.app.addScript( 8, 'main', function( win, app, lang, params ){
    
    var attachments      = $( '.content-attachments', win );
    var openedAccount    = $( '.left-column-top span', win );
    var openedMailbox    = $( '.middle-column-top span', win );
    var mailColumn       = $( '.left-column-content-scroll', win );
    var mailAccount      = $( '.account.wz-prototype', mailColumn );
    var addAccount       = $( '.add-account', mailColumn );
    var messagesColumn   = $( '.middle-column-content-scroll', win );
    var messagePrototype = $( '.message.wz-prototype', messagesColumn );

    var contentSubject     = $( '.mail-subject', win );
    var contentColumn      = $( '.right-column-content', win );
    var contentName        = $( '.content-origin-name', contentColumn );
    var contentMail        = $( '.content-origin-mail', contentColumn );
    var contentDate        = $( '.content-origin-date', contentColumn );
    var contentStar        = $( '.message-star', contentColumn );
    var contentMessage     = $( '.content-message', contentColumn );
    var contentMessageText = $( '.content-message-text', contentMessage );
    var contentHr          = $( 'hr', contentColumn );

    var _accountOptionsHeight = function( item ){

        item = $( item );

        var height = 0;

        $( '.mailbox:not(.wz-prototype)', item ).each( function(){
            height += $( this ).outerHeight( true );
        });

        return height;

    };

    var _accountItem = function( element ){

        var item = mailAccount.clone().removeClass( 'wz-prototype' );

        if( element.inProtocol === 'common' ){

            item
                .addClass( 'general' )
                .data( {

                    mail : 'common',
                    id   : 'common'

                } )
                .children( 'span' )
                .text( lang.general );

        }else{

            item
                .data( {

                    mail : element.address,
                    id   : element.id

                } )
                .children( 'span' )
                .text( element.description );

        }

        _accountItemBoxes( element, item );

        return item;

    };

    var _accountItemBoxes = function( element, item ){

        element.getBoxes( false, function( error, boxes ){

            console.log( boxes );

            if( error ){
                console.log( error );
                return false;
            }

            var boxPrototype = item.find( '.mailbox.wz-prototype' );
            var boxesList    = [];
            var tmp          = null;

            if( boxes.inbox ){

                tmp = boxPrototype
                    .clone()
                    .removeClass( 'wz-prototype' )
                    .addClass( 'inbox' )
                    .data( 'path', boxes.inbox[ 0 ].path )
                    .data( 'id', boxes.inbox[ 0 ].id );

                tmp.children( 'span' ).text( lang.inbox );

                boxesList.push( tmp );

            }

            if( boxes.flagged ){

                tmp = boxPrototype
                    .clone()
                    .removeClass( 'wz-prototype' )
                    .addClass( 'starred' )
                    .data( 'path', boxes.flagged[ 0 ].path )
                    .data( 'id', boxes.flagged[ 0 ].id );

                tmp.children( 'span' ).text( lang.starred );

                boxesList.push( tmp );

            }

            if( boxes.sent ){

                tmp = boxPrototype
                    .clone()
                    .removeClass( 'wz-prototype' )
                    .addClass( 'sent' )
                    .data( 'path', boxes.sent[ 0 ].path )
                    .data( 'id', boxes.sent[ 0 ].id );

                tmp.children( 'span' ).text( lang.sent );

                boxesList.push( tmp );

            }

            if( boxes.drafts ){

                tmp = boxPrototype
                    .clone()
                    .removeClass( 'wz-prototype' )
                    .addClass( 'drafts' )
                    .data( 'path', boxes.drafts[ 0 ].path )
                    .data( 'id', boxes.drafts[ 0 ].id );

                tmp.children( 'span' ).text( lang.drafts );

                boxesList.push( tmp );

            }

            if( boxes.junk ){

                tmp = boxPrototype
                    .clone()
                    .removeClass( 'wz-prototype' )
                    .addClass( 'spam' )
                    .data( 'path', boxes.junk[ 0 ].path )
                    .data( 'id', boxes.junk[ 0 ].id );

                tmp.children( 'span' ).text( lang.spam );

                boxesList.push( tmp );

            }

            if( boxes.trash ){

                tmp = boxPrototype
                    .clone()
                    .removeClass( 'wz-prototype' )
                    .addClass( 'trash' )
                    .data( 'path', boxes.trash[ 0 ].path )
                    .data( 'id', boxes.trash[ 0 ].id );

                tmp.children( 'span' ).text( lang.trash );

                boxesList.push( tmp );

            }

            if( boxes.normal ){

                for( var i in boxes.normal ){
                    console.log( boxes.normal[ i ] );
                }

            }

            console.log( boxes.normal );

            item.append( boxesList );

            if( element.inProtocol === 'common' ){

                var common = $( '.account:not( .wz-prototype )', mailColumn ).first();

                if( !common.size() ){
                    return false;
                }

                common
                    .addClass('display')
                    .height( _accountOptionsHeight( common ) + 38 )
                    .find('.inbox')
                        .click();

                openedAccount.text( item.children( 'span' ).text() );

            }

        });

    };

    var _basicStyle = function(){

        var size   = {};
        var result = '<style>';

        // To Do
        
        /*
        size['400'] = 400;
        size['300'] = 200;
        size['500'] = 500;
        size['700'] = 700;

        Object.keys( size ).forEach( function( key ){

            result += '@font-face {' +
                'font-weight: ' +key + ';' +
                'font-style: normal;' +
                "font-family: 'Effra';" +
                "src: url('https://static.weezeel.com/font/effra_" + size[ key ] + ".eot');" +
                "src: url('https://static.weezeel.com/font/effra_" + size[ key ] + ".eot?#iefix') format('embedded-opentype')," +
                "url('https://static.weezeel.com/font/effra_" + size[ key ] + ".woff') format('woff')," +
                "url('https://static.weezeel.com/font/effra_" + size[ key ] + ".ttf') format('truetype')," +
                "url('https://static.weezeel.com/font/effra_" + size[ key ] + ".svg#effra_400regular') format('svg');" +
                '}';

        });*/

        result += '* {' +
            'font-family: "Effra", Helvetica, Arial, sans-serif;' +
            'font-size: 14px;' +
            '}';

        return  result + '</style>';

    };

    var getAccounts = function(){

        mailColumn.children().not( mailAccount ).not( addAccount ).remove();

        wz.mail.getAccounts( function( error, accounts ){

            if( error ){
                console.log( error );
                return false;
            }

            var list = [];

            for( var i = 0, j = accounts.length; i < j; i++ ){
                list.push( _accountItem( accounts[ i ] ) );
            }

            addAccount.before( list );

        });

    };

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

    };

    var showMails = function( id, boxId ){

        wz.mail( id, function( error, account ){

            if( error ){
                console.log( error );
                return false;
            }

            account.getMessagesFromBox( boxId, function( error, list ){

                if( error ){
                    console.log( error );
                    return false;
                }

                // Limpiamos la columna
                messagesColumn.children().not( messagePrototype ).remove();

                var messageSqueleton = null;
                var messageDate      = null;
                var messageList      = [];

                for( var i = 0, j = list.length ; i < j ; i++ ){

                    messageSqueleton = messagePrototype.clone();

                    messageSqueleton
                        .removeClass( 'wz-prototype' )
                        .addClass( 'message-' + list[ i ].id )
                        .data( 'message', list[ i ] );

                    messageSqueleton.find( '.message-origin' ).text( list[ i ].from.name );
                    messageSqueleton.find( '.message-subject' ).text( list[ i ].title );

                    if( !list[ i ].isSeen() ){
                        messageSqueleton.addClass( 'unread' );
                    }

                    if( list[ i ].isFlagged() ){
                        messageSqueleton.find( '.message-star' ).addClass( 'active' );
                    }

                    if( list[ i ].hasAttachments() ){
                        messageSqueleton.find( '.message-clip' ).addClass( 'attached' );
                    }

                    messageDate = toDate( list[ i ].time.getTime() );

                    if( messageDate.sentToday ){
                        messageSqueleton.find( '.message-date' ).text( messageDate.sentHour + ':' + messageDate.sentMinute );
                    }else{
                        messageSqueleton.find( '.message-date' ).text( messageDate.sentDay + '/' + messageDate.sentMonth );
                    }

                    messageList.push( messageSqueleton );

                }

                messagesColumn.append( messageList );

                // Nullify
                messageList = messageSqueleton = messageDate = null;

            });

        });

    };

    var showMessage = function( message ){

        contentSubject.text( message.title );
        contentName.text( message.from.name );
        contentMail.text( message.from.address );

        message.markAsSeen( function( error ){

            if( error ){
                alert( error );
            }

        });

        if( message.isFlagged() ){
            contentStar.addClass( 'active' );
        }else{
            contentStar.removeClass( 'active' );
        }

        attachments.children().not( '.content-attachments-title' ).remove();

        if( message.hasAttachments() ){

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

        var messageDate = toDate( message.time.getTime() );

        if( messageDate.sentToday ){
            contentDate.text( lang.today + ' ' + messageDate.sentHour + ':' + messageDate.sentMinute );
        }else if( messageDate.sentYesterday ){
            contentDate.text( lang.yesterday + ' ' + messageDate.sentHour + ':' + messageDate.sentMinute );
        }else{
            contentDate.text( messageDate.sentDay + '/' + messageDate.sentMonth + ', ' + messageDate.sentHour + ':' + messageDate.sentMinute );
        }

        message.getFullMessage( function( error, fullMessage ){

            if( error ){
                return false;
            }

            contentMessageText.contents().find( 'body' ).html( _basicStyle() + fullMessage.message );

            contentMessageText.contents().on( 'mousewheel', function( event, delta, deltaX, deltaY ){
                contentMessage.scrollTop( contentMessage.scrollTop() + ( deltaY * -20 ) );
                contentMessage.scrollLeft( contentMessage.scrollLeft() + ( deltaX * -20 ) );
            });

            contentMessageText.height( contentMessageText.contents().find( 'html' ).height() );

        });       

    };

    var appendMessage = function( message ){

        console.log( message );

        var messageSqueleton = messagePrototype
                                    .clone()
                                    .removeClass( 'wz-prototype' )
                                    .addClass( 'message-' + message.id )
                                    .data( 'message', message )
                                    .appendTo( messagesColumn );

        console.log( 1 );

        if( !message.isSeen() ){
            messageSqueleton.addClass( 'unread' );
        }

        console.log( 2 );

        messageSqueleton.find( '.message-origin' ).text( message.from.name );

        console.log( 3 );

        if( message.attachments.length ){
            messageSqueleton.find( '.message-clip' ).addClass( 'attached' );
        }

        console.log( 4 );

        var messageDate = toDate( message.time.getTime() );

        console.log( 5 );

        if( messageDate.sentToday ){
            messageSqueleton.find( '.message-date' ).text( messageDate.sentHour + ':' + messageDate.sentMinute );
        }else{
            messageSqueleton.find( '.message-date' ).text( messageDate.sentDay + '/' + messageDate.sentMonth );
        }

        console.log( 6 );

        if( message.isFlagged() ){
            messageSqueleton.find( '.message-star' ).addClass( 'active' );
        }

        console.log( 7 );

        messageSqueleton.find( '.message-subject' ).text( message.title );

        console.log( 8 );

        messagesColumn.find( '.message:last-child' ).remove();

        console.log( 9 );

    };
    
    $( win )
    .on( 'click', '.account', function(){

        var minHeight = 38;
        var height    = minHeight + _accountOptionsHeight( this );

        if( $( this ).hasClass('display') ){

            $( this ).removeClass('display');
            $( this ).transition( { height: minHeight }, 250 );

        }else{

            openedAccount.text( $( this ).children( 'span' ).text() );

            $('.display').transition( { height: minHeight }, 250 ).removeClass('display');

            $( this )
                .addClass('display')
                .transition( { height: height }, 250 );

        }

    })
        
    .on( 'click', '.mailbox', function(e){

        openedMailbox.text( $(this).children( 'span' ).text() );
        showMails( $(this).parent( '.account' ).data( 'id' ), $(this).data( 'id' ) );
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
            $(this).parents( '.message' ).data( 'message' ).unmarkAsFlagged( function( error ){
                if( error ){
                    alert( error );
                }
            });

        }else{

            $(this).addClass('active');
            $(this).parents( '.message' ).data( 'message' ).markAsFlagged( function( error ){
                if( error ){
                    alert( error );
                }
            });

        }

    })
    
    .on( 'click', '.options-reply', function(){
        wz.app.createWindow( 8, contentMail.text(), 'new' );
    })

    .on( 'click', '.new-mail', function(){
        wz.app.createWindow( 8, '', 'new' );
    })

    .on( 'click', '.options-spam', function(){

        $( '.selected', messagesColumn ).data( 'message' ).moveToSpam( function( error ){

            if( error ){
                alert( error );
            }else{
                $(this).remove();
            }

        });

    })

    .on( 'click', '.options-trash', function(){

        $( '.selected', messagesColumn ).data( 'message' ).moveToTrash( function( error ){

            if( error ){
                alert( error );
            }else{
                $(this).remove();
            }

        });

    })

    .on( 'click', '.options-display', function(){
        alert( lang.notWorking );
    })

    .on( 'click', '.options-refresh', function(){
        alert( lang.notWorking );
    })

    .on( 'click', '.options-folder', function(){
        alert( lang.notWorking );
    })

    .on( 'click', '.options-label', function(){
        alert( lang.notWorking );
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

    })

    .on( 'mail-messageMarkedAsSeen', function( e, message ){
        $( '.message-' + message.id, messagesColumn ).removeClass( 'unread' );
    })

    .on( 'mail-messageUnmarkedAsSeen', function( e, message ){
        $( '.message-' + message.id, messagesColumn ).addClass( 'unread' );
    })

    .on( 'mail-messageMarkedAsFlagged', function( e, message ){
        $( '.message-' + message.id + ' .message-star', messagesColumn ).addClass( 'active' );
    })

    .on( 'mail-messageUnmarkedAsFlagged', function( e, message ){
        $( '.message-' + message.id + ' .message-star', messagesColumn ).removeClass( 'active' );
    })

    .on( 'mail-messageRemoved', function( e, message ){
        $( '.message-' + message, messagesColumn ).remove();
    })

    .on( 'mail-messageIn', function( e, accountId, message, boxId ){
        console.log( accountId, message, boxId );
    })

    .on( 'mail-messageOut', function( e, accountId, messageId, boxId ){
        messagesColumn.children( '.message-' + messageId ).remove();
    })

    .on( 'mail-newMessage', function( e, message ){
        console.log( message, arguments );
    })

    .on( 'mail-accountAdded', function( e, mailAccount ){

        getAccounts();

    })

    .on( 'mail-boxAdded', function( e, mailBox, accountId ){
        console.log( mailBox, accountId );
    })

    .on( 'mail-boxRemoved', function( e, boxId, accountId ){
        console.log( boxId, accountId );
    });

    addAccount

        .on( 'click', function(){
            wz.app.createWindow(8, null, 'hosting');
        });

    // Start App
    getAccounts();

    $( '.new-mail span', win ).text( lang.newEmail );
    $( '.add-account span', win ).text( lang.addAccount );
    $( '.content-attachments-title span', win ).not( '.light' ).text( lang.attachments );
    $( '.content-attachments-view', win ).text( lang.view );
    $( '.content-attachments-download', win ).text( lang.download );
    $( '.content-attachments-import', win ).text( lang.import );
    $( '.middle-column-top input', win ).attr( 'placeholder', lang.search );

});
