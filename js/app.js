
let theTeams = [];

let defense;  // determines who's turn it is

// for pahse 1 of the game, we'll use a fixed team size 
const teamSize = 5;

// some player names
const playerPool = [
  [ 'joe bob', 'spike', 'annie', 'maurice', 'zelda', 'oskar', 'stumpy joe', 'izzie', 'jimmy sue', 'doug' ],
  [ 'bubba', 'livvie', 'billie', 'kevvie', 'lola', 'sam', 'charlie', 'byrdie', 'elvis', 'lucy' ]
];

const playerImages = [
  // image path, width, height
  [ 'images/raccoonette.png', 50, 50 ],
  [ 'images/snarl.jpg', 50, 42 ],
  [ 'images/raccoonette.png', 50, 50 ],
  [ 'images/cartoon_raccoon.png', 50, 41 ],
  [ 'images/shy.jpg', 50, 55 ],
  [ 'images/raccoonette.png', 50, 50 ],
  [ 'images/cartoon_raccoon.png', 50, 41 ],
  [ 'images/tongue.jpg', 50, 37 ],
  [ 'images/cartoon_raccoon.png', 50, 41 ],
  [ 'images/raccoonette.png', 50, 50 ],
  [ 'images/cartoon_raccoon.png', 50, 41 ],
];

// the shadows of the offensive players look the same, and are defined by CSS
let shadowPlayer = document.createElement('div');
shadowPlayer.className = 'playerShadow';
//console.log(shadowPlayer);

/**
 * Use random numbers to pick images for the players
 */
const min = Math.ceil(0);
const max = Math.floor(10);
function getRandom() {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Player object definition
 */
function Player(name) {
  this.name = name;

  var whichImage = getRandom();

  this.image = playerImages[whichImage][0];   // image patah
  this.width =  playerImages[whichImage][1];  // image width
  this.height = playerImages[whichImage][2];  // image height
  //console.log(this);
}

Player.prototype.joinTeam = function() {

};

Player.prototype.leaveTeam = function() {

};

/**
 * Team object definition
 */
function Team(id, name, size) {
  this.id = id;
  this.name = name;
  this.size = size;

  this.stash = 1;
  this.players = [];
}

Team.prototype.buildTeam = function(inx) {
  // inx: speciefies which array of names to use

  //console.log("hey! build the team!");

  if (this.size > playerPool[inx].length) {
    alert("abort! abort! we don't have enough players!");
  }

  for (let i = 0; i < this.size; i++) {
    this.players[i] = new Player(playerPool[inx][i]);
  }
  //console.log(this.players);
};

Team.prototype.showLineup = function() {
  //console.log("show lineup for team" + this.id);

  // show the team name
  let myAside = document.querySelector('#lineup' + this.id + ' > h2');
  myAside.textContent = this.name;
  //console.log(myAside);

  // show the players' names on the gamefield
  myAside = document.querySelector('#lineup' + this.id + ' > .players');
  //console.log(myAside);

  let playerList = document.createElement('ul');
  let newPlayer;
  for (let i = 0; i < this.size; i++) {
    newPlayer = document.createElement('li');
    newPlayer.textContent = this.players[i].name;
    playerList.append(newPlayer);

    // TEST TEST TEST
    newPlayer = document.createElement('li');
    newPlayer.textContent = this.players[i].name + " II";
    playerList.append(newPlayer); 

    console.log(playerList);
  }
  myAside.append(playerList);

};

Team.prototype.showTeam = function(defense) {
  if (defense === this.id) {
   // console.log("team" + this.id + " is on defense");

    let playerList = document.getElementById('defense');

    // append each player's image 
    for (let i = 0; i < this.size; i++) {
      //console.log("ack! add the right image here!");
      let newGuy = document.createElement('img');
      newGuy.setAttribute("src", this.players[i].image);
      newGuy.setAttribute("alt", this.players[i].name);
      newGuy.setAttribute("width", this.players[i].width);
      newGuy.setAttribute("height", this.players[i].height);
      //console.log(this.players[i]);
      //console.log(newGuy);
      playerList.append(newGuy);
    }
    //console.log("defense: " + playerList);
  } else {
    //console.log("team" + this.id + " is on offense");

    let playerList = document.getElementById('offense');

    // append shadows for each offensive player
    for (let i = 0; i < this.size; i++) {
      let newShadow = shadowPlayer.cloneNode(true);
      playerList.append(newShadow);
    } 
    //console.log("offense: " + playerList);
  }
};

function cleanUpName(name) {
  let parts = name.split('+');
  return parts.join(' ');
}

function getQueryValue(key) {
  // get the URL of the page and pull out the query string
  let query = window.location.search.substring(1);
  //console.log(query);

  // pull out each key/value pair
  let values = query.split('&');
  //console.log(values);

  // go through the key/value pairs looking for 'key'
  for (let i = 0; i < values.length; i++) {
    let kvPair = values[i].split('=');
    //console.log(kvPair);
    if (kvPair[0] == key) {
      //console.log(kvPair[0] + ': ' + kvPair[1]);
      return kvPair[1];
    }
  }

  // didn't find 'key' so return false
  return false;
}

/**
 * Initialize the game 
 * -- called only once per session
 * -- set up the field
 * -- create the 2 teams and add the players
 * -- TODO: might need to use a glabal to idicate this function has already been called???
 */
function initGame() {
  //console.log("let's get ready to rumble!");

  // set up the How To modal
  let how = document.getElementById('howTo');
  let howToButton = document.getElementById('howToModal');
  let span = document.getElementsByClassName("close")[0];

  howToButton.onclick = function() {
    how.style.display = 'block';
  };

  span.onclick = function() {
    how.style.display = 'none';
  };

  window.onclick = function(event) {
    if (event.target == how) {
      how.style.display = 'none';
    }
  };

  // create the two teams
  let team = cleanUpName(getQueryValue('team1'));
  theTeams[0] = new Team(1, (team ? team : 'team 1'), teamSize);  
  //console.log(theTeams[0]);

  team = cleanUpName(getQueryValue('team2'));
  theTeams[1] = new Team(2, (team ? team : 'team 2'), teamSize);
  //console.log(theTeams[1]);

  //console.log("theTeams.length: " + theTeams.length);

  // set the starting team (currently defaults to team1):
  defense = 1;

  for (let i = 0; i < theTeams.length; i++) {
    // build the players (use a different set of names, 0 or 1, for each team)
    theTeams[i].buildTeam(i);

    // show the team lineups on the gamefield
    theTeams[i].showLineup();

    // TEST TEST TEST
    theTeams[i].showTeam(defense);

  }

  //playGame();
}

function gameOver() {
  // check team sizes! If a team has no more members, it lost (which means the other 
  // team won and the game is over!)
  // but if both teams still have at least 1 member, the game is not over

  if (theTeams[0].size === 0) {
    // Aww! this team lost and the other team won!
    console.log("Team" + theTeams[1].id + " won!");
    return theTeams[1].id;
  } else if (theTeams[1].size === 0) {
    console.log("Team" + theTeams[0].id + " won!");
    return theTeams[0].id;
  }

  console.log("the game is (still) on");
  return false; // the game is on!
}

function buildDropdown(aTeam) {
  /**
   *  this function builds a dropdown, and populates it
   * with the names of the players belonging to the
   * aTeam Team object
   *
   * returns: the dropdown element
   */
  var dropdown = document.createElement('select');
  for (let i = 0; i < aTeam.size; i++) {
    var newOption = document.createElement('option');
    newOption.setAttribute("value", aTeam.players[i].name);
    newOption.textContent = aTeam.players[i].name;
    //console.log(newOption);
    dropdown.append(newOption);
  }
  
  //console.log(dropdown);
  return dropdown;
}

function playGame() {
  // while their is no winner
  //   update the gamefield with the teams
  //   defense calls for a player
  //   if offense has a tool and offense wants to use tool
  //     offense uses tool
  //     update defense team status
  //   else
  //     offense sends player
  //     if offense breaks through
  //       offense picks a defense player to add to their team
  //     else 
  //       defense adds offensive payer to their team
  //   if there is a winner
  //     show winner banner with team namd and player names
  // endwhile

  while (!gameOver()) {

    for (let i = 0; i < theTeams.length; i++) {
      // update the teams on the field
      theTeams[i].showTeam(defense);
      theTeams[i].makeMove(defense);
    }
  }
}