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

const player1 = new (Player as any)('Player 1', 100, 100, 'red');
player1.draw();
const player2 = new (Player as any)('Player 2', 200, 200, 'green');
player2.draw();