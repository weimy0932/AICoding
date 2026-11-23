/* ======================================================
   暖炉小馆 · 主交互脚本 (main.js)
   功能：固定导航、汉堡菜单、平滑滚动、图片懒加载、
         返回顶部、滚动进入动画
   依赖：无（原生 ES6+）
   ====================================================== */
(function () {
  'use strict';

  // ---------- DOM 元素 ----------
  const header      = document.getElementById('site-header');
  const navToggle   = document.getElementById('nav-toggle');
  const mainNav     = document.getElementById('main-nav');
  const backTopBtn  = document.getElementById('back-top');

  if (!header) return; // 非页面顶部也无妨

  // ---------- 1. 导航栏：滚动后添加阴影 ----------
  function onScroll() {
    const y = window.scrollY || document.documentElement.scrollTop;
    header.classList.toggle('is-scrolled', y > 20);

    if (backTopBtn) {
      backTopBtn.classList.toggle('is-visible', y > 400);
    }
  }
  window.addEventListener('scroll', throttle(onScroll, 80), { passive: true });
  onScroll(); // 初始状态

  // ---------- 2. 汉堡菜单 ----------
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      const isOpen = mainNav.classList.toggle('is-open');
      navToggle.classList.toggle('is-open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // 点击导航项后自动收起（移动端体验）
    mainNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        if (mainNav.classList.contains('is-open')) {
          mainNav.classList.remove('is-open');
          navToggle.classList.remove('is-open');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // ---------- 3. 平滑滚动（锚点跳转，兼容固定导航） ----------
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length <= 1) return; // 跳过 "#" 伪锚点
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const headerH = header.offsetHeight || 60;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH + 4;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  // ---------- 4. 返回顶部 ----------
  if (backTopBtn) {
    backTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---------- 5. 图片懒加载（原生 loading + IntersectionObserver 兜底） ----------
  const lazyImgs = document.querySelectorAll('img[data-src], img[loading="lazy"]');
  if ('IntersectionObserver' in window && lazyImgs.length) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const img = entry.target;
        const src = img.dataset.src || img.src;
        if (img.dataset.src) {
          img.src = src;
          img.removeAttribute('data-src');
        }
        img.classList.add('is-loaded');
        io.unobserve(img);
      });
    }, { rootMargin: '120px 0px' });
    lazyImgs.forEach(function (img) { io.observe(img); });
  }

  // ---------- 6. 滚动进入动画 ----------
  const fadeEls = document.querySelectorAll('.section, .feature-card, .dish-card, .info-card, .gallery-item');
  fadeEls.forEach(function (el) { el.classList.add('fade-up'); });

  if ('IntersectionObserver' in window) {
    const animIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          animIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    fadeEls.forEach(function (el) { animIO.observe(el); });
  } else {
    fadeEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // ---------- 7. 工具函数 ----------
  function throttle(fn, wait) {
    let last = 0, timer = null;
    return function () {
      const now = Date.now();
      const remaining = wait - (now - last);
      const ctx = this, args = arguments;
      if (remaining <= 0) {
        if (timer) { clearTimeout(timer); timer = null; }
        last = now;
        fn.apply(ctx, args);
      } else if (!timer) {
        timer = setTimeout(function () {
          last = Date.now(); timer = null;
          fn.apply(ctx, args);
        }, remaining);
      }
    };
  }

})();
