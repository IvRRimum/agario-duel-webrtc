// Canvas and score parameters
var canvas = document.getElementById("canvas");
var score = document.getElementById("score");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//  Current player parameters
var x = 0;
var y = 0;
var XDiff = 0;
var YDiff = 0;
var xBall = canvas.width-canvas.width/2;
var yBall = canvas.height-canvas.height/2;
var size = 15; // Default size in px

// Food parameters
var foodCoordinates = [];
var maxFoodCount = 10;
var foodColors = ["#59ed49", "#f76565", "#f9f44d", "#f7d042"];

var isSuperFoodSpawned = false;
var superFoods = {"purple": {size: 15, color: "purple", "action": purpleSuperFoodAction}};

// Enemy parameters
xEnemy = 15;
yEnemy = 15;
xEDif = 0;
yEDif = 0;

function drawBall(x, y) {
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI*2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.strokeStyle = "#0578c4";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.closePath();
}

function showCoordinates(e) {
  x = e.clientX;
  y = e.clientY;
  var Xmon, Ymon;
  var XeMon, YeMon;

  // Current player
  if (x > xBall) {
    Xmon = x - xBall;
  } else {
    Xmon = xBall - x;
  }
  if (y > yBall) {
    Ymon = y - yBall;
  } else {
    Ymon = yBall - y;
  }

  if (Xmon > Ymon) {
    XDiff = 1;
    YDiff = Ymon/Xmon; 
  }
  if (Xmon < Ymon) {
    XDiff = Xmon/Ymon;
    YDiff = 1;
  }

  // enemy follows the boall not the cursor
  if (xBall > xEnemy) {
    XeMon = xBall - xEnemy;
  } else {
    XeMon = xEnemy - xBall;
  }
  if (yBall > yEnemy) {
    YeMon = yBall - yEnemy;
  } else {
    YeMon = yEnemy - yBall;
  }

  if (XeMon > YeMon) {
    xEDif = 0.2;
    yEDif = (YeMon/XeMon)/5; 
  }
  if (XeMon < YeMon) {
    xEDif = (XeMon/YeMon)/5;
    yEDif = 0.2;
  }
}

function followCursor()  {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  var cailedXBall = Math.ceil(xBall);
  var cailedYBall = Math.ceil(yBall);

  var cailedXEnemy = Math.ceil(xEnemy);
  var cailedYEnemy = Math.ceil(yEnemy);

  // Current player
  if (xBall < x) {
    xBall = xBall+XDiff;
  }

  if (xBall > x) {
    xBall = xBall-XDiff;
  }

  if (yBall < y) {
    yBall = yBall+YDiff;
  }

  if (yBall > y) {
    yBall = yBall-YDiff;
  }

  // enemy 
  if (xEnemy < xBall) {
    xEnemy = xEnemy+xEDif;
  }

  if (xEnemy > xBall) {
    xEnemy = xEnemy-xEDif;
  }

  if (yEnemy < yBall) {
    yEnemy = yEnemy+yEDif;
  }

  if (yEnemy > yBall) {
    yEnemy = yEnemy-yEDif;
  }

  drawEnemy(xEnemy, yEnemy);
  drawBall(xBall, yBall);

  foodCoordinates.forEach(function(foodCoordinate, index) {
    if (cailedXBall > foodCoordinate.x-size && cailedXBall < foodCoordinate.x+size && cailedYBall > foodCoordinate.y-size && cailedYBall < foodCoordinate.y+size) {
      score.innerHTML = parseInt(score.innerHTML)+1;
      foodCoordinates.splice(index, 1);
      size = size+1;

      if (foodCoordinate.superFood) {
        foodCoordinate.superFoodAction();
        isSuperFoodSpawned = false;
      }
    }

    drawFood(foodCoordinate.x, foodCoordinate.y, foodCoordinate.color);
  });

  if (cailedXBall > cailedXEnemy-size && cailedXBall < cailedXEnemy+size && cailedYBall > cailedYEnemy-size && cailedYBall < cailedYEnemy+size) {
    console.log("Game over mate!");
  }
}

function drawFood(xFood, yFood, color) {
  ctx.beginPath();
  ctx.arc(xFood, yFood, 10, 0, Math.PI*2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

function addFood() {
  var xFood, yFood;

  if (maxFoodCount >= foodCoordinates.length) {
    xFood = Math.floor(Math.random()*window.innerWidth);
    yFood = Math.floor(Math.random()*window.innerHeight);
    foodCoordinates.push({"x": xFood, "y": yFood, "color": foodColors[Math.floor(Math.random()*foodColors.length)]});
  } else {
    if (!isSuperFoodSpawned) {
      xFood = Math.floor(Math.random()*window.innerWidth);
      yFood = Math.floor(Math.random()*window.innerHeight);
      foodCoordinates.push({"x": xFood, "y": yFood, "color": superFoods.purple.color, "superFood": true, "superFoodAction": superFoods.purple.action});
      isSuperFoodSpawned = true;
    }
  }
}

function drawEnemy(xEnemy, yEnemy) {
  var enemyImage = document.createElement("img");
  enemyImage.src = "./enemy.png";
  ctx.drawImage(enemyImage, xEnemy, yEnemy);
}

// Purple Foood Mass Boost +10
function purpleSuperFoodAction() {
  size = size + 20;
}

drawBall(xBall, yBall);
drawEnemy(0, 0);
setInterval(followCursor, 5);
setInterval(addFood, 1000);
