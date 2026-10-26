// Light mode: flowing silk waves. Dark mode: drifting leaves and plants.
(function(){
  const cv = document.getElementById('silk'); if(!cv) return;
  const ctx = cv.getContext('2d'); let W, H;
  function size(){
    const d = Math.min(window.devicePixelRatio || 1, 1.5);
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = W * d; cv.height = H * d; ctx.setTransform(d, 0, 0, d, 0, 0);
  }
  const R = [0,1,2,3,4,5,6].map(i => ({ y:.16 + i*.11, amp:.07 + i*.012, f:1 + i*.17, s:.22 + i*.035, p:i*1.9, th:.13 + i*.022, a:.09 + (i%3)*.035 }));
  const TAU = Math.PI * 2;
  function top(r, x, t){
    const u = x / W;
    return H * (r.y + r.amp*Math.sin(u*TAU*r.f*.55 + t*r.s + r.p) + r.amp*.5*Math.sin(u*TAU*r.f*1.25 - t*r.s*1.4 + r.p*2) + .018*Math.sin(u*TAU*2.6 + t*.5 + r.p));
  }
  function thick(r, x, t){
    return H * r.th * (.5 + .5*Math.sin(x/W*TAU*.75 + t*r.s*.8 + r.p*1.3));
  }
  function draw(t){
    ctx.clearRect(0, 0, W, H);
    for(const r of R){
      const g = ctx.createLinearGradient(0, 0, W, 0);
      g.addColorStop(0, 'rgba(255,255,255,0)');
      g.addColorStop(.35, 'rgba(255,255,255,' + r.a + ')');
      g.addColorStop(.7, 'rgba(255,255,255,' + (r.a*.8) + ')');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.beginPath();
      for(let x = -10; x <= W + 10; x += 8){ const y = top(r, x, t); x === -10 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
      for(let x = W + 10; x >= -10; x -= 8){ ctx.lineTo(x, top(r, x, t) + thick(r, x, t)); }
      ctx.closePath(); ctx.fillStyle = g; ctx.fill();
      ctx.beginPath();
      for(let x = -10; x <= W + 10; x += 8){ const y = top(r, x, t); x === -10 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
      const e = ctx.createLinearGradient(0, 0, W, 0);
      e.addColorStop(0, 'rgba(255,255,255,0)'); e.addColorStop(.5, 'rgba(255,255,255,.3)'); e.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.strokeStyle = e; ctx.lineWidth = 1.2; ctx.stroke();
    }
  }
  size(); window.addEventListener('resize', () => { size(); draw(performance.now()/1000*.6); });
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){ draw(4); return; }
  (function loop(ms){ if(document.documentElement.dataset.theme !== 'dark') draw(ms/1000*.6); requestAnimationFrame(loop); })(performance.now());
})();

(function(){
  const cv = document.getElementById('leaves'); if(!cv) return;
  const ctx = cv.getContext('2d'), TAU = Math.PI * 2; let W, H, P = [];
  const cols = [[94,170,120],[64,140,100],[120,190,130],[50,115,95],[150,200,110],[80,160,150],[214,130,150],[236,206,112],[240,238,228]];
  const types = ['leaf','fern','flower','clover','ginkgo','rosette','leaf','fern','ginkgo','rosette'];
  function size(){
    const d = Math.min(window.devicePixelRatio || 1, 1.5);
    W = cv.clientWidth; H = cv.clientHeight; cv.width = W * d; cv.height = H * d; ctx.setTransform(d, 0, 0, d, 0, 0);
  }
  function init(){
    const n = Math.max(20, Math.min(42, Math.round(W * H / 36000)));
    P = [];
    for(let i = 0; i < n; i++){
      const ty = types[i % types.length], dp = .5 + Math.random() * .9;
      const c = ty === 'flower' ? cols[6 + Math.floor(Math.random()*3)] : cols[Math.floor(Math.random()*6)];
      P.push({ty, x:Math.random()*W, y:Math.random()*H, s:(14 + Math.random()*22)*dp, r:Math.random()*TAU, vr:(Math.random()-.5)*.5, ph:Math.random()*TAU, sp:.6 + dp*.6, c, a:.3 + dp*.28});
    }
  }
  function shape(p, tm){
    const s = p.s, a = p.a;
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r + Math.sin(tm*.8 + p.ph)*.35);
    ctx.fillStyle = 'rgba(' + p.c + ',' + a + ')'; ctx.strokeStyle = 'rgba(255,255,255,' + (a*.35) + ')'; ctx.lineWidth = 1;
    if(p.ty === 'leaf'){
      ctx.beginPath(); ctx.moveTo(0,-s); ctx.bezierCurveTo(s*.75,-s*.5,s*.75,s*.5,0,s); ctx.bezierCurveTo(-s*.75,s*.5,-s*.75,-s*.5,0,-s); ctx.fill();
      ctx.beginPath(); ctx.moveTo(0,-s*.9); ctx.lineTo(0,s*1.15); ctx.stroke();
    } else if(p.ty === 'fern'){
      ctx.beginPath(); ctx.moveTo(0,-s*1.3); ctx.lineTo(0,s*1.3); ctx.lineWidth = 1.5; ctx.stroke();
      for(let k = 0; k < 9; k++){
        const t = k/8, yy = -s*1.2 + t*s*2.4, w = s*.6*(.25 + .75*Math.sin(Math.min(1, t*1.2 + .1)*Math.PI*.75));
        ctx.beginPath(); ctx.ellipse(w*.55, yy, w*.55, s*.1, .45, 0, TAU); ctx.fill();
        ctx.beginPath(); ctx.ellipse(-w*.55, yy, w*.55, s*.1, -.45, 0, TAU); ctx.fill();
      }
    } else if(p.ty === 'flower'){
      for(let k = 0; k < 6; k++){ ctx.save(); ctx.rotate(k*TAU/6); ctx.beginPath(); ctx.ellipse(0,-s*.5,s*.28,s*.5,0,0,TAU); ctx.fill(); ctx.restore(); }
      ctx.beginPath(); ctx.arc(0,0,s*.2,0,TAU); ctx.fillStyle = 'rgba(255,214,110,' + Math.min(1, a + .2) + ')'; ctx.fill();
    } else if(p.ty === 'clover'){
      for(let k = 0; k < 3; k++){ ctx.save(); ctx.rotate(k*TAU/3); ctx.beginPath(); ctx.arc(0,-s*.45,s*.42,0,TAU); ctx.fill(); ctx.restore(); }
      ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(0,s*1.3); ctx.stroke();
    } else if(p.ty === 'ginkgo'){
      ctx.beginPath(); ctx.moveTo(0,s*.9); ctx.arc(0,s*.9,s*1.5,-Math.PI/2-.85,-Math.PI/2+.85); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(0,s*.9); ctx.lineTo(0,s*1.5); ctx.stroke();
    } else {
      for(let k = 0; k < 9; k++){ ctx.save(); ctx.rotate(k*TAU/9); ctx.beginPath(); ctx.moveTo(0,0); ctx.quadraticCurveTo(s*.28,-s*.5,0,-s); ctx.quadraticCurveTo(-s*.28,-s*.5,0,0); ctx.fill(); ctx.stroke(); ctx.restore(); }
    }
    ctx.restore();
  }
  function draw(tm, dt){
    ctx.clearRect(0, 0, W, H);
    for(const p of P){
      p.x += (24 + 16*Math.sin(p.y*.006 + tm*.5 + p.ph))*dt*p.sp;
      p.y += (9 + 14*Math.sin(p.x*.005 + tm*.4 + p.ph))*dt*p.sp;
      p.r += p.vr*dt;
      if(p.x > W + 70){ p.x = -70; p.y = Math.random()*H; }
      if(p.y > H + 70){ p.y = -70; p.x = Math.random()*W; }
      if(p.y < -80){ p.y = H + 70; }
      shape(p, tm);
    }
  }
  size(); init();
  window.addEventListener('resize', () => { size(); init(); draw(0, 0); });
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){ draw(0, 0); return; }
  let last = performance.now();
  (function loop(ms){
    const dt = Math.min(.05, (ms - last)/1000); last = ms;
    if(document.documentElement.dataset.theme === 'dark') draw(ms/1000, dt);
    requestAnimationFrame(loop);
  })(last);
})();
