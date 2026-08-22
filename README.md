# Spla2n

Spla2n is a two-player browser game built for a school internal hackathon. Players move around the arena, claim territory with colored trails, avoid walls, and collect power-ups before the timer reaches zero.

## Requirements

- Node.js
- npm

## Getting Started

Install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL printed by Vite in your browser.

## Controls

| Player | Movement |
| --- | --- |
| Player 1 | `W`, `A`, `S`, `D` |
| Player 2 | Arrow keys |

During a game:

- Press `R` to reset the game.
- Press `Escape` to return to the main menu.

## Gameplay

- Each player has a color selected from the main menu.
- Moving paints the arena with the player's color.
- Walls block player movement.
- Collecting a power-up creates a larger splash of the player's color.
- When the timer reaches zero, the player with the most claimed territory wins.

## Available Commands

```bash
npm run dev       # Start the Vite development server
npm run build     # Create a production build in dist/
npm run preview   # Preview the production build locally
npm run start     # Build and serve the production build
```

## Project Structure

```text
index.html        Application entry point
src/main.ts       Game logic, rendering, input, and menus
src/style.css     Page and menu styling
```
