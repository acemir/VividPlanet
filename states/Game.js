VividPlanet.Game = function(game) {
};

VividPlanet.Game.prototype = {
    create: function(){
        this.game.sprites.lavaVelocity.x = -1;
        this.game.add.existing(this.game.sprites.lavaBg);
        this.game.add.existing(this.game.sprites.lavaTile);

        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.platforms = game.add.group();
        this.platforms.enableBody = true;

        var roof = this.platforms.create(0, 9, this.game.add.bitmapData(740,1));
        roof.body.immovable = true;
        var ground = this.platforms.create(0, 320, this.game.add.bitmapData(740,1));
        ground.body.immovable = true;

        this.player = this.game.add.sprite(this.game.width+44, this.game.sprites.lavaTile.centerY, 'player-wave');
        this.player.anchor.setTo(.5,.5);
        // this.player.scale.set(3);
        this.player.smoothed = false;
        this.game.physics.arcade.enable(this.player);
        this.playerControl = false;

        this.damageWall = game.add.group();
        this.damageWall.enableBody = true;

        var wall = this.damageWall.create(0, 0, this.game.add.bitmapData(23,330).fill(255,255,255,1));
        wall.body.immovable = true;


        // this.player.animations.add('wave');
        // this.player.animations.play('wave', 12, true);

        // this.player.body.collideWorldBounds = true;

        this.dopplerSpeed = 0;

        this.dopplerEmmiter = this.game.add.emitter();
        this.dopplerEmmiter.makeParticles('doppler');
        
        this.dopplerEmmiter.setScale(0, .5, 0, .5, 3200);
        this.dopplerEmmiter.setAlpha(1, 0, 3200);
        this.dopplerEmmiter.setXSpeed(12, 12);
        this.dopplerEmmiter.setYSpeed(0, 0);
        this.dopplerEmmiter.gravity = 0;

        // this.add.tween(this.game.sprites.lavaTile.tileScale).to({x: 1, y: 1}, 1200, Phaser.Easing.Quadratic.Out, true);
        this.add.tween(this.player).to({x: this.game.sprites.lavaTile.centerX}, 1200, Phaser.Easing.Quadratic.Out, true).onComplete.add(function(){
            this.playerControl = true;
            this.dopplerEmmiter.start(false, 1600, 400);
            this.enemyTimer = this.game.time.events.loop(600, this.createEnemy, this);
        },this);
        // this.add.tween(this.game.sprites.lavaVelocity).to({x: -3}, 1200, Phaser.Easing.Quadratic.Out, true);

        this.cursors = game.input.keyboard.createCursorKeys();
        this.game.input.mousePointer.y =  this.game.sprites.lavaTile.centerY;

        this.enemyGroup = this.game.add.group();
        // this.enemyGroup.create(this.game.width + 360, this.game.rnd.integerInRange(this.player.y -  26, this.player.y + 26),'player');

        // this.pixelEmitter = this.game.add.emitter();
        // this.pixelEmitter.makeParticles(this.game.add.bitmapData(2,2).fill(255,255,255,1));
        // this.pixelEmitter.gravity = 0;
        // this.pixelEmitter.minParticleSpeed.set(-320, -60);
        // this.pixelEmitter.maxParticleSpeed.set(-160, 60);        


        this.vivid = 1;
        this.vividText = this.game.add.bitmapText(this.game.width - 26, this.game.height - 26, 'carrier_command', '' + this.vivid, 10);
        // this.vividText.tint = 0xc4cfa1;
        this.vividText.anchor.x = 1;

        this.damageFull = false;
        this.reachMach = false;
    },
    update: function(){

        this.game.physics.arcade.collide(this.player, this.platforms);

        if (this.playerControl && this.game.input.mousePointer.withinGame && this.game.physics.arcade.distanceToXY(this.player, this.player.x, this.game.input.mousePointer.y) > 8)
        {
            //  Make the object seek to the active pointer (mouse or touch).
            this.game.physics.arcade.moveToXY(this.player,this.player.x,this.game.input.mousePointer.y,600,60);
            this.game.sprites.lavaVelocity.y = this.player.body.velocity.y > 0 ? -.5 : .5;
        } else if (this.playerControl && this.cursors.up.isDown) {
            this.player.body.velocity.y = this.cursors.up.shiftKey ? -320 : -160;

        } else if (this.playerControl && this.cursors.down.isDown) {
            this.player.body.velocity.y = this.cursors.down.shiftKey ? 320 : 160;
        }
        else {
            //  Otherwise turn off velocity because we're close enough to the pointer
            this.player.body.velocity.set(0);
            this.game.sprites.lavaVelocity.y = 0;
        }

        this.dopplerEmmiter.x = this.player.x;
        this.dopplerEmmiter.y = this.player.y;

        this.game.sprites.lavaTile.tilePosition.x += this.game.sprites.lavaVelocity.x;
        this.game.sprites.lavaTile.tilePosition.y += this.game.sprites.lavaVelocity.y;

        this.game.physics.arcade.overlap(this.player, this.enemyGroup, this.enemyCollide,null,this);
        this.game.physics.arcade.overlap(this.damageWall, this.enemyGroup, this.damageCollide,null,this);

    },
    render:function(){
        // this.game.debug.spriteBounds(this.player);
        // this.damageWall.forEachAlive(function(member){
        //      this.game.debug.body(member);
        // }, this);
       
        // this.game.debug.geom( this.bounds, 'rgba(255,0,0,.5)' ) ;
    },
    shutdown: function(){
      this.world.remove(this.game.sprites.lavaBg);
      this.world.remove(this.game.sprites.lavaTile);
      this.world.remove(this.game.sprites.lavaMaskUp);
      this.world.remove(this.game.sprites.lavaMaskDown);
    },

    createEnemy: function(){
         // if (!dead) scoreText.text = ++score;

         if (this.damageFull || this.reachMach) return;

         var lastEnemy = this.enemyGroup.getTop();
         var enemyMin = lastEnemy ? lastEnemy.y - 24 : this.player.y -  24;
         var enemyMax =  lastEnemy ? lastEnemy.y + 24 : this.player.y +  24;

         enemyMin = Math.max(32,enemyMin);
         enemyMax = Math.min(296,enemyMax);

         var enemySprite = this.enemyGroup.create(this.game.width, this.game.rnd.integerInRange(enemyMin, enemyMax),'player');
         enemySprite.anchor.setTo(0.5);

         enemySprite.animations.add('wave');
         enemySprite.animations.play('wave', 12, true);

         game.physics.arcade.enable(enemySprite);
         
         // enemySprite.body.velocity.y = 250;
         enemySprite.body.velocity.x = -320;

         // enemySprite.body.bounce.y = 1;
         // enemySprite.body.bounce.x = 1;
         // enemySprite.body.angle = game.rnd.integerInRange(0,1);
         // enemySprite.body.collideWorldBounds = true;
    },

    enemyCollide: function(player,enemy){

        //  Position the emitter where the mouse/touch event was
        // this.pixelEmitter.x = enemy.x;
        // this.pixelEmitter.y = enemy.y;

        //  The first parameter sets the effect to "explode" which means all particles are emitted at once
        //  The second gives each particle a 2000ms lifespan
        //  The third is ignored when using burst/explode mode
        //  The final parameter (10) is how many particles will be emitted in this single burst
        // this.pixelEmitter.start(true, 300, null, 10);

       enemy.destroy();
       
       this.vivid += 1;
       this.vividText.text = this.vivid;
       this.enemyTimer.delay = Math.max(this.enemyTimer.delay - 5, 60);

       this.game.sprites.lavaVelocity.x += -.01;

       this.dopplerSpeed = -this.vivid/10 + 24;
       var dSpeed = this.dopplerSpeed > 0 ? 0 : this.dopplerSpeed;
       this.dopplerEmmiter.setXSpeed(dSpeed,dSpeed);
       // this.dopplerEmmiter.setXSpeed(-110,-110);

       if (this.vivid == 1469) {
        this.reachMach = true;
        this.goodEnd();
       }
    },

    damageCollide: function(wall,enemy) {
        var damageX = enemy.x;
        var damageY = enemy.y;
        enemy.destroy();
        
        var damageSprite = this.damageWall.create(damageX, damageY, 'player');
        damageSprite.anchor.setTo(0.5);
        // damageSprite.animations.add('wave');
        // damageSprite.animations.play('wave', 6, true);

        this.add.tween(damageSprite.scale).to({x: 10, y: 10}, 600, Phaser.Easing.Quadratic.Out, true).onComplete.add(function(){
            this.damageWall.width > this.game.sprites.lavaTile.centerX + 32 && this.badEnd();
        },this);

    },

    badEnd: function(){
        if (this.damageFull || this.reachMach) return;

        this.damageFull = true;
        this.playerControl = false;

        this.game.add.existing(this.game.sprites.lavaMaskUp);
        this.game.add.existing(this.game.sprites.lavaMaskDown);

        this.badBtn = this.add.button(this.game.width/2,this.game.height/2,'badEnd',function(){
            this.add.tween(this.badBtn).to({alpha: 0}, 300, Phaser.Easing.Quadratic.Out, true).onComplete.add(function(){
                this.restartState();
            },this);
        }.bind(this));
        this.badBtn.anchor.setTo(.5, .5);
        this.badBtn.alpha = 0;

        var tweenPlayer = this.add.tween(this.player).to({x: -32}, 3600, Phaser.Easing.Cubic.InOut, true);
        var tweenUp = this.add.tween(this.game.sprites.lavaMaskUp).to({height: 160}, 3600, Phaser.Easing.Quadratic.Out, true);
        var tweenDown = this.add.tween(this.game.sprites.lavaMaskDown).to({height: 160}, 3600, Phaser.Easing.Quadratic.Out, true).onComplete.add(function(){
            this.add.tween(this.badBtn).to({alpha: 1}, 300, Phaser.Easing.Quadratic.Out, true);
        },this);
    },

    goodEnd: function() {
        var mask = this.game.add.graphics(0, game.height/2);
        mask.beginFill(0xffffff);
        mask.drawCircle(0, 0, game.width*2);
        this.game.sprites.lavaTile.mask = mask;

        this.game.add.existing(this.game.sprites.lavaMaskUp);
        this.game.add.existing(this.game.sprites.lavaMaskDown);

        this.goodBtn = this.add.button(this.game.width/2,this.game.height/2,'goodEnd',function(){
            this.add.tween(this.goodBtn).to({alpha: 0}, 300, Phaser.Easing.Quadratic.Out, true).onComplete.add(function(){
                this.state.start('Title');
            },this);
        }.bind(this));
        this.goodBtn.anchor.setTo(.5, .5);
        this.goodBtn.alpha = 0;

        this.add.tween(this.damageWall.scale).to({x: 0, y: 1}, 1800, Phaser.Easing.Quadratic.Out, true);
        this.add.tween(mask.scale).to({x: .5, y: .5}, 1800, Phaser.Easing.Quadratic.Out, true);
        this.add.tween(mask).to({x: -game.width/2}, 1800, Phaser.Easing.Quadratic.Out, true).onComplete.add(function(){
            this.playerControl = false;
            this.add.tween(this.player).to({y: this.game.sprites.lavaTile.centerY}, 1200, Phaser.Easing.Cubic.InOut, true);

            this.add.tween(this.game.sprites.lavaMaskUp).to({height: 160}, 4800, Phaser.Easing.Sinusoidal.Out, true, 3200);
            this.add.tween(this.game.sprites.lavaMaskDown).to({height: 160}, 4800, Phaser.Easing.Sinusoidal.Out, true, 3200).onComplete.add(function(){
                this.add.tween(this.goodBtn).to({alpha: 1}, 300, Phaser.Easing.Quadratic.Out, true);
            },this);
        },this);

        // this.add.tween(this.player).to({x: this.game.width + 32}, 1200, Phaser.Easing.Cubic.InOut, true, 1800)
      

    },

    restartState: function() {
        this.damageWall.removeAll(true);
        this.dopplerEmmiter.destroy();
        this.vividText.destroy();
        this.game.sprites.lavaVelocity.x = -1;
        // this.game.sprites.lavaTile.tileScale.setTo(1.5,1.5);

        this.add.tween(this.game.sprites.lavaMaskUp).to({height: 0}, 1200, Phaser.Easing.Quadratic.Out, true);
        this.add.tween(this.game.sprites.lavaMaskDown).to({height: 0}, 1200, Phaser.Easing.Quadratic.Out, true).onComplete.add(function(){
            this.state.start('Game');
        },this);
    }

}
