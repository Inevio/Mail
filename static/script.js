
// Constants
var PAGINATION_LIMIT = 20;

// DOM Variables
var win                 = $( this );
var attachments         = $('.content-attachments');
var attachmentPrototype = $('.wz-prototype', attachments );
var openedAccount       = $('.left-column-top span');
var openedMailbox       = $('.middle-column-top span');
var mailZone            = $('.left-column-content');
var mailColumn          = $('.left-column-content-scroll', mailZone );
var mailAccount         = $('.account.wz-prototype', mailColumn );
var addAccount          = $('.add-account', mailColumn );
var messagesZone        = $('.middle-column-content');
var messagesColumn      = $('.middle-column-content-scroll', messagesZone );
var messagePrototype    = $('.message.wz-prototype', messagesColumn );
var contentSubject      = $('.mail-subject');
var contentColumn       = $('.right-column-content');
var contentReplyMode    = $('.right-column-content-reply-mode', contentColumn );
var contentReceivers    = $('.right-column-content-receivers', contentColumn );
var contentName         = $('.content-origin-name', contentColumn );
var contentMail         = $('.content-origin-mail', contentColumn );
var contentDisplay      = $('.content-origin-display', contentColumn );
var contentDate         = $('.content-origin-date', contentColumn );
var contentStar         = $('.message-star', contentColumn );
var contentMessage      = $('.content-message', contentColumn );
var contentMessageText  = $('.content-message-text', contentMessage );


var _accountList = [];
var _accountOpened;
var _boxOpened;
var _prevRequest        = null;
var _nextRequest        = null;
var _pageOpened         = 0;

var _formatId = function( id ){
    return id.replace(/[^a-z0-9]/ig,'-');
};

    var _accountOptionsHeight = function( item ){
        item = $( item );

        var height = 0;

        $( '.mailbox', item ).add( item.children('span') ).not('.wz-prototype').each( function(){
            height += $( this ).outerHeight( true );
        });

        return height;

    };

var _accountItem = function( account ){

    var item = mailAccount.clone().removeClass( 'wz-prototype' );

    /*
    if( account.inProtocol === 'common' ){

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
    */

        item
            .addClass( 'account-' + account.id )
            .data({

                mail : account.address,
                id   : account.id

            })
            .children('.account-info')
            .children('span')
                .text( account.description );

        /*
        if( account.unread ){
            item.children( '.bullet' ).text( account.unread );
        }
        */

    /*}*/

    item.find('.syncing span').text( lang.syncing );

    _accountItemBoxes( account, item );

    return item;

};

var _accountItemBoxes = function( account, item ){

    var boxesPromise    = $.Deferred();
    var countersPromise = $.Deferred();
    var counters        = null;

    console.log( account );

    account.getBoxes( function( error, boxes ){

        if( error ){
            return alert( error );
        }

        var boxPrototype = item.find( '.mailbox.wz-prototype' );
        var children     = [];

        for( var i = 0; i < boxes.length; i++ ){
          console.log(boxes[i]);
            children.push( _boxItem( boxes[ i ], boxPrototype ) );
        }

        children = children.sort( function( a, b ){

            var aOrder = a.data('order');
            var bOrder = b.data('order');

            if( aOrder - bOrder ){
                return aOrder - bOrder;
            }

            return a.data('name').localeCompare( b.data('name') );

        });

        item.children('.children').append( children );

        boxesPromise.resolve();

        /*win.trigger( 'boxes-shown', [ account.id ] );*/

    });

    wz.mail.getCounters( account.id, function( error, object ){

        if( error ){
            return alert( error );
        }

        counters = object;

        countersPromise.resolve();

    });

    $.when( boxesPromise, countersPromise ).done( function(){

        for( var i in counters ){
            updateMailboxCounter( account.id, i, counters[ i ].unseen );
        }

    });

};

var updateMailboxCounter = function( accountId, path, value ){

    value = value || '';

    var width = 0;

    if( path === 'INBOX' ){

        var accountInfo = mailColumn.find( '.account-' + accountId ).children('.account-info')

        accountInfo.children('.bullet').text( value );
        accountInfo.children('.arrow, .icon').each( function(){
            width += $(this).outerWidth( true );
        });
        accountInfo.children('.bullet').each( function(){

            if( $(this).css('display') !== 'none' ){
                width += $(this).outerWidth( true );
            }else{
                width += parseInt( $(this).css('margin-right'), 10 );
            }

        });
        accountInfo.find('span').outerWidth( accountInfo.width() - width - 1, true ); // -1 it's neccesary, calculations aren't exactly

        width = 0;

    }

    var mailboxInfo = mailColumn.find( '.account-' + accountId + '-box-' + _formatId( path ) ).children('.mailbox-info');

    mailboxInfo.children('.bullet').text( value );
    mailboxInfo.children('.arrow, .icon').each( function(){
        width += $(this).outerWidth( true );
    });

    mailboxInfo.children('.bullet').each( function(){

        if( $(this).css('display') !== 'none' ){
            width += $(this).outerWidth( true );
        }else{
            width += parseInt( $(this).css('margin-right'), 10 );
        }

    });

    mailboxInfo.find('span').outerWidth( mailboxInfo.width() - width - 1, true ); // -1 it's neccesary, calculations aren't exactly

};

var _getBasicStyle = function(){

    var result = '<style>';

    result += '* {' +
        'font-family: "Effra", Helvetica, Arial, sans-serif;' +
        'font-size: 14px;' +
        '}';

    return result + '</style>';

};

var _boxItem = function( box, prototype ){

    var item    = prototype.clone().removeClass('wz-prototype');
    var text    = box.name;
    var classes = 'normal';
    var order   = 10;

    switch( box.type ){

        case 'normal' :
            break;
        case 'inbox':

            text    = lang.inbox;
            classes = 'inbox';
            order   = 0;

            break;

        case 'flagged' :

            text    = lang.starred;
            classes = 'starred';
            order   = 1;

            break;

        case 'sent' :

            text    = lang.sent;
            classes = 'sent';
            order   = 2;

            break;

        case 'drafts' :

            text    = lang.drafts;
            classes = 'drafts';
            order   = 3;

            break;

        case 'junk' :

            text    = lang.spam;
            classes = 'spam';
            order   = 4;

            break;

        case 'trash' :

            text    = lang.trash;
            classes = 'trash';
            order   = 5;

            break;

        default :
            break;

    }

    /*item
        .addClass( classes + ' box-' + _formatId( box.path ) + ' account-' + box.accountId + '-box-' + _formatId( box.path ) )
        .data({

            id    : box.path,
            name  : box.name,
            order : order,
            path  : box.path,
            type  : classes

        });*/

    item
        .addClass( classes + ' box-' + _formatId( box.path ) + ' account-' + box.accountId + '-box-' + _formatId( box.path ) )
            .data( box );

    item.children('.mailbox-info').children('span').text( text );

    if( box.tags.indexOf('\\Noselect') >= 0 ){
        item.addClass('noselect');
    }

    if( box.unread ){
        item.children('.mailbox-info').children('.bullet').text( box.unread );
    }

    if( box.children.length ){

        item.removeClass('hide-arrow').addClass('arrow-closed');

        var children = [];

        for( var i = 0; i < box.children.length; i++ ){
            children.push( _boxItem( box.children[ i ], prototype ) );
        }

        children = children.sort( function( a, b ){

            var aOrder = a.data('order');
            var bOrder = b.data('order');

            if( aOrder - bOrder ){
                return aOrder - bOrder;
            }

            return a.data('name').localeCompare( b.data('name') );

        });

        item.children('.children').append( children );

    }

    return item;

};

var _messageItem = function( item ){

    var messageSqueleton = messagePrototype.clone();

    messageSqueleton
        .removeClass( 'wz-prototype' )
        .addClass( 'account-' + item.accountId + '-message' )
        .addClass( 'account-' + item.accountId + '-box-' + _formatId( item.path ) + '-message' )
        .addClass( 'account-' + item.accountId + '-box-' + _formatId( item.path ) + '-message-' + item.id )
        .data( 'message', item );

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
        messageSqueleton.find( '.message-date' ).text( messageDate.sentDay + '/' + messageDate.sentMonth + '/' + messageDate.sentYear.slice( -2 ) );
    }

    return messageSqueleton;

};

var getAccounts = function(){

    mailColumn.children().not( mailAccount ).not( addAccount ).remove();

    wz.mail.getAccounts( function( error, accounts ){

        if( error ){
            return alert( error );
        }

        if( !accounts.length ){
            return wz.app.createView( null, 'hosting' );
        }

        var list = [];

        for( var i = 0, j = accounts.length; i < j; i++ ){
            list.push( _accountItem( accounts[ i ] ) );
            _accountList.push( accounts[ i ] );
        }

        addAccount.before( list );
        /*showLastMessage();*/

    });

};

    /*
    var isAccountOpened = function( id ){
        return id === _accountOpened;
    };

    var isBoxOpened = function( id ){
        return id === _boxOpened;
    };
    */

var getMessagesInList = function(){
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
    /*
    var showCommonAccount = function(){

        wz.mail.getAccounts( function( error, list ){

            if( error ){
                return alert( error );
            }

            if( list.length > 1 ){

                if( !mailColumn.children('general').length ){
                    mailAccount.after( _accountItem( list[ 0 ] ) );
                }

            }

        });

    };
    */

// Muestra la lista de correos
var showMailsList = function( id, boxId, request){

    wz.mail( id, function( error, account ){

        if( error ){
            return alert( error );
        }

        _accountOpened = id;

        account.getMessagesFromBox( boxId, PAGINATION_LIMIT, request, function( error, object ){

            if( error ){
                return alert( error );
            }

            var list = object.list;

            _boxOpened   = boxId;
            _nextRequest = object.next;
            _prevRequest = object.prev;

            $( '.middle-column-pages-actual', messagesZone ).text( ( ( _pageOpened * PAGINATION_LIMIT ) + 1 ) + ' - ' + ( ( _pageOpened + 1 ) * PAGINATION_LIMIT ) );

            // Limpiamos la columna
            getMessagesInList().remove();

            var messageList = [];

            for( var i = 0, j = list.length; i < j ; i++ ){
                messageList.push( _messageItem( list[ i ] ) );
            }

            messagesColumn
                .append( messageList )
                .scrollTop( 0 );

            messagesZone.addClass( 'box-shown' );
            /*win.trigger( 'messages-shown' );*/

            // Nullify
            messageList = list = account = null;

        });

    });

};

var showReceptors = function( fullMessage ){

    if( fullMessage.to.length ){

        $( '.receivers-to', contentReceivers )
            .show()
            .children().not('.receivers-title, .wz-prototype')
                .remove();

        for( var i = 0; i < fullMessage.to.length; i++ ){

            $( '.receivers-to', contentReceivers ).append(

                $( '.receivers-to .wz-prototype', contentReceivers ).clone()
                    .removeClass( 'wz-prototype' )
                    .text( fullMessage.to[ i ].address )

            );

        }

    }else{
        $( '.receivers-to', contentReceivers ).hide();
    }

    if( fullMessage.cc.length ){

        $( '.receivers-cc', contentReceivers )
            .show()
            .children().not('.receivers-title, .wz-prototype')
                .remove();

        for( var i = 0; i < fullMessage.cc.length; i++ ){

            $( '.receivers-cc', contentReceivers ).append(

                $( '.receivers-cc .wz-prototype', contentReceivers ).clone()
                    .removeClass( 'wz-prototype' )
                    .text( fullMessage.cc[ i ].address )

            );

        }

    }else{
        $( '.receivers-cc', contentReceivers ).hide();
    }

    if( fullMessage.bcc.length ){

        $( '.receivers-cco', contentReceivers )
            .show()
            .children().not( '.receivers-title, .wz-prototype' )
                .remove();

        for( var i = 0; i < fullMessage.bcc.length; i++ ){

            $( '.receivers-cco', contentReceivers ).append(

                $( '.receivers-cco .wz-prototype', contentReceivers ).clone()
                    .removeClass( 'wz-prototype' )
                    .text( fullMessage.bcc[ i ].address )

            );

        }

    }else{
        $( '.receivers-cco', contentReceivers ).hide();
    }

};

var showMessage = function( message ){

    contentSubject.text( message.title );
    contentName.text( message.from.name );
    contentMail.text( message.from.address );

    message.markAsSeen( function( error ){

        if( error ){
            alert( error );
        }

        $('.account-' + message.accountId + '-box-' + message.path + '-message-' + message.id).removeClass('unread');
        mailsUnread( message.accountId , message.path );

    });

    contentColumn
        .removeClass()
        .addClass( 'message-' + message.id + ' right-column-content message-shown parent wz-fit' )
        .data( 'message', message );

    //contentMessage.height( 312 ); // To Do -> Automatizar esto

    // To Do -> Por ahora no podemos saber si un correo tiene attachments o no sin cargar el mensaje entero
    /*
    if( message.hasAttachments() ){
        contentColumn.addClass( 'attachments' );
    }else{
    */
        contentColumn.removeClass( 'attachments' );
    /*
    }
    */

    var messageDate = toDate( message.time.getTime() );

    if( messageDate.sentToday ){
        contentDate.text( lang.today + ' ' + messageDate.sentHour + ':' + messageDate.sentMinute );
    }else if( messageDate.sentYesterday ){
        contentDate.text( lang.yesterday + ' ' + messageDate.sentHour + ':' + messageDate.sentMinute );
    }else{
        contentDate.text( messageDate.sentDay + '/' + messageDate.sentMonth + '/' + messageDate.sentYear + ', ' + messageDate.sentHour + ':' + messageDate.sentMinute );
    }

    /*wql.changeOpened( [ message.id, $( '.mailbox.active', mailColumn ).data( 'id' ), $( '.account.display', mailColumn ).data( 'id' ) ] );*/

    contentMessageText.contents().find( 'body' ).empty();

    message.getFullMessage( function( error, fullMessage ){

        if( error ){
            alert( error );
            return;
        }

        if( fullMessage.isFlagged() ){
            contentStar.addClass( 'active' );
        }else{
            contentStar.removeClass( 'active' );
        }

        contentDisplay.css( 'display', 'block' );
        contentReplyMode.find('.reply-mode-reply-all').css( 'display', 'block' );
        contentMessageText.contents().find( 'body' ).html( _getBasicStyle() + fullMessage.message );

        if( !( /webkit/gi ).test( navigator.userAgent ) ){

            contentMessageText.contents().on( 'mousewheel', function( e, d, deltaX, deltaY ){
                contentMessage.trigger( 'mousewheel', [ d, deltaX, deltaY ] );
            });

        }

        contentMessageText
            .css( 'height', '' )
            .height( contentMessageText.contents().find( 'html' )[ 0 ].scrollHeight );

        contentMessageText.contents().find( 'html' )[ 0 ].scrollTop = 0;

        if( fullMessage.isSpam() ){
            $( '.reply-mode-spam', contentReplyMode ).css( 'display', 'none' );
        }else{
            $( '.reply-mode-spam', contentReplyMode ).css( 'display', 'block' );
        }

        showReceptors( fullMessage );

        contentColumn.data( 'message', fullMessage );

        if( fullMessage.hasAttachments() ){

            contentColumn.addClass( 'attachments' );
            attachments.children('.attachment').not( attachmentPrototype ).remove();

            var newAttachment;
            var attachmentsSize = 0;

            for( var i in fullMessage.attachments ){

                newAttachment = attachmentPrototype.clone().removeClass('wz-prototype');

                newAttachment.find('.name').text( fullMessage.attachments[ i ].name );
                newAttachment.find('.size').text( '(' + wz.tool.bytesToUnit( fullMessage.attachments[ i ].size ) + ')' );
                newAttachment.data( 'actions', fullMessage.attachments[ i ] );

                newAttachment.appendTo( attachments );

                attachmentsSize += fullMessage.attachments[ i ].size;

            }

            $('.content-attachments-title .stats').text( '(' + fullMessage.attachments.length + ' ' + ( fullMessage.attachments.length !== 1 ? lang.files : lang.file ) + ', ' + wz.tool.bytesToUnit( attachmentsSize ) + ')' );

        }else{
            contentColumn.removeClass('attachments');
        }

        var availableHeight = contentColumn.height();

        if( fullMessage.hasAttachments() && attachments.children('.attachment').not( attachmentPrototype ).size() < 3 ){

            attachments.height( 72 ); // To Do -> Automatizar esto

            availableHeight -= attachments.outerHeight( true );

        }else if( fullMessage.hasAttachments() && attachments.children('.attachment').not( attachmentPrototype ).size() >= 3 ){

            attachments.height( 104 ); // To Do -> Automatizar esto

            availableHeight -= attachments.outerHeight( true );

        }

        // To Do -> Seguro que podemos hacerlo con elementos en concreto y no con una búsqueda asi
        contentColumn.children().not('.wz-fit-ignore').not( contentMessage ).not( attachments ).each( function(){
            availableHeight -= $( this ).outerHeight( true );
        });

        contentMessage.outerHeight( availableHeight, true );

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
            messageSqueleton.find( '.message-date' ).text( messageDate.sentDay + '/' + messageDate.sentMonth + '/' + messageDate.sentYear.slice( -2 ) );
        }

        if( message.isFlagged() ){
            messageSqueleton.find( '.message-star' ).addClass( 'active' );
        }

        messagesColumn.find( '.message:last-child' ).remove();

    };
    */

var insertBox = function( boxObj, accountObj ){

    var boxes = accountObj.children().not('.wz-prototype, .syncing');

    if( boxes.find( '.box-' + _formatId( boxObj.data('path') ) ).length ){
        return;
    }

    accountObj.children('.syncing').remove();


    if( boxes.length === 0 ){
        accountObj.prepend( boxObj );
    }else{

        var inserted = false;

        boxes.each( function(){

            if( $( this ).data('order') > boxObj.data('order') ){

                $( this ).before( boxObj );
                inserted = true;
                return false;

            }else if( $(this).data('order') === boxObj.data('order') ){

                if( $(this).data('name').localeCompare( boxObj.data('name') ) > 0 ){

                    $( this ).before( boxObj );
                    inserted = true;
                    return false;

                }

            }

        });

        if( !inserted ){
            boxes.last().after( boxObj );
        }

    }

};

    var mailsUnread = function( accountId, path ){

        wz.mail.getCounters( accountId, path, function( error, object ){

            if( error ){
                return;
            }

            if( path === 'INBOX' ){
                mailColumn.find( '.account-' + accountId ).children('.bullet').text( object.unseen || '' );
            }

            mailColumn.find( '.account-' + accountId + '-box-' + path ).children('.bullet').text( object.unseen || '' );

        });

    };

    /*
    var showLastMessage = function(){

        console.log('not implemented');

        /*
        wql.getOpened( function( error, result ){

            if( error ){
                alert( error );
                return false;
            }

            if( !result.length ){
                wql.insertOpened();
                return false;
            }

            win.on( 'boxes-shown', function( e, elementId ){

                if( elementId == result[ 0 ].account ){

                    $( '.account-' + result[ 0 ].account, mailColumn ).click();
                    $( '.box-' + _formatId(result[0].box), mailColumn ).click();

                    win.off( e );

                }

            });

            win.on( 'messages-shown', function( e ){

                $( '.message-' + result[ 0 ].message, messagesColumn )
                    .addClass('selected last-selected')
                    .siblings('.message')
                        .removeClass('selected last-selected');

                wz.mail.getMessage( result[ 0 ].box, result[ 0 ].message, function( error, message ){
                    showMessage( message );
                });

                win.off( e );

            });

        });
        *//*

    };
    */

var translateUI = function(){

    $( '.new-mail span', mailZone ).text( lang.newEmail );
    $( '.add-account span', mailColumn ).text( lang.addAccount );
    $( '.content-attachments-title span', contentColumn ).not('.stats').text( lang.attachments );
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

};

var getOpenedAccount = function(){

    for( var i = 0; i < _accountList.length; i++ ){

        if( _accountList[ i ].id === _accountOpened ){
            return _accountList[ i ];
        }

    }

    return null;

};

win
.on( 'click', '.arrow-closed', function( e ){

    e.stopPropagation();

    $(this).removeClass('arrow-closed').addClass('arrow-opened');

    var childrenList = $(this).children('.children');
    var height = 0;

    childrenList.children().not('.wz-prototype').each( function(){
        height += $(this).outerHeight( true );
    });

    childrenList.height( height );

    if( !$(this).hasClass('account') ){
        $(this).parentsUntil('.account','.children').height( '+=' + height );
    }

})

.on( 'click', '.arrow-opened', function( e ){

    e.stopPropagation();
    $(this).removeClass('arrow-opened').addClass('arrow-closed');

    if( !$(this).hasClass('account') ){
        $(this).parentsUntil('.account','.children').height( '-=' + $(this).children('.children').height() );
    }

    $(this).children('.children').height( 0 );

})

.on( 'click', '.mailbox', function( e ){

    e.stopPropagation();

    _pageOpened = 0;

    openedAccount.text( $(this).parents('.account').children('span').text() );
    openedMailbox.text( $(this).children('span').text() );
    contentReceivers.removeClass('content-receivers-displayed');
    contentReplyMode.removeClass('reply-mode-displayed');
    mailColumn.find('.active').removeClass('active');

    if( !$(this).hasClass('noselect') ){

        showMailsList( $(this).parents('.account').data('id'), $(this).data('path') );
        $( this ).addClass('active');

    }

})

.on( 'click', '.message', function( e ){

    //e.stopPropagation();

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
        var finalRow = messages.index( messages.filter( '.last-selected' ) ); // To Do -> Tiene que ser un filter seguro? O un find?
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

     e.stopPropagation();

})


/*
    .on( 'click', 'input', function( e ){
        e.stopPropagation();
        contentReceivers.removeClass( 'content-receivers-displayed' );
        contentReplyMode.removeClass( 'reply-mode-displayed' );
    })
*/
.on( 'click', '.message-star', function( e ){

    e.stopPropagation();
    contentReceivers.removeClass('content-receivers-displayed');
    contentReplyMode.removeClass('reply-mode-displayed');

    if( $(this).hasClass('active') ){

        $(this).removeClass('active');

        $(this).parents('.parent').data('message').unmarkAsFlagged( function( error ){

            if( error ){
                alert( error );
            }

        });

    }else{

        $(this).addClass('active');

        $(this).parents('.parent').data('message').markAsFlagged( function( error ){

            if( error ){
                alert( error );
            }

        });

    }

})

.on( 'click', '.reply-mode-forward', function(){

    if( contentColumn.hasClass( 'message-shown' ) ){

        var info      = contentColumn.data('message');
        var account   = getOpenedAccount();
        var newSender = null;

        for( var i = 0; i < info.to.length && !newSender; i++ ){

            if( info.to[ i ].address === account.address ){
                newSender = account;
            }

        }

        for( var i = 0; i < info.cc.length && !newSender; i++ ){

            if( info.cc[ i ].address === account.address ){
                newSender = account;
            }

        }

        for( var i = 0; i < info.bcc.length && !newSender; i++ ){

            if( info.bcc[ i ].address === account.address ){
                newSender = account;
            }

        }

        if( !newSender ){
            newSender = account;
        }

        var toList     = info.to.map( function( item ){ return item.name + ' <span>&lt;' + item.address + '&gt;</span>'; });
        var ccList     = info.cc.map( function( item ){ return item.name + ' <span>&lt;' + item.address + '&gt;</span>'; });
        var newMessage = [

            '<br><br>',
            '---------- Forwarded message ----------<br>',
            '<b>From:</b> ' + info.from.name + ' <span>&lt;' + info.from.address + '&gt;</span><br>',
            '<b>Date:</b> ' + info.time.toString() + '<br>',
            toList.length ? '<b>To:</b> ' + toList.join(', ') + '<br>' : '',
            ccList.length ? '<b>CC:</b> ' + ccList.join(', ') + '<br>' : '',
            '<b>Subject:</b> ' + info.title + '<br>',
            '<br>',
            info.message

        ];

        wz.app.createView(

            {

                cc         : [],
                from       : newSender,
                message    : newMessage.join(''),
                references : info.references,
                subject    : info.title.indexOf('Fw') === 0 ? info.title : 'Fw: ' + info.title,
                time       : info.time,
                to         : []

            },
            'new'

        );

    }

})

.on( 'click', '.options-reply, .reply-mode-reply', function(){

    if( contentColumn.hasClass( 'message-shown' ) ){

        var info      = contentColumn.data('message');
        var account   = getOpenedAccount();
        var newSender = null;

        for( var i = 0; i < info.to.length && !newSender; i++ ){

            if( info.to[ i ].address === account.address ){
                newSender = account;
            }

        }

        for( var i = 0; i < info.cc.length && !newSender; i++ ){

            if( info.cc[ i ].address === account.address ){
                newSender = account;
            }

        }

        for( var i = 0; i < info.bcc.length && !newSender; i++ ){

            if( info.bcc[ i ].address === account.address ){
                newSender = account;
            }

        }

        if( !newSender ){
            newSender = account;
        }

        var toList     = info.to.map( function( item ){ return item.name + ' <span>&lt;' + item.address + '&gt;</span>'; });
        var ccList     = info.cc.map( function( item ){ return item.name + ' <span>&lt;' + item.address + '&gt;</span>'; });
        var newMessage = [

            '<br><br><hr>',
            '<blockquote><br>',
            '<b>From:</b> ' + info.from.name + ' <span>&lt;' + info.from.address + '&gt;</span><br>',
            '<b>Date:</b> ' + info.time.toString() + '<br>',
            toList.length ? '<b>To:</b> ' + toList.join(', ') + '<br>' : '',
            ccList.length ? '<b>CC:</b> ' + ccList.join(', ') + '<br>' : '',
            '<b>Subject:</b> ' + info.title + '<br>',
            '<br>',
            info.message,
            '</blockquote>'

        ];

        wz.app.createView(

            {

                cc         : [],
                from       : newSender,
                message    : newMessage.join(''),
                messageId  : info.messageId,
                references : info.references,
                subject    : info.title.indexOf('Re') === 0 ? info.title : 'Re: ' + info.title,
                to         : info.replyTo.length ? info.replyTo : [ info.from ]

            },
            'new'

        );

    }

})

.on( 'click', '.reply-mode-reply-all', function(){

    if( contentColumn.hasClass( 'message-shown' ) ){

        var info      = contentColumn.data('message');
        var account   = getOpenedAccount();
        var newSender = null;

        for( var i = 0; i < info.to.length && !newSender; i++ ){

            if( info.to[ i ].address === account.address ){
                newSender = account;
            }

        }

        for( var i = 0; i < info.cc.length && !newSender; i++ ){

            if( info.cc[ i ].address === account.address ){
                newSender = account;
            }

        }

        for( var i = 0; i < info.bcc.length && !newSender; i++ ){

            if( info.bcc[ i ].address === account.address ){
                newSender = account;
            }

        }

        if( !newSender ){
            newSender = account;
        }

        var toList = info.to.map( function( item ){ return item.name + ' <span>&lt;' + item.address + '&gt;</span>'; });
        var ccList = info.cc.map( function( item ){ return item.name + ' <span>&lt;' + item.address + '&gt;</span>'; });

        var newMessage = [

            '<br><br><hr>',
            '<blockquote><br>',
            '<b>From:</b> ' + info.from.name + ' <span>&lt;' + info.from.address + '&gt;</span><br>',
            '<b>Date:</b> ' + info.time.toString() + '<br>',
            toList.length ? '<b>To:</b> ' + toList.join(', ') + '<br>' : '',
            ccList.length ? '<b>CC:</b> ' + ccList.join(', ') + '<br>' : '',
            '<b>Subject:</b> ' + info.title + '<br>',
            '<br>',
            info.message,
            '</blockquote>'

        ];

        var newCc = info.to.concat( info.cc ).filter( function( item ){
            return item.address !== newSender.address;
        });

        wz.app.createView(

            {

                cc         : newCc,
                from       : newSender,
                message    : newMessage.join(''),
                messageId  : info.messageId,
                references : info.references,
                subject    : info.title.indexOf('Re') === 0 ? info.title : 'Re: ' + info.title,
                to         : info.replyTo.length ? info.replyTo : [ info.from ]

            },
            'new'

        );

    }

/*
        var newTo = ( info.replyTo || [ info.from ] ).concat( info.to ).filter( function( item ){
            return item.address !== newSender.address;
        }).filter( function( value, index, self ){
            return self.indexOf( value ) === index;
        });

        var newCc = info.cc.filter( function( item ){
            return item.address !== newSender.address;
        });

        wz.app.createView(

            {

                originalTo : info.to,
                to         : newTo,
                cc         : newCc,
                subject    : info.title,
                message    : info.message,
                reply      : true,
                time       : info.time,
                from       : newSender,
                references : info.references,
                messageId  : info.messageId

            },
            'new'

        );

    }

    /*
    var receivers = [];
    var cc        = [];
    var info      = contentColumn.data('message');

    receivers.push( info.from.address );

    for( var i = 0; i < info.to.length; i++ ){

        if( myAccount !== info.to[ i ].address ){
            receivers.push( info.to[ i ].address );
        }

    }

    for( var i = 0; i < info.cc.length; i++ ){

        if( myAccount !== info.cc[ i ].address ){
            cc.push( info.cc[ i ].address );
        }

    }
    */

})

.on( 'click', '.new-mail', function(){

    if( _accountList.length ){
        wz.app.createView( { from : getOpenedAccount() }, 'new' );
    }else{
        alert( lang.createAccountToSend );
    }

})
/*
    .on( 'click', '.options-spam.middle', function(){

        var messageSpamPrev = $( '.last-selected', messagesColumn ).prev().not('.wz-prototype, .middle-column-content-none');
        var messageSpamNext = $( '.last-selected', messagesColumn ).next();

        $( '.selected', messagesColumn ).each( function(){

            $( this ).data( 'message' ).moveToSpam( function( error ){

                if( error ){
                    return alert( error );
                }

                if( messageSpamPrev.size() ){
                    messageSpamPrev.click();
                }else if( messageSpamNext.size() ){
                    messageSpamNext.click();
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
                    return alert( error );
                }

                if( messageSpamPrev.size() ){
                    messageSpamPrev.click();
                }else if( messageSpamNext.size() ){
                    messageSpamNext.click();
                }

            });

        }

    })
    */

.on( 'click', '.options-trash.middle', function(){

    var messageTrashPrev = $( '.last-selected', messagesColumn ).prev().not('.wz-prototype, .middle-column-content-none');
    var messageTrashNext = $( '.last-selected', messagesColumn ).next();
    var messagesSelected = $( '.selected', messagesColumn );

    if( !messagesSelected.length ){
        return;
    }

    if( mailColumn.find( '.account-' + _accountOpened + '-box-' + _formatId( _boxOpened ) ).data('type') === 'trash' ){

        confirm( 'Hola Mundo', function( result ){ // To Do -> Traducir

            if( result ){

                messagesSelected.each( function(){

                    $( this ).data('message').remove( function( error ){

                        console.log( arguments );

                        if( error ){
                            return alert( error );
                        }

                        // To Do -> Esto tiene pinta de bucle excesivo
                        if( messageTrashPrev.size() ){
                            messageTrashPrev.click();
                        }else if( messageTrashNext.size() ){
                            messageTrashNext.click();
                        }

                    });

                });

            }

        });

    }else{

        messagesSelected.each( function(){

            $(this).data('message').moveToTrash( function( error ){

                if( error ){
                    return alert( error );
                }

                // To Do -> Esto tiene pinta de bucle excesivo
                if( messageTrashPrev.size() ){
                    messageTrashPrev.click();
                }else if( messageTrashNext.size() ){
                    messageTrashNext.click();
                }

            });

        });

    }

})

.on( 'click', '.options-trash.right', function(){

    var message          = contentColumn.data('message');
    var messageTrashPrev = $( '.last-selected', messagesColumn ).prev().not('.wz-prototype, .middle-column-content-none');
    var messageTrashNext = $( '.last-selected', messagesColumn ).next();

    // Si estamos en un la papelera o el mensaje pertenece a la papelera
    if( mailColumn.find( '.account-' + message.accountId + '-box-' + _formatId( message.path ) ).data('type') === 'trash' ){

        confirm( 'Hola Mundo', function( result ){ // To Do -> Traducir

            if( result ){

                contentColumn.data( 'message' ).remove( function( error ){

                    if( error ){
                        return alert( error );
                    }

                    if( messageTrashPrev.size() ){
                        messageTrashPrev.click();
                    }else if( messageTrashNext.size() ){
                        messageTrashNext.click();
                    }

                });

            }

        });

    }else{

        contentColumn.data( 'message' ).moveToTrash( function( error ){

            if( error ){
                return alert( error );
            }

            if( messageTrashPrev.size() ){
                messageTrashPrev.click();
            }else if( messageTrashNext.size() ){
                messageTrashNext.click();
            }

        });

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
    $( '.last-selected', messagesColumn ).prev().not('.wz-prototype, .middle-column-content-none').click();
})

.on( 'click', '.options-next.right', function(){
    $( '.last-selected', messagesColumn ).next().click();
})

.on( 'click', '.options-more', function( e ){

    if( contentColumn.hasClass( 'message-shown' ) ){

        e.stopPropagation();
        contentReplyMode.toggleClass('reply-mode-displayed');
        contentReceivers.removeClass('content-receivers-displayed');

    }

})

.on( 'click', '.content-origin-display', function( e ){

    console.log('content-origin-display');

    e.stopPropagation();

    contentReceivers.toggleClass('content-receivers-displayed');
    contentReplyMode.removeClass('reply-mode-displayed');

})

/*
    .on( 'click', '.right-column-content-receivers', function( e ){
        e.stopPropagation();
    })
*/

// Anterior página de mensajes
.on( 'click', '.middle-column-pages-prev', function(){

    if(_pageOpened <= 0){
        return;
    }

    _pageOpened--;

    showMailsList( _accountOpened, _boxOpened, _prevRequest );

})


// Siguiente página de mensajes
.on( 'click', '.middle-column-pages-next', function(){

    _pageOpened++; // To Do -> Uno se puede salir de rango

    showMailsList( _accountOpened, _boxOpened, _nextRequest );

})

/*
    // Oculta los desplegables de Receptores y Modos de respuesta
    .on( 'click', function(){

        contentReceivers.removeClass( 'content-receivers-displayed' );
        contentReplyMode.removeClass( 'reply-mode-displayed' );

    })
*/
.on( 'contextmenu', '.account-info, .mailbox-info', function(){

    var mailData = $(this).parents('.account').data('mail');
    var idData   = $(this).parents('.account').data('id');

    if( $(this).hasClass('account-info') ){

        wz.menu()
            .addOption( lang.createBox, function(){

                wz.mail( idData, function( error, account ){

                    // To Do -> Error
                    prompt( lang.createBox, function( input ){

                        input = ( input || '' ).trim();

                        if( !input ){
                            return;
                        }

                        wz.mail( idData, function( error, account ){

                            account.createBox( input, function( error ){

                                if( error ){
                                    return alert( error );
                                }

                            });

                        });

                    });

                });

            })
            .addOption( lang.renameAccount, function(){

                wz.mail( idData, function( error, account ){

                    // To Do -> Error
                    wz.app.createView( { cmd : 'rename', account : account }, 'account' );

                });

            })
            .addOption( lang.changeConfig, function(){

                wz.mail( idData, function( error, account ){

                    // To Do -> Error
                    wz.app.createView( { cmd : 'config', account : account }, 'account' );

                });

            })
            .addOption( lang.deleteAccount, function() {

                wz.mail.removeAccount( idData, function( error ){


                    if( error ){
                        return alert( error );
                    }

                    wz.banner()
                        .setTitle( lang.accountDeleted )
                        .setText( mailData + ' ' + lang.deleteSuccessful )
                        .setIcon( 'https://static.inevio.com/app/8/envelope.png' )
                        .render();

                });

            }, 'warning')
            .render();

    }else if( $(this).hasClass('mailbox-info') ){

        var boxInfo = $(this).parent().data();

        var menu = wz.menu()

        menu.addOption( lang.createNestedBox, function(){

            // To Do -> Error
            prompt( lang.createNestedBox, function( input ){

                input = ( input || '' ).trim();

                if( !input ){
                    return;
                }

                wz.mail.getBox( idData, boxInfo.path, function( error, box ){

                    input = box.path + box.delimiter + input;

                    wz.mail( idData, function( error, account ){

                        account.createBox( input, function( error ){

                            if( error ){
                                return alert( error );
                            }

                        });

                    });

                });

            });

        });

        if( boxInfo.path !== 'INBOX' ){

            menu.addOption( lang.renameBox, function(){

                prompt( 'Nuevo nombre', function( newName ){

                    newName = ( newName || '' ).trim();

                    if( !newName ){
                        return;
                    }

                    wz.mail.getBox( idData, boxInfo.path, function( error, box ){

                        newName = box.path.split( box.delimiter ).slice( 0, -1 ).concat( [ newName ] ).join( box.delimiter );

                        // To Do -> Error
                        box.rename( newName, function( error ){

                            if( error ){
                                alert( error );
                            }

                        });

                    });

                });

            });

            menu.addOption( lang.deleteBox, function(){

                confirm( 'Seguro?', function( accepted ){

                    if( !accepted ){
                        return;
                    }

                    wz.mail.getBox( idData, boxInfo.path, function( error, box ){

                        // To Do -> Error
                        box.delete( function( error ){

                            if( error ){
                                alert( error );
                            }

                        });

                    });

                });

            }, 'warning' );

        }

        menu.render();

    }

})

.on('wz-dragstart' , '.mailbox', function( e,drag ){

  var ghost = $(this).cloneWithStyle().css( {

                        margin : 0,
                        top    : 'auto',
                        left   : 'auto',
                        bottom : 'auto',
                        right  : 'auto'

  });

  drag.ghost(ghost);

})

.on('wz-dragstart' , '.message', function( e,drag ){


  //var ghost = messagePrototype.clone().removeClass( 'wz-prototype' );
  var ghost = $(this).cloneWithStyle().css( {

                        margin : 0,
                        top    : 'auto',
                        left   : 'auto',
                        bottom : 'auto',
                        right  : 'auto'

  } );

  drag.ghost(ghost);

})

.on( 'wz-dropenter', '.mailbox-info', function( e,file ){

  $(this).addClass('active');

})

.on( 'wz-dropleave', '.mailbox-info', function( e,file ){

  $(this).removeClass('active');

})

.on( 'wz-drop', '.wz-drop-area', function( e,item ){

  //console.log( item.data() );

  if( item.data().delimiter ){

    console.log('im a folder');

    /*if ( item.data().name ===  'Trash' ){
      item.data().delete( function( error ){
        console.log(error);
        return;
      });
      item.data().rename( 'Trash' , function(){

      });
    }*/

    /*console.log('Yo soy ' + item.data().path + ' y voy a ' + $(this).data().path);

    if( item.data().path === $(this).data().path ){
      return;
    }

    var boxDestino = $(this).data().path;
    console.log(boxDestino + '/' + item.data().name);
    item.data().rename( boxDestino + '/' + item.data().name, function( error ){
      console.log(error);
      //getAccounts();
    });*/

  }else{

    var boxOrigen = item.data('message').path;
    var boxDestino= $(this).parent().data().path;
    if( boxOrigen !== boxDestino){
      item.data('message').moveToBox(boxOrigen, boxDestino ,function(error){
        //console.log(error);
      });
    }

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

    if(
        target.size() &&
        ( target = target.next() ) &&
        target.size()
    ){
        target.trigger( e );
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

    e = jQuery.Event( 'click', { shiftKey : e.shiftKey } );

    if(
        target.size() &&
        ( target = target.prev().not('.wz-prototype, .middle-column-content-none') ) &&
        target.size()
    ){
        target.trigger( e );
    }else{
        messagesColumn.children(':not( .wz-prototype, .middle-column-content-none ):first' ).click();
    }

})

/*
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
                        alert( error );
                        return false;
                    }

                    // Limpiamos la columna
                    getMessagesInList().remove();

                    var messageList = [];

                    for( var i = 0, j = messages.length ; i < j ; i++ ){
                        messageList.push( _messageItem( messages[ i ] ) );
                    }

                    messagesColumn.append( messageList );

                });

            }else{

                wz.mail( _accountOpened, function( error, account ){

                    if( error ){
                        alert( error );
                        return false;
                    }

                    account.search( $( e.target ).val(), 'all', function( error, messages ){

                        if( error ){
                            alert( error );
                            return false;
                        }

                        // Limpiamos la columna
                        getMessagesInList().remove();

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

    .on( 'ui-view-resize-end', function(){
        wql.changeSize( [ win.width(), win.height() ] );
    });
*/

attachments.on( 'click', '.content-attachments-import', function(){

    $( this ).parent().data('actions').import( function(){
        console.log( arguments );
    });

    wz.banner()
        .setTitle( lang.startImport )
        .setText( $( this ).siblings('.name').text() )
        .setIcon( 'https://static.inevio.com/app/8/import.png' )
        .render();

});

addAccount.on( 'click', function(){
    wz.app.createView( null, 'hosting' );
});

wz.mail
.on( 'messageMarkedAsSeen', function( accountId, path, uid ){

    $( '.account-' + accountId + '-box-' + _formatId( path ) + '-message-' + uid, messagesColumn ).removeClass( 'unread' );
    mailsUnread( accountId, path );

})

.on( 'messageUnmarkedAsSeen', function( accountId, path, uid ){

    $( '.account-' + accountId + '-box-' + _formatId( path ) + '-message-' + uid, messagesColumn ).addClass( 'unread' );
    mailsUnread( accountId, path );

})

.on( 'messageMarkedAsFlagged', function( accountId, path, uid ){
    $( '.account-' + accountId + '-box-' + _formatId( path ) + '-message-' + uid, messagesColumn ).addClass( 'active' );
})

.on( 'messageUnmarkedAsFlagged', function( accountId, path, uid ){
    $( '.account-' + accountId + '-box-' + _formatId( path ) + '-message-' + uid, messagesColumn ).removeClass( 'active' );
})

    /*
    .on( 'messageRemoved', function( messageId, accountId ){

        $( '.message-' + messageId, messagesColumn ).remove();
        mailsUnread( accountId );

    })
    */

.on( 'mail-messageIn', function( accountId, path, uid, time, flags ){
  console.log('mail-messageIn');
})

.on( 'mail-messageOut', function( accountId, path, uid ){
  console.log('mail-messageOut');
})

.on( 'flagChanged' , function( accountId, path, uid, flags ){

  console.log('Cambio de flags: ');
  console.log(arguments);

  var title = "";

  //if( flags[0] === "/seen" )

  /*wz.banner()
                .setTitle( 'Texts - Exporting PDF...' )
                .setText( ' is being exported' )
                .setIcon( 'https://static.inevio.com/app/7/saved.png' )
                .render();*/

})

.on( 'messageIn', function( accountId, path, uid, time, flags, lmtp ){

    console.log('MessageIn: ');
    console.log(arguments);

    var title = 'Email movido';
    var text  = 'a: ' + path;

    if( lmtp === true ){

      title = 'Email recibido';
      text  = '';

    }

    wz.banner()
                  .setTitle( title )
                  .setText( text )
                  .setIcon( 'https://static.inevio.com/app/8/icon.png' )
                  .render();

    mailsUnread( accountId, path );

    // Check if the path is opened
    if( accountId !== _accountOpened || path !== _boxOpened ){
        return;
    }

    // Check if date is in the range
    var position;
    var messages = messagesColumn.find('.message').not('.wz-prototype');

    if( messages.length && time ){

        messages.each( function( index ){

            if( time > $(this).data('message').time.getTime() ){

                position = index;

                return false;

            }

        });

    }else{
        position = 0;
    }

    if( typeof position === 'undefined' ){
        return;
    }

    wz.mail.getMessage( accountId, path, uid, function( error, message ){

        if( error ){
            return;
        }

        // Check if the path is opened still
        if( accountId !== _accountOpened || path !== _boxOpened ){
            return;
        }

        // Check if date is still in the range
        var position;
        var messages = messagesColumn.find('.message').not('.wz-prototype');

        if( messages.length ){

            messages.each( function( index ){

                if( time > $(this).data('message').time.getTime() ){

                    position = index;

                    return false;

                }

            });

            if( typeof position === 'undefined' ){
                return;
            }

            messages.eq( position ).before( _messageItem( message ) );

            if( messages.length >= PAGINATION_LIMIT ){
                messagesColumn.find('.message').not('.wz-prototype').slice( PAGINATION_LIMIT )
            }

        }else{
            messagesColumn.append( _messageItem( message ) );
        }

    });

})

.on( 'messageOut', function( accountId, path, uid ){

  console.log('MessageOut: ');
  console.log(arguments);
  messagesColumn.find( '.account-' + accountId + '-box-' + _formatId( path ) + '-message-' + uid ).remove();

})

    /*
    .on( 'newMessage', function(){
        // To Do
    })
    */

.on( 'accountAdded', function( mailAccount ){

    addAccount.before( _accountItem( mailAccount ) );
    _accountList.push( mailAccount );

})

.on( 'accountRemoved', function( accountId ){

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

        wz.app.createView( null, 'hosting' );

    }

    $( '.account-' + accountId + '-message', messagesColumn ).remove();

})

/*
    .on( 'accountRemoveFinished', function( accountId ){
        $( '.account-' + accountId + '-message', messagesColumn ).remove();
    })
*/

.on( 'boxAdded', function( accountId, path ){

    var accountItem = $( '.account-' + accountId, mailColumn );

    if(
        !accountItem.length ||
        accountItem.find( '.account-' + accountId + '-box-' + _formatId( path ) ).length
    ){
        return;
    }

    wz.mail.getBox( accountId, path, function( error, box ){

        // To Do -> Error

        var parentPath = box.path.split( box.delimiter ).slice( 0, -1 ).join( box.delimiter );
        var parent;

        if( parentPath.length ){
            parent = accountItem.find( '.account-' + accountId + '-box-' + _formatId( parentPath ) );
        }else{
            parent = accountItem;
        }

        if( !parent.length ){
            return;
        }

        var newBox = _boxItem( box, accountItem.find('.mailbox.wz-prototype') );

        parent.children('.children').append( newBox );
        mailsUnread( accountId, path );

        var arrow = parent.children('.mailbox-info, .account-info').children('.arrow');

        if( parent.hasClass('hide-arrow') ){
            parent.removeClass('hide-arrow').addClass('arrow-closed');
        }

        if( parent.hasClass('arrow-opened') ){

            var childrenList   = parent.children('.children');
            var height         = 0;
            var originalHeight = childrenList.height();

            childrenList.children().not('.wz-prototype').each( function(){
                height += $(this).outerHeight( true );
            });

            childrenList.height( height );

            if( !parent.hasClass('account') ){
                parent.parentsUntil('.account','.children').height( '+=' + ( height - originalHeight ) );
            }

        }

    });

})

    /*
    .on( 'boxRemoved', function( boxId, accountId ){

        var boxItem     = $( '.account-' + accountId + '-box-' + _formatId(boxId), mailColumn );
        var accountItem = boxItem.parent();

        if( !boxItem.size() ){
            return false;
        }

        var size = 0;

        boxItem.siblings('.mailbox, span').not('.wz-prototype').each(function(){
            size += $(this).outerHeight( true );
        });

        boxItem.fadeOut( 150, function(){
            $( this ).remove();
        });

        accountItem.delay( 50 ).accountItem.stop().clearQueue().animate( { height : height }, 150 );

        mailsUnread( accountId );

    })

    .on( 'accountParamChanged', function( accountId, type, value ){

        if( type === 'description' ){
            $( '.account-' + accountId, mailColumn ).children( 'span' ).text( value );
        }

    });
*/

.on( 'accountParamsChanged', function( accountId, params ){

    if( typeof params.description === 'undefined' ){
        return;
    }

    mailColumn.find('.account-' + accountId ).children('span').text( params.description );

});


// Start App
/*console.log( wz.mail.getAccount( 264 , function (error){
  console.console.log(error);
}));*/

getAccounts();
translateUI();
