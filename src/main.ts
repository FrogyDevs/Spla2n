import './style.css';

const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

if (!ctx) {
    throw new Error('Could not get canvas context');
}

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

type Screen = 'main' | 'settings' | 'game';

type Player = {
    name: string;
    x: number;
    y: number;
    color: string;
    size: number;
};

let currentScreen: Screen = 'main';
let gameIsRunning = false;

const tileSize = 20;
const speed = 5;
const keys = new Set<string>();

const menu = document.createElement('div');
menu.id = 'menu';
document.body.appendChild(menu);

const player1: Player = {
    name: 'Player 1',
    x: 100,
    y: 100,
    color: 'blue',
    size: 40,
};

const player2: Player = {
    name: 'Player 2',
    x: 200,
    y: 200,
    color: 'yellow',
    size: 40,
};

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

const trailThickness = 20;

const resetGame = () => {
    createGrid();

    player1.x = player1.startX;
    player1.y = player1.startY;

    player2.x = player2.startX;
    player2.y = player2.startY;

    keys.clear();
    drawGame();
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

            ctx.strokeStyle = 'gray';
            ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
        }
    }
};

const drawPlayer = (player: Player) => {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.size, player.size);
};

const drawGame = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    drawPlayer(player1);
    drawPlayer(player2);
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

const updatePlayers = () => {
    if (keys.has('d')) player1.x += speed;
    if (keys.has('a')) player1.x -= speed;
    if (keys.has('w')) player1.y -= speed;
    if (keys.has('s')) player1.y += speed;

    if (keys.has('ArrowRight')) player2.x += speed;
    if (keys.has('ArrowLeft')) player2.x -= speed;
    if (keys.has('ArrowUp')) player2.y -= speed;
    if (keys.has('ArrowDown')) player2.y += speed;

    keepPlayerInsideCanvas(player1);
    keepPlayerInsideCanvas(player2);

    addTrail(player1);
    addTrail(player2);
};

const gameDuration = 10;
let gameStartTime = 0;

const drawTimer = (currentTime: number) => {
    const elapsedTime = (currentTime - gameStartTime) / 1000;
    const remainingTime = Math.max(
        0,
        Math.ceil(gameDuration - elapsedTime)
    );

    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.fillText(`Time: ${remainingTime}s`, 20, 30);

    if (remainingTime === 0) {
        ctx.fillText('Game Over!', canvas.width / 2 - 50, canvas.height / 2);
    }
    return remainingTime;
};

const gameLoop = (currentTime: number) => {
    if (currentScreen !== 'game') {
        gameIsRunning = false;
        return;
    }

    updatePlayers();
    drawGame();
    const remainingTime = drawTimer(currentTime);

    if (remainingTime > 0) {
        requestAnimationFrame(gameLoop);
    } else {
        gameIsRunning = false;
    }
};

const startGame = () => {
    currentScreen = 'game';
    menu.style.display = 'none';

    keys.clear();

    if (!gameIsRunning) {
        gameIsRunning = true;
        gameStartTime = performance.now();
        gameLoop(gameStartTime);
    }
};


const showMainMenu = () => {
    currentScreen = 'main';
    menu.style.display = 'flex';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    keys.clear();

    menu.innerHTML = `
        <h1>Spla2n</h1>
        <button id="playButton">Play</button>
        <button id="settingsButton">Settings</button>
    `;

    document.getElementById('playButton')?.addEventListener('click', startGame);
    document.getElementById('settingsButton')?.addEventListener('click', showSettingsMenu);
};

const showSettingsMenu = () => {
    currentScreen = 'settings';
    menu.style.display = 'flex';

    menu.innerHTML = `
        <h1>Settings</h1>

        <label class="setting-row">
            <input type="checkbox" id="dummySetting" />
            Example setting
        </label>

        <p>This setting is just an example and does nothing.</p>

        <button id="backButton">Back</button>
    `;

    document.getElementById('dummySetting')?.addEventListener('change', () => {
        console.log('Dummy setting changed. It does nothing.');
    });

    document.getElementById('backButton')?.addEventListener('click', showMainMenu);
};

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && currentScreen === 'game') {
        showMainMenu();
        return;
    }

    if ((event.key === 'r' || event.key === 'R') && currentScreen === 'game') {
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
    }
});

createGrid();
showMainMenu();