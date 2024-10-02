class Position {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

function isValidMove(playerPos, move, maze) {
    const newPos = { ...playerPos };

    switch (move) {
        case 'up':
            newPos.y--;
            break;
        case 'down':
            newPos.y++;
            break;
        case 'left':
            newPos.x--;
            break;
        case 'right':
            newPos.x++;
            break;
    }

    if (newPos.x < 0 || newPos.x >= WIDTH || newPos.y < 0 || newPos.y >= HEIGHT) {
        return false;
    }

    if (maze[newPos.y][newPos.x] === 'X') {
        return false;
    }

    return true;
}

function updatePosition(playerPos, move) {
    switch (move) {
        case 'up':
            playerPos.y--;
            break;
        case 'down':
            playerPos.y++;
            break;
        case 'left':
            playerPos.x--;
            break;
        case 'right':
            playerPos.x++;
            break;
    }
}

function generateMaze() {
    const maze = Array.from({ length: HEIGHT }, () => Array(WIDTH).fill(" "));

    maze[0][0] = "S";
    maze[HEIGHT - 1][WIDTH - 1] = "G";

    const numObstacles = Math.floor(Math.random() * 6) + 5; // obstacle is between 5-10
    for (let i = 0; i < numObstacles; i++) {
        const x = Math.floor(Math.random() * WIDTH);
        const y = Math.floor(Math.random() * HEIGHT);
        if ((x === 0 && y === 0) || (x === WIDTH - 1 && y === HEIGHT - 1) || maze[y][x] === "X") {
            continue;
        }
        maze[y][x] = "X";
    }

    // if not solvable, regenerate
    if (!isSolvableMaze(maze)) {
        return generateMaze();
    }

    return maze;
}

function isSolvableMaze(maze) {
    const visited = Array.from({ length: HEIGHT }, () => Array(WIDTH).fill(false));
    return dfs(0, 0, maze, visited);
}

function dfs(x, y, maze, visited) {
    let directions = [
        { dx: 1, dy: 0 }, { dx: -1, dy: 0 }, { dx: 0, dy: 1 }, { dx: 0, dy: -1 }
    ];

    if (x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT || maze[y][x] === "X" || visited[y][x]) {
        return false;
    }

    if (x === WIDTH - 1 && y === HEIGHT - 1) {
        return true;
    }

    visited[y][x] = true;

    // iterate over each direction
    for (const { dx, dy } of directions) {
        if (dfs(x + dx, y + dy, maze, visited)) {
            return true;
        }
    }

    // no path found
    return false;
}

resetGame();
