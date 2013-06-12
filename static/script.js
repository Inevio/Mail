
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

    var _accountOpened = 0;
    var _folderOpened  = 0;
    var _loadingMore   = false;

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
                .addClass( 'account-' + element.id )
                .data( {

                    mail : element.address,
                    id   : element.id

                } )
                .children( 'span' )
                .text( element.description );

        }

        item.find('.synchronizing span').text( lang.synchronizing );

        _accountItemBoxes( element, item );

        return item;

    };

    var _accountItemBoxes = function( element, item ){

        element.getBoxes( false, function( error, boxes ){

            if( error ){
                console.log( error );
                return false;
            }

            var boxPrototype = item.find( '.mailbox.wz-prototype' );
            var tmp          = null;

            for( var i in boxes ){

                if( i !== 'normal' && i !== 'allMail' ){
                    insertBox( _boxItem( boxes[ i ][ 0 ], boxPrototype ), item );
                }

            }

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

        return tmp;

    };

    var _messageItem = function( item ){

        var messageSqueleton = messagePrototype.clone();

        messageSqueleton
            .removeClass( 'wz-prototype' )
            .addClass( 'message-' + item.id )
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

    var isAccountOpened = function( id ){
        return id === _accountOpened;
    };

    var isBoxOpened = function( id ){
        return id === _folderOpened;
    };

    var messagesInList = function(){
        return messagesColumn.children().not( messagePrototype );
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

            _accountOpened = id;

            account.getMessagesFromBox( boxId, function( error, list ){

                if( error ){
                    console.log( error );
                    return false;
                }

                _folderOpened = boxId;

                // Limpiamos la columna
                messagesInList().remove();

                var messageList = [];

                for( var i = 0, j = list.length ; i < j ; i++ ){
                    messageList.push( _messageItem( list[ i ] ) );
                }

                messagesColumn.append( messageList );

                // Nullify
                messageList = messageSqueleton = null;

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

    var insertBox = function( boxObj, accountObj ){

        var boxes = accountObj.children().not('.wz-prototype, .synchronizing');

        if( boxes.filter( '.box-' + boxObj.data('id') ).size() || boxes.filter( '.' + boxObj.data('type') ).size() ){
            return false;
        }

        accountObj.children('.synchronizing').remove();

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

    .on( 'mousewheel', '.middle-column-content-scroll', function( e ){

        if( !_loadingMore && ( this.offsetHeight * 1.5 ) + this.scrollTop > this.scrollHeight ){

            _loadingMore = true;

            var nowAccount = _accountOpened;
            var nowFolder  = _folderOpened;

            wz.mail( _accountOpened, function( error, account ){

                var size = messagesColumn.children().not('.wz-prototype').size();

                account.getMessagesFromBox( nowFolder, 20, parseInt( size / 20, 10 ), function( error, list ){

                    if( error ){
                        _loadingMore = false;
                        return false;
                    }

                    var messageList = [];

                    for( var i = 0, j = list.length ; i < j ; i++ ){
                        messageList.push( _messageItem( list[ i ] ) );
                    }

                    messagesColumn.append( messageList );
                    
                    _loadingMore = false;

                });

            });
           
        }

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

    .on( 'mail-messageIn', function( e, accountId, message, boxId, boxType ){

        if(

            ( !isAccountOpened( 'common' ) || !isBoxOpened( boxType ) ) &&
            ( !isAccountOpened( accountId ) || !isBoxOpened( boxId ) )

        ){
            return false;
        }

        var item = _messageItem( message );
        var list = messagesInList();

        var inserted = false;

        list.each( function( index ){

            if( $( this ).data('message-time') < message.time ){

                $( this ).before( _messageItem( message ) );

                inserted = true;

                return false;

            }

        });

        if( !inserted ){
            messagesColumn.append( _messageItem( message ) );
        }

    })

    .on( 'mail-messageOut', function( e, accountId, messageId, boxId ){
        messagesColumn.children( '.account-' + accountId + '-message-' + messageId ).remove();
    })

    .on( 'mail-newMessage', function( e, message ){
        console.log( message, arguments );
    })

    .on( 'mail-accountAdded', function( e, mailAccount ){
        getAccounts();
    })

    .on( 'mail-accountRemoved', function( e, accountId ){
        
        $( '.account-' + accountId, mailColumn ).transition( { height : 0 }, 150, function(){
            $( this ).remove();
        });

        if( $( '.account', mailColumn ).size() - 1 === 1 ){

            $( '.account', mailColumn ).transition( { height : 0 }, 150, function(){
                $( this ).remove();
            });
            
        }

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
            accountItem.animate( { height : '+=' + boxItem.outerHeight( true ) }, 150 );
        }

    })

    .on( 'mail-boxRemoved', function( e, boxId, accountId ){

        var boxItem     = $( '.account-' + accountId + '-box-' + boxId, mailColumn );
        var accountItem = boxItem.parent();

        if( !boxItem.size() ){
            return false;
        }

        boxItem.fadeOut( 150, function(){
            $( this ).remove();
        });

        accountItem.delay( 50 ).animate( { height : '-=' + boxItem.outerHeight( true ) }, 150 );

    })

    .key( 'down', function(){

        var target = messagesColumn.children('.selected');

        if( target.size() ){

            target = target.next();

            if( target.size() ){
                target.click();
            }

        }else{
            messagesColumn.children(':not(.wz-prototype):first').click();
        }

    })

    .key( 'up', function(){

        var target = messagesColumn.children('.selected');

        if( target.size() ){

            target = target.prev().not('.wz-prototype');

            if( target.size() ){
                target.click();
            }

        }else{
            messagesColumn.children(':not(.wz-prototype):first').click();
        }

    });

    addAccount
    .on( 'click', function(){
        wz.app.createWindow( 8, null, 'hosting' );
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
