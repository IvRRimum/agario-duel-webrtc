var canvas = document.getElementById("canvas");
var score = document.getElementById("score");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var x = 0;
var y = 0;
var XDiff = 0;
var YDiff = 0;
var xBall = canvas.width-canvas.width/2;
var yBall = canvas.height-canvas.height/2;
var foodCoordinates = [];
var maxFoodCount = 10;
var size = 15;

var foodColors = ["#59ed49", "#f76565", "#f9f44d", "#f7d042"];

function drawBall(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function showCoordinates(e) {
  x = e.clientX;
  y = e.clientY;
  var Xmon, Ymon;

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
}

function followCursor()  {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

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

  drawBall(xBall, yBall);

  foodCoordinates.forEach(function(foodCoordinate, index) {
    var cailedXBall = Math.ceil(xBall);
    var cailedYBall = Math.ceil(yBall);

    if (cailedXBall > foodCoordinate.x-size && cailedXBall < foodCoordinate.x+size && cailedYBall > foodCoordinate.y-size && cailedYBall < foodCoordinate.y+size) {
      score.innerHTML = parseInt(score.innerHTML)+1;
      foodCoordinates.splice(index, 1);
      size = size+1;
    }

    drawFood(foodCoordinate.x, foodCoordinate.y, foodCoordinate.color);
  });
}

function drawFood(xFood, yFood, color) {
  ctx.beginPath();
  ctx.arc(xFood, yFood, 10, 0, Math.PI*2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

function addFood() {
  if (maxFoodCount >= foodCoordinates.length) {
    var xFood = Math.floor(Math.random()*window.innerWidth);
    var yFood = Math.floor(Math.random()*window.innerHeight);
    foodCoordinates.push({"x": xFood, "y": yFood, "color": foodColors[Math.floor(Math.random()*foodColors.length)]});
  }
}

drawBall(xBall, yBall);
setInterval(followCursor, 5);
setInterval(addFood, 1000);
