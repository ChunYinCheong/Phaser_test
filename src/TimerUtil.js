var TimerUtil = (function(){
    var obj = {
        update: function(physicsElapsedMS){
            _gameData.currentPhysicsTime += physicsElapsedMS;
            _gameData.physicsTimedEvents
            .filter(e=>e.time<=_gameData.currentPhysicsTime)
            .forEach(e=>{
                if(e.loop !== true)
                    e.expired = true;
                else
                    e.time += e.every;
                e.callback.apply(e.thisArg,e.argsArray);
            });
            _gameData.physicsTimedEvents = _gameData.physicsTimedEvents.filter(e=>!e.expired);
            
        },
        addPhysicsTimed: function(delay,thisArg,callback, ...argsArray){
            _gameData.physicsTimedEvents.push({
                "expired": false,
                "time": _gameData.currentPhysicsTime + delay,
                "thisArg": thisArg,
                "callback": callback,
                "argsArray": argsArray
            });
        },
        addPhysicsTimedLoop: function(delay,every,thisArg,callback, ...argsArray){
            _gameData.physicsTimedEvents.push({
                "expired": false,
                "time": _gameData.currentPhysicsTime + (delay||0),
                "every": every,
                "thisArg": thisArg,
                "callback": callback,
                "argsArray": argsArray,
                "loop": true
            });
        }
    };
    return obj;
})();