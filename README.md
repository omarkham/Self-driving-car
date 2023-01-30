# Self-Driving-Car Simulation
Prototype project to simulate a self driving car model, including the implementation of driving mechanics, environment definition, sensor simulation, collision detection, and control using a neural network.


## Car Driving Mechanics:
The car is drawn via Canvas JS.

- The turning angle is determined on the unit circle.
<img src="https://user-images.githubusercontent.com/95939886/212678809-b3253354-044e-4976-aac7-26396ff42868.png" width = 200>


- The car is controlled with speed and acceleration, up to a maximum speed.


## Road Definition
The road is created using Canvas JS with a dynamic number of lanes.

- The number of lanes is determined and the lane split based on the given number by linear interpolation.
<img src ="https://user-images.githubusercontent.com/95939886/212676184-a03ba865-10b1-4bdc-a406-c4ec3ef7df9a.png" width = 200>


```
function linearInterpolation(A, B, t) {
return A + (B - A) * t;
} 
(A is left-point, B is right-point, t is the ratio between the left and right points)
```


## Artificial Sensors
The car model has 5 rays that detect cars and road borders. The ray count can be modified if wanted.
<img src = "https://user-images.githubusercontent.com/95939886/212676219-f60236b3-22c7-4635-8ec0-3a438e6344d6.png" width = 200>

- It can detect objects up to a certain distance, and changes color upon contact, with the information being stored for use.

## Collision detection
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


## Traffic simulation

<img src = "https://user-images.githubusercontent.com/95939886/212676635-ddbf20b2-7571-4118-a6f9-084040ab0baf.png" width = 200>

Traffic is generated randomly by the program. Generated cars are added to the traffic array with a random speed, car color, and x and y position. Generated cars are only added to the traffic array if their location is not the same as another car, thus not allowing cars to spawn on top of each other or spawn where the AI car is first generated thus 


## Neural network
The ANN is a multi-layer perceptron.

It contains an inpput layer, hidden layer, and output layer.

The neural network is split into levels to make implementation easier and are linked by links that have random weights at first(in range of [-1,1])

<img src = "https://user-images.githubusercontent.com/95939886/212676903-26aa4e27-3314-4ce9-8727-b22e8b5570c6.png" width = 300>


## Summary
The car drives forward with the rays detecting and sending information as input to the first level in neural networks. Then the output is calculated as the sum of the link weight multiplied by the input and comparing it with bias. This  process is then repeated at all the levels iin the neural networks. Therefore, the best car will depend on the value of the y-coordinates for the car(the most advanced car) out of all the cars that have been generated. The local storage api saves and stores the best car brain upon press of the 'save' button.


## Visualizing Neural Networks
All layers in the neural networks (all neurons, connections with weights, biases, and interactions) are represented as an animated graph that explains the process of data transmission from one level to another.


## Genetic Algorithm
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

##Score Board
A work in progress that calculates the score of the user based on the amount of traffic and number of car mutations they chose. 
Able to see all past scores and high scores, and name of user, score of user, and date achieved.

##Options
Can choose and modify mutation of cars, amount of traffic, number of AI cars. Can reset and stop the game. Can save the best car to the browser, and delete the one currently there (allows you to train the neural network)
![Screenshot_20230129_073359](https://user-images.githubusercontent.com/95939886/215365499-cddd8e2e-dcc7-4c91-b079-5cfcfda1f5c7.png)

# #1. ![Screenshot_20230109_091349](https://user-images.githubusercontent.com/95939886/211328593-5790c214-34f7-47a9-b932-ad16c3592414.png)

Basic car controlled by user.
https://user-images.githubusercontent.com/95939886/211178543-cfbc645d-534f-441b-8e45-d4018964b9d2.mp4

# #2.![Screenshot_20230109_091419](https://user-images.githubusercontent.com/95939886/211328649-a7e604ea-41e4-4044-9dca-c41bcded8957.png)

First iteration of AI car
https://user-images.githubusercontent.com/95939886/211326832-5ba59717-176f-41ec-8d54-588830e8e21f.mp4

# #3.![Screenshot_20230109_091449](https://user-images.githubusercontent.com/95939886/211328673-113bb6c8-7acf-42b7-8a0b-2dfa9faba7b9.png)

Second iteration of AI car, with multiple car possibilities and neural network visualization.
https://user-images.githubusercontent.com/95939886/211327055-c850879b-4126-498c-8c7e-87a794fccaad.mp4

# #4.![Screenshot_20230109_091546](https://user-images.githubusercontent.com/95939886/211328698-a3b0bee4-cbf4-4f9c-ad4b-cc217d09971c.png)

Third iteration of AI car. Added traffic and car visuals. AI model is able to efficiently and accurately traverse the traffic.
https://user-images.githubusercontent.com/95939886/211326612-8fec878a-3b4e-476d-878e-8426a93f084f.mp4

# #5 Fine-tuned AI car. More accurate and reliable.
https://www.youtube.com/watch?v=nTFgwulm2fU
