
var BattleState = (function(){
	var land;
	var explosions;
	var cursors;
	var cd = 0;
	var abilityButton = [];
	var abilityText = [];

	function bulletHit (bullet, unitSprite){
	    UnitUtil.projectileHitUnit(bullet.data.ref, unitSprite.data.ref);

	    if (!unitSprite.data.ref.alive)
	    {
	        var explosionAnimation = explosions.getFirstExists(false);
	        if (explosionAnimation){
	            explosionAnimation.reset(unitSprite.x, unitSprite.y);
	            explosionAnimation.play('kaboom', 30, false, true);    
	        }
	        
	    } 
	}

	function bulletHitCheckTeam(bullet, unitSprite){
	    return bullet.data.ref.team != unitSprite.data.ref.team;
	}


	var obj = {
		/*
		init is the very first function called when your State starts up. 
		It's called before preload, create or anything else. 
		If you need to route the game away to another State you could do so here, 
		or if you need to prepare a set of variables or objects before the preloading starts.
		*/
	    init: function(){
	    },
	    /*
		preload is called first. 
		Normally you'd use this to load your game assets (or those needed for the current State) 
		You shouldn't create any objects in this method that require assets that you're also loading in this method, 
		as they won't yet be available.
	    */
	    preload: function(){
	    },
	    /*
	    create is called once preload has completed, this includes the loading of any assets from the Loader. 
	    If you don't have a preload method then create is the first method called in your State.
	    */
	    create: function(){ 
	    	// Debug
	    	game.time.advancedTiming = true;

	    	//  Resize our game world to be a 2000 x 2000 square
		    game.world.setBounds(-(_gameData.worldWidth/2), -(_gameData.worldHeight/2), _gameData.worldWidth, _gameData.worldHeight);

		    //  Our tiled scrolling background
		    land = game.add.tileSprite(0, 0, _gameData.screenWidth, _gameData.screenHeight, 'earth');
		    land.fixedToCamera = true;

		    //  Explosion pool
		    explosions = game.add.group();

		    for (var i = 0; i < 10; i++)
		    {
		        var explosionAnimation = explosions.create(0, 0, 'kaboom', [0], false);
		        explosionAnimation.anchor.setTo(0.5, 0.5);
		        explosionAnimation.animations.add('kaboom');
		    }

		    // Block right click menu
		    // game.canvas.oncontextmenu = function (e) { e.preventDefault(); }
		    
		    cursors = game.input.keyboard.createCursorKeys();

	    	// Get level data
		    var level = game.cache.getJSON('level');
		    GameUtil.createLevel(level);

		    // UI
		    var y = 800;
		    var oy = 100;
		    var x = 400;
		    var mx = 5;
		    var my = 4;
    		var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
		    for(var j=0;j<my;j++){
			    for (var i = 0; i < mx; i++) {
				    abilityButton[mx*j+i] = game.add.button(i*x, y+oy*j, 'button', 
				    	(function(index){
				    		return function(button,pointer,releaseInButton){
								// console.log("Index: " + index);
				    		};				    		
				    	})(mx*j+i)
				    , this, 2, 1, 0);
				    abilityButton[mx*j+i].fixedToCamera = true;

				    abilityText[mx*j+i] = game.add.text(i*x, y+oy*j, "text", style);
				    abilityText[mx*j+i].fixedToCamera = true;
			    }
		    }

	    },
	    /*
	    This method will be called when the State is shutdown (i.e. you switch to another state from this one).
	    */
	    shutdown: function(){

	    },
	    update: function(){
	    	land.tilePosition.x = -game.camera.x;
		    land.tilePosition.y = -game.camera.y;

		    // Update
            var physicsElapsed = game.time.physicsElapsed;
            GameUtil.update(physicsElapsed,game.time.totalElapsedSeconds());


		    // Unit Collide & Projectile Overlap
		    game.physics.arcade.collide(EngineUtil.getUnitSpriteGroup(), EngineUtil.getUnitSpriteGroup());
		    game.physics.arcade.overlap(EngineUtil.getUnitProjectilesGroup(), EngineUtil.getUnitSpriteGroup(),bulletHit, bulletHitCheckTeam, this);

		    cd -= physicsElapsed;
		    // Input
		    if (game.input.activePointer.leftButton.isDown && cd <= 0)
		    {
		        var select = UnitUtil.getUnitArray().filter(u=>u.alive&&u.res.sprite.input.pointerOver());
		        select.forEach(u=>console.log(u));
		        var selectedUnit = select[0];
		        if(selectedUnit){
		        	_gameData.selection = select;
			    	for (var i = 0; i < 20; i++) {
			    		if(selectedUnit.abilities && selectedUnit.abilities.length > i)
			    			abilityText[i].text = selectedUnit.abilities[i].name;
			    		else
			    			abilityText[i].text = "NA";
				    }
		        }
		    }

		    if (game.input.activePointer.rightButton.isDown && cd <= 0)
		    {
		        UnitUtil.create('Tower',2,game.input.activePointer.worldX,game.input.activePointer.worldY);
		        cd = 0.05;
		    }

		    var cameraSpeed = 50;
		    if (cursors.left.isDown)
		    {
		        game.camera.x -= cameraSpeed;
		    }
		    if (cursors.right.isDown)
		    {
		        game.camera.x += cameraSpeed;
		    }

		    if (cursors.up.isDown)
		    {
		        game.camera.y -= cameraSpeed;
		    }
		    if (cursors.down.isDown)
		    {
		        game.camera.y += cameraSpeed;
		    }


	    },
	    render: function(){
	    	debugHeight = 0;
	    	debug('game.time.physicsElapsedMS: ' + game.time.physicsElapsedMS);
	    	debug('game.time.elapsedMS: ' + game.time.elapsedMS);
	    	debug('game.time.fps: ' + game.time.fps);
	    	debug('_gameData.currentPhysicsTime: ' + _gameData.currentPhysicsTime);
	    	debug('_gameData.currentBattleTime: ' + _gameData.currentBattleTime);
	    	debug('game.time.totalElapsedSeconds(): ' + game.time.totalElapsedSeconds());
	    	_gameData.selection.forEach(s=>debug('Selection: health:' + s.health));
	    }
	};
	var debugHeight = 0;
	function debug(s){
		debugHeight+=40;
    	game.debug.text(s, 32, debugHeight, 'rgb(255,255,255)','32px Courier');
	}
	return obj;
})();
