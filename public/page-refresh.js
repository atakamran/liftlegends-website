(function() {
  // Timeout to consider page as inactive (in milliseconds) - 30 minutes
  const INACTIVITY_TIMEOUT = 30 * 60 * 1000;
  
  // Store the last activity timestamp
  let lastActivityTime = Date.now();
  
  // Update the last activity time on user interactions
  function updateActivityTime() {
    lastActivityTime = Date.now();
    // Store in sessionStorage to persist across page reloads
    try {
      sessionStorage.setItem('lastActivityTime', lastActivityTime.toString());
    } catch (e) {
      console.error('Error storing activity time:', e);
    }
  }
  
  // Check if the page needs refreshing after inactivity
  function checkInactivity() {
    // Try to get the last activity time from sessionStorage
    const storedTime = sessionStorage.getItem('lastActivityTime');
    if (storedTime) {
      lastActivityTime = parseInt(storedTime, 10);
    }
    
    const currentTime = Date.now();
    const inactiveTime = currentTime - lastActivityTime;
    
    // If inactive for too long, refresh the page
    if (inactiveTime > INACTIVITY_TIMEOUT) {
      console.log('Page inactive for too long, refreshing...');
      window.location.reload();
    }
  }
  
  // Events to monitor for user activity
  const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
  activityEvents.forEach(event => {
    document.addEventListener(event, updateActivityTime, { passive: true });
  });
  
  // Check for inactivity when the page becomes visible again
  document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
      checkInactivity();
    }
  });
  
  // Run initial check and set up interval
  updateActivityTime();
  
  // Check every minute for inactivity
  setInterval(checkInactivity, 60000);
})();