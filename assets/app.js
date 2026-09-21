/* Ataraxia - panel demo + rail highlighting */

(function () {
  "use strict";

  /* ---- mobile menu ---- */
  var rail = document.querySelector(".rail");
  var burger = document.querySelector(".burger");

  if (rail && burger) {
    var setMenu = function (open) {
      rail.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };

    burger.addEventListener("click", function () {
      setMenu(!rail.classList.contains("open"));
    });

    rail.addEventListener("click", function (e) {
      if (e.target.closest(".rail-link")) setMenu(false);
    });

    document.addEventListener("click", function (e) {
      if (!rail.contains(e.target)) setMenu(false);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape" || !rail.classList.contains("open")) return;
      setMenu(false);
      burger.focus();
    });
  }

  /* ---- range slider fill ---- */
  function paint(el) {
    var min = Number(el.min), max = Number(el.max);
    el.style.setProperty("--fill", ((Number(el.value) - min) / (max - min)) * 100 + "%");
  }

  /* ---- radar demo ---- */
  var range = document.getElementById("range");

  if (range) {
    var markers = Array.prototype.slice.call(document.querySelectorAll(".marker"));
    var ring = document.getElementById("rangeRing");
    var ringLabel = document.getElementById("ringLabel");
    var rangeVal = document.getElementById("rangeVal");
    var outRange = document.getElementById("outRange");
    var outVisible = document.getElementById("outVisible");
    var teamToggle = document.querySelector("input[data-team]");
    var nameToggle = document.querySelector("input[data-names]");
    var markerGroup = document.querySelector(".markers");
    var gridToggle = document.querySelector("[data-grid]");
    var grid = document.querySelector(".radar-stage svg g[stroke]");

    function draw() {
      var m = Number(range.value);
      var shown = 0;

      markers.forEach(function (dot) {
        var teammate = dot.dataset.team === "1";
        var hidden = teammate && teamToggle && !teamToggle.checked;
        var inRange = Number(dot.dataset.dist) <= m && !hidden;
        dot.classList.toggle("out", !inRange);
        if (inRange) shown++;
      });

      ring.setAttribute("r", (m * 0.75).toFixed(1));
      ringLabel.textContent = m + " m";
      rangeVal.textContent = m + " m";
      outRange.textContent = m;
      outVisible.textContent = shown;
      paint(range);
    }

    range.addEventListener("input", draw);
    if (teamToggle) teamToggle.addEventListener("change", draw);
    if (nameToggle && markerGroup) {
      nameToggle.addEventListener("change", function () {
        markerGroup.classList.toggle("named", nameToggle.checked);
      });
    }
    if (gridToggle && grid) {
      gridToggle.addEventListener("change", function () {
        grid.style.opacity = gridToggle.checked ? "1" : "0";
      });
    }
    draw();
  }

  /* ---- overlay size ---- */
  var size = document.getElementById("size");
  if (size) {
    var sizeVal = document.getElementById("sizeVal");
    var outSize = document.getElementById("outSize");
    var chip = document.getElementById("overlayChip");

    var resize = function () {
      sizeVal.textContent = size.value + " px";
      outSize.textContent = size.value;
      if (chip) chip.style.transform = "scale(" + (0.82 + Number(size.value) / 1200) + ")";
      paint(size);
    };
    size.addEventListener("input", resize);
    resize();
  }

  /* ---- placement picker ---- */
  var places = document.querySelectorAll(".place");
  var names = { tl: "Top left", tr: "Top right", bl: "Bottom left", br: "Bottom right" };

  Array.prototype.forEach.call(places, function (btn) {
    btn.addEventListener("click", function () {
      Array.prototype.forEach.call(places, function (other) {
        other.setAttribute("aria-pressed", String(other === btn));
      });
      var pos = btn.dataset.pos;
      var chip = document.getElementById("overlayChip");
      if (!chip) return;
      chip.className = "overlay-chip " + pos;
      chip.textContent = names[pos] + " / sample";
    });
  });

  /* ---- licence length picker on each card ---- */
  Array.prototype.forEach.call(document.querySelectorAll(".card"), function (card) {
    var picks = Array.prototype.slice.call(card.querySelectorAll(".variant"));
    var buy = card.querySelector(".buy");
    if (!picks.length || !buy) return;

    picks.forEach(function (pick) {
      pick.addEventListener("click", function () {
        picks.forEach(function (other) {
          other.setAttribute("aria-pressed", String(other === pick));
        });
        buy.textContent = "Buy " + pick.dataset.label + ", " + pick.dataset.price;
      });
    });
  });

  /* ---- checkout dialog ---- */
  var modal = document.getElementById("checkout");

  if (modal && typeof modal.showModal === "function") {
    var coGame = document.getElementById("coGame");
    var coLength = document.getElementById("coLength");
    var coTotal = document.getElementById("coTotal");

    Array.prototype.forEach.call(document.querySelectorAll(".card .buy"), function (buy) {
      buy.addEventListener("click", function (e) {
        e.preventDefault();
        var card = buy.closest(".card");
        var pick = card.querySelector('.variant[aria-pressed="true"]');
        coGame.textContent = card.querySelector("h3").textContent;
        coLength.textContent = pick ? pick.dataset.label : "";
        coTotal.textContent = pick ? pick.dataset.price : "";
        modal.showModal();
      });
    });

    document.getElementById("coClose").addEventListener("click", function () {
      modal.close();
    });

    modal.addEventListener("click", function (e) {
      if (e.target === modal) modal.close();
    });
  }

  /* ---- rail follows the section in view ---- */
  var links = Array.prototype.slice.call(document.querySelectorAll('.rail-link[href^="#"]'));
  var targets = links
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);

  if (targets.length && "IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var seen = false;
        links.forEach(function (a) {
          var match = !seen && a.getAttribute("href") === "#" + entry.target.id;
          if (match) seen = true;
          a.classList.toggle("is-active", match);
        });
      });
    }, { rootMargin: "-25% 0px -65% 0px" });

    targets.forEach(function (t) { spy.observe(t); });
  }
})();
