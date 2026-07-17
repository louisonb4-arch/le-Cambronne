/* Le Cambronne — interactions */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Refresh → toujours le hero (pas de restauration de scroll) ---------- */
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";

  var rideau = document.getElementById("rideau");

  var navEntree = performance.getEntriesByType ? performance.getEntriesByType("navigation")[0] : null;
  var estReload = navEntree
    ? navEntree.type === "reload"
    : !!(performance.navigation && performance.navigation.type === 1);

  if (rideau && estReload && location.hash) {
    history.replaceState(null, "", location.pathname);
  }
  if (rideau && !location.hash) {
    window.scrollTo(0, 0);
  }

  /* ---------- Rideau d'ouverture ---------- */
  function finirIntro() {
    if (document.body.classList.contains("intro-finie")) return;
    document.body.classList.add("intro-finie");
    document.body.style.overflow = "";
    /* Arrivée avec ancre (ex. carte.html → index.html#infos) : le blocage du
       scroll pendant l'intro casse le saut initial — on rejoue le scroll ici. */
    if (location.hash) {
      var cible = document.getElementById(location.hash.slice(1));
      if (cible) {
        try { cible.scrollIntoView({ behavior: "instant" }); }
        catch (err) { cible.scrollIntoView(); }
      }
    }
  }

  if (rideau) {
    if (reduceMotion) {
      rideau.remove();
      finirIntro();
    } else {
      document.body.style.overflow = "hidden";
      setTimeout(function () {
        rideau.classList.add("rideau--leve");
        finirIntro();
      }, 1400);
      rideau.addEventListener("transitionend", function (e) {
        if (e.target === rideau) rideau.remove();
      });
      setTimeout(function () {
        if (rideau.parentNode) { rideau.remove(); finirIntro(); }
      }, 3400);
    }
  } else {
    document.body.classList.add("intro-finie");
  }

  /* Retour via bfcache pendant l'intro : on ne rejoue rien, on nettoie */
  window.addEventListener("pageshow", function (e) {
    if (e.persisted) {
      var r = document.getElementById("rideau");
      if (r) r.remove();
      finirIntro();
    }
  });

  /* ---------- Nav : fond au scroll + masquage à la descente ---------- */
  var nav = document.getElementById("nav");
  var navFixe = document.body.classList.contains("page-carte") || document.body.classList.contains("legal-page");
  var dernierY = 0;

  function surScroll() {
    var y = window.scrollY;
    if (!navFixe) nav.classList.toggle("nav--fond", y > 40);
    if (y > 600 && y > dernierY + 6) {
      nav.classList.add("nav--cache");
    } else if (y < dernierY - 6 || y < 600) {
      nav.classList.remove("nav--cache");
    }
    dernierY = y;
  }
  window.addEventListener("scroll", surScroll, { passive: true });
  surScroll();

  /* ---------- Menu mobile ---------- */
  var burger = document.getElementById("burger");
  var menu = document.getElementById("mobilemenu");

  if (burger && menu) {
    burger.addEventListener("click", function () {
      var ouvert = menu.classList.toggle("ouvert");
      burger.classList.toggle("ouvert", ouvert);
      burger.setAttribute("aria-expanded", ouvert ? "true" : "false");
      menu.setAttribute("aria-hidden", ouvert ? "false" : "true");
      document.body.style.overflow = ouvert ? "hidden" : "";
    });

    menu.querySelectorAll("a").forEach(function (lien) {
      lien.addEventListener("click", function () {
        menu.classList.remove("ouvert");
        burger.classList.remove("ouvert");
        burger.setAttribute("aria-expanded", "false");
        menu.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---------- Reveals au scroll ---------- */
  var observ = new IntersectionObserver(
    function (entrees) {
      entrees.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          observ.unobserve(e.target);
        }
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -40px 0px" }
  );

  var revelables = Array.prototype.slice.call(document.querySelectorAll(".reveal, .reveal-img"));

  if (!("IntersectionObserver" in window)) {
    revelables.forEach(function (el) { el.classList.add("visible"); });
  } else {
    revelables.forEach(function (el) { observ.observe(el); });

    /* Garde-fou : si l'observer rate un élément (bugs navigateur),
       on force la révélation de tout ce qui est dans le viewport. */
    var rattrapageEnCours = false;
    function rattrapage() {
      if (rattrapageEnCours) return;
      rattrapageEnCours = true;
      setTimeout(function () {
        revelables = revelables.filter(function (el) {
          if (el.classList.contains("visible")) return false;
          var r = el.getBoundingClientRect();
          if (r.top < window.innerHeight - 20 && r.bottom > 0 && r.height > 0) {
            el.classList.add("visible");
            observ.unobserve(el);
            return false;
          }
          return true;
        });
        rattrapageEnCours = false;
      }, 400);
    }
    window.addEventListener("scroll", rattrapage, { passive: true });
    window.addEventListener("load", rattrapage);
  }

  /* ---------- Parallaxe hero — translation seule, jamais de scale ---------- */
  var heroImg = document.querySelector(".hero__media img");
  if (heroImg && !reduceMotion) {
    var enCours = false;
    window.addEventListener(
      "scroll",
      function () {
        if (enCours) return;
        enCours = true;
        requestAnimationFrame(function () {
          var y = window.scrollY;
          if (y < window.innerHeight * 1.2) {
            heroImg.style.transform = "translateY(" + y * 0.16 + "px)";
          }
          enCours = false;
        });
      },
      { passive: true }
    );
  }

  /* ---------- Lien actif dans la nav ---------- */
  var sections = document.querySelectorAll("section[id]");
  var liens = document.querySelectorAll(".nav__links a");
  if (sections.length && liens.length) {
    var observNav = new IntersectionObserver(
      function (entrees) {
        entrees.forEach(function (e) {
          if (e.isIntersecting) {
            liens.forEach(function (l) {
              l.classList.toggle("actif", l.getAttribute("href") === "#" + e.target.id);
            });
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach(function (s) { observNav.observe(s); });
  }

  /* ---------- Année courante ---------- */
  var annee = document.getElementById("annee");
  if (annee) annee.textContent = new Date().getFullYear();
})();
