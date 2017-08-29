VividPlanet.Preloader = function(game) {};

VividPlanet.Preloader.prototype = {

    preload: function() {

        this.loadingBar = new VividPlanet.LoadingBar(this.game);
        this.load.setPreloadSprite(this.loadingBar.bar);
        this.loadingBar.bar.anchor.setTo(0.5, 0.5);

        this.load.spritesheet('lava', 'images/tile-lava-full.png', 256, 256, 22);
        this.load.image('title-vivid', 'images/title-vivid.png');
        this.load.image('title-planet', 'images/title-planet.png');
        this.load.image('doppler', 'images/doppler.png');
        this.load.image('start', 'images/start.png');
        this.load.image('badEnd', 'images/badEnd.png');
        this.load.image('goodEnd', 'images/goodEnd.png');
        this.load.spritesheet('player-wave', 'images/player-wave.png', 44, 44, 1);
        this.load.spritesheet('player', 'images/sprite-player.png', 16, 16, 6);
        this.load.bitmapFont('carrier_command', 'images/carrier_command.png', 'images/carrier_command.xml');

        this.load.onLoadComplete.add(this.startTitle, this);
    },

    create: function() {
        this.loadingBar.bar.cropEnabled = false;
    },

    update: function() {

    },

    render: function() {

    },

    startTitle: function(){
        this.state.start('Title');
    }

};
