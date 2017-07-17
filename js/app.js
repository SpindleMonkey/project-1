
let theTeams = [];
let currentChampion; // holds the name of the poor sap who has to break through the other team

// for phase 1 of the game, we'll use a fixed team size (and it's set to 3 so the game doesn't go on forever!)
const teamSize = 3;

let stateOfPlay;

// some player names to use when building teams
const playerPool = [
  [ 'joe bob', 'spike', 'annie', 'maurice', 'zelda', 'oskar', 'stumpy joe', 'izzie', 'jimmy sue', 'doug' ],
  [ 'bubba', 'livvie', 'kevvie', 'elvis', 'lola', 'sam', 'charlie', 'byrdie', 'billie', 'lucy' ]
];

// set of player images to assign to offense--images are picked randomly so you never know what faces you'll be up against
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

// the shadows of the offensive players all look the same since we're looking at their backs
const shadowPlayer = [ 'images/raccoonBack.png', 50, 38 ];

// images used for running animation
let nextImg = 0;
let timerId;
let imgArr = [
  // image path, milliseconds to display
  ['images/what.jpg', 750],
  ['images/hallelujah.JPG', 1000],
  ['images/twisty.jpg', 500],
  ['images/twisty2.jpg', 500],
  ['images/twisty.jpg', 500],
  ['images/twisty2.jpg', 500],
  ['images/twisty.jpg', 500],
  ['images/kaboom.png', 2500]
];

/**
 * Use random numbers to pick images for the players, to decide whether the player breaks 
 * through the line, etc. This version returns from min up to and including max (inclusive).
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

// inits game state; all games start with team1 on defense
GameState.prototype.init = function() {
  this.defense = 1;
  this.offense = 2;
};

// move defense to offense, and offense to defense
GameState.prototype.swapSides = function() {
  let temp = this.defense;
  this.defense = this.offense;
  this.offense = temp;
};

// restores game state after a state change
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

// hard-coded team building method: assigns players to a team
Team.prototype.buildTeam = function(arr) {
  // inx: speciefies which array of names to use

  if (this.size > arr.length) {
    alert("abort! abort! we don't have enough players!");
  }

  for (let i = 0; i < this.size; i++) {
    this.players[i] = new Player(arr[i], i, this.id);
  }
};

// shows the team lineup in the appropriate sidebar (team 1 on the left, team 2 on the right)
Team.prototype.showLineup = function() {
  // show the team name
  let myAside = document.querySelector('#lineup' + this.id + ' > h2');
  myAside.textContent = this.name;

  // show the players' names on the gamefield
  myAside = document.querySelector('#lineup' + this.id + ' > .players');

  let playerList = document.createElement('ul');
  let newPlayer;
  for (let i = 0; i < this.size; i++) {
    newPlayer = document.createElement('li');
    newPlayer.textContent = this.players[i].name;
    playerList.append(newPlayer);
  }
  myAside.append(playerList);
};

// displays the player images on the game field
Team.prototype.showTeam = function(gState, showRunner = false) {
  if (gState.defense === this.id) {

    let playerList = document.getElementById('defense');

    // remove any images from the last turn:
    if (playerList.hasChildNodes()) {
      while (playerList.firstChild) {
        playerList.removeChild(playerList.firstChild);
      }
    }

    // append each player's image 
    for (let i = 0; i < this.size; i++) {
      let newGuy = document.createElement('img');
      newGuy.setAttribute("src", this.players[i].image);
      newGuy.setAttribute("alt", this.players[i].name);
      newGuy.setAttribute("width", this.players[i].width);
      newGuy.setAttribute("height", this.players[i].height);
      newGuy.style.margin = '0 20px'; // TODO: need to adjust based on team size
      playerList.append(newGuy);
    }
  } else {
    let playerList = document.getElementById('offense');

    // remove any images from the last turn:
    if (playerList.hasChildNodes()) {
      while (playerList.firstChild) {
        playerList.removeChild(playerList.firstChild);
      }
    }

    // append shadows for each offensive player
    for (let i = 0; i < (showRunner ? this.size - 1 : this.size); i++) {
      let newShadow = document.createElement('img');
      newShadow.setAttribute("src", shadowPlayer[0]);
      newShadow.setAttribute("alt", this.name + ' player');
      newShadow.setAttribute("width", shadowPlayer[1]);
      newShadow.setAttribute("height", shadowPlayer[2]);
      playerList.append(newShadow);
    } 

    /**
    if (showRunner) {
      // need to show the runner!

      // TODO: save this flag for future when I show the runner on the field after he's been selected
    }
     */
  }
};

// finds a player on the team by player name and returns the player object
Team.prototype.findPlayer = function(who) {
  for (let i = 0; i < this.size; i++) {
    if (this.players[i].name === who) {
      return this.players[i];
    }
  }
  return null;
};

// removes a player by name from the team
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
      return true; // player was removed
    }
  }

  return false; // player wasn't found, so nobody was removed
};

// adds a player object to the team
Team.prototype.addPlayer = function(whoObject) {
  this.players[this.size] = whoObject;
  this.size += 1;
};

// ================================================================================
// ================================================================================
// ================================================================================

// strips the '+' from multiple word names that come from a query string
function cleanUpName(name) {
  let parts = name.split('+');
  return parts.join(' ');
}

// looks for the specified key in the query string; returns the value (or false if not found)
function getQueryValue(key) {
  // get the URL of the page and pull out the query string
  let query = window.location.search.substring(1);

  // pull out each key/value pair
  let values = query.split('&');

  // go through the key/value pairs looking for 'key'
  for (let i = 0; i < values.length; i++) {
    let kvPair = values[i].split('=');
    if (kvPair[0] == key) {
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
 */
function initGame() {
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

  // TODO: set up the 'start a new game' button

  // set up the defense's Ready button
  let dReady = document.getElementById('dPicked');
  dReady.onclick = function() {
    // get the value
    let whoIsIt = document.getElementById('champion');
    console.log('initGame:: ' + whoIsIt);
    console.log('initGame:: ' + document.getElementById('dPicked'));
  };

  // set up the offense's response modal
  let oRunning = document.getElementById('oSent');
  oRunning.onclick = function() {
    // the game is on!
    console.log("initGame::o is running");
  };

  // set up the kaboom response modal
  let kaboom = document.getElementById('turnOver');
  kaboom.onclick= function() {
    console.log('initGame::the kaboom happened');
  };

  // set up the winner modal
  let winnerWinner = document.getElementById('won');
  winnerWinner.onclick = function() {
    console.log('initGame::somebody won');
  };

  // create the two teams
  let team = getQueryValue('team1');
  if (team) {
    team = cleanUpName(team);
    theTeams[0] = new Team(1, (team ? team : 'team 1'), teamSize);  
  } else {
    // use the default name
    theTeams[0] = new Team(1, 'team 1', teamSize);
  }

  team = getQueryValue('team2');
  if (team) {
    team = cleanUpName(team);
    theTeams[1] = new Team(2, (team ? team : 'team 2'), teamSize);
  } else {
    // use the default name
    theTeams[1] = new Team(2, 'team 2', teamSize);
  }

  // set the starting team (currently defaults to team1):
  stateOfPlay = new GameState();

  for (let i = 0; i < theTeams.length; i++) {
    // build the players (use a different set of names, 0 or 1, for each team)
    theTeams[i].buildTeam(playerPool[i]);

    // show the team lineups on the gamefield
    theTeams[i].showLineup();
  }

  // we need to save state for subsequent rounds of the game becaue form submissions cause a page refresh
  saveState();

  playGame();
}

/**
 * First move in the game; ask the defense who they want to have the offense send over 
 */
function promptDefense(gameState) {
  // first time through, restoreState isn's necessary, but for the second and all subsequent rounds, we
  // need to restore the state of the game becaue the page was just refreshed and all our global
  // data was lost/re-initialized!
  restoreState();

  // identify which team needs to request a player be sent over
  let choose = document.querySelector('#selectPlayer > .modalContent > h2');
  choose.textContent = "Hey, " + theTeams[stateOfPlay.defense - 1].name + "! You're up!";

  // build the dropdown and drop it in the modal
  var ddown = buildDropdown(theTeams[stateOfPlay.offense - 1], "champ", "champion");

  choose = document.getElementById('ddown');

  // remove any dropdown from the last turn:
  if (choose.hasChildNodes()) {
    while (choose.firstChild) {
      choose.removeChild(choose.firstChild);
    }
  }
  choose.append(ddown);

  choose = document.getElementById('selectPlayer');
  choose.style.display = 'block';

  /**
   * when the defense responds, a form is submitted with the selected player which 
   * causes the page to reload! We need to save the state of the game so we can rebuild
   * the team:
   */
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
 * - current champion
 * - (future) stash
 */
function saveState() {
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
  sessionStorage.t1Players = JSON.stringify(t1Names);

  var t2Names = [];
  //for (let j = 0; j < theTeams[1].players.length; j++) {
  for (let j = 0; j < theTeams[1].size; j++) {
    t2Names[j] = theTeams[1].players[j].name;
  }
  sessionStorage.t2Players = JSON.stringify(t2Names);

  sessionStorage.offense = stateOfPlay.offense;
  sessionStorage.defense = stateOfPlay.defense;

  // save the current champion--need to know who this is through a couple of page loads
  sessionStorage.champ = currentChampion;
}

/**
 * Restores game state after a form has been submitted; see saveState for more info
 */
function restoreState() {
  // get the team names, team sizes, and lists of player for both teams
  theTeams[0] = new Team(1, sessionStorage.team1, Number(sessionStorage.team1Size));
  let playerNames = JSON.parse(sessionStorage.t1Players);
  theTeams[0].buildTeam(playerNames);

  theTeams[1] = new Team(2, sessionStorage.team2, Number(sessionStorage.team2Size));
  playerNames = JSON.parse(sessionStorage.t2Players);
  theTeams[1].buildTeam(playerNames);

  // get the game state
  stateOfPlay = new GameState();
  stateOfPlay.restore(Number(sessionStorage.defense), Number(sessionStorage.offense));

  // get the current champion
  currentChampion = sessionStorage.champ;
}

/**
 * Second move of the game: ask the offense if they're ready to send their player over
 * Note: when each team has tools to be used during the game, this is also the point 
 * when the offense can use one of their tools.
 */
function promptOffense(gameState) {
  let prompt = document.querySelector('#sendPlayer > .modalContent > h2');
  prompt.textContent = "Hey, " + theTeams[gameState.offense - 1].name + "! Are you ready to send " + currentChampion + " over?";

  prompt = document.getElementById('sendPlayer');
  prompt.style.display = 'block';  

  saveState();
}

/**
 * Update the team lineups in the sidebars, and show the team on the gamefield 
 * Note: showSpecial is not currently used, but will be used in the future when the 
 * current champion is shown as a special character on the field.
 */
function populateField(showSpecial) {
  for (let i = 0; i < theTeams.length; i++) {
    theTeams[i].showLineup();
    theTeams[i].showTeam(stateOfPlay, showSpecial);
  }
}

/** 
 * Confirms the selected champion
 */
function confirmMove() {
  restoreState();
  populateField();

  currentChampion = cleanUpName(getQueryValue('champ'));

  // time for the offense to make their move
  promptOffense(stateOfPlay);
}

/**
 * Starts the champion on his run across the field
 */
function makeMove() {
  restoreState();

  populateField(true); // replace one of the shadows with the runner

  // let's see that runner run!
  moveRunner();
}

/**
 * Handles the runner animation; timers are set based on each displayed image and when
 * all images have been displayed, determines whether the champion broke through the 
 * defense, or whether the defense held their line. If the offense broke through,
 * a prompt is built asking the offense to pick a player to add to their team.
 */
function runRunner() {
  if (nextImg < imgArr.length) {
    document.getElementById('runningRaccoon').setAttribute("src", imgArr[nextImg][0]);
    timerId = setTimeout(runRunner, imgArr[nextImg][1]);
    nextImg++;
  } else {
    let animate = document.getElementById('running');
    animate.style.display = 'none'; 

    // show a new modal with the results of the hit 
    let kaboomModal = document.querySelector('#kaboomResult > .modalContent > h2');

    // now figure out which side gains a new player
    let whoWon = getRandom(1, 5); //numbers are arbitrty, with a slight bias towards defense
    if (whoWon < 3) {
      // offense broke through the line!
      whoWon = stateOfPlay.offense - 1;
      kaboomModal.textContent = 'Hey, ' + theTeams[whoWon].name + '! ' + currentChampion + ' broke through the line!';

      kaboomModal = document.getElementById('pickPlayer');
      kaboomModal.style.display = 'block';

      kaboomModal = document.getElementById('pick');
      var ddown = buildDropdown(theTeams[stateOfPlay.defense - 1], "vic", "victim");

      kaboomModal.append(ddown);

      kaboomModal = document.getElementById('turnOver');
      kaboomModal.setAttribute("value", "Woohoo!");
    } else {
      // boo! defense held the line!
      whoWon = stateOfPlay.defense - 1;
      kaboomModal.textContent = 'Sorry, ' + theTeams[stateOfPlay.offense - 1].name + ' :( but that other team held the line.';
      
      // hide the text telling the offense to pick a player since they don't get to pick a player
      kaboomModal = document.getElementById('pickPlayer');
      kaboomModal.style.display = 'none';
    }

    saveState();

    // show the modal with the status of the champion's run
    kaboomModal = document.getElementById('kaboomResult');
    kaboomModal.style.display = 'block';
  }
}

/**
 * start the runner animation
 */
function moveRunner() {
  //console.log('runner is, well, running!');

  let animate = document.getElementById('running');
  animate.style.display = 'block';  

  // show each image for the  amount of time in imgArr
  timerId = window.setTimeout(runRunner, imgArr[nextImg][1]); // set the timeout from imgArr
  nextImg++;  // move to the next image
}

/**
 * Move a player from one team to the other; which player gets moved depends on whether
 * the champion broke through the line:
 * - if the champion broke through, the offense picked a defense player to add to their team
 *   and the name of that player came in via the query string
 * - if the champion did not break the line, he is added to the defense
 */
function movePlayer() {
  restoreState();

  // if the offense broke through the line, move the selected defense player to the offense
  if (getQueryValue('vic')) {
    // move the selected player to the offense
    let playerName = cleanUpName(getQueryValue('vic'));
    let myPlayer = theTeams[stateOfPlay.defense - 1].findPlayer(playerName);
    theTeams[stateOfPlay.offense - 1].addPlayer(myPlayer);
    theTeams[stateOfPlay.defense - 1].removePlayer(playerName);
  } else {
    // move the currentChampion from the offense to the defense
    let myPlayer = theTeams[stateOfPlay.offense - 1].findPlayer(currentChampion);
    theTeams[stateOfPlay.defense - 1].addPlayer(myPlayer);
    theTeams[stateOfPlay.offense - 1].removePlayer(currentChampion);
  }

  // change who's up, and we're ready for the next round
  stateOfPlay.swapSides();

  // show the new teams
  populateField();

  saveState();

  // look for a winner
  let winner = gameOver();
  if (winner) {
    // game is over, we have a winner!
    proclaimWinner(winner);
  } else {
    // game not over yet--keep playing
    promptDefense(stateOfPlay);
  }
}

/**
 * We have a winner! Display the winner in a modal
 */
function proclaimWinner(winnerId) {
  let prompt = document.querySelector('#haveWinner > .modalContent > h2');
  prompt.textContent = 'Hey, ' + theTeams[winnerId - 1].name + '! You WON! Congratulations!';

  prompt = document.getElementById('haveWinner');
  prompt.style.display = 'block';  

  saveState();
}

/**
 * check team sizes! If defense has only 1 player, the game is over because 1 player can't
 * hold off a challenge; if the offense has 0 players, the game is also over because there's
 * nobody to send over
 */
function gameOver() {
  // if the current defense has only 1 player, the game is over
  if (theTeams[stateOfPlay.defense - 1].size < 2) {
    return stateOfPlay.offense;
  } else if (theTeams[stateOfPlay.offense - 1].size === 0) {
    return stateOfPlay.defense;
  }

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
    dropdown.append(newOption);
  }

  //console.log(dropdown);
  return dropdown;
}

/**
 * starts the game with the first move
 */
function playGame() {
  for (let i = 0; i < theTeams.length; i++) {
    // update the teams on the field
    theTeams[i].showTeam(stateOfPlay);
  }

  promptDefense(stateOfPlay);
}

/**
 * look at the query key/value pairs to see how we got here!
 * - if team1 and team2 are in the query keys, we got here from the landing page
 *   and are starting a new game
 * - if champ is the query key, we're in the middle of a game
 * - if token is the query key, the offense has agreed to send over their champion
 * - if token2 is the query key, we need to move a player to the other team
 * - if win is the query key, we had a winner and we're starting a new game
 * - if there are no query keys, I think somebody came directly to the game
 *   page without going through the landing page which I'm saying means
 *   they're starting a new game with the default team names!
 */
function route() {
  if (getQueryValue('team1')) {
    // initGame with team names from the landing page
    initGame();
  } else if (getQueryValue('champ')) {
    //console.log('somebody got called over!');
    confirmMove();
  } else if (getQueryValue('token')) {
    makeMove();
  } else  if (getQueryValue('token2')) {
    movePlayer();
  } else if (getQueryValue('win')) {
    // start a new game
    window.location.href = 'index.html';
  } else {
    // assuming we're starting a new game with the default team names
    console.log('route::guessing we are starting a new game with default team names');
    initGame();
  }
}