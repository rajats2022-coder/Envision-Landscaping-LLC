// Jobber's inline embed emits the same scroll signal as its dialog embed.
// Handle only our form's signal before the vendor tries to scroll a missing dialog.
export function initJobberInlineScroll(document, window) {
  if (!document.querySelector('[data-jobber-request]')) return

  window.addEventListener('message', (event) => {
    if (event.data !== 'scrolltop' || event.origin !== 'https://clienthub.getjobber.com') return

    const iframe = [...document.querySelectorAll('[data-jobber-request] iframe.jobber-work-request')]
      .find((frame) => frame.contentWindow === event.source)
    const shell = iframe?.closest('[data-jobber-request]')
    if (!shell) return

    event.stopImmediatePropagation()
    shell.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, true)
}
