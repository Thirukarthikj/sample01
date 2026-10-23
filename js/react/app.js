/**
 * Bobby Packaging - React Application Core
 * Powered by React 18 & ReactDOM
 * 
 * Human-crafted, modular React architecture managing state, navigation,
 * dynamic carousels, catalog filters, modals, and user interactions.
 */

(function () {
  'use strict';

  // Ensure React and ReactDOM are available
  if (typeof React === 'undefined' || typeof ReactDOM === 'undefined') {
    console.error('React or ReactDOM is not loaded. Please load React vendor scripts before app.js');
    return;
  }

  const { useState, useEffect, useRef, useCallback } = React;

  /* ==========================================================================
     1. Navigation Component Controller
     Manages header scroll styles and mobile drawer toggle
     ========================================================================== */
  function useNavbar() {
    const headerRef = useRef(document.getElementById('mainHeader'));
    const menuToggleRef = useRef(document.getElementById('menuToggle'));
    const mobileMenuRef = useRef(document.getElementById('mobileMenu'));
    const [scrolled, setScrolled] = useState(window.scrollY > 20);
    const [mobileOpen, setMobileOpen] = useState(false);

    // Scroll state management
    useEffect(() => {
      const handleScroll = () => {
        const isPastThreshold = window.scrollY > 20;
        setScrolled(isPastThreshold);

        const header = headerRef.current;
        if (header) {
          if (isPastThreshold) {
            header.classList.add('bg-white/95', 'shadow-md', 'py-3');
            header.classList.remove('bg-white/85', 'py-4', 'shadow-sm');
          } else {
            header.classList.add('bg-white/85', 'py-4', 'shadow-sm');
            header.classList.remove('bg-white/95', 'shadow-md', 'py-3');
          }
        }
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll(); // initial sync

      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Mobile menu toggle management
    useEffect(() => {
      const menuToggle = menuToggleRef.current;
      const mobileMenu = mobileMenuRef.current;
      if (!menuToggle || !mobileMenu) return;

      const toggleMenu = () => {
        setMobileOpen(prev => {
          const next = !prev;
          if (next) {
            mobileMenu.classList.remove('hidden');
          } else {
            mobileMenu.classList.add('hidden');
          }
          return next;
        });
      };

      const closeMenu = () => {
        setMobileOpen(false);
        mobileMenu.classList.add('hidden');
      };

      menuToggle.addEventListener('click', toggleMenu);
      const links = mobileMenu.querySelectorAll('a');
      links.forEach(link => link.addEventListener('click', closeMenu));

      return () => {
        menuToggle.removeEventListener('click', toggleMenu);
        links.forEach(link => link.removeEventListener('click', closeMenu));
      };
    }, []);

    return { scrolled, mobileOpen };
  }

  /* ==========================================================================
     2. Hero Carousel Component Controller
     Horizontal slide transition, autoplay, touch swipe & keyboard navigation
     ========================================================================== */
  function useHeroCarousel() {
    const track = document.getElementById('heroTrack');
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.carousel-dot');
    const prevBtn = document.getElementById('heroPrevBtn');
    const nextBtn = document.getElementById('heroNextBtn');
    const heroSection = document.getElementById('heroSection');

    const [currentSlide, setCurrentSlide] = useState(0);
    const slideCount = slides.length;
    const timerRef = useRef(null);

    const updateSlideView = useCallback((index) => {
      if (slideCount === 0) return;

      if (track) {
        track.style.transform = `translateX(-${index * 100}%)`;
      } else {
        slides.forEach((slide, i) => {
          if (i === index) {
            slide.classList.remove('opacity-0', 'pointer-events-none');
            slide.classList.add('opacity-100', 'z-10');
          } else {
            slide.classList.remove('opacity-100', 'z-10');
            slide.classList.add('opacity-0', 'pointer-events-none');
          }
        });
      }

      dots.forEach((dot, i) => {
        if (i === index) {
          dot.className = 'carousel-dot h-2.5 rounded-full transition-all duration-500 w-8 bg-sky-600 cursor-pointer';
        } else {
          dot.className = 'carousel-dot h-2.5 rounded-full transition-all duration-500 w-2.5 bg-slate-300 hover:bg-slate-400 cursor-pointer';
        }
      });
    }, [slideCount, track, slides, dots]);

    const goToSlide = useCallback((index) => {
      if (slideCount === 0) return;
      const target = (index + slideCount) % slideCount;
      setCurrentSlide(target);
      updateSlideView(target);
    }, [slideCount, updateSlideView]);

    const nextSlide = useCallback(() => {
      goToSlide(currentSlide + 1);
    }, [currentSlide, goToSlide]);

    const prevSlide = useCallback(() => {
      goToSlide(currentSlide - 1);
    }, [currentSlide, goToSlide]);

    // Autoplay timer handling
    const startAutoplay = useCallback(() => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setCurrentSlide(prev => {
          const next = (prev + 1) % slideCount;
          updateSlideView(next);
          return next;
        });
      }, 5000);
    }, [slideCount, updateSlideView]);

    const stopAutoplay = useCallback(() => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }, []);

    useEffect(() => {
      if (slideCount === 0) return;

      // Initial slide view
      updateSlideView(0);
      startAutoplay();

      // Dot click listeners
      const dotHandlers = [];
      dots.forEach((dot, i) => {
        const handler = () => {
          goToSlide(i);
          startAutoplay();
        };
        dot.addEventListener('click', handler);
        dotHandlers.push({ dot, handler });
      });

      // Next / Prev buttons
      const handleNext = (e) => {
        e.preventDefault();
        nextSlide();
        startAutoplay();
      };
      const handlePrev = (e) => {
        e.preventDefault();
        prevSlide();
        startAutoplay();
      };

      if (nextBtn) nextBtn.addEventListener('click', handleNext);
      if (prevBtn) prevBtn.addEventListener('click', handlePrev);

      // Hover pause
      const handleMouseEnter = () => stopAutoplay();
      const handleMouseLeave = () => startAutoplay();

      if (heroSection) {
        heroSection.addEventListener('mouseenter', handleMouseEnter);
        heroSection.addEventListener('mouseleave', handleMouseLeave);
      }

      // Touch gestures
      let touchStartX = 0;
      let touchStartY = 0;

      const handleTouchStart = (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
        stopAutoplay();
      };

      const handleTouchEnd = (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        const touchEndY = e.changedTouches[0].screenY;
        const diffX = touchStartX - touchEndX;
        const diffY = touchStartY - touchEndY;

        if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
          if (diffX > 0) {
            nextSlide();
          } else {
            prevSlide();
          }
        }
        startAutoplay();
      };

      if (heroSection) {
        heroSection.addEventListener('touchstart', handleTouchStart, { passive: true });
        heroSection.addEventListener('touchend', handleTouchEnd, { passive: true });
      }

      // Keyboard arrow keys
      const handleKeyDown = (e) => {
        if (heroSection && heroSection.getBoundingClientRect().bottom > 0) {
          if (e.key === 'ArrowRight') {
            nextSlide();
            startAutoplay();
          } else if (e.key === 'ArrowLeft') {
            prevSlide();
            startAutoplay();
          }
        }
      };
      document.addEventListener('keydown', handleKeyDown);

      // Document visibility check
      const handleVisibilityChange = () => {
        if (document.hidden) {
          stopAutoplay();
        } else {
          startAutoplay();
        }
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);

      return () => {
        stopAutoplay();
        dotHandlers.forEach(({ dot, handler }) => dot.removeEventListener('click', handler));
        if (nextBtn) nextBtn.removeEventListener('click', handleNext);
        if (prevBtn) prevBtn.removeEventListener('click', handlePrev);
        if (heroSection) {
          heroSection.removeEventListener('mouseenter', handleMouseEnter);
          heroSection.removeEventListener('mouseleave', handleMouseLeave);
          heroSection.removeEventListener('touchstart', handleTouchStart);
          heroSection.removeEventListener('touchend', handleTouchEnd);
        }
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }, [slideCount, updateSlideView, startAutoplay, stopAutoplay, goToSlide, nextSlide, prevSlide]);

    return { currentSlide, goToSlide, nextSlide, prevSlide };
  }

  /* ==========================================================================
     3. Products Filter Component Controller
     Category, application, format, and search query filtering
     ========================================================================== */
  function useProductsFilter() {
    const categorySelect = document.getElementById('filterCategory');
    const appSelect = document.getElementById('filterApplication');
    const formatSelect = document.getElementById('filterFormat');
    const refineBtn = document.getElementById('btnRefineProducts');
    const cards = document.querySelectorAll('.product-catalog-card');
    const emptyState = document.getElementById('productsEmptyState');

    const [filters, setFilters] = useState({
      category: '',
      application: '',
      format: '',
      search: ''
    });

    const applyFilter = useCallback(() => {
      if (!cards.length) return;

      const cat = categorySelect ? categorySelect.value.toLowerCase() : '';
      const app = appSelect ? appSelect.value.toLowerCase() : '';
      const fmt = formatSelect ? formatSelect.value.toLowerCase() : '';

      let count = 0;
      cards.forEach(card => {
        const cardCat = (card.dataset.category || '').toLowerCase();
        const cardApp = (card.dataset.application || '').toLowerCase();
        const cardFmt = (card.dataset.format || '').toLowerCase();

        const matchCat = !cat || cardCat.includes(cat);
        const matchApp = !app || cardApp.includes(app);
        const matchFmt = !fmt || cardFmt.includes(fmt);

        if (matchCat && matchApp && matchFmt) {
          card.style.display = '';
          count++;
        } else {
          card.style.display = 'none';
        }
      });

      if (emptyState) {
        emptyState.style.display = count === 0 ? 'block' : 'none';
      }
    }, [cards, categorySelect, appSelect, formatSelect, emptyState]);

    useEffect(() => {
      if (!cards.length) return;

      // Handle URL search parameter
      const params = new URLSearchParams(window.location.search);
      const search = params.get('search');
      if (search) {
        const q = search.toLowerCase();
        cards.forEach(card => {
          const title = (card.querySelector('h3') ? card.querySelector('h3').textContent : '').toLowerCase();
          const desc = (card.querySelector('p') ? card.querySelector('p').textContent : '').toLowerCase();
          if (title.includes(q) || desc.includes(q)) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      }

      if (categorySelect) categorySelect.addEventListener('change', applyFilter);
      if (appSelect) appSelect.addEventListener('change', applyFilter);
      if (formatSelect) formatSelect.addEventListener('change', applyFilter);
      if (refineBtn) refineBtn.addEventListener('click', applyFilter);

      return () => {
        if (categorySelect) categorySelect.removeEventListener('change', applyFilter);
        if (appSelect) appSelect.removeEventListener('change', applyFilter);
        if (formatSelect) formatSelect.removeEventListener('change', applyFilter);
        if (refineBtn) refineBtn.removeEventListener('click', applyFilter);
      };
    }, [cards, categorySelect, appSelect, formatSelect, refineBtn, applyFilter]);

    return { filters, setFilters, applyFilter };
  }

  /* ==========================================================================
     4. Films Filter Controller (films.html)
     Pill-based film spec filtering
     ========================================================================== */
  function useFilmsFilter() {
    const pills = document.querySelectorAll('.film-filter-pill');
    const cards = document.querySelectorAll('.film-spec-card');

    const [activePill, setActivePill] = useState('All');

    useEffect(() => {
      if (!pills.length || !cards.length) return;

      const handlers = [];
      pills.forEach(pill => {
        const handler = () => {
          const category = pill.dataset.category || 'All';
          setActivePill(category);

          pills.forEach(p => {
            p.className = 'film-filter-pill px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all border cursor-pointer bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary';
          });
          pill.className = 'film-filter-pill px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all border cursor-pointer bg-primary text-white border-primary shadow-md';

          cards.forEach(card => {
            if (category === 'All' || card.dataset.category === category) {
              card.style.display = '';
            } else {
              card.style.display = 'none';
            }
          });
        };

        pill.addEventListener('click', handler);
        handlers.push({ pill, handler });
      });

      return () => {
        handlers.forEach(({ pill, handler }) => pill.removeEventListener('click', handler));
      };
    }, [pills, cards]);

    return { activePill };
  }

  /* ==========================================================================
     5. Gallery Filter & Lightbox Controller (gallery.html)
     Category tabs and fullscreen lightbox viewer
     ========================================================================== */
  function useGallery() {
    const tabs = document.querySelectorAll('.gallery-tab-btn');
    const items = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('galleryLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxDesc = document.getElementById('lightboxDesc');
    const closeBtn = document.getElementById('closeLightbox');

    const [activeCategory, setActiveCategory] = useState('All');

    useEffect(() => {
      if (tabs.length) {
        tabs.forEach(tab => {
          tab.addEventListener('click', () => {
            const cat = tab.dataset.category || 'All';
            setActiveCategory(cat);

            tabs.forEach(t => {
              t.className = 'gallery-tab-btn px-6 py-2.5 rounded-full text-xs font-semibold tracking-wider transition-all border cursor-pointer bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary';
            });
            tab.className = 'gallery-tab-btn px-6 py-2.5 rounded-full text-xs font-semibold tracking-wider transition-all border cursor-pointer bg-primary text-white border-primary shadow-md';

            items.forEach(item => {
              if (cat === 'All' || item.dataset.category === cat) {
                item.style.display = '';
              } else {
                item.style.display = 'none';
              }
            });
          });
        });
      }

      // Lightbox view handlers
      if (items.length && lightbox && lightboxImg) {
        items.forEach(item => {
          item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const title = item.dataset.title || (item.querySelector('h4, h3') ? item.querySelector('h4, h3').textContent : '');
            const desc = item.dataset.desc || (item.querySelector('p') ? item.querySelector('p').textContent : '');

            if (img) lightboxImg.src = img.src;
            if (lightboxTitle) lightboxTitle.textContent = title;
            if (lightboxDesc) lightboxDesc.textContent = desc;

            lightbox.classList.remove('hidden');
          });
        });

        if (closeBtn) {
          closeBtn.addEventListener('click', () => lightbox.classList.add('hidden'));
        }

        lightbox.addEventListener('click', (e) => {
          if (e.target === lightbox || e.target.classList.contains('lightbox-backdrop')) {
            lightbox.classList.add('hidden');
          }
        });
      }
    }, [tabs, items, lightbox, lightboxImg, lightboxTitle, lightboxDesc, closeBtn]);

    return { activeCategory };
  }

  /* ==========================================================================
     6. Product Details Modal Controller
     Details dialog with dynamic specs and enquiry link
     ========================================================================== */
  function useProductModal(onOpenEnquiry) {
    const modal = document.getElementById('productDetailModal');

    useEffect(() => {
      if (!modal) return;

      const closeBtns = modal.querySelectorAll('.close-modal');
      const modalImg = modal.querySelector('.modal-img');
      const modalTitle = modal.querySelector('.modal-title');
      const modalTag = modal.querySelector('.modal-tag');
      const modalDesc = modal.querySelector('.modal-desc');
      const modalLeadTime = modal.querySelector('.modal-lead-time');
      const modalMaterial = modal.querySelector('.modal-material');
      const modalHighlights = modal.querySelector('.modal-highlights');
      const modalEnquireBtn = modal.querySelector('.modal-enquire-btn');

      const handleDetailClick = (e) => {
        e.stopPropagation();
        const btn = e.currentTarget;
        const card = btn.closest('.product-catalog-card');
        if (!card) return;

        const title = card.dataset.title || '';
        const tag = card.dataset.tag || '';
        const desc = card.dataset.desc || '';
        const img = card.dataset.image || '';
        const leadTime = card.dataset.leadTime || 'Custom Bulk Order';
        const material = card.dataset.material || 'Virgin Polyethylene';
        const highlights = (card.dataset.highlights || '').split('|');

        if (modalTitle) modalTitle.textContent = title;
        if (modalTag) modalTag.textContent = tag;
        if (modalDesc) modalDesc.textContent = desc;
        if (modalImg) modalImg.src = img;
        if (modalLeadTime) modalLeadTime.textContent = leadTime;
        if (modalMaterial) modalMaterial.textContent = material;

        if (modalHighlights) {
          modalHighlights.innerHTML = highlights.filter(Boolean).map(hl => `
            <li class="flex items-start text-sm text-gray-600">
              <i class="ri-checkbox-circle-fill text-secondary text-lg mr-2.5 shrink-0 mt-0.5"></i>
              <span>${hl.trim()}</span>
            </li>
          `).join('');
        }

        if (modalEnquireBtn) {
          modalEnquireBtn.onclick = () => {
            modal.classList.add('hidden');
            if (typeof onOpenEnquiry === 'function') {
              onOpenEnquiry({ title, material });
            }
          };
        }

        modal.classList.remove('hidden');
      };

      const detailBtns = document.querySelectorAll('.btn-product-details');
      detailBtns.forEach(btn => btn.addEventListener('click', handleDetailClick));

      const closeModal = () => modal.classList.add('hidden');
      closeBtns.forEach(b => b.addEventListener('click', closeModal));

      const handleBackdrop = (e) => {
        if (e.target === modal || e.target.classList.contains('modal-backdrop')) {
          closeModal();
        }
      };
      modal.addEventListener('click', handleBackdrop);

      return () => {
        detailBtns.forEach(btn => btn.removeEventListener('click', handleDetailClick));
        closeBtns.forEach(b => b.removeEventListener('click', closeModal));
        modal.removeEventListener('click', handleBackdrop);
      };
    }, [modal, onOpenEnquiry]);
  }

  /* ==========================================================================
     7. Wholesale Enquiry Modal Controller
     Stateful enquiry modal with input validation and feedback
     ========================================================================== */
  function useEnquiryModal() {
    const modal = document.getElementById('enquiryModal');

    const openModal = useCallback((presetData = null) => {
      if (!modal) return;
      const targetInput = modal.querySelector('input[name="requirement"]');
      const targetNote = modal.querySelector('.preset-note');

      if (presetData && targetInput) {
        targetInput.value = presetData.title || presetData.name || '';
      }
      if (presetData && targetNote) {
        targetNote.textContent = `Enquiry for: ${presetData.title || presetData.name || 'Custom Packaging'}`;
        targetNote.classList.remove('hidden');
      }

      modal.classList.remove('hidden');
    }, [modal]);

    useEffect(() => {
      if (!modal) return;

      const closeBtns = modal.querySelectorAll('.close-modal');
      const form = modal.querySelector('form');
      const successBox = modal.querySelector('.enquiry-success');

      const triggerBtns = document.querySelectorAll('.open-enquiry-modal');
      triggerBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const title = btn.dataset.productTitle || '';
          openModal({ title });
        });
      });

      const closeModal = () => {
        modal.classList.add('hidden');
        if (successBox) successBox.classList.add('hidden');
        if (form) form.classList.remove('hidden');
      };

      closeBtns.forEach(b => b.addEventListener('click', closeModal));

      modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('modal-backdrop')) {
          closeModal();
        }
      });

      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const nameInput = form.querySelector('[name="name"]');
          const phoneInput = form.querySelector('[name="phone"]');

          if (!nameInput || !phoneInput) return;

          // Transition to success screen cleanly
          if (successBox) {
            form.classList.add('hidden');
            successBox.classList.remove('hidden');
          } else {
            alert('Thank you! Your quotation enquiry has been registered.');
            closeModal();
          }
        });
      }
    }, [modal, openModal]);

    return { openModal };
  }

  /* ==========================================================================
     8. Contact Form Controller (contact.html)
     ========================================================================== */
  function useContactForm() {
    const form = document.getElementById('contactPageForm');
    const successBox = document.getElementById('contactSuccessBox');

    useEffect(() => {
      if (!form) return;

      const handleSubmit = (e) => {
        e.preventDefault();
        if (successBox) {
          form.classList.add('hidden');
          successBox.classList.remove('hidden');
        } else {
          alert('Thank you! Your message has been sent to our Sivakasi desk.');
        }
      };

      form.addEventListener('submit', handleSubmit);
      return () => form.removeEventListener('submit', handleSubmit);
    }, [form, successBox]);
  }

  /* ==========================================================================
     9. Newsletter Form Controller
     ========================================================================== */
  function useNewsletter() {
    const form = document.getElementById('newsletterForm');
    const msg = document.getElementById('newsletterMsg');

    useEffect(() => {
      if (!form) return;

      const handleSubmit = (e) => {
        e.preventDefault();
        const emailInput = form.querySelector('input[type="email"]');
        if (!emailInput || !emailInput.value.trim()) return;

        if (msg) {
          msg.textContent = 'Thank you for subscribing to Bobby Packaging updates!';
          msg.className = 'text-xs text-green-300 font-medium mt-2';
          msg.classList.remove('hidden');
        }
        emailInput.value = '';
      };

      form.addEventListener('submit', handleSubmit);
      return () => form.removeEventListener('submit', handleSubmit);
    }, [form, msg]);
  }

  /* ==========================================================================
     10. Back to Top Button Controller
     ========================================================================== */
  function useBackToTop() {
    const btn = document.getElementById('backToTopBtn');

    useEffect(() => {
      if (!btn) return;

      const handleScroll = () => {
        if (window.scrollY > 300) {
          btn.classList.remove('opacity-0', 'pointer-events-none');
          btn.classList.add('opacity-100');
        } else {
          btn.classList.add('opacity-0', 'pointer-events-none');
          btn.classList.remove('opacity-100');
        }
      };

      const handleClick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      btn.addEventListener('click', handleClick);

      return () => {
        window.removeEventListener('scroll', handleScroll);
        btn.removeEventListener('click', handleClick);
      };
    }, [btn]);
  }

  /* ==========================================================================
     11. FAQ Accordion Controller
     ========================================================================== */
  function useFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    useEffect(() => {
      if (!faqItems.length) return;

      const handlers = [];
      faqItems.forEach(item => {
        const trigger = item.querySelector('.faq-trigger');
        if (!trigger) return;

        const handleClick = () => {
          const isActive = item.classList.contains('active');
          const container = item.closest('.faq-container') || document;
          container.querySelectorAll('.faq-item').forEach(other => {
            other.classList.remove('active');
          });

          if (!isActive) {
            item.classList.add('active');
          }
        };

        trigger.addEventListener('click', handleClick);
        handlers.push({ trigger, handleClick });
      });

      return () => {
        handlers.forEach(({ trigger, handleClick }) => trigger.removeEventListener('click', handleClick));
      };
    }, [faqItems]);
  }

  /* ==========================================================================
     12. Tab Switcher Controller
     ========================================================================== */
  function useTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    useEffect(() => {
      if (!tabBtns.length) return;

      const handlers = [];
      tabBtns.forEach(btn => {
        const handleClick = () => {
          const targetId = btn.dataset.tab;
          tabBtns.forEach(b => {
            b.className = 'tab-btn flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-sm font-semibold transition-all duration-300 bg-transparent text-gray-500 hover:bg-slate-50 hover:text-primary cursor-pointer';
          });
          btn.className = 'tab-btn flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-sm font-semibold transition-all duration-300 bg-primary text-white shadow-md cursor-pointer';

          tabPanes.forEach(pane => {
            if (pane.id === targetId) {
              pane.classList.remove('hidden');
            } else {
              pane.classList.add('hidden');
            }
          });
        };

        btn.addEventListener('click', handleClick);
        handlers.push({ btn, handleClick });
      });

      return () => {
        handlers.forEach(({ btn, handleClick }) => btn.removeEventListener('click', handleClick));
      };
    }, [tabBtns, tabPanes]);
  }

  /* ==========================================================================
     Root Application Component
     Combines all feature hooks and orchestrates page interactions
     ========================================================================== */
  function BobbyPackagingApp() {
    // Initialize navigation & back-to-top
    useNavbar();
    useBackToTop();

    // Initialize interactive sections
    useHeroCarousel();
    useFaqAccordion();
    useTabs();

    // Catalog & filters
    useProductsFilter();
    useFilmsFilter();
    useGallery();

    // Modals & forms
    const { openModal } = useEnquiryModal();
    useProductModal(openModal);
    useContactForm();
    useNewsletter();

    // Return null since this manages the active DOM nodes seamlessly
    return null;
  }

  // Mount React app once the document is ready
  function initReactApp() {
    const rootContainer = document.createElement('div');
    rootContainer.id = 'bobby-react-root';
    rootContainer.style.display = 'none';
    document.body.appendChild(rootContainer);

    if (ReactDOM.createRoot) {
      const root = ReactDOM.createRoot(rootContainer);
      root.render(React.createElement(BobbyPackagingApp));
    } else {
      ReactDOM.render(React.createElement(BobbyPackagingApp), rootContainer);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReactApp);
  } else {
    initReactApp();
  }
})();
