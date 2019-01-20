var AbilityUtil = (function(){
    var obj = {
        initAbilities: function(abilities){
            for (var i = 0; i < abilities.length; i++) {
                if (typeof abilities[i] === 'string'){
                    abilities[i] = {"key": abilities[i]};
                }
                var abilityJson = EngineUtil.getJson(abilities[i].key);
                EngineUtil.extend(abilities[i],abilityJson);
                abilities[i].level = 1;
            }
        },

        abilityStartsEffect: function(unit,ability,data){
            switch(ability.key){
                case "NaoeKanetsugu":
                    for(var i = 0;i<72;i++){
                        var projectile = { "type": "ability", "owner": unit, "targetAngle": i*5,"team": unit.team, "damage": 1, "alive": true, "movementSpeed": 1000};
                        EngineUtil.initProjectile(projectile);
                    }
                    break;
                case "BlueTop":
                    EngineUtil.playEffectAtObject("fx1_blue_topEffect", data.target);
                    break;
                case "LighteningBall":
                    EngineUtil.playEffectAtObject("fx8_lighteningBall", data.target);
                    data.target.fireRecharge = -1;
                    break;
                case "FireBall":
                    EngineUtil.playEffectAtObject("fx3_fireBall", unit);
                    unit.health++;
                    break;
                case "PointRangeDamage":
                    UnitUtil.getEnemiesInRangeAtPoint(unit,data.range,data.x,data.y).forEach(u=>{
                        UnitUtil.damage(unit,u,data.damage);
                        EngineUtil.playEffectAtObject("fx10_blackExplosion", u);
                    });
                    break;
                case "PointRangeCure":
                    UnitUtil.getAlliesInRangeAtPoint(unit,data.range,data.x,data.y).forEach(u=>{
                        u.health+=data.cure;
                        EngineUtil.playEffectAtObject("fx2_swordFire", u);    
                    });
                    break;
                case "ObjectRangeDamage":
                    UnitUtil.getEnemiesInRange(unit,data.range).forEach(u=>{
                        UnitUtil.damage(unit,u,data.damage);
                        EngineUtil.playEffectAtObject("fx10_blackExplosion", u);
                    });
                    break;
                case "ObjectRangeCure":
                    UnitUtil.getAlliesInRange(unit,data.range).forEach(u=>{
                        u.health+=data.cure;
                        EngineUtil.playEffectAtObject("fx2_swordFire", u);                        
                    });
                    break;
            }
        },
        /**
            Return the abilites by type
        */
        getActivatedAbility: function(unit , ability){
            if(unit.abilities&&unit.abilities.length!==0){                
                return unit.abilities
                .filter(a=>{
                    if(a.disable === true)
                        return false;
                    if(a.type!==ability) 
                        return false;
                    if(a.chance===undefined)
                        return true;
                    var r = Math.floor(Math.random() * Math.floor(100+1));

                    if (typeof a.chance === "number")
                        return r<=a.chance;
                    else
                        return r<=a.chance[a.level-1];
                });                
            } 
            return [];
        }
    };
    return obj;
})();