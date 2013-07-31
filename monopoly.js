
var monopoly = {

  number_of_players: 2,

  init: function(){
    var startGame = document.getElementById("start_game");
    startGame.addEventListener("click", function(){
      document.getElementById("setup_game").style.display = 'none';
      document.getElementById("start_game").style.display = 'none';
      document.getElementById("game_panel").style.display = 'block';
      document.getElementById("left_pane").style.display = 'block';
      document.getElementById("right_pane").style.display = 'block';
      document.getElementById("board").style.display = 'block';
      document.getElementById("dice").style.display = 'block';
    });

    var dice = document.getElementById("dice");
    dice.addEventListener("click", function(){
      alert('Roll Dice!')
    });

    document.getElementById('add_player').addEventListener("click", function(){
      monopoly.number_of_players = monopoly.number_of_players + 1;
      document.getElementById('player_entry_form').innerHTML += "Player" + monopoly.number_of_players + "'s Name: <input type='text' name='player" + monopoly.number_of_players + "name'><br>";
      if (monopoly.number_of_players == 8){
        document.getElementById('add_player').style.visibility = 'hidden';
      };
    });
  },

  startGame: function(){
    this.init();
    //alert("get it on");
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

  monopoly.startGame();
