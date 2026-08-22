import './style.css';

const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

if (!ctx) {
    throw new Error('Could not get canvas context');
}

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

type Screen = 'main' | 'info' | 'game';

type Player = {
    name: string;
    x: number;
    y: number;
    startX: number;
    startY: number;
    color: string;
    size: number;
};

type Wall = {
    x: number;
    y: number;
    width: number;
    height: number;
};

let currentScreen: Screen = 'main';
let gameIsRunning = false;

const tileSize = 20;
const trailThickness = 20;
const speed = 5;
const keys = new Set<string>();

const gameDuration = 60;
let remainingTime = gameDuration;
let lastFrameTime = 0;

const menu = document.createElement('div');
menu.id = 'menu';
document.body.appendChild(menu);

const player1: Player = {
    name: 'Player 1',
    x: 100,
    y: 100,
    startX: 100,
    startY: 100,
    color: 'blue',
    size: 40,
};

const player2: Player = {
    name: 'Player 2',
    x: 200,
    y: 200,
    startX: 200,
    startY: 200,
    color: 'yellow',
    size: 40,
};

const walls: Wall[] = [
    {
        x: 360,
        y: 140,
        width: 240,
        height: 40,
    },
    {
        x: 360,
        y: 180,
        width: 40,
        height: 180,
    },
    {
        x: 700,
        y: 300,
        width: 260,
        height: 40,
    },
    {
        x: 920,
        y: 340,
        width: 40,
        height: 200,
    },
    {
        x: 180,
        y: 480,
        width: 300,
        height: 40,
    },
    {
        x: 1200,
        y: 200,
        width: 40,
        height: 300,
    },
    {
        x: 700,
        y: 650,
        width: 300,
        height: 40,
    },
    {
        x: 700,
        y: 650,
        width: 40,
        height: 200,
    },
];

let grid: (string | null)[][] = [];

const createGrid = () => {
    grid = [];

    const rows = Math.ceil(canvas.height / tileSize);
    const columns = Math.ceil(canvas.width / tileSize);

    for (let y = 0; y < rows; y++) {
        const row: (string | null)[] = [];

        for (let x = 0; x < columns; x++) {
            row.push(null);
        }

        grid.push(row);
    }
};

const drawGrid = () => {
    for (let y = 0; y < grid.length; y++) {
        const row = grid[y];

        for (let x = 0; x < row.length; x++) {
            const cell = row[x];

            if (cell !== null) {
                ctx.fillStyle = cell;
                ctx.fillRect(x * tileSize, y * tileSize, trailThickness, trailThickness);
            }

            ctx.strokeStyle = 'black';
            ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
        }
    }
};

const drawWalls = () => {
    for (const wall of walls) {
        ctx.fillStyle = '#555555';
        ctx.fillRect(wall.x, wall.y, wall.width, wall.height);

        ctx.strokeStyle = '#222222';
        ctx.lineWidth = 3;
        ctx.strokeRect(wall.x, wall.y, wall.width, wall.height);
        ctx.lineWidth = 1;
    }
};

const drawPlayer = (player: Player) => {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.size, player.size);
};

const drawGame = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    drawWalls();
    drawPlayer(player1);
    drawPlayer(player2);
};

const drawTimer = () => {
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.fillText(`Time: ${Math.ceil(remainingTime)}s`, 20, 30);

    if (remainingTime === 0) {
        ctx.fillText('Game Over!', canvas.width / 2 - 50, canvas.height / 2);
    }

    return remainingTime;
};

const addTrail = (player: Player) => {
    const gridX = Math.floor((player.x + player.size / 2) / tileSize);
    const gridY = Math.floor((player.y + player.size / 2) / tileSize);

    const row = grid[gridY];

    if (!row) return;
    if (gridX < 0 || gridX >= row.length) return;

    row[gridX] = player.color;
};

const keepPlayerInsideCanvas = (player: Player) => {
    if (player.x < 0) player.x = 0;
    if (player.y < 0) player.y = 0;

    if (player.x + player.size > canvas.width) {
        player.x = canvas.width - player.size;
    }

    if (player.y + player.size > canvas.height) {
        player.y = canvas.height - player.size;
    }
};

const isCollidingWithWall = (
    nextX: number,
    nextY: number,
    player: Player,
    wall: Wall
) => {
    return (
        nextX < wall.x + wall.width &&
        nextX + player.size > wall.x &&
        nextY < wall.y + wall.height &&
        nextY + player.size > wall.y
    );
};

const wouldCollideWithAnyWall = (
    player: Player,
    nextX: number,
    nextY: number
) => {
    return walls.some((wall) => isCollidingWithWall(nextX, nextY, player, wall));
};

const tryMovePlayer = (player: Player, moveX: number, moveY: number) => {
    const nextX = player.x + moveX;
    const nextY = player.y + moveY;

    if (!wouldCollideWithAnyWall(player, nextX, nextY)) {
        player.x = nextX;
        player.y = nextY;
    }

    keepPlayerInsideCanvas(player);
};

const updatePlayers = () => {
    if (keys.has('d')) tryMovePlayer(player1, speed, 0);
    if (keys.has('a')) tryMovePlayer(player1, -speed, 0);
    if (keys.has('w')) tryMovePlayer(player1, 0, -speed);
    if (keys.has('s')) tryMovePlayer(player1, 0, speed);

    if (keys.has('ArrowRight')) tryMovePlayer(player2, speed, 0);
    if (keys.has('ArrowLeft')) tryMovePlayer(player2, -speed, 0);
    if (keys.has('ArrowUp')) tryMovePlayer(player2, 0, -speed);
    if (keys.has('ArrowDown')) tryMovePlayer(player2, 0, speed);

    addTrail(player1);
    addTrail(player2);
};

const updateTimer = (currentTime: number) => {
    const deltaTime = (currentTime - lastFrameTime) / 1000;
    remainingTime = Math.max(0, remainingTime - deltaTime);
    lastFrameTime = currentTime;
};

const gameLoop = (currentTime: number) => {
    if (currentScreen !== 'game') {
        gameIsRunning = false;
        return;
    }

    updateTimer(currentTime);
    updatePlayers();
    drawGame();

    const timeLeft = drawTimer();

    if (timeLeft > 0) {
        requestAnimationFrame(gameLoop);
    } else {
        gameIsRunning = false;
    }
};

const resetGame = () => {
    createGrid();

    player1.x = player1.startX;
    player1.y = player1.startY;

    player2.x = player2.startX;
    player2.y = player2.startY;

    remainingTime = gameDuration;
    lastFrameTime = performance.now();

    keys.clear();
    drawGame();
    drawTimer();

    if (currentScreen === 'game' && !gameIsRunning) {
        gameIsRunning = true;
        requestAnimationFrame(gameLoop);
    }
};

const saveSelectedColors = () => {
    const player1ColorSelect = document.getElementById('player1Color') as HTMLSelectElement | null;
    const player2ColorSelect = document.getElementById('player2Color') as HTMLSelectElement | null;

    if (player1ColorSelect) {
        player1.color = player1ColorSelect.value;
    }

    if (player2ColorSelect) {
        player2.color = player2ColorSelect.value;
    }
};

const startGame = () => {
    currentScreen = 'game';
    menu.style.display = 'none';

    saveSelectedColors();

    keys.clear();

    if (!gameIsRunning) {
        gameIsRunning = true;
        lastFrameTime = performance.now();
        requestAnimationFrame(gameLoop);
    }
};

const showMainMenu = () => {
    currentScreen = 'main';
    menu.style.display = 'flex';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    keys.clear();

    menu.innerHTML = `
        <h1>Spla2n</h1>

        <label>
            Player 1 Color:
            <select id="player1Color">
                <option value="blue" ${player1.color === 'blue' ? 'selected' : ''}>Blue</option>
                <option value="red" ${player1.color === 'red' ? 'selected' : ''}>Red</option>
                <option value="green" ${player1.color === 'green' ? 'selected' : ''}>Green</option>
                <option value="purple" ${player1.color === 'purple' ? 'selected' : ''}>Purple</option>
            </select>
        </label>

        <label>
            Player 2 Color:
            <select id="player2Color">
                <option value="yellow" ${player2.color === 'yellow' ? 'selected' : ''}>Yellow</option>
                <option value="orange" ${player2.color === 'orange' ? 'selected' : ''}>Orange</option>
                <option value="white" ${player2.color === 'white' ? 'selected' : ''}>White</option>
                <option value="magenta" ${player2.color === 'magenta' ? 'selected' : ''}>Magenta</option>
            </select>
        </label>

        <button id="playButton">Play</button>
        <button id="infoButton">Info</button>
    `;

    document.getElementById('playButton')?.addEventListener('click', startGame);
    document.getElementById('infoButton')?.addEventListener('click', () => {
        saveSelectedColors();
        showInfoMenu();
    });
};

const showInfoMenu = () => {
    currentScreen = 'info';
    menu.style.display = 'flex';

    menu.innerHTML = `
        <h1>Info</h1>

        <p>Player 1: WASD</p>
        <p>Player 2: Arrow Keys</p>
        <p>E: Reset game</p>

        <button id="backButton">Back</button>
    `;

    document.getElementById('backButton')?.addEventListener('click', showMainMenu);
};

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && currentScreen === 'game') {
        showMainMenu();
        return;
    }

    if ((event.key === 'e' || event.key === 'E') && currentScreen === 'game') {
        resetGame();
        return;
    }

    keys.add(event.key);
});

document.addEventListener('keyup', (event) => {
    keys.delete(event.key);
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    createGrid();

    if (currentScreen === 'game') {
        drawGame();
        drawTimer();
    }
});

createGrid();
showMainMenu();