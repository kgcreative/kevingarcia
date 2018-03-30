'use strict';
var feature = require('./features')
;

function resizeEnd() {
  var isMobileMenu        = feature.isMobileMenu()
    , primaryNav          = document.querySelector('#primary-nav > .nav-menu')
    , primaryNavContainer = document.getElementById('primary-nav')
    , menuToggle          = document.getElementById('menu-toggle')
    , main                = document.querySelector('main, #main')
    , closeMainNavigation
  ;
  //synchronous actions
  if (isMobileMenu === true) {
    $(primaryNav).attr('role', 'menu');
    $(primaryNav).find('> li > a').each(function(e) {
      $(this).attr('role', 'menuitem');
    });
    if ($(primaryNavContainer).hasClass('open')) {
      $(menuToggle).attr('aria-expanded', true);
      $(primaryNavContainer).attr('aria-expanded', true);
      $(main).addClass('nav-open');
    } else {
      $(menuToggle).attr('aria-expanded', false);
      $(primaryNavContainer).attr('aria-expanded', false);
    }
  } else {
    $(primaryNav).find('> li > a').each(function(e) {
      $(this).removeAttr('role');
    });
    $(primaryNav).attr('role', 'menubar');
    if ($(primaryNavContainer).hasClass('open')) {
      $(menuToggle).removeAttr('aria-expanded');
      $(primaryNavContainer).removeAttr('aria-expanded');
      $(main).removeClass('nav-open');
    } else {
      $(menuToggle).removeAttr('aria-expanded');
      $(primaryNavContainer).removeAttr('aria-expanded');
    }
  }
  console.log('%c ✔ resizeEnd', 'color: green');
  //asynchronous triggers
};

// note resize events and trigger resizeEnd event when resizing stops
window.onresize = function() {
  if(this.resizeTo) clearTimeout(this.resizeTo);
  this.resizeTo = setTimeout(function() {
    resizeEnd();
  }, 250);
};

resizeEnd();
