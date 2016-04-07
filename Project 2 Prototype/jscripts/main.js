/*
main.js
*/
game.module(
    'game.main'
)

.require(
    'game.loader'
    'game.player'
)

.body(
function(){
    
    game.createScene('Main',{
        init:function(){
            this.world = new game.World(0,2000); //making a World obj
            var floorBody = new game.Body({
                position: {
                    x: game.system.width / 2,
                    y: game.system.height - 40
                },
                collisionGroup: 1
            });
            var floorShape = new game.Rectangle(game.system.width, 50);
            floorBody.addShape(floorShape);
            this.world.addBody(floorBody);
            
            this.playerContainer = new game.Container().addTo(this.stage);
            this.player = new game.Player(400, game.system.height - 400);
            this.player.sprite.addTo(this.playerContainer);
        },
        
        mousedown: function(){
            this.player.jump();
        },
        
        keydown: function(key){
            if (key === 'SPACE')
                this.player.jump();
        }
    });
    
});