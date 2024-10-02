const WIDTH = 5;
const HEIGHT = 5;

// game state variables
let maze = [];
let playerPos = new Position(0, 0);

// initial maze rendering
document.addEventListener('DOMContentLoaded', function() {
    resetGame();
});

// function to update the maze display
function updateMaze() {
    const mazeElement = document.getElementById('maze');
    mazeElement.innerHTML = '';

    for (let y = 0; y < HEIGHT; y++) {
        const row = document.createElement('tr');
        for (let x = 0; x < WIDTH; x++) {
            const cell = document.createElement('td');
            if (x === playerPos.x && y === playerPos.y) {
                cell.classList.add('player');
                cell.innerHTML = '⚽';
            } else if (maze[y][x] === 'G') {
                cell.classList.add('goal');
                cell.innerHTML = '🥅';
            } else if (maze[y][x] === 'X') {
                cell.classList.add('obstacle');
                cell.innerHTML = '❌';
            } else {
                cell.innerHTML = '';
            }
            row.appendChild(cell);
        }
        mazeElement.appendChild(row);
    }
}

// move the player in the specified direction
function move(direction) {
    if (isValidMove(playerPos, direction, maze)) {
        updatePosition(playerPos, direction);

        // check if the goal has been reached
        if (playerPos.x === WIDTH - 1 && playerPos.y === HEIGHT - 1) {
            alert("Congratulations! You've reached the goal!");
            resetGame();
        } else {
            updateMaze();
        }
    }
}

function resetGame() {
    maze = generateMaze();
    playerPos = new Position(0, 0);
    updateMaze();
}

// when using keyboard buttons
window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
        case 'w':
            move('up');
            break;
        case 'ArrowDown':
        case 's':
            move('down');
            break;
        case 'ArrowLeft':
        case 'a':
            move('left');
            break;
        case 'ArrowRight':
        case 'd':
            move('right');
            break;
        case 'q':
            alert("Thanks for playing! Goodbye!");
            window.location.reload();
            break;
    }
});
