'use strict';

document.addEventListener('DOMContentLoaded', function() {
  // Conditional Breakpoint helper
  if ((window.location.hostname.indexOf("localhost") > -1)) {
    let body = document.querySelector('body');
    let aside = document.createElement('aside');
    aside.setAttribute("id", "breakpoint-helper");
    aside.setAttribute("tabindex", "-1");
    aside.setAttribute("aria-hidden", "true");
    body.appendChild(aside);
    if (body.classList)
      body.classList.add('bp-helper');
    else
      body.className += ' ' + 'bp-helper';

    console.log('%c ✔ breakpoint helper', 'color: green');
  }

  console.log('%c ✔ Initialized app', 'color: green');
});
