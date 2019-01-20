var GameUtil = (function(){

    var obj = {
        resetGameData: function(){
            _gameData = {};
            _gameData.screenWidth = 2400;
            _gameData.screenHeight = 1200;
            _gameData.worldWidth = _gameData.screenWidth;
            _gameData.worldHeight = _gameData.screenHeight;
            _gameData.currentPhysicsTime = 0;
            _gameData.physicsTimedEvents = [];
            _gameData.currentBattleTime = 0;
            _gameData.lastTotalElapsedSeconds = null;


            _gameData.unitCount = 0;
            _gameData.unitMap = {};
            _gameData.unitArray = [];

            _gameData.selection = [];
        },

        createLevel: function(level){
            // Create Units
            if(level.units){
                level.units.forEach(function(e){
                    UnitUtil.load(e);
                }); 
            }
            // Create Trigger
            if(level.triggers){
                TriggerUtil.addTriggers(level.triggers);
            }

        },

        update:function(physicsElapsed,totalElapsedSeconds){
            // Update unit
            UnitUtil.updateUnits(physicsElapsed);
            // Timer
            TimerUtil.update(physicsElapsed);

            if(!_gameData.lastTotalElapsedSeconds)
                _gameData.lastTotalElapsedSeconds = totalElapsedSeconds;
            _gameData.currentBattleTime = totalElapsedSeconds - _gameData.lastTotalElapsedSeconds;
        },

        backToMenu: function(){
            GameUtil.resetGameData();         
            game.state.start('Menu');
        }
    };
    return obj;
})();