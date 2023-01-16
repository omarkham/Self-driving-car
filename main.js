let intervalId;

function startTimer() {
    let startTime = new Date();
    intervalId = setInterval(function(){
        let currentTime = new Date();
        let elapsedTime = currentTime - startTime;
        let elapsedTimeInSeconds = Math.floor(elapsedTime / 1000);
        let elapsedMinutes = Math.floor(elapsedTimeInSeconds / 60);
        let elapsedSeconds = elapsedTimeInSeconds % 60;
        document.getElementById("elapsed-time").innerHTML = elapsedMinutes + " minutes " + elapsedSeconds + " seconds";
    }, 1000);
}
function stopTimer() {
    clearInterval(intervalId);
    this.endTime = new Date();
    this.elapsedTime = this.endTime - this.startTime;
    return this.elapsedTime;
}
startTimer();

const carCanvas=document.getElementById("carCanvas");
carCanvas.width=200;
const networkCanvas=document.getElementById("networkCanvas");
networkCanvas.width=300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road=new Road(carCanvas.width/2,carCanvas.width*0.9);

const N=200;//this is the multiple different blue car possibilities
const cars = generateCars(N);
let bestCar=cars[0];
if(localStorage.getItem("bestBrain")){
    for(let i=0;i<cars.length;i++){
        cars[i].brain=JSON.parse(
            localStorage.getItem("bestBrain"));
        if(i!=0){
            NeuralNetwork.mutate(cars[i].brain,0.1);
        }
    }
}

//Writing a function to generate traffic automatically (not hardcoding the cars)
const traffic = [];
for (let i = 0; i < 200; i++) {
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

function save(){
    localStorage.setItem("bestBrain",
        JSON.stringify(bestCar.brain));
    time = stopTimer();
}

function discard(){
    localStorage.removeItem("bestBrain");
}

function generateCars(N){
    const cars=[];
    for(let i=1;i<=N;i++){
        cars.push(new Car(road.getLaneCenter(1),100,30,50,"AI"));
    }
    return cars;
}

function animate(time){
    for(let i=0;i<traffic.length;i++){
        traffic[i].update(road.borders,[]);
    }
    for(let i=0;i<cars.length;i++){
        cars[i].update(road.borders,traffic);
    }
    bestCar=cars.find(
        c=>c.y==Math.min(
            ...cars.map(c=>c.y)
        ));
    
    carCanvas.height=window.innerHeight;
    networkCanvas.height=window.innerHeight;

    carCtx.save();
    carCtx.translate(0,-bestCar.y+carCanvas.height*0.7);

    road.draw(carCtx);
    for(let i=0;i<traffic.length;i++){
        traffic[i].draw(carCtx);
    }
    carCtx.globalAlpha=0.2;
    for(let i=0;i<cars.length;i++){
        cars[i].draw(carCtx);
    }
    carCtx.globalAlpha=1;
    bestCar.draw(carCtx,true);

    carCtx.restore();

    networkCtx.lineDashOffset=-time/50;
    Visualizer.drawNetwork(networkCtx,bestCar.brain);
    requestAnimationFrame(animate);
}


