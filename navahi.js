/* Navahi Farms — script dùng chung cho mọi trang */

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

/* Carousel 2 ảnh — Section 4. Không autoplay: người dùng tự đổi ảnh. */
(function(){
  document.querySelectorAll('[data-slider]').forEach(function(root){
    var track = root.querySelector('.slider-track'),
        imgs  = track ? track.querySelectorAll('img') : [],
        dots  = root.querySelectorAll('.slider-dots button'),
        prev  = root.querySelector('.slider-prev'),
        next  = root.querySelector('.slider-next');
    if(!track || imgs.length < 2) return;

    function index(){ return Math.round(track.scrollLeft / track.clientWidth); }
    function go(i){
      i = Math.max(0, Math.min(imgs.length - 1, i));
      track.scrollTo({left: i * track.clientWidth});
    }
    function sync(){
      var i = index();
      dots.forEach(function(d, k){ d.classList.toggle('on', k === i); });
      if(prev) prev.disabled = (i === 0);
      if(next) next.disabled = (i === imgs.length - 1);
    }

    if(prev) prev.addEventListener('click', function(){ go(index() - 1); });
    if(next) next.addEventListener('click', function(){ go(index() + 1); });
    dots.forEach(function(d, k){ d.addEventListener('click', function(){ go(k); }); });

    var t;
    track.addEventListener('scroll', function(){
      clearTimeout(t); t = setTimeout(sync, 90);
    }, {passive:true});
    window.addEventListener('resize', function(){
      clearTimeout(t); t = setTimeout(sync, 150);
    });
    sync();
  });
})();

/* Dock liên hệ nổi — ẩn khi footer lọt vào khung nhìn, để không đè lên
   chính khối liên hệ ở chân trang. */
(function(){
  var dock = document.getElementById('dock'),
      ft   = document.querySelector('footer.ft');
  if(!dock || !ft || !('IntersectionObserver' in window)) return;
  var io = new IntersectionObserver(function(en){
    en.forEach(function(x){ dock.setAttribute('data-hidden', x.isIntersecting ? 'true' : 'false'); });
  }, {rootMargin:'0px 0px -12% 0px'});
  io.observe(ft);
})();


/* Section "Khách hàng nói gì" — dải vuốt ngang cho nhận xét và ảnh món ăn.
   Không autoplay. Nút trước/sau đi theo từng lượt đang thấy; chấm chỉ vị trí
   tự sinh theo số lượt; đã thấy hết thì ẩn cả nút lẫn chấm. */
(function(){
  document.querySelectorAll('[data-reel]').forEach(function(root){
    var track = root.querySelector('.reel-track'),
        items = track ? track.children : [],
        prev  = root.querySelector('.reel-prev'),
        next  = root.querySelector('.reel-next'),
        dotsW = root.querySelector('.reel-dots');
    if(!track || !items.length) return;

    function step(){ return items.length > 1 ? items[1].offsetLeft - items[0].offsetLeft : track.clientWidth; }
    function perView(){
      var s = step(), gap = s - items[0].getBoundingClientRect().width;
      return Math.max(1, Math.floor((track.clientWidth + gap + 2) / s));
    }
    function pages(){ return Math.max(1, Math.ceil(items.length / perView())); }
    function page(){
      var max = track.scrollWidth - track.clientWidth;
      if(max > 0 && track.scrollLeft >= max - 4) return pages() - 1;
      return Math.round(track.scrollLeft / (step() * perView()));
    }
    function go(p){
      p = Math.max(0, Math.min(pages() - 1, p));
      track.scrollTo({left: p * perView() * step()});
    }

    var built = -1;
    function build(){
      var n = pages();
      root.classList.toggle('fits', n < 2);
      if(!dotsW || n === built) return;
      dotsW.innerHTML = '';
      for(var i = 0; i < n; i++) dotsW.appendChild(document.createElement('span'));
      built = n;
    }
    function sync(){
      build();
      var p = page(), n = pages();
      if(dotsW) Array.prototype.forEach.call(dotsW.children, function(d, k){ d.classList.toggle('on', k === p); });
      if(prev) prev.disabled = (p <= 0);
      if(next) next.disabled = (p >= n - 1);
    }

    if(prev) prev.addEventListener('click', function(){ go(page() - 1); });
    if(next) next.addEventListener('click', function(){ go(page() + 1); });
    var t;
    track.addEventListener('scroll', function(){ clearTimeout(t); t = setTimeout(sync, 90); }, {passive:true});
    window.addEventListener('resize', function(){ clearTimeout(t); t = setTimeout(sync, 150); });
    sync();
  });
})();

/* Xem đầy đủ nhận xét dài (review Google của Matt Hoang) */
(function(){
  var dlg = document.getElementById('kh-dialog'),
      img = document.getElementById('kh-dialog-img');
  if(!dlg || !img) return;
  var close = dlg.querySelector('.kh-close');
  document.querySelectorAll('.kh-more').forEach(function(btn){
    btn.addEventListener('click', function(){
      var src = btn.closest('.kh-shot').querySelector('img');
      img.src = btn.getAttribute('data-full');
      img.alt = src ? src.alt : '';
      if(typeof dlg.showModal === 'function'){ dlg.showModal(); dlg.scrollTop = 0; }
      else { window.open(img.src, '_blank', 'noopener'); }
    });
  });
  if(close) close.addEventListener('click', function(){ dlg.close(); });
  dlg.addEventListener('click', function(e){ if(e.target === dlg) dlg.close(); });
})();
