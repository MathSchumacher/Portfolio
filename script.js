// =============================================
// Função para inicializar o Google Translate
// =============================================
function googleTranslateElementInit() {
  new google.translate.TranslateElement({
    pageLanguage: 'pt-br',
    layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
    autoDisplay: false
  }, 'google_translate_element');
}

// =============================================
// Toggle do botão e controle de exibição
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  const translateToggle = document.getElementById('translate-toggle');
  const translateElement = document.getElementById('google_translate_element');

  if (translateToggle && translateElement) {
    translateToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      
      // Encontra o link que abre o menu de idiomas
      const googleLink = translateElement.querySelector('a.goog-te-menu-value');
      
      if (googleLink) {
        // Clica automaticamente no botão do Google
        googleLink.click();
      } else {
        // Fallback: mostra o container normal
        const isExpanded = translateToggle.getAttribute('aria-expanded') === 'true';
        translateElement.classList.toggle('show', !isExpanded);
        translateToggle.setAttribute('aria-expanded', !isExpanded);
      }
    });

    // Fecha ao clicar fora (detecta o iframe do menu)
    document.addEventListener('click', (e) => {
      const iframe = document.querySelector('iframe.goog-te-menu-frame');
      if (!translateToggle.contains(e.target) && 
          !translateElement.contains(e.target) && 
          (!iframe || !iframe.contains(e.target))) {
        translateElement.classList.remove('show');
        translateToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Detecta mudança de idioma e "fecha" o menu
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
  // Ano dinâmico (INALTERADO)
  // ==========================
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // ==========================
  // Tema claro/escuro (INALTERADO)
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
  //Dropdowntoogle-contatos
const dropdownToggle = document.querySelector('.dropdown a');
const dropdownContent = document.querySelector('.dropdown-content');

if (dropdownToggle && dropdownContent) {
  dropdownToggle.addEventListener('click', (e) => {
    e.preventDefault();
    dropdownContent.classList.toggle('show');
  });

  // Fechar ao clicar fora (opcional, melhora a UX)
  document.addEventListener('click', (e) => {
    if (!dropdownToggle.contains(e.target) && !dropdownContent.contains(e.target)) {
      dropdownContent.classList.remove('show');
    }
  });
}

  // ==========================
  // Formulário (simulação) (INALTERADO)
  // ==========================
  const form = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (form && formStatus) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      formStatus.textContent = 'Enviando…';
      await new Promise((r) => setTimeout(r, 900));
      form.reset();
      formStatus.textContent = 'Mensagem enviada!';
      setTimeout(() => (formStatus.textContent = ''), 3000);
    });
  }

  // =============================================
  // Owl Carousel: Trajetória, Habilidades e Experiência
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

    // Inicialização do carrossel de Experiência
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

            // função que sempre retorna a altura real da frente (inclui padding/border)
            function getFrontHeight() {
              // usa outerHeight(true) para considerar padding; fallback 672
              return card.find('.card-front').outerHeight(true) || 672;
            }

            // sincroniza min-height do card e altura do backBg com a frente
            function syncToFront() {
              const fh = getFrontHeight();
              card.css('min-height', fh + 'px');
              if (backBg.length) backBg.css('height', fh + 'px');
            }

            // garante estilo visual do background do verso (opcional mas recomendado)
            if (backBg.length) {
              backBg.css({
                'background-size': 'cover',
                'background-position': 'center center',
                'background-repeat': 'no-repeat',
                'width': '100%'
              });
            }

            // sincroniza inicialmente quando a imagem da frente carregar (ou já estiver carregada)
            if (frontImg.length) {
              frontImg.on('load', syncToFront);
              if (frontImg[0].complete) syncToFront();
            } else {
              // se não houver img, aplica sincronização imediata
              syncToFront();
            }

            // abre o verso: calcula dinamicamente conforme conteúdo
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

            // fecha o verso: volta pra altura da frente (medida no momento do fechamento)
            function closeBack() {
              card.removeClass('flipped');
              requestAnimationFrame(() => {
                const fh = getFrontHeight();
                card.css('min-height', fh + 'px');
                if (backBg.length) backBg.css('height', fh + 'px');
              });
            }

            // handlers - hover com mouseenter/mouseleave para melhor controle
            card.on('mouseenter', function() {
              openBack();
            });
            
            card.on('mouseleave', function() {
              // Só fecha se não estiver "travado" por clique
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

            // evita flip durante drag — agora usa getFrontHeight() em vez de uma initialHeight fixa
            card.closest('.owl-carousel').on('drag.owl.carousel', function() {
              card.removeClass('flipped');
              const fh = getFrontHeight();
              card.css('min-height', fh + 'px');
              if (backBg.length) backBg.css('height', fh + 'px');
            });
          });
        }, 100); // pequeno delay para renderização
      });
    // Single resize handler (fora do loop)
    // handler de resize — use este no lugar do existente
$(window).on('resize', function() {
  $('.card').each(function() {
    const card = $(this);
    const frontH = card.find('.card-front').outerHeight(true) || 672;
    const backContent = card.find('.card-back-content');
    const backBg = card.find('.card-back-bg');

    if (card.hasClass('flipped')) {
      // se estiver aberto, recalcula conforme conteúdo e frente
      const contentH = backContent.length ? backContent[0].scrollHeight : 0;
      const reservedBottom = 220;
      const needed = Math.max(frontH, contentH + reservedBottom + 40);
      card.css('min-height', needed + 'px');
      if (backBg.length) backBg.css('height', needed + 'px');
    } else {
      // fechado: voltar exatamente para a altura da frente
      card.css('min-height', frontH + 'px');
      if (backBg.length) backBg.css('height', frontH + 'px');
    }
  });
});

  }

  // ====================================================
  // ALTERADO: Botão "Minha Trajetória Completa"
  // ====================================================
  const botao = document.getElementById("toggle-trajetoria");
  const carouselContainer = document.querySelector(".carousel-container");
  const resumida = document.querySelector(".trajetoria-resumida");

  if (botao && carouselContainer && resumida) {
    botao.addEventListener("click", () => {
      if (carouselContainer.style.display === "none") {
        carouselContainer.style.display = "block";
        resumida.style.display = "none";
        botao.textContent = "Mostrar Versão Resumida";
      } else {
        carouselContainer.style.display = "none";
        resumida.style.display = "block";
        botao.textContent = "Mais Detalhes";
      }
    });
  }

  // ====================================================
  // Tooltip Habilidades - hover / clique / X (somente JS)
  // ====================================================
  const icon = document.getElementById('habilidades-icone');
  const tooltip = document.getElementById('habilidades-tooltip');
  const closeBtn = document.getElementById('tooltip-close');

  let isPermanent = false;

  if (icon && tooltip && closeBtn) {
    // Hover temporário
    icon.addEventListener('mouseenter', () => {
      if (!isPermanent) tooltip.classList.add('show');
    });

    icon.addEventListener('mouseleave', () => {
      if (!isPermanent) tooltip.classList.remove('show');
    });

    // Clique no ícone alterna modo permanente
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

    // Clique no X fecha e volta o hover
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

      // Se ainda não existe player, cria e dá play inicial
      if (!currentPlayer || currentToggle !== btn) {
        // Fecha player anterior se existir
        if (currentPlayer) currentPlayer.remove();
        if (currentAudio) currentAudio.pause();

        currentAudio = new Audio(audioFile);
        currentToggle = btn;

        // Cria player
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

        // Play inicial
        currentAudio.play();
        currentAudio.addEventListener("loadedmetadata", () => {
          durationEl.textContent = formatTime(currentAudio.duration);
        });

        // Atualizar barra
        currentAudio.addEventListener("timeupdate", () => {
          const percent = (currentAudio.currentTime / currentAudio.duration) * 100;
          seek.value = percent;
          currentTimeEl.textContent = formatTime(currentAudio.currentTime);

          // Preenche a barra antes do ponto
          seek.style.background = `linear-gradient(to right, #00c3ff 0%, #00c3ff ${percent}%, #aaa ${percent}%, #aaa 100%)`;

          // Para tema claro
          if(document.body.classList.contains('light')) {
            seek.style.background = `linear-gradient(to right, #0077ff 0%, #0077ff ${percent}%, #ccc ${percent}%, #ccc 100%)`;
          }
        });

        // Seek
        seek.addEventListener("input", () => {
          currentAudio.currentTime = (seek.value / 100) * currentAudio.duration;
        });

        // Botão play/stop
        playBtn.addEventListener("click", () => {
          if (currentAudio.paused) {
            currentAudio.play();
            playBtn.querySelector("i").className = "fa-solid fa-stop";
          } else {
            currentAudio.pause();
            playBtn.querySelector("i").className = "fa-solid fa-play";
          }
        });

        // Botão repeat
        repeatBtn.addEventListener("click", () => {
          currentAudio.currentTime = 0;
          currentAudio.play();
        });

        // Ao terminar
        currentAudio.addEventListener("ended", () => {
          playBtn.querySelector("i").className = "fa-solid fa-play";
        });

        // Muda o toggle para caret-down
        icon.className = "fa-solid fa-caret-down";
      }
      else {
        // Já existe player para este botão → toggle mostrar/ocultar
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

  // Habilita hover após o primeiro clique
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
  // Mostrar formulário ao clicar no botão
  document.getElementById("agendar-btn").addEventListener("click", () => {
    document.getElementById("form-agendamento").style.display = "block";
  });

  // Fluxo ao clicar em "Confirmar"
  document.getElementById("enviar-agendamento").addEventListener("click", async (e) => {
    e.preventDefault();

    const data = document.getElementById("data").value;
    const hora = document.getElementById("hora").value;
    const mensagem = document.getElementById("mensagem")?.value || ""; // opcional
    const status = document.getElementById("status");

    status.innerText = "Processando...";

    if (!data || !hora) {
      status.innerText = "⚠️ Preencha data e hora.";
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/agendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data, hora, mensagem })
      });

      const json = await res.json();

      if (res.ok) {
        status.innerText = "✅ Evento criado com sucesso!";
        document.getElementById("form-agendamento").style.display = "none";
      } else {
        status.innerText = "❌ Erro: " + (json.error || JSON.stringify(json));
        console.error("Erro no backend:", json);
      }
    } catch (err) {
      console.error(err);
      status.innerText = "❌ " + (err.message || "Erro desconhecido");
    }
  });

// ==========================
// Player Spotify flutuante
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
// Mostrar botão Spotify no header após 1º clique
// ==========================
const spotifyHeaderBtn = document.getElementById('spotify-header-btn');

if (spotifyLinks && spotifyPlayer && spotifyClose && spotifyHeaderBtn) {
  
  spotifyLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      // 1️⃣ Abrir o player (como já fazia)
      spotifyPlayer.classList.add('show');

      // 2️⃣ Mostrar botão no header (só na primeira vez)
      if (spotifyHeaderBtn.style.display === 'none') {
        spotifyHeaderBtn.style.display = 'inline-block';
      }
    });
  });

  spotifyClose.addEventListener('click', () => {
    spotifyPlayer.classList.remove('show');
  });

  // botão do header abre/fecha o player também
  spotifyHeaderBtn.addEventListener('click', () => {
    spotifyPlayer.classList.toggle('show');
  });
}
//FILTRO HABILIDADES
(function() {
  const searchInput = document.getElementById('skills-search');
  const activeFiltersContainer = document.getElementById('active-filters');
  const suggestionBox = document.createElement('div');
  suggestionBox.classList.add('suggestions');
  searchInput.parentNode.appendChild(suggestionBox);

  let activeFilters = [];
  let originalCards = []; // Cards originais salvos

  // Aguarda o carousel estar pronto
  setTimeout(function() {
    // Salva os cards originais APÓS o carousel estar inicializado
    const carousel = $('#habilidades-carousel');
    if (carousel.hasClass('owl-loaded')) {
      carousel.find('.owl-item:not(.cloned) .habilidade-card').each(function() {
        originalCards.push({
          html: $(this).prop('outerHTML'),
          element: $(this).clone(true)
        });
      });
      console.log('✅ Backup criado:', originalCards.length, 'cards');
    }
  }, 500);

  // Normaliza texto
  function normalizeText(text) {
    return text.toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  // Mapa normalized → texto original
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

  // Cria botão de filtro
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

  // Função principal de filtragem
  function filterSkills() {
    const carousel = $('#habilidades-carousel');
    
    console.log('🔍 Filtrando... Filtros ativos:', activeFilters);

    // Limpa o carousel completamente
    if (carousel.hasClass('owl-loaded')) {
      carousel.trigger('destroy.owl.carousel');
    }
    carousel.removeClass('owl-carousel owl-loaded');
    carousel.empty();
    carousel.addClass('owl-carousel');

    // Sem filtros = restaura original
    if (activeFilters.length === 0) {
      console.log('🔄 Restaurando estado original');
      
      if (originalCards.length === 0) {
        console.warn('⚠️ Backup vazio!');
        return;
      }

      // Restaura cards originais
      originalCards.forEach(card => {
        const $clonedCard = card.element.clone(true);
        // Garante que todas as skills estejam visíveis
        $clonedCard.find('.skill').show();
        carousel.append($clonedCard);
      });

      // Reinicializa
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

      // Refresh para garantir layout
      setTimeout(() => {
        carousel.trigger('refresh.owl.carousel');
      }, 100);

      console.log('✅ Restaurado com sucesso');
      return;
    }

    // COM FILTROS: filtra e reconstrói
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

    console.log('📊 Cards visíveis:', visibleCards.length);

    if (visibleCards.length > 0) {
      // Adiciona cards filtrados
      visibleCards.forEach($card => {
        carousel.append($card);
      });

      // Reinicializa carousel
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

      // Refresh para garantir layout
      setTimeout(() => {
        carousel.trigger('refresh.owl.carousel');
      }, 100);

      console.log('✅ Carousel reconstruído');
    } else {
      carousel.html('<div style="text-align:center; padding:2rem; color:var(--muted);">Nenhuma habilidade encontrada.</div>');
      console.log('⚠️ Nenhum card corresponde ao filtro');
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

  // Enter para adicionar filtro
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