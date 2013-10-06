    
    var attachments      = $( '.content-attachments', win );
    var openedAccount    = $( '.left-column-top span', win );
    var openedMailbox    = $( '.middle-column-top span', win );
    var mailZone         = $( '.left-column-content', win );
    var mailColumn       = $( '.left-column-content-scroll', mailZone );
    var mailAccount      = $( '.account.wz-prototype', mailColumn );
    var addAccount       = $( '.add-account', mailColumn );
    var messagesZone     = $( '.middle-column-content', win );
    var messagesColumn   = $( '.middle-column-content-scroll', messagesZone );
    var messagePrototype = $( '.message.wz-prototype', messagesColumn );

    var contentSubject     = $( '.mail-subject', win );
    var contentColumn      = $( '.right-column-content', win );
    var contentReplyMode   = $( '.right-column-content-reply-mode', contentColumn );
    var contentReceivers   = $( '.right-column-content-receivers', contentColumn );
    var contentName        = $( '.content-origin-name', contentColumn );
    var contentMail        = $( '.content-origin-mail', contentColumn );
    var contentDisplay     = $( '.content-origin-display', contentColumn );
    var contentDate        = $( '.content-origin-date', contentColumn );
    var contentStar        = $( '.message-star', contentColumn );
    var contentMessage     = $( '.content-message', contentColumn );
    var contentMessageText = $( '.content-message-text', contentMessage );
    //var contentHr          = $( 'hr', contentColumn );

    var myAccount = null;

    var _accountOpened      = 0;
    var _folderOpened       = 0;
    var _folderTypeOpened   = 'normal';
    var _pageOpened         = 0;
    var _lastMailFolderType = 'normal';

    //var _loadingMore   = false;

    var _accountOptionsHeight = function( item ){

        item = $( item );

        var height = 0;

        $( '.mailbox', item ).add( item.children('span') ).not('.wz-prototype').each( function(){
            height += $( this ).outerHeight( true );
        });

        return height;

    };

    var _accountItem = function( element ){

        var item = mailAccount.clone().removeClass( 'wz-prototype' );

        if( element.inProtocol === 'common' ){
            
            item
                .addClass( 'general account-common' )
                .data( {

                    mail : 'common',
                    id   : 'common'

                } )
                .children( 'span' )
                .text( lang.general );

            wz.mail( 'common', function( error, account ){

                if( error ){
                    alert( error );
                    return false;
                }

                if( account.unread ){
                    item.children( '.bullet' ).text( account.unread );
                }

            });

        }else{

            item
                .addClass( 'account-' + element.id )
                .data( {

                    mail : element.address,
                    id   : element.id

                } )
                .children( 'span' )
                .text( element.description );

            if( element.unread ){
                item.children( '.bullet' ).text( element.unread );
            }
            
        }

        item.find('.syncing span').text( lang.syncing );

        _accountItemBoxes( element, item );

        return item;

    };

    var _accountItemBoxes = function( element, item ){

        element.getBoxes( false, function( error, boxes ){

            if( error ){
                alert( error );
                return false;
            }

            var boxPrototype = item.find( '.mailbox.wz-prototype' );

            for( var i in boxes ){

                if( i !== 'normal' && i !== 'allMail' ){
                    insertBox( _boxItem( boxes[ i ][ 0 ], boxPrototype ), item );
                }

            }

            win.trigger( 'boxes-shown', [ element.id ] );

        });

    };

    var _basicStyle = function(){

        var result = '<style>';

        result += '* {' +
            'font-family: "Effra", Helvetica, Arial, sans-serif;' +
            'font-size: 14px;' +
            '}';

        return result + '</style>';

    };

    var _boxItem = function( object, prototype ){

        var text    = object.name;
        var classes = 'normal';
        var status  = 10;

        switch( object.type ){

            case 'normal' :
                break;
            case 'inbox':

                text    = lang.inbox;
                classes = 'inbox';
                status  = 0;

                break;

            case 'flagged' :
                
                text    = lang.starred;
                classes = 'starred';
                status  = 1;

                break;

            case 'sent' :
                
                text    = lang.sent;
                classes = 'sent';
                status  = 2;

                break;

            case 'drafts' :
                
                text    = lang.drafts;
                classes = 'drafts';
                status  = 3;

                break;

            case 'junk' :
                
                text    = lang.spam;
                classes = 'spam';
                status  = 4;

                break;

            case 'trash' :
                
                text    = lang.trash;
                classes = 'trash';
                status  = 5;

                break;

            default :
                break;

        }

        var tmp = prototype
                    .clone()
                    .removeClass( 'wz-prototype' )
                    .addClass( classes )
                    .addClass( 'box-' + object.id )
                    .addClass( 'account-' + object.accountId + '-box-' + object.id )
                    .data( 'type', classes )
                    .data( 'path', object.path )
                    .data( 'id', object.id )
                    .data( 'order', status );

        tmp.children( 'span' ).text( text );

        if( object.unread ){
            tmp.children( '.bullet' ).text( object.unread );
        }
        
        return tmp;

    };

    var _messageItem = function( item ){

        var messageSqueleton = messagePrototype.clone();

        messageSqueleton
            .removeClass( 'wz-prototype' )
            .addClass( 'message-' + item.id )
            .addClass( 'account-' + item.accountId + '-message' )
            .addClass( 'account-' + item.accountId + '-message-' + item.id )
            .data( 'message', item )
            .data( 'message-time', item.time );

        messageSqueleton.find( '.message-origin' ).text( item.from.name );
        messageSqueleton.find( '.message-subject' ).text( item.title );

        if( !item.isSeen() ){
            messageSqueleton.addClass( 'unread' );
        }

        if( item.isFlagged() ){
            messageSqueleton.find( '.message-star' ).addClass( 'active' );
        }

        if( item.hasAttachments() ){
            messageSqueleton.find( '.message-clip' ).addClass( 'attached' );
        }

        messageDate = toDate( item.time.getTime() );

        if( messageDate.sentToday ){
            messageSqueleton.find( '.message-date' ).text( messageDate.sentHour + ':' + messageDate.sentMinute );
        }else{
            messageSqueleton.find( '.message-date' ).text( messageDate.sentDay + '/' + messageDate.sentMonth );
        }

        return messageSqueleton;

    };

    var getAccounts = function(){

        mailColumn.children().not( mailAccount ).not( addAccount ).remove();

        wz.mail.getAccounts( function( error, accounts ){

            if( error ){
                alert( error );
                return false;
            }

            var list = [];

            for( var i = 0, j = accounts.length; i < j; i++ ){
                list.push( _accountItem( accounts[ i ] ) );
            }

            addAccount.before( list );

            if( accounts.length ){
                mailZone.addClass( 'account-shown' );
                showLastMessage();
            }else{
                wz.app.createWindow( 8, null, 'hosting' );
            }

        });

    };

    var isAccountOpened = function( id ){
        return id === _accountOpened;
    };

    var isBoxOpened = function( id ){
        return id === _folderOpened;
    };

    var messagesInList = function(){
        return messagesColumn.children().not( messagePrototype ).not( '.middle-column-content-none' );
    };

    var toDate = function( date ){

        var todayDate         = new Date();
        var todayDateInfo     = todayDate.format('dmY');
        var yesterdayDate     = new Date( Date.now() - 86400000 );
        var yesterdayDateInfo = yesterdayDate.format('dmY');
        var sentDate          = new Date( date );

        return {

            'sentToday'     : todayDateInfo === sentDate.format('dmY'),
            'sentYesterday' : yesterdayDateInfo === sentDate.format('dmY'),
            'sentHour'      : sentDate.format('H'),
            'sentMinute'    : sentDate.format('i'),
            'sentSecond'    : sentDate.format('s'),
            'sentDay'       : sentDate.format('d'),
            'sentMonth'     : sentDate.format('m'),
            'sentYear'      : sentDate.format('Y')

        };

    };

    // Inserta la cuenta Common si no existe
    var showCommonAccount = function(){

        wz.mail.getAccounts( function( error, list ){
            
            if( error ){
                alert( error );
                return false;
            }

            if( list.length > 1 ){

                if( !mailColumn.children('general').length ){
                    mailAccount.after( _accountItem( list[ 0 ] ) );
                }

            }

        });

    };

    // Muestra la lista de correos
    var showMails = function( id, boxId, boxType, page ){

        page = parseInt( page, 10 );

        if( isNaN( page ) || page < 0 ){
            page = 0;
        }

        wz.mail( id, function( error, account ){

            if( error ){
                alert( error, null, win.data().win );
                return false;
            }

            _accountOpened = id;

            account.getMessagesFromBox( boxId, 20, page, function( error, list ){

                if( error ){
                    alert( error, null, win.data().win );
                    return false;
                }

                _folderOpened     = boxId;
                _folderTypeOpened = boxType;
                _pageOpened       = page;

                $( '.middle-column-pages-actual', messagesZone ).text( ( ( page * 20 ) + 1 ) + ' - ' + ( ( page + 1 ) * 20 ) );

                // Limpiamos la columna
                messagesInList().remove();

                var messageList = [];

                for( var i = 0, j = list.length; i < j ; i++ ){
                    messageList.push( _messageItem( list[ i ] ) );
                }

                messagesColumn.append( messageList );

                messagesZone.addClass( 'box-shown' );
                win.trigger( 'messages-shown' );

                // Nullify
                messageList = list = account = null;

            });

        });

    };

    var showReceptors = function( fullMessage ){

        if( fullMessage.to.length ){

            $( '.receivers-to', contentReceivers ).css( 'display', 'block' );
            $( '.receivers-to', contentReceivers ).children().not( '.receivers-title, .wz-prototype' ).remove();

            for( var i = 0, j = fullMessage.to.length; i < j; i++ ){

                if( myAccount === fullMessage.to[ i ].address  ){

                    $( '.receivers-to', contentReceivers ).append( $( '.receivers-to .wz-prototype', contentReceivers ).clone().removeClass( 'wz-prototype' ).text( fullMessage.to[ i ].address + ' ' + '(' + lang.me + ')' ) );
                
                }else{
                    $( '.receivers-to', contentReceivers ).append( $( '.receivers-to .wz-prototype', contentReceivers ).clone().removeClass( 'wz-prototype' ).text( fullMessage.to[ i ].address ) );
                }
                
            }

        }else{
            $( '.receivers-to', contentReceivers ).css( 'display', 'none' );
        }

        if( fullMessage.cc.length ){

            $( '.receivers-cc', contentReceivers ).css( 'display', 'block' );
            $( '.receivers-cc', contentReceivers ).children().not( '.receivers-title, .wz-prototype' ).remove();

            for( var k = 0, l = fullMessage.cc.length; k < l ; k++ ){

                if( myAccount === fullMessage.cc[ k ].address  ){
                    $( '.receivers-cc', contentReceivers ).append( $( '.receivers-cc .wz-prototype', contentReceivers ).clone().removeClass( 'wz-prototype' ).text( fullMessage.cc[ k ].address + ' ' + '(' + lang.me + ')' ) );
                }else{
                    $( '.receivers-cc', contentReceivers ).append( $( '.receivers-cc .wz-prototype', contentReceivers ).clone().removeClass( 'wz-prototype' ).text( fullMessage.cc[ k ].address ) );
                }

            }

        }else{
            $( '.receivers-cc', contentReceivers ).css( 'display', 'none' );
        }

        if( fullMessage.bcc.length ){

            $( '.receivers-cco', contentReceivers ).css( 'display', 'block' );
            $( '.receivers-cco', contentReceivers ).children().not( '.receivers-title, .wz-prototype' ).remove();

            for( var m = 0, n = fullMessage.bcc.length; m < n; m++ ){

                if( myAccount === fullMessage.bcc[ m ].address  ){
                    $( '.receivers-cco', contentReceivers ).append( $( '.receivers-cco .wz-prototype', contentReceivers ).clone().removeClass( 'wz-prototype' ).text( fullMessage.bcc[ m ].address + ' ' + '(' + lang.me + ')' ) );
                }else{
                    $( '.receivers-cco', contentReceivers ).append( $( '.receivers-cco .wz-prototype', contentReceivers ).clone().removeClass( 'wz-prototype' ).text( fullMessage.bcc[ m ].address ) );
                }

            }

        }else{
            $( '.receivers-cco', contentReceivers ).css( 'display', 'none' );
        }

    };

    var showMessage = function( message ){

        _lastMailFolderType = _folderTypeOpened;

        contentSubject.text( message.title );
        contentName.text( message.from.name );
        contentMail.text( message.from.address );

        message.markAsSeen( function( error ){

            if( error ){
                alert( error );
            }

        });

        contentColumn
            .removeClass()
            .addClass( 'message-' + message.id + ' right-column-content message-shown parent wz-fit' )
            .data( 'message', message );

        //contentMessage.height( 312 ); // To Do -> Automatizar esto

        if( message.hasAttachments() ){

            contentColumn.addClass( 'attachments' );

            /*if( attachments.children().size() < 3 ){

                attachments.height( 66 ); // To Do -> Automatizar esto
                contentMessage.height( 244 ); // To Do -> Automatizar esto

            }else if( attachments.children().size() === 3 ){

                attachments.height( 88 ); // To Do -> Automatizar esto
                contentMessage.height( 222 ); // To Do -> Automatizar esto

            }else{

                attachments.height( 118 ); // To Do -> Automatizar esto
                contentMessage.height( 192 ); // To Do -> Automatizar esto

            }*/

        }else{

            contentColumn.removeClass( 'attachments' );
            //contentMessage.height( 315 ); // To Do -> Automatizar esto
            //contentHr.css( 'margin-bottom', 15 ); // To Do -> Automatizar esto

        }

        var messageDate = toDate( message.time.getTime() );

        if( messageDate.sentToday ){
            contentDate.text( lang.today + ' ' + messageDate.sentHour + ':' + messageDate.sentMinute );
        }else if( messageDate.sentYesterday ){
            contentDate.text( lang.yesterday + ' ' + messageDate.sentHour + ':' + messageDate.sentMinute );
        }else{
            contentDate.text( messageDate.sentDay + '/' + messageDate.sentMonth + ', ' + messageDate.sentHour + ':' + messageDate.sentMinute );
        }

        wql.changeOpened( [ message.id, $( '.mailbox.active', mailColumn ).data( 'id' ), $( '.account.display', mailColumn ).data( 'id' ) ] );

        message.getFullMessage( function( error, fullMessage ){

            if( error ){
                alert( error );
                return false;
            }

            if( fullMessage.isFlagged() ){
                contentStar.addClass( 'active' );
            }else{
                contentStar.removeClass( 'active' );
            }

            if( fullMessage.to.length > 1 || fullMessage.cc.length || fullMessage.bcc.length ){

                contentDisplay.css( 'display', 'block' );
                $( '.reply-mode-reply-all', contentReplyMode ).css( 'display', 'block' );

            }else{

                contentDisplay.css( 'display', 'none' );
                $( '.reply-mode-reply-all', contentReplyMode ).css( 'display', 'none' );

            }

            contentMessageText.contents().find( 'body' ).html( _basicStyle() + fullMessage.message );

            if( !( /webkit/gi ).test( navigator.userAgent ) ){

                contentMessageText.contents().on( 'mousewheel', function( e, d, deltaX, deltaY ){
                    contentMessage.trigger( 'mousewheel', [ d, deltaX, deltaY ] );
                });

            }

            contentMessageText
                .css( 'height', '' )
                .height( contentMessageText.contents().find( 'html' ).height() );

            if( fullMessage.isSpam() ){
                $( '.reply-mode-spam', contentReplyMode ).css( 'display', 'none' );
            }else{
                $( '.reply-mode-spam', contentReplyMode ).css( 'display', 'block' );
            }

            wz.mail( fullMessage.accountId, function( error, account ){

                if( error ){
                    alert( error );
                    return false;
                }

                myAccount = account.address;
                showReceptors( fullMessage );

            });

            contentColumn.data( 'message', fullMessage );

        });

    };

    /*
    var appendMessage = function( message ){

        var messageSqueleton = messagePrototype.clone();

        messageSqueleton
            .removeClass( 'wz-prototype' )
            .addClass( 'message-' + message.id )
            .data( 'message', message )
            .appendTo( messagesColumn );

        messageSqueleton.find( '.message-origin' ).text( message.from.name );
        messageSqueleton.find( '.message-subject' ).text( message.title );

        if( !message.isSeen() ){
            messageSqueleton.addClass( 'unread' );
        }

        if( message.attachments.length ){
            messageSqueleton.find( '.message-clip' ).addClass( 'attached' );
        }

        var messageDate = toDate( message.time.getTime() );

        if( messageDate.sentToday ){
            messageSqueleton.find( '.message-date' ).text( messageDate.sentHour + ':' + messageDate.sentMinute );
        }else{
            messageSqueleton.find( '.message-date' ).text( messageDate.sentDay + '/' + messageDate.sentMonth );
        }

        if( message.isFlagged() ){
            messageSqueleton.find( '.message-star' ).addClass( 'active' );
        }

        messagesColumn.find( '.message:last-child' ).remove();

    };
    */

    var insertBox = function( boxObj, accountObj ){

        var boxes = accountObj.children().not('.wz-prototype, .syncing');

        if( boxes.filter( '.box-' + boxObj.data('id') ).size() || boxes.filter( '.' + boxObj.data('type') ).size() ){
            return false;
        }

        accountObj.children('.syncing').remove();

        if( boxes.size() === 0 ){
            accountObj.prepend( accountObj );
        }else{

            var inserted = false;

            boxes.each( function(){

                if( $( this ).data('order') > boxObj.data('order') ){

                    $( this ).before( boxObj );
                    inserted = true;
                    return false;

                }

            });

            if( !inserted ){
                boxes.last().after( boxObj );
            }

        }

    };

    var mailsUnread = function( accountId ){

        wz.mail.getCounters( function( error, list ){

            if( error ){
                alert( error );
                return false;
            }
            
            var i = 0;
            var j = 0;

            for( i in list ){

                 mailColumn.find('.account-' + i ).children( '.bullet' ).text( list[ i ].unread ? list[ i ].unread : '' );

                for( j in list[ i ].folders ){
                    mailColumn.find('.account-' + i + '-box-' + list[ i ].folders[ j ].id ).children( '.bullet' ).text( list[ i ].folders[ j ].unread ? list[ i ].folders[ j ].unread : '' );
                }

            }

        });

    };

    var showLastMessage = function(){

        wql.getOpened( function( error, result ){

            if( error ){
                alert( error );
                return false;
            }

            if( result.length ){

                win.on( 'boxes-shown', function( e, elementId ){

                    if( elementId == result[ 0 ].account ){

                        $( '.account-' + result[ 0 ].account, mailColumn ).click();
                        $( '.box-' + result[ 0 ].box, mailColumn ).click();

                        win.off( e );

                    }

                });

                win.on( 'messages-shown', function( e ){

                    $( '.message-' + result[ 0 ].message, messagesColumn ).addClass( 'selected last-selected' );

                    wz.mail.getMessage( result[ 0 ].message, function( error, message ){

                        if( error ){
                            alert( error );
                            return false;
                        }

                        showMessage( message );

                    });

                    win.off( e );

                });

            }else{

                wql.insertOpened();

            }

        });

    };

    var translateUI = function(){

        $( '.new-mail span', mailZone ).text( lang.newEmail );
        $( '.add-account span', mailColumn ).text( lang.addAccount );
        $( '.content-attachments-title span', contentColumn ).not( '.light' ).text( lang.attachments );
        $( '.content-attachments-view', contentColumn ).text( lang.view );
        $( '.content-attachments-download', contentColumn ).text( lang.download );
        $( '.content-attachments-import', contentColumn ).text( lang.import );
        $( '.middle-column-top input', contentColumn ).attr( 'placeholder', lang.search );
        $( '.receivers-to .receivers-title', contentReceivers ).text( lang.to + ':' );
        $( '.receivers-cc .receivers-title', contentReceivers ).text( lang.cc + ':' );
        $( '.receivers-cco .receivers-title', contentReceivers ).text( lang.cco + ':' );
        $( '.middle-column-content-none', messagesColumn ).text( lang.noBoxOpened );
        $( '.content-message-none', contentMessage ).text( lang.noMessageOpened );
        $( '.reply-mode-reply span', contentReplyMode ).text( lang.reply );
        $( '.reply-mode-reply-all span', contentReplyMode ).text( lang.replyToAll );
        $( '.reply-mode-forward span', contentReplyMode ).text( lang.forward );
        $( '.reply-mode-mark-unread span', contentReplyMode ).text( lang.markAsUnread );
        $( '.reply-mode-spam span', contentReplyMode ).text( lang.markAsSpam );
        $( '.reply-mode-delete span', contentReplyMode ).text( lang.moveToTrash );

    };

    win
    .on( 'click', '.account', function(){

        var minHeight = $(this).children('span').outerHeight( true );
        var height    = _accountOptionsHeight( this );

        if( $( this ).hasClass('display') ){

            $( this )
                .removeClass('display')
                .transition( { height: minHeight }, 250 );

        }else{

            openedAccount.text( $( this ).children( 'span' ).text() );

            $('.display')
                .removeClass('display')
                .transition( { height: minHeight }, 250 );

            $( this )
                .addClass('display')
                .transition( { height: height }, 250 );

        }

    })

    .on( 'click', '.mailbox', function( e ){

        e.stopPropagation();

        openedMailbox.text( $(this).children( 'span' ).text() );
        showMails( $(this).parent( '.account' ).data( 'id' ), $(this).data( 'id' ), $(this).data( 'type' ) );
        $( '.active', mailColumn ).removeClass( 'active' );
        $( this ).addClass( 'active' );
        contentReceivers.removeClass( 'content-receivers-displayed' ).css( 'display', 'none' );
        contentReplyMode.removeClass( 'reply-mode-displayed' ).css( 'display', 'none' );

    })
    
    .on( 'click', '.message', function( e ){

        if( e.ctrlKey || e.metaKey ){

            if( $( this ).hasClass( 'selected' ) ){
                $( this ).removeClass( 'selected' );
            }else{
                $( '.last-selected', messagesColumn ).removeClass( 'last-selected' );
                $( this ).addClass( 'selected last-selected' );
                showMessage( $( this ).data( 'message' ) );
            }

        }else if( e.shiftKey ){

            var messages = $( '.message', messagesColumn );
            var beginRow = messages.index( this );
            var finalRow = messages.index( messages.filter( '.last-selected' ) );
            var row      = null;
            
            if( beginRow < finalRow ){
                row = messages.slice( beginRow, finalRow + 1 ).addClass( 'selected' );
            }else{
                row = messages.slice( finalRow, beginRow + 1 ).addClass( 'selected' );
            }
            
            messages.not( row ).removeClass( 'selected' );

        }else{

            $( '.selected', messagesColumn ).removeClass( 'selected' );
            $( '.last-selected', messagesColumn ).removeClass( 'last-selected' );
            $( this ).addClass( 'selected last-selected' );
            showMessage( $( this ).data( 'message' ) );

        }

    })
    
    .on( 'click', 'input', function( e ){
        e.stopPropagation();
        contentReceivers.removeClass( 'content-receivers-displayed' ).css( 'display', 'none' );
        contentReplyMode.removeClass( 'reply-mode-displayed' ).css( 'display', 'none' );
    })
    
    .on( 'click', '.message-star', function( e ){

        e.stopPropagation();
        contentReceivers.removeClass( 'content-receivers-displayed' ).css( 'display', 'none' );
        contentReplyMode.removeClass( 'reply-mode-displayed' ).css( 'display', 'none' );

        if( $(this).hasClass('active') ){

            $(this).removeClass('active');
            $(this).parents( '.parent' ).data( 'message' ).unmarkAsFlagged( function( error ){
                if( error ){
                    alert( error, null, win.data().win );
                }
            });

        }else{

            $(this).addClass('active');
            $(this).parents( '.parent' ).data( 'message' ).markAsFlagged( function( error ){
                if( error ){
                    alert( error, null, win.data().win );
                }
            });

        }

    })
    
    .on( 'click', '.options-reply', function(){

        if( contentColumn.hasClass( 'message-shown' ) ){

            wz.app.createWindow(
                8,
                {
                    to      : [ contentColumn.data().message.from.address ],
                    cc      : null,
                    subject : contentColumn.data().message.title,
                    message : contentColumn.data().message.message,
                    reply   : contentColumn.data().message.inReplyTo
                },
                'new'
            );

        }

    })

    .on( 'click', '.reply-mode-reply', function(){
        $( '.options-reply', contentColumn ).click();
    })

    .on( 'click', '.reply-mode-reply-all', function(){
        
        var receivers = [];

        receivers.push( contentColumn.data().message.from.address );

        var data = contentColumn.data();

        for( var i = 0, j = data.message.to.length; i < j; i++ ){

            if( myAccount !== data.message.to[ i ].address ){
                receivers.push( data.message.to[ i ].address );
            }

        }

        var cc = [];

        for( var k = 0, l = data.message.cc.length; k < l; k++ ){

            if( myAccount !== data.message.cc[ i ].address ){
                cc.push( data.message.cc[ i ].address );
            }

        }

        wz.app.createWindow(
            8,
            {
                to      : receivers,
                cc      : cc,
                subject : data.message.title,
                message : data.message.message,
                reply   : data.message.inReplyTo
            },
            'new'
        );

    })

    .on( 'click', '.reply-mode-mark-unread', function(){
        $( '.options-unread', contentColumn ).click();
    })

    .on( 'click', '.reply-mode-spam', function(){
        $( '.options-spam', contentColumn ).click();
    })

    .on( 'click', '.reply-mode-delete', function(){
        $( '.options-trash', contentColumn ).click();
    })

    .on( 'click', '.new-mail', function(){

        if( mailZone.hasClass( 'account-shown' ) ){
            wz.app.createWindow( 8, '', 'new' );
        }else{
            alert( lang.createAccountToSend );
        }

    })

    .on( 'click', '.options-spam.middle', function(){

        var messageSpamPrev = $( '.last-selected', messagesColumn ).prev().not('.wz-prototype, .middle-column-content-none');
        var messageSpamNext = $( '.last-selected', messagesColumn ).next();

        $( '.selected', messagesColumn ).each( function(){

            $( this ).data( 'message' ).moveToSpam( function( error ){

                if( error ){
                    alert( error );
                }else{

                    if( messageSpamPrev.size() ){
                        messageSpamPrev.click();
                    }else if( messageSpamNext.size() ){
                        messageSpamNext.click();
                    }

                }

            });

        });

    })

    .on( 'click', '.options-spam.right', function(){

        if( contentColumn.hasClass( 'message-shown' ) ){

            var messageSpamPrev = $( '.last-selected', messagesColumn ).prev().not('.wz-prototype, .middle-column-content-none');
            var messageSpamNext = $( '.last-selected', messagesColumn ).next();

            contentColumn.data( 'message' ).moveToSpam( function( error ){

                if( error ){
                    alert( error );
                }else{

                    if( messageSpamPrev.size() ){
                        messageSpamPrev.click();
                    }else if( messageSpamNext.size() ){
                        messageSpamNext.click();
                    }

                }

            });

        }

    })

    .on( 'click', '.options-trash.middle', function(){

        var messageTrashPrev = $( '.last-selected', messagesColumn ).prev().not('.wz-prototype, .middle-column-content-none');
        var messageTrashNext = $( '.last-selected', messagesColumn ).next();
        var messagesSelected = $( '.selected', messagesColumn );

        if( messagesSelected.length ){

            if( _lastMailFolderType === 'trash' ){

                confirm( 'Hola Mundo', function( result ){

                    if( result ){

                        messagesSelected.each( function(){

                            $( this ).data('message').remove( function( error ){

                                if( error ){
                                    alert( error );
                                }else{

                                    // To Do -> Esto tiene pinta de bucle excesivo
                                    if( messageTrashPrev.size() ){
                                        messageTrashPrev.click();
                                    }else if( messageTrashNext.size() ){
                                        messageTrashNext.click();
                                    }

                                }

                            });

                        });

                    }

                });

            }else{

                messagesSelected.each( function(){

                    $( this ).data( 'message' ).moveToTrash( function( error ){

                        if( error ){
                            alert( error );
                        }else{

                            // To Do -> Esto tiene pinta de bucle excesivo
                            if( messageTrashPrev.size() ){
                                messageTrashPrev.click();
                            }else if( messageTrashNext.size() ){
                                messageTrashNext.click();
                            }

                        }

                    });

                });

            }

        }

    })

    .on( 'click', '.options-trash.right', function(){

        if( contentColumn.hasClass( 'message-shown' ) ){

            var messageTrashPrev = $( '.last-selected', messagesColumn ).prev().not('.wz-prototype, .middle-column-content-none');
            var messageTrashNext = $( '.last-selected', messagesColumn ).next();

            if( _lastMailFolderType === 'trash' ){
            
                confirm( 'Hola Mundo', function( result ){

                    contentColumn.data( 'message' ).remove( function( error ){

                        if( error ){
                            alert( error );
                        }else{

                            if( messageTrashPrev.size() ){
                                messageTrashPrev.click();
                            }else if( messageTrashNext.size() ){
                                messageTrashNext.click();
                            }

                        }

                    });

                });

            }else{

                contentColumn.data( 'message' ).moveToTrash( function( error ){

                    if( error ){
                        alert( error );
                    }else{

                        if( messageTrashPrev.size() ){
                            messageTrashPrev.click();
                        }else if( messageTrashNext.size() ){
                            messageTrashNext.click();
                        }

                    }

                });

            }

        }

    })

    .on( 'click', '.options-unread.middle', function(){

        $( '.selected', messagesColumn ).each( function(){

            $( this ).data( 'message' ).unmarkAsSeen( function( error ){

                if( error ){
                    alert( error );
                }

            });

        });

    })

    .on( 'click', '.options-unread.right', function(){

        if( contentColumn.hasClass( 'message-shown' ) ){

            contentColumn.data( 'message' ).unmarkAsSeen( function( error ){

                if( error ){
                    alert( error );
                }

            });

        }

    })

    .on( 'click', '.options-read.middle', function(){

        $( '.selected', messagesColumn ).each( function(){

            $( this ).data( 'message' ).markAsSeen( function( error ){

                if( error ){
                    alert( error );
                }

            });

        });

    })

    .on( 'click', '.options-read.right', function(){

        if( contentColumn.hasClass( 'message-shown' ) ){

            contentColumn.data( 'message' ).markAsSeen( function( error ){

                if( error ){
                    alert( error );
                }

            });

        }

    })

    .on( 'click', '.options-prev.right', function(){

        if( contentColumn.hasClass( 'message-shown' ) ){

            var prevMessage = $( '.last-selected', messagesColumn ).prev().not('.wz-prototype, .middle-column-content-none');

            if( prevMessage.size() ){
                prevMessage.click();
            }

        }

    })

    .on( 'click', '.options-next.right', function(){

        var nextMessage = $( '.last-selected', messagesColumn ).next();

        if( nextMessage.size() ){
            nextMessage.click();
        }

    })

    .on( 'click', '.options-more', function( e ){

        if( contentColumn.hasClass( 'message-shown' ) ){

            e.stopPropagation();

            if( contentReplyMode.hasClass( 'reply-mode-displayed' ) ){
                contentReplyMode.removeClass( 'reply-mode-displayed' ).css( 'display', 'none' );
            }else{
                contentReplyMode.addClass( 'reply-mode-displayed' ).css( 'display', 'block' );
            }

            contentReceivers.removeClass( 'content-receivers-displayed' ).css( 'display', 'none' );

        }

    })

    .on( 'click', '.content-origin-display', function( e ){

        e.stopPropagation();

        if( contentReceivers.hasClass( 'content-receivers-displayed' ) ){
            contentReceivers.removeClass( 'content-receivers-displayed' ).css( 'display', 'none' );
        }else{
            contentReceivers.addClass( 'content-receivers-displayed' ).css( 'display', 'block' );
        }

        contentReplyMode.removeClass( 'reply-mode-displayed' ).css( 'display', 'none' );

    })

    .on( 'click', '.right-column-content-receivers', function( e ){
        e.stopPropagation();
    })

    // Anterior página de mensajes
    .on( 'click', '.middle-column-pages-prev', function(){

        var page = _pageOpened - 1;

        if( page < 0 ){
            page = 0;
        }

        if( page !== _pageOpened ){
            showMails( _accountOpened, _folderOpened, _folderTypeOpened, page );
        }
        
    })

    // Siguiente página de mensajes
    .on( 'click', '.middle-column-pages-next', function(){

        var page = _pageOpened + 1;

        if( page < 0 ){
            page = 0;
        }

        if( page !== _pageOpened ){
            showMails( _accountOpened, _folderOpened, _folderTypeOpened, page );
        }

    })

    // Oculta los desplegables de Receptores y Modos de respuesta
    .on( 'click', function(){

        contentReceivers.removeClass( 'content-receivers-displayed' ).css( 'display', 'none' );
        contentReplyMode.removeClass( 'reply-mode-displayed' ).css( 'display', 'none' );

    })

    .on( 'contextmenu', '.account', function(){

        var mailData = $( this ).data( 'mail' );
        var idData   = $( this ).data( 'id' );

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
                            alert( error );
                        }else{

                            wz.banner()
                                .title( lang.accountDeleted )
                                .text( mailData + ' ' + lang.deleteSuccessful )
                                .icon( 'https://static.weezeel.com/app/8/envelope.png' )
                                .render();

                        }

                    });

                }, 'warning')

                .render();

        }

    })

    .on( 'contextmenu', '.account article', function( e ){

        e.stopPropagation();

        contentReceivers.removeClass( 'content-receivers-displayed' ).css( 'display', 'none' );
        contentReplyMode.removeClass( 'reply-mode-displayed' ).css( 'display', 'none' );

        return false; // To Do -> Es realmente necesario?

    })

    .on( 'mail-messageMarkedAsSeen', function( e, message ){

        $( '.message-' + message.id, messagesColumn ).removeClass( 'unread' );
        mailsUnread( message.accountId );

    })

    .on( 'mail-messageUnmarkedAsSeen', function( e, message ){

        $( '.message-' + message.id, messagesColumn ).addClass( 'unread' );
        mailsUnread( message.accountId );

    })

    .on( 'mail-messageMarkedAsFlagged', function( e, message ){
        $( '.message-' + message.id + ' .message-star', win ).addClass( 'active' );
    })

    .on( 'mail-messageUnmarkedAsFlagged', function( e, message ){
        $( '.message-' + message.id + ' .message-star', win ).removeClass( 'active' );
    })

    .on( 'mail-messageRemoved', function( e, message ){

        $( '.message-' + message, messagesColumn ).remove();
        mailsUnread( message.accountId );

    })

    .on( 'mail-messageIn', function( e, accountId, message, boxId, boxType ){

        if(

            ( isAccountOpened( 'common' ) && isBoxOpened( boxType ) ) ||
            ( isAccountOpened( accountId ) && isBoxOpened( boxId ) )

        ){
            
            var list     = messagesInList();
            var inserted = false;

            list.each( function(){

                if( $( this ).data('message-time') < message.time ){

                    $( this ).before( _messageItem( message ) );

                    inserted = true;

                    return false;

                }

            });

            if( !inserted ){
                messagesColumn.append( _messageItem( message ) );
            }

        }

        mailsUnread( accountId );

    })

    .on( 'mail-messageOut', function( e, accountId, messageId /*, boxId */ ){
        $( '.account-' + accountId + '-message-' + messageId, messagesColumn ).remove();
    })

    .on( 'mail-newMessage', function( /* e, message */ ){
        // To Do
    })

    .on( 'mail-accountAdded', function( e, mailAccount ){

        addAccount.before( _accountItem( mailAccount ) );
        mailZone.addClass( 'account-shown' );

        if( !mailColumn.children('.general').length ){
            showCommonAccount();
        }

    })

    .on( 'mail-accountRemoved', function( e, accountId ){
        
        $( '.account-' + accountId, mailColumn )
            .addClass('removed')
            .transition( { height : 0 }, 150, function(){
                $( this ).remove();
            });

        if( $( '.account', mailColumn ).not('.removed, .wz-prototype, .general').size() < 1 ){

            $( '.account.general', mailColumn ).transition( { height : 0 }, 150, function(){
                $( this ).remove();
            });

            contentColumn.removeClass( 'message-shown' );
            messagesZone.removeClass( 'box-shown' );

            wz.app.createWindow( 8, null, 'hosting' );
            
        }

        $( '.account-' + accountId + '-message', messagesColumn ).remove();

    })

    .on( 'mail-accountRemoveFinished', function( e, accountId ){
        $( '.account-' + accountId + '-message', messagesColumn ).remove();
    })

    .on( 'mail-boxAdded', function( e, mailBox, accountId ){

        if( mailBox.type === 'normal' || mailBox.type === 'allMail' ){
            return false;
        }

        var accountItem = $( '.account-' + accountId, mailColumn );
        var boxItem     = null;

        if( !accountItem.size() ){
            return false;
        }

        boxItem = _boxItem( mailBox, accountItem.children('.wz-prototype') );

        insertBox( boxItem, accountItem );

        if( accountItem.hasClass('display') ){

            var size = 0;
            boxItem.siblings('.mailbox, span').add( boxItem ).not('.wz-prototype').each(function(){
                size += boxItem.outerHeight( true );
            });

            accountItem.stop().clearQueue().animate( { height : size }, 150 );
        }

        mailsUnread( accountId );

    })

    .on( 'mail-boxRemoved', function( e, boxId, accountId ){

        var boxItem     = $( '.account-' + accountId + '-box-' + boxId, mailColumn );
        var accountItem = boxItem.parent();

        if( !boxItem.size() ){
            return false;
        }

        var size = 0;
        
        boxItem.siblings('.mailbox, span').not('.wz-prototype').each(function(){
            size += boxItem.outerHeight( true );
        });

        boxItem.fadeOut( 150, function(){
            $( this ).remove();
        });

        accountItem.delay( 50 ).accountItem.stop().clearQueue().animate( { height : height }, 150 );

        mailsUnread( accountId );

    })

    .on( 'mail-accountParamChanged', function( e, accountId, type, value ){

        if( type === 'description' ){
            $( '.account-' + accountId, mailColumn ).children( 'span' ).text( value );
        }

    })

    .key( 'down', function( e ){

        var target = null;

        if( messagesColumn.children('.selected').first().hasClass( 'last-selected' ) ){
            target = messagesColumn.children('.selected').last();
        }else{
            target = messagesColumn.children('.selected').first();
        }

        e = jQuery.Event( "click", { shiftKey : e.shiftKey } );

        if( target.size() ){

            target = target.next();

            if( target.size() ){
                target.trigger( e );
            }

        }else{
            messagesColumn.children( ':not( .wz-prototype, .middle-column-content-none ):first' ).click();
        }

    })

    .key( 'up', function( e ){

        var target = null;

        if( messagesColumn.children('.selected').first().hasClass( 'last-selected' ) ){
            target = messagesColumn.children('.selected').last();
        }else{
            target = messagesColumn.children('.selected').first();
        }

        e = jQuery.Event( "click", { shiftKey : e.shiftKey } );

        if( target.size() ){

            target = target.prev().not('.wz-prototype, .middle-column-content-none');

            if( target.size() ){
                target.trigger( e );
            }

        }else{
            messagesColumn.children(':not( .wz-prototype, .middle-column-content-none ):first' ).click();
        }

    })

    .key( 'backspace, del', function( e ){

        if( $( e.target ).is('input') ){
            return false;
        }

        $('.options-trash.middle').click();

    })

    .key( 'enter', function( e ){

        if( $( e.target ).is('input') ){

            if( _accountOpened === 'common' ){

                wz.mail.search( $( e.target ).val(), 'all', 'all', function( error, messages ){

                    if( error ){
                        alert( error, null, win.data().win );
                        return false;
                    }

                    // Limpiamos la columna
                    messagesInList().remove();

                    var messageList = [];

                    for( var i = 0, j = messages.length ; i < j ; i++ ){
                        messageList.push( _messageItem( messages[ i ] ) );
                    }

                    messagesColumn.append( messageList );

                });

            }else{

                wz.mail( _accountOpened, function( error, account ){

                    if( error ){
                        alert( error, null, win.data().win );
                        return false;
                    }

                    account.search( $( e.target ).val(), 'all', function( error, messages ){

                        if( error ){
                            alert( error, null, win.data().win );
                            return false;
                        }

                        // Limpiamos la columna
                        messagesInList().remove();

                        var messageList = [];

                        for( var i = 0, j = messages.length ; i < j ; i++ ){
                            messageList.push( _messageItem( messages[ i ] ) );
                        }

                        messagesColumn.append( messageList );

                    });

                });

            }

        }

    })

    .on( 'wz-resize-end', function(){
        wql.changeSize( [ win.width(), win.height() ] );
    });

    addAccount
    .on( 'click', function(){
        wz.app.createWindow( 8, null, 'hosting' );
    });

    // Start App
    getAccounts();
    translateUI();
