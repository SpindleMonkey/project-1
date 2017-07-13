
let teamOne;
let teamTwo;

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
console.log(shadowPlayer);

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

  this.image = playerImages[whichImage][0];
  this.width =  playerImages[whichImage][1];
  this.height = playerImages[whichImage][2];
  //console.log(this);
}

Player.prototype.joinTeam = function() {

};

Player.prototype.leaveTeam = function() {

};

/**
 * Team object definition
 */
function Team(id, name, size, color) {
  this.id = id;
  this.name = name;
  this.size = size;
  this.color = color; //TODO: remove this!

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
    //console.log(playerList);
  }
  myAside.append(playerList);

};

Team.prototype.showTeam = function(defense) {
  if (defense === this.id) {
    console.log("team" + this.id + " is on defense");

    let playerList = document.getElementById('defense');

    // append each player's image 
    for (let i = 0; i < this.size; i++) {
      console.log("ack! add the right image here!");
      let newGuy = document.createElement('img');
      newGuy.setAttribute("src", this.players[i].image);
      newGuy.setAttribute("alt", this.players[i].name);
      newGuy.setAttribute("width", this.players[i].width);
      newGuy.setAttribute("height", this.players[i].height);
      console.log(this.players[i]);
      console.log(newGuy);
      playerList.append(newGuy);
    }
    console.log("defense: " + playerList);
  } else {
    //console.log("team" + this.id + " is on offense");

    let playerList = document.getElementById('offense');

    // append shadows for each offensive player
    for (let i = 0; i < this.size; i++) {
      let newShadow = shadowPlayer.cloneNode(true);
      playerList.append(newShadow);
    } 
    console.log("offense: " + playerList);
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
  teamOne = new Team(1, (team ? team : 'team 1'), teamSize, 'Navy');  // TODO: 
  //console.log(teamOne);

  team = cleanUpName(getQueryValue('team2'));
  teamTwo = new Team(2, (team ? team : 'team 2'), teamSize, 'OrangeRed');
  //console.log(teamTwo);

  // build the players (use a different set of names, 0 or 1, for each team)
  teamOne.buildTeam(0);
  teamTwo.buildTeam(1);

  // show the team lineups on the gamefield
  teamOne.showLineup();
  teamTwo.showLineup();
  
  // set the starting team (currently defaults to team1):
  defense = 1;

  teamOne.showTeam(defense);
  teamTwo.showTeam(defense);

}