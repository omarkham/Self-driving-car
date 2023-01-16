# Self-Driving-Car Simulation
This project is intended to simulate self driving car model and how they make their decisions whenever obstacles comes into their path however real cars have much more complex algorithms, decision making processes and deep learning concepts. This is a simplified project of the same.

##Table of Contents
- Car driving mechanics
- Road definition
- Artificial sensors
- Collision detection
- Traffic simulation
- Neural network
- Visualizing neural networks
- Genetic Algorithm

##Car Driving Mechanics:
In this project, We draw the car via Canvas JS and I tried to make the car's movement close to reality in terms of turning, reversing and many other things.

- In terms of turning, We relied on the turning angle after determining it depending on the unit circle.
![image](https://user-images.githubusercontent.com/95939886/212678809-b3253354-044e-4976-aac7-26396ff42868.png | width = 40)


- In terms of forward and backward movement, it is controlled with speed and acceleration, the speed becomes constant when the vehicle reaches the specified maximum speed.

##Road Definition
The road is created using Canvas with a dynamic number of lanes.

- The number of lanes is determined and the lane split based on the given number by linear interpolation.
![image](https://user-images.githubusercontent.com/95939886/212676184-a03ba865-10b1-4bdc-a406-c4ec3ef7df9a.png | width = 40)

```
function linearInterpolation(A, B, t) {
return A + (B - A) * t;
} 
(A is left-point, B is right-point, t is the ratio between the left and right points)
```

##Artificial Sensors
We build a simple car model with 5 rays upfront (as an initial value, you can customize that). These rays will detect cars and road borders.
![image](https://user-images.githubusercontent.com/95939886/212676219-f60236b3-22c7-4635-8ec0-3a438e6344d6.png | width = 40)

- It has a certain length and spread in which it tries to detect the obstacle.
- Each of them has its reading so that it is displayed on it in a different color and also stored for use.

##Collision detection
Any damage that occurs to the car is monitored by checking if there is any intersection between the car and any other obstacle and if the car is damaged, stop immediately.
The damage is checked by intersection of polygons.
```
function polysIntersect(poly1, poly2) {
  for (let i = 0; i < poly1.length; i++) {
    for (let j = 0; j < poly2.length; j++) {
      const touch = getIntersection(
        poly1[i],
        poly1[(i + 1) % poly1.length],
        poly2[j],
        poly2[(j + 1) % poly2.length]
      );
      if (touch) {
        return true;
      }
    }
  }
  return false;
}
```
(checks if there's intersection between side segments of the two polygons)

##Traffic simulation

![image](https://user-images.githubusercontent.com/95939886/212676635-ddbf20b2-7571-4118-a6f9-084040ab0baf.png | width = 40)

Traffic is generated randomly by the program. Generated cars are added to the traffic array with a random speed, car color, and x and y position. Generated cars were only added to the traffic array if their location was not the same as another car, thus not allowing cars to spawn on top of each other.

##Neural network
Our architecture of ANN is typical one fully connected layers [multi-layer Perceptron]

It contain three layers :
- Input layer (sensors).
- Hidden layer.
- Output layer (controlars).

We built our neural network by splitting it into two levels to make implementation easier. The levels are linked by links that have random weights at first, These weights range from [-1, 1]

Each level Output has biases ranging from [-1, 1]
![image](https://user-images.githubusercontent.com/95939886/212676903-26aa4e27-3314-4ce9-8727-b22e8b5570c6.png | width = 40)

##How will neural networks work in our project?
It all starts when the sensors pick up something close to them, then these signals are read, analyzed and sent as inputs to our first level in neural networks, then each output we have at the first level is calculated as the sum of the link weight multiplied by the input, and checked if possible We take advantage of this output (i.e., can it help us to avoid a certain obstacle) by comparing it with bias, and accordingly making it an output, and this process is repeated at all the levels we have in the neural networks.

##How will you learn neural networks in a project?
- Before the learning process, we must define our goal.
- Our goal in the project is to enable the car to avoid the obstacles in front of it and move forward as much as possible. Therefore, the fit coupling will depend on the value of the y-coordinates for the car, whereby the best car will be defined as the car that has the least y-coordinates (i.e. the most successful and advanced car) out of all the cars that have been generated and its data (i.e. its brain) will be saved for later use.
- Note: we will use localstorage to store best car brain.

##Visualizing Neural Networks
All layers in our neural networks (all neurons, connections with weights, biases, and interactions) are represented as an animated graph that explains the process of data transmission from one level to another.

##Genetic Algorithm
The genetic algorithm of the project is to perform mutations in different proportions on the best selected car and generate several cars from them to obtain the best possible results from each generation
```
static mutate(network, amount = 1) {
    network.levels.forEach((level) => {
      for (let i = 0; i < level.biases.length; i++) {
        level.biases[i] = linearInterpolation(
          level.biases[i],
          Math.random() * 2 - 1,
          amount
        );
      }
      for (let i = 0; i < level.weights.length; i++) {
        for (let j = 0; j < level.weights[i].length; j++) {
          level.weights[i][j] = linearInterpolation(
            level.weights[i][j],
            Math.random() * 2 - 1,
            amount
          );
        }
      }
    });
  }
}
```

##1. ![Screenshot_20230109_091349](https://user-images.githubusercontent.com/95939886/211328593-5790c214-34f7-47a9-b932-ad16c3592414.png)

Basic car controlled by user.
https://user-images.githubusercontent.com/95939886/211178543-cfbc645d-534f-441b-8e45-d4018964b9d2.mp4

##2.![Screenshot_20230109_091419](https://user-images.githubusercontent.com/95939886/211328649-a7e604ea-41e4-4044-9dca-c41bcded8957.png)

First iteration of AI car
https://user-images.githubusercontent.com/95939886/211326832-5ba59717-176f-41ec-8d54-588830e8e21f.mp4

##3.![Screenshot_20230109_091449](https://user-images.githubusercontent.com/95939886/211328673-113bb6c8-7acf-42b7-8a0b-2dfa9faba7b9.png)

Second iteration of AI car, with multiple car possibilities and neural network visualization.
https://user-images.githubusercontent.com/95939886/211327055-c850879b-4126-498c-8c7e-87a794fccaad.mp4

##4.![Screenshot_20230109_091546](https://user-images.githubusercontent.com/95939886/211328698-a3b0bee4-cbf4-4f9c-ad4b-cc217d09971c.png)

Third iteration of AI car. Added traffic and car visuals. AI model is able to efficiently and accurately traverse the traffic.
https://user-images.githubusercontent.com/95939886/211326612-8fec878a-3b4e-476d-878e-8426a93f084f.mp4

##5 Fine-tuned AI car. More accurate and reliable.
https://www.youtube.com/watch?v=nTFgwulm2fU
