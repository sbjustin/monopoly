
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
  groups: ['purple','teal','maroon','orange','red','yellow','green','blue'],
  diceRoll: 0,
  setupGame:              document.getElementById("setup_game"),
  startGame:              document.getElementById("start_game"),
  gamePanel:              document.getElementById("game_panel"),
  leftPane:               document.getElementById("left_pane"),
  middlePane:             document.getElementById("middle_pane"),
  rightPane:              document.getElementById("right_pane"),
  board:                  document.getElementById("board"),
  dice:                   document.getElementById("dice"),
  addPlayer:              document.getElementById("add_player"),
  playerEntryFormList:    document.getElementById("player_entry_form_list"),
  playerEntries:          document.getElementsByName("playername"),
  outputLog:              document.getElementById("output_log"),
  fullOutputLog:          document.getElementById("full_output_log"),
  nextTurnButton:         document.getElementById("next_turn_button"),
  endGameButton:          document.getElementById("end_game_button"),
  buyPropertyButton:      document.getElementById("buy_property_button"),
  skipPropertyButton:     document.getElementById("skip_property_button"),
  incomeTaxPercentButton: document.getElementById("income_tax_percent_button"),
  incomeTax200Button:     document.getElementById("income_tax_200_button"),
  propertyPieceBoxes:     document.getElementsByClassName("pieces_box"),
  propertyModal:          document.getElementById("property_modal"),
  offerTradeButton:       document.getElementById("offer_trade"),
  buyHousesButton:        document.getElementById("buy_houses"),
  buyHotelsButton:        document.getElementById("buy_hotels"),


  offerTradeListener: function(){
    alert('test');
  },

  buyHousesListener: function(){
    alert('test');
  },

  rollDiceListener: function(){
    monopoly.dice.style.cursor = "default";
    monopoly.diceRoll = Math.floor(Math.random() * (12 - 2 + 1) + 2);
    monopoly.writeToOutputLog('You rolled a ' + monopoly.diceRoll + '!');
    monopoly.movePiece(monopoly.diceRoll); 
  },

  buyPropertyListener: function(){
    monopoly.removePropertyListeners();
    monopoly.currentPlayer().buyProperty(monopoly.currentPlayer().currentPosition())
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

  init: function(){
    var me = this;

    me.defProperties();
    me.defPieces();
    me.defCards();
    
    me.AddPreGameListeners();
    //remove this stuff for real game
    // monopoly.addPlayer.click();
    // monopoly.addPlayer.click();
    // // this.playerEntries[0].value = "Justin";
    // this.playerEntries[1].value = "Caterine";
    // this.playerEntries[2].value = "Pete";
    // this.playerEntries[3].value = "Lindsay";
    ////////////////////////////////////////////
    
    //remove this stuff for real game
     // monopoly.startGame.click();
     // this.playersArray[0].buyProperty(monopoly.properties[1])
     // this.playersArray[0].buyProperty(monopoly.properties[3])
     // this.playersArray[0].refreshPlayerDisplay();
    ////////////////////////////////////////////    

    
  },

  start: function(){
    this.init();
  }, 

  currentPlayer: function(){
    return monopoly.playersArray[monopoly.playersTurn];
  },

  playGame: function(){
    this.playersArray[0].highlightName();
    this.startTurn();
  },

  startTurn: function(){
    this.writeToOutputLog(monopoly.currentPlayer().name + ", it's your turn"); 
    monopoly.currentPlayer().highlightName();
    monopoly.addStartTurnListeners();
  },

  nextPlayer: function(){
    monopoly.currentPlayer().unhighlightName();
    if (monopoly.numberOfPlayers - 1 == monopoly.playersTurn){
      monopoly.playersTurn = 0;
    }else{
      monopoly.playersTurn += 1;
    };
    monopoly.startTurn();
  },

  movePiece: function(spaces){
    monopoly.removeStartTurnListeners();
    monopoly.pieces[monopoly.currentPlayer().piece].removeFromBoard();
    //move players postion. Pay 200 dollars if passing go
    if (monopoly.currentPlayer().position + spaces > 39 ){
      monopoly.currentPlayer().cash += 200;
      monopoly.currentPlayer().position = spaces - (40 - monopoly.currentPlayer().position);
    }
    else{
      monopoly.currentPlayer().position += spaces;
    };
    monopoly.pieces[monopoly.currentPlayer().piece].addToBoard();
    
    monopoly.writeToOutputLog("Player " + monopoly.currentPlayer().name + " moved to " + monopoly.currentPlayer().currentPosition().name + ".");
    monopoly.onProperty();
  },

  //Player has just rolled and landed on a property.
  onProperty: function(){
    if (monopoly.currentPlayer().currentPosition().status == 'available'){
      monopoly.addBuyPropertyListener();
      monopoly.addSkipPropertyListener();

      monopoly.writeToOutputLog("Property is available");
    }else if (monopoly.currentPlayer().currentPosition().status == 'owned'){
      if (monopoly.currentPlayer().currentPosition().group == 'utility'){
        //check to see if both utilities are owned
        if(monopoly.properties[12].owner == monopoly.properties[28].owner){
          monopoly.currentPlayer().payRent(monopoly.diceRoll * 10, monopoly.currentPlayer().currentPosition().owner);
        }else{
          monopoly.currentPlayer().payRent(monopoly.diceRoll * 4, monopoly.currentPlayer().currentPosition().owner);
        };
        monopoly.writeToOutputLog('utility');
        monopoly.nextPlayer();
      }else if(monopoly.currentPlayer().currentPosition().group == 'railroad'){
        var railroads = [monopoly.properties[5], monopoly.properties[15], monopoly.properties[25], monopoly.properties[35]];
        var ownershipCount = 0;
        for (var i = 0; i < railroads.length; i++) {
          if (monopoly.currentPlayer().currentPosition().owner ==  railroads[i].owner){
            ownershipCount += 1;
          };
        };
        monopoly.currentPlayer().payRent(25 * ownershipCount, monopoly.currentPlayer().currentPosition().owner);
        monopoly.nextPlayer();

      }else{
        monopoly.currentPlayer().payRent(monopoly.currentPlayer().currentPosition().rent, monopoly.currentPlayer().currentPosition().owner);
        monopoly.writeToOutputLog(monopoly.currentPlayer().name + ' just landed on a property owned by ' + monopoly.currentPlayer().currentPosition().owner.name);
        monopoly.nextPlayer();
        };
    }else if (monopoly.currentPlayer().currentPosition().status == 'mortgaged'){
      monopoly.writeToOutputLog("Property is mortgaged");
      monopoly.nextPlayer();
    }else if (monopoly.currentPlayer().currentPosition().status == 'go'){
      monopoly.writeToOutputLog("Property is Go and not available for purchase" );
      monopoly.nextPlayer();
    }else if (monopoly.currentPlayer().currentPosition().status == 'go_to_jail'){
      monopoly.movePiece(-20);
      monopoly.currentPlayer().jailRollsLeft = 3;
      monopoly.nextPlayer();
    }else if (monopoly.currentPlayer().currentPosition().status == 'jail'){
      monopoly.nextPlayer();
    }else if (monopoly.currentPlayer().currentPosition().status == 'chance'){
      monopoly.nextPlayer();
    }else if (monopoly.currentPlayer().currentPosition().status == 'community_chest'){
      monopoly.nextPlayer();
    }else if (monopoly.currentPlayer().currentPosition().status == 'free_parking'){
      monopoly.nextPlayer();
    }else if (monopoly.currentPlayer().currentPosition().status == 'income_tax'){
      monopoly.addIncomeTaxPercentageListener();
      monopoly.addIncomeTax200DollarsListener();
    }else if (monopoly.currentPlayer().currentPosition().status == 'luxury_tax'){
      monopoly.nextPlayer();
    }else{
      monopoly.writeToOutputLog("Property is not available for purchase" );
      monopoly.nextPlayer();
    };
  }, 

  AddPreGameListeners: function(){
    monopoly.addPlayer.addEventListener("click", function(){
      monopoly.numberOfPlayers = monopoly.numberOfPlayers + 1;
      var newLI = document.createElement("LI");
      monopoly.playerEntryFormList.appendChild(newLI);
      newLI.innerHTML = "Player" + monopoly.numberOfPlayers + "'s Name: <input type='text' name='playername' class = 'player_entry_form_field'>";
      if (monopoly.numberOfPlayers == 4){
        monopoly.addPlayer.style.visibility = 'hidden';
      };
    });

    monopoly.startGame.addEventListener("click", function(){
      monopoly.setupGame.style.display = 'none';
      monopoly.startGame.style.display = 'none';
      monopoly.gamePanel.style.display = 'block';
      monopoly.leftPane.style.display = 'block';
      monopoly.middlePane.style.display = 'block';
      monopoly.rightPane.style.display = 'block';
      monopoly.board.style.display = 'block';
      monopoly.dice.style.display = 'block';

      monopoly.setupPlayers();

      monopoly.playGame();
    });
  },

  addStartTurnListeners: function(){
    monopoly.dice.style.cursor = "pointer";
    monopoly.dice.addEventListener("click", monopoly.rollDiceListener);

    if(monopoly.currentPlayer().ownedProperties().length > 0){
      monopoly.offerTradeButton.style.display = "block";
      monopoly.offerTradeButton.addEventListener("click", monopoly.offerTradeListener);
    };
    if(monopoly.currentPlayer().monopoliesOwned().length > 0){
      monopoly.buyHousesButton.style.display = "block";
      monopoly.buyHousesButton.addEventListener("click", monopoly.buyHousesListener);
    };
  },
  removeStartTurnListeners: function(){
    monopoly.dice.removeEventListener('click', monopoly.rollDiceListener); 

    monopoly.offerTradeButton.style.display = "none";
    monopoly.offerTradeButton.removeEventListener("click", monopoly.offerTradeListener);
  
    monopoly.buyHousesButton.style.display = "none";
    monopoly.buyHousesButton.removeEventListener("click", monopoly.buyHousesListener);
  },

  addBuyPropertyListener: function(){
    monopoly.buyPropertyButton.style.display = 'block';
    monopoly.buyPropertyButton.addEventListener("click", monopoly.buyPropertyListener);
  },

  addSkipPropertyListener: function(){
    monopoly.skipPropertyButton.style.display = 'block';
    monopoly.skipPropertyButton.addEventListener("click", monopoly.skipPropertyListener);
  },

  addIncomeTaxPercentageListener: function(){
    monopoly.incomeTaxPercentButton.style.display = 'block';
    monopoly.incomeTaxPercentButton.addEventListener("click", monopoly.incomeTaxPercentageListener);
  },

  addIncomeTax200DollarsListener: function(){
    monopoly.incomeTax200Button.style.display = 'block';
    monopoly.incomeTax200Button.addEventListener("click", monopoly.incomeTax200DollarsListener);
  },

  removePropertyListeners: function(){
    monopoly.buyPropertyButton.style.display = 'none';
    monopoly.skipPropertyButton.style.display = 'none';
    monopoly.buyPropertyButton.removeEventListener("click", monopoly.buyPropertyListener);
    monopoly.skipPropertyButton.removeEventListener("click", monopoly.skipPropertyListener);  
  },

  removeIncomeTaxListeners: function(){
    monopoly.incomeTaxPercentButton.removeEventListener('click', monopoly.incomeTaxPercentageListener);
    monopoly.incomeTax200Button.removeEventListener('click', monopoly.incomeTax200DollarsListener);
    monopoly.incomeTax200Button.style.display = 'none';
    monopoly.incomeTaxPercentButton.style.display = 'none';
    monopoly.currentPlayer().refreshPlayerDisplay();
    monopoly.nextPlayer();
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

  writeToOutputLog: function(notice){
    var newLI = document.createElement("LI");
    monopoly.outputLog.insertBefore(newLI, monopoly.outputLog.childNodes[0]);
    newLI.innerHTML = notice;
    var newLI = document.createElement("LI");
    monopoly.fullOutputLog.insertBefore(newLI, monopoly.fullOutputLog.childNodes[0]);
    newLI.innerHTML = notice;
    if (monopoly.outputLog.childNodes.length > 9){
      monopoly.outputLog.removeChild(monopoly.outputLog.lastChild);
    };
  },

  //Returns: an array of properties or an array of property positions
  //Arguments: Property Attribute, Value of attribute to match, true or false to return property array
  findPropertiesByAttr: function(attr, value, asProperties){
    var indexes = [];
    for (var i = 0; i < monopoly.properties.length; i++) {
      if (monopoly.properties[i][attr] == value){
        if (asProperties == true){
          indexes.push(monopoly.properties[i]);
        }
        else{
          indexes.push(i);
        };
        
      };
    };
    return indexes;
  },

  Player: function(name, piece, order){
    //Attributes
    this.name = name;
    this.cash = monopoly.startingMoney;
    this.piece = piece;
    this.position = 0; //Position on board 0 -> 39
    this.order = order;
    this.jailRollsLeft = 0;
    
    //Methods
    this.highlightName = function(){
      var playerBox = document.getElementById("player" + this.order + "_list");
      playerBox.childNodes[0].style.border = '3px solid blue';
    };
    this.unhighlightName = function(){
      var playerBox = document.getElementById("player" + this.order + "_list");
      playerBox.childNodes[0].style.border = '3px solid white';
    };
    this.currentPosition = function(){
      return monopoly.properties[this.position];
    };
    this.divPosition = function(){
      return monopoly.propertyPieceBoxes[monopoly.properties[this.position].piecePosition];
    };
    this.payRent = function(rent, toPlayer){
      this.cash = this.cash - rent;
      toPlayer.cash = toPlayer.cash + rent;
      monopoly.writeToOutputLog(this.name + ' paid  ' + rent + ' dollars to ' + toPlayer.name);  
    };
    this.buyProperty = function(property){
      property.status = 'owned';
      property.owner = this;
      this.cash -= property.cost;
    };
    this.refreshPlayerDisplay = function(){
      var propertyBox = document.getElementById("player" + this.order + "_list");
      temphtml = "<li class = 'player_box_name" + "'> " + monopoly.pieces[this.piece].htmlCode + this.name + " [$" + this.cash + "]</li>"
      for (var i = 0; i < this.ownedProperties().length; i++) {
        temphtml = temphtml +  "<li id = '" + this.ownedProperties()[i].piecePosition + "' class = 'player_list_" + this.ownedProperties()[i].group + "' onmouseover='monopoly.properties["+this.ownedProperties()[i].order+"].showModal();' onmouseout='monopoly.properties["+this.ownedProperties()[i].order+"].hideModal();'> " + this.ownedProperties()[i].name + "</li>"
      };
      propertyBox.innerHTML = temphtml;
      //needs to be applied at end after temphtml has been applied
      if(monopoly.currentPlayer() == this){this.highlightName();};
    };
    this.ownedProperties = function(){
      return monopoly.findPropertiesByAttr("owner", this, true);
    };
    this.monopoliesOwned = function(){
      var monopoliesOwned = [];
    
      for (var i = 0; i < monopoly.groups.length; i++) {
        var props = monopoly.findPropertiesByAttr("group", monopoly.groups[i], false)
        if(props.length == 2){
          if(monopoly.properties[props[0]].owner == this && monopoly.properties[props[1]].owner == this){monopoliesOwned.push(monopoly.groups[i]) };
        }
        else{//if props.length is 3
          if(monopoly.properties[props[0]].owner == this && monopoly.properties[props[1]].owner == this && monopoly.properties[props[2]].owner == this){monopoliesOwned.push(monopoly.groups[i]) };
        };
        
      };

      return monopoliesOwned;
    };
    this.payIncomeTaxPercentage = function(){
      this.cash -= (this.cash * .1);
    };
    this.payIncomeTax200Dollars = function(){
      this.cash -= 200;
    };

  },

  Property: function(name, cost, rent, group, position){
    //Attributes
    //Constants
    this.name = name;
    this.cost = cost;
    this.rent = rent;
    this.group = group;
    this.order = undefined;
    this.houseCost = 0;
    this.hotelCost = 0;
    this.rentWith1House = this.rent * 5;
    this.rentWith2Houses = this.rent * 15;
    this.rentWith3Houses = this.rent * 45;
    this.rentWith4Houses = this.rent * 80;
    this.rentWith1Hotel = this.rent * 125;
    this.numberOfHouses = 0;
    this.numberOfHotels = 0;
    this.piecePosition = position;
    //Changeable
    this.owner = undefined;
    if(group != 'non-property'){
      this.status = 'available';
    };
    
    //Methods
    this.highlightProperty = function(){
      monopoly.propertyPieceBoxes[this.piecePosition].parentNode.style.opacity = ".5";
      monopoly.propertyPieceBoxes[this.piecePosition].parentNode.style.backgroundColor = "yellow";
    };
    this.unhighlightProperty = function(){
      monopoly.propertyPieceBoxes[this.piecePosition].parentNode.style.opacity = "";
      monopoly.propertyPieceBoxes[this.piecePosition].parentNode.style.backgroundColor = "";
    };
    this.showModal = function(){
      this.highlightProperty();
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
                <li>Mortgage Value $100</li> \
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
      this.unhighlightProperty();
      monopoly.propertyModal.style.display = 'none';
    };

  },

  Piece: function(name, css_id, htmlCode){
    //Attributes
    this.name = name;
    this.css_id = css_id;
    this.htmlCode = htmlCode;

    //Methods
    this.addToBoard = function(){
      monopoly.currentPlayer().divPosition().innerHTML = monopoly.currentPlayer().divPosition().innerHTML + this.htmlCode;
    };
    this.removeFromBoard = function(){
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
