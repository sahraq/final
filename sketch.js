let pet = {
  hunger: 100, // pet's hunger level
  happiness: 100, // pet's happiness level
  energy: 100, // pet's energy level
  isAlive: true, // indicates if the pet is alive
  causeOfDeath: '' // stores the cause of death if pet dies
};

let heartImg;
let isSmiling = false; // flag to track if pet is smiling
let hearts = []; // array to hold heart images when pet smiles
let foodItems = []; // array to hold food items
let petX, petY, petSize; // variables for pet's position and size
let leash, pillow; // clickable objects
let trampoline, trampolineVisible = false, petJumping = false, petJumpY = 0, jumpSpeed = -5; // trampoline and jumping variables
let backgroundImg, outsideImg, isOutside, inBed = false; // background and state variables

function preload() {
  // load images for the game
  appleImg = loadImage("apple.png");//apple image https://pngimg.com/image/12458
  burgerImg = loadImage("burger.png");//burger image https://freepngimg.com/download/burger/4-2-burger-png-file.png
  leashImg = loadImage("leash.png");//leash image https://pngimg.com/d/leash_PNG77.png
  pillowImg = loadImage("pillow.png");// pillow image https://purepng.com/photo/21443/objects-pillow
  backgroundImg = loadImage("background.jpg"); // default background image https://ifstudies.org/ifs-admin/resources/blog/poverty-w1700.jpg
  outsideImg = loadImage("outside.jpg"); // outside background image https://ar.inspiredpencil.com/pictures-2023/windows-green-hills-background
  bedroomImg = loadImage("bedroom.jpg"); // bedroom background image https://www.theoldish.com/wp-content/uploads/2022/04/iStock-1322833915.jpg
  hairImg = loadImage("hair.png"); // hair image https://www.pngmart.com/files/23/Emo-Hair-PNG-Isolated-Pic.png
  trampoline = loadImage("trampoline.png"); // trampoline image https://www.pngplay.com/wp-content/uploads/8/Trampoline-Transparent-PNG.png
  weeSound = loadSound("wee.mp3"); // sound for jumping https://www.myinstants.com/en/instant/yippie-88715/
  snoreSound = loadSound("snore.mp3"); // sound for sleeping https://www.myinstants.com/en/instant/funny-snoring-21355/
  chompSound = loadSound("chomp.mp3"); // sound for eating https://www.myinstants.com/en/instant/chomp-55139/
  iceCreamImg = loadImage("iceCream.png"); // ice cream image https://pngimg.com/uploads/ice_cream/ice_cream_PNG5105.png
  graveyardImg = loadImage("graveyard.jpg"); // graveyard image https://media.istockphoto.com/photos/empty-tombstone-picture-id504512069?k=6&m=504512069&s=612x612&w=0&h=QPf2ThF4xvoGu1XFDZjXTA1DZwpX3qTGY5iSbvjfMeE=
  heartImg = loadImage("heart.png"); // heart image https://pluspng.com/img-png/heart-png-heart-png-image-free-download-2555.png
}

function setup() {
  createCanvas(800, 600);

  petX = width / 2; // center the pet horizontally
  petY = height / 2; // center the pet vertically
  petSize = 200; // set pet size

  // initialize food items with position, image, and nutrition values
  foodItems.push(new Food(100, 450, appleImg, 10));
  foodItems.push(new Food(200, 450, burgerImg, 30));
  foodItems.push(new Food(150, 450, iceCreamImg, 5));

  // create clickable objects for leash, pillow, and trampoline
  leash = new ClickableObject(120, 150, leashImg, "leash");
  pillow = new ClickableObject(600, 150, pillowImg, "pillow");
  trampolineObject = new ClickableObject(width / 2 - 80, height / 2 + 50, trampoline, "trampoline");
}

function draw() {
  // display the background based on the pet's state
  if (isOutside) {
    image(outsideImg, 0, 0, width, height); // outside background
  } else if (inBed) {
    image(bedroomImg, 0, 0, width, height); // bedroom background
  } else {
    image(backgroundImg, 0, 0, width, height); // default background
  }

  if (pet.isAlive) {
    drawPet(); // draw the pet
    decreaseStats(); // decrease pet stats over time
    drawFoods(); // draw food items
    leash.display(); // display the leash object
    pillow.display(); // display the pillow object
  } else {
    gameOver(); // handle game over state
  }

  // display hearts if the pet is smiling
  if (isSmiling) {
    for (let i = 0; i < hearts.length; i++) {
      image(heartImg, hearts[i].x, hearts[i].y, 50, 50);
    }
  }

  // display trampoline and animate pet jump if visible
  if (trampolineVisible) {
    trampolineObject.display(); // display trampoline
    animatePetJump(); // handle pet jumping animation
  }
}

function drawPet() {
  // draw the pet's body
  fill(255, 204, 102); // pet body color
  ellipse(petX, petY + petJumpY, petSize, petSize * 0.8); // body shape

  // draw the pet's eyes
  fill(0); // eye color
  if (!pet.eyesClosed) {
    ellipse(petX - 40, petY - 30 + petJumpY, 20, 20); // left eye
    ellipse(petX + 40, petY - 30 + petJumpY, 20, 20); // right eye
  } else {
    // draw closed eyes if eyes are closed
    line(petX - 40, petY - 30 + petJumpY, petX - 20, petY - 30 + petJumpY); // left closed eye
    line(petX + 40, petY - 30 + petJumpY, petX + 20, petY - 30 + petJumpY); // right closed eye
  }

  // draw eye bags if energy is low
  if (pet.energy < 40) {
    noStroke();
    fill(150, 100, 50, 150); // color for eye bags
    arc(petX - 40, petY - 20 + petJumpY, 30, 15, 0, PI); // left eye bag
    arc(petX + 40, petY - 20 + petJumpY, 30, 15, 0, PI); // right eye bag
  }

  // draw hollow cheeks if hunger is low
  if (pet.hunger < 60) {
    stroke(0);
    fill(150, 100, 50, 150); // hollow cheek color
    arc(petX - 60, petY + 10 + petJumpY, 20, 40, -HALF_PI, HALF_PI); // left cheek
    arc(petX + 60, petY + 10 + petJumpY, 20, 40, HALF_PI, -HALF_PI); // right cheek

    stroke(0);
    strokeWeight(2);
    noFill();
    // draw worried eyebrows
    arc(petX - 40, petY - 50 + petJumpY, 30, 10, 0, PI); // left eyebrow
    arc(petX + 40, petY - 50 + petJumpY, 30, 10, 0, -PI); // right eyebrow
  }

  // draw the pet's mouth based on mood
  noFill();
  stroke(0);
  strokeWeight(3);

  let isFoodBeingDragged = foodItems.some(food => food.dragging); // check if food is being dragged

  if (isFoodBeingDragged) {
    fill(0); // mouth color
    ellipse(petX, petY + 30 + petJumpY, 80, 60); // open mouth
  } else if (pet.happiness > 60 && pet.energy > 60 && pet.hunger > 60) {
    arc(petX, petY + 30 + petJumpY, 80, 40, 0, PI); // happy mouth
    isSmiling = true; // pet is smiling
  } else if (pet.happiness > 30 && pet.energy > 30 && pet.hunger > 30) {
    line(petX - 20, petY + 30 + petJumpY, petX + 20, petY + 30 + petJumpY); // neutral mouth
    isSmiling = false; // pet is not smiling
  } else {
    arc(petX, petY + 50 + petJumpY, 80, 40, PI, TWO_PI); // sad mouth
  }

  // generate hearts if pet is smiling
  if (isSmiling && frameCount % 10 === 0) {
    hearts.push({x: petX + random(-130, 50), y: petY + random(-100, -150)}); // create heart
    if (hearts.length > 3) {
      hearts.shift(); // limit number of hearts
    }
  }

  // add emo hair to pet if happiness is low
  if (pet.happiness < 50) {
    image(hairImg, petX - 180, petY - 200 + petJumpY, 370, 370); // draw hair
  }
}

function drawFoods() {
  // display and handle all food items
  for (let food of foodItems) {
    food.display();
    food.drag();
    // check if food is being dragged over the pet
    if (food.isOverPet(petX, petY, petSize) && food.dragging) {
      pet.hunger = min(100, pet.hunger + food.nutrition); // increase pet's hunger when fed
      food.resetPosition(); // reset food's position after feeding
    }
  }
}

function decreaseStats() {
  // decrease pet's stats periodically
  if (frameCount % 60 === 0) {
    pet.hunger = max(0, pet.hunger - 1); // decrease hunger
    pet.happiness = max(0, pet.happiness - 1); // decrease happiness

    if (inBed) {
      pet.energy = min(100, pet.energy + 1); // increase energy while in bed
      pet.happiness = max(0, pet.happiness - 2.3); // decrease happiness faster when asleep
    } else {
      pet.energy = max(0, pet.energy - 1); // decrease energy when not in bed
    }

    // check for death conditions
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
  // display game over screen
  background(220, 20, 60);
  image(graveyardImg, 0, 0, width, height); // graveyard image
  fill(128);
  textSize(32);
  textAlign(CENTER, CENTER);
  text(
    "Here lies your innocent, neglected pet\n who died from " + pet.causeOfDeath + ".",
    width / 2,
    height / 2
  );
  trampolineVisible = false; // hide trampoline on game over
}

function animatePetJump() {
  // handle pet's jump animation
  if (petJumping) {
    petJumpY += jumpSpeed;
    weeSound.play(); // play jump sound
    if (petJumpY <= -50) {
      petJumping = false; // reset jump state
      petJumpY = 0; // reset jump height
      pet.hunger = max(0, pet.hunger - 2); // decrease hunger stat (increase hunger technically) faster while jumping
      pet.energy = max(0, pet.energy - 5); // decrease energy faster while jumping
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
    this.startX = x; // store initial x position
    this.startY = y; // store initial y position
  }

  display() {
    // display food image
    image(this.img, this.x, this.y, 50, 50);
  }

  drag() {
    // enable dragging of food
    if (this.dragging) {
      this.x = mouseX + this.offsetX;
      this.y = mouseY + this.offsetY;
    }
  }

  mousePressed() {
    // check if food is clicked
    if (mouseX > this.x && mouseX < this.x + 50 && mouseY > this.y && mouseY < this.y + 50) {
      this.dragging = true;
      this.offsetX = this.x - mouseX;
      this.offsetY = this.y - mouseY;
      chompSound.play(); // play sound when food is picked up
    }
  }

  mouseReleased() {
    // stop dragging
    this.dragging = false;
  }

  isOverPet(px, py, pSize) {
    // check if food is over the pet
    let d = dist(this.x + 25, this.y + 25, px, py);
    return d < pSize / 2;
  }

  resetPosition() {
    // reset food to its original position
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
    this.type = type; // type determines object behavior
  }

  display() {
    // display object image
    image(this.img, this.x, this.y, 150, 150);
  }

  mousePressed() {
    // check if object is clicked and perform its action
    if (mouseX > this.x && mouseX < this.x + 150 && mouseY > this.y && mouseY < this.y + 150) {
      if (this.type === "pillow") {
        pet.energy = min(100, pet.energy + 10); // boost energy with the pillow
        snoreSound.play(); // play snore sound
        inBed = true; // pet is in bed
        isOutside = false; // reset to indoor background
        trampolineVisible = false; // hide trampoline
        pet.eyesClosed = true; // close pet's eyes
      } else if (this.type === "leash") {
        isOutside = true; // change background to outdoor
        inBed = false; // pet is not in bed
        trampolineVisible = true; // show trampoline
        pet.eyesClosed = false; // open pet's eyes
      } else if (this.type === "trampoline") {
        pet.happiness = min(100, pet.happiness + 10); // boost happiness with trampoline
        petJumping = true; // enable jumping
      }
    }
  }
}

function mousePressed() {
  // handle mouse press events for all objects
  for (let food of foodItems) {
    food.mousePressed();
  }
  leash.mousePressed();
  pillow.mousePressed();
  trampolineObject.mousePressed();
}

function mouseReleased() {
  // handle mouse release for food items
  for (let food of foodItems) {
    food.mouseReleased();
  }
}
