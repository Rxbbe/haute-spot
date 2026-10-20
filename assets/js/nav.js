(function(){
  var nav=document.querySelector('nav'), b=nav&&nav.querySelector('.burger');
  if(!b) return;
  function set(open){
    nav.classList.toggle('open',open);
    b.setAttribute('aria-expanded',open);
    b.setAttribute('aria-label',open?'Menu sluiten':'Menu openen');
  }
  b.addEventListener('click',function(){set(!nav.classList.contains('open'));});
  nav.querySelectorAll('.navlinks a').forEach(function(a){a.addEventListener('click',function(){set(false);});});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')set(false);});
  document.addEventListener('click',function(e){if(!nav.contains(e.target))set(false);});
  window.addEventListener('resize',function(){if(window.innerWidth>820)set(false);});
})();
