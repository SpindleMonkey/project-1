
let theTeams = [];
let currentChampion;  // holds the name of the poor sap who has to break through the other team

// for pahse 1 of the game, we'll use a fixed team size 
const teamSize = 3;

let stateOfPlay;

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

// the shadows of the offensive players look the same
const shadowPlayer = [ 'images/raccoonBack.png', 50, 38 ];

// images used for running animation
let nextImg = 0;
let timerId;
let imgArr = [
  // image path, milliseconds to display
  ['images/what.jpg', 750],
  ['images/hallelujah.JPG', 1000],
  ['images/twisty.JPG', 500],
  ['images/twisty2.JPG', 500],
  ['images/twisty.JPG', 500],
  ['images/twisty2.JPG', 500],
  ['images/twisty.JPG', 500],
  ['images/kaboom.png', 2500]
];

/**
 * Use random numbers to pick images for the players
 */
function getRandom(min, max) {
  let myMin = Math.ceil(min);
  let myMax = Math.floor(max);
  return Math.floor(Math.random() * (myMax - myMin + 1)) + myMin;
}


// ================================================================================
// ================================================================================
// ================================================================================

/**
 * GameState object definition
 */
function GameState() {
  this.defense = 1;
  this.offense = 2;
}

GameState.prototype.init = function() {
  this.defense = 1;
  this.offense = 2;
};

GameState.prototype.swapSides = function() {
  let temp = this.defense;
  this.defense = this.offense;
  this.offense = temp;
};

GameState.prototype.restore = function(d, o) {
  this.defense = d;
  this.offense = o;
};

/**
 * Player object definition
 */
function Player(name, loc, teamId) {
  this.name = name;
  this.loc = loc; // index in the team's players array
  this.teamId = teamId;

  var whichImage = getRandom(0, 10);

  this.image = playerImages[whichImage][0];   // image path
  this.width =  playerImages[whichImage][1];  // image width
  this.height = playerImages[whichImage][2];  // image height
  //console.log(this);
}

Player.prototype.changeTeam = function() {

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

Team.prototype.buildTeam = function(arr) {
  // inx: speciefies which array of names to use

  //console.log("hey! build the team!");

  if (this.size > arr.length) {
    alert("abort! abort! we don't have enough players!");
  }

  for (let i = 0; i < this.size; i++) {
    this.players[i] = new Player(arr[i], i, this.id);
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
    /*
    newPlayer = document.createElement('li');
    newPlayer.textContent = this.players[i].name + " II";
    playerList.append(newPlayer); 
    */

    //console.log(playerList);
  }
  myAside.append(playerList);
  //console.log('appended the lineup');

};

Team.prototype.showTeam = function(gState, showRunner = false) {
  console.log(gState);
  if (gState.defense === this.id) {
   // console.log("team" + this.id + " is on defense");

    let playerList = document.getElementById('defense');

    // remove any images from the last turn:
    if (playerList.hasChildNodes()) {
      while (playerList.firstChild) {
        playerList.removeChild(playerList.firstChild);
      }
    }
    //console.log(playerList);

    // append each player's image 
    for (let i = 0; i < this.size; i++) {
      //console.log("ack! add the right image here!");
      let newGuy = document.createElement('img');
      newGuy.setAttribute("src", this.players[i].image);
      newGuy.setAttribute("alt", this.players[i].name);
      newGuy.setAttribute("width", this.players[i].width);
      newGuy.setAttribute("height", this.players[i].height);
      newGuy.style.margin = '0 20px'; // TODO: need to adjust based on team size
      //console.log(this.players[i]);
      //console.log(newGuy);
      playerList.append(newGuy);
    }
    //console.log("defense: " + playerList);
  } else {
    //console.log("team" + this.id + " is on offense");

    let playerList = document.getElementById('offense');

    // remove any images from the last turn:
    if (playerList.hasChildNodes()) {
      while (playerList.firstChild) {
        playerList.removeChild(playerList.firstChild);
      }
    }
    //console.log(playerList);

    // append shadows for each offensive player
    for (let i = 0; i < (showRunner ? this.size - 1 : this.size); i++) {
      let newShadow = document.createElement('img');
      newShadow.setAttribute("src", shadowPlayer[0]);
      newShadow.setAttribute("alt", this.name + ' player');
      newShadow.setAttribute("width", shadowPlayer[1]);
      newShadow.setAttribute("height", shadowPlayer[2]);
      //console.log(newShadow);
      playerList.append(newShadow);
    } 

    if (showRunner) {
      // need to show the runner!
      /*
      let newRunnerDiv = document.createElement('div');
      newRunnerDiv.setAttribute("id", "runner");
      let newRunner = document.createElement('img');
      newRunner.setAttribute("src", "images/hallelujah.JPG");
      newRunner.setAttribute("alt", currentChampion);
      newRunner.setAttribute("width", 64);
      newRunner.setAttribute("height", 89);
      newRunnerDiv.append(newRunner);
      document.getElementById('gamefield').append(newRunnerDiv);
      */
    }
    //console.log("offense: " + playerList);
  }
};

Team.prototype.findPlayer = function(who) {
  for (let i = 0; i < this.size; i++) {
    if (this.players[i].name === who) {
      return this.players[i];
    }
  }
  return null;
};

Team.prototype.removePlayer = function(who) {
  // this method assumes you have already called findPlayer to get the player object
  // you are now removing!
  for (let i = 0; i < this.size; i++) {
    if (this.players[i].name === who) {
      // need to remove the player and then remove that player's hole in the array
      if (i === this.size - 1) {
        // lucky day! the player is at the end of the array
        this.players[i] = null;
        console.log('removePlayer::' + i);
      } else {
        // we need to move the remaining players up
        for (let j = i; j < this.size - 1; j++) {
          this.players[j] = this.players[j + 1];
        }
        this.players[this.size - 1] = null;
      }
      this.size -= 1; // update the size of the team
      //console.log('removePlayer::' + this.players);
      console.log('removePlayer::' + this.size);
      return true; // player was removed
    }
  }

  console.log('removePlayer:: ' + who + ' not found');
  return false; // player wasn't found, so nobody was removed
};

Team.prototype.addPlayer = function(whoObject) {
  this.players[this.size] = whoObject;
  this.size += 1;
  console.log('addPlayer::' + whoObject.name + ' added to team; size=' + this.size);
};

// ================================================================================
// ================================================================================
// ================================================================================

function cleanUpName(name) {
  let parts = name.split('+');
  return parts.join(' ');
}

function getQueryValue(key) {
  // get the URL of the page and pull out the query string
  let query = window.location.search.substring(1);
  //console.log('getQueryValue:: ' + query);

  // pull out each key/value pair
  let values = query.split('&');
  //console.log('getQueryValue:: ' + values);

  // go through the key/value pairs looking for 'key'
  for (let i = 0; i < values.length; i++) {
    let kvPair = values[i].split('=');
    //console.log('getQueryValue:: ' + kvPair);
    if (kvPair[0] == key) {
      //console.log('getQueryValue:: ' + kvPair[0] + ': ' + kvPair[1]);
      return kvPair[1]; // return just the value
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
    //if (event.target == choose) {
    //  choose.style.display = 'none';
    //}
  };

  // TODO: set up the 'start a new game' button

  // set up the defense's Ready button
  let dReady = document.getElementById('dPicked');
  //console.log('initGame:: ' + dReady);
  dReady.onclick = function() {
    // get the value
    let whoIsIt = document.getElementById('champion');
    console.log('initGame:: ' + whoIsIt);
    console.log('initGame:: ' + document.getElementById('dPicked'));
  };

  // set up the offense's response modal
  let oRunning = document.getElementById('oSent');
  //console.log('initGame:: ' + oSent);
  oRunning.onclick = function() {
    // the game is on!
    console.log("initGame::o is running");
  };

  // set up the kaboom response modal
  let kaboom = document.getElementById('turnOver');
  //console.log(kaboom);
  kaboom.onclick= function() {
    console.log('initGame::the kaboom happened');
  };

  // set up the winner modal
  let winnerWinner = document.getElementById('won');
  //console.log('initGame::' + winnerWinner);
  winnerWinner.onclick = function() {
    console.log('initGame::somebody won');
  };

  // create the two teams
  let team = getQueryValue('team1');
  if (team) {
    team = cleanUpName(team);
    theTeams[0] = new Team(1, (team ? team : 'team 1'), teamSize);  
    //console.log('initGame:: ' + theTeams[0]);
  } else {
    // use the default name
    theTeams[0] = new Team(1, 'team 1', teamSize);
  }

  team = getQueryValue('team2');
  if (team) {
    team = cleanUpName(team);
    theTeams[1] = new Team(2, (team ? team : 'team 2'), teamSize);
    //console.log('initGame:: ' + theTeams[1]);
  } else {
    // use the default name
    theTeams[1] = new Team(2, 'team 2', teamSize);
  }

  //console.log("initGame::theTeams.length: " + theTeams.length);

  // set the starting team (currently defaults to team1):
  stateOfPlay = new GameState();
  console.log('initGame:: ' + stateOfPlay);

  for (let i = 0; i < theTeams.length; i++) {
    // build the players (use a different set of names, 0 or 1, for each team)
    theTeams[i].buildTeam(playerPool[i]);

    // show the team lineups on the gamefield
    theTeams[i].showLineup();

    // TEST TEST TEST
    //theTeams[i].showTeam(gameState);
  }

  // we need to save state for subsequent rounds of the game
  saveState();

  playGame();
}

function promptDefense(gameState) {
  // first time through, this isn's necessary, but for the second and all subsequent rounds, we
  // need to restore the state of the game becaue the page was just refreshed and all our glbal
  // data was lost!
  restoreState();

  console.log('promptDefense:: ' + gameState);

  // identify which team needs to request a player be sent over
  let choose = document.querySelector('#selectPlayer > .modalContent > h2');
  //console.log('promptDefense:: ' + choose);
  choose.textContent = "Hey, " + theTeams[stateOfPlay.defense - 1].name + "! You're up!";

  // build the dropdown and drop it in the modal
  //console.log("promptDefense::offense: " + gameState.offense);
  //console.log('promptDefense:: ' + theTeams[gameState.offense - 1]);
  var ddown = buildDropdown(theTeams[stateOfPlay.offense - 1], "champ", "champion");
  console.log("promptDefense:: " + theTeams);

  choose = document.getElementById('ddown');
  //console.log(choose);

  // remove any dropdown from the last turn:
  if (choose.hasChildNodes()) {
    while (choose.firstChild) {
      choose.removeChild(choose.firstChild);
    }
  }
  choose.append(ddown);

  choose = document.getElementById('selectPlayer');
  choose.style.display = 'block';
  //console.log('promptDefense:: ' + choose);

  // when the defense responds, a form is submitted with the selected player which 
  // causes the page to reload! We need to save the state of the game so we can rebuild
  // the team:
  saveState();
}

/**
 * Since we use forms to get info from the players, the game.html page gets
 * reloaded multiple times during a game and we need to save state before
 * each form submission; values to save are:
 * - team names
 * - team size
 * - gameState.offense
 * - gameState.defense
 * - player names
 * - (future) stash
 */
function saveState() {
  console.log('saveState::saving state');
  sessionStorage.team1 = theTeams[0].name;
  sessionStorage.team2 = theTeams[1].name;

  sessionStorage.team1Size = theTeams[0].size;
  sessionStorage.team2Size = theTeams[1].size;

  // need to save the players on each team; to save space we create an array of names
  // and then stringify it and then, finally, save it to sessionStorage:
  var t1Names = [];
  for (let i = 0; i < theTeams[0].size; i++) {
    t1Names[i] = theTeams[0].players[i].name;
  }
  console.log('saveState:: ' + t1Names);
  sessionStorage.t1Players = JSON.stringify(t1Names);
  //console.log('saveState:: ' + sessionStorage.t1Players);

  var t2Names = [];
  //for (let j = 0; j < theTeams[1].players.length; j++) {
  for (let j = 0; j < theTeams[1].size; j++) {
    t2Names[j] = theTeams[1].players[j].name;
  }
  console.log('saveState:: ' + t2Names);
  sessionStorage.t2Players = JSON.stringify(t2Names);
  //console.log('saveState:: ' + sessionStorage.t2Players);

  sessionStorage.offense = stateOfPlay.offense;
  sessionStorage.defense = stateOfPlay.defense;

  // save the current champion--need to know who this is through a couple of page loads
  sessionStorage.champ = currentChampion;
}

function restoreState() {
  console.log('restoreState::restoring state');

  theTeams[0] = new Team(1, sessionStorage.team1, Number(sessionStorage.team1Size));
  let playerNames = JSON.parse(sessionStorage.t1Players);
  //console.log('restoreState:: ' + playerNames);
  theTeams[0].buildTeam(playerNames);
  //console.log('restoreState:: ' + theTeams[0]);

  theTeams[1] = new Team(2, sessionStorage.team2, Number(sessionStorage.team2Size));
  playerNames = JSON.parse(sessionStorage.t2Players);
  //console.log('restoreState:: ' + playerNames);
  theTeams[1].buildTeam(playerNames);
  //console.log('restoreState:: ' + theTeams[1]);

  //console.log('restoreState::restoring stateOfPlay');
  stateOfPlay = new GameState();
  stateOfPlay.restore(Number(sessionStorage.defense), Number(sessionStorage.offense));
  console.log('restoreState:: ' + stateOfPlay);

  currentChampion = sessionStorage.champ;
  //console.log('restoreState:: ' + currentChampion);
}

function promptOffense(gameState) {
  let prompt = document.querySelector('#sendPlayer > .modalContent > h2');
  //console.log(prompt);
  //console.log(gameState);
  //console.log(theTeams);
  //console.log(theTeams[gameState.offense - 1]);
  prompt.textContent = "Hey, " + theTeams[gameState.offense - 1].name + "! Are you ready to send " + currentChampion + " over?";

  prompt = document.getElementById('sendPlayer');
  prompt.style.display = 'block';  

  saveState();
}

function populateField(showSpecial) {
  console.log('populateField::populating field!');
  for (let i = 0; i < theTeams.length; i++) {
    theTeams[i].showLineup();
    theTeams[i].showTeam(stateOfPlay, showSpecial);
  }
}

function confirmMove() {
  console.log('confirmMove::confirming move...');

  restoreState();
  populateField();

  currentChampion = cleanUpName(getQueryValue('champ'));
  console.log('confirmMove:: ' + currentChampion);

  // time for the offense to make their move
  promptOffense(stateOfPlay);
}

function makeMove() {
  console.log('makeMove::making move...');

  restoreState();

  // clear the query string
  //let myToken = getQueryValue('token');
  //console.log('makeMove:: ' + myToken);

  populateField(true); // replace one of the shadows with the runner

  // let's see that runner run!
  moveRunner();
}

function runRunner() {
  if (nextImg < imgArr.length) {
    document.getElementById('runningRaccoon').setAttribute("src", imgArr[nextImg][0]);
    timerId = setTimeout(runRunner, imgArr[nextImg][1]);
    nextImg++;
  } else {
    //console.log('runRunner::runner is done running');
    //console.log('runRunner:: ' + intervalId);
    let animate = document.getElementById('running');
    animate.style.display = 'none'; 

    // show a new modal with the results of the hit 
    let kaboomModal = document.querySelector('#kaboomResult > .modalContent > h2');

    // now figure out which side gains a new player
    let whoWon = getRandom(1, 5);
    if (whoWon < 3) {
      // offense broke through the line!
      whoWon = stateOfPlay.offense - 1;
      console.log('runRunner:: ' + theTeams[whoWon].name + ' broke through the line!');
      kaboomModal.textContent = 'Hey, ' + theTeams[whoWon].name + '! ' + currentChampion + ' broke through the line!';

      kaboomModal = document.getElementById('pickPlayer');
      kaboomModal.style.display = 'block';

      kaboomModal = document.getElementById('pick');
      console.log('runRunner:: ' + kaboomModal);
      var ddown = buildDropdown(theTeams[stateOfPlay.defense - 1], "vic", "victim");
      console.log('runRunner:: ' + ddown);

      kaboomModal.append(ddown);
      console.log('runRunner:: ' + kaboomModal);

      kaboomModal = document.getElementById('turnOver');
      console.log('runRunner:: ' + kaboomModal);
      kaboomModal.setAttribute("value", "Woohoo!");
      // add the selected defensive player to the offense
    } else {
      // boo! defense held the line!
      whoWon = stateOfPlay.defense - 1;
      console.log('runRunner:: ' + theTeams[whoWon].name + ' held the line!');
      kaboomModal.textContent = 'Sorry, ' + theTeams[stateOfPlay.offense - 1].name + ' :( but that other team held the line.';
      
      // hide the text telling the offense to pick a player since they don't get to pick a player
      kaboomModal = document.getElementById('pickPlayer');
      kaboomModal.style.display = 'none';
    }

    saveState();

    kaboomModal = document.getElementById('kaboomResult');
    kaboomModal.style.display = 'block';

  }
}

function moveRunner() {
  //console.log('runner is, well, running!');

  let animate = document.getElementById('running');
  animate.style.display = 'block';  

  // show each image for the same amount of time
  timerId = window.setTimeout(runRunner, imgArr[nextImg][1]); // set the timeout from imgArr
  nextImg++;  // move to the next image
  //console.log(timerId);
}

function movePlayer() {
  restoreState();

  console.log('movePlayer::moving player to the other team');
  // if the offense broke through the line, move the selected defense player to the offense
  if (getQueryValue('vic')) {
    // move the selected player to the offense
    let playerName = cleanUpName(getQueryValue('vic'));
    let myPlayer = theTeams[stateOfPlay.defense - 1].findPlayer(playerName);
    console.log('movePlayer:: ' + myPlayer);
    theTeams[stateOfPlay.offense - 1].addPlayer(myPlayer);
    theTeams[stateOfPlay.defense - 1].removePlayer(playerName);
    console.log('movePlayer::offense' + theTeams[stateOfPlay.offense - 1]);
    console.log('movePlayer::defense' + theTeams[stateOfPlay.defense - 1]);
  } else {
    // move the currentChampion from the offense to the defense
    let myPlayer = theTeams[stateOfPlay.offense - 1].findPlayer(currentChampion);
    theTeams[stateOfPlay.defense - 1].addPlayer(myPlayer);
    theTeams[stateOfPlay.offense - 1].removePlayer(currentChampion);
    console.log('movePlayer::offense' + theTeams[stateOfPlay.offense - 1]);
    console.log('movePlayer::defense' + theTeams[stateOfPlay.defense - 1]);
  }

  // change who's up, and we're ready for the next round
  stateOfPlay.swapSides();

  populateField();

  saveState();

  let winner = gameOver();
  if (winner) {
    proclaimWinner(winner);
  } else {
    promptDefense(stateOfPlay);
  }
}

function proclaimWinner(winnerId) {
  console.log('proclaimWinner::we have a winner! ' + winnerId - 1);

  let prompt = document.querySelector('#haveWinner > .modalContent > h2');
  prompt.textContent = 'Hey, ' + theTeams[winnerId - 1].name + '! You WON! Congratulations!';

  prompt = document.getElementById('haveWinner');
  prompt.style.display = 'block';  

  saveState();
}
/**
 * check team sizes! If defense has only 1 player, the game is over because 1 player can'g
 * hold off a challenge; if the offense has 0 players, the game is also over because there's
 * nobody to send over
 */
function gameOver() {
  // if the current defense has only 1 player, the game is over
  if (theTeams[stateOfPlay.defense - 1].size < 2) {
    console.log('gameOver::defense has less than 2 players ' + theTeams[stateOfPlay.defense - 1].size);
    return stateOfPlay.offense;
  } else if (theTeams[stateOfPlay.offense - 1].size === 0) {
    console.log('gameOver::offense has no players to send over ' + theTeams[stateOfPlay.offense - 1].size);
    return stateOfPlay.defense;
  }

  console.log("gameOver::the game is (still) on");
  return false; // the game is still on!
}

/**
 *  this function builds a dropdown, and populates it
 * with the names of the players belonging to the
 * aTeam Team object
 *
 * returns: the dropdown element
 */
function buildDropdown(aTeam, selectName, optionId) {
  var dropdown = document.createElement('select');
  dropdown.setAttribute("required", "required");
  dropdown.setAttribute("name", selectName);
  for (let i = 0; i < aTeam.size; i++) {
    var newOption = document.createElement('option');
    newOption.setAttribute("value", aTeam.players[i].name);
    newOption.setAttribute("id", optionId);
    newOption.textContent = aTeam.players[i].name;
    if (i === 0) {
      newOption.setAttribute("selected", "selected");
    }
    console.log('buildDropdown::' + newOption);
    dropdown.append(newOption);
  }

  //console.log(dropdown);
  return dropdown;
}

function playGame() {
  // while their is no winner
  //   update the gamefield with the teams
  //   defense calls for a player (add  url('../images/team[1|2]SpeechBubble.png') center no-repeat to gamefield)
  //   if offense has a tool and offense wants to use tool
  //     offense uses tool
  //     update defense team status
  //   else
  //     offense sends player
  //     if offense breaks through
  //       offense picks a defense player to add to their team
  //     else 
  //       defense adds offensive player to their team
  //   if there is a winner
  //     show winner banner with team name and player names
  // endwhile

  //var gameDone = false;
  //while (!gameDone) {
    for (let i = 0; i < theTeams.length; i++) {
      // update the teams on the field
      theTeams[i].showTeam(stateOfPlay);
    }

    promptDefense(stateOfPlay);

    ///if (gameDone = gameOver()) {
    //  // somebody won!
    //  console.log(gameDone);
    //  // show some kind of winner banner
    //}
  //}
}

/**
 * look at the query keyvalue pairs to see how we got here!
 * - if team1 and team2 are in the query keys, we got here from the landing page
 *   and are starting a new game
 * - if champ is the query key, we're in the middle of a game
 * - if token is the query key, the offense has agreed to send over their champion
 * - if there are no query keys, I think somebody came directly to the game
 *   page without going through the landing page which I'm saying means
 *   they're starting a new game with the default team names!
 */
function route() {
  //console.log('inside route()');
  if (getQueryValue('team1')) {
    // initGame with team names from the landing page
    console.log('route::init');
    initGame();
  } else if (getQueryValue('champ')) {
    //console.log('somebody got called over!');
    console.log('route::Champ');
    confirmMove();
  } else if (getQueryValue('token')) {
    console.log('route::oReady');
    makeMove();
  } else  if (getQueryValue('token2')) {
    console.log('route::over');
    movePlayer();
  } else if (getQueryValue('win')) {
    console.log('route::gameOver');
    // start a new game
    window.location.href = 'index.html';
  } else {
    // assuming we're starting a new game with the default team names
    console.log('route::guessing we are starting a new game with default team names');
    //console.log('route::' + document.window.location.search.substring(1));
    initGame();
  }
}