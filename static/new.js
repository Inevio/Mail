
// Variables
var win                 = $( this );
var content             = $('.content');
var mailExpresion       = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,4}))$/;
var attachments         = $('.content-attachments');
var attachmentPrototype = $('.attachment.wz-prototype');
var attachmentsList     = [];

var toolButton          = $('.tool-button');
var boldButton          = $('.tool-button-bold');
var italicButton        = $('.tool-button-italic');
var underlineButton     = $('.tool-button-underline');
var leftButton          = $('.tool-button-left');
var centerButton        = $('.tool-button-center');
var rightButton         = $('.tool-button-right');
var justifyButton       = $('.tool-button-justify');
var unsortedButton      = $('.tool-button-list-unsorted');
var sortedButton        = $('.tool-button-list-sorted');
var fontfamilyDropdown  = $('.tool-fontfamily');
var fontsizeDropdown    = $('.tool-fontsize');
var colorButton         = $('.tool-button-color');

var FONTFAMILY  = [ 'Arial', 'Cambria', 'Comic Sans MS', 'Courier', 'Helvetica', 'Times New Roman', 'Trebuchet MS', 'Verdana' ];
var FONTSIZE    = [ 1, 2, 3, 4, 5, 6, 7];

var DROPDOWN_FONTFAMILY = 0;
var DROPDOWN_FONTSIZE   = 1;
var DROPDOWN_COLOR      = 2;
var DROPDOWN            = [ FONTFAMILY, FONTSIZE];
var DROPDOWN_CLASS      = [ 'active-fontfamily', 'active-fontsize'];

var toolsListContainer  = $('.toolbar-list-container');
var toolsList           = $('.toolbar-list');
var toolsColorContainer = $('.toolbar-color-picker-container');
var toolsColor          = $('.toolbar-color-picker');
var toolsColorHover     = $('.toolbar-color-picker-hover');
var toolsColorColor     = $('.tool-button-color .color');

var lastDropdownActive  = -1;
var dropdownActive      = -1;
var cached              = [];
var fontfamilyActive    = FONTFAMILY[1];
var fontSizeActive      = FONTSIZE[2];


// Functions

var changeValue = function(type,value){

  if(type === "fontfamily"){

    fontfamilyActive=value;
    _window.document.execCommand("fontName",false,value);
    fontfamilyDropdown.text(fontfamilyActive);

  }else if(type === "fontsize"){

    fontSizeActive=value;
    _window.document.execCommand("fontSize",false,value);
    fontsizeDropdown.text(fontSizeActive);

  }

  else if(type === "color"){

    _window.document.execCommand("foreColor",false,value);

  }

}


var hideDropdowns = function(){

  //console.log(dropdownActive);

  lastDropdownActive = dropdownActive;

  if( dropdownActive === -1 ){
      return;
  }

  dropdownActive = -1;

  toolsList.removeClass( DROPDOWN_CLASS.join(' ') );
  toolsColor.removeClass('active-color');
  toolsListContainer.hide();
  toolsColorContainer.hide();

}

var showDropdown = function(type, origin){

  hideDropdowns();

  origin         = $( origin );
  dropdownActive = type;

  var position = ['134px','188px'];

  if( type === DROPDOWN_FONTFAMILY || type === DROPDOWN_FONTSIZE  ){

    if( !cached[ type ] ){

      cached[ type ] = '';

      for( var i = 0; i < DROPDOWN[ type ].length; i++ ){
        cached[ type ] += '<li data-value="' + ( DROPDOWN[ type ][ i ] ) + '"><i></i><span>' + DROPDOWN[ type ][ i ] + '</span></li>';
      }

    }



    if(type === DROPDOWN_FONTFAMILY){
      position = ['134px','91px'];
    }

    toolsList
      .addClass( DROPDOWN_CLASS[ type ] )
      .html( cached[ type ] );

    toolsListContainer
      .css({

        //top     : origin.position().top + origin.outerHeight(),
        //left    : origin.position().left,
        top       : position[0],
        left      : position[1],
        display   : 'block'

      });
    if(type === DROPDOWN_FONTFAMILY){
      toolsList.find('[data-value="' + fontfamilyActive +'"]').addClass('active');
    }else{
      toolsList.find('[data-value="' + fontSizeActive +'"]').addClass('active');
    }
    //toolsList.find('[data-value="' + ( type === DROPDOWN_LINESPACING ? origin.attr('data-value') : origin.text() ) + '"]').addClass('active');

  }else if( type === DROPDOWN_COLOR ){

    position = ['134px', '321px'];

    toolsColor.addClass('active-color');

    toolsColorContainer
      .css({

        //top     : origin.position().top + origin.outerHeight(),
        //left    : origin.position().left,
        top       : position[0],
        left      : position[1],
        display : 'block'

      });

  }

};



var loadAccountList = function(){

    wz.mail.getAccounts( function( error, accounts ){

        var optionProto = $('.content-from option.wz-prototype');

        for( var i = 0, j = accounts.length; i < j; i++ ){

            if( accounts[ i ].inProtocol === 'common' ){
                continue;
            }

            optionProto
                .clone()
                .removeClass('wz-prototype')
                .text( accounts[ i ].address )
                .data( 'account', accounts[ i ] )
                .appendTo( $('.content-from select') );

        }

        optionProto.remove();

        if( !params || !params.from ){
            return;
        }

        $('.content-from select option').each( function(){

            if( $(this).text() === params.from.address ){
                $(this).prop( 'selected', true );
                return false;
            }

        });

    });

};

var loadParams = function(){

    if( !params.messageId ){
        $('.content-to input').focus();
        return;
    }

    // To Do -> Add the name of the contact
    var to = params.to.map( function( item ){
        return item.address;
    });

    // To Do -> Add the name of the contact
    var cc = params.cc.map( function( item ){
        return item.address;
    });

    $('.content-subject input').val( params.subject );
    $('.content-to input').val( to.join(', ') );
    $('.content-cc input').val( cc.join(', ') );
    $('.content-compose').html( params.message );

    if( to.length ){
        $('.content-compose').focus();
    }else{
        $('.content-to input').focus();
    }

    if( params.cc.length ){
        $('.show-cc').click();
    }

    if( params.messageId ){
        params.references.push( params.messageId );
    }

};

var translateUi = function(){

    $('.wz-view-menu span').text( lang.newEmail );
    $('.content-to span').append( lang.to + ':' );
    $('.content-subject span').text( lang.subject + ':' );
    $('.content-from span').text( lang.from + ':' );
    $('.content-send span').text( lang.send );
    //$('.content-attachments-title span').not( '.stats' ).text( lang.attachments );
    $('.content-attachments-delete').text( lang.delete );
    $('.content-add-attachments span').text( lang.attachFile );

};





// Events
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
                    inReplyTo   : params.messageId || null,
                    references  : params.references,
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

    .on('click','.active-fontfamily li',function(){

      var value = $(this).text();
      changeValue('fontfamily',value);
      hideDropdowns();

    })


    .on('click','.active-fontsize li',function(){

      var value = $(this).text();
      changeValue('fontsize',value);
      hideDropdowns();

    })

    .on('mousedown',function(){
      hideDropdowns();
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

    toolsList
    .on( 'mousedown', function( e ){
        e.stopPropagation();
    })

    toolButton.on( 'mousedown' , function(e){
      e.preventDefault();
    });

    boldButton.on( 'click' , function(){

      _window.document.execCommand('bold', false, null);

    });

    italicButton.on( 'click' , function(){

      _window.document.execCommand('italic', false, "");

    });

    underlineButton.on( 'click' , function(){

      _window.document.execCommand('underline', false, null);

    });

    leftButton.on( 'click' , function(){

      _window.document.execCommand('justifyleft', false, null);

    });

    centerButton.on( 'click' , function(){

      _window.document.execCommand('justifycenter', false, null);

    });

    rightButton.on( 'click' , function(){

      _window.document.execCommand('justifyright', false, null);

    });

    justifyButton.on( 'click' , function(){

      _window.document.execCommand('justifyfull', false, null);

    });

    unsortedButton.on( 'click' , function(){

      _window.document.execCommand('insertunorderedlist', false, null);

    });

    sortedButton.on( 'click' , function(){

      _window.document.execCommand('insertorderedlist', false, null);

    });

    fontfamilyDropdown.on('click', function(){

      if( lastDropdownActive !== DROPDOWN_FONTFAMILY ){
        showDropdown( DROPDOWN_FONTFAMILY, this );
      }

    });

    fontsizeDropdown.on('click', function(){

      if( lastDropdownActive !== DROPDOWN_FONTSIZE ){
        showDropdown( DROPDOWN_FONTSIZE, this );
      }

    });

    colorButton.on('click', function(){

      if( lastDropdownActive !== DROPDOWN_COLOR ){
        showDropdown( DROPDOWN_COLOR, this );
      }

    });

    toolsColor
    .on( 'mousedown', function( e ){
        e.stopPropagation();
    })

    .on( 'mouseenter', 'td', function(){

        var pos = $(this).position();

        // To Do -> Existe un problema con las tablas entre distintos navegadores.
        //          Firefox indica la posición de la celda sin contar los bordes (solo el contenido)
        //          Chrome si tiene en cuenta los bordes
        //          Ver posibles soluciones o ver si lo han arreglado en futuras release de jQuery

        /*if( BROWSER_TYPE === BROWSER_FIREFOX ){

            pos.top  = pos.top - parseInt( toolsColorHover.css('border-top-width'), 10 );
            pos.left = pos.left - parseInt( toolsColorHover.css('border-left-width'), 10 );

        }*/

        toolsColorHover.css({

            //'background-color' : normalizeColor( $(this).css('background-color') ),
            'background-color' :  $(this).css('background-color') ,
            top                : pos.top,
            left               : pos.left

        });

    })

    toolsColorHover.on( 'click', function(){

      if( dropdownActive === DROPDOWN_COLOR  ){

          changeValue('color', toolsColorHover.css('background-color'));

          toolsColorColor
              //.attr( 'data-tool-value', normalizeColor( toolsColorHover.css('background-color') ) )
              //.css( 'background-color', normalizeColor( toolsColorHover.css('background-color') ) )
              .attr( 'data-tool-value', toolsColorHover.css('background-color') )
              .css( 'background-color', toolsColorHover.css('background-color') )
              .click();

      }

      hideDropdowns();

  });


// Start
translateUi();
loadAccountList();
loadParams();
changeValue('fontfamily',fontfamilyActive);
changeValue('fontsize',fontSizeActive);
_window.document.execCommand("styleWithCss",false,true);
_window.document.getElementsByClassName('content-compose').designMode = 'On';
