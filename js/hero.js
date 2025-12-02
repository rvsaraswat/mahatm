// Subtle hero particle animation: drifting nodes with connection hints
(function(){
  const canvas = document.getElementById('heroParticles');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let w=0,h=0, particles=[];

  function resize(){
    const rect = canvas.getBoundingClientRect();
    w = canvas.width = Math.floor(rect.width);
    h = canvas.height = Math.floor(rect.height);
    spawn();
  }
  window.addEventListener('resize', resize);

  function spawn(){
    const count = Math.max(24, Math.floor(w*h/40000));
    particles = Array.from({length: count}, ()=>({
      x: Math.random()*w,
      y: Math.random()*h,
      vx: (Math.random()*0.4-0.2),
      vy: (Math.random()*0.4-0.2),
      r: Math.random()*1.5+0.5
    }));
  }

  function step(){
    ctx.clearRect(0,0,w,h);
    // draw lines for nearby particles
    for(let i=0;i<particles.length;i++){
      for(let j=i+1;j<particles.length;j++){
        const a=particles[i], b=particles[j];
        const dx=a.x-b.x, dy=a.y-b.y; const d=dx*dx+dy*dy;
        if(d<120*120){
          const alpha = Math.max(0, 1 - d/(120*120));
          ctx.strokeStyle = `rgba(99,102,241,${alpha*0.35})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
        }
      }
    }
    // draw particles
    for(const p of particles){
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<0||p.x>w) p.vx*=-1;
      if(p.y<0||p.y>h) p.vy*=-1;
      ctx.fillStyle = 'rgba(226,232,240,0.6)';
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
    }
    requestAnimationFrame(step);
  }

  resize();
  step();
})();
