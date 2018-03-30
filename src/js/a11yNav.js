'use strict';

// a11nav Module
var a11ynav = (function (e) {
  // Config variables are specifically javascript objects (not jQuery) - We need these when calling Mousetrap bindings.
  var config = {
        menuToggle: document.getElementById('menu-toggle')
      , main: document.querySelector('main, #main')
      , primaryNavContainer: document.getElementById('primary-nav')
      , primaryNav: document.querySelector('#primary-nav > .nav-menu')
      , Mousetrap: require('mousetrap')
      }
    , bindEscPrimaryNav = null
    , bindEscSubnav     = null
  ;


  // ---------------------------------
  // Private methods
  // ---------------------------------


  // ---------------------------------
  // Main Nav
  // ---------------------------------
  function togglePrimaryNav(e) { // bound to click on $('#menu-toggle') (only happens on mobile)
    e.preventDefault();
    e.stopPropagation();

    if ( this.getAttribute('aria-expanded') == 'true' ) { // if the primary menu is open
      closePrimaryNav();
    } else { // the primary menu is closed
      openPrimaryNav();
    }
  };

  function openPrimaryNav(e) {
    config.menuToggle.setAttribute('aria-expanded', 'true');
    config.menuToggle.innerHTML = 'Close';
    config.main.classList.add('nav-open');
    config.primaryNavContainer.setAttribute('aria-expanded', 'true');
    config.primaryNavContainer.classList.add('open');
    config.primaryNav.querySelectorAll(':scope > li:first-of-type > a:first-of-type')[0].focus();
    // We bind 'esc' to close the menu.
    if ( bindEscPrimaryNav ) bindEscPrimaryNav.unbind('esc'); // ensure we don't have multiple bindings
    bindEscPrimaryNav = new config.Mousetrap().bind('esc', function(e) {
      closePrimaryNav();
      config.menuToggle.focus();
    });
  };

  function closePrimaryNav(e) {
    config.primaryNavContainer.setAttribute('aria-expanded', 'false');
    config.primaryNavContainer.classList.remove('open');
    config.menuToggle.setAttribute('aria-expanded', 'false');
    config.menuToggle.innerHTML = 'Menu';
    config.menuToggle.focus();
    config.main.classList.remove('nav-open');
    if ( bindEscPrimaryNav ) bindEscPrimaryNav.unbind('esc'); // if we've bound ESC to close the menu, remove that binding
  };


  // ---------------------------------
  // SubNav
  // ---------------------------------
  function toggleSubnav(e) { // bound to click on each $('#primary-nav .nav-menu a[aria-controls]')
    e.preventDefault();
    e.stopPropagation();

    if ( this.classList.contains(open)) {
      closeSubnav(this);
    } else {
      openSubnav(this);
    }
  };

  function openSubnav(subnavToggle) {
    var $target = $('#' + $(subnavToggle).attr('aria-controls'))
      , $subnavToggle = $(subnavToggle)
    ;
    // First close any open subnavs
    $(config.primaryNav).find('a[aria-controls].open').each(function() {
      closeSubnav(this);
    });
    // Open the selected subnav
    $subnavToggle.addClass('open').attr('aria-expanded', true);
    $target.attr('aria-expanded', true).find('>li:first-of-type > a:first-of-type').focus();

    // If we're on mobile, we've bound ESC to close the primary nav. Because we're
    // opening a sub-nav, we now want ESC to just close the subnav, so we need to
    // remove the binding for the primary nav. Also make a note for ourselves to
    // restore this binding when the sub-nav is closed.
    if (bindEscPrimaryNav) {
      bindEscPrimaryNav.unbind('esc');
      bindEscPrimaryNav = 'restore binding'; // make a note that we need to rebind this when the subnav closes
    }

    // we bind a new unique listener to close the subnav
    if ( bindEscSubnav ) bindEscSubnav.unbind('esc'); // ensure we don't have multiple bindings
    bindEscSubnav = new config.Mousetrap().bind('esc', function() {
      closeSubnav(subnavToggle);
      $subnavToggle.focus();
    });

    // Then we bind click outside of the subnav element to close the subnav
    $target.on('click.closeSelf', function(e) {
      e.stopPropagation();
      // console.log('1. click.closeSelf on $target');
    });
    $(subnavToggle).on('click.closeSelf', function(e) {
      e.stopPropagation();
      // console.log('2. click.closeSelf on subnavToggle');
    });
    $(document).on('click.closeSelf', function(){
      if ($target.attr('aria-expanded') == 'true') {
        closeSubnav(subnavToggle);
      }
      // console.log('3. click.closeSelf on document');
    });
  };

  function closeSubnav(subnavToggle) {
    var $target = $('#' + $(subnavToggle).attr('aria-controls'))
    $(subnavToggle).removeClass('open').removeAttr('aria-expanded');
    $target.attr('aria-expanded', false);
    if ( bindEscSubnav ) bindEscSubnav.unbind('esc');
    if ( bindEscPrimaryNav == 'restore binding' ) {
      // if we removed the binding for the primary nav because we wanted ESC to
      // close the subnav, then restore the binding for the primary nav
      console.log( 'binding ESC for primary nav');
      bindEscPrimaryNav = new config.Mousetrap().bind('esc', function () {
        closePrimaryNav();
        config.menuToggle.focus();
      });
    }
    $(document).off('click.closeSelf');
    $target.off('click.closeSelf');
    $(subnavToggle).off('click.closeSelf');
  }


  // ---------------------------------
  // Event handlers:
  // handle changes between mobile and desktop nav (triggered in resizeEnd handler)
  // ---------------------------------
  $(window).on( 'switchToMobileMenu', function() {
    // make screen readers announce that ESC will close the primary menu
    $(config.primaryNav).attr('role', 'menu');
    // make screen readers announce that ESC will close the sub menu(s)
    $(config.primaryNav).find('> li > a').each(function() {
      $(this).attr('role', 'menuitem');
    });

    // manage state
    if ( $(config.primaryNavContainer).hasClass('open') ) { // handle resize when primary menu is open
      $(config.menuToggle).attr('aria-expanded', true);
      $(config.primaryNavContainer).attr('aria-expanded', true);
      $(main).addClass('nav-open');
    } else { // handle resize when primary menu is not open
      $(config.menuToggle).attr('aria-expanded', false);
      $(config.primaryNavContainer).attr('aria-expanded', false);

      // if any subnavs are open, open the primary nav
      if ( $('#primary-nav').find('a[aria-controls].open').length ) {
        bindEscPrimaryNav = 'restore binding'; // make a note that we need to rebind this when the subnav closes
        // If the primary menu is not already expanded
        if ($(config.menuToggle).attr('aria-expanded') == 'false') {
          // Expands the primary menu
          $(config.menuToggle).attr('aria-expanded', true).html('Close');
          $(config.primaryNavContainer).attr('aria-expanded', true);
          $(config.main).addClass('nav-open');
        }
      }
    }
    console.log('%c ✔ Switched to mobile nav', 'color: green');
  });

  $(window).on( 'switchToDesktopMenu', function() {
    // prevent screen readers from announcing that ESC will close the primary menu
    $(config.primaryNav).attr('role', 'menubar');
    $(config.primaryNav).find('> li > a').each(function() {
      // prevent screen readers from announcing that ESC will close the first level menu item
      $(this).removeAttr('role');
    });

    // manage state
    if ($(config.primaryNavContainer).hasClass('open')) {
      $(config.menuToggle).removeAttr('aria-expanded');
      $(config.primaryNavContainer).removeAttr('aria-expanded');
      $(config.main).removeClass('nav-open');
    } else {
      $(config.menuToggle).removeAttr('aria-expanded');
      $(config.primaryNavContainer).removeAttr('aria-expanded');
    }
    console.log('%c ✔ Switched to desktop nav', 'color: green');
  });


  // ---------------------------------
  // public entry points
  // ---------------------------------
  // todo: allow users to override default config options
  return {
    // aliases to private functions
    togglePrimaryNav: togglePrimaryNav,
    toggleSubnav: toggleSubnav,
  }
})();

// Bind primary Navigation Button
$( '#menu-toggle' ).click( a11ynav.togglePrimaryNav );

// We find all the sub nav toggles
$( '#primary-nav .nav-menu a[aria-controls]' ).each(function(e) {
  var $this = $(this);
  $this.click( a11ynav.toggleSubnav );
});
console.log('%c ✔ Accessible Navigation', 'color: green');
