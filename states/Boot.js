VividPlanet = {

};

VividPlanet.LoadingBar = function(game, parent) {

    Phaser.Group.call(this, game, parent);

    this.bar = game.add.sprite(game.width/2, 133, game.add.bitmapData(694,2).fill(255, 0, 0, 1));
    this.add(this.bar);
};

VividPlanet.LoadingBar.prototype = Object.create(Phaser.Group.prototype);
VividPlanet.LoadingBar.prototype.constructor = VividPlanet.LoadingBar;

VividPlanet.Boot = function (game) {
    this.game = game;
};

VividPlanet.Boot.prototype = {

    init: function () {
        this.input.maxPointers = 1;

        this.stage.backgroundColor = '#FFFFFF';

    },

    create: function () {
        this.state.start('Preloader');
    },

    render: function() {

    }

};
