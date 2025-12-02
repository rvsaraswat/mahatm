/* Neuron Connect: simple planar graph puzzle
   Goal: Connect all nodes with straight lines without intersections.
*/
(function(){
  const canvas = document.getElementById('gameCanvas');
  const statusText = document.getElementById('statusText');
  const resetBtn = document.getElementById('resetBtn');
  const solveBtn = document.getElementById('solveBtn');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize(){
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.floor(rect.width);
    canvas.height = Math.floor(rect.height);
    draw();
  }
  window.addEventListener('resize', resize);

  // Level definition
  let nodes = [];
  let edges = [];
  let selectedNode = null;

  function initLevel(){
    const w = canvas.width, h = canvas.height;
    nodes = [
      {x: w*0.2, y: h*0.25},
      {x: w*0.5, y: h*0.18},
      {x: w*0.8, y: h*0.28},
      {x: w*0.25, y: h*0.75},
      {x: w*0.55, y: h*0.7},
      {x: w*0.82, y: h*0.72},
    ];
    edges = [];
    statusText.textContent = 'Make connections without intersections.';
    draw();
  }

  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    // draw edges
    for(const e of edges){
      ctx.strokeStyle = e.highlight ? '#34d399' : '#93c5fd';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(nodes[e.a].x, nodes[e.a].y);
      ctx.lineTo(nodes[e.b].x, nodes[e.b].y);
      ctx.stroke();
    }
    // draw nodes
    for(let i=0;i<nodes.length;i++){
      const n = nodes[i];
      ctx.fillStyle = selectedNode===i ? '#6366f1' : '#e5e7eb';
      ctx.beginPath();
      ctx.arc(n.x, n.y, 8, 0, Math.PI*2);
      ctx.fill();
    }
  }

  function getNodeAt(x,y){
    for(let i=0;i<nodes.length;i++){
      const n = nodes[i];
      const dx = x - n.x, dy = y - n.y;
      if(dx*dx + dy*dy <= 10*10) return i;
    }
    return null;
  }

  function segmentsIntersect(a,b,c,d){
    function cross(p,q,r){ return (q.x-p.x)*(r.y-p.y) - (q.y-p.y)*(r.x-p.x); }
    const p=a,q=b,r=c,s=d;
    const d1=cross(p,q,r), d2=cross(p,q,s), d3=cross(r,s,p), d4=cross(r,s,q);
    return ((d1>0 && d2<0) || (d1<0 && d2>0)) && ((d3>0 && d4<0) || (d3<0 && d4>0));
  }

  function edgeIntersectsAny(newEdge){
    const A = nodes[newEdge.a], B = nodes[newEdge.b];
    for(const e of edges){
      if(e.a===newEdge.a && e.b===newEdge.b) return true; // duplicate
      const C = nodes[e.a], D = nodes[e.b];
      // skip sharing endpoints
      if(newEdge.a===e.a || newEdge.a===e.b || newEdge.b===e.a || newEdge.b===e.b) continue;
      if(segmentsIntersect(A,B,C,D)) return true;
    }
    return false;
  }

  function allConnected(){
    // simplistic: require at least nodes.length+1 edges and no intersections
    return edges.length >= nodes.length - 1 && !edges.some(edgeIntersectsAny);
  }

  canvas.addEventListener('mousedown', (ev)=>{
    const rect = canvas.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;
    const idx = getNodeAt(x,y);
    if(idx!==null){
      if(selectedNode===null){
        selectedNode = idx;
      } else if(selectedNode!==idx){
        const newEdge = {a: Math.min(selectedNode, idx), b: Math.max(selectedNode, idx)};
        if(!edgeIntersectsAny(newEdge)){
          edges.push(newEdge);
          draw();
          if(allConnected()){
            statusText.textContent = 'Network Activated! ✨';
            // highlight all
            edges.forEach(e=> e.highlight = true);
            draw();
          } else {
            statusText.textContent = 'Good link! Keep going…';
          }
        } else {
          statusText.textContent = 'Lines cannot cross. Try another path.';
        }
        selectedNode = null;
      } else {
        selectedNode = null;
      }
    }
    draw();
  });

  resetBtn && resetBtn.addEventListener('click', ()=>{ initLevel(); });

  // Auto-solver: build a planar spanning tree via greedy nearest-neighbor edges
  function solve(){
    edges = [];
    const n = nodes.length;
    const used = new Set([0]);
    // Precompute distances
    function dist(i,j){
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      return Math.sqrt(dx*dx+dy*dy);
    }
    while(used.size < n){
      let best = null;
      let bestD = Infinity;
      for(const i of used){
        for(let j=0;j<n;j++){
          if(used.has(j) && j!==i) continue;
          if(i===j) continue;
          const candidate = {a: Math.min(i,j), b: Math.max(i,j)};
          if(edgeIntersectsAny(candidate)) continue;
          const d = dist(i,j);
          if(d < bestD){ bestD = d; best = candidate; }
        }
      }
      if(!best){
        // fallback: try adding the shortest non-intersecting edge among all pairs
        for(let i=0;i<n;i++) for(let j=i+1;j<n;j++){
          const c = {a:i,b:j};
          if(edgeIntersectsAny(c)) continue;
          const d = dist(i,j);
          if(d < bestD){ bestD = d; best = c; }
        }
      }
      if(best){
        edges.push(best);
        used.add(best.a);
        used.add(best.b);
      } else {
        break;
      }
    }
    edges.forEach(e=> e.highlight = true);
    statusText.textContent = 'Network Activated! ✨ (Auto-solved)';
    draw();
  }

  solveBtn && solveBtn.addEventListener('click', ()=>{ solve(); });

  resize();
  initLevel();
})();
