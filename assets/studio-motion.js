// Native links remain available when scripting or modal dialogs are unavailable.
(() => {
  const zh = document.documentElement.lang.startsWith('zh');
  const header = document.querySelector('.site-header');
  const nav = header?.querySelector('nav');
  const switcher = header?.querySelector('.language-toggle');
  if (switcher) {
    const pair = switcher.getAttribute('href');
    const keepSection = () => { switcher.href = pair + location.hash; };
    keepSection();
    addEventListener('hashchange', keepSection);
  }
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if (nav && typeof HTMLDialogElement !== 'undefined') {
    const toggle = document.createElement('button');
    toggle.className = 'index-toggle';
    toggle.textContent = zh ? '菜单 +' : 'Menu +';
    toggle.setAttribute('aria-haspopup','dialog');
    toggle.setAttribute('aria-expanded','false');
    const panel = document.createElement('dialog');
    panel.className = 'studio-index';
    panel.setAttribute('aria-label',zh ? '网站菜单' : 'Site menu');
    const mark = header.querySelector('.wordmark').cloneNode(true);
    const top = document.createElement('div');
    top.className = 'index-top';
    const close = toggle.cloneNode();
    close.textContent = zh ? '关闭 ×' : 'Close ×';
    close.removeAttribute('aria-expanded');
    close.removeAttribute('aria-haspopup');
    top.append(mark,close);
    const list = nav.cloneNode(true);
    list.setAttribute('aria-label',zh ? '网站菜单' : 'Site menu');
    list.querySelectorAll('a').forEach((a,i)=>{a.style.setProperty('--order',i);a.dataset.number=String(i+1).padStart(2,'0')});
    panel.append(top,list);
    document.body.append(panel);
    nav.after(toggle);
    header.classList.add('index-ready');
    toggle.onclick = () => {panel.showModal();toggle.setAttribute('aria-expanded','true');close.focus()};
    const dismiss = () => {panel.close(); toggle.focus({preventScroll:true})};
    close.onclick = dismiss;
    panel.addEventListener('close',()=>toggle.setAttribute('aria-expanded','false'));
    list.addEventListener('click',e=>{if(e.target.closest('a'))panel.close()});
    window.addEventListener('pageshow',()=>{if(panel.open)panel.close()});
  }
  if (reduced.matches || !('IntersectionObserver' in window)) return;
  const obs = new IntersectionObserver(es=>es.forEach(({target,isIntersecting})=>{
    if(!isIntersecting)return;
    obs.unobserve(target);
    if(reduced.matches)return;
    const plate=target.matches('figure,.work-art,.series-nav li');
    const frames=plate?[{clipPath:'inset(7% 0 0 0)',transform:'translateY(19px) scale(.986)'},{clipPath:'inset(0)',transform:'none'}]:
      [{opacity:.18,transform:'translateY(.36em)',clipPath:'inset(0 0 16% 0)'},{opacity:1,transform:'none',clipPath:'inset(0 0 -12% 0)'}];
    target.animate(frames,{duration:plate?820:690,easing:'cubic-bezier(.16,.8,.24,1)'});
  }),{threshold:0});
  document.querySelectorAll('main h1:not(#hero-title),main h2,.service-card h3,main .lede,.work-art,.series-nav li,main figure').forEach(el=>obs.observe(el));
})();
