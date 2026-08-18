/* Navahi Farms — script dùng chung cho mọi trang */
(function(){
  var css = getComputedStyle(document.documentElement);
  function src(name){
    var m = css.getPropertyValue('--img-' + name).trim().match(/url\(["']?(.*?)["']?\)/);
    return m ? m[1] : null;
  }
  /* Ảnh khai báo bằng biến CSS ⇒ thay ảnh chỉ cần sửa một dòng trong navahi.css */
  document.querySelectorAll('[data-img]').forEach(function(el){
    var u = src(el.dataset.img), img = el.querySelector('img');
    if(u && img){ img.src = u; el.classList.add('has-img'); }
    else if(!u && el.classList.contains('prod')){ el.remove(); }
  });
  var hero = document.getElementById('hero-img');
  if(hero && src('hero')){ hero.src = src('hero'); }
})();

/* Hamburger menu */
(function(){
  var hdr = document.getElementById('hdr'),
      b   = document.getElementById('burger'),
      m   = document.getElementById('menu');
  if(!hdr || !b || !m) return;
  function set(open){
    hdr.classList.toggle('menu-open', open);
    b.setAttribute('aria-expanded', open ? 'true' : 'false');
    b.setAttribute('aria-label', open ? 'Đóng menu' : 'Mở menu');
  }
  b.addEventListener('click', function(){ set(!hdr.classList.contains('menu-open')); });
  m.addEventListener('click', function(e){ if(e.target.tagName === 'A') set(false); });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') set(false); });
  document.addEventListener('click', function(e){
    if(hdr.classList.contains('menu-open') && !hdr.contains(e.target)) set(false);
  });
})();

/* Section 4 — "Xem trang trại Navahi" cuộn tới ảnh toàn cảnh trại */
(function(){
  var btn = document.getElementById('btn-trai'),
      shot = document.querySelector('.shot--wide');
  if(!btn || !shot) return;
  btn.addEventListener('click', function(e){
    e.preventDefault();
    shot.scrollIntoView({behavior:'smooth', block:'center'});
  });
})();

/* Hiện dần khi cuộn tới */
(function(){
  var els = document.querySelectorAll('.rise');
  if(!('IntersectionObserver' in window)){
    els.forEach(function(e){ e.classList.add('in'); }); return;
  }
  var io = new IntersectionObserver(function(en){
    en.forEach(function(x){
      if(x.isIntersecting){ x.target.classList.add('in'); io.unobserve(x.target); }
    });
  }, {rootMargin:'0px 0px -8% 0px'});
  els.forEach(function(e){ io.observe(e); });
})();
