var game = new Phaser.Game(400, 490, Phaser.AUTO, 'jeu');

var mainState = {

    preload: function() {
        game.stage.backgroundColor = '#71c5cf';
        var bird = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyAQMAAAAk8RryAAAABlBMVEXSvicAAABogyUZAAAAGUlEQVR4AWP4DwYHMOgHDEDASCN6lMYV7gChf3AJ/eB/pQAAAABJRU5ErkJggg==";
        var pipe = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyAQMAAAAk8RryAAAABlBMVEV0vy4AAADnrrHQAAAAGUlEQVR4AWP4DwYHMOgHDEDASCN6lMYV7gChf3AJ/eB/pQAAAABJRU5ErkJggg==";
        game.load.image('oiseau', bird);  
        game.load.image('pipe', pipe);
    },

    create: function() {
        game.physics.startSystem(Phaser.Physics.ARCADE);

        this.pipes = game.add.group();
        this.pipes.enableBody = true;
        this.pipes.createMultiple(20, 'pipe');  
        this.timer = this.game.time.events.loop(1500, this.addRowOfPipes, this);           

        this.bird = this.game.add.sprite(100, 245, 'oiseau');
        game.physics.arcade.enable(this.bird);
        this.bird.body.gravity.y = 1000 ;

        // Nouvelle position d'ancrage
        this.bird.anchor.setTo(-0.2, 0.5);
 
        var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);

        this.score = 0 ;
        this.labelScore = this.game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" });  

        // Ajout du son de saut
        this.jumpSound = this.game.add.audio('jump');
    },

    update: function() {
        if (this.bird.inWorld == false)
            this.restartGame();

        game.physics.arcade.overlap(this.bird, this.pipes, this.hitPipe, null, this);

        // Rotation de l'oiseau    
    },

    jump: function() {
        // Si l'oiseau est mort, il ne peut pas sauter
        if (this.bird.alive == false)
            return;

        this.bird.body.velocity.y = -350 ;

        // Animation de saut

    },

    hitPipe: function() {
        // Si l'oiseau a déjà heurté un tuyau, nous n'avons rien à faire
        if (this.bird.alive == false)
            return;
            
        // Définit la propriété vivante de l'oiseau sur false
        this.bird.alive = false;

        // Empêcher l'apparition de nouveaux tuyaux
        this.game.time.events.remove(this.timer);
    
        // Traverse tous les tuyaux, et arrête leur mouvement
        this.pipes.forEachAlive(function(p){
            p.body.velocity.x = 0;
        }, this);
    },

    restartGame: function() {
        game.state.start('main');
    },

    addOnePipe: function(x, y) {
        var pipe = this.pipes.getFirstDead();

        pipe.reset(x, y);
        pipe.body.velocity.x = -200 ;  
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },

    addRowOfPipes: function() {
        var hole = Math.floor(Math.random()*5)+1;
        
        for (var i = 0; i < 8; i++)
            if (i != hole && i != hole +1)
                this.addOnePipe(400, i*60+10);   
    
        this.score += 1 ;
        this.labelScore.text = this.score;  
    },
} ;

game.state.add('main', mainState);  
game.state.start('main');
