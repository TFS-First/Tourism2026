(() => {
  const revealHash = () => {
    if (!location.hash) return;
    const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (!target) return;
    const ownFold = target.querySelector(':scope > details.course-fold');
    if (ownFold) ownFold.open = true;
    let parent = target.closest('details');
    while (parent) {
      parent.open = true;
      parent = parent.parentElement?.closest('details');
    }
  };
  window.addEventListener('hashchange', revealHash);
  window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, small, span').forEach(element => {
      if (element.children.length) return;
      const value = element.textContent.trim();
      if (/[A-Za-z]{2}/.test(value) && !/[\u0600-\u06ff]/.test(value)) {
        element.dir = 'ltr'; element.classList.add('english-copy');
      }
    });
    const sections = [...document.querySelectorAll('section[id], main[id]')].filter(section => !section.closest('details'));
    const axes = sections.map(section => {
      const heading = section.querySelector('h2, h3');
      const label = section.id === 'quiz' ? 'التدريبات والأسئلة' : heading?.textContent.trim().replace(/\s+/g, ' ').slice(0, 52);
      return label ? { id: section.id, label } : null;
    }).filter(Boolean).slice(0, 14);
    const mobileLinks = document.querySelector('.course-mobile-nav-links');
    if (mobileLinks && axes.length) {
      if (!mobileLinks.querySelector('.course-axis-title')) {
        const title = document.createElement('span'); title.className = 'course-axis-title'; title.textContent = 'محاور الدرس'; mobileLinks.append(title);
      }
      for (const axis of axes) {
        if (mobileLinks.querySelector(`a[href="#${CSS.escape(axis.id)}"]`)) continue;
        const link = document.createElement('a'); link.href = `#${axis.id}`; link.textContent = axis.label; mobileLinks.append(link);
      }
    }
    const headerRow = document.querySelector('.course-header > div:first-child');
    if (headerRow && axes.length) {
      const menu = document.createElement('details'); menu.className = 'course-axes-menu';
      const summary = document.createElement('summary'); summary.textContent = 'محاور الدرس ▾'; menu.append(summary);
      const nav = document.createElement('nav'); nav.setAttribute('aria-label', 'محاور الدرس');
      for (const axis of axes) { const link = document.createElement('a'); link.href = `#${axis.id}`; link.textContent = axis.label; nav.append(link); }
      menu.append(nav); headerRow.insertBefore(menu, headerRow.lastElementChild);
    }
    revealHash();
    document.querySelectorAll('.course-mobile-nav a[href^="#"]').forEach(link => {
      link.addEventListener('click', () => { link.closest('details').open = false; });
    });
  });
})();
