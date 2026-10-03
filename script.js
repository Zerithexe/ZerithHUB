(function () {
  var $ = function (id) { return document.getElementById(id); };
  var gate = $('age-gate'), app = $('app');

  // Yaş kapısı: açıkken arka plan etkileşime kapalı (inert) ve kaydırma kilitli
  function lock(on) {
    gate.classList.toggle('hidden', !on);
    document.body.classList.toggle('locked', on);
    if (on) { app.setAttribute('inert', ''); } else { app.removeAttribute('inert'); }
  }
  var ok = false;
  try { ok = localStorage.getItem('zh_age_ok') === '1'; } catch (e) {}
  lock(!ok);
  if (!ok) $('gate-yes').focus();
  $('gate-yes').addEventListener('click', function () {
    try { localStorage.setItem('zh_age_ok', '1'); } catch (e) {}
    lock(false);
  });

  $('year').textContent = new Date().getFullYear();

  // Mobil menü
  var btn = $('menu-btn'), nav = $('nav');
  btn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') { nav.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }
  });

  // Üretici kartları (yer tutucu; gerçek görseller için gradient yerine <img> kullanın)
  var creators = [
    { name: 'Mira',  blurb: 'Gece sohbetleri',      cats: ['sohbet', 'canli'], c: ['#ff4d8d', '#5b1a6e'] },
    { name: 'Jade',  blurb: 'Fotoğraf setleri',     cats: ['foto'],            c: ['#f5a65b', '#7a1f4a'] },
    { name: 'Noor',  blurb: 'Yavaş, kışkırtıcı sohbet', cats: ['sohbet'],      c: ['#8f6bff', '#2c1239'] },
    { name: 'Vale',  blurb: 'Her Cuma canlı',       cats: ['canli', 'foto'],   c: ['#ff7a6b', '#4a1445'] },
    { name: 'Sasha', blurb: 'Sesli not ve sohbet',  cats: ['sohbet'],          c: ['#4fd1c5', '#32154a'] },
    { name: 'Rowan', blurb: 'Haftalık fotoğraflar', cats: ['foto'],            c: ['#e879f9', '#3b0f4f'] }
  ];
  var label = { sohbet: 'Sohbet', foto: 'Fotoğraf', canli: 'Canlı' };
  var grid = $('grid');
  creators.forEach(function (p) {
    var el = document.createElement('article');
    el.className = 'card';
    el.dataset.cats = p.cats.join(' ');
    el.style.background = 'linear-gradient(160deg,' + p.c[0] + ',' + p.c[1] + ')';
    var tag = document.createElement('span'); tag.className = 'tag'; tag.textContent = label[p.cats[0]];
    var meta = document.createElement('div'); meta.className = 'meta';
    var s = document.createElement('strong'); s.textContent = p.name;
    var b = document.createElement('span'); b.textContent = p.blurb;
    meta.append(s, b); el.append(tag, meta); grid.appendChild(el);
  });
  $('chips').addEventListener('click', function (e) {
    var chip = e.target.closest('.chip'); if (!chip) return;
    document.querySelectorAll('.chip').forEach(function (c) {
      c.classList.remove('active'); c.setAttribute('aria-pressed', 'false');
    });
    chip.classList.add('active'); chip.setAttribute('aria-pressed', 'true');
    var f = chip.dataset.f;
    grid.querySelectorAll('.card').forEach(function (card) {
      card.classList.toggle('hide', f !== 'all' && card.dataset.cats.split(' ').indexOf(f) < 0);
    });
  });

  // Demo sohbet (hızlı yanıt + serbest yazı)
  var replies = {
    'Yavaş ve kışkırtıcı': 'Mm, sabır. Hoşuma gitti. Önce şu an ne giydiğini anlat bakalım.',
    'Beni şaşırt': 'Cesursun. Üç soru soracağım, dürüst cevap ver. İlki: en çok ne duymaktan hoşlanırsın?',
    'Sadece sohbet edelim': 'Çok isterim. Önce günün nasıl geçti anlat, sonra aklımdan geçenleri söylerim 😉'
  };
  var free = ['Hmm, devam et… ilgimi çektin.', 'Bunu biraz daha anlat, merak ettim.', 'Seni dinlemek hoşuma gidiyor. Peki ya sen ne istersin?'];
  var fi = 0, busy = false, msgs = $('msgs');
  function add(text, cls) {
    var d = document.createElement('div'); d.className = 'bubble ' + cls; d.textContent = text;
    msgs.appendChild(d); msgs.scrollTop = msgs.scrollHeight; return d;
  }
  function talk(text, answer) {
    if (busy) return; busy = true;
    add(text, 'me');
    var t = add('...', 'them typing');
    setTimeout(function () { t.remove(); add(answer, 'them'); busy = false; }, 900);
  }
  $('quick').addEventListener('click', function (e) {
    var q = e.target.dataset.q; if (q) talk(q, replies[q]);
  });
  $('say').addEventListener('submit', function (e) {
    e.preventDefault();
    var i = $('say-input'), v = i.value.trim(); if (!v) return;
    i.value = ''; talk(v, free[fi++ % free.length]);
  });

  // Üyelik penceresi (demo)
  var dlg = $('signup'), err = $('su-err');
  document.querySelectorAll('[data-open-signup]').forEach(function (b) {
    b.addEventListener('click', function () { err.textContent = ''; err.className = 'err'; dlg.showModal(); });
  });
  $('su-close').addEventListener('click', function () { dlg.close(); });
  $('su-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var m = $('su-mail');
    if (!m.checkValidity()) { err.className = 'err'; err.textContent = 'Geçerli bir e-posta adresi gir.'; m.focus(); return; }
    if (!$('su-age').checked) { err.className = 'err'; err.textContent = '18 yaşını doldurduğunu onaylamalısın.'; return; }
    err.className = 'err ok'; err.textContent = 'Demo: kayıt alındı (hiçbir veri gönderilmedi).';
  });
})();
