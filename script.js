// =============================================
// Function to initialize Google Translate
// =============================================
function googleTranslateElementInit() {
  new google.translate.TranslateElement({
    pageLanguage: 'pt-br',
    layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
    autoDisplay: false
  }, 'google_translate_element');
}

// =============================================
// Toggle button and display control
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  const translateToggle = document.getElementById('translate-toggle');
  const translateElement = document.getElementById('google_translate_element');

  if (translateToggle && translateElement) {
    translateToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      
      // Find the link that opens the language menu
      const googleLink = translateElement.querySelector('a.goog-te-menu-value');
      
      if (googleLink) {
        // Automatically click the Google button
        googleLink.click();
      } else {
        // Fallback: show the normal container
        const isExpanded = translateToggle.getAttribute('aria-expanded') === 'true';
        translateElement.classList.toggle('show', !isExpanded);
        translateToggle.setAttribute('aria-expanded', !isExpanded);
      }
    });

    // Close when clicking outside (detects the language menu iframe)
    document.addEventListener('click', (e) => {
      const iframe = document.querySelector('iframe.goog-te-menu-frame');
      if (!translateToggle.contains(e.target) && 
          !translateElement.contains(e.target) && 
          (!iframe || !iframe.contains(e.target))) {
        translateElement.classList.remove('show');
        translateToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Detect language change and "close" the menu
    const observer = new MutationObserver(() => {
      const combo = translateElement.querySelector('.goog-te-combo');
      if (combo && combo.value !== '' && combo.value !== 'pt') {
        translateToggle.setAttribute('aria-expanded', 'false');
      }
    });
    
    observer.observe(translateElement, { childList: true, subtree: true });

    setTimeout(googleTranslateElementInit, 300);
  }


  // ==========================
  // Dynamic year (UNCHANGED)
  // ==========================
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // ==========================
  // Light/dark theme (UNCHANGED)
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
  //Dropdown toggle-contacts
const dropdownToggle = document.querySelector('.dropdown a');
const dropdownContent = document.querySelector('.dropdown-content');

if (dropdownToggle && dropdownContent) {
  dropdownToggle.addEventListener('click', (e) => {
    e.preventDefault();
    dropdownContent.classList.toggle('show');
  });

  // Close when clicking outside (optional, improves UX)
  document.addEventListener('click', (e) => {
    if (!dropdownToggle.contains(e.target) && !dropdownContent.contains(e.target)) {
      dropdownContent.classList.remove('show');
    }
  });
}

  // ==========================
  // Form (simulation) (UNCHANGED)
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

            // function that always returns the real front height (includes padding/border)
            function getFrontHeight() {
              // uses outerHeight(true) to consider padding; fallback 672
              return card.find('.card-front').outerHeight(true) || 672;
            }

            // syncs card min-height and backBg height with front
            function syncToFront() {
              const fh = getFrontHeight();
              card.css('min-height', fh + 'px');
              if (backBg.length) backBg.css('height', fh + 'px');
            }

            // ensures visual style of back background (optional but recommended)
            if (backBg.length) {
              backBg.css({
                'background-size': 'cover',
                'background-position': 'center center',
                'background-repeat': 'no-repeat',
                'width': '100%'
              });
            }

            // syncs initially when front image loads (or is already loaded)
            if (frontImg.length) {
              frontImg.on('load', syncToFront);
              if (frontImg[0].complete) syncToFront();
            } else {
              // if no img, apply immediate sync
              syncToFront();
            }

            // open back: dynamically calculates according to content
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

            // close back: returns to front height (measured at closing time)
            function closeBack() {
              card.removeClass('flipped');
              requestAnimationFrame(() => {
                const fh = getFrontHeight();
                card.css('min-height', fh + 'px');
                if (backBg.length) backBg.css('height', fh + 'px');
              });
            }

            // handlers - hover with mouseenter/mouseleave for better control
            card.on('mouseenter', function() {
              openBack();
            });
            
            card.on('mouseleave', function() {
              // Only close if not "locked" by click
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

            // prevents flip during drag — now uses getFrontHeight() instead of a fixed initialHeight
            card.closest('.owl-carousel').on('drag.owl.carousel', function() {
              card.removeClass('flipped');
              const fh = getFrontHeight();
              card.css('min-height', fh + 'px');
              if (backBg.length) backBg.css('height', fh + 'px');
            });
          });
        }, 100); // small delay for rendering
      });
    // Single resize handler (outside the loop)
    // resize handler — use this instead of the existing one
$(window).on('resize', function() {
  $('.card').each(function() {
    const card = $(this);
    const frontH = card.find('.card-front').outerHeight(true) || 672;
    const backContent = card.find('.card-back-content');
    const backBg = card.find('.card-back-bg');

    if (card.hasClass('flipped')) {
      // if open, recalculates according to content and front
      const contentH = backContent.length ? backContent[0].scrollHeight : 0;
      const reservedBottom = 220;
      const needed = Math.max(frontH, contentH + reservedBottom + 40);
      card.css('min-height', needed + 'px');
      if (backBg.length) backBg.css('height', needed + 'px');
    } else {
      // closed: return exactly to front height
      card.css('min-height', frontH + 'px');
      if (backBg.length) backBg.css('height', frontH + 'px');
    }
  });
});

  }

  // ====================================================
  // CHANGED: "My Complete Trajectory" Button
  // ====================================================
  const botao = document.getElementById("toggle-trajetoria");
  const carouselContainer = document.querySelector(".carousel-container");
  const resumida = document.querySelector(".trajetoria-resumida");

  if (botao && carouselContainer && resumida) {
    botao.addEventListener("click", () => {
      if (carouselContainer.style.display === "none") {
        carouselContainer.style.display = "block";
        resumida.style.display = "none";
        botao.textContent = "Show Summary Version";
      } else {
        carouselContainer.style.display = "none";
        resumida.style.display = "block";
        botao.textContent = "More Details";
      }
    });
  }

  // ====================================================
  // Skills Tooltip - hover / click / X (JS only)
  // ====================================================
  const icon = document.getElementById('habilidades-icone');
  const tooltip = document.getElementById('habilidades-tooltip');
  const closeBtn = document.getElementById('tooltip-close');

  let isPermanent = false;

  if (icon && tooltip && closeBtn) {
    // Temporary hover
    icon.addEventListener('mouseenter', () => {
      if (!isPermanent) tooltip.classList.add('show');
    });

    icon.addEventListener('mouseleave', () => {
      if (!isPermanent) tooltip.classList.remove('show');
    });

    // Click on icon toggles permanent mode
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

    // Click on X closes and returns to hover
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      isPermanent = false;
      tooltip.classList.remove('show');
    });

    tooltip.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

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

      // If player doesn't exist yet, create and initial play
      if (!currentPlayer || currentToggle !== btn) {
        // Close previous player if exists
        if (currentPlayer) currentPlayer.remove();
        if (currentAudio) currentAudio.pause();

        currentAudio = new Audio(audioFile);
        currentToggle = btn;

        // Create player
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

        // Initial play
        currentAudio.play();
        currentAudio.addEventListener("loadedmetadata", () => {
          durationEl.textContent = formatTime(currentAudio.duration);
        });

        // Update bar
        currentAudio.addEventListener("timeupdate", () => {
          const percent = (currentAudio.currentTime / currentAudio.duration) * 100;
          seek.value = percent;
          currentTimeEl.textContent = formatTime(currentAudio.currentTime);

          // Fills the bar before the point
          seek.style.background = `linear-gradient(to right, #00c3ff 0%, #00c3ff ${percent}%, #aaa ${percent}%, #aaa 100%)`;

          // For light theme
          if(document.body.classList.contains('light')) {
            seek.style.background = `linear-gradient(to right, #0077ff 0%, #0077ff ${percent}%, #ccc ${percent}%, #ccc 100%)`;
          }
        });

        // Seek
        seek.addEventListener("input", () => {
          currentAudio.currentTime = (seek.value / 100) * currentAudio.duration;
        });

        // Play/stop button
        playBtn.addEventListener("click", () => {
          if (currentAudio.paused) {
            currentAudio.play();
            playBtn.querySelector("i").className = "fa-solid fa-stop";
          } else {
            currentAudio.pause();
            playBtn.querySelector("i").className = "fa-solid fa-play";
          }
        });

        // Repeat button
        repeatBtn.addEventListener("click", () => {
          currentAudio.currentTime = 0;
          currentAudio.play();
        });

        // When finished
        currentAudio.addEventListener("ended", () => {
          playBtn.querySelector("i").className = "fa-solid fa-play";
        });

        // Changes toggle to caret-down
        icon.className = "fa-solid fa-caret-down";
      }
      else {
        // Player already exists for this button → toggle show/hide
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

  // Enable hover after first click
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
  // Show form when clicking the button
  document.getElementById("agendar-btn").addEventListener("click", () => {
    document.getElementById("form-agendamento").style.display = "block";
  });

 // Flow when clicking "Confirm"
document.getElementById("enviar-agendamento").addEventListener("click", async (e) => {
  e.preventDefault();

  const data = document.getElementById("data").value;
  const hora = document.getElementById("hora").value;
  const mensagem = document.getElementById("mensagem")?.value || ""; // optional
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
      json = {}; // fallback if no valid JSON
    }

    if (res.ok) {
      // Show success message
      status.innerText = "✅ Event created successfully!";

      // Keep the message for 2 seconds before closing the form
      setTimeout(() => {
        document.getElementById("form-agendamento").style.display = "none";
        status.innerText = ""; // clear the message
      }, 2000);

      // optional: clear fields immediately
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



// ==========================
// Floating Spotify Player
// ==========================
const spotifyLinks = document.querySelectorAll('a.spotify');
const spotifyPlayer = document.getElementById('spotify-player');
const spotifyClose = document.getElementById('close-spotify');

if (spotifyLinks && spotifyPlayer && spotifyClose) {
  spotifyLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      spotifyPlayer.classList.toggle('show');
    });
  });

  spotifyClose.addEventListener('click', () => {
    spotifyPlayer.classList.remove('show');
  });
}
// ==========================
// Show Spotify button in header after 1st click
// ==========================
const spotifyHeaderBtn = document.getElementById('spotify-header-btn');

if (spotifyLinks && spotifyPlayer && spotifyClose && spotifyHeaderBtn) {
  
  spotifyLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      // 1️⃣ Open the player (as before)
      spotifyPlayer.classList.add('show');

      // 2️⃣ Show button in header (only first time)
      if (spotifyHeaderBtn.style.display === 'none') {
        spotifyHeaderBtn.style.display = 'inline-block';
      }
    });
  });

  spotifyClose.addEventListener('click', () => {
    spotifyPlayer.classList.remove('show');
  });

  // header button also opens/closes the player
  spotifyHeaderBtn.addEventListener('click', () => {
    spotifyPlayer.classList.toggle('show');
  });
}
//SKILLS FILTER
(function() {
  const searchInput = document.getElementById('skills-search');
  const activeFiltersContainer = document.getElementById('active-filters');
  const suggestionBox = document.createElement('div');
  suggestionBox.classList.add('suggestions');
  searchInput.parentNode.appendChild(suggestionBox);

  let activeFilters = [];
  let originalCards = []; // Original cards saved

  // Wait for the carousel to be ready
  setTimeout(function() {
    // Save original cards AFTER carousel is initialized
    const carousel = $('#habilidades-carousel');
    if (carousel.hasClass('owl-loaded')) {
      carousel.find('.owl-item:not(.cloned) .habilidade-card').each(function() {
        originalCards.push({
          html: $(this).prop('outerHTML'),
          element: $(this).clone(true)
        });
      });
      console.log('✅ Backup created:', originalCards.length, 'cards');
    }
  }, 500);

  // Normalize text
  function normalizeText(text) {
    return text.toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  // Map normalized → original text
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

  // Create filter button
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

  // Main filtering function
  function filterSkills() {
    const carousel = $('#habilidades-carousel');
    
    console.log('🔍 Filtering... Active filters:', activeFilters);

    // Completely clear the carousel
    if (carousel.hasClass('owl-loaded')) {
      carousel.trigger('destroy.owl.carousel');
    }
    carousel.removeClass('owl-carousel owl-loaded');
    carousel.empty();
    carousel.addClass('owl-carousel');

    // No filters = restore original
    if (activeFilters.length === 0) {
      console.log('🔄 Restoring original state');
      
      if (originalCards.length === 0) {
        console.warn('⚠️ Empty backup!');
        return;
      }

      // Restore original cards
      originalCards.forEach(card => {
        const $clonedCard = card.element.clone(true);
        // Ensure all skills are visible
        $clonedCard.find('.skill').show();
        carousel.append($clonedCard);
      });

      // Reinitialize
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

      // Refresh to ensure layout
      setTimeout(() => {
        carousel.trigger('refresh.owl.carousel');
      }, 100);

      console.log('✅ Restored successfully');
      return;
    }

    // WITH FILTERS: filter and rebuild
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

    console.log('📊 Visible cards:', visibleCards.length);

    if (visibleCards.length > 0) {
      // Add filtered cards
      visibleCards.forEach($card => {
        carousel.append($card);
      });

      // Reinitialize carousel
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

      // Refresh to ensure layout
      setTimeout(() => {
        carousel.trigger('refresh.owl.carousel');
      }, 100);

      console.log('✅ Carousel rebuilt');
    } else {
      carousel.html('<div style="text-align:center; padding:2rem; color:var(--muted);">No skills found.</div>');
      console.log('⚠️ No card matches the filter');
    }
  }

  // Autocomplete
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

  // Enter to add filter
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


});
  const glow = document.getElementById('mouse-glow');
let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  glow.style.left = mouseX + 'px';
  glow.style.top = mouseY + 'px';
  glow.classList.add('visible');
});
const sections = document.querySelectorAll('.section');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
sections.forEach(s => observer.observe(s));

// ==========================
// Scroll Reveal Logic (Re-applied)
// ==========================
document.addEventListener('DOMContentLoaded', () => {
  const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, observerOptions);

  document.querySelectorAll('section').forEach(section => {
    section.classList.add('hidden-section');
    observer.observe(section);
  });
});