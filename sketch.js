let pet = {
  hunger: 100,
  happiness: 100,
  energy: 100,
  isAlive: true,
  causeOfDeath: ''
};

let foodItems = [];
let petX, petY, petSize;
let leash, pillow;

function preload() {
  // images
  appleImg = loadImage("apple.png");
  burgerImg = loadImage("burger.png");
  leashImg = loadImage("leash.png"); 
  pillowImg = loadImage("pillow.png"); 
  backgroundImg = loadImage("background.jpg"); 
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

  // Draggable objects (leash and pillow)
  leash = new DraggableObject(50, 50, leashImg, "leash");
  pillow = new DraggableObject(750, 50, pillowImg, "pillow");
}

function draw() {
  background(135, 206, 235);
  drawBackground();

  if (pet.isAlive) {
    drawPet();
    decreaseStats();
    drawFoods();
    leash.display();
    pillow.display();
    leash.drag();
    pillow.drag();
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
  if (frameCount % 20 === 0) {
    pet.hunger = max(0, pet.hunger - 1);
    pet.happiness = max(0, pet.happiness - 1);
    pet.energy = max(0, pet.energy - 1);

    if (pet.hunger === 0 && pet.causeOfDeath === '') {
      pet.causeOfDeath = 'hunger';
      pet.isAlive = false;
    }
    if (pet.happiness === 0 && pet.causeOfDeath === '') {
      pet.causeOfDeath = 'sadness';
      pet.isAlive = false;
    }
    if (pet.energy === 0 && pet.causeOfDeath === '') {
      pet.causeOfDeath = 'fatigue';
      pet.isAlive = false;
    }
  }
}

function gameOver() {
  background(220, 20, 60);
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("Game Over\nYour pet died from " + pet.causeOfDeath + ".", width / 2, height / 2);
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

class DraggableObject {
  constructor(x, y, img, type) {
    this.x = x;
    this.y = y;
    this.img = img;
    this.type = type;
    this.dragging = false;
    this.offsetX = 0;
    this.offsetY = 0;
  }

  display() {
    image(this.img, this.x, this.y, 50, 50);
  }

  drag() {
    if (this.dragging) {
      this.x = mouseX + this.offsetX;
      this.y = mouseY + this.offsetY;

      // leash or pillow is dragged onto the pet
      if (this.isOverPet(petX, petY, petSize)) {
        if (this.type === "pillow") {
          pet.energy = min(100, pet.energy + 10); // boost energy with the pillow
        } else if (this.type === "leash") {
          pet.happiness = min(100, pet.happiness + 10); // boost happiness with the leash
        }
      }
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
}

function mousePressed() {
  // for food items and draggable objects
  for (let food of foodItems) {
    food.mousePressed();
  }
  leash.mousePressed();
  pillow.mousePressed();
}

function mouseReleased() {
  for (let food of foodItems) {
    food.mouseReleased();
  }
  leash.mouseReleased();
  pillow.mouseReleased();
}
