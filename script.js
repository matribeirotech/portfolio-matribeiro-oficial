document.addEventListener('DOMContentLoaded', () => {

    /* ======================================================================
     * 1. SCROLL REVEAL (IntersectionObserver)
     * ====================================================================== */
    const revealElements = document.querySelectorAll('.reveal-up');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
        revealElements.forEach(el => el.classList.add('visible'));
    } else {
        const revealObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    /* ======================================================================
     * 2. HEADER SCROLL STATE & ACTIVE SECTION SYNC (DESKTOP + MOBILE DOCK)
     * ====================================================================== */
    const navbar = document.getElementById('navbar');
    const onScrollHeader = () => {
        if (navbar) {
            navbar.classList.toggle('scrolled', window.scrollY > 24);
        }
    };
    onScrollHeader();
    window.addEventListener('scroll', onScrollHeader, { passive: true });

    const sections = document.querySelectorAll('main section[id]');
    const navItems = document.querySelectorAll('[data-section]');

    if (sections.length && navItems.length && 'IntersectionObserver' in window) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const activeId = entry.target.id;
                navItems.forEach(item => {
                    item.classList.toggle('active', item.getAttribute('data-section') === activeId);
                });
            });
        }, { rootMargin: '-40% 0px -45% 0px' });

        sections.forEach(section => sectionObserver.observe(section));
    }

    /* ======================================================================
     * 3. SPOTLIGHT CARDS (Cursor Radial Glow on Desktop)
     * ====================================================================== */
    const spotlightCards = document.querySelectorAll('.spotlight-card');
    if (window.matchMedia('(pointer: fine)').matches) {
        spotlightCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
            });
        });
    }

    /* ======================================================================
     * 4. HERO MULTI-TAB ARCHITECTURE CONSOLE
     * ====================================================================== */
    const ideTabs = document.querySelectorAll('.ide-tab');
    const ideBodies = document.querySelectorAll('.ide-body');

    ideTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-tab');
            ideTabs.forEach(t => {
                const isSelected = t === tab;
                t.classList.toggle('active', isSelected);
                t.setAttribute('aria-selected', String(isSelected));
            });
            ideBodies.forEach(body => {
                body.classList.toggle('active', body.id === `tab-${target}`);
            });
        });
    });

    /* ======================================================================
     * 5. ZENDA FLAGSHIP SCREEN SWITCHER & PIPELINE STEPS
     * ====================================================================== */
    const zendaSwitchBtns = document.querySelectorAll('[data-zenda-view]');
    const zendaViewCrm = document.getElementById('zenda-view-crm');
    const zendaViewMarketing = document.getElementById('zenda-view-marketing');
    const zendaUrlDisplay = document.getElementById('zenda-url-display');

    zendaSwitchBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.getAttribute('data-zenda-view');
            zendaSwitchBtns.forEach(b => {
                const active = b === btn;
                b.classList.toggle('active', active);
                b.setAttribute('aria-selected', String(active));
            });

            if (view === 'crm') {
                zendaViewCrm?.classList.add('active');
                zendaViewMarketing?.classList.remove('active');
                if (zendaUrlDisplay) zendaUrlDisplay.textContent = 'app.lypsyos.com/crm';
            } else {
                zendaViewMarketing?.classList.add('active');
                zendaViewCrm?.classList.remove('active');
                if (zendaUrlDisplay) zendaUrlDisplay.textContent = 'app.lypsyos.com/marketing';
            }
        });
    });

    const flowSteps = document.querySelectorAll('.flow-step');
    flowSteps.forEach(step => {
        step.addEventListener('click', () => {
            flowSteps.forEach(s => s.classList.toggle('active', s === step));
        });
    });

    /* ======================================================================
     * 6. MONITOR-CYD-RESOURCES: LIVE RGB565 HARDWARE THEME SWITCHER
     * ====================================================================== */
    const cydThemes = {
        matrix: {
            url: 'https://raw.githubusercontent.com/matribeirotech/monitor-cyd-resources/main/preview/preview-tela-1.jpg',
            code: 'HEX #00FF66 → RGB565 0x07EC · SCR_RESUMO (MATRIX)',
            caption: 'Tela Resumo Gauges — Tema Verde Matrix (#00FF66) com Ticker Tape financeiro em funcionamento real na placa ESP32-2432S028R.'
        },
        neon: {
            url: 'https://raw.githubusercontent.com/matribeirotech/monitor-cyd-resources/main/preview/preview-tela-2.jpg',
            code: 'HEX #00D4FF → RGB565 0x06BF · SCR_RESUMO (NEON BLUE)',
            caption: 'Tela Resumo Gauges — Tema Azul Neon (#00D4FF) repintado em tempo real via USB Serial com cotações de Dólar e Euro no rodapé.'
        },
        crimson: {
            url: 'https://raw.githubusercontent.com/matribeirotech/monitor-cyd-resources/main/preview/preview-tela-3.jpg',
            code: 'HEX #FF2A55 → RGB565 0xF94A · SCR_RESUMO (CRIMSON RED)',
            caption: 'Tela Resumo Gauges — Tema Vermelho Crimson (#FF2A55) com cotações de Solana (SOL) e BNB correndo a 28 FPS no rodapé.'
        }
    };

    const rgbSwatches = document.querySelectorAll('[data-cyd-theme]');
    const cydLiveImg = document.getElementById('cyd-live-theme-img');
    const cydLiveCode = document.getElementById('cyd-live-theme-code');

    rgbSwatches.forEach(swatch => {
        swatch.addEventListener('click', () => {
            const key = swatch.getAttribute('data-cyd-theme');
            const themeData = cydThemes[key];
            if (!themeData || !cydLiveImg) return;

            rgbSwatches.forEach(s => {
                const isSelected = s === swatch;
                s.classList.toggle('active', isSelected);
                s.setAttribute('aria-selected', String(isSelected));
            });

            cydLiveImg.style.opacity = '0.35';
            setTimeout(() => {
                cydLiveImg.src = themeData.url;
                cydLiveImg.setAttribute('data-caption', themeData.caption);
                if (cydLiveCode) cydLiveCode.textContent = themeData.code;
                cydLiveImg.style.opacity = '1';
            }, 140);
        });
    });

    /* ======================================================================
     * 7. CYD GALLERY FILTERS & MOBILE SWIPE DOTS
     * ====================================================================== */
    const filterChips = document.querySelectorAll('.filter-chip');
    const galleryItems = document.querySelectorAll('#cyd-gallery .gallery-item');
    const cydGallery = document.getElementById('cyd-gallery');
    const cydDotsContainer = document.getElementById('cyd-carousel-dots');

    const rebuildMobileDots = () => {
        if (!cydDotsContainer) return;
        const visibleItems = Array.from(galleryItems).filter(item => !item.classList.contains('hidden'));
        cydDotsContainer.innerHTML = '';
        visibleItems.forEach((_, idx) => {
            const dot = document.createElement('span');
            dot.className = `carousel-dot${idx === 0 ? ' active' : ''}`;
            cydDotsContainer.appendChild(dot);
        });
    };

    rebuildMobileDots();

    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const filter = chip.getAttribute('data-filter');
            filterChips.forEach(c => c.classList.toggle('active', c === chip));

            galleryItems.forEach(item => {
                const cat = item.getAttribute('data-category');
                const shouldShow = filter === 'all' || cat === filter;
                item.classList.toggle('hidden', !shouldShow);
            });

            if (cydGallery) cydGallery.scrollTo({ left: 0, behavior: 'smooth' });
            rebuildMobileDots();
        });
    });

    if (cydGallery && cydDotsContainer) {
        cydGallery.addEventListener('scroll', () => {
            const dots = cydDotsContainer.querySelectorAll('.carousel-dot');
            if (!dots.length) return;
            const scrollWidth = cydGallery.scrollWidth - cydGallery.clientWidth;
            if (scrollWidth <= 0) return;
            const progress = cydGallery.scrollLeft / scrollWidth;
            const activeIdx = Math.min(dots.length - 1, Math.round(progress * (dots.length - 1)));
            dots.forEach((d, i) => d.classList.toggle('active', i === activeIdx));
        }, { passive: true });
    }

    /* ======================================================================
     * 8. MOBILE EXCLUSIVE UX: NATIVE BOTTOM SHEET (WITH TOUCH SWIPE DOWN)
     * ====================================================================== */
    const openSheetBtn = document.getElementById('open-quick-sheet');
    const closeSheetBtn = document.getElementById('close-quick-sheet');
    const quickSheet = document.getElementById('quick-sheet');
    const sheetBackdrop = document.getElementById('quick-sheet-backdrop');
    const sheetDragHandle = document.getElementById('sheet-drag-handle');

    const setQuickSheet = (open) => {
        if (!quickSheet || !sheetBackdrop) return;
        quickSheet.classList.toggle('hidden', !open);
        sheetBackdrop.classList.toggle('hidden', !open);
        quickSheet.style.transform = '';
    };

    openSheetBtn?.addEventListener('click', () => setQuickSheet(true));
    closeSheetBtn?.addEventListener('click', () => setQuickSheet(false));
    sheetBackdrop?.addEventListener('click', () => setQuickSheet(false));

    // Suporte a gesto de arrastar para baixo (Swipe-Down to Dismiss)
    let touchStartY = 0;
    let touchDeltaY = 0;

    if (sheetDragHandle && quickSheet) {
        sheetDragHandle.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
            touchDeltaY = 0;
        }, { passive: true });

        sheetDragHandle.addEventListener('touchmove', (e) => {
            touchDeltaY = e.touches[0].clientY - touchStartY;
            if (touchDeltaY > 0) {
                quickSheet.style.transform = `translateY(${touchDeltaY}px)`;
            }
        }, { passive: true });

        sheetDragHandle.addEventListener('touchend', () => {
            if (touchDeltaY > 75) {
                setQuickSheet(false);
            } else {
                quickSheet.style.transform = '';
            }
        });
    }

    /* ======================================================================
     * 9. HIGH-RES LIGHTBOX MODAL (FOR CYD & ZENDA SCREENSHOTS)
     * ====================================================================== */
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');

    const closeLightbox = () => {
        if (!lightboxModal) return;
        lightboxModal.classList.add('hidden');
        if (lightboxImg) lightboxImg.src = '';
    };

    lightboxTriggers.forEach(img => {
        img.addEventListener('click', () => {
            if (!lightboxModal || !lightboxImg) return;
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            if (lightboxCaption) {
                lightboxCaption.textContent = img.getAttribute('data-caption') || img.alt;
            }
            lightboxModal.classList.remove('hidden');
        });
    });

    lightboxClose?.addEventListener('click', closeLightbox);
    lightboxModal?.addEventListener('click', (e) => {
        if (e.target === lightboxModal) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeLightbox();
            setQuickSheet(false);
        }
    });

    /* ======================================================================
     * 10. TOAST FEEDBACK, ONE-CLICK EMAIL COPY & BRIEFING COMPOSER
     * ====================================================================== */
    const toastEl = document.getElementById('toast-notification');
    let toastTimer = null;

    const showToast = (msg) => {
        if (!toastEl) return;
        toastEl.textContent = msg;
        toastEl.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            toastEl.classList.remove('show');
        }, 3200);
    };

    const copyEmailBtn = document.getElementById('copy-email-btn');
    copyEmailBtn?.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText('matheusrds@lypsyos.com');
            showToast('✓ E-mail copiado: matheusrds@lypsyos.com');
        } catch {
            showToast('E-mail: matheusrds@lypsyos.com');
        }
    });

    const topicPills = document.querySelectorAll('.topic-pill');
    let selectedTopic = 'Oportunidade / Engenharia de Software';

    topicPills.forEach(pill => {
        pill.addEventListener('click', () => {
            topicPills.forEach(p => p.classList.toggle('active', p === pill));
            selectedTopic = pill.getAttribute('data-topic') || selectedTopic;
        });
    });

    const quickContactForm = document.getElementById('quick-contact-form');
    quickContactForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('sender-name');
        const messageInput = document.getElementById('sender-message');
        const senderName = nameInput ? nameInput.value.trim() : '';
        const senderMessage = messageInput ? messageInput.value.trim() : '';

        const subject = encodeURIComponent(`[Portfólio] ${selectedTopic} — ${senderName}`);
        const body = encodeURIComponent(
            `Olá Matheus,\n\nMeu nome/empresa: ${senderName}\nAssunto: ${selectedTopic}\n\nMensagem:\n${senderMessage}\n\n---\nEnviado via matribeiro.tech`
        );

        window.location.href = `mailto:matheusrds@lypsyos.com?subject=${subject}&body=${body}`;
        showToast('⚡ Abrindo seu cliente de e-mail com o briefing pronto!');
    });
});