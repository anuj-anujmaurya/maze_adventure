const WIDTH = 5;
const HEIGHT = 5;

// Initial maze rendering
document.addEventListener('DOMContentLoaded', function() {
    refreshMaze();
});

function updateMaze(data) {
    const mazeElement = document.getElementById('maze');
    mazeElement.innerHTML = '';

    for (let y = 0; y < HEIGHT; y++) {
        const row = document.createElement('tr');
        for (let x = 0; x < WIDTH; x++) {
            const cell = document.createElement('td');
            if (x === data.playerPos.x && y === data.playerPos.y) {
                cell.classList.add('player');
                cell.innerHTML = '⚽';
            } else if (data.maze[y][x] === 'G') {
                cell.classList.add('goal');
                cell.innerHTML = '🥅';
            } else if (data.maze[y][x] === 'X') {
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

async function move(direction) {
    const response = await fetch('maze.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `move=${direction}`
    });
    const data = await response.json();
    updateMaze(data);
    if (data.solved) {
        alert("Congratulations! You've reached the goal!");
        refreshMaze();
    }
}

function refreshMaze() {
    fetch('maze.php?new_game=true')
        .then(response => response.json())
        .then(data => {
            updateMaze(data);
        });
}

// Event listener for keydown events
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
