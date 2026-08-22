const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

const tileSize = 40;
const gridSize = 20;

const grid: (number | null)[][] = [];

for (let y = 0; y < gridSize; y++) {
    const row: (number | null)[] = [];
    for (let x = 0; x < gridSize; x++) {
        row.push(0);
    }
    grid.push(row);
}

function drawGrid() {
    for (let y = 0; y < gridSize; y++) {
        const row = grid[y];
        if (!row) continue;

        for (let x = 0; x < gridSize; x++) {
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

class Player {
    name: string;
    x: number;
    y: number;
    color: string;
    size: number = 50;

    constructor(name: string, x: number, y: number, color: string) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.color = color;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
}

const player1 = new Player('Player 1', 100, 100, 'red');
player1.draw();

const player2 = new Player('Player 2', 200, 200, 'green');
player2.draw();

drawGrid();