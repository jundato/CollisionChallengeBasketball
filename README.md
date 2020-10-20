# CollisionChallengeBasketball
This is a code challenge scaffolding for playing with 2D Collisions and User Experience!

[Play the basic game here](https://acreeser.github.io/CollisionChallengeBasketball/)

## The App
* Drag-and-release your mouse to sling a basketball towards the goal
* Currently only supported on Desktop
* "Vanilla" Javascript (no libraries at all)
* Very minimal codebase: 200 lines of JS, and small amounts of CSS and HTML

## The Challenge
* Implement collisions for the rim and backboard of the goal
* Detect collisions with the inner goal area
* Show a visual message to the user that they scored!

## The Code
The areas of the code left for implementation are in `main.js`
```
  function checkRimCollisions(ballX, ballY, vel_x, vel_y) {
    //available dimensions:
    // ball_w, ball_h
    // rim_w
    // rim_front_h, rim_front_x, rim_front_y
    // rim_back_h, rim_back_x, rim_back_y

    // ball has a radius of ball_w/2
    // ballX and ballY are the bottom-left corner of the ball
    // ballX and ballY are the PAST version of the ball
    // vel_x and vel_y will be ADDED to ballX and ballY after this function

    //TODO: change vel_x and vel_y to "bounce" off of rim and backboard

    return {
        vel_x: vel_x,
        vel_y: vel_y
    }
}
```
```
function checkGoal(ballX, ballY, ballHW) {
    // available dimensions:
    // goal_w, goal_h
    // goal_x, goal_y

    //TODO: return TRUE when ball is in goal

    return false;
}
```
```
function onGoal(ballNumber) {
    //TODO: show a visual indicator the user scored
}
```
