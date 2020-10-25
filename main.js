
(function () {
    var previousTime = 0.0;
    var bounce_damp = 0.5;
    var roll_damp = 1 - 0.02;
    var air_damp = 1 - 0.000;
    var ball_w = 80; var ball_h = ball_w;
    var ball_radius = ball_w / 2

    var goal_w = 150;
    var goal_h = 50;
    var goal_x = document.body.clientWidth - 350;
    var goal_y = 200;

    var rim_w = 30;
    var rim_front_h = goal_h; var rim_back_h = goal_h * 3;
    var rim_front_x = goal_x - rim_w; var rim_front_y = goal_y;
    var rim_back_x = goal_x + goal_w; var rim_back_y = goal_y;

    

    var goals = document.getElementsByClassName('goal');
    for (var gi = 0; gi < goals.length; gi++) {
        var g = goals[gi];
        g.style.width = goal_w + 'px';
        g.style.height = goal_h + 'px';
        g.style.left = goal_x + 'px';
        g.style.bottom = goal_y + 'px';
        var r = document.createElement("div");
        r.className = 'rim';
        r.style.width = rim_w + 'px';
        r.style.height = rim_front_h + 'px';
        r.style.left = rim_front_x + 'px';
        r.style.bottom = rim_front_y + 'px';
        document.body.appendChild(r);
        var b = document.createElement("div");
        b.className = 'backboard';
        b.style.width = rim_w + 'px';
        b.style.height = rim_back_h + 'px';
        b.style.left = rim_back_x + 'px';
        b.style.bottom = rim_back_y + 'px';
        document.body.appendChild(b);
    }
    var ballNumber = 1;
    function addBall(x, y) {
        var n = document.createElement("div");
        var s = document.createElement("span");
        n.appendChild(s);
        n.className = 'ball';
        n.style.width = ball_w + 'px';
        n.style.height = ball_h + 'px';
        n.style.left = x + 'px';
        n.style.bottom = y + 'px';
        n.dataset['x'] = x;
        n.dataset['y'] = y;
        n.dataset['ttl'] = 10000;
        n.dataset['number'] = ballNumber++;

        document.body.appendChild(n);
        return n;
    }
    function checkFloorAndWalls(x, y, vel_x, vel_y, dt) {
        if (y <= 0) {
            if (vel_y > bounce_damp / 2)
                vel_y = -vel_y * bounce_damp;
            else
                vel_y = 0;
            vel_x *= roll_damp;
        } else {
            vel_y += dt / 1000 * 40; //gravity
            vel_x *= air_damp;
            vel_y *= air_damp;
        }
        if (vel_x > 0 && x >= document.body.clientWidth - 90) {
            if (vel_x > bounce_damp)
                vel_x = -vel_x * bounce_damp;
            else
                vel_x = 0;
        } else if (x < 0) {
            vel_x = 0;
        }
        return {
            vel_x: vel_x,
            vel_y: vel_y
        }
    }
    function checkRectangleCollission(tBallX, tBallY, tRectX, tRectY, rect_w, rect_h){
        var circleDistanceX = Math.abs(tBallX - tRectX);
        var circleDistanceY = Math.abs(tBallY - tRectY);
    
        if (circleDistanceX > (rect_w/2 + ball_radius)) { return { direction: 0, collided: false } }
        if (circleDistanceY > (rect_h/2 + ball_radius)) { return { direction: 0, collided: false };}
    
        if (circleDistanceX <= (rect_w/2)) { return { direction: tBallX > tRectX ? 1 : - 1, collided: false }; } 
        if (circleDistanceY <= (rect_h/2)) { return { direction: 0, collided: false }; }

        cornerDistance_sq = (circleDistanceX - rect_w/2)* (circleDistanceX - rect_w/2)+
                             (circleDistanceY - rect_h/2)* (circleDistanceY - rect_h/2);
    
        return (cornerDistance_sq <= (ball_radius*ball_radius)) ?  { direction: tBallX > tRectX ? 1 : - 1, collided: true } : { direction: 0, collided: false } ;
    }

    function checkRimCollisions(ballX, ballY, vel_x, vel_y) {
        //available dimensions:
        // ball_w, ball_h
        // rim_w 
        // rim_front_h, rim_front_x, rim_front_y
        // rim_back_h, rim_back_x, rim_back_y

        var true_ball_x = ballX + (ball_w / 2);
        var true_ball_y = ballY + (ball_w / 2);
        var true_front_rim_x = rim_front_x + (rim_w / 2); 
        var true_front_rim_y = rim_front_y + (rim_front_h / 2);

        var front_rim_collision = checkRectangleCollission(true_ball_x, true_ball_y, true_front_rim_x, true_front_rim_y, rim_w, rim_front_h);
    
        var true_back_rim_x = rim_back_x + (rim_w / 2); 
        var true_back_rim_y = rim_back_y + (rim_back_h / 2);
        var back_rim_collision = checkRectangleCollission(true_ball_x, true_ball_y, true_back_rim_x, true_back_rim_y, rim_w, rim_front_h);
        
        if(front_rim_collision.collided || back_rim_collision.collided){
            vel_x = vel_x * bounce_damp*back_rim_collision.direction;
        }

        return {
            vel_x: vel_x,
            vel_y: vel_y
        }
    }
    function checkGoal(ballX, ballY, ballHW) {
        // available dimensions:
        // goal_w, goal_h
        // goal_x, goal_y

        //TODO: return TRUE when ball is in goal

        return false;
    }
    function onGoal(ballNumber) {
        //TODO: show a visual indicator the user scored
    }
    function loop(time) {
        // Compute the delta-time against the previous time
        var dt = time - previousTime;

        // Update the previous time
        previousTime = time;

        var balls = document.getElementsByClassName('ball');
        for (var h = balls.length - 1; h > -1; h--) {
            if (+balls[h].dataset['ttl'] < 0) {
                balls[h].dataset['physics'] = 'false';
                document.body.removeChild(balls[h]);
            }
        }
        for (var i = 0; i < balls.length; i++) {
            var ball = balls[i];
            if (ball.dataset['physics'] == 'false')
                continue;
            var vel_y = +ball.dataset['vy'] || 0;
            var vel_x = +ball.dataset['vx'] || 0;
            var x = +ball.dataset['x'] || 0;
            var y = +ball.dataset['y'] || 0;

            var sys = checkFloorAndWalls(x, y, vel_x, vel_y, dt)
            vel_x = sys.vel_x;
            vel_y = sys.vel_y;

            vel_x = Math.min(vel_x, 20);
            vel_y = Math.min(vel_y, 20);

            var rim_c = checkRimCollisions(x, y, vel_x, vel_y);
            vel_x = rim_c.vel_x;
            vel_y = rim_c.vel_y;

            x += vel_x;
            y -= vel_y;
            if (checkGoal(x, y, ball_w)) {
                onGoal(+ball.dataset['number']);
            }
            ball.style.bottom = y + 'px';
            ball.style.left = x + 'px';
            ball.children[0].innerText =  x + '|' + y;
            ball.dataset['x'] = x;
            ball.dataset['vx'] = vel_x;
            ball.dataset['y'] = y;
            ball.dataset['vy'] = vel_y;
            ball.dataset['ttl'] = (+ball.dataset['ttl']) - dt;

        }
        window.requestAnimationFrame(loop);
    }
    window.requestAnimationFrame(function (time) {
        previousTime = time;
        window.requestAnimationFrame(loop);
    });
    var sling_ball = null;
    var sling_start_x = 0; var sling_start_y = 0;

    document.addEventListener('mousedown', function (e) {
        sling_ball = addBall(165, 170);
        sling_ball.dataset['physics'] = false;
        sling_start_x = e.pageX; sling_start_y = e.pageY;
    });
    var drag_scale = 7; //for every 7px, add 1 force
    var max_sling_f = 30; // max sling force
    document.addEventListener('mousemove', function (e) {
        if (sling_ball) {
            var x = sling_start_x - e.pageX;
            var y = sling_start_y - e.pageY;
            x /= drag_scale; y /= drag_scale;
            x = Math.min(max_sling_f, Math.max(-max_sling_f, x));
            y = Math.min(max_sling_f, Math.max(-max_sling_f, y));
            sling_ball.dataset['x'] = 170 - x * 2;
            sling_ball.dataset['y'] = 170 + y * 2;
            sling_ball.style.left = sling_ball.dataset['x'] + 'px';
            sling_ball.style.bottom = sling_ball.dataset['y'] + 'px';
            sling_ball.dataset['vx'] = x;
            sling_ball.dataset['vy'] = y;
            sling_ball.children[0].innerText = x.toFixed(2) + ',' + y.toFixed(2);
        }
    });
    document.addEventListener('mouseup', function () {
        sling_ball.dataset['physics'] = true;
        sling_ball = null;
    });
})();