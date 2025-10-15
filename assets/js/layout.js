$(function() {
  console.log('layout.js');
  // タブレットレイアウトをPCと統一
  var metaDiscre = document.head.children;
  var metaLength = metaDiscre.length;
  if(window.outerWidth > 700 && window.outerWidth < 1200){
    for(var i = 0;i < metaLength;i++){
       var proper = metaDiscre[i].getAttribute('name');
        if(proper === 'viewport'){
          var dis = metaDiscre[i];
          dis.setAttribute('content','width=1200');
        }
    }
  }

  $(window).on('load', function() {
	   const url = $(location).attr('href'),
	   headerHeight = 100;

     if(url.indexOf("#") != -1){
       const anchor = url.split("#"),
       target = $('#' + anchor[anchor.length - 1]),
		   position = Math.floor(target.offset().top) - headerHeight;
		   $("html, body").animate({scrollTop:position}, 500);
	   }
  });


  // 回転するカード
  function cardFlipAction(target){

    var cardButton = [];
    var flipState = [];

    function flipAction(e){
      if(flipState[e] == 0){
        cardButton[e].addClass('flipped');
        flipState[e] = 1;
      }else{
        cardButton[e].removeClass('flipped');
        flipState[e] = 0;
      }
    }

    function init(){
      $.each(target.find('button'), function(index) {
        cardButton[index] = $(this);
        flipState[index] = 0;
        cardButton[index].on({
          'click': function() {
            flipAction(index);
          }
        });
      });
    }

    init();

  }

  if (document.getElementById('flipCard')) {
    cardFlipAction($('#flipCard'));
  }

  // 目次ボタン
  function indexAnker(target){
    var ankerButton = [];
    var scrollTarget = [];

    var pagetopButtton = $('#pagetopButtton');

    function windowMove(e) {
      var headerHeight = $('header').outerHeight();
      var scrollHeight = $(scrollTarget[e]).offset().top;
      var adScroll = scrollHeight;
      $("html, body").animate({
        scrollTop: adScroll
      }, 500);
    }


    function init(){
      target.find('button').each(function(index) {
        console.log('index')
        ankerButton[index] = $(this);
        scrollTarget[index] = $(this).attr('jump');
        ankerButton[index].on({
          'click': function() {
            windowMove(index);
          }
        });
      });

      pagetopButtton.on({
        'click': function() {
          $("html, body").animate({
            scrollTop: 0
          }, 500);
        }
      });




    }

    init();

  }

  if (document.getElementById('ankerButton')) {
    indexAnker($('#ankerButton'));
  }

  if (document.getElementById('fixedCartButton')) {
    indexAnker($('#fixedCartButton'));
  }

  //トップに戻るボタン + スクロール + ウィンドウサイズ系の対策処理
  function scrollAnimationSet(target) {
    const scButtonWrap = $('#scrollTopWrap');
    const indexProducts = document.getElementById("indexProducts");
    const position = document.documentElement;
    let wHeight = window.innerHeight;
    let preSetWidth = window.innerWidth;
    let scrollCount = 0;

    function setHeightProperty() {
      wHeight = window.innerHeight;
      position.style.setProperty('--wHeight', window.innerHeight);
      position.style.setProperty('--wHeightPx', window.innerHeight + 'px');
      position.style.setProperty('--scroll', window.scrollY);
      requestAnimationFrame(setHeightProperty);

      $(".effect").each(function() {
        var imgPos = $(this).offset().top;
        var scroll = $(window).scrollTop();
        var windowHeight = $(window).height();
        if (scroll > imgPos - windowHeight + windowHeight / 7) {
          $(this).removeClass('effect');
        };
      });

    }

    function setProperties() {
      setHeightProperty();
    }

    function init() {
      /*const scrollButton = document.querySelector('#returnTop');
      scrollButton.addEventListener( 'click' , scrollTop );*/
      function scrollTop(){
        window.scroll({top: 0, behavior: 'smooth'});
      };
      var timer = false;
      setProperties();
      position.style.setProperty('--wHeightFixedPx', window.innerHeight + 'px');
      setProperties();
    }

    init();

  }

  scrollAnimationSet($('article'));

  // 詳細ポップアップの出力
  function detailPopOpen(target){
    var profileBg = $('#detailPop');
    var profileInner = $('#detailInner');
    var profileClose = $('#detailClose');
    var modalState = 0;
    var modalBtn = [];
    var modalURL = [];
    var current_scrollY;

    function removeModal(){
      target.removeClass('open');
      $('body').removeClass('fixed');
      $('body').attr('style', '');
      $('html, body').prop({scrollTop: current_scrollY});
      setTimeout(function() {
        target.addClass('loading');
        target.find('div').scrollTop(0);
        $('.detail_inner').css({'display': 'none'});
      }, 500);
    }

    function openModal(e){
      current_scrollY = $(window).scrollTop();
      $('body').css({
        position: 'fixed',
        top: -1 * current_scrollY
      });
      $('body').addClass('fixed');
      $('.detail_inner').css({'display': 'none'});
      $(modalURL[e]).css({'display': 'flex'});
      target.addClass('open');
    }

    function btnPreset(){
      profileClose.on({
        'click': function() {
          removeModal();
        }
      });
    }

    function init(){
      $.each($('article').find('.func-modal'), function(index) {
        modalBtn[index] = $(this);
        modalURL[index] = $(this).attr('linkurl');
        modalBtn[index].on({
          'click': function() {
            openModal(index);
          }
        });
      });

      profileBg.on({
        'click': function() {
          removeModal()
        }
      });

      profileClose.on({
        'click': function() {
          removeModal();
        }
      });
    }

    init();

  }

  if (document.getElementById('detailPop')) {
    detailPopOpen($('#detailPop'));
  }

  // フッターのお問い合わせボタン

  function footerContact(target){
    var openModalContact = $('#openModalContact');

    function init(){

      openModalContact.on({
        'click': function() {
          target.css({'display': 'flex'});
        }
      });

      target.on({
        'click': function() {
          target.css({'display': 'none'});
        }
      });

    }

    init();

  }

  if (document.getElementById('contactModal')) {
    footerContact($('#contactModal'));
  }












});
