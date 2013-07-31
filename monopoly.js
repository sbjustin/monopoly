
var monopoly = {

  numberOfPlayers: 2,
  setupGame:       document.getElementById("setup_game"),
  startGame:       document.getElementById("start_game"),
  gamePanel:       document.getElementById("game_panel"),
  leftPane:        document.getElementById("left_pane"),
  rightPane:       document.getElementById("right_pane"),
  board:           document.getElementById("board"),
  dice:            document.getElementById("dice"),
  addPlayer:       document.getElementById('add_player'),
  playerEntryForm: document.getElementById('player_entry_form'),

  init: function(){
    var me = this;

    me.startGame.addEventListener("click", function(){
      me.setupGame.style.display = 'none';
      me.startGame.style.display = 'none';
      me.gamePanel.style.display = 'block';
      me.leftPane.style.display = 'block';
      me.rightPane.style.display = 'block';
      me.board.style.display = 'block';
      me.dice.style.display = 'block';
    });

    this.dice.addEventListener("click", function(){
      alert('Roll Dice!');
    });

    this.addPlayer.addEventListener("click", function(){
      me.numberOfPlayers = me.numberOfPlayers + 1;
      me.playerEntryForm.innerHTML += "Player" + me.numberOfPlayers + "'s Name: <input type='text' name='player" + me.numberOfPlayers + "name'><br>";
      if (me.numberOfPlayers == 8){
        me.addPlayer.style.visibility = 'hidden';
      };
    });
  },

  start: function(){
    this.init();
  }, 

  Player: function(){
    this.name = name;
    this.cash = 0;
    this.position = 0; //Position on board 0 -> 39
  },

  Property: function(){
    this.name = name;
    this.cost = 0;
    this.owner = '';
  }


  };

  monopoly.start();
