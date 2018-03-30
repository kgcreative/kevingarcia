'use strict';

exports.breakpointDetect = function() {
  var body = document.querySelector('body')
    , result = getComputedStyle(body, ':before').content;
  // returns contents without quotes
  return result.replace(/\"/g, "");
}

exports.isMobileMenu = function() {
  var currentBreakpoint = exports.breakpointDetect()
  return ( currentBreakpoint === 'xs' || currentBreakpoint === 'sm' ||
    currentBreakpoint === 'md' )
}
