// accordion (works without GSAP)
(function(){
  var slices=document.querySelectorAll('.slice');
  slices.forEach(function(s){
    s.addEventListener('mouseenter',function(){ if(window.innerWidth>820) activate(s); });
    s.addEventListener('click',function(){ activate(s); });
  });
  function activate(el){ slices.forEach(function(x){x.classList.toggle('active',x===el)}); }
})();

// form: verstuurt via EmailJS (zie mail-config.js) en toont daarna de bevestigingspopup
(function(){
  var modal=document.getElementById('modal');
  function closeModal(){ modal.hidden=true; document.body.style.overflow=''; }
  function openModal(d){
    document.getElementById('m-naam').textContent=d.naam;
    document.getElementById('m-s-naam').textContent=d.naam;
    document.getElementById('m-s-tel').textContent=d.telefoon;
    document.getElementById('m-s-mail').textContent=d.email;
    document.getElementById('m-s-vraag').textContent=d.vraag;
    modal.hidden=false; document.body.style.overflow='hidden';
    document.getElementById('modal-x').focus();
  }
  document.getElementById('modal-x').addEventListener('click',closeModal);
  modal.addEventListener('click',function(e){ if(e.target===modal) closeModal(); });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape'&&!modal.hidden) closeModal(); });

  // --- spamfilter: honeypot, tijdcontrole, limiet per bezoeker en reCAPTCHA ---
  var cfg0=window.HS_MAIL||{}, loadedAt=Date.now(), capId=null;
  var KEY='hs_sent';
  function sentLog(){ try{ return JSON.parse(localStorage.getItem(KEY)||'[]').filter(function(t){return Date.now()-t<3600000;}); }catch(e){ return []; } }
  function logSent(){ try{ var l=sentLog(); l.push(Date.now()); localStorage.setItem(KEY,JSON.stringify(l)); }catch(e){} }
  function limited(){
    var l=sentLog(), max=cfg0.maxPerUur||3, wait=(cfg0.wachttijdSec||60)*1000;
    if(l.length&&Date.now()-l[l.length-1]<wait) return 'Even geduld, probeer het over een minuut opnieuw.';
    if(l.length>=max) return 'Je hebt al meerdere aanvragen verstuurd. Bel ons gerust op +32 493 45 70 25.';
    return '';
  }
  if(cfg0.recaptchaSiteKey){
    window.hsCaptchaReady=function(){ capId=grecaptcha.render('captcha',{sitekey:cfg0.recaptchaSiteKey}); };
    var rs=document.createElement('script'); rs.async=true; rs.defer=true;
    rs.src='https://www.google.com/recaptcha/api.js?onload=hsCaptchaReady&render=explicit';
    document.head.appendChild(rs);
  }

  document.getElementById('form').addEventListener('submit',function(e){
    e.preventDefault();
    var form=e.target, note=document.getElementById('note'), btn=form.querySelector('button[type=submit]');
    var f=new FormData(form), cfg=window.HS_MAIL||{};
    var data={
      naam:f.get('naam'),
      telefoon:f.get('tel')||'Niet opgegeven',
      email:f.get('mail'),
      vraag:f.get('vraag')||'Geen toelichting opgegeven',
      tijdstip:new Date().toLocaleString('nl-BE',{dateStyle:'long',timeStyle:'short'}),
      naar_adres:cfg.naarAdres||''
    };
    var demo=/[?&]demo(&|$)/.test(location.search);
    var ready=cfg.publicKey&&cfg.serviceId&&cfg.templateIntern&&window.emailjs;

    if(!ready){
      if(demo){ openModal(data); form.reset(); note.textContent='Demo: er is niets verstuurd.'; }
      else note.textContent='Verzenden is nog niet ingesteld. Bel ons op +32 493 45 70 25.';
      return;
    }

    // bots: honeypot ingevuld of formulier binnen 4 seconden verstuurd. Doe alsof het gelukt is.
    if(f.get('website')||Date.now()-loadedAt<4000){ form.reset(); note.textContent='We nemen snel contact met je op.'; return; }

    var lim=limited(); if(lim){ note.textContent=lim; return; }

    if(cfg.recaptchaSiteKey){
      var token=window.grecaptcha&&capId!==null?grecaptcha.getResponse(capId):'';
      if(!token){ note.textContent='Bevestig eerst dat je geen robot bent.'; return; }
      data['g-recaptcha-response']=token;
    }

    btn.disabled=true; note.textContent='Bezig met versturen...';
    emailjs.init({publicKey:cfg.publicKey});
    // De bevestiging naar de aanvrager gaat via de Auto-Reply van de template in EmailJS.
    // Vul templateKlant alleen in als je nog twee losse verzendingen gebruikt zonder reCAPTCHA.
    emailjs.send(cfg.serviceId,cfg.templateIntern,data)
      .then(function(){ if(cfg.templateKlant&&!cfg.recaptchaSiteKey) return emailjs.send(cfg.serviceId,cfg.templateKlant,data); })
      .then(function(){ logSent(); form.reset(); if(capId!==null) grecaptcha.reset(capId); note.textContent='We nemen snel contact met je op.'; openModal(data); })
      .catch(function(){ if(capId!==null) grecaptcha.reset(capId); note.textContent='Versturen mislukt. Probeer opnieuw of bel +32 493 45 70 25.'; })
      .then(function(){ btn.disabled=false; });
  });
})();

if(window.gsap && window.ScrollTrigger){
  gsap.registerPlugin(ScrollTrigger);
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // hero entrance
  if(!reduce){
    gsap.from('[data-hero]',{y:40,opacity:0,duration:1.1,ease:'power3.out',stagger:.15,delay:.1});
    gsap.to('[data-parallax]',{yPercent:12,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
  }

  // scrubbing word reveal
  var p=document.getElementById('scrub');
  var words=p.textContent.trim().split(/\s+/);
  p.innerHTML=words.map(function(w){return '<span class="w">'+w+'</span>'}).join(' ');
  gsap.to('#scrub .w',{opacity:1,stagger:.1,ease:'none',scrollTrigger:{trigger:'#scrub',start:'top 80%',end:'bottom 45%',scrub:true}});

  // section reveals
  gsap.utils.toArray('[data-reveal]').forEach(function(el){
    gsap.from(el,{y:60,opacity:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%'}});
  });

  // pinned split + image scale and fade
  var mm=gsap.matchMedia();
  mm.add('(min-width: 901px)',function(){
    ScrollTrigger.create({trigger:'.cases .split',start:'top 20%',end:'bottom bottom',pin:'#pinleft',pinSpacing:false});
    gsap.utils.toArray('.case').forEach(function(c){
      gsap.fromTo(c,{scale:.82},{scale:1,ease:'none',scrollTrigger:{trigger:c,start:'top 95%',end:'top 40%',scrub:true}});
      gsap.to(c,{opacity:.2,ease:'none',scrollTrigger:{trigger:c,start:'bottom 45%',end:'bottom 5%',scrub:true}});
    });
  });
  mm.add('(max-width: 900px)',function(){
    gsap.utils.toArray('.case').forEach(function(c){
      gsap.from(c,{y:50,opacity:0,duration:.9,ease:'power3.out',scrollTrigger:{trigger:c,start:'top 88%'}});
    });
  });
}
