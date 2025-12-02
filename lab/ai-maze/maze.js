// AI Chat Maze - maze logic
(function(){
  const levels = [
    { // Level 1
      gridW:12, gridH:12,
      maze:[
        [1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,1,0,0,0,0,0,1],
        [1,0,1,1,0,1,0,1,1,1,0,1],
        [1,0,1,0,0,0,0,0,0,1,0,1],
        [1,0,1,0,1,1,1,1,0,1,0,1],
        [1,0,0,0,0,0,1,0,0,0,0,1],
        [1,1,1,1,1,0,1,0,1,1,0,1],
        [1,0,0,0,1,0,0,0,0,1,0,1],
        [1,0,1,0,0,0,1,1,0,0,0,1],
        [1,0,1,0,1,0,0,1,0,1,0,1],
        [1,0,0,0,0,0,0,1,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1],
      ],
      start:{x:1,y:1}, goal:{x:10,y:8}
    },
    { // Level 2
      gridW:12, gridH:12,
      maze:[
        [1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,1,0,0,0,1,0,0,1],
        [1,0,1,0,1,0,1,0,1,0,1,1],
        [1,0,1,0,0,0,1,0,0,0,0,1],
        [1,0,1,1,1,0,1,1,1,1,0,1],
        [1,0,0,0,1,0,0,0,0,1,0,1],
        [1,1,1,0,1,1,1,1,0,1,0,1],
        [1,0,0,0,0,0,1,0,0,0,0,1],
        [1,0,1,1,1,0,1,0,1,1,0,1],
        [1,0,0,0,0,0,0,0,0,1,0,1],
        [1,0,1,1,1,1,1,1,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1],
      ],
      start:{x:1,y:1}, goal:{x:10,y:10}
    },
    { // Level 3
      gridW:12, gridH:12,
      maze:[
        [1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,1,0,0,0,1,0,0,0,1],
        [1,0,1,0,0,1,0,0,0,1,0,1],
        [1,0,1,0,1,0,1,0,1,0,0,1],
        [1,0,0,0,1,0,0,0,1,0,1,1],
        [1,1,1,0,1,0,1,0,1,0,0,1],
        [1,0,0,0,0,0,1,0,0,0,1,1],
        [1,0,1,1,1,0,1,1,1,0,0,1],
        [1,0,0,0,0,0,0,0,1,1,0,1],
        [1,1,1,1,1,1,1,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,1,1,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1],
      ],
      start:{x:1,y:1}, goal:{x:10,y:9}
    }
  ];

  let gridW = levels[0].gridW, gridH = levels[0].gridH;
  let maze = levels[0].maze.map(row=>row.slice());
  let player = {...levels[0].start};
  let goal = {...levels[0].goal};

  const container = document.getElementById('maze-container');
  const status = document.getElementById('status');
  const winModal = document.getElementById('win-modal');
  const playAgainBtn = document.getElementById('play-again');
  const showPathBtn = document.getElementById('show-path');
  const autoFollowBtn = document.getElementById('auto-follow');
  const levelSelect = document.getElementById('level');

  function render(){
    container.innerHTML='';
    container.style.gridTemplateColumns = `repeat(${gridW}, 40px)`;
    for(let y=0;y<gridH;y++){
      for(let x=0;x<gridW;x++){
        const cell = document.createElement('div');
        cell.className = 'cell ' + (maze[y][x]===1 ? 'wall' : 'path');
        if(x===goal.x && y===goal.y) cell.classList.add('goal');
        if(x===player.x && y===player.y) cell.classList.add('player');
        if(pathHint.some(p=>p.x===x && p.y===y)) cell.classList.add('path-hint');
        cell.setAttribute('role','gridcell');
        container.appendChild(cell);
      }
    }
  }

  function canMove(nx,ny){
    return nx>=0 && ny>=0 && nx<gridW && ny<gridH && maze[ny][nx]===0;
  }
  let moveCount = 0;
  let startTime = null;
  function moved(){
    container.classList.add('moved');
    setTimeout(()=>container.classList.remove('moved'),120);
    moveCount++;
    if(startTime===null) startTime = performance.now();
  }
  function checkWin(){
    if(player.x===goal.x && player.y===goal.y){
      const endTime = performance.now();
      const seconds = ((endTime - (startTime||endTime))/1000).toFixed(1);
      const idx = parseInt(levelSelect.value,10)||0;
      const optimal = findPath(levels[idx].start, goal).length - 1;
      const performanceNote = moveCount<=optimal ? 'Perfect path! 🎯' : (moveCount<=optimal+3 ? 'Great! Near-optimal path.' : 'Good job! Try to optimize next time.');
      const msgP = winModal.querySelector('p');
      if(msgP){ msgP.textContent = `Time: ${seconds}s · Moves: ${moveCount} (optimal ${optimal}). ${performanceNote}`; }
      winModal.classList.remove('hidden');
      if(idx < levels.length-1){
        status.textContent = `Level ${idx+1} complete. Try Level ${idx+2}!`;
      } else {
        status.textContent = `All levels complete. 🎉`;
      }
    }
  }

  function handleKey(ev){
    // prevent arrow keys from scrolling the page
    if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(ev.key)) ev.preventDefault();
    let nx = player.x, ny = player.y;
    if(ev.key==='ArrowUp' || ev.key==='w') ny--;
    if(ev.key==='ArrowDown' || ev.key==='s') ny++;
    if(ev.key==='ArrowLeft' || ev.key==='a') nx--;
    if(ev.key==='ArrowRight' || ev.key==='d') nx++;
    if(canMove(nx,ny)){
      player.x=nx; player.y=ny;
      status.textContent = `Position: (${player.x}, ${player.y})`;
      render(); moved(); checkWin();
    }
  }

  document.addEventListener('keydown', handleKey);
  // On-screen directional controls
  document.querySelectorAll('.dir').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const d = btn.getAttribute('data-dir');
      let nx = player.x, ny = player.y;
      if(d==='up') ny--; if(d==='down') ny++; if(d==='left') nx--; if(d==='right') nx++;
      if(canMove(nx,ny)){
        player.x=nx; player.y=ny; render(); moved(); checkWin();
      }
    });
  });
  playAgainBtn.addEventListener('click', ()=>{
    const idx = parseInt(levelSelect.value,10) || 0;
    player = {...levels[idx].start};
    winModal.classList.add('hidden');
    status.textContent = '';
    pathHint = [];
    moveCount = 0; startTime = null;
    render();
  });

  // BFS solver
  function findPath(start, end){
    const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
    const q = [start];
    const key = (p)=>`${p.x},${p.y}`;
    const seen = new Set([key(start)]);
    const parent = new Map();
    while(q.length){
      const cur = q.shift();
      if(cur.x===end.x && cur.y===end.y){
        const out=[]; let t=cur; out.push(t);
        while(parent.has(key(t))){ t = parent.get(key(t)); out.push(t); }
        return out.reverse();
      }
      for(const [dx,dy] of dirs){
        const nx = cur.x+dx, ny = cur.y+dy;
        const np = {x:nx,y:ny};
        if(nx<0||ny<0||nx>=gridW||ny>=gridH) continue;
        if(maze[ny][nx]===1) continue;
        const k = key(np);
        if(seen.has(k)) continue;
        seen.add(k); parent.set(k, cur); q.push(np);
      }
    }
    return [];
  }

  let pathHint = [];
  showPathBtn.addEventListener('click', ()=>{
    pathHint = findPath(player, goal);
    status.textContent = pathHint.length ? 'Optimal path highlighted.' : 'No path found.';
    render();
  });

  autoFollowBtn.addEventListener('click', ()=>{
    const path = findPath(player, goal);
    if(!path.length){ status.textContent = 'No path found.'; return; }
    // skip current position
    let i = 1;
    function step(){
      if(i >= path.length){ checkWin(); return; }
      player.x = path[i].x; player.y = path[i].y; i++;
      render(); moved();
      if(player.x===goal.x && player.y===goal.y){ checkWin(); return; }
      setTimeout(step, 140);
    }
    step();
  });

  levelSelect.addEventListener('change', ()=>{
    const idx = parseInt(levelSelect.value,10) || 0;
    gridW = levels[idx].gridW; gridH = levels[idx].gridH;
    maze = levels[idx].maze.map(row=>row.slice());
    player = {...levels[idx].start};
    goal = {...levels[idx].goal};
    pathHint = [];
    moveCount = 0; startTime = null;
    status.textContent = `Level ${idx+1} loaded.`;
    render();
  });

  // expose for AI
  window.__AI_MAZE__ = { maze, player, goal, render, canMove };

  render();
})();
