document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. SELECTORS & ELEMENTS
  // ==========================================
  const menuToggle = document.querySelector('.menu-toggle');
  const siteNav = document.querySelector('.site-nav');
  const themeToggle = document.querySelector('.theme-toggle');
  const themeColor = document.querySelector('meta[name="theme-color"]');
  const typedName = document.querySelector('#typed-name');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  // ==========================================
  // 2. THEME CONTROLLER (ธีมมืด / ธีมสว่าง)
  // ==========================================
  const applyTheme = (isDark) => {
    if (isDark) {
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
    }

    const nextLabel = isDark ? 'เปลี่ยนเป็นธีมสว่าง' : 'เปลี่ยนเป็นธีมมืด';

    if (themeToggle) {
      themeToggle.setAttribute('aria-pressed', String(isDark));
      themeToggle.setAttribute('aria-label', nextLabel);
      themeToggle.setAttribute('title', nextLabel);

      const iconSpan = themeToggle.querySelector('span');
      if (iconSpan) {
        iconSpan.textContent = isDark ? '☀' : '◐';
      }
    }

    if (themeColor) {
      themeColor.setAttribute('content', isDark ? '#111214' : '#f4f4ec');
    }

    try {
      localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light');
    } catch {
      // ป้องกัน Error กรณีเว็บบล็อก LocalStorage
    }
  };

  let savedTheme = null;
  try {
    savedTheme = localStorage.getItem('portfolio-theme');
  } catch {}

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialThemeIsDark = savedTheme ? savedTheme === 'dark' : prefersDark;

  applyTheme(initialThemeIsDark);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isCurrentlyDark = !document.body.classList.contains('light-theme');
      applyTheme(!isCurrentlyDark);
    });
  }

  // ==========================================
  // 3. MOBILE MENU TOGGLE
  // ==========================================
  if (menuToggle && siteNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'เปิดเมนู' : 'ปิดเมนู');
      siteNav.classList.toggle('is-open', !isOpen);
    });

    siteNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        siteNav.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'เปิดเมนู');
      });
    });
  }

  // ==========================================
  // 4. PORTFOLIO FILTER (ระบบกรองผลงาน)
  // ==========================================
  if (filterBtns.length > 0 && projectCards.length > 0) {
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        // 1. สลับคลาส active และสถานะ ARIA
        filterBtns.forEach((b) => {
          b.classList.remove('filter-active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('filter-active');
        btn.setAttribute('aria-selected', 'true');

        // 2. ดึงค่าหมวดหมู่ที่คลิก
        const filterValue = btn.getAttribute('data-filter') || btn.textContent.trim().toLowerCase();

        // 3. กรองและซ่อน/แสดงการ์ดผลงาน
        projectCards.forEach((card) => {
          const cardCat = (card.getAttribute('data-category') || '').toLowerCase();
          
          if (filterValue === 'all' || cardCat === filterValue) {
            card.style.display = 'block';
            // เพิ่ม Animation ปรากฏเบาๆ ตอนสลับหมวด
            card.animate([
              { opacity: 0, transform: 'scale(0.96)' },
              { opacity: 1, transform: 'scale(1)' }
            ], {
              duration: 250,
              easing: 'ease-out'
            });
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // ==========================================
  // 5. TYPING ANIMATION (ข้อความพิมพ์ดีด)
  // ==========================================
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (typedName && !prefersReducedMotion.matches) {
    const typedPhrases = ['THAMMANOON', "I'M DEV CTN"];
    let phraseIndex = 0;

    const typeNextPhrase = () => {
      const phrase = typedPhrases[phraseIndex];
      let characterIndex = 0;
      typedName.textContent = '';

      const typeCharacter = () => {
        typedName.textContent = phrase.slice(0, ++characterIndex);

        if (characterIndex < phrase.length) {
          window.setTimeout(typeCharacter, 110);
          return;
        }

        window.setTimeout(erasePhrase, 1600);
      };

      const erasePhrase = () => {
        const currentText = typedName.textContent;
        if (currentText.length > 0) {
          typedName.textContent = currentText.slice(0, -1);
          window.setTimeout(erasePhrase, 50);
          return;
        }

        phraseIndex = (phraseIndex + 1) % typedPhrases.length;
        window.setTimeout(typeNextPhrase, 260);
      };

      typeCharacter();
    };

    window.setTimeout(() => {
      typedName.textContent = '';
      typeNextPhrase();
    }, 1200);
  }
});