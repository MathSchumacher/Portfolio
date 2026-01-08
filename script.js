document.addEventListener('DOMContentLoaded', () => {
  
  // ==================================================
  // 1. LANGUAGE & TRANSLATION SYSTEM
  // ==================================================
  
  const supportedLanguages = {
    'pt': 'Português',
    'en': 'English',
    'es': 'Español'
  };

  // Determine initial language: LocalStorage -> Browser Preference -> Default 'en'
  let currentLang = localStorage.getItem('lang') || (navigator.language.startsWith('pt') ? 'pt' : 'en');
  
  // Ensure it's a supported language, otherwise fallback to 'en'
  if (!supportedLanguages[currentLang]) currentLang = 'en';

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
      document.documentElement.lang = lang; // Accessibility update

      // 4. Re-render Language Dropdown Options
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
    }
  });

  // Close ANY dropdown when clicking outside
  window.addEventListener('click', () => {
    document.querySelectorAll('.dropdown-content').forEach(content => {
      content.classList.remove('show');
    });
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
  // Skills Tooltip
  // ====================================================
  const icon = document.getElementById('habilidades-icone');
  const tooltip = document.getElementById('habilidades-tooltip');
  const closeBtn = document.getElementById('tooltip-close');

  let isPermanent = false;

  if (icon && tooltip && closeBtn) {
    icon.addEventListener('mouseenter', () => {
      if (!isPermanent) tooltip.classList.add('show');
    });

    icon.addEventListener('mouseleave', () => {
      if (!isPermanent) tooltip.classList.remove('show');
    });

    icon.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isPermanent) {
        isPermanent = false;
        tooltip.classList.remove('show');
      } else {
        isPermanent = true;
        tooltip.classList.add('show');
      }
    });

    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      isPermanent = false;
      tooltip.classList.remove('show');
    });

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
});