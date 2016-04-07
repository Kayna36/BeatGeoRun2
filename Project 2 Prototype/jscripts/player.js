/*
player.js
*/
game.module(
    'game.objects'
)
.body(function(){

game.createClass('Player',{
    onGround: false,
    
    init:function(x,y){
        //this.sprite = game.Animation.fromFrames('run'); what?
        
        this.body = new game.Body({
            position: {
                x: x,
                y: y
            },
            mass: 1,
            collisionGroup: 0,
            collideAgainst: [1,2,3,4],
            velocityLimit: {
                x: 0,
                y: 1200
            }
        });
        
        this.body.collide= this.collide.bind(this);
        
        var shape= new game.Rectangle(80,190);
        this.body.addShape(shape);
        game.scene.world.addBody(this.body);
        game.scene.addObject(this);
    },
    
    jump:function(){
        if(!this.onGround || this.killed) 
            return;
        this.body.velocity.y = -this.body.velocityLimit.y;
        this.body.mass= 1;
        this.onGround= false;
    },
    
    collide: function(other){
        if (other.collisionGroup ===1){
            this.body.velocity.y = 0;
            this.body.mass = 0;
            this.onGround = true;
        }
        
        else if (other.collisionGroup === 2){
            other.parent.remove();
            return false;
        }
        
        else if (other.collisionGroup === 3){
            this.kill();
            return false;
        }
        
        else if (other.collisionGroup === 4){
            if (this.body.last.y + this.body.shape.height / 2 <= other.position.y - other.shape.height / 2){
                this.body.velocity.y = 0;
                this.onGround = true;
            }
            else return false;
        }
        return true;
    },
 
    kill: function(){
        this.killed = true;
        this.body.mass =1;
        game.scene.world.removeBodyCollision(this.body);
        this.body.velocity.y= -this.body.velocityLimit.y /2;
        game.scene.addTimer(2000, function(){
            //Restart the game
            game.system.setScene('Main');
        });
    },
    
    update: function(){
        if (this.killed)
            return;
        
        if (this.body.velocity.y > 0)
            this.onGround = false;
        
        
    }
});

});