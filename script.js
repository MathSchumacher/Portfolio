document.addEventListener('DOMContentLoaded', () => {
  
  // ==================================================
  // 1. LANGUAGE & TRANSLATION SYSTEM
  // ==================================================
  
  const supportedLanguages = {
    'pt': 'Português',
    'en': 'English',
    'es': 'Español'
  };

  // Helper function to get URL parameter
  function getUrlLang() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('lang');
  }

  // Helper function to update URL with language parameter
  function updateUrlLang(lang) {
    const url = new URL(window.location);
    url.searchParams.set('lang', lang);
    window.history.replaceState({}, '', url);
  }

  // Determine initial language: URL Parameter -> LocalStorage -> Browser Preference -> Default 'en'
  const urlLang = getUrlLang();
  let currentLang = urlLang || localStorage.getItem('lang') || (navigator.language.startsWith('pt') ? 'pt' : 'en');
  
  // Ensure it's a supported language, otherwise fallback to 'en'
  if (!supportedLanguages[currentLang]) currentLang = 'en';

  // If URL had a valid language, save it to localStorage
  if (urlLang && supportedLanguages[urlLang]) {
    localStorage.setItem('lang', urlLang);
  }

  // Update URL with current language if not already set
  if (!urlLang) {
    updateUrlLang(currentLang);
  }

  // Initialize
  updateLanguage(currentLang);

  // Function to fetch JSON and update DOM
  async function updateLanguage(lang) {
    try {
      // Fetch the JSON file (assumes locale/locale.en.json structure)
      // Using toLowerCase() to ensure filename matches convention (e.g., locale.en.json)
      const response = await fetch(`locale/locale.${lang.toLowerCase()}.json`);
      
      if (!response.ok) {
        throw new Error(`Could not load language file: ${lang}`);
      }

      const translations = await response.json();

      // 1. Update elements with data-i18n (Text/HTML)
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const value = getNestedTranslation(translations, key);
        if (value) {
          // Use innerHTML to support bold/italics in text (e.g. <strong>)
          el.innerHTML = value; 
        }
      });

      // 2. Update elements with data-i18n-placeholder (Inputs)
      document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        const value = getNestedTranslation(translations, key);
        if (value) {
          el.setAttribute('placeholder', value);
        }
      });

      // 3. Update State
      currentLang = lang;
      localStorage.setItem('lang', lang);
      updateUrlLang(lang); // Keep URL in sync with selected language
      document.documentElement.lang = lang; // Accessibility update
      
      // Expose translations globally for other components (e.g., toggle buttons)
      window.currentTranslations = translations;

      // 4. Update Resume link to include language parameter
      const resumeLink = document.querySelector('a[href="Matheus-Schumacher-Resume.html"]');
      if (resumeLink) {
        resumeLink.href = `Matheus-Schumacher-Resume.html?lang=${lang}`;
      }

      // 5. Re-render Language Dropdown Options
      renderLanguageOptions();

    } catch (error) {
      console.error('Translation error:', error);
    }
  }

  // Helper to access "nav.home" inside JSON objects
  function getNestedTranslation(obj, path) {
    return path.split('.').reduce((prev, curr) => {
      return (prev && prev[curr]) ? prev[curr] : null;
    }, obj);
  }

  // Function to render dropdown options excluding current language
  function renderLanguageOptions() {
    const optionsContainer = document.getElementById('language-options');
    if (!optionsContainer) return;

    optionsContainer.innerHTML = ''; // Clear existing

    Object.keys(supportedLanguages).forEach(langCode => {
      // Logic: You can either show all or hide the current one. 
      // Here we implement the user request: Show options to switch to.
      if (langCode !== currentLang) {
        const link = document.createElement('a');
        link.href = "#";
        // Add flag icon if desired, e.g.: <img src="img/${langCode}.png" class="icon">
        link.innerHTML = supportedLanguages[langCode]; 
        
        link.addEventListener('click', (e) => {
          e.preventDefault();
          updateLanguage(langCode);
          
          // Close dropdown after selection
          optionsContainer.classList.remove('show');
        });

        optionsContainer.appendChild(link);
      }
    });
  }

  // ==================================================
  // 2. DROPDOWNS (Generalized for Contact & Language)
  // ==================================================
  const dropdowns = document.querySelectorAll('.dropdown');

  dropdowns.forEach(dropdown => {
    const toggle = dropdown.querySelector('a');
    const content = dropdown.querySelector('.dropdown-content');

    if (toggle && content) {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent immediate closing by window click

        // Close all other open dropdowns first
        document.querySelectorAll('.dropdown-content').forEach(c => {
          if (c !== content) c.classList.remove('show');
        });

        // Toggle current
        content.classList.toggle('show');
      });

      // CRITICAL FIX: Stop propagation on dropdown content clicks
      // This prevents the window click handler from closing the dropdown
      content.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }
  });

  // Close ANY dropdown when clicking outside (but NOT inside dropdown content)
  window.addEventListener('click', (e) => {
    // Only close if not clicking inside a dropdown
    if (!e.target.closest('.dropdown')) {
      document.querySelectorAll('.dropdown-content').forEach(content => {
        content.classList.remove('show');
      });
    }
  });


  // ==========================
  // Dynamic year
  // ==========================
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // ==========================
  // Light/dark theme
  // ==========================
  const toggle = document.getElementById('themeToggle');
  if (toggle) {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      document.body.classList.add('light');
    }

    function setPressed() {
      const isLight = document.body.classList.contains('light');
      toggle.setAttribute('aria-pressed', String(isLight));
    }
    setPressed();

    toggle.addEventListener('click', () => {
      document.body.classList.toggle('light');
      localStorage.setItem(
        'theme',
        document.body.classList.contains('light') ? 'light' : 'dark'
      );
      setPressed();
    });
  }

  // ==========================
  // Form (simulation)
  // ==========================
  const form = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (form && formStatus) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      formStatus.textContent = 'Sending…';
      await new Promise((r) => setTimeout(r, 900));
      form.reset();
      formStatus.textContent = 'Message sent!';
      setTimeout(() => (formStatus.textContent = ''), 3000);
    });
  }

  // =============================================
  // Owl Carousel: Trajectory, Skills and Experience
  // =============================================
  if (window.jQuery) {
    // Capture skill cards globally before Owl Carousel modifies DOM
    window.allSkillCards = [];
    $('#habilidades-carousel .habilidade-card').each(function() {
      window.allSkillCards.push({
        html: $(this).prop('outerHTML'),
        element: $(this).clone(true)
      });
    });

    $('#trajetoria-carousel').owlCarousel({
      items: 1,
      loop: true,
      nav: false,
      dots: true
    });

    $('#habilidades-carousel').owlCarousel({
      items: 1,
      loop: true,
      nav: true,
      dots: true,
      margin: 20,
      autoHeight: true, // Make height flexible based on content
      responsive: {
        0: { items: 1 },
        768: { items: 1 },
        1024: { items: 2 }
      }
    });

    // Experience carousel initialization
    $('.cards-container').owlCarousel({
      loop: false,
      margin: 30,
      nav: true,
      dots: true,
      items: 2,
      responsive: {
        0: { items: 1 },
        768: { items: 2 },
        1024: { items: 2 }
      }
    }).on('initialized.owl.carousel', function() {
        setTimeout(() => {
          $('.card').each(function() {
            const card = $(this);
            const backContent = card.find('.card-back-content');
            const backBg = card.find('.card-back-bg');
            const frontImg = card.find('.card-front img.frente');

            function getFrontHeight() {
              return card.find('.card-front').outerHeight(true) || 672;
            }

            function syncToFront() {
              const fh = getFrontHeight();
              card.css('min-height', fh + 'px');
              if (backBg.length) backBg.css('height', fh + 'px');
            }

            if (backBg.length) {
              backBg.css({
                'background-size': 'cover',
                'background-position': 'center center',
                'background-repeat': 'no-repeat',
                'width': '100%'
              });
            }

            if (frontImg.length) {
              frontImg.on('load', syncToFront);
              if (frontImg[0].complete) syncToFront();
            } else {
              syncToFront();
            }

            function openBack() {
              card.addClass('flipped');
              requestAnimationFrame(() => {
                const contentHeight = backContent.length ? backContent[0].scrollHeight : 0;
                const reservedBottom = 220;
                const neededHeight = Math.max(getFrontHeight(), contentHeight + reservedBottom + 40);
                card.css('min-height', neededHeight + 'px');
                if (backBg.length) backBg.css('height', neededHeight + 'px');
              });
            }

            function closeBack() {
              card.removeClass('flipped');
              requestAnimationFrame(() => {
                const fh = getFrontHeight();
                card.css('min-height', fh + 'px');
                if (backBg.length) backBg.css('height', fh + 'px');
              });
            }

            card.on('mouseenter', function() {
              openBack();
            });
            
            card.on('mouseleave', function() {
              if (!card.hasClass('clicked')) {
                closeBack();
              }
            });
            
            card.click(function(e) {
              e.stopPropagation();
              if (card.hasClass('clicked')) {
                card.removeClass('clicked');
                closeBack();
              } else {
                card.addClass('clicked');
                openBack();
              }
            });

            card.closest('.owl-carousel').on('drag.owl.carousel', function() {
              card.removeClass('flipped');
              const fh = getFrontHeight();
              card.css('min-height', fh + 'px');
              if (backBg.length) backBg.css('height', fh + 'px');
            });
          });
        }, 100); 
      });

    // Resize handler
    $(window).on('resize', function() {
      $('.card').each(function() {
        const card = $(this);
        const frontH = card.find('.card-front').outerHeight(true) || 672;
        const backContent = card.find('.card-back-content');
        const backBg = card.find('.card-back-bg');

        if (card.hasClass('flipped')) {
          const contentH = backContent.length ? backContent[0].scrollHeight : 0;
          const reservedBottom = 220;
          const needed = Math.max(frontH, contentH + reservedBottom + 40);
          card.css('min-height', needed + 'px');
          if (backBg.length) backBg.css('height', needed + 'px');
        } else {
          card.css('min-height', frontH + 'px');
          if (backBg.length) backBg.css('height', frontH + 'px');
        }
      });
    });
  }

  // ====================================================
  // "My Complete Trajectory" Button
  // ====================================================
  const botao = document.getElementById("toggle-trajetoria");
  const carouselContainer = document.querySelector(".carousel-container");
  const resumida = document.querySelector(".trajetoria-resumida");

  if (botao && carouselContainer && resumida) {
    botao.addEventListener("click", () => {
      if (carouselContainer.style.display === "none") {
        carouselContainer.style.display = "block";
        resumida.style.display = "none";
        // Note: We don't hardcode text here anymore to avoid overwriting translations.
        // The data-i18n system will handle the text updates, but if you need dynamic text logic:
        // You might need distinct keys for 'More Details' vs 'Show Summary' in JSON.
      } else {
        carouselContainer.style.display = "none";
        resumida.style.display = "block";
      }
    });
  }

  // ====================================================
  // Skills Tooltip - Level Guide
  // ====================================================
  const icon = document.getElementById('habilidades-icone');
  const tooltip = document.getElementById('habilidades-tooltip');
  const closeBtn = document.getElementById('tooltip-close');

  if (icon && tooltip && closeBtn) {
    // Move tooltip to body level for proper z-index handling
    document.body.appendChild(tooltip);
    
    // Toggle tooltip visibility on icon click
    icon.addEventListener('click', (e) => {
      e.stopPropagation();
      tooltip.classList.toggle('show');
    });

    // Close button handler
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      tooltip.classList.remove('show');
    });

    // Prevent clicks inside tooltip from closing it
    tooltip.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  // ====================================================
  // Audio Player (TTS)
  // ====================================================
  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  let currentAudio = null;
  let currentPlayer = null;
  let currentToggle = null;

  document.querySelectorAll('.tts-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const audioFile = btn.getAttribute('data-audio');
      const icon = btn.querySelector('i');

      if (!currentPlayer || currentToggle !== btn) {
        if (currentPlayer) currentPlayer.remove();
        if (currentAudio) currentAudio.pause();

        currentAudio = new Audio(audioFile);
        currentToggle = btn;

        currentPlayer = document.createElement("div");
        currentPlayer.className = "tts-player";
        currentPlayer.innerHTML = `
          <button class="tts-play"><i class="fa-solid fa-stop"></i></button>
          <button class="tts-repeat"><i class="fa-solid fa-repeat"></i></button>
          <div class="tts-progress">
            <input type="range" class="tts-seek" value="0" min="0" max="100">
            <div class="tts-time">
              <span class="tts-current">0:00</span> / <span class="tts-duration">0:00</span>
            </div>
          </div>
        `;
        btn.parentElement.appendChild(currentPlayer);

        const playBtn = currentPlayer.querySelector(".tts-play");
        const repeatBtn = currentPlayer.querySelector(".tts-repeat");
        const seek = currentPlayer.querySelector(".tts-seek");
        const currentTimeEl = currentPlayer.querySelector(".tts-current");
        const durationEl = currentPlayer.querySelector(".tts-duration");

        currentAudio.play();
        currentAudio.addEventListener("loadedmetadata", () => {
          durationEl.textContent = formatTime(currentAudio.duration);
        });

        currentAudio.addEventListener("timeupdate", () => {
          const percent = (currentAudio.currentTime / currentAudio.duration) * 100;
          seek.value = percent;
          currentTimeEl.textContent = formatTime(currentAudio.currentTime);

          seek.style.background = `linear-gradient(to right, #00c3ff 0%, #00c3ff ${percent}%, #aaa ${percent}%, #aaa 100%)`;
          if(document.body.classList.contains('light')) {
            seek.style.background = `linear-gradient(to right, #0077ff 0%, #0077ff ${percent}%, #ccc ${percent}%, #ccc 100%)`;
          }
        });

        seek.addEventListener("input", () => {
          currentAudio.currentTime = (seek.value / 100) * currentAudio.duration;
        });

        playBtn.addEventListener("click", () => {
          if (currentAudio.paused) {
            currentAudio.play();
            playBtn.querySelector("i").className = "fa-solid fa-stop";
          } else {
            currentAudio.pause();
            playBtn.querySelector("i").className = "fa-solid fa-play";
          }
        });

        repeatBtn.addEventListener("click", () => {
          currentAudio.currentTime = 0;
          currentAudio.play();
        });

        currentAudio.addEventListener("ended", () => {
          playBtn.querySelector("i").className = "fa-solid fa-play";
        });

        icon.className = "fa-solid fa-caret-down";
      }
      else {
        if (currentPlayer.style.display === "none") {
          currentPlayer.style.display = "flex";
          icon.className = "fa-solid fa-caret-down";
        } else {
          currentPlayer.style.display = "none";
          icon.className = "fa-solid fa-volume-high";
        }
      }
    });
  });

  let canPlayHover = false;

  document.addEventListener('click', () => {
    canPlayHover = true;
  }, { once: true });

  document.querySelectorAll('.projeto-img').forEach(img => {
    img.addEventListener('mouseenter', () => {
      if (!canPlayHover) return;
      const hoverSound = new Audio('audio/hoverprojetos.wav');
      hoverSound.volume = 0.2;
      hoverSound.play().catch(err => console.log(err));
    });
  });

  // ==========================
  // Schedule Form Logic
  // ==========================
  const agendarBtn = document.getElementById("agendar-btn");
  if(agendarBtn) {
      agendarBtn.addEventListener("click", () => {
        const formDiv = document.getElementById("form-agendamento");
        if(formDiv) formDiv.style.display = "block";
      });
  }

  const enviarAgendamentoBtn = document.getElementById("enviar-agendamento");
  if(enviarAgendamentoBtn) {
      enviarAgendamentoBtn.addEventListener("click", async (e) => {
        e.preventDefault();

        const data = document.getElementById("data").value;
        const hora = document.getElementById("hora").value;
        const mensagem = document.getElementById("mensagem")?.value || "";
        const status = document.getElementById("status");

        status.innerText = "Processing...";

        if (!data || !hora) {
          status.innerText = "⚠️ Fill in date and time.";
          return;
        }

        try {
          const res = await fetch("https://portfolio-1-344x.onrender.com/agendar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data, hora, mensagem })
          });

          let json;
          try {
            json = await res.json();
          } catch {
            json = {}; 
          }

          if (res.ok) {
            status.innerText = "✅ Event created successfully!";
            setTimeout(() => {
              document.getElementById("form-agendamento").style.display = "none";
              status.innerText = ""; 
            }, 2000);
            
            document.getElementById("data").value = "";
            document.getElementById("hora").value = "";
            if (document.getElementById("mensagem")) document.getElementById("mensagem").value = "";

          } else {
            status.innerText = "❌ Error: " + (json.error || JSON.stringify(json));
            console.error("Backend error:", json);
          }

        } catch (err) {
          console.error(err);
          status.innerText = "❌ " + (err.message || "Unknown error");
        }
      });
  }

  // ==========================
  // Floating Spotify Player
  // ==========================
  const spotifyLinks = document.querySelectorAll('a.spotify');
  const spotifyPlayer = document.getElementById('spotify-player');
  const spotifyClose = document.getElementById('close-spotify');
  const spotifyHeaderBtn = document.getElementById('spotify-header-btn');

  if (spotifyLinks && spotifyPlayer && spotifyClose) {
    spotifyLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        spotifyPlayer.classList.toggle('show');
        
        if (spotifyHeaderBtn && spotifyHeaderBtn.style.display === 'none') {
          spotifyHeaderBtn.style.display = 'inline-block';
        }
      });
    });

    spotifyClose.addEventListener('click', () => {
      spotifyPlayer.classList.remove('show');
    });
  }

  if (spotifyHeaderBtn && spotifyPlayer) {
    spotifyHeaderBtn.addEventListener('click', () => {
      spotifyPlayer.classList.toggle('show');
    });
  }

  // ==========================
  // SKILLS FILTER
  // ==========================
  (function() {
    const searchInput = document.getElementById('skills-search');
    const activeFiltersContainer = document.getElementById('active-filters');
    if(!searchInput || !activeFiltersContainer) return;

    const suggestionBox = document.createElement('div');
    suggestionBox.classList.add('suggestions');
    searchInput.parentNode.appendChild(suggestionBox);

    let activeFilters = [];
    let originalCards = []; 

    // Initialize originalCards from global capture
    if (window.allSkillCards && window.allSkillCards.length > 0) {
      originalCards = window.allSkillCards;
    } else {
      setTimeout(function() {
        const carousel = $('#habilidades-carousel');
        if (carousel.hasClass('owl-loaded')) {
          carousel.find('.owl-item:not(.cloned) .habilidade-card').each(function() {
            originalCards.push({
              html: $(this).prop('outerHTML'),
              element: $(this).clone(true)
            });
          });
        }
      }, 500);
    }

    function normalizeText(text) {
      return text.toLowerCase().replace(/[^a-z0-9]/g, '');
    }

    const allOptionsOriginal = {};
    document.querySelectorAll('.habilidade-card').forEach(card => {
      const title = card.querySelector('.skill-title').textContent;
      allOptionsOriginal[normalizeText(title)] = title;

      card.querySelectorAll('.skill-header span:first-child').forEach(span => {
        const skillName = span.textContent;
        allOptionsOriginal[normalizeText(skillName)] = skillName;
      });
    });

    const allOptions = Object.keys(allOptionsOriginal);

    function createFilterBtn(text) {
      const btn = document.createElement('div');
      btn.classList.add('filter-btn');
      btn.textContent = text;

      const removeSpan = document.createElement('span');
      removeSpan.textContent = '×';
      removeSpan.classList.add('remove');
      removeSpan.addEventListener('click', () => {
        activeFilters = activeFilters.filter(f => f !== normalizeText(text));
        btn.remove();
        filterSkills();
      });

      btn.appendChild(removeSpan);
      activeFiltersContainer.appendChild(btn);
      filterSkills();
    }

    function filterSkills() {
      const carousel = $('#habilidades-carousel');
      
      if (carousel.hasClass('owl-loaded')) {
        carousel.trigger('destroy.owl.carousel');
      }
      carousel.removeClass('owl-carousel owl-loaded');
      carousel.empty();
      carousel.addClass('owl-carousel');

      if (activeFilters.length === 0) {
        if (originalCards.length === 0) return;

        originalCards.forEach(card => {
          const $clonedCard = card.element.clone(true);
          $clonedCard.find('.skill').show();
          carousel.append($clonedCard);
        });

        carousel.owlCarousel({
          items: 1,
          loop: true,
          nav: true,
          dots: true,
          margin: 20,
          responsive: {
            0: { items: 1 },
            768: { items: 1 },
            1024: { items: 2 }
          }
        });

        setTimeout(() => {
          carousel.trigger('refresh.owl.carousel');
        }, 100);
        return;
      }

      const visibleCards = [];

      originalCards.forEach(cardData => {
        const $card = cardData.element.clone(true);
        const $skills = $card.find('.skill');
        let visibleCount = 0;

        $skills.each(function() {
          const title = $card.find('.skill-title').text();
          const skillName = $(this).find('.skill-header span:first-child').text();

          const matches = activeFilters.every(f => 
            normalizeText(title).startsWith(f) || normalizeText(skillName).startsWith(f)
          );

          if (matches) {
            $(this).show();
            visibleCount++;
          } else {
            $(this).hide();
          }
        });

        if (visibleCount > 0) {
          visibleCards.push($card);
        }
      });

      if (visibleCards.length > 0) {
        visibleCards.forEach($card => {
          carousel.append($card);
        });

        carousel.owlCarousel({
          items: 1,
          loop: visibleCards.length > 1,
          nav: true,
          dots: true,
          margin: 20,
          responsive: {
            0: { items: 1 },
            768: { items: 1 },
            1024: { items: Math.min(2, visibleCards.length) }
          }
        });

        setTimeout(() => {
          carousel.trigger('refresh.owl.carousel');
        }, 100);
      } else {
        carousel.html('<div style="text-align:center; padding:2rem; color:var(--muted);">No skills found.</div>');
      }
    }

    searchInput.addEventListener('input', () => {
      const value = normalizeText(searchInput.value.trim());
      suggestionBox.innerHTML = '';
      if (!value) return;

      const matches = allOptions
        .filter(opt => opt.startsWith(value) && !activeFilters.includes(opt))
        .slice(0, 5);

      matches.forEach(match => {
        const div = document.createElement('div');
        div.classList.add('suggestion-item');
        div.textContent = allOptionsOriginal[match];

        div.addEventListener('click', () => {
          if (!activeFilters.includes(match)) {
            activeFilters.push(match);
            createFilterBtn(allOptionsOriginal[match]);
          }
          searchInput.value = '';
          suggestionBox.innerHTML = '';
        });

        suggestionBox.appendChild(div);
      });
    });

    searchInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const value = normalizeText(searchInput.value.trim());
        if (!value) return;

        const hasMatch = allOptions.some(opt => opt.startsWith(value));

        if (!hasMatch) {
          searchInput.value = '';
          suggestionBox.innerHTML = '';
          return;
        }

        if (!activeFilters.includes(value)) {
          activeFilters.push(value);
          createFilterBtn(allOptionsOriginal[value] || searchInput.value);
        }

        searchInput.value = '';
        suggestionBox.innerHTML = '';
      }
    });
  })();

  // ==========================
  // Mouse Glow
  // ==========================
  const glow = document.getElementById('mouse-glow');
  if(glow) {
    document.addEventListener('mousemove', (e) => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
      glow.classList.add('visible');
    });
  }

  // ==========================
  // SCROLL REVEAL ANIMATIONS
  // ==========================
  const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -80px 0px"
  };

  // Observer for reveal elements
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, revealOptions);

  // Observe all reveal elements
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
    revealObserver.observe(el);
  });

  // Observer for sections (header animations)
  const sectionOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('section-visible');
        entry.target.classList.add('show');
        sectionObserver.unobserve(entry.target);
      }
    });
  }, sectionOptions);

  document.querySelectorAll('section').forEach(section => {
    section.classList.add('hidden-section');
    sectionObserver.observe(section);
  });

  // Auto-add reveal classes to project cards with stagger
  document.querySelectorAll('.projeto-card').forEach((card, index) => {
    card.classList.add('reveal-scale');
    card.classList.add(`stagger-${Math.min(index % 6 + 1, 6)}`);
    revealObserver.observe(card);
  });

  // Auto-add reveal classes to skill cards with stagger
  document.querySelectorAll('.skill').forEach((skill, index) => {
    skill.classList.add('reveal');
    skill.classList.add(`stagger-${Math.min(index % 4 + 1, 4)}`);
    revealObserver.observe(skill);
  });

  // ==========================
  // See More Projects Toggle
  // ==========================
  const seeMoreBtn = document.getElementById('see-more-projects');
  const projectsGrid = document.getElementById('projects-grid');
  
  if (seeMoreBtn && projectsGrid) {
    let isExpanded = false;
    
    seeMoreBtn.addEventListener('click', () => {
      isExpanded = !isExpanded;
      
      if (isExpanded) {
        projectsGrid.classList.add('show-all');
        seeMoreBtn.classList.add('expanded');
        // Update button text
        const btnText = seeMoreBtn.querySelector('i');
        if (btnText) {
          seeMoreBtn.innerHTML = '<i class="fa-solid fa-chevron-up"></i> Show Less';
        }
      } else {
        projectsGrid.classList.remove('show-all');
        seeMoreBtn.classList.remove('expanded');
        // Restore button text
        seeMoreBtn.innerHTML = '<i class="fa-solid fa-chevron-down"></i> See More Projects';
        
        // Scroll to projects section
        const projectsSection = document.getElementById('projetos');
        if (projectsSection) {
          projectsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  }

  // ==========================
  // Custom Audio Player
  // ==========================
  document.querySelectorAll('.custom-audio-player').forEach(player => {
    const audioSrc = player.dataset.src;
    const audio = new Audio(audioSrc);
    
    const playBtn = player.querySelector('.audio-play-btn');
    const playIcon = playBtn.querySelector('i');
    const progressBar = player.querySelector('.audio-progress-bar');
    const progressFill = player.querySelector('.audio-progress-fill');
    const progressThumb = player.querySelector('.audio-progress-thumb');
    const currentTimeEl = player.querySelector('.audio-current');
    const durationEl = player.querySelector('.audio-duration');
    const volumeBtn = player.querySelector('.audio-volume-btn');
    const volumeIcon = volumeBtn.querySelector('i');
    
    // Format time as M:SS
    function formatTime(seconds) {
      if (isNaN(seconds)) return '0:00';
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    // Update progress bar and time
    function updateProgress() {
      const percent = (audio.currentTime / audio.duration) * 100 || 0;
      progressFill.style.width = percent + '%';
      progressThumb.style.left = percent + '%';
      currentTimeEl.textContent = formatTime(audio.currentTime);
    }
    
    // Set duration when metadata loads
    audio.addEventListener('loadedmetadata', () => {
      durationEl.textContent = formatTime(audio.duration);
    });
    
    // Update progress during playback
    audio.addEventListener('timeupdate', updateProgress);
    
    // Play/Pause toggle
    playBtn.addEventListener('click', () => {
      if (audio.paused) {
        // Pause all other audio players first
        document.querySelectorAll('.custom-audio-player').forEach(otherPlayer => {
          if (otherPlayer !== player) {
            const otherAudio = otherPlayer._audio;
            if (otherAudio && !otherAudio.paused) {
              otherAudio.pause();
              const otherBtn = otherPlayer.querySelector('.audio-play-btn');
              otherBtn.classList.remove('playing');
              otherBtn.querySelector('i').className = 'fa-solid fa-play';
            }
          }
        });
        
        audio.play();
        playBtn.classList.add('playing');
        playIcon.className = 'fa-solid fa-pause';
      } else {
        audio.pause();
        playBtn.classList.remove('playing');
        playIcon.className = 'fa-solid fa-play';
      }
    });
    
    // Store audio reference on player element
    player._audio = audio;
    
    // Reset on end
    audio.addEventListener('ended', () => {
      playBtn.classList.remove('playing');
      playIcon.className = 'fa-solid fa-play';
      progressFill.style.width = '0%';
      progressThumb.style.left = '0%';
    });
    
    // Seek on progress bar click
    progressBar.addEventListener('click', (e) => {
      const rect = progressBar.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      audio.currentTime = percent * audio.duration;
      updateProgress();
    });
    
    // Volume slider
    const volumeSlider = player.querySelector('.audio-volume-slider');
    if (volumeSlider) {
      volumeSlider.addEventListener('input', (e) => {
        const value = e.target.value / 100;
        audio.volume = value;
        audio.muted = value === 0;
        updateVolumeIcon(value);
      });
    }
    
    // Update volume icon based on level
    function updateVolumeIcon(volume) {
      if (volume === 0 || audio.muted) {
        volumeBtn.classList.add('muted');
        volumeIcon.className = 'fa-solid fa-volume-xmark';
      } else if (volume < 0.5) {
        volumeBtn.classList.remove('muted');
        volumeIcon.className = 'fa-solid fa-volume-low';
      } else {
        volumeBtn.classList.remove('muted');
        volumeIcon.className = 'fa-solid fa-volume-high';
      }
    }
    
    // Volume mute toggle
    volumeBtn.addEventListener('click', () => {
      audio.muted = !audio.muted;
      if (audio.muted) {
        volumeBtn.classList.add('muted');
        volumeIcon.className = 'fa-solid fa-volume-xmark';
      } else {
        updateVolumeIcon(audio.volume);
      }
    });
    
    // Menu toggle
    const menuBtn = player.querySelector('.audio-menu-btn');
    const menu = player.querySelector('.audio-menu');
    if (menuBtn && menu) {
      menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.classList.toggle('show');
      });
      
      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && !menuBtn.contains(e.target)) {
          menu.classList.remove('show');
        }
      });
    }
    
    // Playback speed controls
    const speedBtns = player.querySelectorAll('.speed-btn');
    speedBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const speed = parseFloat(btn.dataset.speed);
        audio.playbackRate = speed;
        // Update active state
        speedBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  });

  // ==========================
  // Music Player Module
  // ==========================
  (function initMusicPlayer() {
    // Cloudflare R2 base URL for songs
    const R2_BASE_URL = 'https://pub-e178ae989afa4f2dab400c0b6d9d708f.r2.dev/';
    
    // Album covers data - MUST match exact webp filenames in img/songs-cover/
    // These are also used as R2 mp3 filenames (ensure R2 files match these names)
    const albumCovers = [
      "A Garota de Neon e Nuvem", "A Saga do Zé Bodim", "A Teoria do Chão",
      "A vida é ou não é o que é", "Abyssborne", "Aftershock",
      "Almost Is Not a Game", "Amanhã Eu Salvo o Mundo", "Aquário de Estrelas",
      "B-Sides & Rarities", "Blue Noise in My Bones", "Brasil, Aqui Tudo É Normal",
      "Cassette Tape Summer", "Castelo de Areia (Antes da Maré)", "Celestial Whisper",
      "Chasing the Neon Gold", "Concrete & Ivy", "Confetti in the Dark",
      "Dreamcatcher’s Paradox", "Dust Mote Ballet",
      "Echoes of the Rising", "Echoes of the West (Stone & Fire)", "ERROR 404_ YOUTH",
      "Even in Ash, The Heartsong Sings", "Exploding Hearts",
      "Fire from the Mountain (Prometheus Unbound)", "Furacão de All Star",
      "Garota Sonhadora", "Glitch in the Gold", "Golden Resonance",
      "Gravity & Dust (The Weight of Us)", "Half-life Of You", "If you ever come back here",
      "Into the Eye", "Iron Boulevards", "JOMO (Joy of Missing Out)", "Kingdom of this Broken Girl",
      "Lantern of the Lost", "Laplace’s Demon (The Glitch in the Math)", "Luminous Threads",
      "Meteoros Apaixonados", "Moonlight in My Bones", "O Astrounauta de Quintal",
      "O Céu Também Sorri", "O Mundo Ficou Pequeno Demais Para Mim", "Off the Scales",
      "Overclocked (Into the Zone)", "Pajama Couture", "Paper Hearts & Gasoline Vibe",
      "Paper Lanterns (The Echo of Us)", "Paper Satellites", "Por Acaso (Você Chegou)",
      "Prism of the Rain (Niji no Kakera)", "Requiem For A Lier", "Running Forward",
      "Saturated", "Scriptless (The Misfit Musical)", "Starve the Dark, Feed the Fire",
      "Static & Gold", "Static Blue", "Stitched in the Quiet", "The Architect of Zero",
      "The Armor I Built", "The Art of Falling Up", "The Choir Inside the Black Hole",
      "The Clockwork Galaxy", "The Clockwork Renegade", "The Demons Wearing my Name",
      "The Eternal Game", "The Ghost of the Midnight Rail",
      "The Girl Who Rewrote the Moon (Legend of the Ink)", "The Gravity of Sparks",
      "The Ink of Goodbye (Sayonara no Ink)", "The Last Analog Heart",
      "The Lost & Found Department Vibe", "The Midnight Carousel",
      "The Person I'd Be If No One Was Watching", "The Prism Thief (Painting the Grey)",
      "The River That Remembered", "The Shape of Falling Light", "The Single Stitch Society",
      "The Unmapped Shore", "Theseus in My Skin", "Velocity of Light", "Velvet & Voltage",
      "Você deveria largar o League of Legends", "What Happened to Gen Z",
      "Wild Electric", "World in Slow Motion",
      "ノイズの海、酸素の花 (Noizu no Umi, Sanso no Hana)"
    ];
    
    // Normalize string - for display purposes only
    function normalizeForMatch(str) {
      return str.toLowerCase()
        .replace(/\.(mp3|wav|webp|jpg|png|jpeg)$/i, '')
        .replace(/[''`´]/g, "'")
        .replace(/[_-]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    }
    
    // Format title for display
    function formatTitle(str) {
      return str
        .replace(/\.(webp|jpg|png|jpeg|mp3)$/i, '')
        .replace(/[_-]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    }
    
    // R2 audio filenames (Exact names on Cloudflare R2 server - SOURCE OF TRUTH for audio)
    // Do NOT rename these unless you changed the actual files on Cloudflare
    const r2AudioFiles = [
      "A Garota de Neon e Nuvem", "A Saga do Zé Bodim", "A Teoria do Chão",
      "A vida é ou não é o que é", "Abyssborne", "Aftershock",
      "Almost Is Not a Game", "Amanhã Eu Salvo o Mundo", "Aquário de Estrelas",
      "B-Sides & Rarities", "Blue Noise in My Bones", "Brasil, Aqui Tudo É Normal",
      "Cassette Tape Summer", "Castelo de Areia (Antes da Maré)", "Celestial Whisper",
      "Chasing the Neon Gold", "Concrete & Ivy", "Confetti in the Dark",
      "The Demons Wearing My Name", "Dreamcatcher's Paradox", "Dust Mote Ballet",
      "Echoes of the Rising", "Echoes of the West (Stone & Fire)", "ERROR 404_ YOUTH",
      "Even in Ash, the Heartsong Sings", "Exploding Hearts",
      "Fire from the Mountain (Prometheus Unbound)", "Furacão de All Star",
      "Garota Sonhadora", "Glitch in the Gold", "Golden Resonance",
      "Gravity & Dust (The Weight of Us)", "Half-life Of You", "If you ever come back here",
      "Into the Eye", "Iron Boulevards", "JOMO (Joy Of Missing Out)", "Kingdom of this Broken Girl",
      "Lantern of the Lost", "Laplace's Demon (The Glitch in the Math)", "Luminous Threads",
      "Meteoros Apaixonados", "Moonlight in My Bones", "O Astrounauta de Quintal",
      "O Céu Também Sorri", "O Mundo Ficou Pequeno Demais Para Mim", "Off the Scales",
      "Overclocked (Into the Zone)", "Pajama Couture", "Paper Hearts & Gasoline",
      "Paper Lanterns (The Echo of Us)", "Paper Satellites", "Por Acaso (Você Chegou)",
      "Prism of the Rain (Niji no Kakera)", "Requiem For A Lier", "Running Foward",
      "Saturated", "Scriptless (The Misfit Musical)", "Starve the Dark, Feed the Fire",
      "Static & Gold", "Static Blue", "Stitched in the Quiet", "The Architect of Zero",
      "The Armor I Built", "The Art of Falling Up", "The Choir Inside the Black Hole",
      "The Clockwork Galaxy", "The Clockwork Renegade", "The Eternal Game",
      "The Ghost of the Midnight Rail", "The Girl Who Rewrote the Moon (Legend of the Ink)",
      "The Gravity of Sparks", "The Ink of Goodbye (Sayonara no Ink)", "The Last Analog Heart",
      "The Lost & Found Department Vibe", "The Midnight Carousel",
      "The Person I'd Be If No One Was Watching", "The Prism Thief (Painting the Grey)",
      "The River That Remembered", "The Shape of Falling Light", "The Single Stitch Society",
      "The Unmapped Shore", "Theseus in My Skin", "Velocity of Light", "Velvet & Voltage",
      "Você deveria largar o League of Legends", "What Happened to Gen Z",
      "Wild Electric", "World in Slow Motion",
      "ノイズの海、酸素の花 (Noizu no Umi, Sanso no Hana)"
    ];

    // Manual mappings for tricky cases (Cover Name -> R2 Name)
    const matchMappings = {
      "Running Forward": "Running Foward", // Typo in R2 file
      "Moonlight in My Bones": "Moonlight in My Bones", // Ensure exact match
      "Dreamcatcher’s Paradox": "Dreamcatcher’s Paradox" // Straight apostrophe to curly (U+2019)
    };

    // Find correct R2 filename (Smart Matching)
    function findR2Filename(coverName) {
      if (matchMappings[coverName]) return matchMappings[coverName];
      
      const normalizedCover = normalizeForMatch(coverName);
      
      // 1. Try exact normalized match
      for (const r2Name of r2AudioFiles) {
        if (normalizeForMatch(r2Name) === normalizedCover) {
          return r2Name;
        }
      }
      
      // 2. Try substring match (if R2 name is inside cover name or vice versa)
      // Solves: "Paper Hearts & Gasoline Vibe" (Cover) vs "Paper Hearts & Gasoline" (R2)
      for (const r2Name of r2AudioFiles) {
        const normR2 = normalizeForMatch(r2Name);
        if (normalizedCover.includes(normR2) || normR2.includes(normalizedCover)) {
          return r2Name; // Return the R2 filename immediately on match
        }
      }
      
      // Fallback: use the cover name if no match found (might 404)
      console.warn('No R2 match found for:', coverName);
      return coverName;
    }
    
    // Build song list - Connects Local Cover -> R2 Audio
    const songs = albumCovers.map(coverName => {
      const r2Filename = findR2Filename(coverName);
      return {
        title: formatTitle(coverName),
        coverPath: `img/songs-cover/${coverName}.webp`,
        audioUrl: `${R2_BASE_URL}${encodeURIComponent(r2Filename)}.mp3`
      };
    });
    
    // DOM Elements
    const sunoBtn = document.getElementById('suno-music-btn');
    const modalOverlay = document.getElementById('music-modal-overlay');
    const modal = document.getElementById('music-modal');
    const closeBtn = document.getElementById('close-modal-btn');
    const minimizeBtn = document.getElementById('minimize-modal-btn');
    const shuffleBtn = document.getElementById('shuffle-btn');
    const albumGrid = document.getElementById('music-album-grid');
    const musicPlayer = document.getElementById('music-player');
    const playerCover = document.getElementById('player-cover');
    const playerTitle = document.getElementById('player-title');
    const mainPlayBtn = document.getElementById('main-play-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const progressBar = document.getElementById('music-progress-bar');
    const progressFill = document.getElementById('music-progress-fill');
    const currentTimeEl = document.getElementById('current-time');
    const durationTimeEl = document.getElementById('duration-time');
    const miniPlayer = document.getElementById('mini-music-player');
    const miniPlayerTitle = document.getElementById('mini-player-title');
    const miniPlayBtn = document.getElementById('mini-play-btn');
    const miniPrevBtn = document.getElementById('mini-prev-btn');
    const miniNextBtn = document.getElementById('mini-next-btn');
    const expandPlayerBtn = document.getElementById('expand-player-btn');
    const spotifyPlayer = document.getElementById('spotify-player');
    
    // New elements for enhanced features
    const volumeBtn = document.getElementById('volume-btn');
    const volumeSlider = document.getElementById('player-volume-slider');
    const downloadBtn = document.getElementById('player-download-btn');
    const playlistToggleBtn = document.getElementById('playlist-toggle-btn');
    const playlistPanel = document.getElementById('playlist-panel');
    const playlistItems = document.getElementById('playlist-items');
    const playlistClearBtn = document.getElementById('playlist-clear-btn');
    const addPlaylistBtn = document.getElementById('add-playlist-btn');
    const speedBtns = document.querySelectorAll('.player-speed-control .speed-btn');
    
    if (!sunoBtn || !modal) return;
    
    // State
    let audio = new Audio();
    let currentSongIndex = -1;
    let isPlaying = false;
    let shuffleMode = false;
    let playedIndices = [];
    let userPlaylist = []; // Session-based playlist
    
    // Load playlist from localStorage
    try {
      const savedPlaylist = localStorage.getItem('sunoUserPlaylist');
      if (savedPlaylist) {
        userPlaylist = JSON.parse(savedPlaylist);
      }
    } catch (e) {
      console.warn('Failed to load playlist', e);
    }
    
    // Mobile View Management
    function setMobileView(view) {
      if (view === 'list') {
        document.body.classList.add('mobile-view-list');
        document.body.classList.remove('mobile-view-player');
      } else if (view === 'player') {
        document.body.classList.add('mobile-view-player');
        document.body.classList.remove('mobile-view-list');
      } else {
        document.body.classList.remove('mobile-view-player', 'mobile-view-list');
      }
    }
    
    // Generate album grid with star button for playlist
    function renderAlbumGrid() {
      albumGrid.innerHTML = '';
      songs.forEach((song, index) => {
        const isInPlaylist = userPlaylist.includes(index);
        const card = document.createElement('div');
        card.className = 'album-card';
        card.dataset.index = index;
        card.innerHTML = `
          <img src="${song.coverPath}" alt="${song.title}" loading="lazy">
          <button class="album-card-star ${isInPlaylist ? 'added' : ''}" data-index="${index}" title="${isInPlaylist ? 'Remove from Playlist' : 'Add to Playlist'}">
            <i class="fa-${isInPlaylist ? 'solid' : 'regular'} fa-star"></i>
          </button>
          <div class="album-card-overlay">
            <div class="album-card-title">${song.title}</div>
          </div>
          <div class="album-card-play">
            <i class="fa-solid fa-play"></i>
          </div>
        `;
        
        // Star button click - add/remove from playlist
        const starBtn = card.querySelector('.album-card-star');
        starBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          togglePlaylistItem(index);
        });
        
        // Card click - play song
        card.addEventListener('click', (e) => {
          if (!e.target.closest('.album-card-star')) {
            // setPlaylistMode(false); // Removed as requested or not needed
            playSong(index);
          }
        });
        
        albumGrid.appendChild(card);
      });
    }
    
    // Toggle song in playlist
    function togglePlaylistItem(index) {
      const pos = userPlaylist.indexOf(index);
      if (pos === -1) {
        userPlaylist.push(index);
      } else {
        userPlaylist.splice(pos, 1);
      }
      // Save to localStorage
      localStorage.setItem('sunoUserPlaylist', JSON.stringify(userPlaylist));
      
      updateStarButtons();
      // renderPlaylist(); // If using separate playlist view
    }
    
    // Update star buttons to reflect playlist state
    function updateStarButtons() {
      document.querySelectorAll('.album-card-star').forEach(btn => {
        const index = parseInt(btn.dataset.index);
        const isInPlaylist = userPlaylist.includes(index);
        btn.className = `album-card-star ${isInPlaylist ? 'added' : ''}`;
        btn.title = isInPlaylist ? 'Remove from Playlist' : 'Add to Playlist';
        btn.innerHTML = `<i class="fa-${isInPlaylist ? 'solid' : 'regular'} fa-star"></i>`;
      });
    }
    
    // Format time
    function formatTime(seconds) {
      if (isNaN(seconds)) return '0:00';
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    // Update progress
    function updateProgress() {
      const percent = (audio.currentTime / audio.duration) * 100 || 0;
      progressFill.style.width = percent + '%';
      currentTimeEl.textContent = formatTime(audio.currentTime);
    }
    
    // Update play button icons
    function updatePlayButtons() {
      const icon = isPlaying ? 'fa-pause' : 'fa-play';
      mainPlayBtn.querySelector('i').className = `fa-solid ${icon}`;
      miniPlayBtn.querySelector('i').className = `fa-solid ${icon}`;
    }
    
    // Update active card visual
    function updateActiveCard() {
      document.querySelectorAll('.album-card').forEach((card, i) => {
        card.classList.toggle('playing', i === currentSongIndex);
      });
    }
    
    // Hide Spotify embed
    function hideSpotify() {
      if (spotifyPlayer) {
        spotifyPlayer.style.display = 'none';
      }
    }
    
    // Show Spotify embed
    function showSpotify() {
      if (spotifyPlayer && !isPlaying) {
        spotifyPlayer.style.display = '';
      }
    }
    
    // Play song by index
    function playSong(index) {
      if (index < 0 || index >= songs.length) return;
      
      const song = songs[index];
      currentSongIndex = index;
      
      // Update UI
      playerCover.src = song.coverPath;
      playerTitle.textContent = song.title;
      miniPlayerTitle.textContent = song.title;
      musicPlayer.style.display = '';
      
      // Switch to player view on mobile
      setMobileView('player');
      
      // Track played songs for shuffle
      if (!playedIndices.includes(index)) {
        playedIndices.push(index);
        if (playedIndices.length >= songs.length) {
          playedIndices = [];
        }
      }
      
      // Hide Spotify
      hideSpotify();
      
      // Load and play
      audio.src = song.audioUrl;
      audio.load();
      audio.play().then(() => {
        isPlaying = true;
        updatePlayButtons();
        updateActiveCard();
      }).catch(err => {
        console.error('Playback error:', err);
      });
    }
    
    // Get next index (respects shuffle and playlist mode)
    function getNextIndex() {
      // Playlist mode - navigate through playlist
      if (playlistMode && userPlaylist.length > 0) {
        const currentPlaylistPos = userPlaylist.indexOf(currentSongIndex);
        if (currentPlaylistPos !== -1 && currentPlaylistPos < userPlaylist.length - 1) {
          return userPlaylist[currentPlaylistPos + 1];
        }
        // End of playlist - loop to start
        return userPlaylist[0];
      }
      
      // Shuffle mode
      if (shuffleMode) {
        const unplayed = songs.map((_, i) => i).filter(i => !playedIndices.includes(i) && i !== currentSongIndex);
        if (unplayed.length === 0) {
          playedIndices = [];
          return Math.floor(Math.random() * songs.length);
        }
        return unplayed[Math.floor(Math.random() * unplayed.length)];
      }
      
      // Normal mode
      return (currentSongIndex + 1) % songs.length;
    }
    
    // Get prev index (respects playlist mode)
    function getPrevIndex() {
      // Playlist mode - navigate through playlist
      if (playlistMode && userPlaylist.length > 0) {
        const currentPlaylistPos = userPlaylist.indexOf(currentSongIndex);
        if (currentPlaylistPos > 0) {
          return userPlaylist[currentPlaylistPos - 1];
        }
        // Start of playlist - loop to end
        return userPlaylist[userPlaylist.length - 1];
      }
      
      // Shuffle mode
      if (shuffleMode) {
        return Math.floor(Math.random() * songs.length);
      }
      
      // Normal mode
      return (currentSongIndex - 1 + songs.length) % songs.length;
    }
    
    // Audio events
    audio.addEventListener('loadedmetadata', () => {
      durationTimeEl.textContent = formatTime(audio.duration);
    });
    
    audio.addEventListener('timeupdate', updateProgress);
    
    audio.addEventListener('ended', () => {
      playSong(getNextIndex());
    });
    
    // Progress bar seek
    progressBar.addEventListener('click', (e) => {
      const rect = progressBar.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      audio.currentTime = percent * audio.duration;
    });
    
    // Play/Pause toggle
    function togglePlay() {
      if (currentSongIndex === -1 && songs.length > 0) {
        playSong(0);
        return;
      }
      
      if (isPlaying) {
        audio.pause();
        isPlaying = false;
        showSpotify();
      } else {
        audio.play();
        isPlaying = true;
        hideSpotify();
      }
      updatePlayButtons();
    }
    
    // Event listeners
    mainPlayBtn.addEventListener('click', togglePlay);
    miniPlayBtn.addEventListener('click', togglePlay);
    
    prevBtn.addEventListener('click', () => playSong(getPrevIndex()));
    nextBtn.addEventListener('click', () => playSong(getNextIndex()));
    miniPrevBtn.addEventListener('click', () => playSong(getPrevIndex()));
    miniNextBtn.addEventListener('click', () => playSong(getNextIndex()));
    
    shuffleBtn.addEventListener('click', () => {
      shuffleMode = !shuffleMode;
      shuffleBtn.classList.toggle('active', shuffleMode);
      shuffleBtn.style.color = shuffleMode ? 'var(--accent)' : '';
    });
    
    // Modal controls
    function openModal() {
      modal.classList.add('show');
      modalOverlay.classList.add('show');
      miniPlayer.classList.remove('show');
      hideSpotify();
    }
    
    function closeModal() {
      modal.classList.remove('show');
      modalOverlay.classList.remove('show');
      // Close button = stop playback, no mini player
      if (isPlaying) {
        audio.pause();
        isPlaying = false;
        updatePlayButtons();
      }
      miniPlayer.classList.remove('show');
      showSpotify();
    }
    
    function minimizeModal() {
      modal.classList.remove('show');
      modalOverlay.classList.remove('show');
      // Minimize = show mini player with current song
      if (currentSongIndex !== -1) {
        miniPlayer.classList.add('show');
      }
    }
    
    // Close mini player and stop playback
    function closeMiniPlayer() {
      miniPlayer.classList.remove('show');
      if (isPlaying) {
        audio.pause();
        isPlaying = false;
        updatePlayButtons();
      }
      showSpotify();
    }
    
    sunoBtn.addEventListener('click', () => {
      if (modal.classList.contains('show')) {
        minimizeModal(); // Suno button minimizes (toggle), doesn't close
      } else {
        openModal();
      }
    });
    
    closeBtn.addEventListener('click', closeModal);
    minimizeBtn.addEventListener('click', minimizeModal);
    modalOverlay.addEventListener('click', minimizeModal); // Clicking overlay minimizes, not closes
    
    expandPlayerBtn.addEventListener('click', openModal);
    
    // Close button on mini player
    const miniCloseBtn = document.getElementById('mini-close-btn');
    if (miniCloseBtn) {
      miniCloseBtn.addEventListener('click', closeMiniPlayer);
    }
    
    // Update mini player cover when song changes
    const miniPlayerCover = document.getElementById('mini-player-cover');
    function updateMiniPlayerCover() {
      if (miniPlayerCover && currentSongIndex !== -1) {
        miniPlayerCover.src = songs[currentSongIndex].coverPath;
      }
    }
    
    // Patch playSong to update mini player cover
    const originalPlaySongBase = playSong;
    playSong = function(index) {
      const result = originalPlaySongBase.call(this, index);
      updateMiniPlayerCover();
      return result;
    };
    
    // ==========================
    // Volume Control
    // ==========================
    const miniVolumeSlider = document.getElementById('mini-volume-slider');
    const miniVolumeBtn = document.getElementById('mini-volume-btn');
    
    function syncVolumeSliders(value) {
      if (volumeSlider) volumeSlider.value = value * 100;
      if (miniVolumeSlider) miniVolumeSlider.value = value * 100;
    }
    
    if (volumeSlider) {
      volumeSlider.addEventListener('input', (e) => {
        const value = e.target.value / 100;
        audio.volume = value;
        syncVolumeSliders(value);
        updateVolumeIcon(value);
      });
    }
    
    if (miniVolumeSlider) {
      miniVolumeSlider.addEventListener('input', (e) => {
        const value = e.target.value / 100;
        audio.volume = value;
        syncVolumeSliders(value);
        updateVolumeIcon(value);
      });
    }
    
    function updateVolumeIcon(volume) {
      const iconClass = (volume === 0 || audio.muted) ? 'fa-volume-xmark' 
        : (volume < 0.5 ? 'fa-volume-low' : 'fa-volume-high');
      
      if (volumeBtn) {
        volumeBtn.querySelector('i').className = `fa-solid ${iconClass}`;
      }
      if (miniVolumeBtn) {
        miniVolumeBtn.querySelector('i').className = `fa-solid ${iconClass}`;
      }
    }
    
    if (volumeBtn) {
      volumeBtn.addEventListener('click', () => {
        audio.muted = !audio.muted;
        updateVolumeIcon(audio.muted ? 0 : audio.volume);
      });
    }
    
    if (miniVolumeBtn) {
      miniVolumeBtn.addEventListener('click', () => {
        audio.muted = !audio.muted;
        updateVolumeIcon(audio.muted ? 0 : audio.volume);
      });
    }
    
    // ==========================
    // Speed Control
    // ==========================
    speedBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const speed = parseFloat(btn.dataset.speed);
        audio.playbackRate = speed;
        speedBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
    
    // ==========================
    // Playlist Features
    // ==========================
    function renderPlaylist() {
      if (!playlistItems) return;
      playlistItems.innerHTML = '';
      
      if (userPlaylist.length === 0) {
        playlistItems.innerHTML = '<p style="color: rgba(255,255,255,0.4); font-size: 0.8rem; text-align: center;">No songs in playlist</p>';
        return;
      }
      
      userPlaylist.forEach((songIndex, i) => {
        const song = songs[songIndex];
        const item = document.createElement('div');
        item.className = 'playlist-item' + (songIndex === currentSongIndex ? ' active' : '');
        item.innerHTML = `
          <img class="playlist-item-cover" src="${song.coverPath}" alt="${song.title}">
          <span class="playlist-item-title">${song.title}</span>
          <button class="playlist-item-remove" data-index="${i}">
            <i class="fa-solid fa-xmark"></i>
          </button>
        `;
        item.addEventListener('click', (e) => {
          if (!e.target.closest('.playlist-item-remove')) {
            playSong(songIndex);
          }
        });
        item.querySelector('.playlist-item-remove').addEventListener('click', (e) => {
          e.stopPropagation();
          userPlaylist.splice(i, 1);
          renderPlaylist();
        });
        playlistItems.appendChild(item);
      });
    }
    
    // Playlist mode state
    let playlistMode = false;
    const playlistModeIndicator = document.getElementById('playlist-mode-indicator');
    const playlistPlayingBadge = document.getElementById('playlist-playing-badge');
    const playPlaylistBtn = document.getElementById('play-playlist-btn');
    const exportPlaylistBtn = document.getElementById('export-playlist-btn');
    
    // Update playlist mode UI
    function setPlaylistMode(enabled) {
      playlistMode = enabled;
      if (playlistModeIndicator) {
        playlistModeIndicator.style.display = enabled ? 'flex' : 'none';
      }
      if (playlistPlayingBadge) {
        playlistPlayingBadge.style.display = enabled ? 'inline-flex' : 'none';
      }
      // Mini Player Indicator
      const miniIndicator = document.getElementById('mini-playlist-indicator');
      if (miniIndicator) {
        miniIndicator.style.display = enabled ? 'flex' : 'none';
      }
    }
    
    if (playlistToggleBtn) {
      playlistToggleBtn.addEventListener('click', () => {
        if (playlistPanel.style.display === 'none') {
          playlistPanel.style.display = '';
          playlistToggleBtn.classList.add('active');
          modal.classList.add('playlist-open');
          renderPlaylist();
        } else {
          playlistPanel.style.display = 'none';
          playlistToggleBtn.classList.remove('active');
          modal.classList.remove('playlist-open');
        }
      });
    }
    
    // Play playlist button - starts playlist from first song
    if (playPlaylistBtn) {
      playPlaylistBtn.addEventListener('click', () => {
        if (userPlaylist.length > 0) {
          if (!playlistMode) {
            setPlaylistMode(true);
            playSong(userPlaylist[0]);
          } else {
            togglePlay();
          }
        }
      });
    }
    
    // Export playlist button - downloads as JSON
    if (exportPlaylistBtn) {
      exportPlaylistBtn.addEventListener('click', () => {
        if (userPlaylist.length > 0) {
          const playlistData = userPlaylist.map(index => ({
            title: songs[index].title,
            coverPath: songs[index].coverPath,
            audioUrl: songs[index].audioUrl
          }));
          const blob = new Blob([JSON.stringify(playlistData, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'my-playlist.json';
          a.click();
          URL.revokeObjectURL(url);
        }
      });
    }
    
    if (playlistClearBtn) {
      playlistClearBtn.addEventListener('click', () => {
        userPlaylist = [];
        setPlaylistMode(false);
        renderPlaylist();
        updateStarButtons();
      });
    }
    
    // Update download button when song changes
    function updateDownloadBtn() {
      if (downloadBtn && currentSongIndex !== -1) {
        downloadBtn.href = songs[currentSongIndex].audioUrl;
      }
    }
    
    // Override playSong to update download button
    const originalPlaySong = playSong;
    playSong = function(index) {
      const result = originalPlaySong.call(this, index);
      updateDownloadBtn();
      renderPlaylist();
      return result;
    };
    
    // Mini Player New Controls
    const miniShuffleBtn = document.getElementById('mini-shuffle-btn');
    // miniPrevBtn and miniNextBtn are already declared at the top scope

    if (miniShuffleBtn) {
      miniShuffleBtn.addEventListener('click', () => {
        shuffleMode = !shuffleMode;
        // Update both buttons
        const iconClass = shuffleMode ? 'fa-shuffle active' : 'fa-shuffle'; // Need CSS for active
        if (shuffleBtn) shuffleBtn.classList.toggle('active', shuffleMode);
        miniShuffleBtn.classList.toggle('active', shuffleMode);
      });
    }

    // Sync validation check for main shuffle button too (if not handled elsewhere)
    if (shuffleBtn) {
      shuffleBtn.addEventListener('click', () => {
         // Existing listener toggles shuffleMode, just ensure validation syncs mini
         if (miniShuffleBtn) miniShuffleBtn.classList.toggle('active', shuffleMode);
      });
    }

    if (miniPrevBtn) {
      miniPrevBtn.addEventListener('click', () => {
        playSong(getPrevIndex());
      });
    }

    if (miniNextBtn) {
      miniNextBtn.addEventListener('click', () => {
        playSong(getNextIndex());
      });
    }

    // Initialize
    renderAlbumGrid();
  })();

  // ==================================================
  // LIGHTWEIGHT ANIMATION SYSTEM (Optimized)
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
    // 1. HERO SECTION - NO ENTRANCE ANIMATIONS
    // Above-the-fold content loads instantly for best UX
    // --------------------------------------------------

    // --------------------------------------------------
    // 2. SCROLL-TRIGGERED ANIMATIONS (Below the fold only)
    // --------------------------------------------------
    // --------------------------------------------------
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1
    };

    // Animate elements when they enter viewport
    const animateOnScroll = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          animateOnScroll.unobserve(entry.target); // Only animate once
        }
      });
    }, observerOptions);

    // Apply to project cards
    document.querySelectorAll('.projeto-card').forEach((card, index) => {
      card.style.transitionDelay = `${index * 0.04}s`;
      animateOnScroll.observe(card);
    });

    // Apply to section headers
    document.querySelectorAll('section h2').forEach(header => {
      animateOnScroll.observe(header);
    });

    // Apply to skill items
    document.querySelectorAll('.skill').forEach((skill, index) => {
      skill.style.transitionDelay = `${index * 0.03}s`;
      animateOnScroll.observe(skill);
    });

    // Apply to experience cards
    document.querySelectorAll('.experience-card').forEach((card, index) => {
      card.style.transitionDelay = `${index * 0.05}s`;
      animateOnScroll.observe(card);
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
      // Store target width from the inline style (e.g., width: 90%)
      // If width is empty, default to 0 to avoid errors
      const currentWidth = bar.style.width || '0%';
      bar.dataset.targetWidth = currentWidth;
      
      // Reset width to 0 for initial state
      bar.style.width = '0%';
      
      // Ensure transition property is set for smoothness
      bar.style.transition = 'width 1s ease-out';
      
      xpObserver.observe(bar);
    });

    // --------------------------------------------------
    // 3. PROJECT CARDS - STAGGERED REVEAL
    // --------------------------------------------------

    // --------------------------------------------------
    // 5. ABOUT SECTION EXPANSION (Fixed Listener)
    // --------------------------------------------------
    const toggleTrajetoriaBtn = document.getElementById('toggle-trajetoria');
    const carouselContainerAbout = document.querySelector('.carousel-container');
    const resumidaAbout = document.querySelector('.trajetoria-resumida');
    
    if (toggleTrajetoriaBtn && carouselContainerAbout && resumidaAbout) {
      // Remove old listeners by cloning
      const newBtn = toggleTrajetoriaBtn.cloneNode(true);
      if (toggleTrajetoriaBtn.parentNode) {
        toggleTrajetoriaBtn.parentNode.replaceChild(newBtn, toggleTrajetoriaBtn);
      }
      
      carouselContainerAbout.style.height = '0';
      carouselContainerAbout.style.opacity = '0';
      carouselContainerAbout.style.overflow = 'hidden';
      carouselContainerAbout.style.transition = 'all 0.5s ease-in-out';
      
      let isExpanded = false;
      
      newBtn.addEventListener('click', () => {
        if (!isExpanded) {
          // Expand
          resumidaAbout.style.opacity = '0';
          resumidaAbout.style.height = '0';
          setTimeout(() => { resumidaAbout.style.display = 'none'; }, 300);
          
          carouselContainerAbout.style.display = 'block';
          setTimeout(() => {
             carouselContainerAbout.style.height = 'auto'; 
             carouselContainerAbout.style.opacity = '1';
          }, 10);
          
          // Update button text to "Less Details" (i18n aware)
          const lessText = window.currentTranslations?.about?.btn_less || 'Less Details';
          newBtn.textContent = lessText;
          newBtn.setAttribute('data-i18n', 'about.btn_less');
          
          isExpanded = true;
        } else {
          // Collapse
          carouselContainerAbout.style.height = '0';
          carouselContainerAbout.style.opacity = '0';
          carouselContainerAbout.style.overflow = 'hidden'; // Ensure content is clipped
          
          resumidaAbout.style.display = 'block';
          setTimeout(() => {
             resumidaAbout.style.height = 'auto';
             resumidaAbout.style.opacity = '1';
          }, 300);
          
          // Remove from layout after transition matches (0.5s)
          setTimeout(() => {
             if (!isExpanded) {
               carouselContainerAbout.style.display = 'none';
             }
          }, 500);
          
          // Update button text to "More Details" (i18n aware)
          const moreText = window.currentTranslations?.about?.btn_more || 'More Details';
          newBtn.textContent = moreText;
          newBtn.setAttribute('data-i18n', 'about.btn_more');
          
          isExpanded = false;
        }
      });
    }

    // --------------------------------------------------
    // 6. PROJECTS EXPANSION (Fixed Listener)
    // --------------------------------------------------
    const toggleProjectsBtn = document.getElementById('see-more-projects');
    // Select all cards that have the .project-hidden class
    const hiddenProjects = document.querySelectorAll('.projeto-card.project-hidden');

    if (toggleProjectsBtn && hiddenProjects.length > 0) {
      // Remove old listeners by cloning
      const newBtn = toggleProjectsBtn.cloneNode(true);
      if (toggleProjectsBtn.parentNode) {
        toggleProjectsBtn.parentNode.replaceChild(newBtn, toggleProjectsBtn);
      }

      // Initial state: ensure they are hidden if not already
      // We check display style to respect current state if reloading
      // But to be safe and match "Show More" text, we force hide initially or check state?
      // Better to force hide to match the initial "See More" button state.
      hiddenProjects.forEach(el => {
        el.style.display = 'none';
        el.style.opacity = '0'; 
      });

      let isProjectsExpanded = false;

      newBtn.addEventListener('click', () => {
        if (!isProjectsExpanded) {
          // EXPANDE
          hiddenProjects.forEach((el, index) => {
            el.style.display = 'block';
            // Stagger reveal
            setTimeout(() => {
              el.classList.add('animate-in');
              el.style.opacity = '1';
              el.style.transform = 'translateY(0)';
            }, 50 + (index * 50)); 
          });

          // Update text (Show Less)
          // i18n keys: projects.show_less
          const showLessText = window.currentTranslations?.projects?.show_less || 'Show Less';
          newBtn.innerHTML = `<i class="fa-solid fa-chevron-up"></i> ${showLessText}`;
          newBtn.setAttribute('data-i18n', 'projects.show_less'); // Persist for language switch

          isProjectsExpanded = true;
        } else {
          // COLAPSA
          hiddenProjects.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            setTimeout(() => {
              el.style.display = 'none';
              el.classList.remove('animate-in');
            }, 300);
          });

          // Update text (See More)
          // i18n keys: projects.see_more
          const seeMoreText = window.currentTranslations?.projects?.see_more || 'See More Projects';
          newBtn.innerHTML = `<i class="fa-solid fa-chevron-down"></i> ${seeMoreText}`;
          newBtn.setAttribute('data-i18n', 'projects.see_more'); // Persist for language switch

          isProjectsExpanded = false;
        }
      });
    }

    console.log('✨ Lightweight animations initialized');
  })();

});

