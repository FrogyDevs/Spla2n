import './style.css';

const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
console.log('main.ts loaded');

function Player(this: { name: string; x: number; y: number; color: string; size: number; draw: () => void }, name: string, x: number, y: number, color: string) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.color = color;
    this.size = 50;

    this.draw = () => {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.size, this.size);
  };
}

let animationId: number | null = null;

const drawPlayers = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player1.draw();
  player2.draw();
};

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
    
    document.addEventListener("keydown", (event) => {
    const keyName = event.key;

    if (keyName === "d") {
        moveRight(player1);
        stopAnimation();
    }
    if (keyName === "a") {
        moveLeft(player1);
        stopAnimation();
    }
    if (keyName === "w") {
        moveUp(player1);
        stopAnimation();
    }
    if (keyName === "s") {
        moveDown(player1);
        stopAnimation();
    }
    });

    document.addEventListener("keydown", (event) => {
    const keyName = event.key;

    if (keyName === "ArrowRight") {
        moveRight(player2);
        stopAnimation();
    }
    if (keyName === "ArrowLeft") {
        moveLeft(player2);
        stopAnimation();
    }
    if (keyName === "ArrowUp") {
        moveUp(player2);
        stopAnimation();
    }
    if (keyName === "ArrowDown") {
        moveDown(player2);
        stopAnimation();
    }
    });
    player1.draw();
    player2.draw();
    
}

gameLoop();