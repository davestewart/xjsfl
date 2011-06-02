function Animator()
{
	
	// --------------------------------------------------------------------------------
	// main animation function
	
		this.onEnterFrame = function()
		{
			var d1 = new Date();
			/*
			var elements		= frame1.elements;
			var newBalls		= [];
			
			for(var i = 0; i < balls.length - 1; i++)
			{
				var state = true;
				for(var j = i + 1; j < elements.length; j++)
				{
					if(balls[i].element == elements[j])
					{
						state = false;
					}
				}
				
				if(state)
				{
					newBalls.push(createBall(elements[i]));
				}
			}
			
			balls = balls.concat(newBalls)
			*/
			/*
			*/
			for(var i = 0; i < balls.length; i++)
			{
				var ball = balls[i];
				ball.vy	+= gravity;
				if(! ball.selected)
				{
					ball.x += ball.vx;
					ball.y += ball.vy;
				}
				checkWalls(ball);
			}
			/*
			*/
			
			for(var i = 0; i < balls.length - 1; i++)
			{
				var ballA = balls[i];
				for(var j = i + 1; j < balls.length; j++)
				{
					var ballB = balls[j];
					checkCollision(ballA, ballB);
				}
			}
			
			dom.livePreview = false;
			var d2 = new Date();
			//fl.trace(d2 - d1);
			
		}
		
	// --------------------------------------------------------------------------------
	// process functions
	
		
	// --------------------------------------------------------------------------------
	// setup functions
	
		this.setup = function(numBalls)
		{
			dom.selectAll();
			if(dom.selection.length)dom.deleteSelection();
			
			for(var i = 0; i < numBalls; i++)
			{
				balls.push(createBall());
			}
		}
	
	// --------------------------------------------------------------------------------
	// code
	
		this.setup(30);
		
}

var dom			= fl.getDocumentDOM();
var top			= 0;
var left		= 0;
var bottom		= dom.height;
var right		= dom.width;
var balls		= [];
var radians		= 180 / Math.PI;
var frame1		= fl.getDocumentDOM().getTimeline().layers[0].frames[0];

var gravity		= 0//0.5;
var scalar		= 0.3 // 0.3;
var element		= 'square'
var rotation	= true;

xjsfl.init(this);
xjsfl.classes.restore('XElement');


FLBridge.animator = new Animator();

function createBall(element)
{
	var ball = new XElement(this.element || element, null);
	
	if(!element)
	{
		ball.x = Math.random() * right;
		ball.y = Math.random() * bottom;	
	}
	
	ball.vx = Math.random() * 10 - 5;
	ball.vy = Math.random() * 10 - 5;
	
	var rand = Math.random() * 1 + 0.5;
	ball.scaleX = rand;
	ball.scaleY = rand;
	ball.mass	= rand;
	
	checkCollision(ball, ball)

	return ball;
}


function checkWalls(ball)
{
	var state = false;
	if(ball.x < left + ball.width / 2)
	{
		ball.x = left + ball.width / 2;
		ball.vx *= -1;
		state = true;
	}
	else if(ball.x > right - ball.width / 2)
	{
		ball.x = right - ball.width / 2;
		ball.vx *= -1;
		state = true;
	}
	if(ball.y < top + ball.height / 2)
	{
		ball.y = top + ball.height / 2;
		ball.vy *= -1;
		state = true;
	}
	else if(ball.y > bottom - ball.height / 2)
	{
		ball.y = bottom - ball.height / 2;
		ball.vy *= -1;
		state = true;
	}
	if(state && rotation)
	{
		ball.rotation = Math.atan2(ball.vy, ball.vx) * radians + 90;
	}
}

function checkCollision(ball0, ball1)
{
	var dx = ball1.x - ball0.x;
	var dy = ball1.y - ball0.y;
	var dist = Math.sqrt(dx*dx + dy*dy);
	
	if(ball0.selected || ball1.selected)
	{
		return;
	}
	
	scalar = 0.5;
	
	//if(dist < ball0.scaleX * 5 + ball1.scaleX * 5)
	if(dist < ball0.width * scalar + ball1.width * scalar)
	{
		// calculate angle, sine and cosine
			var angle = Math.atan2(dy, dx);
			var sine = Math.sin(angle);
			var cosine = Math.cos(angle);
		
		// rotate ball0's position
			var pos0 = {x:0, y:0};
		
		// rotate ball1's position
			var pos1 = rotate(dx, dy, sine, cosine, true);

		// rotate ball0's velocity
			var vel0 = rotate(ball0.vx, ball0.vy, sine, cosine, true);
		
		// rotate ball1's velocity
			var vel1 = rotate(ball1.vx, ball1.vy, sine, cosine, true);

		// collision reaction
			var vxTotal = vel0.x - vel1.x;
			vel0.x = ((ball0.mass - ball1.mass) * vel0.x + 2 * ball1.mass * vel1.x) / (ball0.mass + ball1.mass);
			vel1.x = vxTotal + vel0.x;
		
		// update position
			pos0.x += vel0.x * 2;
			pos1.x += vel1.x * 2;

		// rotate positions back
			var pos0F = rotate(pos0.x, pos0.y, sine, cosine, false);
			
			var pos1F = rotate(pos1.x, pos1.y, sine, cosine, false);
		
		// adjust positions to actual screen positions
			ball1.x = ball0.x + pos1F.x;
			ball1.y = ball0.y + pos1F.y;
			ball0.x = ball0.x + pos0F.x;
			ball0.y = ball0.y + pos0F.y;
		
		// rotate velocities back
			var vel0F = rotate(vel0.x, vel0.y, sine, cosine, false);
			var vel1F = rotate(vel1.x, vel1.y, sine, cosine, false);
			ball0.vx = vel0F.x;
			ball0.vy = vel0F.y;
			ball1.vx = vel1F.x;
			ball1.vy = vel1F.y;

		// rotate objects
			if(rotation)
			{
				ball0.rotation = Math.atan2(ball0.vy, ball0.vx) * radians;
				ball1.rotation = Math.atan2(ball1.vy, ball1.vx) * radians;
			}

					
	}
}

function rotate(x, y, sine, cosine, reverse)
{
	var result = new Object();
	if(reverse)
	{
		result.x = x * cosine + y * sine;
		result.y = y * cosine - x * sine;
	}
	else
	{
		result.x = x * cosine - y * sine;
		result.y = y * cosine + x * sine;
	}
	return result;
}

