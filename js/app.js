
let teamOne;
let teamTwo;

// for pahse 1 of the game, we'll use a fixed team size 
const teamSize = 5;

// some player names
const playerPool= [
  [ 'joe bob', 'spike', 'annie', 'maurice', 'zelda', 'oskar', 'stumpy joe', 'izzie', 'jimmy sue', 'doug' ],
  [ 'bubba', 'livvie', 'billie', 'kevvie', 'lola', 'sam', 'charlie', 'byrdie', 'elvis', 'lucy' ]
];

/**
 * Player object definition
 */
function Player(name) {
  this.name = name;
}

Player.prototype.move = function() {

};

/**
 * Team object definition
 */
function Team(id, name, size) {
  this.id = id;
  this.name = name;
  this.size = size;
  this.players = [];
}

Team.prototype.buildTeam = function(inx) {
  //console.log("hey! build the team!");

  if (this.size > playerPool[inx].length) {
    alert("abort! abort! we don't have enough players!");
  }

  for (var i = 0; i < this.size; i++) {
    this.players[i] = new Player(playerPool[inx][i]);
  }
  //console.log(this.players);
};

Team.prototype.showLineup = function() {
  console.log("show lineup for team" + this.id);

  // show the team name
  let myAside = document.querySelector('#lineup' + this.id + ' > h2');
  myAside.textContent = this.name;
  console.log(myAside);

  // show all of the players
  
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
  console.log("let's get ready to rumble!");

  // create the two teams
  let team = cleanUpName(getQueryValue('team1'));
  teamOne = new Team(1, (team ? team : 'team 1'), teamSize);
  console.log(teamOne);

  team = cleanUpName(getQueryValue('team2'));
  teamTwo = new Team(2, (team ? team : 'team 2'), teamSize);
  console.log(teamTwo);

  // build the players (use a different set of names, 0 or 1, for each team)
  teamOne.buildTeam(0);
  teamTwo.buildTeam(1);

  // show the team lineups on the gamefield
  teamOne.showLineup();
  teamTwo.showLineup();

}