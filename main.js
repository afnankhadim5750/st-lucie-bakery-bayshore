(function () {
  "use strict";

  /* ---------- mobile menu (instant toggle, no transition) ---------- */
  var toggle = document.querySelector("[data-menu-toggle]");
  var menu = document.querySelector("[data-mobile-menu]");
  if (toggle && menu) {
    var setMenu = function (open) {
      menu.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };
    toggle.addEventListener("click", function () {
      setMenu(!menu.classList.contains("open"));
    });
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () { setMenu(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setMenu(false);
    });
  }

  /* ---------- scroll-spy ---------- */
  var navLinks = document.querySelectorAll(".desktop-nav a[href^='#']");
  var sections = [];
  navLinks.forEach(function (link) {
    var id = link.getAttribute("href");
    if (id && id.length > 1) {
      var el = document.querySelector(id);
      if (el) sections.push({ link: link, el: el });
    }
  });
  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navLinks.forEach(function (l) { l.classList.remove("active"); });
          var found = sections.find(function (s) { return s.el === entry.target; });
          if (found) found.link.classList.add("active");
        }
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    sections.forEach(function (s) { spy.observe(s.el); });
  }

  /* ---------- bakery case tabs ---------- */
  var tabs = document.querySelectorAll(".tab");
  var cards = document.querySelectorAll(".case-card");
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");
      var filter = tab.getAttribute("data-filter");
      cards.forEach(function (card) {
        var show = filter === "all" || card.getAttribute("data-cat") === filter;
        card.classList.toggle("hidden", !show);
      });
    });
  });

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".acc-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.closest(".acc-item");
      var open = item.classList.contains("open");
      document.querySelectorAll(".acc-item.open").forEach(function (i) {
        i.classList.remove("open");
        i.querySelector(".acc-btn").setAttribute("aria-expanded", "false");
      });
      if (!open) {
        item.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ---------- lightbox ---------- */
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = lightbox ? lightbox.querySelector(".lightbox-img") : null;
  var items = Array.prototype.slice.call(document.querySelectorAll(".gallery-item"));
  var current = 0;
  function showLightbox(i) {
    current = (i + items.length) % items.length;
    var full = items[current].getAttribute("data-full");
    var alt = items[current].querySelector("img").getAttribute("alt") || "";
    lightboxImg.setAttribute("src", full);
    lightboxImg.setAttribute("alt", alt);
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  }
  function hideLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = "";
  }
  if (lightbox) {
    items.forEach(function (item, i) {
      item.addEventListener("click", function () { showLightbox(i); });
    });
    lightbox.querySelector(".lightbox-close").addEventListener("click", hideLightbox);
    lightbox.querySelector(".lightbox-prev").addEventListener("click", function (e) { e.stopPropagation(); showLightbox(current - 1); });
    lightbox.querySelector(".lightbox-next").addEventListener("click", function (e) { e.stopPropagation(); showLightbox(current + 1); });
    lightbox.addEventListener("click", function (e) { if (e.target === lightbox) hideLightbox(); });
    document.addEventListener("keydown", function (e) {
      if (lightbox.hidden) return;
      if (e.key === "Escape") hideLightbox();
      if (e.key === "ArrowLeft") showLightbox(current - 1);
      if (e.key === "ArrowRight") showLightbox(current + 1);
    });
  }

  /* ---------- order form: build a mailto to the bakery ---------- */
  var form = document.getElementById("order-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = document.getElementById("f-name").value.trim();
      var contact = document.getElementById("f-contact").value.trim();
      var date = document.getElementById("f-date").value;
      var order = document.getElementById("f-order").value.trim();
      var subject = "Order enquiry - St Lucie Bakery at Bayshore";
      var body = "Hello St Lucie Bakery,\n\n"
        + "Name: " + name + "\n"
        + "Phone or email: " + contact + "\n"
        + (date ? "Date needed: " + date + "\n" : "")
        + "\nOrder:\n" + order + "\n\nThank you!";
      window.location.href = "mailto:saintluciebakery@gmail.com"
        + "?subject=" + encodeURIComponent(subject)
        + "&body=" + encodeURIComponent(body);
    });
  }

  /* ---------- reveal on scroll (subtle, respects reduced motion) ---------- */
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window) {
    var revealEls = document.querySelectorAll(".case-card, .deli-card, .why-card, .story-photo, .feature-photo");
    revealEls.forEach(function (el) {
      el.style.opacity = "0";
      el.style.transform = "translateY(14px)";
      el.style.transition = "opacity .5s ease, transform .5s ease";
    });
    var revealer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "none";
          revealer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { revealer.observe(el); });
  }
})();
