/*
loader.js
here to load any window functions, art assets, and sound (maybe)
*/
game.module(
    'game.loader'
)

window.onblur= function(){
    console.log("blue at " + Date());
    
}

.body(function()
     {
    game.addAsset('player.png');
}
     );