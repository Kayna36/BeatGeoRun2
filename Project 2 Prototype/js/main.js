// main.js
// Dependencies: 
// Description: singleton object
// This object will be our main "controller" class and will contain references
// to most of the other objects in the game.

"use strict";

// if app exists use the existing copy
// else create a new object literal
var app = app || {};

/*
 .main is an object literal that is a property of the app global
 This object literal has its own properties and methods (functions)
 
 */
app.main = {
	//  properties
    WIDTH : 1920, 
    HEIGHT: 1024,
    canvas: undefined,
    ctx: undefined,
    debug: true,
    onGround: false,
    killed: false,
    PLAYER: ({
        VELOCITY: {x: 0, y: 1200},
        POSITION_X: 0,
        POSITION_Y: 0,
        MASS: 1,
        COLLIDE_GROUP: 0, 
        // 1 = floor
        // 2 = pickup
        // 3 = obstacle
        // 4 = floor
        COLLIDE_AGAINST: [1,2,3,4]
        
    }),
    levelIncrease: 1,
    paused: false,
    animationID: 0,
    GAME_STATE: Object.freeze({ 
        BEGIN: 0,
        DEFAULT: 1,
        END: 5
    }),
    gameState: undefined,
    roundNumber: 1,
    totalScore: 0,
    sound: undefined, //required - loaded by main.js
    
    // methods
	init : function() {
		console.log("app.main.init() called");
		// initialize properties
		this.canvas = document.querySelector('canvas');
		this.canvas.width = this.WIDTH;
		this.canvas.height = this.HEIGHT;
		this.ctx = this.canvas.getContext('2d');
        
        var floorRect= new Path2D();
        floorRect.rect()
        
        //D part 1.2
        this.gameState= this.GAME_STATE.BEGIN;
        
        //hook up events
        this.canvas.onmousedown= this.doMouseDown.bind(this);
        
        //load level
        this.reset();
        
		// start the game loop
		this.update();
	},
	
     //creates a new level of circles
    reset: function(){
        
    },
    
	update: function(){
		// 1) LOOP
		// schedule a call to update()
	 	this.animationID= requestAnimationFrame(this.update.bind(this));
        //requestAnimationFrame(function(){app.main.update()}); OLD
        //requestAnimationFrame(function(){this.update();}); breaks shit 
	 	
        // DEAD?
        //if so, bail out of loop
        if (this.killed) return;
        
        if (this.PLAYER.VELOCITY.y > 0) this.onGround = false;
        
	 	// PAUSED?
	 	// if so, bail out of loop
        if (this.paused){
            this.drawPauseScreen(this.ctx);
            return;
        }
	 	
	 	// 3) HOW MUCH TIME HAS GONE BY?
	 	var dt = this.calculateDeltaTime();
	 	 
	 	
        //CHECK FOR COLLISIONS
        this.checkForCollisions();
        
		// 5) DRAW	
		// i) draw background
		this.ctx.fillStyle = "black"; 
		this.ctx.fillRect(0,0,this.WIDTH,this.HEIGHT); 
	
		// ii) draw circles 
        this.ctx.globalAlpha= 0.9;
	
		// iii) draw HUD
		this.ctx.globalAlpha= 1.0;
        this.drawHUD(this.ctx);
		
		// iv) draw debug info
		if (this.debug){
			// draw dt in bottom right corner
			this.fillText(this.ctx,"dt: " + dt.toFixed(3), this.WIDTH - 150, this.HEIGHT - 10, "18pt courier", "white");
		}
		
        //6) CHECK FOR CHEATS
        //if we are on the start screen or a round over screen
        if(this.gameState == this.GAME_STATE.BEGIN || this.gameState == this.GAME_STATE.ROUND_OVER){
            //if the shift key and up arrow are both down (true)
            /*if(myKeys.keydown[myKeys.KEYBOARD.KEY_UP] && myKeys.keydown[myKeys.KEYBOARD.KEY_SHIFT]){
                this.totalScore++;
                this.sound.playEffect();
            }*/
        }
        
	},
     
	
	fillText: function(ctx, string, x, y, css, color) {
		ctx.save();
		// https://developer.mozilla.org/en-US/docs/Web/CSS/font
		ctx.font = css;
		ctx.fillStyle = color;
		ctx.fillText(string, x, y);
		ctx.restore();
	},
	
	calculateDeltaTime: function(){
		// what's with (+ new Date) below?
		// + calls Date.valueOf(), which converts it from an object to a 	
		// primitive (number of milliseconds since January 1, 1970 local time)
		var now,fps;
		now = (+new Date); 
		fps = 1000 / (now - this.lastTime);
		fps = clamp(fps, 12, 60);
		this.lastTime = now; 
		return 1/fps;
	},
    
    jump:function() {
        if (!this.onGround || this.killed) return;
        
        this.PLAYER.VELOCITY.y = -this.PLAYER.VELOCITY.y;
        this.PLAYER.MASS = 1;
        this.onGround = false;
        
    },
	
   
    drawPauseScreen: function(ctx){
        ctx.save();
        ctx.fillStyle = "black";
        ctx.fillRect(0,0,this.WIDTH, this.HEIGHT);
        ctx.textAlign= "center";
        ctx.textBaseline = "middle";
        this.fillText(this.ctx,"...PAUSE...", this.WIDTH/2, this.HEIGHT/2, "40pt courier", "white");
        ctx.restore();
    },
        
    doMouseDown: function(e){
        //part E
        this.sound.playBGAudio()        
        
        //unpause on a click
        //just to make sure we never get stuck in a paused state
        if (this.paused){
            this.paused= false;
            this.update();
            return;
        }
        
       
    }, 
    
    checkForCollisions: function(){
        
    },
        
    kill: function(){
        this.killed = true;
        this.PLAYER.MASS = 1;
        this.PLAYER.VELOCITY.y = -this.PLAYER.VELOCITY.y / 2;
        this.reset();
    },
    
    drawHUD: function(ctx){
        ctx.save(); // NEW
		// draw score
      	// fillText(string, x, y, css, color)
		this.fillText(this.ctx,"Round " + this.roundNumber, 20, 20, "14pt courier", "#ddd");
		this.fillText(this.ctx,"Total Score: " + this.totalScore, this.WIDTH - 200, 20, "14pt courier", "#ddd");

		// NEW
		if(this.gameState == this.GAME_STATE.BEGIN){
			/*
            ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			this.fillText(this.ctx,"To begin, click a circle", this.WIDTH/2, this.HEIGHT/2, "30pt courier", "white");
            */
		} // end if
	
		// NEW
		if(this.gameState == this.GAME_STATE.ROUND_OVER){
			ctx.save();
			/*
            ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			this.fillText(this.ctx,"Round Over", this.WIDTH/2, this.HEIGHT/2 - 40, "30pt courier", "red");
			this.fillText(this.ctx,"Click to continue", this.WIDTH/2, this.HEIGHT/2, "30pt courier", "red");
			this.fillText(this.ctx,"Next round there are " + (this.numCircles + 5) + " circles", this.WIDTH/2 , this.HEIGHT/2 + 35, "20pt courier", "#ddd");
            */
		} // end if
		
        if(this.gameState == this.GAME_STATE.END){
            ctx.save();
            
        }
        
        
		ctx.restore(); // NEW
    },
    
    pauseGame: function(){
        this.paused= true;
        
        //part E
        this.stopBGAudio();
        
        //stop the animation loop
        cancelAnimationFrame(this.animationID);
        
        //call update() once so that our paused screen gets drawn
        this.update();
    },
    
    resumeGame: function(){
        //stop the animation loop, just in case it's running
        cancelAnimationFrame(this.animationID);
        
        this.paused= false;
        
        //part E
        this.sound.playBGAudio()
        
        //restart the loop
        this.update();
    },
    
    stopBGAudio: function(){
        /*
        this.bgAudio.pause();
        this.bgAudio.currentTime = 0;
        */
        this.sound.stopBGAudio()
    },
    
    toggleDebug: function(){
        if (this.debug)
            {
                this.debug= false;
            }
        else
            {
                this.debug= true;
            }
    }
    
    
   
}; // end app.main