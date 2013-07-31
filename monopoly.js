$('#add_player').click(function(){
  game.number_of_players = game.number_of_players + 1;
  $('#setup_game form').append("Player" + game.number_of_players + "'s Name: <input type='text' name='player" + game.number_of_players + "name'><br>");
  if (game.number_of_players == 8){
    $('#add_player').hide();
  };
});


$('#start_game').click(function(){
  $("#setup_game").hide();
  $('#start_game').hide();
  $('#game_panel').show();
  $('#left_pane').show();
  $('#right_pane').show();
  $('#board').show();
  $('#dice').show();
});

$('#dice').click(function(){
  alert('Roll Dice!')
});


function skip_user_input(){
  $('#start_game').click();
};



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
};

//skip_user_input();
RunGame();