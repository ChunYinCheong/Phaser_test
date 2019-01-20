_gameData.triggerActions = {
	CreateRandomUnit: function(){
		UnitUtil.create("Tower",2);
		// UnitUtil.create("Tower2",1);
	},
	RandomMove: function(){
		// UnitUtil.getUnitArray().filter(u=>u.team===2).forEach(u=>UnitUtil.moveToXY(u,game.world.randomX,game.world.randomY));
	},
	Win: function(){		        
		console.log("You win!");
    	game.add.text(80,80,'You win! Press E to return Menu!',{fill: '#ffffff'});
    	game.input.keyboard.addKey(Phaser.Keyboard.E).onDown.addOnce(function(){
    		GameUtil.backToMenu();
    	}, this);
	},
	Lose: function() {
        console.log("You lose!");
    	game.add.text(80,80,'You lose! Press E to return Menu!',{fill: '#ffffff'});
    	game.input.keyboard.addKey(Phaser.Keyboard.E).onDown.addOnce(function(){
    		GameUtil.backToMenu();
    	}, this);
		
	}
}