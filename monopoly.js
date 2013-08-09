
var monopoly = {

  numberOfPlayers: 2,
  startingMoney: 1500,
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
  diceRoll: 0,
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
  propertyModal:          document.getElementById("property_modal"),

  buyPropertyListener: function(){
    monopoly.removePropertyListeners();
    monopoly.currentPlayer().buyProperty(monopoly.properties[monopoly.currentPlayer().position])
    monopoly.currentPlayer().refreshPlayerDisplay();
    monopoly.nextPlayer();
  },

  skipPropertyListener: function(){
    monopoly.removePropertyListeners();
    monopoly.nextPlayer();
  },

  incomeTaxPercentageListener: function(){
    monopoly.currentPlayer().payIncomeTaxPercentage();
    monopoly.removeIncomeTaxListeners();
  },

  incomeTax200DollarsListener: function(){
    monopoly.currentPlayer().payIncomeTax200Dollars();
    monopoly.removeIncomeTaxListeners();
  },

  removeIncomeTaxListeners: function(){
    monopoly.incomeTaxPercentButton.removeEventListener('click', monopoly.incomeTaxPercentageListener);
    monopoly.incomeTax200Button.removeEventListener('click', monopoly.incomeTax200DollarsListener);
    monopoly.incomeTax200Button.style.display = 'none';
    monopoly.incomeTaxPercentButton.style.display = 'none';
    monopoly.writeToOutputLog(monopoly.currentPlayer().name + ' now has  ' + monopoly.currentPlayer().cash + 'dollars.');
    monopoly.currentPlayer().refreshPlayerDisplay();
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
     // monopoly.properties[1].showModal();
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
    this.playerBox = document.getElementById("player" + monopoly.currentPlayer().order + "_list");
    this.playerBox.childNodes[0].style.border = '3px solid blue';
    
    this.rollDice();
  },

  rollDice: function(){
    var diceListener = function(){
          monopoly.diceRoll = Math.floor(Math.random() * (12 - 2 + 1) + 2);
          monopoly.diceRoll = 5;
          monopoly.writeToOutputLog('You rolled a ' + monopoly.diceRoll + '!');
          monopoly.movePiece(monopoly.diceRoll);
          monopoly.dice.removeEventListener('click', diceListener);  
      };
      this.dice.addEventListener("click", diceListener);
          
  },

  movePiece: function(spaces){
    
    //remove piece
    monopoly.pieces[monopoly.currentPlayer().piece].remove();
    
    if (monopoly.currentPlayer().position + spaces > 39 ){
      monopoly.currentPlayer().cash += 200;
      monopoly.currentPlayer().position = spaces - (40 - monopoly.currentPlayer().position);
    }
    else{
      monopoly.currentPlayer().position += spaces;
    };
    
    //draw piece
    monopoly.pieces[monopoly.currentPlayer().piece].add();
    
    monopoly.writeToOutputLog("Player " + monopoly.currentPlayer().name + " moved to " + monopoly.properties[monopoly.currentPlayer().position].name + ".");
    monopoly.onProperty();
  },

  onProperty: function(){
    
    if (monopoly.properties[monopoly.currentPlayer().position].status == 'available'){
      monopoly.addBuyPropertyListener();
      monopoly.addSkipPropertyListener();

      monopoly.writeToOutputLog("Property is available");
    }else if (monopoly.properties[monopoly.currentPlayer().position].status == 'owned'){
      if (monopoly.properties[monopoly.currentPlayer().position].group == 'utility'){
        //if both utilities
        if(monopoly.properties[12].owner == monopoly.properties[28].owner){
          monopoly.currentPlayer().payRent(monopoly.diceRoll * 10, monopoly.properties[monopoly.currentPlayer().position].owner);
        }else{
          monopoly.currentPlayer().payRent(monopoly.diceRoll * 4, monopoly.properties[monopoly.currentPlayer().position].owner);
        };
        monopoly.writeToOutputLog('utility');
        monopoly.nextPlayer();
      }else if(monopoly.properties[monopoly.currentPlayer().position].group == 'railroad'){
        
        monopoly.writeToOutputLog('railroad');

      }else{
        monopoly.currentPlayer().payRent(monopoly.properties[monopoly.currentPlayer().position].rent, monopoly.properties[monopoly.currentPlayer().position].owner);
        monopoly.writeToOutputLog(monopoly.currentPlayer().name + ' just landed on a property owned by ' + monopoly.playersArray[monopoly.properties[monopoly.currentPlayer().position].owner].name);
        monopoly.nextPlayer();
        };
    }else if (monopoly.properties[monopoly.currentPlayer().position].status == 'mortgaged'){
      monopoly.writeToOutputLog("Property is mortgaged");
      monopoly.nextPlayer();
    }else if (monopoly.properties[monopoly.currentPlayer().position].status == 'go'){
      monopoly.writeToOutputLog("Property is Go and not available for purchase" );
    }else if (monopoly.properties[monopoly.currentPlayer().position].status == 'go_to_jail'){
      monopoly.nextPlayer();
    }else if (monopoly.properties[monopoly.currentPlayer().position].status == 'jail'){
      monopoly.nextPlayer();
    }else if (monopoly.properties[monopoly.currentPlayer().position].status == 'chance'){
      monopoly.nextPlayer();
    }else if (monopoly.properties[monopoly.currentPlayer().position].status == 'community_chest'){
      monopoly.nextPlayer();
    }else if (monopoly.properties[monopoly.currentPlayer().position].status == 'free_parking'){
      monopoly.nextPlayer();
    }else if (monopoly.properties[monopoly.currentPlayer().position].status == 'income_tax'){
      monopoly.addIncomeTaxPercentageListener();
      monopoly.addIncomeTax200DollarsListener();
    }else if (monopoly.properties[monopoly.currentPlayer().position].status == 'luxury_tax'){
      monopoly.nextPlayer();
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
      this.playersArray[i] = new this.Player(this.playerEntries[i].value, i, i);  
      monopoly.propertyPieceBoxes[monopoly.properties[0].piecePosition].innerHTML = monopoly.propertyPieceBoxes[monopoly.properties[0].piecePosition].innerHTML + monopoly.pieces[monopoly.playersArray[i].piece].htmlCode;
      monopoly.writeToOutputLog("Player " + this.playersArray[i].name + " has joined the game.");
      this.playersArray[i].refreshPlayerDisplay();
    };
    
  },

  nextPlayer: function(){
    this.playerBox = document.getElementById("player" + monopoly.currentPlayer().order + "_list");
    this.playerBox.childNodes[0].style.border = '3px solid white';
    if (monopoly.numberOfPlayers - 1 == monopoly.playersTurn){
      monopoly.playersTurn = 0;
    }else{
      monopoly.playersTurn += 1;
    };
    this.playerBox = document.getElementById("player" + monopoly.currentPlayer().order + "_list");
    this.playerBox.childNodes[0].style.border = '3px solid blue';
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

  Player: function(name, piece, order){
    this.name = name;
    this.cash = monopoly.startingMoney;
    this.piece = piece;
    this.position = 0; //Position on board 0 -> 39
    this.order = order;
    //this.ownedProperties = [];
    this.divPosition = function(){
      return monopoly.propertyPieceBoxes[monopoly.properties[this.position].piecePosition];
    };
    this.payRent = function(rent, toPlayer){
      this.cash = this.cash - rent;
      monopoly.playersArray[toPlayer].cash = monopoly.playersArray[toPlayer].cash + rent;
      monopoly.writeToOutputLog(this.name + ' paid  ' + rent + ' dollars to ' + monopoly.playersArray[monopoly.properties[this.position].owner].name);
      monopoly.writeToOutputLog(this.name + ' now has  ' + this.cash + 'dollars.');
      monopoly.writeToOutputLog(monopoly.playersArray[monopoly.properties[monopoly.currentPlayer().position].owner].name + ' now has  ' + monopoly.playersArray[monopoly.properties[monopoly.currentPlayer().position].owner].cash + 'dollars.');
        
    };
    this.buyProperty = function(property){
      property.status = 'owned';
      property.owner = monopoly.playersTurn;
      //this.ownedProperties.push(monopoly.currentPlayer().position);
      this.cash -= property.cost;
      monopoly.writeToOutputLog(this.name + " now has " + this.cash + "dollars.");
    };
    this.refreshPlayerDisplay = function(){
      this.propertyBox = document.getElementById("player" + this.order + "_list");
      temphtml = "<li class = 'player_box_name" + "'> " + monopoly.pieces[this.piece].htmlCode + this.name + " [$" + this.cash + "]</li>"
      for (var i = 0; i < this.ownedProperties().length; i++) {
        temphtml = temphtml +  "<li id = '" + this.ownedProperties()[i].piecePosition + "' class = 'player_list_" + this.ownedProperties()[i].group + "' onmouseover='monopoly.properties["+this.ownedProperties()[i].order+"].showModal();' onmouseout='monopoly.properties[0].hideModal();'> " + this.ownedProperties()[i].name + "</li>"
      };
      this.propertyBox.innerHTML = temphtml;
    };
    this.ownedProperties = function(){
      props = [];
      for (var i = 0; i < monopoly.properties.length; i++) {
        if (monopoly.properties[i].owner != undefined){
          if(monopoly.playersArray[monopoly.properties[i].owner] == this){
            props.push(monopoly.properties[i]);
          };
        };
      };
      return props;
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
    this.order = undefined;
    //Changeable
    this.owner = undefined;
    if(group != 'non-property'){
      this.status = 'available';
    };
    this.numberOfHouses = 0;
    this.numberOfHotels = 0;
    this.piecePosition = position;

    this.showModal = function(){
      if(this.group == 'utility'){
        monopoly.propertyModal.innerHTML = " \
            <div id = 'property_modal_name' style='background-color:lightgray'> \
              " + this.name + " \
            </div> \
            <div id = 'property_modal_price_rent'> \
              \
            </div> \
            <div> \
              <ul id = 'property_modal_rent_with_houses_hotels'> \
                <li>if one 'Utility' is owned rent is 4 times acmount shown on dice</li> \
                <li>if both 'Utilities' are owned rent is 10 times amount shown on dice</li> \
              </ul> \
            </div> \
            <div>  \
              <ul id = 'property_modal_cost_of_houses_hotels'> \
                <li>Mortgage Value " + (this.cost * .7) + "</li> \
              </ul> \
            </div> \
            <div id = 'property_modal_costs'> \
            </div> "
      }
      else if(this.group == 'railroad'){
        monopoly.propertyModal.innerHTML = " \
            <div id = 'property_modal_name' style='background-color:lightgray'> \
              " + this.name + " \
            </div> \
            <div id = 'property_modal_price_rent'> \
              \
            </div> \
            <div> \
              <ul id = 'property_modal_rent_with_houses_hotels'> \
                <li>Rent $25</li> \
                <li>If 2 RailRoads are owned $50</li> \
                <li>If 3 RailRoads are owned $100</li> \
                <li>If 4 RailRoads are owned $200</li> \
              </ul> \
            </div> \
            <div>  \
              <ul id = 'property_modal_cost_of_houses_hotels'> \
                <li>Mortgage Value " + (this.cost * .5) + "</li> \
              </ul> \
            </div> \
            <div id = 'property_modal_costs'> \
            </div> "
      }
      else{
        monopoly.propertyModal.innerHTML = " \
            <div id = 'property_modal_name' style='background-color:"+ this.group +"'> \
              " + this.name + " \
            </div> \
            <div id = 'property_modal_price_rent'> \
              PRICE $" + this.cost + " RENT $" + this.rent + "\
            </div> \
            <div> \
              <ul id = 'property_modal_rent_with_houses_hotels'> \
                <li>With 1 House " + (this.rent * 5) + " </li> \
                <li>With 2 Houses " + ((this.rent * 5)*3) + " </li> \
                <li>With 3 Houses " + ((this.rent * 5)*6) + " </li> \
                <li>With 4 Houses " + ((this.rent * 5)*8) + " </li> \
                <li>With HOTEL " + ((this.rent * 5)*3*3*4) + " </li> \
              </ul> \
            </div> \
            <div>  \
              <ul id = 'property_modal_cost_of_houses_hotels'> \
                <li>One House Costs " + this.cost + "</li> \
                <li>Mortgage Value " + (this.cost * .7) + "</li> \
              </ul> \
            </div> \
            <div id = 'property_modal_costs'> \
            </div> "
        };
      monopoly.propertyModal.style.display = 'block';
    };
    this.hideModal = function(){
      monopoly.propertyModal.style.display = 'none';
    };

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
    monopoly.properties[1] = new this.Property("Mediterranean Ave.",60, 2 ,"purple", 38);
    monopoly.properties[2] = new this.Property("Community Chest",0, 0 ,"non-property", 37); monopoly.properties[2].status = 'community_chest';
    monopoly.properties[3] = new this.Property("Baltic Ave.",60, 4 ,"purple", 36);
    monopoly.properties[4] = new this.Property("Income Tax",0, 0 ,"non-property", 35); monopoly.properties[4].status = 'income_tax';
    //5
    monopoly.properties[6] = new this.Property("Oriental Ave.",100 , 6 ,"teal", 33);
    monopoly.properties[7] = new this.Property("Chance",0, 0 ,"non-property", 32); monopoly.properties[7].status = 'chance';
    monopoly.properties[8] = new this.Property("Vermont Ave.",100 , 6 ,"teal", 31);
    monopoly.properties[9] = new this.Property("Connecticut Ave.",120 , 8 ,"teal", 30);
    monopoly.properties[10] = new this.Property("Jail",0, 0 ,"non-property", 29); monopoly.properties[10].status = 'jail';
    monopoly.properties[11] = new this.Property("St. Charles Place",140 , 10,"maroon", 19);
    //12
    monopoly.properties[13] = new this.Property("States Ave.",140 , 10,"maroon", 17);
    monopoly.properties[14] = new this.Property("Virginia Ave.",160 , 12,"maroon", 16);
    //15
    monopoly.properties[16] = new this.Property("St. James Place",180 , 14,"orange", 14);
    monopoly.properties[17] = new this.Property("Community Chest",0, 0 ,"non-property", 13); monopoly.properties[17].status = 'community_chest';
    monopoly.properties[18] = new this.Property("Tennessee Ave.",180 , 14,"orange", 12);
    monopoly.properties[19] = new this.Property("New York Ave.",200 , 16,"orange", 11);
    monopoly.properties[20] = new this.Property("Free Parking",0, 0 ,"non-property", 0); monopoly.properties[20].status = 'free_parking';
    monopoly.properties[21] = new this.Property("Kentucky Ave.",220 , 18,"red", 1);
    monopoly.properties[22] = new this.Property("Chance",0, 0 ,"non-property", 2); monopoly.properties[22].status = 'chance';
    monopoly.properties[23] = new this.Property("Indiana Ave.",220 , 18,"red", 3);
    monopoly.properties[24] = new this.Property("Illinois Ave.",240 , 20,"red", 4);
    //25
    monopoly.properties[26] = new this.Property("Atlantic Ave.",260 , 22,"yellow", 6);
    monopoly.properties[27] = new this.Property("Ventnor Ave.",260 , 22,"yellow", 7);
    //28
    monopoly.properties[29] = new this.Property("Marvin Gardens",280 , 22,"yellow", 9);
    monopoly.properties[30] = new this.Property("Go to Jail",0, 0 ,"non-property", 10); monopoly.properties[30].status = 'go_to_jail';
    monopoly.properties[31] = new this.Property("Pacific Ave.",300 , 26,"green", 20);
    monopoly.properties[32] = new this.Property("North Carolina Ave.",300 , 26,"green", 21);
    monopoly.properties[33] = new this.Property("Community Chest",0, 0 ,"non-property", 22); monopoly.properties[33].status = 'community_chest';
    monopoly.properties[34] = new this.Property("Pennsylvania Ave.",320 , 28,"green", 23);
    //35
    monopoly.properties[36] = new this.Property("Chance",0, 0 ,"non-property", 25); monopoly.properties[36].status = 'chance';
    monopoly.properties[37] = new this.Property("Park Place",350 , 35,"blue", 26);
    monopoly.properties[38] = new this.Property("Luxury Tax",0, 0 ,"non-property", 27); monopoly.properties[38].status = 'luxury_tax';
    monopoly.properties[39] = new this.Property("Boardwalk",400 , 50,"blue", 28);

    monopoly.properties[12] = new this.Property("Electric Company",150 , -1 ,"utility", 18);
    monopoly.properties[28] = new this.Property("Water Works",150 , -1 ,"utility", 8);

    monopoly.properties[5] = new this.Property("Reading Railroad",200 , -2,"railroad", 34);
    monopoly.properties[15] = new this.Property("Pennsylvania Railroad",200 , -2,"railroad", 15);
    monopoly.properties[25] = new this.Property("B. & O. Railroad",200 , -2,"railroad", 5);
    monopoly.properties[35] = new this.Property("Short Line Railroad",200 , -2,"railroad", 24);

    for (var i = 0; i < monopoly.properties.length; i++) {
      monopoly.properties[i].order = i;
    };


  }

};

  monopoly.start();
