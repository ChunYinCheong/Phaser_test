var MenuState = {
    create: function(){

	    game.world.setBounds(0, 0, _gameData.worldWidth, _gameData.worldHeight);
    	// game.state.start('menu');
    	game.add.text(80,80,'Hi, press E!',{fill: '#ffffff'});
    	game.input.keyboard.addKey(Phaser.Keyboard.E).onDown.addOnce(function(){
    		game.state.start('PreBattle');
    	}, this);


	    // Block right click menu
	    game.canvas.oncontextmenu = function (e) { e.preventDefault(); }
    }
};