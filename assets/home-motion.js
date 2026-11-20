// Split only during the entrance so the settled wordmark keeps its original kerning.
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const title = document.getElementById('hero-title');
  const text = document.createTreeWalker(title, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (text.nextNode()) if (text.currentNode.textContent.trim()) nodes.push(text.currentNode);
  let beat = 0;
  for (const node of nodes) {
    const wrapper = document.createElement('span');
    wrapper.className = 'letter-word';
    for (const char of node.textContent.trim()) {
      const letter = document.createElement('span');
      letter.className = 'arrival-letter';
      letter.style.setProperty('--beat', `${beat++ * 22}ms`);
      letter.textContent = char;
      wrapper.append(letter);
    }
    const space = document.createTextNode(node.textContent.endsWith(' ') ? ' ' : '');
    node.replaceWith(wrapper, space);
    const restore = () => { wrapper.replaceWith(document.createTextNode(wrapper.textContent)); };
    wrapper.lastChild.addEventListener('animationend', restore, {once:true});
    wrapper.lastChild.addEventListener('animationcancel', restore, {once:true});
  }
})();
