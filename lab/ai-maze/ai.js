// AI Chat Maze - rule-based hint system
(function(){
  const resp = document.getElementById('ai-response');
  const btn = document.getElementById('hint-btn');
  const { maze, player, goal } = window.__AI_MAZE__ || {};

  function moveDirectionHint(p,g){
    const dx = g.x - p.x; const dy = g.y - p.y;
    if(Math.abs(dx) > Math.abs(dy)) return dx>0 ? 'Try moving RIGHT.' : 'Try moving LEFT.';
    return dy>0 ? 'Try moving DOWN.' : 'Try moving UP.';
  }
  function proximityHint(p,g){
    const d = Math.abs(g.x-p.x)+Math.abs(g.y-p.y);
    if(d<=2) return 'You are very close. One or two steps away!';
    if(d<=5) return 'You are halfway to the goal.';
    return 'The goal is still a bit far. Keep navigating the open paths.';
  }
  function isDeadEnd(x,y){
    let walls=0;
    const dirs=[[1,0],[-1,0],[0,1],[0,-1]];
    for(const [dx,dy] of dirs){
      const nx=x+dx, ny=y+dy;
      if(nx<0||ny<0||ny>=maze.length||nx>=maze[0].length||maze[ny][nx]===1) walls++;
    }
    return walls>=3;
  }
  function deadEndHint(p){
    const dirs=[{n:'LEFT',dx:-1,dy:0},{n:'RIGHT',dx:1,dy:0},{n:'UP',dx:0,dy:-1},{n:'DOWN',dx:0,dy:1}];
    for(const d of dirs){
      const nx=p.x+d.dx, ny=p.y+d.dy;
      if(nx>=0&&ny>=0&&ny<maze.length&&nx<maze[0].length && maze[ny][nx]===0 && isDeadEnd(nx,ny)){
        return `There is a dead end to your ${d.n.toLowerCase()}.`;
      }
    }
    return 'No immediate dead ends adjacent. Choose a clear corridor.';
  }

  function getHint(p, m, g){
    const options = [
      moveDirectionHint(p,g),
      proximityHint(p,g),
      deadEndHint(p)
    ];
    return options[Math.floor(Math.random()*options.length)];
  }

  btn.addEventListener('click', ()=>{
    const hint = getHint(player, maze, goal);
    resp.textContent = hint;
  });

  // expose
  window.getHint = getHint;
})();
