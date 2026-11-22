(() => {
  const stage = document.getElementById('stage');
  if (!stage) return;
  const fsBtn = document.getElementById('fs');
  const exitBtn = document.getElementById('exit');
  const title = document.querySelector('.fg-play__title')?.textContent || document.title;
  const src = stage.dataset.src;
  if (src) {
    const frame = document.createElement('iframe');
    frame.src = src;
    frame.title = title;
    frame.allow = 'fullscreen; accelerometer; camera; clipboard-read; clipboard-write; screen-wake-lock; speaker-selection; web-share; geolocation; gyroscope; microphone; xr-spatial-tracking; autoplay; encrypted-media; picture-in-picture; payment; publickey-credentials-get; publickey-credentials-create; storage-access; attribution-reporting; browsing-topics';
    frame.allowFullscreen = true;
    frame.setAttribute('allowfullscreen', 'true');
    frame.setAttribute('webkitallowfullscreen', 'true');
    stage.appendChild(frame);
  }
  function syncExit() {
    if (!exitBtn) return;
    exitBtn.hidden = !(document.fullscreenElement || stage.classList.contains('is-faux-fs'));
  }
  async function enterFullscreen() {
    if (document.fullscreenElement || stage.classList.contains('is-faux-fs')) return;
    try {
      if (stage.requestFullscreen) {
        const outcome = await Promise.race([
          stage.requestFullscreen({ navigationUI: 'hide' }).then(() => 'ok').catch(() => 'fail'),
          new Promise(resolve => setTimeout(() => resolve('timeout'), 900))
        ]);
        if (outcome === 'ok') {
          syncExit();
          return;
        }
      }
    } catch (error) {}
    stage.classList.add('is-faux-fs');
    document.body.classList.add('fg-locked');
    syncExit();
  }
  async function leaveFullscreen() {
    if (document.fullscreenElement) {
      try { await document.exitFullscreen(); } catch (error) {}
    }
    stage.classList.remove('is-faux-fs');
    document.body.classList.remove('fg-locked');
    syncExit();
  }
  if (fsBtn) fsBtn.addEventListener('click', () => {
    if (document.fullscreenElement || stage.classList.contains('is-faux-fs')) leaveFullscreen();
    else enterFullscreen();
  });
  if (exitBtn) exitBtn.addEventListener('click', leaveFullscreen);
  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
      stage.classList.remove('is-faux-fs');
      document.body.classList.remove('fg-locked');
    }
    syncExit();
  });
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && stage.classList.contains('is-faux-fs')) leaveFullscreen();
  });
  syncExit();
})();
