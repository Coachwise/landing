// The only script on the page: submerged sections rise into view as you scroll.
// If the browser can't do IntersectionObserver, or the visitor asked for less
// motion, everything is simply shown — the page never depends on this running.
(function () {
  var items = document.querySelectorAll('.rise');
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (still || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('in'); });
    return;
  }

  var seen = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      seen.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -12% 0px' });

  items.forEach(function (el) { seen.observe(el); });
})();
