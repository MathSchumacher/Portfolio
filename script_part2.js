  // ==================================================
  // LIGHTWEIGHT ANIMATION SYSTEM (Optimized & Fixed)
  // ==================================================
  (function initAnimations() {
    // Check if GSAP is loaded
    if (typeof gsap === 'undefined') {
      console.warn('GSAP not loaded. Animations disabled.');
      return;
    }

    // Register ScrollTrigger if available
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    // --------------------------------------------------
    // 1. HERO SECTION - Simple entrance animations
    // --------------------------------------------------
    const heroTags = document.querySelectorAll('.hero-tag-wrapper');
    const heroButtons = document.querySelectorAll('.actions .btn');

    if (heroTags.length > 0) {
      gsap.from(heroTags, {
        opacity: 0,
        y: 15,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power2.out',
        delay: 0.3
      });
    }

    if (heroButtons.length > 0) {
      gsap.from(heroButtons, {
        opacity: 0,
        y: 15,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power2.out',
        delay: 0.5
      });
    }

    // --------------------------------------------------
    // 2. TYPEWRITER EFFECT (Stable)
    // --------------------------------------------------
    const typewriterTitle = document.querySelector('.start-title');
    
    if (typewriterTitle) {
      setTimeout(() => {
        const originalText = typewriterTitle.textContent.trim();
        
        if (originalText.length > 0) {
          typewriterTitle.textContent = '';
          typewriterTitle.style.visibility = 'visible';
          
          const cursor = document.createElement('span');
          cursor.className = 'typewriter-cursor';
          cursor.textContent = '|';
          typewriterTitle.appendChild(cursor);
          
          let charIndex = 0;
          const typeSpeed = 50;
          
          function typeChar() {
            if (charIndex < originalText.length) {
              const char = originalText.charAt(charIndex);
              const textNode = document.createTextNode(char);
              typewriterTitle.insertBefore(textNode, cursor);
              charIndex++;
              setTimeout(typeChar, typeSpeed);
            } else {
              setTimeout(() => {
                cursor.style.opacity = '0';
              }, 1000);
            }
          }
          typeChar();
        }
      }, 200);
    }

    // --------------------------------------------------
    // 3. INTERSECTION OBSERVER (Scroll Reveal)
    // --------------------------------------------------
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1
    };

    const animateOnScroll = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          animateOnScroll.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.projeto-card, section h2').forEach((el, index) => {
      if(el.classList.contains('projeto-card')) {
        el.style.transitionDelay = `${(index % 3) * 0.1}s`;
      }
      animateOnScroll.observe(el);
    });

    // --------------------------------------------------
    // 4. XP BARS - Direct Width Assignment (Fixed)
    // --------------------------------------------------
    const xpObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          bar.style.width = bar.dataset.targetWidth;
          xpObserver.unobserve(bar);
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll('.xp-progress').forEach(bar => {
      const targetWidth = bar.style.width || '0%';
      bar.dataset.targetWidth = targetWidth;
      bar.style.width = '0%';
      bar.style.transition = 'width 1.2s cubic-bezier(0.22, 1, 0.36, 1)';
      xpObserver.observe(bar);
    });

    // --------------------------------------------------
    // 5. ABOUT SECTION EXPANSION (Fixed Listener)
    // --------------------------------------------------
    const toggleTrajetoriaBtn = document.getElementById('toggle-trajetoria');
    const carouselContainerAbout = document.querySelector('.carousel-container');
    const resumidaAbout = document.querySelector('.trajetoria-resumida');
    
    if (toggleTrajetoriaBtn && carouselContainerAbout && resumidaAbout) {
      const newBtn = toggleTrajetoriaBtn.cloneNode(true);
      toggleTrajetoriaBtn.parentNode.replaceChild(newBtn, toggleTrajetoriaBtn);
      
      carouselContainerAbout.style.height = '0';
      carouselContainerAbout.style.opacity = '0';
      carouselContainerAbout.style.overflow = 'hidden';
      carouselContainerAbout.style.transition = 'all 0.5s ease-in-out';
      
      let isExpanded = false;
      
      newBtn.addEventListener('click', () => {
        if (!isExpanded) {
          resumidaAbout.style.opacity = '0';
          resumidaAbout.style.height = '0';
          setTimeout(() => { resumidaAbout.style.display = 'none'; }, 300);
          
          carouselContainerAbout.style.display = 'block';
          setTimeout(() => {
             carouselContainerAbout.style.height = 'auto'; 
             carouselContainerAbout.style.opacity = '1';
          }, 10);
          
          isExpanded = true;
        } else {
          carouselContainerAbout.style.height = '0';
          carouselContainerAbout.style.opacity = '0';
          
          resumidaAbout.style.display = 'block';
          setTimeout(() => {
             resumidaAbout.style.height = 'auto';
             resumidaAbout.style.opacity = '1';
          }, 300);
          
          isExpanded = false;
        }
      });
    }

    console.log('✨ Optimized animations initialized');
  })();

});
