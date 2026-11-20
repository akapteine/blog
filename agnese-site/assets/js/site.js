// Portfolio carousel: previous/next buttons and position dots.
// The list also scrolls with touch, trackpad and keyboard, so the page works without this file.
(function () {
  var list = document.querySelector('.cards');
  if (!list || !list.children.length) return;

  var controls = document.querySelector('.arrows');
  var prev = document.querySelector('.arrow[data-dir="-1"]');
  var next = document.querySelector('.arrow[data-dir="1"]');
  var dots = document.querySelector('.dots');
  var count = list.children.length;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var spans = [];

  function step() {
    var gap = parseFloat(window.getComputedStyle(list).columnGap) || 0;
    return list.children[0].getBoundingClientRect().width + gap;
  }

  function overflows() {
    return list.scrollWidth > list.clientWidth + 2;
  }

  function update() {
    var can = overflows();
    if (controls) controls.hidden = !can;
    if (dots) dots.style.display = can && count > 1 ? '' : 'none';
    if (!can) return;
    var atStart = list.scrollLeft <= 2;
    var atEnd = list.scrollLeft + list.clientWidth >= list.scrollWidth - 2;
    if (prev) prev.disabled = atStart;
    if (next) next.disabled = atEnd;
    var index = atEnd ? count - 1 : Math.round(list.scrollLeft / step());
    index = Math.max(0, Math.min(count - 1, index));
    for (var i = 0; i < spans.length; i++) {
      spans[i].className = i === index ? 'on' : '';
    }
  }

  if (dots) {
    for (var i = 0; i < count; i++) {
      var s = document.createElement('span');
      dots.appendChild(s);
      spans.push(s);
    }
  }

  function go(dir) {
    list.scrollBy({ left: dir * step(), behavior: reduce ? 'auto' : 'smooth' });
  }

  if (prev) prev.addEventListener('click', function () { go(-1); });
  if (next) next.addEventListener('click', function () { go(1); });

  var ticking = false;
  list.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () { ticking = false; update(); });
  });
  window.addEventListener('resize', update);
  update();
})();
