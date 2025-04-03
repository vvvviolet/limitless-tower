cconst canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const loading = document.getElementById('loading');

// 画布尺寸设置
const TILE_SIZE = 16;
const SCALE = 2;
canvas.width = 320 * SCALE;
canvas.height = 180 * SCALE;
ctx.imageSmoothingEnabled = false;

// 素材配置
const ASSETS = {
  grass: 'https://i.imgur.com/fvVZz7G.png',    // 草地
  dirt: 'https://i.imgur.com/4JkXwEj.png',     // 土地
  water: 'https://i.imgur.com/6KYzW3v.png',    // 水
  character: 'https://i.imgur.com/1qYVxTy.png' // 角色
};

// 扩展后的地图数据 (0: 草地, 1: 土地, 2: 水)
const mapData = [
  [0,0,0,1,1,0,0,2,2,2,0,0,1,1,0,0,2,2,2,0],
  [0,1,0,1,0,0,2,2,2,2,0,1,1,0,0,2,2,2,2,2],
  [1,1,0,0,0,2,2,2,2,2,1,1,0,0,0,2,2,2,2,2],
  [0,0,0,0,2,2,2,2,2,2,0,0,0,0,2,2,2,2,2,2],
  // ... 更多行数据（保持数组长度一致）
];

// 游戏对象
const game = {
  loaded: false,
  tiles: {},
  character: null
};

// 预加载素材
function loadAssets() {
  return Promise.all(
    Object.entries(ASSETS).map(([name, url]) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = url;
        img.onload = () => {
          game.tiles[name] = img;
          loading.textContent = `Loading... ${Object.keys(game.tiles).length}/${Object.keys(ASSETS).length}`;
          resolve();
        };
      });
    })
  );
}

// 绘制地图
function drawMap() {
  mapData.forEach((row, y) => {
    row.forEach((tile, x) => {
      let img;
      switch(tile) {
        case 0: img = game.tiles.grass; break;
        case 1: img = game.tiles.dirt; break;
        case 2: img = game.tiles.water; break;
      }
      
      ctx.drawImage(
        img,
        x * TILE_SIZE * SCALE,
        y * TILE_SIZE * SCALE,
        TILE_SIZE * SCALE,
        TILE_SIZE * SCALE
      );
    });
  });
}

// 绘制角色
function drawCharacter() {
  if (!game.character) {
    game.character = {
      x: 5 * TILE_SIZE * SCALE,
      y: 5 * TILE_SIZE * SCALE
    };
  }
  
  ctx.drawImage(
    game.tiles.character,
    game.character.x,
    game.character.y,
    TILE_SIZE * SCALE,
    TILE_SIZE * SCALE
  );
}

// 游戏循环
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawMap();
  drawCharacter();
  requestAnimationFrame(gameLoop);
}

// 初始化
loadAssets().then(() => {
  loading.style.display = 'none';
  game.loaded = true;
  gameLoop();
});