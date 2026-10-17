(function () {
  'use strict';

  var VIDEOS = {
    th: document.getElementById('bg-th-hover'),
    mm: document.getElementById('bg-mm-hover'),
    cjum: document.getElementById('bg-cjum-hover'),
    thSection: document.getElementById('bg-th-section'),
    mmSection: document.getElementById('bg-mm-section'),
    cjumSection: document.getElementById('bg-cjum-section')
  };

  var faviconLink = document.getElementById('favicon');
  var DEFAULT_FAVICON = './favicon.ico';
  var HUB_TITLE = 'MIRACLE HALL';

  var hub = document.getElementById('hub');
  var sections = document.querySelectorAll('.section');
  var backBtns = document.querySelectorAll('.back-btn');
  var logoLinks = document.querySelectorAll('.hub-logo');
  var cojumLogo = document.getElementById('cojumLogo');

  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var PUZZLE_DUST_SRC = './mult/3%20-%20Cojum%20Dip/Videos/Puzzle%20Dust%20(Short%20Music%20Video).mp4';

  var SECTION_KEY = { 'th-section': 'th', 'mm-section': 'mm', 'cjum-section': 'cjum' };
  var SECTION_LAYER = { th: 'thSection', mm: 'mmSection', cjum: 'cjumSection' };
  var SUBTLE_VOL = 0.14;
  var audioEnabled = true;

  var dockNav = document.getElementById('docsNavDock');
  var dockBackBtn = document.getElementById('dockBackBtn');
  var dockBandName = document.getElementById('dockBandName');
  var dockSectionName = document.getElementById('dockSectionName');
  var dockPillsContainer = document.getElementById('dockPills');

  var SECTION_PILLS = {
    'th-section': [
      { id: 'th-history', label: 'Historia' },
      { id: 'th-members', label: 'Integrantes' },
      { id: 'th-trajectories', label: 'Qué fue de ellos (2026)' },
      { id: 'th-discography', label: 'Discografía' },
      { id: 'th-multimedia', label: 'Multimedia & T.H.I.S.' }
    ],
    'mm-section': [
      { id: 'mm-project', label: 'El Proyecto' },
      { id: 'mm-album', label: 'Hawaii: Part II' },
      { id: 'mm-tracks', label: 'Guía de Pistas' },
      { id: 'mm-discography-extra', label: 'Part ii & Juego' },
      { id: 'mm-multimedia', label: 'Multimedia' },
      { id: 'mm-voac', label: 'Pista 0 (VOAC)' },
      { id: 'mm-lyrics', label: 'Lírica' },
      { id: 'mm-credits', label: 'Créditos' }
    ],
    'cjum-section': [
      { id: 'cjum-project', label: 'Historia' },
      { id: 'cjum-personas', label: 'Personajes' },
      { id: 'cjum-album', label: 'Álbum (2014)' },
      { id: 'cjum-discography', label: 'EPs & Demos' },
      { id: 'cjum-multimedia', label: 'Multimedia & 2026' }
    ]
  };

  var SECTION_TITLES = { th: 'Tally Hall', mm: 'Miracle Musical · ミラクルミュージカル', cjum: 'Cojum Dip' };

  var FAVICONS = {
    th: './mult/1%20-%20Tally%20Hall/Icons/Favicon.ico',
    mm: './mult/2%20-%20Miracle%20Musical/Icons/Variations%20on%20a%20cloud.ico',
    cjum: './mult/3%20-%20Cojum%20Dip/Icons/Favicon.ico'
  };

  var currentFavicon = '';
  var memberReturnTo = null;

  var scrollPositions = {
    'th-section': 0,
    'mm-section': 0,
    'cjum-section': 0
  };

  function setFavicon(type) {
    var href = type ? FAVICONS[type] : DEFAULT_FAVICON;
    if (!href || !faviconLink || currentFavicon === type) return;
    currentFavicon = type;
    faviconLink.href = href;
  }

  function clearBodyState(keep) {
    ['in-th-section', 'in-mm-section', 'in-cjum-section', 'hub-hover-th', 'hub-hover-mm', 'hub-hover-cjum'].forEach(function (c) {
      if (!keep || keep.indexOf(c) === -1) document.body.classList.remove(c);
    });
  }

  function fadeSwap(swap, targetScrollTop) {
    var targetTop = typeof targetScrollTop === 'number' ? targetScrollTop : 0;
    if (reducedMotion) {
      swap();
      window.scrollTo({ top: targetTop, behavior: 'auto' });
      return;
    }
    document.body.classList.add('view-fading');
    setTimeout(function () {
      swap();
      window.scrollTo({ top: targetTop, behavior: 'auto' });
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          document.body.classList.remove('view-fading');
        });
      });
    }, 320);
  }

  var cjumHoverLoaded = false;

  function loadCjumHover() {
    if (cjumHoverLoaded) return;
    cjumHoverLoaded = true;
    var source = document.createElement('source');
    source.type = 'video/mp4';
    source.setAttribute('data-key', 'puzzleDust');
    source.src = PUZZLE_DUST_SRC;
    VIDEOS.cjum.appendChild(source);
    VIDEOS.cjum.load();
  }

  function activateVideo(id) {
    Object.keys(VIDEOS).forEach(function (key) {
      var v = VIDEOS[key];
      if (!v) return;
      var isTarget = key === id;
      v.classList.toggle('active-video', isTarget);
      if (!isTarget) {
        v.muted = true;
        if (!v.paused) v.pause();
      }
    });
  }

  function ensurePlay(video) {
    if (!video) return;
    video.volume = SUBTLE_VOL;
    video.muted = !audioEnabled;
    var p = video.play();
    if (p && p.catch) {
      p.catch(function () {
        video.muted = true;
        var p2 = video.play();
        if (p2 && p2.catch) p2.catch(function () {});
      });
    }
  }

  function applyAudioState() {
    Object.keys(VIDEOS).forEach(function (key) {
      var v = VIDEOS[key];
      if (!v) return;
      if (audioEnabled && v.classList.contains('active-video')) {
        v.volume = SUBTLE_VOL;
        v.muted = false;
        if (v.paused) {
          var p = v.play();
          if (p && p.catch) p.catch(function () {});
        }
      } else {
        v.muted = true;
      }
    });
  }

  function unlockSubtleAudioOnce() {
    applyAudioState();
  }
  document.addEventListener('pointerdown', unlockSubtleAudioOnce, { passive: true });
  document.addEventListener('keydown', unlockSubtleAudioOnce, { passive: true });

  function muteAll() {
    Object.keys(VIDEOS).forEach(function (key) {
      if (VIDEOS[key]) VIDEOS[key].muted = true;
    });
  }

  var inlineVideos = document.querySelectorAll('.video-player-card video');
  inlineVideos.forEach(function (iv) {
    iv.addEventListener('play', function () {
      inlineVideos.forEach(function (other) {
        if (other !== iv && !other.paused) {
          other.pause();
        }
      });
      muteAll();
    });
    iv.addEventListener('pause', function () {
      var anyPlaying = false;
      inlineVideos.forEach(function (other) {
        if (!other.paused) anyPlaying = true;
      });
      if (!anyPlaying) {
        applyAudioState();
      }
    });
    iv.addEventListener('ended', function () {
      applyAudioState();
    });
  });

  if (dockBackBtn) {
    dockBackBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var activeSec = document.querySelector('.section.active');
      if (activeSec && activeSec.id === 'member-view') {
        returnFromMember();
      } else {
        showHub();
      }
    });
  }

  function updateDock(sectionId, memberName) {
    if (!dockNav) return;
    if (sectionId === 'member-view') {
      document.body.classList.add('in-member-view');
      if (dockBandName) dockBandName.textContent = memberReturnTo ? SECTION_TITLES[SECTION_KEY[memberReturnTo]] : 'MIRACLE HALL';
      if (dockSectionName) dockSectionName.textContent = memberName || 'Detalle';
      if (dockPillsContainer) dockPillsContainer.innerHTML = '';
      return;
    }
    document.body.classList.remove('in-member-view');
    var key = SECTION_KEY[sectionId];
    if (dockBandName) dockBandName.textContent = SECTION_TITLES[key] || '';
    if (dockSectionName) dockSectionName.textContent = 'Inicio';
    if (dockPillsContainer) {
      dockPillsContainer.innerHTML = '';
      var pills = SECTION_PILLS[sectionId] || [];
      pills.forEach(function (p) {
        var a = document.createElement('a');
        a.className = 'dock-pill';
        a.href = '#' + p.id;
        a.textContent = p.label;
        a.setAttribute('data-target-id', p.id);
        a.addEventListener('click', function (e) {
          e.preventDefault();
          var targetEl = document.getElementById(p.id);
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
        dockPillsContainer.appendChild(a);
      });
    }
  }

  var dockSpyObserver = null;
  function initDockScrollSpy(sectionEl) {
    if (!sectionEl || !('IntersectionObserver' in window)) return;
    if (dockSpyObserver) {
      dockSpyObserver.disconnect();
    }
    var blocks = sectionEl.querySelectorAll('.th-block, .mm-block, .cjum-block, .lore-card');
    dockSpyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          if (id) {
            var label = entry.target.querySelector('.th-label, .mm-label, .cjum-label, .th-title, .mm-title, .cjum-title');
            if (label && dockSectionName) {
              dockSectionName.textContent = label.textContent.trim();
            }
            if (dockPillsContainer) {
              var allPills = dockPillsContainer.querySelectorAll('.dock-pill');
              allPills.forEach(function (pill) {
                pill.classList.toggle('active', pill.getAttribute('data-target-id') === id);
              });
            }
          }
        }
      });
    }, { threshold: 0.1, rootMargin: '-60px 0px -40% 0px' });

    blocks.forEach(function (b) {
      if (b.id) dockSpyObserver.observe(b);
    });
  }

  logoLinks.forEach(function (logo) {
    var key = logo.getAttribute('data-video');

    logo.addEventListener('click', function () {
      var target = logo.getAttribute('data-target');
      if (target) enterSection(target, false);
    });

    logo.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        var target = logo.getAttribute('data-target');
        if (target) enterSection(target, false);
      }
    });

    logo.addEventListener('mouseenter', function () {
      if (!key) return;
      document.body.classList.remove('hub-hover-th', 'hub-hover-mm', 'hub-hover-cjum');
      document.body.classList.add('hub-hover-' + key);
      activateVideo(key);
      setFavicon(key);
      ensurePlay(VIDEOS[key]);
    });

    logo.addEventListener('mouseleave', function () {
      document.body.classList.remove('hub-hover-' + key);
      setFavicon('');
    });
  });

  if (cojumLogo) {
    cojumLogo.addEventListener('mouseenter', function () {
      document.body.classList.remove('hub-hover-th', 'hub-hover-mm');
      document.body.classList.add('hub-hover-cjum');
      loadCjumHover();
      activateVideo('cjum');
      setFavicon('cjum');
      ensurePlay(VIDEOS.cjum);
    });

    cojumLogo.addEventListener('mouseleave', function () {
      document.body.classList.remove('hub-hover-cjum');
      setFavicon('');
    });

    cojumLogo.addEventListener('click', function (e) {
      e.stopPropagation();
      enterSection('cjum-section', false);
    });

    cojumLogo.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        enterSection('cjum-section', false);
      }
    });
  }

  function getTieSvg(colorVal) {
    var c = colorVal || '#ffffff';
    return '<svg viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
             '<path d="M8 3 L16 3 L14 8 L10 8 Z" fill="' + c + '" stroke="rgba(255,255,255,0.3)" stroke-width="0.8"/>' +
             '<path d="M10 8 L14 8 L17 23 L12 30 L7 23 Z" fill="' + c + '" stroke="rgba(255,255,255,0.3)" stroke-width="0.8"/>' +
           '</svg>';
  }

  var blockObserver = null;

  function initScrollObserver(sectionEl) {
    if (!sectionEl) return;

    var selector = '.th-block, .mm-block, .cjum-block, .th-member, .mm-member, .th-disc-item, .cjum-fact, .lore-card, .artist-dossier-card, .persona-card, .video-player-card, .cover-art-card';

    if (!('IntersectionObserver' in window)) {
      sectionEl.querySelectorAll(selector).forEach(function (el) {
        el.classList.add('visible');
      });
      return;
    }

    if (blockObserver) {
      blockObserver.disconnect();
    }

    blockObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          blockObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -30px 0px' });

    var targets = sectionEl.querySelectorAll(selector);
    var vh = window.innerHeight || document.documentElement.clientHeight || 800;

    targets.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < vh - 20) {
        el.classList.add('visible');
      } else {
        el.classList.remove('visible');
        blockObserver.observe(el);
      }
    });
  }

  function enterSection(sectionId, restoreScroll) {
    var key = SECTION_KEY[sectionId];
    if (!key) return;
    var layer = SECTION_LAYER[key];
    var video = VIDEOS[layer];
    var targetTop = restoreScroll ? (scrollPositions[sectionId] || 0) : 0;

    fadeSwap(function () {
      if (hub) hub.classList.add('hidden');
      var activeTarget = null;
      sections.forEach(function (s) {
        s.classList.remove('active');
        if (s.id === sectionId) {
          s.classList.add('active');
          activeTarget = s;
        }
      });
      if (backBtns.length > 0) backBtns[0].style.display = 'flex';
      clearBodyState(['in-' + key + '-section']);

      activateVideo(layer);
      ensurePlay(video);

      document.title = SECTION_TITLES[key];
      setFavicon(key);
      updateDock(sectionId);

      if (activeTarget) {
        requestAnimationFrame(function () {
          initScrollObserver(activeTarget);
          initDockScrollSpy(activeTarget);
        });
      }
    }, targetTop);
  }

  function showHub() {
    memberReturnTo = null;
    fadeSwap(function () {
      if (hub) hub.classList.remove('hidden');
      sections.forEach(function (s) { s.classList.remove('active'); });
      backBtns.forEach(function (b) { b.style.display = 'none'; });
      clearBodyState([]);
      activateVideo('mm');
      ensurePlay(VIDEOS.mm);
      document.title = HUB_TITLE;
      setFavicon('');
      document.body.classList.remove('in-th-section', 'in-mm-section', 'in-cjum-section', 'in-member-view');
    }, 0);
  }

  function returnFromMember() {
    if (memberReturnTo) {
      var targetSection = memberReturnTo;
      memberReturnTo = null;
      enterSection(targetSection, true);
    } else {
      showHub();
    }
  }

  backBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var activeSec = document.querySelector('.section.active');
      if (activeSec && activeSec.id === 'member-view') {
        returnFromMember();
      } else {
        showHub();
      }
    });
  });
  backBtns.forEach(function (b) { b.style.display = 'none'; });

  var MEMBERS = {
    'th-joe': {
      theme: 'th', name: 'Joe Hawley', role: 'Voz · Guitarra · Composición · Dirección creativa',
      tie: 'var(--th-red)', initials: 'JH', band: 'Tally Hall',
      summary: 'Fundador, líder e ideólogo de Tally Hall (corbata roja). Compositor de piezas emblemáticas como "Ruler of Everything", "Welcome to Tally Hall", "Banana Man", "Spring and a Storm", "The Bidding", "&", "Turn the Lights Off" y creador de Miracle Musical.',
      blocks: [
        { label: 'Biografía y Educación', text: 'Joseph Robert Hawley nació el 23 de septiembre de 1982 en Detroit, MI (criado en Bloomfield Hills, graduado de Lahser High School). Se graduó con honores en Cine y Video (Film and Video Studies, B.A.) por la Universidad de Michigan en 2005. Fundó el colectivo cómico universitario anonyMous (largometraje "Sargasm", 2003) e ideó el nombre "Tally Hall", las corbatas codificadas por colores y los guiones de Tally Hall\'s Internet Show (T.H.I.S.).' },
        { label: 'En Tally Hall y Miracle Musical', text: 'Vocalista principal y guitarrista de corbata roja. Compositor central en Marvin\'s Marvelous Mechanical Museum y Good & Evil. Dio voz al monstruo azul "Bluz" en Happy Monster Band (Playhouse Disney). Tras el hiatus de 2011 fundó Miracle Musical y concibió Hawaii: Part II (2012).' },
        { label: 'Qué fue de él y Estado en 2026', text: 'Lanzó el álbum solista "Joe Hawley Joe Hawley" (2016) con todos sus excompañeros de Tally Hall, su edición invertida "γelwaH eoJ γelwaH eoJ" (2019), y sencillos como "Special" (2017), "Since I Don\'t Have You" (2018), "Weird Bed &/or Yes Please" (2019) y "Sleigh Ride Invincibility Star" (2019). Tras la reedición en vinilo de Hawaii: Part II en 2024 y lanzar su sencillo "Some Kind of Madness" (2024), reside en Michigan manteniendo un perfil reservado fuera de las giras en directo.' }
      ],
      projects: [
        { title: 'Joe Hawley Joe Hawley (12 pistas)', year: '2016', type: 'Álbum solista', desc: '1. Joe Hawley Attacks · 2. Black People White People · 3. Bring Her Along · 4. Crazy Food · 5. Rotary Park · 6. Your Mother is a Basketball · 7. Hoodz \'n the Woodz · 8. The Apologue of Hot Rod Duncan · 9. Aristotles\'s Denial · 10. Bahamian Rap City · 11. We are in Space · 12. Go to Bed (+ White Rabbit).', link: 'https://open.spotify.com/album/08z0DTL9x4HC7RihhahLat' },
        { title: 'γelwaH eoJ γelwaH eoJ', year: '2019', type: 'Álbum invertido', desc: 'Versión completamente reproducida en reversa para sortear bloqueos de copyright de samples antes de reeditar las pistas limpias en streaming.' },
        { title: 'Miracle Musical — Hawaii: Part II', year: '2012', type: 'Álbum conceptual', desc: 'Obra maestra conceptual de 11+1 pistas con leitmotifs orquestales, referencias al 11-S y metafísica.', link: 'https://mirakurumyujikaru.bandcamp.com/album/hawaii-part-ii' },
        { title: 'Sencillos (2017–2024)', year: '2017 — 2024', type: 'Sencillos solistas', desc: '"Special" (2017), "Since I Don\'t Have You" (2018), "Weird Bed &/or Yes Please" (2019), "Sleigh Ride Invincibility Star" (2019) y "Some Kind of Madness" (2024).', link: 'https://open.spotify.com/artist/2gkoczXRNRDUmfEdvr7CWm' }
      ],
      facts: ['Corbata roja', '23 Sep 1982 (Detroit, MI)', 'Cine y Video U of M 2005', 'Fundador de Miracle Musical', 'Joe Hawley Joe Hawley (2016)']
    },
    'th-rob': {
      theme: 'th', name: 'Rob Cantor', role: 'Voz · Guitarra · Composición · Productor Disney',
      tie: 'var(--th-yellow)', initials: 'RC', band: 'Tally Hall',
      summary: 'Vocalista, guitarrista y compositor (corbata amarilla). Autor de clásicos pop de la banda ("Greener", "Just Apathy", "Be Born", "Never Meant to Know", "You & Me"), fenómenos virales en YouTube y compositor titular en Disney Television Animation.',
      blocks: [
        { label: 'Biografía y Educación', text: 'Robert Howard Cantor nació el 26 de agosto de 1983 en Bloomfield Hills, MI (Andover High School, donde formó listedBlack con Zubin Sedghi). Se licenció en Biología Molecular por la Universidad de Michigan (2005) y declinó una beca completa de medicina para dedicarse profesionalmente a la música.' },
        { label: 'En Tally Hall y Miracle Musical', text: 'Compositor de "Just Apathy" (1.º lugar Pop en el John Lennon Songwriting Contest de 2005), "Greener", "Be Born", "Haiku", "Never Meant to Know", "You & Me", "Who You Are" y "Out in the Twilight". Co-letrista y voz en "Variations on a Cloud" y voz principal en "Time Machine".' },
        { label: 'Qué fue de él y Estado en 2026', text: 'En 2014 publicó su álbum solista "Not a Trampoline" y protagonizó los fenómenos virales "Shia LaBeouf Live" (~90M+ vistas) y "29 Celebrity Impressions, 1 Original Song". Desde entonces trabaja en Los Ángeles como compositor y letrista estrella para Disney Television Animation ("The Ghost and Molly McGee", "Tangled: The Series", "Monsters at Work", "Big City Greens"). En marzo de 2025 se reunió en vivo en el escenario del Lodge Room (LA) junto a Andrew, Ross, Bora y Zubin.' }
      ],
      projects: [
        { title: 'Not a Trampoline (12 pistas)', year: '2014', type: 'Álbum de estudio', desc: '1. Ghost · 2. Old Bike · 3. Garden of Eden · 4. The Rendezvous (feat. Madi Diaz) · 5. I\'m Gonna Win · 6. All I Need Is You · 7. Flamingo · 8. La Telenovela · 9. In Memoriam · 10. Let Your Mother Know · 11. Perfect · 12. Lonely (But Not Alone).', link: 'https://open.spotify.com/album/1Y5i7JllvK9heVzVfcEyIE' },
        { title: 'Shia LaBeouf Live & 29 Celebrity Impressions', year: '2014', type: 'Videos virales', desc: 'Producciones virales globales en YouTube junto a Bora Karaca, Zubin Sedghi y Andrew Horowitz.', link: 'https://www.youtube.com/watch?v=o0u4M6vppCI' },
        { title: 'Disney Television Animation', year: '2016 — 2026', type: 'Bandas sonoras TV', desc: 'Compositor principal de canciones en "The Ghost and Molly McGee" (nominado al Emmy), "Tangled: The Series", "Monsters at Work" y "Playdate with Winnie the Pooh".', link: 'https://open.spotify.com/artist/1NtYiv70buGwaMspHuD49I' },
        { title: 'Happy Monster Band (Disney)', year: '2007 — 2008', type: 'Playhouse Disney', desc: 'Compositor e intérprete vocal de los monstruos Frred (rojo) y L.O. (amarillo).', link: 'https://tallyall.club/go/?dir=img/Disney' }
      ],
      facts: ['Corbata amarilla', '26 Ago 1983 (Bloomfield Hills)', 'Biología Molecular U of M', 'Not a Trampoline (2014)', 'Compositor Disney TV (2016–2026)']
    },
    'th-zubin': {
      theme: 'th', name: 'Zubin Sedghi', role: 'Bajo · Voz · Médico de Medicina Familiar (D.O.)',
      tie: 'var(--th-blue)', initials: 'ZS', band: 'Tally Hall',
      summary: 'Bajista y vocalista de corbata azul. Compositor de "Cannibal" y "The Trap", y voz principal en "Two Wuv", "The Bidding", "Cannibal", "Misery Fell", "Be Born" y "You & Me". Ejerce como médico especialista en California.',
      blocks: [
        { label: 'Biografía y Educación', text: 'Nacido el 16 de septiembre de 1984 en California y criado en Bloomfield Hills, MI (Andover High School). Licenciado con honores en Neurociencia Celular y Molecular por la Universidad de Michigan (2007) y Doctor en Medicina Osteopática (D.O.) por Touro University California (2012–2016).' },
        { label: 'En Tally Hall y Miracle Musical', text: 'Bajista melódico y voz solista en ambos álbumes de Tally Hall, además de voz invitada principal en el dueto de "White Ball" (Hawaii: Part II) y voz del monstruo rosa "Ink" en Happy Monster Band.' },
        { label: 'Qué fue de él y Estado en 2026', text: 'Ejerce como médico titular de Medicina Familiar en Kaiser Permanente en Orange County, California, donde fue distinguido como "Physician of the Year" en diciembre de 2023. Está casado, tiene dos hijos y volvió a tocar el bajo y cantar en directo en las reuniones de julio de 2024 (Denver), marzo de 2025 (Los Ángeles) y agosto de 2025 (Sonic Lunch, Ann Arbor).' }
      ],
      projects: [
        { title: 'Medicina Familiar — Kaiser Permanente', year: '2016 — 2026', type: 'Carrera médica', desc: 'Médico especialista en Medicina Familiar en Kaiser Permanente, Orange County (CA). Galardonado como Physician of the Year (2023).' },
        { title: 'Miracle Musical — "White Ball"', year: '2012', type: 'Voz invitada', desc: 'Voz masculina principal en el dueto barroco "White Ball" junto a Stephanie Koenig en Hawaii: Part II.', link: 'https://mirakurumyujikaru.bandcamp.com/track/white-ball' },
        { title: 'edu — "fishes" (Single colaborativo)', year: '2025', type: 'Colaboración', desc: 'Participación en el sencillo publicado por Andrew Horowitz el 14 de marzo de 2025 junto a Ross, Bora y Casey Shea.' },
        { title: 'Tally Hall en Spotify', year: '2005 — presente', type: 'Discografía', desc: 'Bajo y voz solista en el catálogo completo de Tally Hall.', link: 'https://open.spotify.com/artist/7lqaPghwYv2mE9baz5XQmL' }
      ],
      facts: ['Corbata azul', '16 Sep 1984', 'Neurociencia U of M 2007', 'Doctor en Medicina (D.O.) Touro 2016', 'Physician of the Year 2023 (Kaiser Permanente)']
    },
    'th-andrew': {
      theme: 'th', name: 'Andrew Horowitz', role: 'Teclados · Voz · Composición · Productor (edu)',
      tie: 'var(--th-green)', initials: 'AH', band: 'Tally Hall',
      summary: 'Pianista, tecladista y compositor de corbata verde. Autor de "Good Day", "The Whole World and You", "Taken for a Ride", "Misery Fell", "You" y "Fate of the Stars". Artista solista bajo el alias edu y productor en Nueva York.',
      blocks: [
        { label: 'Biografía y Educación', text: 'Nacido el 12 de octubre de 1983 en Warren, Nueva Jersey (The Pingry School). Doble licenciatura en Composición Musical y Literatura Inglesa por la Universidad de Michigan en 2005. En 2004 ganó el premio BMI John Lennon Scholarship ($10,000) por "Good Day", compuesta a los 18 años.' },
        { label: 'En Tally Hall y Proyectos Paralelos', text: 'Pilar armónico y arreglista de Tally Hall. Participó en el arreglo de piano del sencillo "Candle on the Water" (2014) de Miracle Musical y produjo temas en "Joe Hawley Joe Hawley" y "Not a Trampoline".' },
        { label: 'Qué fue de él y Estado en 2026', text: 'Reside en Nueva York trabajando como productor, compositor e ingeniero para artistas como John Legend, Lindsey Stirling, Janelle Monáe y Verite. Bajo el alias "edu" publicó "sketches" (2012) y "sketches 3d" (2019), además de las obras de piano "Etudes" (2018) y "Etudes II" (2019). Entre 2024 y 2025 encabezó la serie de conciertos y reuniones en vivo de Tally Hall por EE. UU. y lanzó el sencillo "fishes" (marzo de 2025).' }
      ],
      projects: [
        { title: 'edu — sketches 3d (9 pistas)', year: '2019', type: 'Álbum solista', desc: '1. Hey You! · 2. Hummingbird · 3. Miss Melody · 4. Daisy Fingers · 5. Have a Nice Day (Interludium) · 6. Lemons and Pears · 7. At the End · 8. Nowhere Else · 9. The Rainbow Connection.', link: 'https://adhorowi.bandcamp.com/album/sketches-3d' },
        { title: 'Etudes (2018) & Etudes II (2019)', year: '2018 — 2019', type: 'Piano clásico', desc: 'Dos álbumes de composiciones instrumentales para piano solo compuestas entre su etapa universitaria y Nueva York.', link: 'https://open.spotify.com/artist/4jkUXbdYmIi7MBjt5Bobl8' },
        { title: 'edu — "fishes" (feat. Ross, Bora, Zubin & Casey)', year: '2025', type: 'Sencillo', desc: 'Sencillo colaborativo publicado el 14 de marzo de 2025 coincidiendo con las reuniones en directo en Los Ángeles y Nueva York.' },
        { title: 'Keep Up The Good Work (Pódcast)', year: '2019 — 2020', type: 'Pódcast', desc: 'Pódcast creativo co-conducido junto a Ross Federman.' }
      ],
      facts: ['Corbata verde', '12 Oct 1983 (Warren, NJ)', 'Beca BMI John Lennon 2004', 'Alias solista "edu"', 'Motor de las reuniones 2024–2025']
    },
    'th-ross': {
      theme: 'th', name: 'Ross Federman', role: 'Batería · Producción · Inmunólogo Ph.D. (Mr. F)',
      tie: 'var(--th-gray)', initials: 'RF', band: 'Tally Hall',
      summary: 'Baterista de Tally Hall desde mayo de 2004 (corbata gris). Co-productor, co-compositor y director visual de Miracle Musical. DJ y productor de mashups bajo el alias Mr. F y Doctor en Inmunología por la Universidad de Yale.',
      blocks: [
        { label: 'Biografía y Educación', text: 'Nacido el 30 de enero de 1985 en Bloomfield Hills, MI (Lahser High School). Se incorporó a Tally Hall en mayo de 2004 reemplazando a Steve Gallagher. Tras el hiatus de 2011 completó su licenciatura en Biología Celular y Molecular en la Universidad de Michigan (2013) y obtuvo su Doctorado (Ph.D.) en Inmunología por la Universidad de Yale en mayo de 2019.' },
        { label: 'En Tally Hall y Miracle Musical', text: 'Baterista en Marvin\'s Marvelous Mechanical Museum y Good & Evil (y voz solista en "Mucka Blucka"). Co-productor registrado, programador rítmico y diseñador de la portada de Hawaii: Part II.' },
        { label: 'Qué fue de él y Estado en 2026', text: 'Trabaja como científico e investigador en biotecnología e inmunología en el área de Boston/Nueva Inglaterra, está casado y es padre de familia. Bajo su alias de DJ "Mr. F" ha lanzado 4 mixtapes de mashups ("Mixtape 1" a "Mixtape 4"). Entre 2023 y 2025 regresó a la batería en prácticamente todos los shows de reunión con Andrew Horowitz, Bora Karaca, Zubin Sedghi y Rob Cantor.' }
      ],
      projects: [
        { title: 'Miracle Musical — Co-producción y Arte', year: '2012', type: 'Hawaii: Part II', desc: 'Co-productor registrado, baterista/programador y director visual de Hawaii: Part II.', link: 'https://mirakurumyujikaru.bandcamp.com/album/hawaii-part-ii' },
        { title: 'Mr. F — Mixtapes 1–4', year: '2011 — 2020', type: 'DJ / Mashups', desc: 'Cuatro volúmenes de sesiones electrónicas y mashups producidos bajo su seudónimo Mr. F.' },
        { title: 'Doctorado en Inmunología (Yale University)', year: '2013 — 2026', type: 'Carrera científica', desc: 'Ph.D. en Inmunología (Yale, 2019) e investigador en la industria biotecnológica.' },
        { title: 'Reuniones en Vivo (2023–2025)', year: '2023 — 2025', type: 'Conciertos', desc: 'Baterista en vivo en Sonic Lunch 2023, 2024 y 2025, además de las giras en Nueva York, Boston, Chicago, Denver y Los Ángeles.' }
      ],
      facts: ['Corbata gris', '30 Ene 1985 (Bloomfield Hills)', 'Ph.D. en Inmunología (Yale 2019)', 'Co-productor & Arte de Hawaii: Part II', 'DJ Mr. F']
    },
    'th-bora': {
      theme: 'th', name: 'Bora Karaca', role: 'Ingeniero de audio · Multi-instrumentista · Fundador de Cojum Dip',
      tie: 'var(--th-orange)', initials: 'BK', band: 'Tally Hall',
      summary: 'Sexto miembro oficial / mascota honoraria (corbata naranja), músico de gira e ingeniero de sonido en The LaBORAtory. Fundador y líder de Cojum Dip ("Bodur the Clumsy").',
      blocks: [
        { label: 'Biografía y Educación', text: 'Nacido el 26 de noviembre de 1984 en Detroit, MI, de ascendencia turca. Estudió en la Universidad de Michigan y en el Berklee College of Music. Fundó Cojum Dip en el año 2000 y colaboró con Tally Hall desde sus inicios en Ann Arbor, protagonizando "15 Seconds of Bora" en T.H.I.S. y girando como sexto miembro en 2011.' },
        { label: 'En Tally Hall, Miracle Musical y Cojum Dip', text: 'Ingeniero jefe en The LaBORAtory (Los Ángeles). Co-productor de Hawaii: Part II, autor e intérprete en japonés de "Space Station Level 7" y co-compositor registrado de "Variations on a Cloud". Líder de Cojum Dip.' },
        { label: 'Qué fue de él y Estado en 2026', text: 'Trabaja como ingeniero de mezcla y masterización, realizó streams como VTuber 3D de Bodur the Clumsy en Twitch (2019–2022), participó en todas las reuniones en vivo de 2024–2025 (cantando "Moon Waltz" en Boston en mayo de 2024) y produce el segundo álbum de estudio de Cojum Dip.' }
      ],
      projects: [
        { title: 'Cojum Dip — Álbum homónimo (9 pistas)', year: '2014', type: 'Álbum debut', desc: 'Álbum de jazz-metal vanguardista con temas como "Cell", "Moon Waltz" (con Joe Hawley), "Tap Tap Tap", "Puzzle Dust" y "134340 Pluto".', link: 'https://cojumdip.bandcamp.com/album/cojum-dip' },
        { title: 'Videojuegos Vol. 1 & Vol. 2 (22 pistas)', year: '2012', type: 'EPs tributo', desc: 'Dos volúmenes instrumentales de metal progresivo dedicados a las bandas sonoras de Mega Man 2 y Mega Man 3.', link: 'https://cojumdip.bandcamp.com/' },
        { title: 'Miracle Musical — "Space Station Level 7"', year: '2012', type: 'Composición / Voz', desc: 'Autor, arreglista y vocalista principal en japonés de la pista 7 de Hawaii: Part II, además de co-productor del álbum.', link: 'https://mirakurumyujikaru.bandcamp.com/album/hawaii-part-ii' },
        { title: '15 Seconds of Bora (Archivo T.H.I.S.)', year: '2008 — 2009', type: 'Serie cómica', desc: 'Segmentos de comedia absurda en Tally Hall\'s Internet Show.', link: 'https://tallyall.club/go/?dir=img/15secondsofbora%20%28Facebook%29' }
      ],
      facts: ['Corbata naranja', '26 Nov 1984 (Detroit, MI)', 'Fundador de Cojum Dip', 'Ingeniero en The LaBORAtory', 'Autor de Space Station Level 7']
    },
    'th-casey': {
      theme: 'th', name: 'Casey Shea', role: 'Voz · Guitarra · Músico de gira (Corbata Negra)',
      tie: 'var(--th-black)', initials: 'CS', band: 'Tally Hall',
      summary: 'Cantautor de indie rock y portador de la corbata negra. Sustituyó temporalmente a Joe Hawley en la gira de primavera de 2010 y regresó como invitado en las reuniones de 2025.',
      blocks: [
        { label: 'En Tally Hall', text: 'Durante la gira nacional de marzo a mayo de 2010 con Jukebox the Ghost y Skybox, mientras Joe Hawley permanecía en Ann Arbor, Casey Shea asumió la guitarra y voz principal portando la corbata negra. También grabó voces y guitarra en el cover de "Club Can\'t Handle Me" (2011).' },
        { label: 'Qué fue de él y Estado en 2026', text: 'Reside en Los Ángeles como cantautor e integrante del grupo de folk-rock Grand Canyon. En marzo de 2025 colaboró en el sencillo "fishes" de edu y en agosto de 2025 subió al escenario de Sonic Lunch (Ann Arbor) junto a Andrew, Ross, Bora y Zubin.' }
      ],
      projects: [
        { title: 'Casey Shea — Discografía Solista', year: '2007 — presente', type: 'Álbumes solistas', desc: 'Álbumes "The First Time" (2007), "Love is Crazy" (2010, con producción de Andrew Horowitz) y "Whatever Happens Next".', link: 'https://open.spotify.com/artist/6mqqIghQOdM9bkNCMNaapK' },
        { title: 'Grand Canyon', year: '2017 — 2026', type: 'Banda en LA', desc: 'Banda de indie/country-rock en Los Ángeles liderada junto a Amy Wilcox.' },
        { title: 'edu — "fishes" & Sonic Lunch 2025', year: '2025', type: 'Reunión Tally Hall', desc: 'Participación en estudio y en directo ante miles de asistentes en Liberty Plaza, Ann Arbor.' }
      ],
      facts: ['Corbata negra', 'Gira de primavera 2010', 'Álbum Love is Crazy (2010)', 'Sonic Lunch 2025']
    },
    'th-steve': {
      theme: 'th', name: 'Steve Gallagher', role: 'Baterista Fundador Original (2002–2004)',
      tie: '#9ca3af', initials: 'SG', band: 'Tally Hall',
      summary: 'Baterista fundador original de Tally Hall (diciembre 2002 – mayo 2004) y primer portador de la corbata gris. Grabó todas las baterías de Party Boobytrap EP, Welcome To Tally Hall EP y Complete Demos.',
      blocks: [
        { label: 'En Tally Hall (2002–2004)', text: 'Presentado al grupo por Rob Cantor en diciembre de 2002, cofundó Tally Hall en Ann Arbor y grabó las baterías de sus primeros EPs y de Complete Demos (2004). En mayo de 2004, al graduarse de la Universidad de Michigan en Ingeniería Mecánica, decidió no salir de gira y fue sucedido amistosamente por Ross Federman.' },
        { label: 'Qué fue de él y Estado en 2026', text: 'Desarrolló una carrera ejecutiva en ventas técnicas e ingeniería industrial (trabajando en compañías como Keyence Corporation y firmas tecnológicas en Pensilvania y el Medio Oeste). Mantiene una relación cordial con sus excompañeros.' }
      ],
      projects: [
        { title: 'Complete Demos (Grabaciones 2003–2004)', year: '2004', type: 'Demos fundacionales', desc: 'Álbum compilatorio con las 10 grabaciones fundacionales registradas con Steve Gallagher en la batería.', link: 'https://tallyall.club/go/?dir=Tally%20Hall/Complete%20Demos' },
        { title: 'Party Boobytrap EP & Welcome To Tally Hall EP', year: '2003 — 2004', type: 'EPs originales', desc: 'Primeros lanzamientos independientes de Tally Hall en Ann Arbor.', link: 'https://tallyall.club/go/?dir=Tally%20Hall' }
      ],
      facts: ['Corbata gris original', 'Baterista fundador (Dic 2002 – May 2004)', 'Ingeniero Mecánico U of M 2004', 'Batería en Complete Demos']
    },
    'th-ryan': {
      theme: 'th', name: 'Ryan Brady', role: 'Co-creador de T.H.I.S. · Road Manager · Corbata Negra',
      tie: 'var(--th-black)', initials: 'RB', band: 'Tally Hall',
      summary: 'Amigo cercano de la banda, miembro de anonyMous, road manager en las primeras giras, presentador de noticias en Tally Hall\'s Internet Show (T.H.I.S.) y primer portador de la corbata negra.',
      blocks: [
        { label: 'En Tally Hall y T.H.I.S.', text: 'Integrante del grupo de comedia universitaria anonyMous junto a Joe Hawley, Ross Federman y Bora Karaca en la Universidad de Michigan. Acompañó a Tally Hall en sus primeras giras como road manager y co-protagonizó numerosos sketches de Tally Hall\'s Internet Show vistiendo corbata negra.' },
        { label: 'Qué fue de él y Estado en 2026', text: 'Desarrolló su carrera profesional en la industria del cine, la televisión y la gestión de medios audiovisuales, manteniendo contacto con los integrantes del grupo.' }
      ],
      projects: [
        { title: 'Tally Hall\'s Internet Show (T.H.I.S.)', year: '2008 — 2010', type: 'Serie web', desc: 'Actor recurrente, presentador y colaborador creativo en los 10 episodios oficiales.', link: 'https://tallyall.club/go/?dir=img/T.H.I.S%20grabs' },
        { title: 'anonyMous — "Sargasm"', year: '2003', type: 'Comedia universitaria', desc: 'Colectivo de cine y comedia fundado en la Universidad de Michigan.' }
      ],
      facts: ['Corbata negra original', 'Colectivo anonyMous (UMich)', 'Actor y Road Manager en T.H.I.S.']
    },
    'th-matthew': {
      theme: 'th', name: 'Matthew Altruda', role: 'Locutor de radio · Promotor · Corbata Rosa Honoraria',
      tie: '#f472b6', initials: 'MA', band: 'Tally Hall',
      summary: 'Periodista musical, conductor del programa radial Tree Town Sound (107.1 FM Ann Arbor) y organizador del festival Sonic Lunch. Aliado histórico de Tally Hall y portador honorario de la corbata rosa.',
      blocks: [
        { label: 'Vínculo con Tally Hall', text: 'Desde mediados de los años 2000 en Ann Arbor, Matthew Altruda impulsó la música de Tally Hall y de sus proyectos solistas a través de la emisora 107.1 FM (WQKL) y su programa especializado Tree Town Sound.' },
        { label: 'Reuniones de Sonic Lunch (2023–2026)', text: 'Como organizador del ciclo de conciertos gratuitos Sonic Lunch en Liberty Plaza (Ann Arbor), gestionó y presentó el regreso a los escenarios de Andrew Horowitz, Ross Federman, Bora Karaca, Zubin Sedghi y Casey Shea en 2023, 2024 y 2025.' }
      ],
      projects: [
        { title: 'Tree Town Sound (107.1 FM Ann Arbor)', year: '2006 — 2026', type: 'Programa de radio', desc: 'Programa radial dominical dedicado a la escena musical de Michigan que estrenó múltiples demos y entrevistas de Tally Hall.' },
        { title: 'Sonic Lunch (Liberty Plaza, Ann Arbor)', year: '2008 — 2026', type: 'Festival en vivo', desc: 'Ciclo anual de conciertos en Ann Arbor donde se celebraron las reuniones de Tally Hall & Friends en 2023, 2024 y 2025.' }
      ],
      facts: ['Corbata rosa honoraria', 'Conductor de Tree Town Sound (107.1 FM)', 'Organizador de Sonic Lunch Ann Arbor']
    },
    'mm-joe': {
      theme: 'mm', name: 'Joe Hawley', role: 'Voz principal · Compositor · Director',
      tie: 'var(--th-red)', initials: 'JH', band: 'Miracle Musical',
      summary: 'Fundador y líder de Miracle Musical. Compositor principal de Hawaii: Part II y arquitecto de su universo conceptual, visual y narrativo.',
      blocks: [
        { label: 'Rol en el proyecto', text: 'Encabezó Miracle Musical tras el hiatus de Tally Hall en 2011. Compuso la mayor parte de Hawaii: Part II, dirigió el videojuego 8-bit de "Labyrinth" y el videoclip de "Variations on a Cloud".' },
        { label: 'En Tally Hall y Carrera Solista', text: 'Vocalista, guitarrista y compositor de Tally Hall (corbata roja). Autor del álbum solista "Joe Hawley Joe Hawley" (2016).' }
      ],
      projects: [
        { title: 'Hawaii: Part II & Variations on a Cloud', year: '2012', type: 'Álbum conceptual', desc: 'Obra magna de Miracle Musical publicada el 12/12/12 a las 12:12:12.', link: 'https://mirakurumyujikaru.bandcamp.com/album/hawaii-part-ii' },
        { title: 'Hawaii: Part II: Part ii (55 pistas)', year: '2014', type: 'Demos e instrumentales', desc: 'Compilación de 55 maquetas, tomas alternas e instrumentales de Hawaii: Part II.', link: 'https://mirakurumyujikaru.bandcamp.com/album/hawaii-part-ii-part-ii' },
        { title: 'Joe Hawley en Spotify', year: '2016 — presente', type: 'Perfil solista', desc: 'Composiciones solistas y sencillos como "Rotary Park" y "Crazy Food".', link: 'https://open.spotify.com/artist/2gkoczXRNRDUmfEdvr7CWm' }
      ],
      facts: ['Corbata roja', 'Compositor principal', 'Concepto visual y narrativo', 'Hawaii: Part II (12/12/12)']
    },
    'mm-rob': {
      theme: 'mm', name: 'Rob Cantor', role: 'Segunda voz · Co-letrista',
      tie: 'var(--th-yellow)', initials: 'RC', band: 'Miracle Musical',
      summary: 'Voz principal invitada y co-letrista en Miracle Musical. Corbata amarilla en Tally Hall.',
      blocks: [
        { label: 'Rol en el proyecto', text: 'Co-letrista y voz principal a dúo en "Variations on a Cloud", además de vocalista principal en "Time Machine" (pista 8 de Hawaii: Part II).' },
        { label: 'En Tally Hall y Disney TV', text: 'Vocalista y compositor de Tally Hall ("Just Apathy", "Greener", "Never Meant to Know", "You & Me"), autor de "Not a Trampoline" (2014) y compositor para Disney Television Animation.' }
      ],
      projects: [
        { title: 'Not a Trampoline', year: '2014', type: 'Álbum solista', desc: 'Álbum solista de indie pop con 12 pistas.', link: 'https://open.spotify.com/album/1Y5i7JllvK9heVzVfcEyIE' },
        { title: 'Rob Cantor en Spotify', year: '2014 — presente', type: 'Perfil solista', desc: 'Composiciones solistas y trabajos musicales para televisión.', link: 'https://open.spotify.com/artist/1NtYiv70buGwaMspHuD49I' }
      ],
      facts: ['Corbata amarilla', 'Co-letrista Variations on a Cloud', 'Voz principal en Time Machine', 'Not a Trampoline']
    },
    'mm-bora': {
      theme: 'mm', name: 'Bora Karaca', role: 'Ingeniería · Co-compositor · Co-productor',
      tie: 'var(--th-orange)', initials: 'BK', band: 'Miracle Musical',
      summary: 'Co-productor, ingeniero de sonido central y co-compositor registrado en Miracle Musical. Corbata naranja. Fundador de Cojum Dip.',
      blocks: [
        { label: 'Rol en el proyecto', text: 'Co-productor e ingeniero de grabación y mezcla en The LaBORAtory (Los Ángeles, CA). Autor e intérprete en japonés de "Space Station Level 7" y co-compositor registrado de "Variations on a Cloud".' },
        { label: 'Fuera del proyecto', text: 'Líder y fundador de Cojum Dip (metal vanguardista, álbum debut en 2014 y segundo álbum en producción).' }
      ],
      projects: [
        { title: 'Cojum Dip', year: '2014', type: 'Álbum debut', desc: 'Álbum homónimo de metal de vanguardia con Joe Hawley como vocalista invitado en "Moon Waltz".', link: 'https://cojumdip.bandcamp.com/album/cojum-dip' },
        { title: 'Cojum Dip en Spotify', year: '2014', type: 'Álbum de estudio', desc: 'Transmisión oficial de Cojum Dip en plataformas digitales.', link: 'https://open.spotify.com/album/5RSTrCPHo0MvHuO4BncjTw' }
      ],
      facts: ['Corbata naranja', 'Ingeniero The LaBORAtory', 'Autor de Space Station Level 7', 'Fundador de Cojum Dip']
    },
    'mm-ross': {
      theme: 'mm', name: 'Ross Federman', role: 'Co-productor · Co-compositor · Arte',
      tie: 'var(--th-gray)', initials: 'RF', band: 'Miracle Musical',
      summary: 'Co-productor, co-compositor registrado y diseñador de arte de Hawaii: Part II. Corbata gris en Tally Hall.',
      blocks: [
        { label: 'Rol en el proyecto', text: 'Co-productor, baterista/programador y co-compositor de Hawaii: Part II. Co-diseñó la emblemática portada cósmica del álbum y dirigió la estética visual del proyecto.' },
        { label: 'En Tally Hall y Ciencia', text: 'Baterista de Tally Hall desde mayo de 2004. Doctor en Inmunología (Ph.D., Yale University, 2019).' }
      ],
      projects: [
        { title: 'Hawaii: Part II (Producción & Arte)', year: '2012', type: 'Miracle Musical', desc: 'Co-producción, baterías y dirección de arte de la portada del álbum.', link: 'https://mirakurumyujikaru.bandcamp.com/album/hawaii-part-ii' },
        { title: 'Tally Hall en Spotify', year: '2004 — presente', type: 'Discografía', desc: 'Baterista en Marvin\'s Marvelous Mechanical Museum y Good & Evil.', link: 'https://open.spotify.com/artist/7lqaPghwYv2mE9baz5XQmL' }
      ],
      facts: ['Corbata gris', 'Co-productor', 'Dirección de arte H:II', 'Ph.D. en Inmunología (Yale)']
    },
    'mm-zubin': {
      theme: 'mm', name: 'Zubin Sedghi', role: 'Vocalista invitado',
      tie: 'var(--th-blue)', initials: 'ZS', band: 'Miracle Musical',
      summary: 'Vocalista invitado en Hawaii: Part II ("White Ball"). Corbata azul en Tally Hall.',
      blocks: [
        { label: 'Rol en el proyecto', text: 'Aportó la voz masculina solista en el dueto barroco de "White Ball" junto a Stephanie Koenig, una de las piezas centrales de Hawaii: Part II.' },
        { label: 'En Tally Hall y Medicina', text: 'Bajista y vocalista de Tally Hall. Doctor en Medicina Osteopática (D.O., Touro Univ, 2016) y médico de Medicina Familiar en Kaiser Permanente (Physician of the Year 2023).' }
      ],
      projects: [
        { title: 'Hawaii: Part II — "White Ball"', year: '2012', type: 'Voz invitada', desc: 'Interpretación vocal en el tema White Ball.', link: 'https://mirakurumyujikaru.bandcamp.com/track/white-ball' },
        { title: 'Tally Hall en Spotify', year: '2002 — presente', type: 'Discografía', desc: 'Vocalista solista y bajista en el catálogo oficial de Tally Hall.', link: 'https://open.spotify.com/artist/7lqaPghwYv2mE9baz5XQmL' }
      ],
      facts: ['Corbata azul', 'Vocalista en White Ball', 'Médico de Familia (D.O.)']
    }
  };

  function openMember(key) {
    var info = MEMBERS[key];
    if (!info) return;
    var activeSec = document.querySelector('.section.active');
    if (activeSec && activeSec.id !== 'member-view') {
      scrollPositions[activeSec.id] = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
      memberReturnTo = activeSec.id;
    }

    fadeSwap(function () {
      if (hub) hub.classList.add('hidden');
      sections.forEach(function (s) { s.classList.remove('active'); });

      var mv = document.getElementById('member-view');
      var content = document.getElementById('memberContent');
      mv.classList.remove('member-th', 'member-mm');
      mv.classList.add(info.theme === 'mm' ? 'member-mm' : 'member-th');
      mv.classList.add('active');

      clearBodyState([info.theme === 'mm' ? 'in-mm-section' : 'in-th-section']);

      var blocks = info.blocks.map(function (b) {
        return '<div class="mv-block"><div class="mv-label">' + b.label + '</div><p>' + b.text + '</p></div>';
      }).join('');

      var projectsHtml = '';
      if (info.projects && info.projects.length > 0) {
        var items = info.projects.map(function (p) {
          return '<div class="mv-project-item">' +
                   '<div class="mv-project-head">' +
                     '<span class="mv-project-title">' + p.title + '</span>' +
                     (p.year ? '<span class="mv-project-year">' + p.year + '</span>' : '') +
                     (p.type ? '<span class="mv-project-type">' + p.type + '</span>' : '') +
                   '</div>' +
                   '<p class="mv-project-desc">' + p.desc + '</p>' +
                   (p.link ? '<div style="margin-top:8px;"><a href="' + p.link + '" target="_blank" rel="noopener noreferrer" class="mv-project-link">Escuchar / Archivo ↗</a></div>' : '') +
                 '</div>';
        }).join('');
        projectsHtml = '<div class="mv-block"><div class="mv-label">Proyectos propios y colaboraciones</div><div class="mv-projects">' + items + '</div></div>';
      }

      var facts = info.facts.map(function (f) {
        return '<span class="mv-fact">' + f + '</span>';
      }).join('');

      content.innerHTML =
        '<div class="mv-hero">' +
          '<div class="mv-avatar" style="background:' + info.tie + '">' +
            info.initials +
            '<span class="mv-avatar-tie">' + getTieSvg(info.tie) + '</span>' +
          '</div>' +
          '<div>' +
            '<div class="mv-hero-name">' + info.name + '</div>' +
            '<div class="mv-hero-role">' + info.role + '</div>' +
            '<span class="mv-band-tag">' + info.band + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="mv-block"><p>' + info.summary + '</p></div>' +
        blocks +
        projectsHtml +
        '<div class="mv-block"><div class="mv-label">Datos clave</div><div class="mv-facts">' + facts + '</div></div>' +
        '<div class="mv-back-hint" id="mvBack">← Volver a ' + info.band + '</div>';

      document.title = info.name + ' · ' + info.band;
      if (backBtns[0]) backBtns[0].style.display = 'flex';
      updateDock('member-view', info.name);

      var backHint = document.getElementById('mvBack');
      if (backHint) backHint.addEventListener('click', function () {
        returnFromMember();
      });
    }, 0);
  }

  var memberCards = document.querySelectorAll('.th-member, .mm-member');

  memberCards.forEach(function (card) {
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');

    function activate() {
      var expanded = card.classList.toggle('expanded');
      card.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    }

    card.addEventListener('click', function () {
      var key = card.getAttribute('data-member');
      if (key && MEMBERS[key]) openMember(key);
      else activate();
    });

    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        var key = card.getAttribute('data-member');
        if (key && MEMBERS[key]) openMember(key);
        else activate();
      }
    });
  });

  function createParticles(containerId, particleClass, count) {
    if (reducedMotion) return;
    var container = document.getElementById(containerId);
    if (!container) return;
    for (var i = 0; i < count; i++) {
      var p = document.createElement('div');
      p.className = 'particle ' + particleClass;
      p.style.left = Math.random() * 100 + '%';
      p.style.top = (80 + Math.random() * 20) + '%';
      p.style.animationDelay = (Math.random() * 8) + 's';
      p.style.animationDuration = (6 + Math.random() * 6) + 's';
      p.style.width = (2 + Math.random() * 4) + 'px';
      p.style.height = p.style.width;
      container.appendChild(p);
    }
  }

  var thParticlesCreated = false;
  var mmParticlesCreated = false;

  var sectionObserver = new MutationObserver(function () {
    var thSection = document.getElementById('th-section');
    var mmSection = document.getElementById('mm-section');

    if (thSection && thSection.classList.contains('active') && !thParticlesCreated) {
      createParticles('th-particles', 'th-particle', 25);
      thParticlesCreated = true;
    }
    if (mmSection && mmSection.classList.contains('active') && !mmParticlesCreated) {
      createParticles('mm-particles', 'mm-particle', 30);
      mmParticlesCreated = true;
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
    if (e.key === 'Escape') {
      var activeSec = document.querySelector('.section.active');
      if (activeSec && activeSec.id === 'member-view') {
        returnFromMember();
      } else {
        showHub();
      }
    } else if (e.key === 'm' || e.key === 'M') {
      audioEnabled = !audioEnabled;
      applyAudioState();
    }
  });

  function handleInitialHash() {
    var hash = window.location.hash;
    if (!hash) {
      activateVideo('mm');
      ensurePlay(VIDEOS.mm);
      return;
    }
    var clean = hash.replace(/^#/, '');
    if (clean.indexOf('th-') === 0 || clean === 'th') {
      enterSection('th-section', false);
      if (clean !== 'th' && clean !== 'th-section') {
        setTimeout(function () {
          var targetEl = document.getElementById(clean);
          if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
        }, 360);
      }
    } else if (clean.indexOf('mm-') === 0 || clean === 'mm') {
      enterSection('mm-section', false);
      if (clean !== 'mm' && clean !== 'mm-section') {
        setTimeout(function () {
          var targetEl = document.getElementById(clean);
          if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
        }, 360);
      }
    } else if (clean.indexOf('cjum-') === 0 || clean === 'cjum') {
      enterSection('cjum-section', false);
      if (clean !== 'cjum' && clean !== 'cjum-section') {
        setTimeout(function () {
          var targetEl = document.getElementById(clean);
          if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
        }, 360);
      }
    }
  }

  handleInitialHash();
  window.addEventListener('hashchange', handleInitialHash);

})();
