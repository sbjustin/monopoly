
var monopoly = {

  numberOfPlayers: 2,
  startingMoney: 1500,
  phase: 'playing', //diceRoll: 0?
  playersTurn: 0,
  gameOver: false,
  playersArray: [],
  properties: [],
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

    me.defProperties();

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

  currentPlayer: function(){
    return monopoly.playersArray[monopoly.playersTurn];
  },

  playGame: function(){
    monopoly.writeToOutputLog(monopoly.currentPlayer().name + ", it's your turn"); 
    monopoly.phase = 'diceRoll'
    monopoly.rollDice();
  },

  rollDice: function(){
      this.dice.addEventListener("click", function(){
        if (monopoly.phase == 'diceRoll'){
          var diceRoll = Math.floor(Math.random() * (12 - 2 + 1) + 2);
          monopoly.writeToOutputLog('You rolled a ' + diceRoll + '!');
          monopoly.phase = 'movePiece';
          monopoly.movePiece(diceRoll);
        }else{
          monopoly.writeToOutputLog('You cannot roll, you are in the ' + monopoly.phase + ' phase.');
        };
      });
  },

  movePiece: function(spaces){
    monopoly.currentPlayer().position += spaces;
    monopoly.writeToOutputLog("Player " + monopoly.currentPlayer().name + " moved to " + monopoly.currentPlayer().position + ".");
    monopoly.phase = "onProperty";
    monopoly.onProperty();
  },

  onProperty: function(){
    if (monopoly.properties[monopoly.currentPlayer().position].status == 'available'){
      monopoly.writeToOutputLog("Property is available");
      //output buttons for purchasing
    }else if (monopoly.properties[monopoly.currentPlayer().position].status == 'owned'){
      monopoly.writeToOutputLog("Property is owned");
    }else if (monopoly.properties[monopoly.currentPlayer().position].status == 'mortgaged'){
      monopoly.writeToOutputLog("Property is mortgaged");
    }else{
      monopoly.writeToOutputLog("Property is all jacked up" );
    };
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

  Property: function(name, cost, rent, group){
    //unchanging
    this.name = name;
    this.cost = cost;
    this.rent = rent;
    this.group = group;
    //Changeable
    this.owner = undefined;
    this.status = 'available';
    this.numberOfHouses = 0;

  },

  defProperties: function(){
    monopoly.properties[0] = new this.Property("Go",0, 0 ,"non-property");
    monopoly.properties[1] = new this.Property("Mediterranean Ave.",60, 2 ,"Purple");
    monopoly.properties[2] = new this.Property("Other",0, 0 ,"non-property");
    monopoly.properties[3] = new this.Property("Baltic Ave.",60, 4 ,"Purple");
    monopoly.properties[4] = new this.Property("Other",0, 0 ,"non-property");
    monopoly.properties[6] = new this.Property("Oriental Ave.",100 , 6 ,"Light-Green");
    monopoly.properties[7] = new this.Property("Other",0, 0 ,"non-property");
    monopoly.properties[8] = new this.Property("Vermont Ave.",100 , 6 ,"Light-Green");
    monopoly.properties[9] = new this.Property("Connecticut Ave.",120 , 8 ,"Light-Green");
    monopoly.properties[10] = new this.Property("Jail",0, 0 ,"non-property");
    monopoly.properties[11] = new this.Property("St. Charles Place",140 , 10,"Violet");
    monopoly.properties[13] = new this.Property("States Ave.",140 , 10,"Violet");
    monopoly.properties[14] = new this.Property("Virginia Ave.",160 , 12,"Violet");
    monopoly.properties[16] = new this.Property("St. James Place",180 , 14,"Orange");
    monopoly.properties[17] = new this.Property("Other",0, 0 ,"non-property");
    monopoly.properties[18] = new this.Property("Tennessee Ave.",180 , 14,"Orange");
    monopoly.properties[19] = new this.Property("New York Ave.",200 , 16,"Orange");
    monopoly.properties[20] = new this.Property("Free Parking",0, 0 ,"non-property");
    monopoly.properties[21] = new this.Property("Kentucky Ave.",220 , 18,"Red");
    monopoly.properties[22] = new this.Property("Other",0, 0 ,"non-property");
    monopoly.properties[23] = new this.Property("Indiana Ave.",220 , 18,"Red");
    monopoly.properties[24] = new this.Property("Illinois Ave.",240 , 20,"Red");
    monopoly.properties[26] = new this.Property("Atlantic Ave.",260 , 22,"Yellow");
    monopoly.properties[27] = new this.Property("Ventnor Ave.",260 , 22,"Yellow");
    monopoly.properties[29] = new this.Property("Marvin Gardens",280 , 22,"Yellow");
    monopoly.properties[30] = new this.Property("Go to Jail",0, 0 ,"non-property");
    monopoly.properties[31] = new this.Property("Pacific Ave.",300 , 26,"Dark-Green");
    monopoly.properties[32] = new this.Property("North Carolina Ave.",300 , 26,"Dark-Green");
    monopoly.properties[33] = new this.Property("Other",0, 0 ,"non-property");
    monopoly.properties[34] = new this.Property("Pennsylvania Ave.",320 , 28,"Dark-Green");
    monopoly.properties[36] = new this.Property("Other",0, 0 ,"non-property");
    monopoly.properties[37] = new this.Property("Park Place",350 , 35,"Dark-Blue");
    monopoly.properties[38] = new this.Property("Other",0, 0 ,"non-property");
    monopoly.properties[39] = new this.Property("Boardwalk",400 , 50,"Dark-Blue");

    monopoly.properties[12] = new this.Property("Electric Company",150 , -1 ,"Utility");
    monopoly.properties[28] = new this.Property("Water Works",150 , -1 ,"Utility");

    monopoly.properties[5] = new this.Property("Reading Railroad",200 , -2,"Railroad");
    monopoly.properties[15] = new this.Property("Pennsylvania Railroad",200 , -2,"Railroad");
    monopoly.properties[25] = new this.Property("B. & O. Railroad",200 , -2,"Railroad");
    monopoly.properties[35] = new this.Property("Short Line Railroad",200 , -2,"Railroad");
  }


  };

  monopoly.start();
