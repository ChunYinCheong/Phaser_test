var TriggerUtil = (function(){
    var obj = {
        addTriggers: function(triggers){
            _gameData.eventsMap = _gameData.eventsMap || {};
            triggers.forEach(function(t){
                t.events.forEach(function(e){
                    if(e.type === "TimeElapsed"){
                        TimerUtil.addPhysicsTimed(e.delay,this,TriggerUtil.runActions,t.actions, e);
                        //game.time.events.add(e.millisecond, TriggerUtil.runActions, this, t.actions, e);
                    }else if(e.type === "Periodic"){                        
                        TimerUtil.addPhysicsTimedLoop(e.delay,e.every,this,TriggerUtil.runActions,t.actions, e);
                        // game.time.events.loop(e.millisecond, TriggerUtil.runActions, this, t.actions, e);
                    }else if(e.type === "UnitDies"){
                        _gameData.eventsMap[e.type] = _gameData.eventsMap[e.type] || {};
                        _gameData.eventsMap[e.type][e.unitKey] = _gameData.eventsMap[e.type][e.unitKey] || [];
                        _gameData.eventsMap[e.type][e.unitKey].push(t.actions);
                    }
                });
            });
        },
        triggerEvent: function(event){
            if(_gameData.eventsMap && event.type === "UnitDies"){
                if(event.unitKey){
                    var callbackArray = _gameData.eventsMap[event.type][event.unitKey];
                    if(callbackArray){
                        callbackArray.forEach(function(a){
                            TriggerUtil.runActions(a,event);
                        });
                    }
                }                
            }
        },
        runActions: function(actions,event){
            _gameData.triggerActions[actions](event);
        }
    };
    return obj;
})();


