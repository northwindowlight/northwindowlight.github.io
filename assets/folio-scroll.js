// Match the selected-project entrance, leaving navigation and scrolling native.
(() => {
  const works = [...document.querySelectorAll('.folios > .folio')];
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  if (!('IntersectionObserver' in window) || motion.matches) return;
  const running = new Set();
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      const image = entry.target.querySelector('.folio-print');
      image.style.removeProperty('opacity');
      const side = works.indexOf(entry.target) % 2 ? 1 : -1;
      const animation = image.animate([
        {opacity: 0, transform: `translate(${side * 100}%, 30rem) rotate(${side * 26}deg)`},
        {opacity: 1, transform: 'none'}
      ], {duration: 1400, easing: 'cubic-bezier(.16,1,.3,1)'});
      running.add(animation);
      animation.finished.then(() => running.delete(animation), () => running.delete(animation));
    }
  }, {rootMargin: '0px 0px -20% 0px'});
  works.forEach(work => {
    if (work.getBoundingClientRect().top >= innerHeight * .8) work.querySelector('.folio-print').style.opacity = '0';
    observer.observe(work);
  });
  motion.addEventListener('change', () => {
    if (!motion.matches) return;
    observer.disconnect();
    works.forEach(work => work.querySelector('.folio-print').style.removeProperty('opacity'));
    running.forEach(animation => animation.cancel());
  });
})();
