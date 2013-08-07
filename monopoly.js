
var monopoly = {

  numberOfPlayers: 2,
  startingMoney: 1500,
  phase: 'playing', //diceRoll: 0?
  playersTurn: 0,
  gameOver: false,
  playersArray: [],
  properties: [],
  pieces: [],
  chanceCards: [],
  communityChestCards: [],
  freeParkingMoney: 0,
  housesAvailableForPurchase: 32,
  hotelsAvailableForPurchase: 12,
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
  incomeTaxPercentButton: document.getElementById("income_tax_percent_button"),
  incomeTax200Button:     document.getElementById("income_tax_200_button"),
  propertyPieceBoxes:     document.getElementsByClassName("pieces_box"),

  buyPropertyListener: function(){
      monopoly.removePropertyListeners();
      monopoly.currentPlayer().buyProperty(monopoly.properties[monopoly.currentPlayer().position])
      monopoly.currentPlayer().refreshPropertyDisplay();
      monopoly.nextPlayer();
    },

  skipPropertyListener: function(){
    monopoly.removePropertyListeners();
    monopoly.nextPlayer();
  },

  incomeTaxPercentageListener: function(){
    monopoly.currentPlayer().payIncomeTaxPercentage();
    monopoly.incomeTaxPercentButton.removeEventListener('click', monopoly.incomeTaxPercentageListener);
    monopoly.incomeTaxPercentButton.style.display = 'none';
    monopoly.incomeTax200Button.style.display = 'none';
    monopoly.writeToOutputLog(monopoly.currentPlayer().name + ' now has  ' + monopoly.currentPlayer().cash + 'dollars.');
    monopoly.nextPlayer();
  },

  incomeTax200DollarsListener: function(){
    monopoly.currentPlayer().payIncomeTax200Dollars();
    monopoly.incomeTax200Button.removeEventListener('click', monopoly.incomeTax200DollarsListener);
    monopoly.incomeTax200Button.style.display = 'none';
    monopoly.incomeTaxPercentButton.style.display = 'none';
    //TODO: move to remove listeners function
    monopoly.writeToOutputLog(monopoly.currentPlayer().name + ' now has  ' + monopoly.currentPlayer().cash + 'dollars.');
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
    me.defCards();

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

    this.addPlayer.addEventListener("click", function(){
      me.numberOfPlayers = me.numberOfPlayers + 1;
      var newLI = document.createElement("LI");
      me.playerEntryFormList.appendChild(newLI);
      newLI.innerHTML = "Player" + me.numberOfPlayers + "'s Name: <input type='text' name='playername' class = 'player_entry_form_field'>";
      //One Liner to do it
      //me.playerEntryFormList.appendChild(document.createElement("LI")).innerHTML = "Player" + me.numberOfPlayers + "'s Name: <input type='text' name='player" + me.numberOfPlayers + "name' class = 'player_entry_form_field'>";
      if (me.numberOfPlayers == 4){
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
          //diceRoll = 4;
          monopoly.writeToOutputLog('You rolled a ' + diceRoll + '!');
          monopoly.phase = 'movePiece';
          monopoly.movePiece(diceRoll);
          monopoly.dice.removeEventListener('click', diceListener);  
      };
      this.dice.addEventListener("click", diceListener);
          
  },

  movePiece: function(spaces){
    
    //remove piece
    monopoly.pieces[monopoly.currentPlayer().piece].remove();
    
    if (monopoly.currentPlayer().position + spaces > 39 ){
      monopoly.currentPlayer().position = spaces - (40 - monopoly.currentPlayer().position);
    }
    else{
      monopoly.currentPlayer().position += spaces;
    };
    
    //draw piece
    monopoly.pieces[monopoly.currentPlayer().piece].add();
    
    monopoly.writeToOutputLog("Player " + monopoly.currentPlayer().name + " moved to " + monopoly.properties[monopoly.currentPlayer().position].name + ".");
    monopoly.phase = "onProperty";
    monopoly.onProperty();
  },

  onProperty: function(){
    if (monopoly.properties[monopoly.currentPlayer().position].status == 'available'){
      monopoly.addBuyPropertyListener();
      monopoly.addSkipPropertyListener();

      monopoly.writeToOutputLog("Property is available");
    }else if (monopoly.properties[monopoly.currentPlayer().position].status == 'owned'){
      //regular property - pay rent
      monopoly.currentPlayer().payRent(monopoly.properties[monopoly.currentPlayer().position].rent, monopoly.properties[monopoly.currentPlayer().position].owner);
      monopoly.writeToOutputLog(monopoly.currentPlayer().name + ' just landed on a property owned by ' + monopoly.playersArray[monopoly.properties[monopoly.currentPlayer().position].owner].name);
      monopoly.writeToOutputLog(monopoly.currentPlayer().name + ' now has  ' + monopoly.currentPlayer().cash + 'dollars.');
      monopoly.writeToOutputLog(monopoly.playersArray[monopoly.properties[monopoly.currentPlayer().position].owner].name + ' now has  ' + monopoly.playersArray[monopoly.properties[monopoly.currentPlayer().position].owner].cash + 'dollars.');
      monopoly.nextPlayer();
      
      //if utility
      //if railroad
    }else if (monopoly.properties[monopoly.currentPlayer().position].status == 'mortgaged'){
      monopoly.writeToOutputLog("Property is mortgaged");
      monopoly.nextPlayer();
    }else if (monopoly.properties[monopoly.currentPlayer().position].status == 'go'){
      monopoly.writeToOutputLog("Property is Go and not available for purchase" );
    }else if (monopoly.properties[monopoly.currentPlayer().position].status == 'go_to_jail'){
      
    }else if (monopoly.properties[monopoly.currentPlayer().position].status == 'jail'){
      
    }else if (monopoly.properties[monopoly.currentPlayer().position].status == 'chance'){
      
    }else if (monopoly.properties[monopoly.currentPlayer().position].status == 'community_chest'){
      
    }else if (monopoly.properties[monopoly.currentPlayer().position].status == 'free_parking'){
      
    }else if (monopoly.properties[monopoly.currentPlayer().position].status == 'income_tax'){
      monopoly.addIncomeTaxPercentageListener();
      monopoly.addIncomeTax200DollarsListener();
    }else if (monopoly.properties[monopoly.currentPlayer().position].status == 'luxury_tax'){
          
    }else{
      monopoly.writeToOutputLog("Property is not available for purchase" );
      monopoly.nextPlayer();
    };
  }, 

  addBuyPropertyListener: function(){
    monopoly.buyPropertyButton.style.display = 'block';
    monopoly.buyPropertyButton.addEventListener("click", monopoly.buyPropertyListener);
  },

  addSkipPropertyListener: function(){
    monopoly.skipPropertyButton.style.display = 'block';
    monopoly.skipPropertyButton.addEventListener("click", monopoly.skipPropertyListener);
  },

  removePropertyListeners: function(){
    monopoly.buyPropertyButton.style.display = 'none';
    monopoly.skipPropertyButton.style.display = 'none';
    monopoly.buyPropertyButton.removeEventListener("click", monopoly.buyPropertyListener);
    monopoly.skipPropertyButton.removeEventListener("click", monopoly.skipPropertyListener);  
  },

  addIncomeTaxPercentageListener: function(){
    monopoly.incomeTaxPercentButton.style.display = 'block';
    monopoly.incomeTaxPercentButton.addEventListener("click", monopoly.incomeTaxPercentageListener);
  },

  addIncomeTax200DollarsListener: function(){
    monopoly.incomeTax200Button.style.display = 'block';
    monopoly.incomeTax200Button.addEventListener("click", monopoly.incomeTax200DollarsListener);
  },

  setupPlayers: function(){ 
    monopoly.writeToOutputLog(this.numberOfPlayers + " players are joining");
    for (var i = 0; i < this.numberOfPlayers; ++i) {
      this.playersArray[i] = new this.Player(this.playerEntries[i].value, i);  
      monopoly.propertyPieceBoxes[monopoly.properties[0].piecePosition].innerHTML = monopoly.propertyPieceBoxes[monopoly.properties[0].piecePosition].innerHTML + monopoly.pieces[monopoly.playersArray[i].piece].htmlCode;
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
    this.ownedProperties = [];
    this.divPosition = function(){
      return monopoly.propertyPieceBoxes[monopoly.properties[this.position].piecePosition];
    };
    this.payRent = function(rent, toPlayer){
      this.cash = this.cash - rent;
      monopoly.playersArray[toPlayer].cash = monopoly.playersArray[toPlayer].cash + rent;
    };
    this.buyProperty = function(property){
      property.status = 'owned';
      property.owner = monopoly.playersTurn;
      this.ownedProperties.push(monopoly.currentPlayer().position);
      this.cash -= property.cost;
      monopoly.writeToOutputLog(this.name + " now has " + this.cash + "dollars.");
    };
    this.refreshPropertyDisplay = function(){
      this.propertyBox = document.getElementById("player" + this.position + '_list');
      for (var i = 0; i < this.ownedProperties.length; i++) {
        monopoly.writeToOutputLog(this.name + ' has purchased ' + monopoly.properties[this.ownedProperties[i]].name + '.');
      };
    };
    this.payIncomeTaxPercentage = function(){
      this.cash -= (this.cash * .1);
    };
    this.payIncomeTax200Dollars = function(){
      this.cash -= 200;
    };

  },

  Property: function(name, cost, rent, group, position){
    //unchanging
    this.name = name;
    this.cost = cost;
    this.rent = rent;
    this.group = group;
    //Changeable
    this.owner = undefined;
    if(group != 'non-property'){
      this.status = 'available';
    };
    this.numberOfHouses = 0;
    this.numberOfHotels = 0;
    this.piecePosition = position;

  },

  Piece: function(name, css_id, htmlCode){
    this.name = name;
    this.css_id = css_id;
    this.htmlCode = htmlCode;
    this.add = function(){
      monopoly.currentPlayer().divPosition().innerHTML = monopoly.currentPlayer().divPosition().innerHTML + this.htmlCode;
    };
    this.remove = function(){
      this.elem = document.getElementById(css_id);
      this.elem.parentElement.removeChild(this.elem);
    };
  },

  Card: function(description, action){
    this.description = description;
    this.action = action;
  },

  defCards: function(){

  },

  defPieces: function(){
    monopoly.pieces[0] = new this.Piece("Car", "car_piece", "<img src = 'images/car_piece.png' class = 'monopoly_piece 'id = 'car_piece'/>");
    monopoly.pieces[1] = new this.Piece("Doggy", "dog_piece", "<img src = 'images/dog_piece.png' class = 'monopoly_piece 'id = 'dog_piece'/>");
    monopoly.pieces[2] = new this.Piece("Ship", "ship_piece", "<img src = 'images/ship_piece.png' class = 'monopoly_piece'  id = 'ship_piece'/>");
    monopoly.pieces[3] = new this.Piece("Hat", "hat_piece", "<img src = 'images/hat_piece.png' class = 'monopoly_piece'  id = 'hat_piece'/>");
        

  },

  defProperties: function(){
    monopoly.properties[0] = new this.Property("Go",0, 0 ,"non-property", 39); monopoly.properties[0].status = 'go';
    monopoly.properties[1] = new this.Property("Mediterranean Ave.",60, 2 ,"Purple", 38);
    monopoly.properties[2] = new this.Property("Community Chest",0, 0 ,"non-property", 37); monopoly.properties[2].status = 'community_chest';
    monopoly.properties[3] = new this.Property("Baltic Ave.",60, 4 ,"Purple", 36);
    monopoly.properties[4] = new this.Property("Income Tax",0, 0 ,"non-property", 35); monopoly.properties[4].status = 'income_tax';
    //5
    monopoly.properties[6] = new this.Property("Oriental Ave.",100 , 6 ,"Light-Green", 33);
    monopoly.properties[7] = new this.Property("Chance",0, 0 ,"non-property", 32); monopoly.properties[7].status = 'chance';
    monopoly.properties[8] = new this.Property("Vermont Ave.",100 , 6 ,"Light-Green", 31);
    monopoly.properties[9] = new this.Property("Connecticut Ave.",120 , 8 ,"Light-Green", 30);
    monopoly.properties[10] = new this.Property("Jail",0, 0 ,"non-property", 29); monopoly.properties[10].status = 'jail';
    monopoly.properties[11] = new this.Property("St. Charles Place",140 , 10,"Violet", 19);
    //12
    monopoly.properties[13] = new this.Property("States Ave.",140 , 10,"Violet", 17);
    monopoly.properties[14] = new this.Property("Virginia Ave.",160 , 12,"Violet", 16);
    //15
    monopoly.properties[16] = new this.Property("St. James Place",180 , 14,"Orange", 14);
    monopoly.properties[17] = new this.Property("Community Chest",0, 0 ,"non-property", 13); monopoly.properties[17].status = 'community_chest';
    monopoly.properties[18] = new this.Property("Tennessee Ave.",180 , 14,"Orange", 12);
    monopoly.properties[19] = new this.Property("New York Ave.",200 , 16,"Orange", 11);
    monopoly.properties[20] = new this.Property("Free Parking",0, 0 ,"non-property", 0); monopoly.properties[20].status = 'free_parking';
    monopoly.properties[21] = new this.Property("Kentucky Ave.",220 , 18,"Red", 1);
    monopoly.properties[22] = new this.Property("Chance",0, 0 ,"non-property", 2); monopoly.properties[22].status = 'chance';
    monopoly.properties[23] = new this.Property("Indiana Ave.",220 , 18,"Red", 3);
    monopoly.properties[24] = new this.Property("Illinois Ave.",240 , 20,"Red", 4);
    //25
    monopoly.properties[26] = new this.Property("Atlantic Ave.",260 , 22,"Yellow", 6);
    monopoly.properties[27] = new this.Property("Ventnor Ave.",260 , 22,"Yellow", 7);
    //28
    monopoly.properties[29] = new this.Property("Marvin Gardens",280 , 22,"Yellow", 9);
    monopoly.properties[30] = new this.Property("Go to Jail",0, 0 ,"non-property", 10); monopoly.properties[30].status = 'go_to_jail';
    monopoly.properties[31] = new this.Property("Pacific Ave.",300 , 26,"Dark-Green", 20);
    monopoly.properties[32] = new this.Property("North Carolina Ave.",300 , 26,"Dark-Green", 21);
    monopoly.properties[33] = new this.Property("Community Chest",0, 0 ,"non-property", 22); monopoly.properties[33].status = 'community_chest';
    monopoly.properties[34] = new this.Property("Pennsylvania Ave.",320 , 28,"Dark-Green", 23);
    //35
    monopoly.properties[36] = new this.Property("Chance",0, 0 ,"non-property", 25); monopoly.properties[36].status = 'chance';
    monopoly.properties[37] = new this.Property("Park Place",350 , 35,"Dark-Blue", 26);
    monopoly.properties[38] = new this.Property("Luxury Tax",0, 0 ,"non-property", 27); monopoly.properties[38].status = 'luxury_tax';
    monopoly.properties[39] = new this.Property("Boardwalk",400 , 50,"Dark-Blue", 28);

    monopoly.properties[12] = new this.Property("Electric Company",150 , -1 ,"Utility", 18);
    monopoly.properties[28] = new this.Property("Water Works",150 , -1 ,"Utility", 8);

    monopoly.properties[5] = new this.Property("Reading Railroad",200 , -2,"Railroad", 34);
    monopoly.properties[15] = new this.Property("Pennsylvania Railroad",200 , -2,"Railroad", 15);
    monopoly.properties[25] = new this.Property("B. & O. Railroad",200 , -2,"Railroad", 5);
    monopoly.properties[35] = new this.Property("Short Line Railroad",200 , -2,"Railroad", 24);


  }

};

  monopoly.start();
