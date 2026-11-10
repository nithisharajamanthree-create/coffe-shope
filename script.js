(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGsap = typeof window.gsap !== "undefined";
  let toastTimer;
  let reviewIndex = 0;
  let galleryIndex = 0;
  let galleryItems = [];

  document.body.classList.add("is-loading");
  $(".year").textContent = new Date().getFullYear();

  function startIntro() {
    const preloader = $(".preloader");
    const finish = () => {
      preloader?.remove();
      document.body.classList.remove("is-loading");
      revealHero();
    };

    if (!preloader) {
      document.body.classList.remove("is-loading");
      revealHero();
      return;
    }

    if (hasGsap && !reducedMotion) {
      const tl = gsap.timeline({ onComplete: finish });
      tl.fromTo(".loader-beans i", { y: -70, opacity: 0, rotation: -70 }, {
        y: () => gsap.utils.random(5, 65), opacity: 1, rotation: 40, duration: .65,
        stagger: .11, ease: "bounce.out"
      })
        .to(".loader-cup", { opacity: 1, scale: 1, duration: .65, ease: "back.out(1.7)" }, "-=.2")
        .to(".loader-line", { height: 24, duration: .38, ease: "power2.out" }, "-=.22")
        .fromTo(".loader-word", { y: 22, opacity: 0, letterSpacing: ".4em" }, {
          y: 0, opacity: 1, letterSpacing: ".22em", duration: .7, ease: "power3.out"
        }, "-=.18")
        .to(".loader-brand", { y: -22, duration: .35, ease: "power2.inOut" }, "+=.4")
        .to(preloader, { yPercent: -100, duration: .95, ease: "power4.inOut" }, "-=.08");
    } else {
      window.setTimeout(finish, 450);
    }
  }

  function revealHero() {
    if (!hasGsap || reducedMotion) return;
    gsap.from(".site-header", { y: -22, opacity: 0, duration: .8, ease: "power3.out" });
    gsap.from(".hero-kicker, .hero-title span, .hero-title em, .hero-description, .hero-actions", {
      y: 24, opacity: 0, duration: .8, stagger: .13, delay: .12, ease: "power3.out"
    });
    gsap.from(".hero-cup-wrap", { y: 70, opacity: 0, rotation: -16, duration: 1.15, delay: .4, ease: "power3.out" });
    gsap.from(".hero-stamp", { scale: .7, opacity: 0, duration: .8, delay: .65, ease: "back.out(1.5)" });
    gsap.from(".hero-bottom", { y: 12, opacity: 0, duration: .7, delay: .7 });
    gsap.to(".hero-image", {
      yPercent: 12, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: .6 }
    });
  }

  function setupScrollEffects() {
    const progress = $(".scroll-progress span");
    if (hasGsap) {
      gsap.registerPlugin(ScrollTrigger);
      gsap.to(progress, {
        scaleX: 1, ease: "none",
        scrollTrigger: { trigger: document.documentElement, start: "top top", end: "bottom bottom", scrub: .15 }
      });

      if (!reducedMotion) {
        $$(".section-index, .story-copy, .section-heading, .menu-toolbar, .menu-bottom, .visit-card, .visit-heading, .footer-main").forEach((el) => {
          gsap.from(el, {
            y: 26, opacity: 0, duration: .85, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true }
          });
        });
        $$(".menu-card, .gallery-item, .visit-card").forEach((el, index) => {
          gsap.from(el, {
            y: 34, opacity: 0, duration: .72, delay: (index % 4) * .07, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 91%", once: true }
          });
        });
        $$(".manifesto-content, .special-content, .reservation-image, .reservation-panel").forEach((el) => {
          gsap.from(el, {
            y: 32, opacity: 0, duration: .9, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true }
          });
        });
        gsap.from(".story-image-wrap img", {
          scale: 1.16, duration: 1.5, ease: "power2.out",
          scrollTrigger: { trigger: ".story-image-wrap", start: "top 82%", once: true }
        });
        gsap.from(".price-count", {
          textContent: 0, duration: 1, snap: { textContent: 1 }, ease: "power1.out",
          scrollTrigger: { trigger: ".menu-grid", start: "top 82%", once: true }
        });
        gsap.to(".special-image", {
          yPercent: 8, ease: "none",
          scrollTrigger: { trigger: ".special", start: "top bottom", end: "bottom top", scrub: .6 }
        });
      }
    } else {
      progress.style.width = "0";
      window.addEventListener("scroll", () => {
        const available = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.width = `${available > 0 ? (window.scrollY / available) * 100 : 0}%`;
      }, { passive: true });
    }
  }

  function setupNavigation() {
    const toggle = $(".menu-toggle");
    const mobileMenu = $(".mobile-menu");
    const closeMenu = () => {
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open navigation");
      mobileMenu.classList.remove("open");
      mobileMenu.setAttribute("aria-hidden", "true");
      document.body.classList.remove("menu-open");
    };

    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
      mobileMenu.classList.toggle("open", open);
      mobileMenu.setAttribute("aria-hidden", String(!open));
      document.body.classList.toggle("menu-open", open);
    });
    $$("a[href^='#']", mobileMenu).forEach((link) => link.addEventListener("click", closeMenu));
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
  }

  function setupCursorAndMagnetics() {
    const cursor = $(".cursor");
    if (window.matchMedia("(pointer: fine)").matches && !reducedMotion) {
      window.addEventListener("mousemove", (event) => {
        cursor.classList.add("is-visible");
        cursor.style.left = `${event.clientX}px`;
        cursor.style.top = `${event.clientY}px`;
      }, { passive: true });
      window.addEventListener("mouseout", (event) => {
        if (!event.relatedTarget) cursor.classList.remove("is-visible");
      });
      $$("a, button").forEach((element) => {
        element.addEventListener("mouseenter", () => cursor.classList.add("is-hover"));
        element.addEventListener("mouseleave", () => cursor.classList.remove("is-hover"));
      });
    }

    if (window.matchMedia("(pointer: fine)").matches && !reducedMotion) {
      $$(".magnetic").forEach((element) => {
        element.addEventListener("mousemove", (event) => {
          const bounds = element.getBoundingClientRect();
          const x = (event.clientX - bounds.left - bounds.width / 2) * .12;
          const y = (event.clientY - bounds.top - bounds.height / 2) * .16;
          element.style.transform = `translate(${x}px, ${y}px)`;
        });
        element.addEventListener("mouseleave", () => { element.style.transform = ""; });
      });

      const hero = $(".hero");
      hero.addEventListener("mousemove", (event) => {
        const bounds = hero.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - .5;
        const y = (event.clientY - bounds.top) / bounds.height - .5;
        window.gsap?.to(".hero-cup-wrap", { x: x * 12, y: y * 9, duration: .7, overwrite: true });
        window.gsap?.to(".hero-image", { x: x * -9, y: y * -5, duration: .9, overwrite: true });
      });
    }
  }

  function setupMenu() {
    $$(".filter-button").forEach((button) => {
      button.addEventListener("click", () => {
        $$(".filter-button").forEach((item) => item.classList.toggle("active", item === button));
        const filter = button.dataset.filter;
        $$(".menu-card").forEach((card) => {
          const visible = filter === "all" || card.dataset.category === filter;
          card.classList.toggle("is-hidden", !visible);
          if (visible && hasGsap && !reducedMotion) {
            gsap.fromTo(card, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .38, clearProps: "transform" });
          }
        });
      });
    });

    let orderCount = 0;
    $$(".add-button").forEach((button) => {
      button.addEventListener("click", () => {
        orderCount += 1;
        const toast = $(".cart-toast");
        $(".cart-count").textContent = orderCount;
        $(".toast-copy").textContent = `${button.dataset.product} added to your order`;
        button.textContent = "✓";
        button.classList.add("added");
        button.setAttribute("aria-label", `${button.dataset.product} added to your order`);
        toast.classList.add("visible");
        window.clearTimeout(toastTimer);
        toastTimer = window.setTimeout(() => {
          toast.classList.remove("visible");
          button.textContent = "+";
          button.classList.remove("added");
          button.setAttribute("aria-label", `Add ${button.dataset.product} to your order`);
        }, 1900);
      });
    });
  }

  function setupReviews() {
    const slides = $$(".review-slide");
    const dots = $$(".review-dots button");
    const count = $(".review-count b");
    const show = (nextIndex) => {
      reviewIndex = (nextIndex + slides.length) % slides.length;
      slides.forEach((slide, index) => slide.classList.toggle("active", index === reviewIndex));
      dots.forEach((dot, index) => dot.classList.toggle("active", index === reviewIndex));
      count.textContent = `0${reviewIndex + 1}`;
    };
    $(".review-prev").addEventListener("click", () => show(reviewIndex - 1));
    $(".review-next").addEventListener("click", () => show(reviewIndex + 1));
    dots.forEach((dot, index) => dot.addEventListener("click", () => show(index)));
    window.setInterval(() => {
      if (!document.hidden && !document.body.classList.contains("menu-open")) show(reviewIndex + 1);
    }, 7500);
  }

  function setupReservation() {
    const form = $(".booking-form");
    const dateInput = $('input[name="date"]', form);
    const today = new Date();
    const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    dateInput.min = localDate;

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const selectedDate = new Date(`${dateInput.value}T00:00:00`);
      if (dateInput.value < localDate || Number.isNaN(selectedDate.getTime())) {
        dateInput.setCustomValidity("Please choose today or a future date.");
        dateInput.reportValidity();
        dateInput.setCustomValidity("");
        return;
      }
      $(".booking-success").classList.add("visible");
      $(".booking-success").setAttribute("aria-hidden", "false");
      $(".success-close").focus();
    });

    const closeSuccess = () => {
      $(".booking-success").classList.remove("visible");
      $(".booking-success").setAttribute("aria-hidden", "true");
      form.reset();
      dateInput.min = localDate;
    };
    $(".success-close").addEventListener("click", closeSuccess);
  }

  function setupGallery() {
    galleryItems = $$(".gallery-item");
    const lightbox = $(".lightbox");
    const image = $("img", lightbox);
    const count = $(".lightbox-count");

    const showImage = (index) => {
      galleryIndex = (index + galleryItems.length) % galleryItems.length;
      const item = galleryItems[galleryIndex];
      image.src = item.dataset.full;
      image.alt = $("img", item).alt;
      count.textContent = `${String(galleryIndex + 1).padStart(2, "0")} / ${String(galleryItems.length).padStart(2, "0")}`;
    };
    const open = (index) => {
      showImage(index);
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.classList.add("lightbox-open");
      $(".lightbox-close").focus();
    };
    const close = () => {
      lightbox.classList.remove("open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.classList.remove("lightbox-open");
    };

    galleryItems.forEach((item, index) => item.addEventListener("click", () => open(index)));
    $(".lightbox-close").addEventListener("click", close);
    $(".lightbox-prev").addEventListener("click", () => showImage(galleryIndex - 1));
    $(".lightbox-next").addEventListener("click", () => showImage(galleryIndex + 1));
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) close();
    });
    window.addEventListener("keydown", (event) => {
      if (!lightbox.classList.contains("open")) return;
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") showImage(galleryIndex - 1);
      if (event.key === "ArrowRight") showImage(galleryIndex + 1);
    });
  }

  startIntro();
  setupNavigation();
  setupScrollEffects();
  setupCursorAndMagnetics();
  setupMenu();
  setupReviews();
  setupReservation();
  setupGallery();
})();
