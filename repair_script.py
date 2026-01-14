import os

file_path = r'c:\Users\mathe\Documents\CODES 2025\Portifolio\script.js'

# The clean animation code block
new_animation_code = r'''
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
      // Delay slightly to let i18n settle
      setTimeout(() => {
        const originalText = typewriterTitle.textContent.trim();
        
        if (originalText.length > 0) {
          // Clear text but keep layout stable
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
              // End animation: fade out cursor
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

    // Apply to project cards and headers
    document.querySelectorAll('.projeto-card, section h2').forEach((el, index) => {
      // Add small staggered delay via style
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
          // Apply width directly from dataset - NO variable needed
          bar.style.width = bar.dataset.targetWidth;
          xpObserver.unobserve(bar);
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll('.xp-progress').forEach(bar => {
      // Capture the % width from inline style (e.g. style="width: 95%")
      // If width is empty, default to 0
      const targetWidth = bar.style.width || '0%';
      bar.dataset.targetWidth = targetWidth;
      
      // Reset to 0 for start
      bar.style.width = '0%';
      
      // Add transition for smooth fill
      bar.style.transition = 'width 1.2s cubic-bezier(0.22, 1, 0.36, 1)';
      
      xpObserver.observe(bar);
    });

    // --------------------------------------------------
    // 5. ABOUT SECTION EXPANSION
    // --------------------------------------------------
    const toggleTrajetoriaBtn = document.getElementById('toggle-trajetoria');
    const carouselContainerAbout = document.querySelector('.carousel-container');
    const resumidaAbout = document.querySelector('.trajetoria-resumida');
    
    if (toggleTrajetoriaBtn && carouselContainerAbout && resumidaAbout) {
      // Override default behavior
      toggleTrajetoriaBtn.removeEventListener('click', () => {}); 
      
      // Initial CSS state
      carouselContainerAbout.style.height = '0';
      carouselContainerAbout.style.opacity = '0';
      carouselContainerAbout.style.overflow = 'hidden';
      carouselContainerAbout.style.transition = 'all 0.5s ease-in-out';
      
      let isExpanded = false;
      
      toggleTrajetoriaBtn.addEventListener('click', () => {
        if (!isExpanded) {
          // Expand
          resumidaAbout.style.opacity = '0';
          resumidaAbout.style.height = '0';
          setTimeout(() => { resumidaAbout.style.display = 'none'; }, 300);
          
          carouselContainerAbout.style.display = 'block';
          setTimeout(() => {
             carouselContainerAbout.style.height = 'auto'; // Will snap, better use MaxHeight for transition
             carouselContainerAbout.style.opacity = '1';
          }, 10);
          
          isExpanded = true;
        } else {
          // Collapse
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
'''

try:
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # Identify truncation point - everything after line 1863
    # Careful with 0-based index. Line 1863 is index 1862.
    # We want to KEEP up to line 1863.
    # Check if lines have enough length
    if len(lines) > 1863:
        clean_lines = lines[:1863]
    else:
        clean_lines = lines
    
    # Write back clean lines + new code
    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(clean_lines)
        f.write('\n\n')
        f.write(new_animation_code)
        
    print("SUCCESS: script.js repaired.")

except Exception as e:
    print(f"ERROR: {e}")
