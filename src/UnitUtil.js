var UnitUtil = (function(){
    var obj = {
        create:  function (type , team , x , y) {
            var typeJson = EngineUtil.getJson(type);
            // Create object with data
            var object = new Unit();
            EngineUtil.extend(object,typeJson);
            object.type = type;
            object.team = team || 0;
            object.x = x;
            object.y = y;
            object.abilities = object.abilities || [];
            AbilityUtil.initAbilities(object.abilities);            
            
            EngineUtil.initUnit(object);
            return object;
        },

        load: function(data){
            var typeJson = EngineUtil.getJson(data.type);
            // Create object with data
            var object = new Unit();
            EngineUtil.extend(object,typeJson);
            EngineUtil.extend(object,data);

            object.abilities = object.abilities || [];
            AbilityUtil.initAbilities(object.abilities);            

            EngineUtil.initUnit(object);
            return object;
        },

        getUnitById:  function (unitId){
            return _gameData.unitMap[unitId];
        },

       getUnitMap:  function (){
            return _gameData.unitMap;
        },

       getUnitArray:  function (){
            return _gameData.unitArray;
        },

        projectileHitUnit: function(projectile,unit){
            if(projectile.alive === true){
                UnitUtil.damage(projectile.owner,unit,projectile.damage);
                if(projectile.attackEffects && projectile.attackEffects.length!==0){
                    projectile.attackEffects
                    .forEach(a=>AbilityUtil.abilityStartsEffect(projectile.owner,a ,{"target": unit}));
                }
                if(projectile.hitLimit !== undefined && projectile.hitLimit !== null){
                    projectile.hitLimit -= 1;
                    if(projectile.hitLimit===0){
                        projectile.alive = false;
                        EngineUtil.killProjectile(projectile);
                    }
                }
            }            
        },

        damage: function(from,to,damage){
            to.health -= damage || 1;
            AbilityUtil.getActivatedAbility(to,"UnitTakesDamage")
            .forEach(a=>AbilityUtil.abilityStartsEffect(to,a,{"from": from}));
            if (to.health <= 0)
            {
                to.alive = false;
                EngineUtil.killUnit(to);
                TriggerUtil.triggerEvent({"type": "UnitDies","unitKey": to.unitKey});
            }

        },

        attackUnit: function(attacker,target){
            attacker.fireRecharge = 0;
            // attacker.fireRecharge -= 1;
            var damage = attacker.damage;
            AbilityUtil.getActivatedAbility(attacker,"CriticalStrikes")
            // TODO: change the calculation way
            .forEach(a=>{                
                var multiply = a.multiply;
                if (typeof a.multiply !== "number")
                    multiply = a.multiply[a.level-1];
                damage = multiply * damage;
            });


            AbilityUtil.getActivatedAbility(attacker,"MultiAim")
            .forEach(a=>{
                var extraAim = a.extraAim;
                if (typeof a.extraAim !== "number")
                    extraAim = a.extraAim[a.level-1];
                UnitUtil.getEnemiesInRange(attacker,attacker.fireRange)
                .filter(u=>u!==target)
                .slice(0,extraAim)
                .forEach(u=>{
                    var projectile = { "type": "attack","owner": attacker, "target": u,"team": attacker.team, 
                    "damage": damage, "alive": true, "hitLimit": 1, "tracking": true, "movementSpeed": attacker.projectile.speed};
                    EngineUtil.initProjectile(projectile);
                });
            });

            attackEffects = AbilityUtil.getActivatedAbility(attacker,"AttackEffect");

            var projectile = { "type": "attack","owner": attacker, "target": target,"team": attacker.team, 
            "damage": damage, "alive": true, "hitLimit": 1, "tracking": true, "movementSpeed": attacker.projectile.speed,
            "attackEffects": attackEffects};
            EngineUtil.initProjectile(projectile);
        },

        updateUnits: function(physicsElapsed){
            UnitUtil.getUnitArray()
            .filter(u=>u.alive)
            .forEach(u=>{
                u.fireRecharge = u.fireRecharge + physicsElapsed * u.fireRate;
                var enemy= UnitUtil.getClosestEnemyInRange(u,u.fireRange);
                if (enemy && u.fireRecharge > 1){
                    UnitUtil.attackUnit(u,enemy);
                }
                
                if(u.command){
                    if(u.command.type==="move"){
                        var d = EngineUtil.distanceToXY(u, u.command.x, u.command.y);
                        if(d<=10){
                            EngineUtil.stopUnit(u);
                            u.command = null;
                        }else{
                            EngineUtil.moveUnitToXY(u, u.command.x, u.command.y);
                        }
                    }
                }
            });
        },


        getAlliesInRange: function(unit,range,oox,y){
            if(y!==undefined){
                return UnitUtil.getAlliesInRangeAtPoint(unit,range,x,y);
            }else{
                return UnitUtil.getAlliesInRangeAtObject(unit,range,oox || unit);
            }
        },

        getAlliesInRangeAtObject: function(unit,range,object){
            return UnitUtil.getUnitArray()
            .filter(u=>
                u.alive
                &&u.team===unit.team
                &&EngineUtil.distanceBetween(u, object) < range);
        },
        getAlliesInRangeAtPoint: function(unit,range,x,y){
            return UnitUtil.getUnitArray()
            .filter(u=>
                u.alive
                &&u.team===unit.team
                &&EngineUtil.distanceToXY(u, x , y) < range);
        },

        getEnemiesInRange: function(unit,range,oox,y){
            if(y!==undefined){
                return UnitUtil.getEnemiesInRangeAtPoint(unit,range,x,y);
            }else{
                return UnitUtil.getEnemiesInRangeAtObject(unit,range,oox || unit);
            }
        },
        getEnemiesInRangeAtObject: function(unit,range,object){
            return UnitUtil.getUnitArray()
            .filter(u=>
                u.alive
                &&u.team!==unit.team
                &&EngineUtil.distanceBetween(u, object)  < range);
        },
        getEnemiesInRangeAtPoint: function(unit,range,x,y){
            return UnitUtil.getUnitArray()
            .filter(u=>
                u.alive
                &&u.team!==unit.team
                &&EngineUtil.distanceToXY(u, x , y) < range);
        },

        getClosestEnemyInRange: function(unit,range){
            var lastDistance;
            return UnitUtil.getUnitArray()
            .filter(u=>
                u.alive
                &&u.team!==unit.team)
            .reduce((prev, curr) => {
                var currDistance = EngineUtil.distanceBetween(unit, curr);
                if(currDistance>range)
                    return prev;
                if(!prev || currDistance<lastDistance){
                    lastDistance = currDistance;
                    return curr;
                }else{
                    return prev;
                }
            },null);
        },

        moveToXY: function(unit,x,y){
            unit.command = {"type": "move","x":x, "y":y};
        }
              

    };
    return obj;
})();