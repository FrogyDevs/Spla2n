import './style.css';

const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

ctx.fillStyle = 'lime';
ctx.fillRect(50, 50, 100, 100);

ctx.fillStyle = 'blue';
ctx.fillRect(200, 50, 100, 100);

console.log('main.ts loaded');

function Player(this: { name: string; x: number; y: number; color: string }, name: string, x: number, y: number, color: string) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.color = color;

    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, 50, 50);
}