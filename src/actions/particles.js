function Canvas() {
  const canvasWrapper = document.querySelector('.particles-wrapper');
  const canvasBody = document.getElementById('particles-canvas');
	const canvas = canvasBody.getContext('2d');
  canvasBody.mozOpaque = true;
  canvasBody.style.position = 'absolute';
  canvasBody.style.left = '-150px';
  canvasBody.style.top = '-150px';

  let w = canvasBody.width = window.innerWidth + 400;
  let h = canvasBody.height = window.innerHeight + 400;
	let tick = 0;
  let opts = {
				backgroundColor: 'rgba(0,0,0,.2)',
				particleColor: '#fcfcfc',
				particleAmount: 25,
				defaultSpeed: .5,
				addedSpeed: 1,
				defaultRadius: 2,
				addedRadius: 2,
				communicationRadius: 450, //The radius for the line
			};
			let particles = [];

		let	Particle = function(Xpos, Ypos){
				this.x = Xpos ? Xpos : Math.random()*w; //If there is not position stated, it takes a random position
				this.y = Ypos ? Ypos : Math.random()*h;
				this.speed = opts.defaultSpeed + Math.random()*opts.addedSpeed; //Speed + a bit of random one
				this.directionAngle = Math.floor(Math.random()*360); //The angle of this particle its moving. !!!! TRUE ONLY ON INIT
				this.color = opts.particleColor;
				this.radius = opts.defaultRadius + Math.random()*opts.addedRadius; //Radius + a bit of random radius
				this.d = { //Object, stores directions. Computes directions according to the random this.directionAngle
					x: Math.cos(this.directionAngle)*this.speed,
					y: Math.sin(this.directionAngle)*this.speed
				};
				this.update = function(){ //The update function. The function that calculates next coordinates
					this.border(); //Checks if this particles touches the border and THEN computes the next coordinates
					this.x += this.d.x; //Just adding the direction to the X
					this.y += this.d.y; //Same but with Y
				};
				this.border = function(){ //The border function. Checks if this thing touches the border
					if(this.x >= w || this.x <= 0){ //X walls
						this.d.x *= -1;
					}
					if(this.y >= h || this.y <= 0){
						this.d.y *= -1;
					}
					this.x > w ? this.x = w : this.x; //This is really important.
					this.y > h ? this.y = h : this.y;
					this.x < 0 ? this.x = 0 : this.x;
					this.y < 0 ? this.y = 0 : this.y;
				};
				this.draw = function(){ //Just draws the points. Pretty easy. Takes the coords, color, radius - draws.
					canvas.beginPath();
					canvas.arc(this.x, this.y, this.radius, 0, Math.PI*2);
					canvas.closePath();
					canvas.fillStyle = this.color;
					canvas.fill();
				};
			},
			checkDistance = function(x1, y1, x2, y2){ //You got it. The point on the graph distance formula.
				return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
			},
			//Here goes the function that makes lines!
			// @param point1 -	The point that check for neighboors
			// @param father - 	The array the point suppose to take thing from
			communicatePoints = function(point1, father){
				for(var i = 0; i < father.length; i++){
					var distance = checkDistance(point1.x, point1.y, father[i].x, father[i].y);
					var opacity = 1 - distance/opts.communicationRadius;
					if (opacity > 0){ //Draws the line
						canvas.lineWidth = opacity;
						canvas.strokeStyle = 'rgba(255,255,255,0.8)';
						canvas.shadowColor = '#fff';
						canvas.shadowOffsetX = 0;
						canvas.shadowOffsetY = 0;
						canvas.beginPath();
						canvas.moveTo(point1.x, point1.y);
						canvas.lineTo(father[i].x, father[i].y);
						canvas.closePath();
						canvas.stroke();
					}
				}
			};

	function setup(){ //Function called once to set everything up
		for(var i = 0; i < opts.particleAmount; i++){
			particles.push( new Particle() );
		}
		window.requestAnimationFrame(loop);
	}

	function loop(){ //Function of loop that will be called for a frame of the animation
		window.requestAnimationFrame(loop);
		tick++;

		//Drawing the background. Basically clearing the frame that was before
    const gradient = canvas.createLinearGradient(0, 0, w/1.4, h/1.4);
    gradient.addColorStop(0, '#0496b4');
    gradient.addColorStop(1, '#34070f');
		canvas.fillStyle = gradient;
		canvas.fillRect(0,0,w,h);

		//Executing particle functions
		for(var i = 0; i < particles.length; i++){
			particles[i].update();
			particles[i].draw();
		}
		//Executing lines
		for(var a = 0; a < particles.length; a++){
			communicatePoints(particles[a], particles);
		}
	}

	setup();

	window.addEventListener('resize', function(){
		w = canvasBody.width = window.innerWidth + 400;
		h = canvasBody.height = window.innerHeight + 400;
	});

	canvasWrapper.addEventListener('click', ev => {
		particles.push( new Particle(ev.pageX, ev.pageY) );
	});
	canvasWrapper.addEventListener('contextmenu', ev => {
		ev.preventDefault();
		particles.splice(particles.length - 1, 1);
	});
}

export default function addCanvas() {
  return new Canvas();
}
