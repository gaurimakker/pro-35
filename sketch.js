var dog, database;
var foodS, foodStock;
var dogImg, dogImg1;
var fedTime, lastFed;
var foodObj;
var feed, addFood;

function preload()
{
dogImg=loadImage("images/dogImg.png");
dogImg1=loadImage("images/dogImg1.png");
}

function setup() {
  createCanvas(500, 500);
  foodObj=new Food();
  
  database=firebase.database();

  dog=createSprite(250,250,20,50);
  dog.addImage("dog", dogImg);
  dog.scale=0.2;

  foodStock=database.ref('Food');
  foodStock.on("value", readStock);

  feed=createButton("Feed The Dog");
  feed.position(600,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(700,95);
  addFood.mousePressed(addFoods);

  
}


function draw() {  
  background(46,139,87);

  foodObj.display();

  fedTime=database.ref('FeedTime');
  fedTime.on("value", function(data){
    lastFed=data.val();
  });

fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("last feed: "+ lastFed%12 +" PM", 350,30);
  }else if(lastFed==0){
    text("LAST FEED: 12 AM", 350, 30)
  }else{
    text("last feed: "+ lastFed +" AM",350,30);
  }

  drawSprites();
}

function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog(){
  dog.addImage(dogImg1);

  if(foodObj.getFoodStock()<=0){
    foodObj.updateFoodStock(foodObj.getFoodStock()*0)
  }else{
    foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  }

  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

