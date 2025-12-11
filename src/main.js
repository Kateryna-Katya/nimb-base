document.addEventListener('DOMContentLoaded', () => {
  // Register GSAP Plugins
  gsap.registerPlugin(ScrollTrigger);

  // 1. ICONS
  lucide.createIcons();

  // 2. SMOOTH SCROLL (Lenis)
  const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
  });
  function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // 3. MENU MOBILE
  const burgerBtn = document.querySelector('.header__burger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileMenuContent = document.querySelector('.mobile-menu__content');
  const headerLinks = document.querySelectorAll('.header__menu a');

  // Populate Mobile Menu
  headerLinks.forEach(link => {
      const clone = link.cloneNode(true);
      mobileMenuContent.appendChild(clone);
      clone.addEventListener('click', () => toggleMenu(false));
  });

  function toggleMenu(state) {
      const isOpen = mobileMenu.classList.contains('is-open');
      const newState = state !== undefined ? state : !isOpen;
      if (newState) {
          mobileMenu.classList.add('is-open');
          burgerBtn.innerHTML = '<i data-lucide="x"></i>';
      } else {
          mobileMenu.classList.remove('is-open');
          burgerBtn.innerHTML = '<i data-lucide="menu"></i>';
      }
      lucide.createIcons();
  }
  burgerBtn.addEventListener('click', () => toggleMenu());

  // 4. ANIMATIONS (GSAP)

  // Hero Animation
  const tlHero = gsap.timeline();
  tlHero.from('.hero__badge', { y: -20, opacity: 0, duration: 0.8, ease: 'power3.out' })
        .from('.hero__title', { y: 50, opacity: 0, duration: 1, ease: 'power3.out' }, '-=0.6')
        .from('.hero__subtitle', { y: 30, opacity: 0, duration: 1, ease: 'power3.out' }, '-=0.8')
        .from('.hero__actions', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.8')
        .from('.hero__shape', { scale: 0, opacity: 0, duration: 1.5, stagger: 0.2, ease: 'elastic.out(1, 0.5)' }, '-=1');

  // Scroll Animations (Geo Blocks appearing)
  gsap.utils.toArray('.geo-block').forEach(block => {
      gsap.from(block, {
          scrollTrigger: {
              trigger: block,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
          },
          y: 50,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out'
      });
  });

  // Innovation Stats Counter
  gsap.utils.toArray('.stat-num').forEach(stat => {
      gsap.to(stat, {
          scrollTrigger: {
              trigger: '#innovation',
              start: 'top 75%',
          },
          innerHTML: stat.getAttribute('data-val'),
          duration: 2,
          snap: { innerHTML: 1 },
          ease: 'power1.inOut'
      });
  });

  // 5. FAQ ACCORDION
  const accordions = document.querySelectorAll('.accordion__item');
  accordions.forEach(item => {
      item.addEventListener('click', () => {
          // Close others
          accordions.forEach(other => {
              if(other !== item) other.classList.remove('active');
          });
          item.classList.toggle('active');
      });
  });

  // 6. CONTACT FORM VALIDATION
  const form = document.getElementById('contactForm');

  // Captcha Logic
  const captchaTask = document.getElementById('captchaTask');
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  captchaTask.textContent = `${num1} + ${num2}`;
  const captchaAnswer = num1 + num2;

  form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Clear errors
      document.querySelectorAll('.form__group').forEach(g => g.classList.remove('error'));

      // Name
      const name = document.getElementById('name');
      if(name.value.trim().length < 2) {
          setError(name);
          isValid = false;
      }

      // Email
      const email = document.getElementById('email');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if(!emailRegex.test(email.value)) {
          setError(email);
          isValid = false;
      }

      // Phone (Digits only check)
      const phone = document.getElementById('phone');
      const phoneRegex = /^[0-9+ ]{10,}$/;
      if(!phoneRegex.test(phone.value)) {
          setError(phone);
          isValid = false;
      }

      // Captcha
      const capInput = document.getElementById('captchaInput');
      if(parseInt(capInput.value) !== captchaAnswer) {
          setError(capInput);
          isValid = false;
      }

      // Agreement
      const agreement = document.getElementById('agreement');
      if(!agreement.checked) {
          agreement.parentElement.classList.add('error');
          isValid = false;
      }

      if(isValid) {
          const btn = form.querySelector('button');
          const status = document.getElementById('formStatus');

          btn.textContent = 'Отправка...';
          btn.disabled = true;

          // AJAX Simulation
          setTimeout(() => {
              btn.textContent = 'Отправлено';
              status.textContent = 'Спасибо! Мы свяжемся с вами в ближайшее время.';
              status.className = 'form-status success';
              form.reset();
          }, 1500);
      }
  });

  function setError(input) {
      input.parentElement.classList.add('error');
  }

  // 7. COOKIE POPUP
  const cookiePopup = document.getElementById('cookiePopup');
  const acceptBtn = document.getElementById('acceptCookies');

  if(!localStorage.getItem('cookiesAccepted')) {
      setTimeout(() => {
          cookiePopup.classList.add('show');
      }, 2000);
  }

  acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookiesAccepted', 'true');
      cookiePopup.classList.remove('show');
  });
});