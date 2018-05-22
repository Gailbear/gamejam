/// <reference path="../node_modules/excalibur/dist/excalibur.d.ts" />

let game = new ex.Engine({
    width: 600,
    height: 600
});

// paddle
let paddle = new ex.Actor(150, game.drawHeight - 40, 200, 20);
paddle.color = ex.Color.Chartreuse;
paddle.collisionType = ex.CollisionType.Fixed;
game.add(paddle);

// paddle movement
game.input.pointers.primary.on('move', (e:ex.Input.PointerEvent) => {
    paddle.pos.x = e.x;
});

// ball
let ball = new ex.Actor(100, 300, 20, 20);
ball.color = ex.Color.Red;
ball.vel.setTo(100, 100);
ball.collisionType = ex.CollisionType.Passive;
game.add(ball);

// make ball change direction when we collide
ball.on('precollision', (ev:ex.PreCollisionEvent) => {

    if (bricks.indexOf(ev.other) > -1) {
        ev.other.kill();
    }

    let intersection = ev.intersection.normalize();

    // noinspection JSSuspiciousNameCombination
    if(Math.abs(intersection.x) > Math.abs(intersection.y)) {
        ball.vel.x *= -1;
    } else {
        ball.vel.y *= -1;
    }
});

// make ball change direction on side of screen
ball.on('postupdate', (e:ex.PostUpdateEvent) => {
    // sides
    let ball = e.target as ex.Actor;
    if(ball.pos.x < (ball.getWidth()/2) || ball.pos.x + (ball.getWidth()/2) > game.drawWidth) {
        ball.vel.x *= -1;
    }

    // top
    if(ball.pos.y < (ball.getHeight() / 2)) {
        ball.vel.y *= -1;
    }
});

// make the ball round
ball.draw = (function(ctx, delta) {
    ctx.fillStyle = this.color.toString();
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, 10, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
});

// bricks!

let padding = 20; // px
let xoffset = 65;
let yoffset = 20;
let columns = 5;
let rows = 3;

let brickColor = [ex.Color.Violet, ex.Color.Orange, ex.Color.Yellow];
let brickWidth = ((game.drawWidth - xoffset) / (columns) - padding);
let brickHeight = 30; // px
let bricks = [];
for (let y = 0; y < rows; y++) {
    for (let x =0; x < columns; x++) {
        bricks.push(new ex.Actor(xoffset + x * (brickWidth + padding) + padding, yoffset + y * (brickHeight + padding) + padding,
            brickWidth, brickHeight,
            brickColor[y % brickColor.length]));
    }
}

// brick collisions & adding
bricks.forEach((brick) => {
    brick.collisionType = ex.CollisionType.Active;
    game.add(brick);
});

ball.on('exitviewport', () => alert('You lose!'));

// create an asset loader
let loader = new ex.Loader();
let resources = {

    /* include resources here */
    //txPlayer: new ex.Texture("assets/tex/player.png")

};

// queue resources for loading
for (let r in resources) {
    loader.addResource(resources[r]);
}

// uncomment loader after adding resources
game.start(/* loader */).then(() => {

    // start your game!

});