
var PreBattleState = (function(){

	//	This callback is sent the following parameters:
	function unitsDataFileComplete(progress, cacheKey, success, totalLoaded, totalFiles) {
		unitsDataText.setText("File Complete: " + progress + "% - " + totalLoaded + " out of " + totalFiles);
	}

	function unitsDataLoadComplete() {
		console.log("Units Data...Complete!");
		game.add.text(80,nextLine(),'Units Data...Complete!',{fill: '#ffffff'});
		
		unitsResText = game.add.text(80,nextLine(),'Loading Units Resource... ',{fill: '#ffffff'});
		unitTypeSet.forEach(function(e){
            var unitData = game.cache.getJSON(e);
            if(unitData.resources){
            	unitData.resources.forEach(function(r){
            		if(r.type==="image"){
            			game.load.image(r.key, r.url, r.overwrite);			
            		}else if(r.type==="spritesheet"){
		    			game.load.spritesheet(r.key, r.url, r.frameWidth, r.frameHeight, r.frameMax, r.margin, r.spacing);            			
            		}else if(r.type==="atlas"){
            			game.load.atlas(r.key, r.textureURL, r.atlasURL, r.atlasData, r.format);
            		}
            	});
            }            	
	    });  

		// Background
	    game.load.image('earth', 'assets/games/tanks/scorched_earth.png');
	    
	    game.load.onFileComplete.removeAll();
	    game.load.onFileComplete.add(unitsResFileComplete, this);
	    game.load.onLoadComplete.addOnce(unitsResLoadComplete, this);
		game.load.start();		
	}

	//	This callback is sent the following parameters:
	function unitsResFileComplete(progress, cacheKey, success, totalLoaded, totalFiles) {
		unitsResText.setText("Loading Resources... File Complete: " + progress + "% - " + totalLoaded + " out of " + totalFiles);
	}

	function unitsResLoadComplete() {
		console.log("Units Resources...Complete!");
		game.add.text(80,nextLine(),'Units Resources...Complete!',{fill: '#ffffff'});
		
		game.add.text(80,nextLine(),'Press Spacebar to enter battle!',{fill: '#ffffff'});
		game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.addOnce(function(){
    		game.state.start('Battle');
    	}, this);
	}
	
	function nextLine(){
		line+=50;
		return line;
	}	

	var levelText;
	var unitsDataText;
	var unitsResText;
	var line;
	var unitTypeSet;

	var obj = {
		/*
		init is the very first function called when your State starts up. 
		It's called before preload, create or anything else. 
		If you need to route the game away to another State you could do so here, 
		or if you need to prepare a set of variables or objects before the preloading starts.
		*/
	    init: function(){
	    	game.world.setBounds(0, 0, _gameData.worldWidth, _gameData.worldHeight);
	    	line = 0;
    		game.add.text(80,nextLine(),'Loading Level Data... ',{fill: '#ffffff'});
    		// levelText = game.add.text(80,nextLine(),'Loading Level Data... ',{fill: '#ffffff'});
			unitTypeSet = new Set();
	    },
	    /*
		preload is called first. 
		Normally you'd use this to load your game assets (or those needed for the current State) 
		You shouldn't create any objects in this method that require assets that you're also loading in this method, 
		as they won't yet be available.
	    */
	    preload: function(){
	    	var levelName = "level1";
	    	// Load level
		    game.load.json('level', 'level/'+levelName+'.json');
		    game.load.script('levelScript', 'level/'+levelName+'.js' ); 

		    // TODO: switch to a new way for loading
		    // Load Abilites
		    var p = 'src/abilities/';
		    var arr = ["AttackEffect","BlueTop","CriticalStrikes",
		    "FireBall","LifeSteal",'LighteningBall','MultiAim','NaoeKanetsugu','Revival'];
		    arr.forEach(a=>game.load.json(a, p +a+'.json'));
	    },
	    /*
	    create is called once preload has completed, this includes the loading of any assets from the Loader. 
	    If you don't have a preload method then create is the first method called in your State.
	    */
	    create: function(){ 	
	    	game.add.text(80,nextLine(),'Level Data... Complete!',{fill: '#ffffff'});
	    	game.add.text(80,nextLine(),'Loading Units Data...',{fill: '#ffffff'});
    		unitsDataText = game.add.text(80,nextLine(),'Loading Units Data...',{fill: '#ffffff'});
    		 
			// Get level data
		    var level = game.cache.getJSON('level');
		    // Load Units Data
		    if(level.units){
			    level.units.forEach(function(e){
			    	if(e.type)
			    		unitTypeSet.add(e.type);
			    });	
			    unitTypeSet.forEach(function(e){
		    		game.load.json( e , 'units/' + e + '.json' );
			    });
		    }
		    game.load.onFileComplete.removeAll();
		    game.load.onFileComplete.add(unitsDataFileComplete, this);
		    game.load.onLoadComplete.addOnce(unitsDataLoadComplete, this);
    		game.load.start();
	    },
	    /*
	    This method will be called when the State is shutdown (i.e. you switch to another state from this one).
	    */
	    shutdown: function(){
	    },
	    update: function(){
	    },
	    render: function(){
	    }
	};
	return obj;
})();
