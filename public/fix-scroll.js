// This script fixes scrolling issues on mobile devices
(function() {
  // Disable scroll restoration
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  // Prevent default behavior for all hash links
  document.addEventListener('click', function(e) {
    var target = e.target;
    while (target && target.tagName !== 'A') {
      target = target.parentNode;
    }
    
    if (target && target.getAttribute('href') === '#') {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);

  // Fix for iOS Safari and other mobile browsers
  document.addEventListener('touchmove', function(e) {
    if (e.target && 
        e.target.tagName !== 'INPUT' && 
        e.target.tagName !== 'TEXTAREA') {
      // Allow scrolling but prevent browser's native behavior
      if (!document.documentElement.classList.contains('scrolling')) {
        document.documentElement.classList.add('scrolling');
      }
    }
  }, { passive: true });

  document.addEventListener('touchend', function() {
    document.documentElement.classList.remove('scrolling');
  }, { passive: true });

  // Fix for any programmatic scrolling
  var originalScrollTo = window.scrollTo;
  window.scrollTo = function() {
    // Only allow programmatic scrolling if it's from a user action
    if (document.documentElement.classList.contains('user-initiated')) {
      originalScrollTo.apply(window, arguments);
    }
  };

  // Mark user-initiated actions
  document.addEventListener('mousedown', function() {
    document.documentElement.classList.add('user-initiated');
  });
  
  document.addEventListener('touchstart', function() {
    document.documentElement.classList.add('user-initiated');
  });
  
  // Remove the marker after a short delay
  document.addEventListener('mouseup', function() {
    setTimeout(function() {
      document.documentElement.classList.remove('user-initiated');
    }, 100);
  });
  
  document.addEventListener('touchend', function() {
    setTimeout(function() {
      document.documentElement.classList.remove('user-initiated');
    }, 100);
  });
})();