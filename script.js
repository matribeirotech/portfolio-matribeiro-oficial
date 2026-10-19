document.addEventListener('DOMContentLoaded', () => {

    /* ======================================================================
     * 1. SCROLL REVEAL (IntersectionObserver + 3D Mobile Spring)
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
        }, { rootMargin: '0px 0px -6% 0px', threshold: 0.1 });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    /* ======================================================================
     * 2. HEADER SCROLL, PROGRESS BAR & ACTIVE SECTION SYNC (DESKTOP + MOBILE)
     * ====================================================================== */
    const navbar = document.getElementById('navbar');
    const progressBar = document.getElementById('scroll-progress-bar');

    const onScrollPage = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        if (navbar) {
            navbar.classList.toggle('scrolled', scrollTop > 20);
        }
        if (progressBar) {
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const pct = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;
            progressBar.style.width = `${pct}%`;
        }
    };
    onScrollPage();
    window.addEventListener('scroll', onScrollPage, { passive: true });

    const sectionNames = {
        hero: '01 · INÍCIO',
        lypsyos: '02 · LYPSYOS',
        opensource: '03 · OPEN SOURCE',
        sobre: '04 · STACK',
        contato: '05 · CONTATO'
    };

    const sections = document.querySelectorAll('main section[id]');
    const navItems = document.querySelectorAll('[data-section]');
    const mobileSectionBadge = document.getElementById('mobile-section-badge');
    const mobileSectionLabel = document.getElementById('mobile-section-label');
    let currentActiveSection = 'hero';

    if (sections.length && navItems.length && 'IntersectionObserver' in window) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const activeId = entry.target.id;
                navItems.forEach(item => {
                    item.classList.toggle('active', item.getAttribute('data-section') === activeId);
                });

                if (activeId !== currentActiveSection && mobileSectionLabel && sectionNames[activeId]) {
                    currentActiveSection = activeId;
                    mobileSectionLabel.textContent = sectionNames[activeId];
                    if (mobileSectionBadge && !prefersReducedMotion) {
                        mobileSectionBadge.classList.remove('badge-flip');
                        void mobileSectionBadge.offsetWidth;
                        mobileSectionBadge.classList.add('badge-flip');
                    }
                }
            });
        }, { rootMargin: '-38% 0px -45% 0px' });

        sections.forEach(section => sectionObserver.observe(section));
    }

    /* ======================================================================
     * 3. DESKTOP CURSOR SPOTLIGHT + MOBILE AUTO-SPOTLIGHT & TOUCH RIPPLE
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

    // Mobile & Tablet Exclusive: Auto-illuminate cards in the center of viewport on scroll
    if ('IntersectionObserver' in window && !prefersReducedMotion) {
        const mobileFocusObserver = new IntersectionObserver((entries) => {
            if (window.innerWidth > 1024) return;
            entries.forEach(entry => {
                entry.target.classList.toggle('mobile-active-card', entry.isIntersecting);
            });
        }, { rootMargin: '-28% 0px -28% 0px', threshold: 0.25 });

        spotlightCards.forEach(card => mobileFocusObserver.observe(card));
    }

    // Mobile & Tablet Exclusive: Touch Ripple Wave on interactive elements
    if (!prefersReducedMotion) {
        const rippleTargets = document.querySelectorAll('.spotlight-card, .story-chip');
        rippleTargets.forEach(target => {
            target.addEventListener('touchstart', (e) => {
                if (window.innerWidth > 1024 || !e.touches.length) return;
                const touch = e.touches[0];
                const rect = target.getBoundingClientRect();
                const x = touch.clientX - rect.left;
                const y = touch.clientY - rect.top;

                target.style.setProperty('--mouse-x', `${x}px`);
                target.style.setProperty('--mouse-y', `${y}px`);

                const ripple = document.createElement('span');
                ripple.className = 'touch-ripple';
                const size = Math.max(rect.width, rect.height) * 0.65;
                ripple.style.width = `${size}px`;
                ripple.style.height = `${size}px`;
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;

                target.appendChild(ripple);
                setTimeout(() => ripple.remove(), 680);
            }, { passive: true });
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
     * 5. ZENDA FLAGSHIP SCREEN SWITCHER & AUTO-CYCLING LIVE PIPELINE
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

    const flowSteps = Array.from(document.querySelectorAll('.flow-step'));
    const zendaPipeline = document.getElementById('zenda-pipeline');
    let flowInterval = null;
    let currentStepIdx = 0;
    let userPausedFlow = false;

    const activateFlowStep = (idx, isAuto = false) => {
        flowSteps.forEach((s, i) => {
            const active = i === idx;
            s.classList.toggle('active', active);
            s.classList.toggle('auto-cycling', active && isAuto);
        });
    };

    const startFlowCycle = () => {
        if (prefersReducedMotion || userPausedFlow || flowInterval || !flowSteps.length) return;
        activateFlowStep(currentStepIdx, true);
        flowInterval = setInterval(() => {
            currentStepIdx = (currentStepIdx + 1) % flowSteps.length;
            activateFlowStep(currentStepIdx, true);
        }, 3200);
    };

    const stopFlowCycle = () => {
        if (flowInterval) {
            clearInterval(flowInterval);
            flowInterval = null;
        }
    };

    flowSteps.forEach((step, idx) => {
        step.addEventListener('click', () => {
            userPausedFlow = true;
            stopFlowCycle();
            currentStepIdx = idx;
            activateFlowStep(idx, false);
        });
    });

    if (zendaPipeline && 'IntersectionObserver' in window && !prefersReducedMotion) {
        const pipelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startFlowCycle();
                } else {
                    stopFlowCycle();
                }
            });
        }, { threshold: 0.3 });
        pipelineObserver.observe(zendaPipeline);
    }

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
     * 7. CYD GALLERY FILTERS & MOBILE STACK DOMAIN SWITCHER
     * ====================================================================== */
    const filterChips = document.querySelectorAll('.filter-chip');
    const galleryItems = document.querySelectorAll('#cyd-gallery .gallery-item');

    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const filter = chip.getAttribute('data-filter');
            filterChips.forEach(c => c.classList.toggle('active', c === chip));

            galleryItems.forEach(item => {
                const cat = item.getAttribute('data-category');
                const shouldShow = filter === 'all' || cat === filter;
                item.classList.toggle('hidden', !shouldShow);
            });
        });
    });

    // Mobile & Tablet Exclusive Stack Filter
    const stackTabBtns = document.querySelectorAll('[data-stack-filter]');
    const stackDomainCards = document.querySelectorAll('[data-stack-domain]');

    stackTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-stack-filter');
            stackTabBtns.forEach(b => {
                const active = b === btn;
                b.classList.toggle('active', active);
                b.setAttribute('aria-selected', String(active));
            });

            stackDomainCards.forEach(card => {
                const domain = card.getAttribute('data-stack-domain');
                const shouldShow = filter === 'all' || domain === filter;
                card.classList.toggle('hidden', !shouldShow);
                if (shouldShow && !prefersReducedMotion) {
                    card.classList.remove('stack-filtered-in');
                    void card.offsetWidth;
                    card.classList.add('stack-filtered-in');
                }
            });
        });
    });

    /* ======================================================================
     * 8. MOBILE & TABLET EXCLUSIVE UX: NATIVE BOTTOM SHEET (WITH SWIPE DOWN)
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