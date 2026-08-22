import './style.css';

const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
console.log('main.ts loaded');

function Player(this: { name: string; x: number; y: number; color: string; size: number; draw: () => void }, name: string, x: number, y: number, color: string) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.color = color;
    this.size = 40;

    this.draw = () => {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.size, this.size);
  };
}

const tileSize = 20;

const grid: (number | null)[][] = [];

for (let y = 0; y < canvas.height / tileSize; y++) {
    const row: (number | null)[] = [];
    for (let x = 0; x < canvas.width / tileSize; x++) {
        row.push(0);
    }
    grid.push(row);
}

function drawGrid() {
    for (let y = 0; y < canvas.height / tileSize; y++) {
        const row = grid[y];
        if (!row) continue;

        for (let x = 0; x < canvas.width / tileSize; x++) {
            const cell = row[x];

            if (cell === 1) {
                ctx.fillStyle = 'red';
                ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
            }

            if (cell === 2) {
                ctx.fillStyle = 'green';
                ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
            }

            ctx.strokeStyle = 'gray';
            ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
        }
    }
}

let animationId: number | null = null;

const drawPlayers = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player1.draw();
  player2.draw();
  drawGrid();
};

const keys = new Set<string>();
const speed = 5;

document.addEventListener('keydown', (event) => {
    keys.add(event.key);
});

document.addEventListener('keyup', (event) => {
    keys.delete(event.key);
});


const moveRight = (player: { x: number; draw: () => void }) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player.x += 5;
  drawPlayers();

  animationId = requestAnimationFrame(() => moveRight(player));
};

const moveLeft = (player: { x: number; draw: () => void }) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player.x -= 5;
  drawPlayers();

  animationId = requestAnimationFrame(() => moveLeft(player));
};

const moveUp = (player: { y: number; draw: () => void }) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player.y -= 5;
  drawPlayers();

  animationId = requestAnimationFrame(() => moveUp(player));
};

const moveDown = (player: { y: number; draw: () => void }) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player.y += 5;
  drawPlayers();

  animationId = requestAnimationFrame(() => moveDown(player));
};


const stopAnimation = () => {
  if (animationId !== null) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
};

const player1 = new (Player as any)('Player 1', 100, 100, 'red');
player1.draw();
const player2 = new (Player as any)('Player 2', 200, 200, 'green');
player2.draw();



const gameLoop = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player1.draw();
    player2.draw();
    drawGrid();
    
    if (keys.has('d')) player1.x += speed;
    if (keys.has('a')) player1.x -= speed;
    if (keys.has('w')) player1.y -= speed;
    if (keys.has('s')) player1.y += speed;

    if (keys.has('ArrowRight')) player2.x += speed;
    if (keys.has('ArrowLeft')) player2.x -= speed;
    if (keys.has('ArrowUp')) player2.y -= speed;
    if (keys.has('ArrowDown')) player2.y += speed;
    drawPlayers();
    requestAnimationFrame(gameLoop);
    
}

gameLoop();