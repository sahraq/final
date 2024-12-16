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
let trampoline, trampolineVisible = false, petJumping = false, petJumpY = 0, jumpSpeed = -5;
let backgroundImg, outsideImg, isOutside, inBed = false;

function preload() {
  // load images
  appleImg = loadImage("apple.png");
  burgerImg = loadImage("burger.png");
  leashImg = loadImage("leash.png");
  pillowImg = loadImage("pillow.png");
  backgroundImg = loadImage("background.jpg"); 
  outsideImg = loadImage("outside.jpg"); // 
  bedroomImg = loadImage("bedroom.jpg"); // 
  
  hairImg = loadImage("hair.png");
  trampoline = loadImage("trampoline.png"); 
   sadSong = loadSound("sad.mp3");
  weeSound=
loadSound("wee.mp3");
snoreSound= loadSound("snore.mp3");
  chompSound= loadSound ("chomp.mp3")
}

function setup() {
  createCanvas(800, 600);

  petX = width / 2;
  petY = height / 2;
  petSize = 200;

  // food items
  foodItems.push(new Food(100, 450, appleImg, 10));
  foodItems.push(new Food(200, 450, burgerImg, 20));

  // clickable objects (leash and pillow)
  leash = new ClickableObject(50, 50, leashImg, "leash");
  pillow = new ClickableObject(750, 50, pillowImg, "pillow");
  trampolineObject = new ClickableObject(width / 2 - 100, height / 2 + 150, trampoline, "trampoline");
}

function draw() {
  if (isOutside) {
    image(outsideImg, 0, 0, width, height); //outside background
  } else if(inBed) {
    image(bedroomImg, 0, 0, width, height); // bedroom background
  }else {
    image(backgroundImg, 0, 0, width, height); //default background
  
  }

  if (pet.isAlive) {
    drawPet();
    decreaseStats();
    drawFoods();
    leash.display();
    pillow.display();
    
  } else {
    gameOver();
  }

  // draw trampoline if outside and make pet jump
  if (trampolineVisible) {
    trampolineObject.display();
    animatePetJump();
  }
}

function drawPet() {
  // body
  fill(255, 204, 102);
  ellipse(petX, petY + petJumpY, petSize, petSize * 0.8);

  // eyes
  fill(0);
  if (!pet.eyesClosed) {
    ellipse(petX - 40, petY - 30 + petJumpY, 20, 20);
    ellipse(petX + 40, petY - 30 + petJumpY, 20, 20);
  } else {
    // draw closed eyes 
    line(petX - 40, petY - 30 + petJumpY, petX - 20, petY - 30 + petJumpY);
    line(petX + 40, petY - 30 + petJumpY, petX + 20, petY - 30 + petJumpY);
  }

  // eye bags if energy is low
  if (pet.energy < 40) {
    noStroke();
    fill(150, 100, 50, 150); // hollow color
    arc(petX - 40, petY - 20 + petJumpY, 30, 15, 0, PI); // left eye bag
    arc(petX + 40, petY - 20 + petJumpY, 30, 15, 0, PI); // right eye bag
  }

  if (pet.hunger < 60) {
    stroke(0);
    fill(150, 100, 50, 150); // hollow color
    arc(petX - 60, petY + 10 + petJumpY, 20, 40, -HALF_PI, HALF_PI); // left hollow cheek
    arc(petX + 60, petY + 10 + petJumpY, 20, 40, HALF_PI, -HALF_PI); // right hollow cheek

    stroke(0);
    strokeWeight(2);
    noFill();
    // worried eyebrows
    arc(petX - 40, petY - 50 + petJumpY, 30, 10, 0, PI); // left eyebrow
    arc(petX + 40, petY - 50 + petJumpY, 30, 10, 0, -PI); // right eyebrow
  }

  // Mouth
  noFill();
  stroke(0);
  strokeWeight(3);

  // check if any food is being dragged and open mouth
  let isFoodBeingDragged = foodItems.some(food => food.dragging);

  if (isFoodBeingDragged) {
    
    fill(0)
    // O-shaped mouth when food is being dragged
    ellipse(petX, petY + 30 + petJumpY, 80, 60); // 
  } else if (pet.happiness > 60 && pet.energy > 60 && pet.hunger > 60) {
    // happy
    arc(petX, petY + 30 + petJumpY, 80, 40, 0, PI);
  } else if (pet.happiness > 30 && pet.energy > 30 && pet.hunger > 30) {
    // neutral
    line(petX - 20, petY + 30 + petJumpY, petX + 20, petY + 30 + petJumpY);
  } else {
    // sad
    arc(petX, petY + 50 + petJumpY, 80, 40, PI, TWO_PI);
  }

  if (pet.happiness <50) {
    image(hairImg, petX - 180, petY - 200 + petJumpY, 370, 370);
  
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
  if (frameCount % 60 === 0) {
    pet.hunger = max(0, pet.hunger - 1);
    pet.happiness = max(0, pet.happiness - 1);

    //increase energy while pet is in bed
    if (inBed) {
      pet.energy = min(100, pet.energy + 1); // 
    } else {
      pet.energy = max(0, pet.energy - 1); // decrease energy outside the bed
    }

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
  }}

function gameOver() {
  background(220, 20, 60);
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("Game Over\nYour pet died from " + pet.causeOfDeath + ".", width / 2, height / 2);
  trampolineVisible = false;
}

function animatePetJump() {
   if (petJumping) {
    petJumpY += jumpSpeed;
    weeSound.play();
    if (petJumpY <= -50) {
      petJumping = false;
      petJumpY = 0;
    }
  }
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
      chompSound.play();
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

class ClickableObject {
  constructor(x, y, img, type) {
    this.x = x;
    this.y = y;
    this.img = img;
    this.type = type;
  }

  display() {
    image(this.img, this.x, this.y, 50, 50);
  }

  mousePressed() {
    if (mouseX > this.x && mouseX < this.x + 50 && mouseY > this.y && mouseY < this.y + 50) {
      if (this.type === "pillow") {
        pet.energy = min(100, pet.energy + 10); // boost energy with the pillow
        snoreSound.play();
        inBed = true
        isOutside = false; // reset to the original background
        trampolineVisible = false; // Make trampoline visible
         pet.eyesClosed = true; // close the eyes when the pillow is clicked
       
      } else if (this.type === "leash") {
        isOutside = true; // change background to outside
        inBed= false
        trampolineVisible = true; // Make trampoline visible
         pet.eyesClosed = false; // reopen eyes
      } else if (this.type === "trampoline") {
        pet.happiness = min(100, pet.happiness + 10); 
        petJumping = true;// boost happiness with trampoline
      }
    }
  }
}

function mousePressed() {
  for (let food of foodItems) {
    food.mousePressed();
  }
  leash.mousePressed();
  pillow.mousePressed();
  trampolineObject.mousePressed();
}

function mouseReleased() {
  for (let food of foodItems) {
    food.mouseReleased();
  }
}
