$(function() {
  /* お問い合わせフォームのGAS連動とバリデーション */
  function setMyForm(target){
    console.log('setMyForm');
    var ERROR_MESSAGE_CLASSNAME = 'errorMsg'; //エラー時のメッセージ要素のclass名
    var ERROR_INPUT_CLASSNAME = 'errorInput'; //エラー時のinput要素のclass名
    var errorCount = 0;
    var submitWrap = $('#submit');
    var submitButton = $('#submitButton input');
    var items = []; //チェック対象となるテキスト入力要素を格納した配列

    //項目チェックする
    var checkAll = function(){
      errorCount = 0;

      //input,textareaのチェック
      for( var i=0; i<items.length; i++ ){
        if( items[i].prop('isSuccess') == false ){
          errorCount++;
          console.log('error:' + i);
        };
      };

      if( errorCount == 0 ){
      }else{
      };
    };

    //エラーメッセージの追加
    var addErrorMessage = function(selector, msg){
      removeErrorMessage(selector);
      selector.parent('div').append('<span class="attention '+ERROR_MESSAGE_CLASSNAME+'">'+msg+'</span>');
      selector.addClass(ERROR_INPUT_CLASSNAME);
    };

    //エラーメッセージの削除
    var removeErrorMessage = function(selector){
      var msgSelector = selector.parent().parent('div').find('.'+ERROR_MESSAGE_CLASSNAME);
      if( msgSelector.length != 0 ){
        msgSelector.remove();
        selector.removeClass(ERROR_INPUT_CLASSNAME);
      };
    };

    //input,textareaの未入力チェック
    var checkEmptyText = function(selector, msg){
      if( selector.val() == '' ||  selector.val() == null){
        addErrorMessage(selector, msg);
        selector.prop('isSuccess', false);
      }else{
        removeErrorMessage(selector);
        selector.prop('isSuccess', true);
      };
    };

    var emptyThrough = function(selector){
      if( selector.val() == '' ||  selector.val() == null){
        removeErrorMessage(selector);
        selector.prop('isSuccess', true);
      }
    };

    //radioの未入力チェック
    var checkRadioBox = function(selector, msg){
      if( selector.prop("checked")){
        removeErrorMessage(selector);
        selector.prop('isSuccess', true);
      }else{
        addErrorMessage(selector, msg);
        selector.prop('isSuccess', false);
      };
    };

    //文字列のフォーマットチェック
    function checkFormatText(selector, _mode, msg){
      var value = selector.val();
      switch(_mode){
        //全角のみ
        case 0:
          if(value.match(/^[^ -~｡-ﾟ]*$/)){
            selector.prop('isSuccess', true);
            removeErrorMessage(selector);
          }else{
            selector.prop('isSuccess', false);
          };
          break;
        //ふりがなのみ
        case 1:
          if(value.match(/^[\u3040-\u309F]+$/)){
            selector.prop('isSuccess', true);
          }else{
            selector.prop('isSuccess', false);
          };
          break;
        //半角数字のみ
        case 2:
          if(value.match(/^[0-9\-]+$/)){
            selector.prop('isSuccess', true);
          }else{
            selector.prop('isSuccess', false);
          };
          break;
        //メールアドレスかどうか
        case 3:
          if(value.match(/^[a-zA-Z0-9!$&*.=^`|~#%'+\/?_{}-]+@([a-zA-Z0-9_-]+\.)+[a-zA-Z]{2,6}$/)){
            selector.prop('isSuccess', true);
          }else{
            selector.prop('isSuccess', false);
          };
          break;
        //カタカナのみ
        case 4:
          if(value.match(/^[\u30A0-\u30FF]+$/) || value.match(/^[\uFF61-\uFF9F]+$/)){
            selector.prop('isSuccess', true);
          }else{
            selector.prop('isSuccess', false);
          };
          break;
        //全てエラーにする
        case 5:
          selector.prop('isSuccess', false);
          break;
      };
      if( selector.prop('isSuccess') == false ){
        addErrorMessage(selector, msg);
      }else{
        removeErrorMessage(selector);
      };
    };

    //初期設定
    var init = function(){
      //submitイベントの設定
      target.on({
        'submit': function(){
          checkAll();
        }
      });
      //input要素を配列に格納
      items = [
        target.find('input[name="yourname"]'), //0 お名前
        target.find('input[name="userphone"]'), //1 電話番号
        target.find('input[name="usermail"]'), //2 メールアドレス
        target.find('input[name="usermail2"]'), //3 メールアドレス確認用
        target.find('textarea[name="contents"]'), //4 ご相談内容
        target.find('input[name=agreement]'), //5 プラポリへの合意
      ];
      //input要素のプロパティを設定
      $.each(items, function(index){
        items[index].prop('isSuccess', false);
      });

      //enterキーでsubmitしてしまうのを防止する
      target.find('input[type=text]').on({
        'keypress': function(e){
          if( (e.keyCode == 13) ) return false;
        }
      });
      //0 お名前
      items[0].on({
        'blur': function(){
          checkEmptyText( items[0], '※お名前を入力してください。' );
          checkAll();
        }
      });

      //1 電話番号
      items[1].prop('isSuccess', true);

      //2 メールアドレス
      items[2].on({
        'blur': function(){
          checkEmptyText( items[2], '※メールアドレスをご入力ください。' );
          if( items[2].prop('isSuccess') ) checkFormatText( items[2], 3, 'アドレスの形式をご確認ください' );
          checkAll();
        }
      });

      //3 メールアドレス(確認用)
      items[3].on({
        'blur': function(){
          checkEmptyText( items[3], '※確認用メールアドレスは必須です。');
          if( items[3].prop('isSuccess') ){
            checkFormatText( items[3], 3, '※確認用メールアドレスの形式をご確認ください' );
            if(items[2].val() != items[3].val()){
              checkFormatText( items[3], 5, '※メールアドレスが一致しません。' );
            }
          }

          checkAll();

        }
      });

      //4 ご相談内容
      items[4].on({
        'blur': function(){
          checkEmptyText( items[4], '※ご相談内容を入力してください。' );
          checkAll();
        }
      });

      //5 プラポリへの合意
      items[5].prop('isSuccess', true);

      items[5].on({
        'change': function(){
          var agreeState = $('input[name=agreement]:checked').val();
          if(agreeState == 1){
            $('#submitButton').removeClass('disabled');
          }else{
            $('#submitButton').addClass('disabled');
          }
        }
      });

      submitButton.on({
        'click': function(){
          checkEmptyText( items[0], '※お名前を入力してください。' );
          checkEmptyText( items[2], '※メールアドレスをご入力ください。' );
          if( items[2].prop('isSuccess') ) checkFormatText( items[2], 3, 'アドレスの形式をご確認ください' );
          checkEmptyText( items[3], '※確認用メールアドレスは必須です。');
          if( items[3].prop('isSuccess') ){
            checkFormatText( items[3], 3, '※確認用メールアドレスの形式をご確認ください' );
            if(items[2].val() != items[3].val()){
              checkFormatText( items[3], 5, '※メールアドレスが一致しません。' );
            }
          }
          checkEmptyText( items[4], '※ご相談内容を入力してください。' );
          items[1].prop('isSuccess', true);
          checkAll();
          if( errorCount == 0 ){
            processOrderContent();
          }else{
            alert('入力内容に不備があります。入力内容を確認いただき、再度送信ボタンを押してください。');
            var scrollHeight = $('#contact').offset().top;
            $("html, body").animate({
              scrollTop: scrollHeight
            }, 300);
          };
        }
      })
    };

    function processOrderContent(){
      $('#submitButton').addClass('disabled');
      $('#ajaxLoader').addClass('loading');
      var domain = location.protocol + '//' + location.host + '/';
      var formdata = new FormData($('#formWrapper').get(0));
      console.log('formdata:' + formdata);
      /* url  : "https://unibio.jp/mail.php",*/
      $.ajax({
          url : "https://demo.noske.design/unibio/form/mail.php",
          type : "POST",
          data : formdata,
          cache       : false,
          contentType : false,
          processData : false,
          dataType    : "html"
      })
      .done(function(data, textStatus, jqXHR){
        setTimeout(function() {
          $('#ajaxLoader').removeClass('loading');
          $('#statusMessage').addClass('complete').html('<span class="text">メッセージは送信されました。<br>自動返信メールをご確認ください。</span>');
          setTimeout(function() {
            /*location.href = domain;*/
          }, 2000);
        }, 1000);
      })
      .fail(function(jqXHR, textStatus, errorThrown){
        $('#ajaxLoader').removeClass('loading');
        $('#statusMessage').addClass('complete').html('<span class="text">メッセージは送信されました。<br>自動返信メールをご確認ください。</span>');
        setTimeout(function() {
          /*location.href = domain;*/
        }, 2000);
      });
  }

    init();

  };

    setMyForm($('#contactForm'));
});
