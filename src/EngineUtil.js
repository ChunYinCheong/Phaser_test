var EngineUtil = (function(){

    var obj = {

        extend: function (o1,o2){
            // TODO: update to a real extend!
            for(var n in o2){
                if(typeof o2[n] === "object"){
                    o1[n] = o1[n] || {};
                    EngineUtil.extend(o1[n],o2[n]);
                }else{
                    o1[n] = o2[n];    
                }            
            }
            return o1;
        },

        getJson: function(key){
            return game.cache.getJSON(key);
        },

        initUnit:  function (unit) {
            // _gameData
            _gameData.unitCount = _gameData.unitCount || 0;
            _gameData.unitMap = _gameData.unitMap|| {};
            _gameData.unitArray = _gameData.unitArray|| [];
            _gameData.unitSpriteGroup = _gameData.unitSpriteGroup|| game.add.group();
            _gameData.unitProjectilesGroup = _gameData.unitProjectilesGroup|| game.add.group();

            unit.unitId = _gameData.unitCount++;
            _gameData.unitMap[unit.unitId] = unit;
            _gameData.unitArray.push(unit);
            // Init Unit (Phaser)
            unit.res = {};
            var x = unit.x===undefined ? game.world.randomX : unit.x;
            var y = unit.y===undefined ? game.world.randomY : unit.y;
            unit.res.sprite =  game.add.sprite(x, y, unit.sprite.key, unit.sprite.frame, unit.sprite.group);
            unit.res.sprite.anchor.set(0.5);
            game.physics.enable(unit.res.sprite, Phaser.Physics.ARCADE);
            unit.res.sprite.body.immovable = !unit.movable;
            unit.res.sprite.body.collideWorldBounds = true;
            unit.res.sprite.body.bounce.setTo(1, 1);
            unit.res.sprite.angle = game.rnd.angle();
            unit.res.sprite.inputEnabled = true;


            unit.res.projectiles = game.add.group();
            unit.res.projectiles.enableBody = true;
            unit.res.projectiles.physicsBodyType = Phaser.Physics.ARCADE;
            unit.res.projectiles.createMultiple(30, unit.projectile.key);
            unit.res.projectiles.setAll('anchor.x', 0.5);
            unit.res.projectiles.setAll('anchor.y', 0.5);
            unit.res.projectiles.setAll('outOfBoundsKill', true);
            unit.res.projectiles.setAll('checkWorldBounds', true);

            unit.res.sprite.data.ref = unit;
            unit.res.sprite.team = unit.team;
            // Init End
            // Res group
            _gameData.unitSpriteGroup.add(unit.res.sprite);
            _gameData.unitProjectilesGroup.add(unit.res.projectiles);
        },

        killUnit:  function (unit) {
            unit.res.sprite.kill();
        },

        initProjectile: function(projectile){
            var attacker = projectile.owner;
            var sprite;
            if (attacker.res.projectiles.countDead() <= 0){
                attacker.res.projectiles.createMultiple(50, attacker.projectile.key);
                attacker.res.projectiles.setAll('anchor.x', 0.5);
                attacker.res.projectiles.setAll('anchor.y', 0.5);
                attacker.res.projectiles.setAll('outOfBoundsKill', true);
                attacker.res.projectiles.setAll('checkWorldBounds', true);
            }    
            sprite = attacker.res.projectiles.getFirstDead(false, attacker.res.sprite.x, attacker.res.sprite.y);
            projectile.res = projectile.res  || {};
            projectile.res.sprite = sprite;
            sprite.data.ref = projectile;
            if(projectile.target!==undefined){
                sprite.rotation = game.physics.arcade.moveToObject(sprite, projectile.target.res.sprite, attacker.projectile.speed);
            }else if(projectile.targetAngle!==undefined){
                var displayObject = sprite;
                var angle = projectile.targetAngle;// Math.atan2(y - displayObject.y, x - displayObject.x);
                var speed = projectile.movementSpeed;
                displayObject.body.velocity.x = Math.cos(angle) * speed;
                displayObject.body.velocity.y = Math.sin(angle) * speed;
                sprite.rotation = angle;
            }
        },

        killProjectile: function(projectile){
            projectile.res.sprite.kill();
        },

        distanceBetween: function(object1,object2){
            return game.physics.arcade.distanceBetween(object1.res.sprite, object2.res.sprite);
        },

        distanceToXY: function(object,x,y){
            return game.physics.arcade.distanceToXY(object.res.sprite, x, y);
        },

        moveUnitToXY: function(unit,x,y){
            game.physics.arcade.moveToXY(unit.res.sprite, x, y, unit.movementSpeed);
        },

        stopUnit: function(unit){
            unit.res.sprite.body.velocity.setTo(0, 0);
        },

        playEffectAtObject: function(effect , object){
            //  Explosion pool
            _gameData.effectGroup = _gameData.effectGroup || {};
            var effectGroup = _gameData.effectGroup[effect];
            if(!effectGroup){
                effectGroup = game.add.group();
                _gameData.effectGroup[effect] = effectGroup;
            }
            var effectAnimation = effectGroup.getFirstExists(false);
            if(!effectAnimation){
                effectAnimation = effectGroup.create(0, 0, effect, [0], false);
                effectAnimation.anchor.setTo(0.5, 0.5);
                effectAnimation.animations.add(effect);
            }
            effectAnimation.reset(object.res.sprite.x, object.res.sprite.y);
            effectAnimation.play(effect, 30, false, true);    
        },

        // Phaser
        getUnitSpriteGroup:  function(){
            return _gameData.unitSpriteGroup;
        },

        getUnitProjectilesGroup:  function(){
            return _gameData.unitProjectilesGroup;
        }
    };
    return obj;
})();