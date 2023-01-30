let intervalId;
let elapsedSeconds
function startTimer() {
    let startTime = new Date();
    intervalId = setInterval(function(){
        let currentTime = new Date();
        let elapsedTime = currentTime - startTime;
        let elapsedTimeInSeconds = Math.floor(elapsedTime / 1000);
        let elapsedMinutes = Math.floor(elapsedTimeInSeconds / 60);
        elapsedSeconds = elapsedTimeInSeconds % 60;
        document.getElementById("elapsed-time").innerHTML = elapsedMinutes + " minutes " + elapsedSeconds + " seconds";
        if (checkCars()) {
            console.log("checkCars is true");
            clearInterval(intervalId);
            submitScore();
            showLeaderboard();
        }       
    }, 1000);
}
function stopTimer() {
    clearInterval(intervalId);
    this.endTime = new Date();
    this.elapsedTime = this.endTime - this.startTime;
    return this.elapsedTime;
}
function resetAll() {
    location.reload();
}

startTimer();

const carCanvas=document.getElementById("carCanvas");
carCanvas.width=200;
const networkCanvas=document.getElementById("networkCanvas");
networkCanvas.width=300;
const numberOfCarSelect = document.getElementById("numberOfCar");
const mutationRatioSelect = document.getElementById("mutationRatio");
const numberOfTrafficSelect = document.getElementById("numberOfTraffic");

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road=new Road(carCanvas.width/2,carCanvas.width*0.9);

let N=200;//this is the multiple different blue car possibilities
let M = 200;//amount of traffic
let mutationRatio = 0.1;
mutationRatioSelect.value = mutationRatio;
numberOfCarSelect.value = N;
numberOfTrafficSelect.value = M;


if (localStorage.getItem("numberOfCar")) {
    N = Number(localStorage.getItem("numberOfCar"));
    numberOfCarSelect.value = N;
}

if (localStorage.getItem("numberOfTraffic")) {
    M = Number(localStorage.getItem("numberOfTraffic"));
    numberOfTrafficSelect.value = M;
}

if (localStorage.getItem("mutationRatio")) {
    mutationRatio = Number(localStorage.getItem("mutationRatio"));
    mutationRatioSelect.value = mutationRatio;
}

const cars = generateCars(N);
let bestCar=cars[0];
if(localStorage.getItem("bestBrain")){
    for(let i=0;i<cars.length;i++){
        cars[i].brain=JSON.parse(
            localStorage.getItem("bestBrain"));
        //The first car (best car) will remain the same, but the other ones will be mutated
        if(i!=0){
            NeuralNetwork.mutate(cars[i].brain, mutationRatio);
        }
    }
}

//Writing a function to generate traffic automatically (not hardcoding the cars)
const traffic = [];
for (let i = 0; i < M; i++) {
    //Math.random() * (max - min) + min
    //constructor(x,y,width,height,controlType,maxSpeed=3,color="blue")
    let x = Math.floor(Math.random() * 2.5);
    let y = Math.random() * (-100 +2000) + (-2000);
    let carspeed = Math.random() * (2.9 - 0.5) + (0.5);
    car = new Car(road.getLaneCenter(x), y, 30, 50,"DUMMY",carspeed, getRandomColor());
    addCarToArray(car);
}


function addCarToArray(car) {
    let good = true;
    for (let existingCar of traffic) {
      // Compare x and y values of existingCar to those of new car
      let xDiff = Math.abs(existingCar.x - car.x);
      let yDiff = Math.abs(existingCar.y - car.y);
      // If the x and y values are too similar, return without adding car to array
      if (xDiff >= 0 && yDiff < 60) {
        good = false;
      }
    }
    //first spawn element
    element = new Car(road.getLaneCenter(1),100,30,50,"DUMMY");
    let xDiff2 = Math.abs(element.x - car.x);
    let yDiff2 = Math.abs(element.y - car.y);
    if (xDiff2 <= 0 && yDiff2 < 90){
        good = false;
    }
    // If no similar cars are found, add new car to array
    if (good){
        traffic.push(car);
    }
    else{
        console.log("no")
    }
}

animate();

function checkCars() {
    for (var i = 0; i < N*0.9; i++) {
        if (!cars[i].damaged) {
            console.log("best car dead");
          return; // exit function if any car is not damaged
        }
      }
      // all(90%) of cars are damaged, stop the timer
      return true;
      clearInterval(intervalId);
}

function save(){
    localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function discard(){
    localStorage.removeItem("bestBrain");
}

function setNumberOfCar(event) {
    localStorage.setItem("numberOfCar", event.target.value);
}

function setNumberOfTraffic(event) {
    localStorage.setItem("numberOfTraffic", event.target.value);
}

function setMutationRatio(event) {
    localStorage.setItem("mutationRatio", event.target.value);
}

function generateCars(N){
    const cars=[];
    for(let i=1;i<=N;i++){
        cars.push(new Car(road.getLaneCenter(1),100,30,50,"AI"));
    }
    return cars;
}

//___________SCOREBOARD______________
//work in progress for scoreboard

function getCurrentScore(M) {
    score = M*elapsedSeconds;
    console.log(score);
    return score;
}
function addScoreToLeaderboard(name, score, date) {
    var leaderboard = document.getElementById("leaderboardTable");
    var newRow = leaderboard.insertRow(-1);
    var nameCell = newRow.insertCell(0);
    var scoreCell = newRow.insertCell(1);
    var dateCell = newRow.insertCell(2);
    nameCell.innerHTML = name;
    scoreCell.innerHTML = score;
    dateCell.innerHTML = date;
}
function submitScore() {
    var name = prompt("Enter your name:");
    var score = getCurrentScore(M);
    var today = new Date();
    var date = today.toLocaleDateString("en-US",{month: "2-digit", day: "2-digit", year: "2-digit"});

    addScoreToLeaderboard(name, score, date);
    showLeaderboard();
}
function sortLeaderboard() {
    var leaderboard = document.getElementById("leaderboardTable");
    var rows = leaderboard.rows;
    var sortedRows = [];
    for (var i = 1; i < rows.length; i++) {
        sortedRows.push(rows[i]);
    }
    sortedRows.sort(function(a, b) {
        var scoreA = parseInt(a.cells[1].innerHTML);
        var scoreB = parseInt(b.cells[1].innerHTML);
        return scoreB - scoreA;
    });
    for (var i = 0; i < sortedRows.length; i++) {
        leaderboard.appendChild(sortedRows[i]);
    }
}
function hideLeaderboard() {
    document.getElementById("leaderboardContainer").style.display = "none";
}

function showLeaderboard() {
    // Sort by highest score
    sortLeaderboard();
    
    // Close and open properly
    document.getElementById("leaderboardContainer").style.display = "block";
    document.getElementById("close-leaderboard").onclick = function() {
      hideLeaderboard();
    };
}
  
//___________SCOREBOARD______________


function animate(time){
    //to update each car of traffic according to the road
    for(let i=0;i<traffic.length;i++){
        traffic[i].update(road.borders,[]);
    }
    for(let i=0;i<cars.length;i++){
        cars[i].update(road.borders,traffic);
    }
    //will find the minimum y for each generated car and chose it as the best car
    //(the car that has gone the furthest)
    bestCar=cars.find(c=>c.y==Math.min(...cars.map(c=>c.y)));
    
    //to make sure the car doesnt stretch when it moves
    carCanvas.height=window.innerHeight;
    networkCanvas.height=window.innerHeight;

    carCtx.save();
    //move the canvas with the car(make it appear that a camera follows the car from above)
    carCtx.translate(0,-bestCar.y+carCanvas.height*0.7);

    road.draw(carCtx);
    //draw the traffic cars
    for(let i=0;i<traffic.length;i++){
        traffic[i].draw(carCtx);
    }
    //makes generation less messy
    carCtx.globalAlpha=0.2;
    for(let i=0;i<cars.length;i++){
        //draws the main blue cars on canvas
        cars[i].draw(carCtx);
    }

    carCtx.globalAlpha=1;
    bestCar.draw(carCtx,true);


    carCtx.restore();

    networkCtx.lineDashOffset=-time/50;
    //draws the animated version of the neural network
    Visualizer.drawNetwork(networkCtx,bestCar.brain);
    requestAnimationFrame(animate);
}


