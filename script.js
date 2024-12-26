// Get the canvas and context
const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

// Player variables
const player = {
  x: 50,               // X position of the player
  y: 500,              // Y position of the player (on the ground)
  radius: 25,          // Radius of the player (circle shape)
  velocityX: 0,        // Horizontal velocity (no vertical velocity as jumping is removed)
  onGround: true       // The player is on the ground
};

// Game mechanics variables
const gravity = 0.5;    // Gravity force pulling the player down
let gameOver = false;   // Flag to check if the game is over
let score = 0;          // Player score
let obstacles = [];     // Array to store obstacles
const obstacleSpeed = 4; // Speed of obstacles falling down

// Sky background movement variables
let skyX = 0;           // X position for the sky background
let skySpeed = 1;       // Speed of the moving sky background

// Create and add obstacles to the game
function createObstacle() {
  const obstacleWidth = 500;  // Random width for the obstacle
  const obstacleHeight =40;  // Random height for the obstacle
  const obstacleX = Math.random() * (canvas.width - obstacleWidth); // Random horizontal position
  const obstacleY = -obstacleHeight;  // Start the obstacle off the screen (top)

  obstacles.push({
    x: obstacleX,
    y: obstacleY,
    width: obstacleWidth,
    height: obstacleHeight
  });
}

// Update the obstacles' position and check for collisions
function updateObstacles() {
  obstacles.forEach((obstacle, index) => {
    obstacle.y += obstacleSpeed; // Move obstacles down

    // Remove obstacles that go off the screen
    if (obstacle.y > canvas.height) {
      obstacles.splice(index, 1); // Remove the obstacle from the array
    }

    // Collision detection with player (Game Over if hit)
    if (player.x < obstacle.x + obstacle.width &&
      player.x + player.radius * 2 > obstacle.x &&
      player.y < obstacle.y + obstacle.height &&
      player.y + player.radius * 2 > obstacle.y) {
      gameOver = true; // End the game if collision occurs
    }
  });
}

// Draw the obstacles on the canvas
function drawObstacles() {
  context.fillStyle = 'red'; // Obstacle color
  obstacles.forEach(obstacle => {
    context.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height); // Draw obstacle
  });
}

// Move the player (only horizontally since no jumping)
function movePlayer() {
  // Move the player based on keyboard input (left or right)
  player.x += player.velocityX;

  // Ensure the player doesn't move off the screen
  if (player.x < 0) player.x = 0;
  if (player.x + player.radius * 2 > canvas.width) player.x = canvas.width - player.radius * 2;
}

// Draw the player (as a circle)
function drawPlayer() {
  context.fillStyle = 'blue';  // Player color
  context.beginPath();         // Begin drawing the circle
  context.arc(player.x, player.y, player.radius, 0, Math.PI * 2); // Draw circle
  context.fill();              // Fill the circle with color
}

// Handle player input (left and right movement)
function handleInput() {
  if (keyPressed['ArrowRight']) {
    player.velocityX = 7;  // Move player right
  } else if (keyPressed['ArrowLeft']) {
    player.velocityX = -7; // Move player left
  } else {
    player.velocityX = 0;  // Stop horizontal movement if no key is pressed
  }
}

// Track key press states (left and right movement)
let keyPressed = {};
document.addEventListener('keydown', (event) => {
  keyPressed[event.key] = true;
});
document.addEventListener('keyup', (event) => {
  keyPressed[event.key] = false;
});

// Draw the moving sky background
function drawSky() {
  skyX -= skySpeed; // Move the sky to the left

  // Draw two parts of the sky to create continuous scrolling
  context.fillStyle = 'skyblue'; // Sky color
  context.fillRect(skyX, 0, canvas.width, canvas.height); // First part of sky

  // Reset sky position for continuous effect
  if (skyX <= -canvas.width) {
    skyX = 0; // Reset position when it goes off the screen
  }

  // Draw the second part of the sky
  context.fillRect(skyX + canvas.width, 0, canvas.width, canvas.height);
}

// Draw the score at the bottom of the screen
function drawScore() {
  context.fillStyle = 'black'; // Score text color
  context.font = '20px Arial'; // Font for score
  context.textAlign = 'center'; // Center the score text
  context.fillText('Score: ' + score, canvas.width / 2, canvas.height - 10); // Display score
}

// Main game loop to update and render everything
function gameLoop() {
  if (gameOver) {
    alert("Game Over! Final Score: " + score);
    return; // Stop the game if it's over
  }

  context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas for the new frame

  drawSky();           // Draw the moving sky
  handleInput();       // Handle player input (left/right movement)
  movePlayer();        // Update the player's position
  drawPlayer();        // Draw the player

  drawObstacles();     // Draw obstacles
  updateObstacles();   // Update obstacles and check for collisions

  drawScore();         // Draw the score

  score++;  // Increase score (can be based on time or obstacles passed)

  requestAnimationFrame(gameLoop);  // Continue the game loop
}

// Create a new obstacle every 2 seconds
setInterval(createObstacle, 2000);  // Add an obstacle every 2 seconds

// Start the game loop
gameLoop();
