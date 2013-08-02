
var monopoly = {

  numberOfPlayers: 2,
  startingMoney: 1500,
  phase: 'playing', //diceroll
  gameOver: false,
  playersArray: [],
  setupGame:              document.getElementById("setup_game"),
  startGame:              document.getElementById("start_game"),
  gamePanel:              document.getElementById("game_panel"),
  leftPane:               document.getElementById("left_pane"),
  rightPane:              document.getElementById("right_pane"),
  board:                  document.getElementById("board"),
  dice:                   document.getElementById("dice"),
  addPlayer:              document.getElementById("add_player"),
  //playerEntryForm:        document.getElementById('player_entry_form'),
  playerEntryFormList:    document.getElementById("player_entry_form_list"),
  playerEntries:          document.getElementsByName("playername"),
  outputLog:              document.getElementById("output_log"),
  nextTurnButton:         document.getElementById("next_turn_button"),
  endGameButton:          document.getElementById("end_game_button"),

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

      me.setupPlayers();

      me.playGame();
    });

    me.endGameButton.addEventListener("click", function(){
      me.gameOver = true;
    });

    this.addPlayer.addEventListener("click", function(){
      me.numberOfPlayers = me.numberOfPlayers + 1;
      var newLI = document.createElement("LI");
      me.playerEntryFormList.appendChild(newLI);
      newLI.innerHTML = "Player" + me.numberOfPlayers + "'s Name: <input type='text' name='playername' class = 'player_entry_form_field'>";
      //One Liner to do it
      //me.playerEntryFormList.appendChild(document.createElement("LI")).innerHTML = "Player" + me.numberOfPlayers + "'s Name: <input type='text' name='player" + me.numberOfPlayers + "name' class = 'player_entry_form_field'>";
      if (me.numberOfPlayers == 8){
        me.addPlayer.style.visibility = 'hidden';
      };
    });
  },

  start: function(){
    this.init();
  }, 

  playGame: function(){
    //while (monopoly.gameOver != true){
      for (var i = 0; i < monopoly.numberOfPlayers; i++){
        monopoly.writeToOutputLog(monopoly.playersArray[i].name + ", it's your turn"); 
        monopoly.phase = 'diceroll';
        monopoly.allowRollDice();
        //monopoly.phase = 'move';
      }
      
      // check - is there a winner?
      monopoly.gameOver = true;
      monopoly.writeToOutputLog('Game Over');
    //};
  },

  allowRollDice: function(){
      this.dice.addEventListener("click", function(){
        if (monopoly.phase == 'diceroll'){
          var diceRoll = Math.floor(Math.random() * (12 - 2 + 1) + 2);
          monopoly.writeToOutputLog('You rolled a ' + Math.floor(Math.random() * (12 - 2 + 1) + 2) + '!');
          monopoly.phase == 'complete';
        };
      });
  },

  setupPlayers: function(){ 
    monopoly.writeToOutputLog(this.numberOfPlayers + " players are joining");
    for (var i = 0; i < this.numberOfPlayers; ++i) {
      this.playersArray[i] = new this.Player(this.playerEntries[i].value);  
      monopoly.writeToOutputLog("Player " + this.playersArray[i].name + " has joined the game.");
    };
    
  },

  writeToOutputLog: function(notice){
    var newLI = document.createElement("LI");
    monopoly.outputLog.insertBefore(newLI, monopoly.outputLog.childNodes[0]);
    newLI.innerHTML = notice;
    if (monopoly.outputLog.childNodes.length > 20){
      monopoly.outputLog.removeChild(monopoly.outputLog.lastChild);
    };
  },

  Player: function(name){
    this.name = name;
    this.cash = monopoly.startingMoney;
    this.position = 0; //Position on board 0 -> 39
  },

  Property: function(){
    this.name = name;
    this.cost = monopoly.startingMoney;
    this.owner = '';
  }


  };

  monopoly.start();
