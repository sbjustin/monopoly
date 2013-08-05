
var monopoly = {

  numberOfPlayers: 2,
  startingMoney: 1500,
  phase: 'playing', //diceRoll: 0?
  playersTurn: 0,
  gameOver: false,
  playersArray: [],
  properties: [],
  pieces: [],
  setupGame:              document.getElementById("setup_game"),
  startGame:              document.getElementById("start_game"),
  gamePanel:              document.getElementById("game_panel"),
  leftPane:               document.getElementById("left_pane"),
  rightPane:              document.getElementById("right_pane"),
  board:                  document.getElementById("board"),
  dice:                   document.getElementById("dice"),
  addPlayer:              document.getElementById("add_player"),
  playerEntryFormList:    document.getElementById("player_entry_form_list"),
  playerEntries:          document.getElementsByName("playername"),
  outputLog:              document.getElementById("output_log"),
  nextTurnButton:         document.getElementById("next_turn_button"),
  endGameButton:          document.getElementById("end_game_button"),
  buyPropertyButton:      document.getElementById("buy_property_button"),
  skipPropertyButton:     document.getElementById("skip_property_button"),
  // shipPiece:              document.getElementById("ship_piece"),
  // dogPiece:               document.getElementById("dog_piece"),
  propertyPieceBoxes:     document.getElementsByClassName("pieces_box"),

  // propertyPieceBox: function(box){
  //   if(box <= 10){
  //     return propertyPieceBoxes[40 - (30 + box)]
  //   };
  // },
  //listeners
  buyPropertyListener: function(){
      monopoly.properties[monopoly.currentPlayer().position].status = 'owned';
      monopoly.properties[monopoly.currentPlayer().position].owner = monopoly.playersTurn;
      monopoly.currentPlayer().cash -= monopoly.properties[monopoly.currentPlayer().position].cost;
      monopoly.writeToOutputLog(monopoly.currentPlayer().name + " now has " + monopoly.currentPlayer().cash + "dollars.");
      monopoly.removePropertyListeners();
      monopoly.nextPlayer();
    },

  skipPropertyListener: function(){
    monopoly.removePropertyListeners();
    monopoly.nextPlayer();
  },

  init: function(){
    var me = this;

    //remove this stuff for real game
    this.playerEntries[0].value = "Justin";
    this.playerEntries[1].value = "Cat"
    ////////////////////////////////////////////

    me.defProperties();
    me.defPieces();
    me.reorderPropertyPieceBoxes();

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
    //remove this stuff for real game
    monopoly.startGame.click();
    ////////////////////////////////////////////    
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
    this.writeToOutputLog(monopoly.currentPlayer().name + ", it's your turn"); 
    this.phase = 'diceRoll'
    this.rollDice();
  },

  rollDice: function(){
    var diceListener = function(){
          var diceRoll = Math.floor(Math.random() * (12 - 2 + 1) + 2);
          monopoly.writeToOutputLog('You rolled a ' + diceRoll + '!');
          monopoly.phase = 'movePiece';
          monopoly.movePiece(diceRoll);
          monopoly.dice.removeEventListener('click', diceListener);  
      };
      this.dice.addEventListener("click", diceListener);
          
  },

  movePiece: function(spaces){
    //monopoly.propertyPieceBoxes[0].innerHTML = monopoly.pieces[0].htmlCode
    //remove piece
    monopoly.propertyPieceBoxes[monopoly.properties[monopoly.currentPlayer().position].piecePosition].innerHTML = monopoly.propertyPieceBoxes[monopoly.currentPlayer().position].innerHTML.replace(monopoly.pieces[monopoly.currentPlayer().piece].htmlCode,"");
    
    if (monopoly.currentPlayer().position + spaces > 39 ){
      monopoly.currentPlayer().position = spaces - (40 - monopoly.currentPlayer().position);
    }
    else{
      monopoly.currentPlayer().position += spaces;
    };
    
    monopoly.propertyPieceBoxes[monopoly.properties[monopoly.currentPlayer().position].piecePosition].innerHTML = monopoly.propertyPieceBoxes[monopoly.currentPlayer().position].innerHTML + monopoly.pieces[monopoly.currentPlayer().piece].htmlCode;
    //monopoly.pieces[monopoly.playersTurn].setPosition(monopoly.properties[monopoly.currentPlayer().position]);
    monopoly.writeToOutputLog("Player " + monopoly.currentPlayer().name + " moved to " + monopoly.currentPlayer().position + ".");
    monopoly.phase = "onProperty";
    monopoly.onProperty();
  },

  onProperty: function(){
    if (monopoly.properties[monopoly.currentPlayer().position].status == 'available'){
      monopoly.writeToOutputLog("Property is available");
      monopoly.addPropertyListeners();
    }else if (monopoly.properties[monopoly.currentPlayer().position].status == 'owned'){
      monopoly.writeToOutputLog("Property is owned");
    }else if (monopoly.properties[monopoly.currentPlayer().position].status == 'mortgaged'){
      monopoly.writeToOutputLog("Property is mortgaged");
    }else{
      monopoly.writeToOutputLog("Property is all jacked up" );
    };
  }, 

  addPropertyListeners: function(){
    monopoly.buyPropertyButton.style.display = 'block';
    monopoly.skipPropertyButton.style.display = 'block';
    monopoly.buyPropertyButton.addEventListener("click", monopoly.buyPropertyListener);
    monopoly.skipPropertyButton.addEventListener("click", monopoly.skipPropertyListener);
  },

  removePropertyListeners: function(){
    monopoly.buyPropertyButton.style.display = 'none';
    monopoly.skipPropertyButton.style.display = 'none';
    monopoly.buyPropertyButton.removeEventListener("click", monopoly.buyPropertyListener);
    monopoly.skipPropertyButton.removeEventListener("click", monopoly.skipPropertyListener);  
  },

  setupPlayers: function(){ 
    monopoly.writeToOutputLog(this.numberOfPlayers + " players are joining");
    for (var i = 0; i < this.numberOfPlayers; ++i) {
      this.playersArray[i] = new this.Player(this.playerEntries[i].value, i);  
      monopoly.writeToOutputLog("Player " + this.playersArray[i].name + " has joined the game.");
    };
    
  },

  nextPlayer: function(){
    if (monopoly.numberOfPlayers - 1 == monopoly.playersTurn){
      monopoly.playersTurn = 0;
    }else{
      monopoly.playersTurn += 1;
    };
    monopoly.writeToOutputLog(monopoly.currentPlayer().name + ", it's your turn"); 
    monopoly.rollDice();
  },

  writeToOutputLog: function(notice){
    var newLI = document.createElement("LI");
    monopoly.outputLog.insertBefore(newLI, monopoly.outputLog.childNodes[0]);
    newLI.innerHTML = notice;
    if (monopoly.outputLog.childNodes.length > 20){
      monopoly.outputLog.removeChild(monopoly.outputLog.lastChild);
    };
  },

  Player: function(name, piece){
    this.name = name;
    this.cash = monopoly.startingMoney;
    this.piece = piece;
    this.position = 0; //Position on board 0 -> 39
  },

  Property: function(name, cost, rent, group, position){
    //Pixels to top left corner from left to right   0 90 142 192  242  296 348  400 452 504 554
    //unchanging
    this.name = name;
    this.cost = cost;
    this.rent = rent;
    this.group = group;
    //Changeable
    this.owner = undefined;
    this.status = 'available';
    this.numberOfHouses = 0;
    this.piecePosition = position;
  },

  Piece: function(name, css_id, htmlCode){
    this.name = name;
    this.css_id = css_id;
    this.htmlCode = htmlCode;
    this.setPosition = function(property){
      // set x and y position of property
      if (css_id == "dog_piece"){
        monopoly.dogPiece.style.left = property.piecePosition[0];
        monopoly.dogPiece.style.top = property.piecePosition[1];
      }
      else if (css_id == "ship_piece"){
        monopoly.shipPiece.style.left = property.piecePosition[0];
        monopoly.shipPiece.style.top = property.piecePosition[1];
      };
    };  
    // this.setPosition(monopoly.properties[0]);
  },

  defPieces: function(){
    monopoly.pieces[0] = new this.Piece("Doggy", "dog_piece", "<img src = 'images/dog_piece.png' class = 'monopoly_piece 'id = 'dog_piece'/>");
    monopoly.pieces[1] = new this.Piece("Ship", "ship_piece", "<img src = 'images/ship_piece.png' class = 'monopoly_piece'  id = 'ship_piece'/>");

        

  },

  defProperties: function(){
    monopoly.properties[0] = new this.Property("Go",0, 0 ,"non-property", 39);
    monopoly.properties[1] = new this.Property("Mediterranean Ave.",60, 2 ,"Purple", 38);
    monopoly.properties[2] = new this.Property("Other",0, 0 ,"non-property", 37);
    monopoly.properties[3] = new this.Property("Baltic Ave.",60, 4 ,"Purple", 36);
    monopoly.properties[4] = new this.Property("Other",0, 0 ,"non-property", 35);
    //5
    monopoly.properties[6] = new this.Property("Oriental Ave.",100 , 6 ,"Light-Green", 33);
    monopoly.properties[7] = new this.Property("Other",0, 0 ,"non-property", 32);
    monopoly.properties[8] = new this.Property("Vermont Ave.",100 , 6 ,"Light-Green", 31);
    monopoly.properties[9] = new this.Property("Connecticut Ave.",120 , 8 ,"Light-Green", 30);
    monopoly.properties[10] = new this.Property("Jail",0, 0 ,"non-property", 29);
    monopoly.properties[11] = new this.Property("St. Charles Place",140 , 10,"Violet", 19);
    //12
    monopoly.properties[13] = new this.Property("States Ave.",140 , 10,"Violet", 17);
    monopoly.properties[14] = new this.Property("Virginia Ave.",160 , 12,"Violet", 16);
    //15
    monopoly.properties[16] = new this.Property("St. James Place",180 , 14,"Orange", 14);
    monopoly.properties[17] = new this.Property("Other",0, 0 ,"non-property", 13);
    monopoly.properties[18] = new this.Property("Tennessee Ave.",180 , 14,"Orange", 12);
    monopoly.properties[19] = new this.Property("New York Ave.",200 , 16,"Orange", 11);
    monopoly.properties[20] = new this.Property("Free Parking",0, 0 ,"non-property", 0);
    monopoly.properties[21] = new this.Property("Kentucky Ave.",220 , 18,"Red", 1);
    monopoly.properties[22] = new this.Property("Other",0, 0 ,"non-property", 2);
    monopoly.properties[23] = new this.Property("Indiana Ave.",220 , 18,"Red", 3);
    monopoly.properties[24] = new this.Property("Illinois Ave.",240 , 20,"Red", 4);
    //25
    monopoly.properties[26] = new this.Property("Atlantic Ave.",260 , 22,"Yellow", 6);
    monopoly.properties[27] = new this.Property("Ventnor Ave.",260 , 22,"Yellow", 7);
    //28
    monopoly.properties[29] = new this.Property("Marvin Gardens",280 , 22,"Yellow", 9);
    monopoly.properties[30] = new this.Property("Go to Jail",0, 0 ,"non-property", 10);
    monopoly.properties[31] = new this.Property("Pacific Ave.",300 , 26,"Dark-Green", 20);
    monopoly.properties[32] = new this.Property("North Carolina Ave.",300 , 26,"Dark-Green", 21);
    monopoly.properties[33] = new this.Property("Other",0, 0 ,"non-property", 22);
    monopoly.properties[34] = new this.Property("Pennsylvania Ave.",320 , 28,"Dark-Green", 23);
    //35
    monopoly.properties[36] = new this.Property("Other",0, 0 ,"non-property", 25);
    monopoly.properties[37] = new this.Property("Park Place",350 , 35,"Dark-Blue", 26);
    monopoly.properties[38] = new this.Property("Other",0, 0 ,"non-property", 27);
    monopoly.properties[39] = new this.Property("Boardwalk",400 , 50,"Dark-Blue", 28);

    monopoly.properties[12] = new this.Property("Electric Company",150 , -1 ,"Utility", 18);
    monopoly.properties[28] = new this.Property("Water Works",150 , -1 ,"Utility", 8);

    monopoly.properties[5] = new this.Property("Reading Railroad",200 , -2,"Railroad", 34);
    monopoly.properties[15] = new this.Property("Pennsylvania Railroad",200 , -2,"Railroad", 15);
    monopoly.properties[25] = new this.Property("B. & O. Railroad",200 , -2,"Railroad", 5);
    monopoly.properties[35] = new this.Property("Short Line Railroad",200 , -2,"Railroad", 24);


  }, 

  reorderPropertyPieceBoxes: function(){

  }


  };

  monopoly.start();
