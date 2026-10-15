(function(){
  var filter="alle";
  var grid=document.getElementById('vgrid');
  var empty=document.getElementById('vempty');
  var heart='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-8-5.2-8-11a4.6 4.6 0 0 1 8-3 4.6 4.6 0 0 1 8 3c0 5.8-8 11-8 11z"/></svg>';

  function fmt(n){ return Number(n).toLocaleString('nl-BE'); }
  function esc(s){ return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }
  function host(url){ try{ return new URL(url).hostname.replace(/^www\./,''); }catch(e){ return ''; } }

  function media(url){
    var h=host(url);
    if(/\.(jpe?g|png|webp|gif|avif)(\?.*)?$/i.test(url)){
      return '<img src="'+esc(url)+'" alt="" loading="lazy" style="width:100%;display:block">';
    }
    if(h==='instagram.com'){
      var clean=url.split('?')[0];
      return '<blockquote class="instagram-media" data-instgrm-permalink="'+esc(clean)+'" data-instgrm-version="14"><a href="'+esc(clean)+'">Bekijk op Instagram</a></blockquote>';
    }
    if(h==='facebook.com'||h==='m.facebook.com'||h==='fb.watch'){
      return '<iframe src="https://www.facebook.com/plugins/video.php?href='+encodeURIComponent(url)+'&show_text=false&width=500" height="560" scrolling="no" allowfullscreen allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>';
    }
    return '<div class="vfallback">Deze link wordt niet herkend. Gebruik een Instagram- of Facebook-link.<br><a href="'+esc(url)+'" target="_blank" rel="noopener">'+esc(url)+'</a></div>';
  }

  function card(v){
    var h=host(v.url);
    var net=h==='instagram.com'?'Instagram':(h.indexOf('facebook')>-1||h==='fb.watch')?'Facebook':'';
    var hasLikes=v.likes!==undefined&&v.likes!==null&&v.likes!=='';
    var likes=hasLikes?'<span class="likes">'+heart+fmt(v.likes)+'</span>':'';
    return '<article class="vcard"><div class="vmedia">'+media(v.url)+'</div><div class="vmeta"><div><strong>'+esc(v.titel||(v.type==='foto'?'Foto':'Video'))+'</strong><small>'+(net||(v.type==='foto'?'Foto':'Video'))+'</small></div>'+likes+'</div></article>';
  }

  function loadInstagram(){
    if(!grid.querySelector('.instagram-media')) return;
    if(window.instgrm){ window.instgrm.Embeds.process(); return; }
    var s=document.createElement('script'); s.async=true; s.src='https://www.instagram.com/embed.js'; document.body.appendChild(s);
  }

  function render(){
    var all=(window.HS_VIDEOS||[]).filter(function(v){return filter==='alle'||(v.type||'video')===filter;}).map(card);
    grid.innerHTML=all.join('');
    empty.hidden=all.length>0;
    loadInstagram();
  }

  document.getElementById('filters').addEventListener('click',function(e){
    var b=e.target.closest('.chip'); if(!b) return;
    filter=b.dataset.f;
    document.querySelectorAll('.chip').forEach(function(c){c.classList.toggle('on',c===b);});
    render();
  });
  render();
})();
