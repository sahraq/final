let pet = {
  hunger: 100,
  happiness: 100,
  energy: 100,
  isAlive: true,
};

let foodItems = [];
let petX, petY, petSize;
let isPlaying = false;
let playCounter = 0;

let playButton, restButton;

function preload() {
  // food images
  appleImg = loadImage("apple.png");
  burgerImg = loadImage("burger.png");
 backgroundImg = loadImage("background.jpg"); // Replace with your image file
}

function setup() {
  createCanvas(800, 600);

  // Pet properties
  petX = width / 2;
  petY = height / 2;
  petSize = 200;

  // Food items
  foodItems.push(new Food(100, 450, appleImg, 10));
  foodItems.push(new Food(200, 450, burgerImg, 20));

  // Buttons
  playButton = createButton("play");
  playButton.position(850, 200);
  styleButton(playButton, "#2ecc71");
  playButton.mousePressed(startPlay);

  restButton = createButton("rest");
  restButton.position(850, 300);
  styleButton(restButton, "#3498db");
  restButton.mousePressed(() => boostEnergy());
}

function draw() {
  background(135, 206, 235);
  drawBackground();

  if (pet.isAlive) {
    drawPet();
    drawStatsPanel();
    decreaseStats();
    drawFoods();

    if (isPlaying) {
      displayPlayInstructions();
    }
  } else {
    gameOver();
  }
}

function drawBackground() {
  
  image(backgroundImg, 0, 0, width, height);

}

function drawPet() {
  // body
  fill(255, 204, 102);
  ellipse(petX, petY, petSize, petSize * 0.8);

  // eyes
  fill(0);
  ellipse(petX - 40, petY - 30, 20, 20);
  ellipse(petX + 40, petY - 30, 20, 20);

  // mouth (changes on mood)
  noFill();
  stroke(0);
  strokeWeight(3);
  if (pet.happiness > 60) {
    arc(petX, petY + 30, 80, 40, 0, PI); // happy
  } else if (pet.happiness > 30) {
    line(petX - 20, petY + 30, petX + 20, petY + 30); // neutral
  } else {
    arc(petX, petY + 50, 80, 40, PI, TWO_PI); // sad
  }

  // reaction animations
  if (isPlaying || frameCount % 60 < 10) {
    noFill();
    stroke(255, 204, 0, 150);
    ellipse(petX, petY, petSize + 10);
  }
}

function drawStatsPanel() {
  fill(255);
  noStroke();
  rect(50, 50, 400, 150, 20);

  fill(0);
  textSize(20);
  textAlign(LEFT, CENTER);
  text("tummy", 70, 80);
  text("happiness", 70, 120);
  text("energy", 70, 160);

  // hunger bar
  fill(255, 80, 80);
  rect(200, 70, pet.hunger * 2, 20, 5);

  // happiness bar
  fill(80, 255, 80);
  rect(200, 110, pet.happiness * 2, 20, 5);

  // energy bar
  fill(80, 80, 255);
  rect(200, 150, pet.energy * 2, 20, 5);
}

function drawFoods() {
  for (let food of foodItems) {
    food.display();
    food.drag();
    if (food.isOverPet(petX, petY, petSize) && food.dragging) {
      pet.hunger = min(100, pet.hunger + food.nutrition);
      food.resetPosition();
    }
  }
}

function decreaseStats() {
  if (!isPlaying && frameCount % 20 === 0) {
    pet.hunger = max(0, pet.hunger - 1);
    pet.happiness = max(0, pet.happiness - 1);
    pet.energy = max(0, pet.energy - 1);

    if (pet.hunger === 0 || pet.happiness === 0 || pet.energy === 0) {
      pet.isAlive = false;
    }
  }
}

function startPlay() {
  if (!isPlaying) {
    isPlaying = true;
    playCounter = 0;
    setTimeout(endPlay, 1000);
  }
}

function endPlay() {
  isPlaying = false;
  pet.happiness = min(100, pet.happiness + playCounter*4);
}

function displayPlayInstructions() {
  fill(0);
  textSize(18);
  textAlign(CENTER, CENTER);
  text("Press SPACE rapidly to play with your pet!", width / 2, height - 160);
}

function gameOver() {
  background(220, 20, 60);
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("Game Over\nYour pet died and it's your fault :(", width / 2, height / 2);

  // Hide the buttons
  playButton.hide();
  restButton.hide();
}
function boostEnergy() {
  pet.energy = min(100, pet.energy + 20);
}

class Food {
  constructor(x, y, img, nutrition) {
    this.x = x;
    this.y = y;
    this.img = img;
    this.nutrition = nutrition;
    this.dragging = false;
    this.offsetX = 0;
    this.offsetY = 0;
    this.startX = x;
    this.startY = y;
  }

  display() {
    image(this.img, this.x, this.y, 50, 50);
  }

  drag() {
    if (this.dragging) {
      this.x = mouseX + this.offsetX;
      this.y = mouseY + this.offsetY;
    }
  }

  mousePressed() {
    if (mouseX > this.x && mouseX < this.x + 50 && mouseY > this.y && mouseY < this.y + 50) {
      this.dragging = true;
      this.offsetX = this.x - mouseX;
      this.offsetY = this.y - mouseY;
    }
  }

  mouseReleased() {
    this.dragging = false;
  }

  isOverPet(px, py, pSize) {
    let d = dist(this.x + 25, this.y + 25, px, py);
    return d < pSize / 2;
  }

  resetPosition() {
    this.x = this.startX;
    this.y = this.startY;
    this.dragging = false;
  }
}

function mousePressed() {
  for (let food of foodItems) {
    food.mousePressed();
  }
}

function mouseReleased() {
  for (let food of foodItems) {
    food.mouseReleased();
  }
}

function keyPressed() {
  if (isPlaying && keyCode === 32) {
    playCounter++;
  }
}

function styleButton(button, color) {
  button.style("background-color", color);
  button.style("color", "#fff");
  button.style("font-size", "20px");
  button.style("padding", "15px 30px");
  button.style("border-radius", "15px");
  button.style("border", "none");
  button.style("box-shadow", "0px 4px 8px rgba(0, 0, 0, 0.2)");
  button.style("cursor", "pointer");
  button.mouseOver(() => button.style("box-shadow", "0px 6px 12px rgba(0, 0, 0, 0.4)"));
  button.mouseOut(() => button.style("box-shadow", "0px 4px 8px rgba(0, 0, 0, 0.2)"));
}
