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

const grid: (string | null)[][] = [];

for (let y = 0; y < Math.ceil(canvas.height / tileSize); y++) {
    const row: (string | null)[] = [];
    for (let x = 0; x < Math.ceil(canvas.width / tileSize); x++) {
        row.push(null);
    }
    grid.push(row);
}

function drawGrid() {
    for (let y = 0; y < Math.ceil(canvas.height / tileSize); y++) {
        const row = grid[y];
        if (!row) continue;

        for (let x = 0; x < Math.ceil(canvas.width / tileSize); x++) {
            const cell = row[x];

            if (cell !== null) {
                ctx.fillStyle = cell;
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
  drawGrid();
  player1.draw();
  player2.draw();
};

const keys = new Set<string>();
const speed = 5;

document.addEventListener('keydown', (event) => {
    keys.add(event.key);
});

document.addEventListener('keyup', (event) => {
    keys.delete(event.key);
});


const player1 = new (Player as any)('Player 1', 100, 100, 'blue');
const player2 = new (Player as any)('Player 2', 200, 200, 'yellow');

const addTrail = (player: { x: number; y: number; size: number; color: string }) => {
    const gridX = Math.floor((player.x + player.size / 2) / tileSize);
    const gridY = Math.floor((player.y + player.size / 2) / tileSize);
    
    const row = grid[gridY];
    if (!row) return;

    if (row[gridX] === null || row[gridX] !== player.color) {
      row[gridX] = player.color;
    }
};

const gameLoop = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayers();
    drawGrid();
    
    if (keys.has('d')) player1.x += speed;
    if (keys.has('a')) player1.x -= speed;
    if (keys.has('w')) player1.y -= speed;
    if (keys.has('s')) player1.y += speed;

    if (keys.has('ArrowRight')) player2.x += speed;
    if (keys.has('ArrowLeft')) player2.x -= speed;
    if (keys.has('ArrowUp')) player2.y -= speed;
    if (keys.has('ArrowDown')) player2.y += speed;

    addTrail(player1);
    addTrail(player2);
    drawPlayers();
    requestAnimationFrame(gameLoop);
    
}

gameLoop();