
    var win = $( this );
    var account = null;
    var content = $( '.content', win );
    var email = '';
    var pass = '';
    var name = '';
    var description = '';
    var username = '';
    var inHost = '';
    var inPort = 0;
    var inProtocol = '';
    var inSecure = false;
    var outHost = '';
    var outPort = 0;
    var outSecure = false;
    var mailExpresion = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,4}))$/;

    $( '.name', content ).find( 'input' ).val( wz.system.user().fullName );
    $( '.mail', content ).find( 'input' ).focus();

    var finish = function(){

        wz.view.remove();
        wz.banner()
          .setTitle( lang.accountAdded )
          .setText( email + ' ' + lang.beenAdded )
          .setIcon( 'https://static.inevio.com/app/8/envelope.png' )
          .render();

    };

    win
    .on( 'click', '.next', function(){

        email = $( '.mail', content ).find( 'input' ).val();
        pass  = $( '.pass', content ).find( 'input' ).val();
        name  = $( '.name', content ).find( 'input' ).val();

        if( mailExpresion.test( email ) && pass && name ){

          wz.mail.addAccount(

              {
                  address     : email,
                  name        : name,
                  password    : pass,
                  autoConfig  : true
              },

              function( error, details ){

                  console.log(arguments);
                  if( error ){
                      //alert( lang.error );
                      alert(error);
                  }else{
                      finish();
                  }

              }

          );

        }else if( !mailExpresion.test( email ) ){
            alert( lang.mailError );
        }else if( !pass ){
            alert( lang.passwordError );
        }else if( !name ){
            alert( lang.nameError );
        }

    })

    .key( 'enter', function( e ){

        if( $( e.target ).is( 'input' ) ){
            $( 'button', win ).click();
        }

    });

    $( '.wz-view-menu span', win ).text( lang.addAccount );
    $( '.description', win ).text( lang.accountAddress );
    $( '.name span', win ).text( lang.name + ':' );
    $( '.mail span', win ).text( lang.address + ':' );
    $( '.pass span', win ).text( lang.password + ':' );
    $( '.next', win ).children('span').text( lang.next );

    if( params ){

        if( params.cmd === 'rename' ){
            whichName();
        }else{
            moreData();
        }

    }
