
let teamOne = 'team 1';
let teamTwo = 'team 2';

function Team(teamName, teamSize) {
  this.teamName = teamName;
  this.teamSize = teamSize;
}

Team.prototype.buildTeam = function() {
  console.log("hey! build the team!");
};

function extractTeamNames() {
  // extract team names from URL; defaults are 'team 1' and 'team 2'

  // first, break out the query string 
  let myTeams = window.location.href.split('?');

  // now separate the two inputs (team1 and team2)
  myTeams = myTeams[1].split('&');

  /** 
   * pull out the team names; remember: the fields might have been empty when
   * the form was submitted--if so, use the default(s) instead
   */
  let teamName;
  for (let i = 0; i < myTeams.length; i++) {
    teamName = myTeams[i].split('=');
    console.log(teamName);
    if (teamName[1].length) {
      console.log(teamName[1]);
    }
  } // else use the default team names
}

/**
 * Initialize the game field
 * -- called only once per session
 * -- TODO: might need to use a glabal to idicate this function has already been called???
 */
function initGameField() {
  console.log("let's get ready to rumble!");

}