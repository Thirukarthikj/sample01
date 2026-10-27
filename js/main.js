/**
 * Bobby Packaging - Main Application Logic (Vanilla JavaScript)
 * Pure, high-performance, zero-dependency client script.
 * Manages responsive navigation, hero carousels, catalog filtering,
 * modal dialogs, quote submissions, and user interactions.
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. Navigation Component Controller
     Header scroll elevation/hiding and mobile drawer toggle
     ========================================================================== */
  function initNavbar() {
    const header = document.getElementById('mainHeader');
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    if (header) {
      const handleScroll = () => {
        const currentScrollY = window.scrollY || document.documentElement.scrollTop;
        const isAtTop = currentScrollY <= 25;
        const isMenuOpen = mobileMenu && !mobileMenu.classList.contains('hidden');

        if (isAtTop || isMenuOpen) {
          header.style.transform = 'translateY(0)';
          header.style.opacity = '1';
          header.style.pointerEvents = 'auto';
          header.classList.add('bg-white/85', 'py-4', 'shadow-sm');
          header.classList.remove('bg-white/95', 'shadow-md', 'py-3');
        } else {
          header.style.transform = 'translateY(-100%)';
          header.style.opacity = '0';
          header.style.pointerEvents = 'none';
        }
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
    }

    if (menuToggle && mobileMenu) {
      const toggleMenu = (e) => {
        if (e) e.stopPropagation();
        const isHidden = mobileMenu.classList.contains('hidden');
        if (isHidden) {
          mobileMenu.classList.remove('hidden');
          if (header) {
            header.style.transform = 'translateY(0)';
            header.style.opacity = '1';
            header.style.pointerEvents = 'auto';
          }
        } else {
          mobileMenu.classList.add('hidden');
        }
      };

      const closeMenu = () => {
        mobileMenu.classList.add('hidden');
      };

      menuToggle.addEventListener('click', toggleMenu);

      const links = mobileMenu.querySelectorAll('a');
      links.forEach(link => link.addEventListener('click', closeMenu));

      // Close mobile menu if user taps outside
      document.addEventListener('click', (e) => {
        if (!mobileMenu.classList.contains('hidden')) {
          if (!mobileMenu.contains(e.target) && !menuToggle.contains(e.target)) {
            closeMenu();
          }
        }
      });

      // Close on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
          closeMenu();
        }
      });
    }
  }

  /* ==========================================================================
     2. Hero Carousel Controller
     Horizontal slide transition, autoplay, touch swipe & keyboard navigation
     ========================================================================== */
  function initHeroCarousel() {
    const track = document.getElementById('heroTrack');
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.carousel-dot');
    const prevBtn = document.getElementById('heroPrevBtn');
    const nextBtn = document.getElementById('heroNextBtn');
    const heroSection = document.getElementById('heroSection');

    const slideCount = slides.length;
    if (slideCount === 0) return;

    let currentSlide = 0;
    let timer = null;

    function updateSlideView(index) {
      currentSlide = (index + slideCount) % slideCount;

      if (track) {
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
      } else {
        slides.forEach((slide, i) => {
          if (i === currentSlide) {
            slide.classList.remove('opacity-0', 'pointer-events-none');
            slide.classList.add('opacity-100', 'z-10');
          } else {
            slide.classList.remove('opacity-100', 'z-10');
            slide.classList.add('opacity-0', 'pointer-events-none');
          }
        });
      }

      dots.forEach((dot, i) => {
        if (i === currentSlide) {
          dot.className = 'carousel-dot h-2.5 rounded-full transition-all duration-500 w-8 bg-sky-600 cursor-pointer';
        } else {
          dot.className = 'carousel-dot h-2.5 rounded-full transition-all duration-500 w-2.5 bg-slate-300 hover:bg-slate-400 cursor-pointer';
        }
      });
    }

    function nextSlide() {
      updateSlideView(currentSlide + 1);
    }

    function prevSlide() {
      updateSlideView(currentSlide - 1);
    }

    function startAutoplay() {
      stopAutoplay();
      timer = setInterval(nextSlide, 5000);
    }

    function stopAutoplay() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    // Dot navigation
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        updateSlideView(i);
        startAutoplay();
      });
    });

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        nextSlide();
        startAutoplay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        prevSlide();
        startAutoplay();
      });
    }

    if (heroSection) {
      heroSection.addEventListener('mouseenter', stopAutoplay);
      heroSection.addEventListener('mouseleave', startAutoplay);

      // Touch gestures
      let touchStartX = 0;
      let touchStartY = 0;

      heroSection.addEventListener('touchstart', (e) => {
        if (e.changedTouches && e.changedTouches[0]) {
          touchStartX = e.changedTouches[0].screenX;
          touchStartY = e.changedTouches[0].screenY;
          stopAutoplay();
        }
      }, { passive: true });

      heroSection.addEventListener('touchend', (e) => {
        if (e.changedTouches && e.changedTouches[0]) {
          const diffX = touchStartX - e.changedTouches[0].screenX;
          const diffY = touchStartY - e.changedTouches[0].screenY;
          if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
            if (diffX > 0) {
              nextSlide();
            } else {
              prevSlide();
            }
          }
        }
        startAutoplay();
      }, { passive: true });
    }

    // Keyboard arrow keys
    document.addEventListener('keydown', (e) => {
      if (heroSection) {
        const rect = heroSection.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          if (e.key === 'ArrowRight') {
            nextSlide();
            startAutoplay();
          } else if (e.key === 'ArrowLeft') {
            prevSlide();
            startAutoplay();
          }
        }
      }
    });

    // Pause autoplay when tab is hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
    });

    updateSlideView(0);
    startAutoplay();
  }

  /* ==========================================================================
     3. Products Filter Controller (products.html)
     Category, application, format, and search query filtering
     ========================================================================== */
  function initProductsFilter() {
    const categorySelect = document.getElementById('filterCategory');
    const appSelect = document.getElementById('filterApplication');
    const formatSelect = document.getElementById('filterFormat');
    const refineBtn = document.getElementById('btnRefineProducts');
    const cards = document.querySelectorAll('.product-catalog-card');
    const emptyState = document.getElementById('productsEmptyState');

    if (!cards.length) return;

    function applyFilter() {
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
    }

    // Support URL search parameter ?search=...
    const params = new URLSearchParams(window.location.search);
    const search = params.get('search');
    if (search) {
      const q = search.toLowerCase();
      let count = 0;
      cards.forEach(card => {
        const title = (card.querySelector('h3') ? card.querySelector('h3').textContent : '').toLowerCase();
        const desc = (card.querySelector('p') ? card.querySelector('p').textContent : '').toLowerCase();
        if (title.includes(q) || desc.includes(q)) {
          card.style.display = '';
          count++;
        } else {
          card.style.display = 'none';
        }
      });
      if (emptyState) {
        emptyState.style.display = count === 0 ? 'block' : 'none';
      }
    }

    if (categorySelect) categorySelect.addEventListener('change', applyFilter);
    if (appSelect) appSelect.addEventListener('change', applyFilter);
    if (formatSelect) formatSelect.addEventListener('change', applyFilter);
    if (refineBtn) refineBtn.addEventListener('click', applyFilter);
  }

  /* ==========================================================================
     4. Films Filter Controller (films.html)
     Pill-based film spec filtering
     ========================================================================== */
  function initFilmsFilter() {
    const pills = document.querySelectorAll('.film-filter-pill');
    const cards = document.querySelectorAll('.film-spec-card');

    if (!pills.length || !cards.length) return;

    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        const category = pill.dataset.category || 'All';

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
      });
    });
  }

  /* ==========================================================================
     5. Gallery Filter & Lightbox Controller (gallery.html)
     Category tabs and fullscreen lightbox viewer
     ========================================================================== */
  function initGallery() {
    const tabs = document.querySelectorAll('.gallery-tab-btn');
    const items = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('galleryLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxDesc = document.getElementById('lightboxDesc');
    const closeBtn = document.getElementById('closeLightbox');

    if (tabs.length) {
      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          const cat = tab.dataset.category || 'All';

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

      const closeLightbox = () => lightbox.classList.add('hidden');

      if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-backdrop')) {
          closeLightbox();
        }
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !lightbox.classList.contains('hidden')) {
          closeLightbox();
        }
      });
    }
  }

  /* ==========================================================================
     6. Wholesale Enquiry Modal Controller
     Stateful modal with WhatsApp submission, validation, and confirmation
     ========================================================================== */
  let openEnquiryModalGlobal = null;

  function initEnquiryModal() {
    const modal = document.getElementById('enquiryModal');
    if (!modal) return;

    const closeBtns = modal.querySelectorAll('.close-modal');
    const form = modal.querySelector('form');
    const successBox = modal.querySelector('.enquiry-success');
    const targetInput = modal.querySelector('input[name="requirement"]');
    const targetNote = modal.querySelector('.preset-note');

    openEnquiryModalGlobal = function (presetData) {
      if (presetData && targetInput) {
        targetInput.value = presetData.title || presetData.name || '';
      }
      if (presetData && targetNote) {
        targetNote.textContent = `Enquiry for: ${presetData.title || presetData.name || 'Custom Packaging'}`;
        targetNote.classList.remove('hidden');
      }
      modal.classList.remove('hidden');
    };

    window.openBobbyEnquiryModal = openEnquiryModalGlobal;

    const triggerBtns = document.querySelectorAll('.open-enquiry-modal');
    triggerBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const title = btn.dataset.productTitle || '';
        openEnquiryModalGlobal({ title });
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

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
      }
    });

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = form.querySelector('[name="name"]');
        const phoneInput = form.querySelector('[name="phone"]');

        if (!nameInput || !phoneInput || !nameInput.value.trim() || !phoneInput.value.trim()) return;

        const name = nameInput.value.trim();
        const phone = phoneInput.value.trim();
        const email = (form.querySelector('[name="email"]') || {}).value || '';
        const req = (form.querySelector('[name="requirement"]') || {}).value || '';
        const msg = (form.querySelector('[name="message"]') || {}).value || '';

        const whatsappText = encodeURIComponent(
          `*New Wholesale Enquiry - Bobby Packaging*\n` +
          `*Name:* ${name}\n` +
          `*Phone:* ${phone}\n` +
          (email ? `*Email:* ${email}\n` : '') +
          `*Requirement:* ${req}\n` +
          (msg ? `*Details:* ${msg}\n` : '')
        );

        window.open(`https://wa.me/918754002737?text=${whatsappText}`, '_blank');

        if (successBox) {
          form.classList.add('hidden');
          successBox.classList.remove('hidden');
        } else {
          alert('Thank you! Your quotation enquiry has been registered.');
          closeModal();
        }
      });
    }
  }

  /* ==========================================================================
     7. Product Details Modal Controller
     Quick-view dialog with dynamic specifications & quote action
     ========================================================================== */
  function initProductModal() {
    const modal = document.getElementById('productDetailModal');
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

    const closeModal = () => modal.classList.add('hidden');

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
          if (typeof openEnquiryModalGlobal === 'function') {
            openEnquiryModalGlobal({ title, material });
          }
        };
      }

      modal.classList.remove('hidden');
    };

    const detailBtns = document.querySelectorAll('.btn-product-details');
    detailBtns.forEach(btn => btn.addEventListener('click', handleDetailClick));

    closeBtns.forEach(b => b.addEventListener('click', closeModal));

    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.classList.contains('modal-backdrop')) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
      }
    });
  }

  /* ==========================================================================
     8. Contact Form Controller (contact.html)
     ========================================================================== */
  function initContactForm() {
    const form = document.getElementById('contactPageForm');
    const successBox = document.getElementById('contactSuccessBox');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = (form.querySelector('[name="name"]') || {}).value || '';
      const phone = (form.querySelector('[name="phone"]') || {}).value || '';
      const message = (form.querySelector('[name="message"]') || {}).value || '';

      if (name && phone) {
        const text = encodeURIComponent(
          `*Bobby Packaging Contact Message*\n*Name:* ${name}\n*Phone:* ${phone}\n*Message:* ${message}`
        );
        window.open(`https://wa.me/918754002737?text=${text}`, '_blank');
      }

      if (successBox) {
        form.classList.add('hidden');
        successBox.classList.remove('hidden');
      } else {
        alert('Thank you! Your message has been sent to our Sivakasi desk.');
      }
    });
  }

  /* ==========================================================================
     9. Newsletter Form Controller
     ========================================================================== */
  function initNewsletter() {
    const form = document.getElementById('newsletterForm');
    const msg = document.getElementById('newsletterMsg');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = form.querySelector('input[type="email"]');
      if (!emailInput || !emailInput.value.trim()) return;

      if (msg) {
        msg.textContent = 'Thank you for subscribing to Bobby Packaging updates!';
        msg.className = 'text-xs text-green-300 font-medium mt-2';
        msg.classList.remove('hidden');
      }
      emailInput.value = '';
    });
  }

  /* ==========================================================================
     10. Back to Top Button Controller
     Appears during scrolling, disappears when scrolling stops
     ========================================================================== */
  function initBackToTop() {
    const btn = document.getElementById('backToTopBtn');
    if (!btn) return;

    let scrollTimeout = null;

    const handleScroll = () => {
      const currentScrollY = window.scrollY || document.documentElement.scrollTop;

      if (currentScrollY > 200) {
        btn.classList.remove('opacity-0', 'pointer-events-none');
        btn.classList.add('opacity-100', 'pointer-events-auto');

        if (scrollTimeout) clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          btn.classList.add('opacity-0', 'pointer-events-none');
          btn.classList.remove('opacity-100', 'pointer-events-auto');
        }, 1200);
      } else {
        if (scrollTimeout) clearTimeout(scrollTimeout);
        btn.classList.add('opacity-0', 'pointer-events-none');
        btn.classList.remove('opacity-100', 'pointer-events-auto');
      }
    };

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    btn.addEventListener('mouseenter', () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      btn.classList.remove('opacity-0', 'pointer-events-none');
      btn.classList.add('opacity-100', 'pointer-events-auto');
    });

    btn.addEventListener('mouseleave', () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        btn.classList.add('opacity-0', 'pointer-events-none');
        btn.classList.remove('opacity-100', 'pointer-events-auto');
      }, 800);
    });

    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  /* ==========================================================================
     11. FAQ Accordion Controller
     ========================================================================== */
  function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach(item => {
      const trigger = item.querySelector('.faq-trigger');
      if (!trigger) return;

      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        const container = item.closest('.faq-container') || item.parentElement;
        if (container) {
          container.querySelectorAll('.faq-item').forEach(other => {
            other.classList.remove('active');
          });
        }
        if (!isActive) {
          item.classList.add('active');
        }
      });
    });
  }

  /* ==========================================================================
     12. Tab Switcher Controller
     ========================================================================== */
  function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    if (!tabBtns.length) return;

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
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
      });
    });
  }

  /* ==========================================================================
     App Initializer
     ========================================================================== */
  function initApp() {
    initNavbar();
    initBackToTop();
    initHeroCarousel();
    initFaqAccordion();
    initTabs();
    initProductsFilter();
    initFilmsFilter();
    initGallery();
    initEnquiryModal();
    initProductModal();
    initContactForm();
    initNewsletter();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
