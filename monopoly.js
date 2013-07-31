function addListeners(){

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

};

document.getElementById('add_player').addEventListener("click", function(){
  game.number_of_players = game.number_of_players + 1;
  document.getElementById('player_entry_form').innerHTML += "Player" + game.number_of_players + "'s Name: <input type='text' name='player" + game.number_of_players + "name'><br>";
  if (game.number_of_players == 8){
    document.getElementById('add_player').style.visibility = 'hidden';
  };
});

function Player(name){
   // Add object properties like this
   this.name = name;
   this.cash = 0;
};

function Property(name){
   // Add object properties like this
   this.name = name;
   this.cost = 0;
   this.owner = '';
};

function Game(){
   // Add object properties like this
   this.number_of_players = 2;
};


function RunGame(){
  game = new Game()
  addListeners()
};

RunGame();


