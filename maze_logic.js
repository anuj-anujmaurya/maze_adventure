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

    if (newPos.x < 0 || newPos.x >= N || newPos.y < 0 || newPos.y >= N) {
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
    const maze = Array.from({ length: N }, () => Array(N).fill(""));

    maze[0][0] = "S";
    maze[N - 1][N - 1] = "G";

    const numObstacles = Math.floor(Math.random() * 6) + 7; // obstacle is 7+
    for (let i = 0; i < numObstacles; i++) {
        const x = Math.floor(Math.random() * N);
        const y = Math.floor(Math.random() * N);
        if ((x === 0 && y === 0) || (x === N - 1 && y === N - 1) || maze[y][x] === "X") {
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
    const visited = Array.from({ length: N }, () => Array(N).fill(false));
    return dfs(0, 0, maze, visited);
}

// TO-DO later (for higher complexity, reduce the number of paths, by adding more obstacles, or adding obstacles at optimum places ?)

function dfs(x, y, maze, visited) {
    let directions = [
        { dx: 1, dy: 0 }, { dx: -1, dy: 0 }, { dx: 0, dy: 1 }, { dx: 0, dy: -1 }
    ];

    if (x < 0 || x >= N || y < 0 || y >= N || maze[y][x] === "X" || visited[y][x]) {
        return false;
    }

    if (x === N - 1 && y === N - 1) {
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
