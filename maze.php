<?php
session_start();

const WIDTH = 5;
const HEIGHT = 5;

/*********************************************************************************************************/

class Position {
    public $x;
    public $y;

    public function __construct($x, $y) {
        $this->x = $x;
        $this->y = $y;
    }
}

// Initialize the game state
if (!isset($_SESSION['maze'])) {
    resetGame();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $move = $_POST['move'] ?? null;

    // update the player's position based on the move
    if ($move && isValidMove($_SESSION['playerPos'], $move, $_SESSION['maze'])) {
        $_SESSION['playerPos'] = updatePosition($_SESSION['playerPos'], $move);
    }

    // check if the goal has been reached
    if ($_SESSION['playerPos']->x === WIDTH - 1 && $_SESSION['playerPos']->y === HEIGHT - 1) {
        $response = ['solved' => true, 'maze' => $_SESSION['maze'], 'playerPos' => $_SESSION['playerPos']];
        resetGame();
    } else {
        $response = ['solved' => false, 'maze' => $_SESSION['maze'], 'playerPos' => $_SESSION['playerPos']];
    }

    echo json_encode($response);
    exit;
}

if (isset($_GET['new_game'])) {
    resetGame();
    echo json_encode(['solved' => false, 'maze' => $_SESSION['maze'], 'playerPos' => $_SESSION['playerPos']]);
    exit;
}

// function to reset the game state
function resetGame() {
    $_SESSION['maze'] = generateMaze();
    $_SESSION['playerPos'] = new Position(0, 0);
}

// function to validate the move
function isValidMove($playerPos, $move, $maze) {
    $newPos = clone $playerPos;

    switch ($move) {
        case 'up':
            $newPos->y--;
            break;
        case 'down':
            $newPos->y++;
            break;
        case 'left':
            $newPos->x--;
            break;
        case 'right':
            $newPos->x++;
            break;
    }

    // check boundaries and obstacles
    if ($newPos->x < 0 || $newPos->x >= WIDTH || $newPos->y < 0 || $newPos->y >= HEIGHT) {
        return false;
    }

    if ($maze[$newPos->y][$newPos->x] === 'X') {
        return false;
    }

    return true;
}

// function to update player position
function updatePosition($playerPos, $move) {
    switch ($move) {
        case 'up':
            $playerPos->y--;
            break;
        case 'down':
            $playerPos->y++;
            break;
        case 'left':
            $playerPos->x--;
            break;
        case 'right':
            $playerPos->x++;
            break;
    }
    return $playerPos;
}

// Function to generate a solvable maze
function generateMaze() {
    $maze = [];
    for ($y = 0; $y < HEIGHT; $y++) {
        for ($x = 0; $x < WIDTH; $x++) {
            $maze[$y][$x] = " "; // initialize empty space
        }
    }

    $maze[0][0] = "S";
    $maze[HEIGHT - 1][WIDTH - 1] = "G";

    // decide the #obstacles
    $numObstacles = rand(5, 10);
    for ($i = 0; $i < $numObstacles; $i++) {
        $x = rand(0, WIDTH - 1);
        $y = rand(0, HEIGHT - 1);
        if (($x === 0 && $y === 0) || ($x === WIDTH - 1 && $y === HEIGHT - 1) || $maze[$y][$x] === "X") {
            continue; // obstacles not on start or goal
        }
        $maze[$y][$x] = "X"; // place obstacle
    }

    // if maze is not solvable, regenerate
    if (!isSolvableMaze($maze)) {
        return generateMaze();
    }

    return $maze;
}

function isSolvableMaze($maze) {
    $visited = array_fill(0, HEIGHT, array_fill(0, WIDTH, false));
    return dfs(0, 0, $maze, $visited);
}

function dfs($x, $y, $maze, &$visited) {
    if ($x < 0 || $x >= WIDTH || $y < 0 || $y >= HEIGHT || $maze[$y][$x] === "X" || $visited[$y][$x]) {
        return false;
    }
    if ($x === WIDTH - 1 && $y === HEIGHT - 1) {
        return true;
    }

    $visited[$y][$x] = true; // Mark current cell as visited

    // Explore all possible directions
    if (dfs($x + 1, $y, $maze, $visited) || dfs($x - 1, $y, $maze, $visited) || dfs($x, $y + 1, $maze, $visited) || dfs($x, $y - 1, $maze, $visited)) {
        return true; // Path found
    }

    return false; // No path found
}
