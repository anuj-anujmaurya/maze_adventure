const WIDTH = 5;
const HEIGHT = 5;

// game state variables
let maze = [];
let playerPos = new Position(0, 0);

function resetGame() {
    maze = generateMaze();
    playerPos = new Position(0, 0);
    // clear canvas
    Clear();
    updateMaze();
}

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
                cell.setAttribute('id', 'goal');
                cell.innerHTML = '🥅';
            } else if (maze[y][x] === 'X') {
                cell.classList.add('obstacle');
                cell.innerHTML = '👻';
            } else {
                cell.innerHTML = '';
            }
            row.appendChild(cell);
        }
        mazeElement.appendChild(row);
    }
}

const successSound = new Audio('/assets/success.mp3');
// move the player in the specified direction
function move(direction) {
    if (isValidMove(playerPos, direction, maze)) {
        updatePosition(playerPos, direction);

        // check if the goal has been reached
        if (playerPos.x === WIDTH - 1 && playerPos.y === HEIGHT - 1) {
            let goal_ele = document.getElementById('goal');
            goal_ele.innerHTML = '';
            let img_tag = document.createElement('img');
            img_tag.setAttribute('src', '/assets/goal.gif');
            img_tag.classList.add('goal_img');
            goal_ele.appendChild(img_tag);

            successSound.play(); 

            Draw(100);

            setTimeout(() => {
                alert("Congratulations! You've reached the goal!");
                resetGame();
            }, 2000);
        } else {
            updateMaze();
        }
    }
}

// when using keyboard buttons
window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            move('up');
            break;
        case 'ArrowDown':
            move('down');
            break;
        case 'ArrowLeft':
            move('left');
            break;
        case 'ArrowRight':
            move('right');
            break;
        case 'q':
            alert("Thanks for playing! Goodbye!");
            window.location.reload();
            break;
    }
});
