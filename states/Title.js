VividPlanet.Title = function(game) {
};

VividPlanet.Title.prototype = {

    create: function() {
        this.game.sprites = {
            lavaBg: this.game.add.tileSprite(23, 10, 694, 310, this.game.add.bitmapData(694,310).fill(0, 0, 0, 1)),
            lavaTile: this.game.add.tileSprite(23, 10, 694, 310, 'lava'),
            lavaMaskUp: this.game.add.sprite(this.game.width/2, 10, this.game.add.bitmapData(694,122).fill(255, 255, 255, 1)),
            lavaMaskDown: this.game.add.sprite(this.game.width/2, 320, this.game.add.bitmapData(694,186).fill(255, 255, 255, 1)),
            lavaVelocity: {
                x: 0,
                y: -1                
            }
        };

        this.game.sprites.lavaTile.animations.add('bubble');
        this.game.sprites.lavaTile.animations.play('bubble', 6, true);

       this.game.sprites.lavaTile.tileScale.setTo(1.5,1.5);


       this.game.sprites.lavaMaskUp.anchor.setTo(0.5, 0);
       this.game.sprites.lavaMaskDown.anchor.setTo(0.5, 1);

       // this.lavaGuide = this.game.add.sprite(this.game.width/2, 132, this.game.add.bitmapData(100,246).fill(255, 0, 0, 1));
       // this.lavaGuide.anchor.setTo(0.5, 0.5);

       this.titleVivid = this.add.sprite(425,330,'title-vivid');
       this.titleVivid.anchor.setTo(1, 1);
       
       this.titlePlanet = this.add.sprite(720,330,'title-planet');
       this.titlePlanet.anchor.setTo(1, 1);

       this.startBtn = this.add.button(this.game.width/2,this.game.height-14,'start',function(){this.startGame()}.bind(this));
       this.startBtn.anchor.setTo(.5, 1);
       this.startBtn.alpha = 0;
       
       this.add.tween(this.game.sprites.lavaMaskUp).to({height: 0}, 600, Phaser.Easing.Quadratic.In, true);
       this.add.tween(this.game.sprites.lavaMaskDown).to({height: 64}, 600, Phaser.Easing.Quadratic.In, true);

       this.add.tween(this.titleVivid).to({y: 258}, 600, Phaser.Easing.Quadratic.Out, true, 500);
       this.add.tween(this.titlePlanet).to({y: 258}, 600, Phaser.Easing.Quadratic.Out, true, 600);

       this.add.tween(this.startBtn).to({alpha: 1}, 600, Phaser.Easing.Quadratic.Out, true, 1200);
    },

    update: function() {
        this.game.sprites.lavaTile.tilePosition.x += this.game.sprites.lavaVelocity.x;
        this.game.sprites.lavaTile.tilePosition.y += this.game.sprites.lavaVelocity.y;
    },

    render: function() {

    },

    shutdown : function() {
      this.world.remove(this.game.sprites.lavaBg);
      this.world.remove(this.game.sprites.lavaTile);
      this.world.remove(this.game.sprites.lavaMaskUp);
      this.world.remove(this.game.sprites.lavaMaskDown);
    },

    startGame: function(){
       this.add.tween(this.game.sprites.lavaMaskDown).to({height: 0}, 600, Phaser.Easing.Quadratic.Out, true);
       this.add.tween(this.titleVivid).to({y: 420}, 600, Phaser.Easing.Quadratic.Out, true);
       this.add.tween(this.titlePlanet).to({y: 420}, 600, Phaser.Easing.Quadratic.Out, true);
       this.add.tween(this.startBtn).to({alpha: 0}, 300, Phaser.Easing.Quadratic.Out, true);

        this.add.tween(this.game.sprites.lavaVelocity).to({y: 0, x: -1}, 1200, Phaser.Easing.Quadratic.Out, true).onComplete.add(function(){
            this.state.start('Game');
        },this);
    }

};
