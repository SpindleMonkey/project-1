# project-1
Project 1: a browser game

### overview

Remember those games we played as children? Dodge ball? Tag? Hide and seek? This is a bitter/cynical recreation of my childhood nightmare: Red Rover.

This is a two-player game, with each player (or captain) leading a team of mammals (1st graders? thugs (a/k/a the neighborhood kids)? zombies? raccoons? actual mammals are still TBD and will depend on both time and my image-Googling skills). Team-size is determined by the players before the game starts. 

Using animation and DOM manipulation to show the results, each team will alternate "Red Rover, Red Rover, send [insert your least liked mammal on the other team] right over" requests, until all mammals are on the same team (unless they're no longer breathing, of course).

Possible upgrades to the game:
* ability to select which of the 2 players to add to your team when you break through
* scoreboard showing top 5 teams
* time-limit the game (you know, like the way recess limited the time we had to play this evil game)
* varying health/strength/likeability scores for each of the team members that are updated after
each round
* random tools allocated to each team at the start of a new game (e.g., grenades, killer bees, stink bombs, power juice)
* ability to pick team members from a pool of mammals

Here's a [description, and some history, of Red Rover](https://en.wikipedia.org/wiki/Red_Rover), if you've successfully blocked this particular humiliation from your memory.

---

### technologies used
* HTML
* CSS
* JavaScript
* DOM manipulation using vanilla JS


---

### approach taken

7/15/17: switched from an interval timer to individual timeouts for the animation because I need to use
different values. Adding more modals and more logic to route() to communicate the status of the player
trying to break through the line. Still trying to identify places I can scale back because it feels like I still have way too much to do (converting animation on the field itself to modals was a huge help, though, and that might be all I can do to simplify the game for now).

7/14/17: Reworked logic to handle multiple refreshes on game.html. Since I'm using modals with forms to get user input, each time a form is submitted, game.html is refreshed and wipes out all my globals! I now save
state before accepting a form, and restore state after accepting a form.

Clearly did not do a good job of planning this project, especially handling user interactions! I'm also seeing that my Trello stories are very incomplete, which means it's not much use for tracking progress.

Scaling back the animation due to time/ability. Instead of showing the player running across the field
and attempting to break through the line, I'm using a modal to show a little raccoon scrambling and the impact. A second modal will reveal the results. Lame, but I'm running out of time and it will do the job.

7/13/17: Replaced player images with raccoons for defense; removed stick figure images from repo. Working on logic for actually playing the game now.

7/12/17: Added a new list to Trello so I can separate the stretch goal stories from the basic game stories (stretch goal stories are in the Backlog list, and are prioritized).

Created objects for Team and Player.

7/11/17: Set up [Trello account](https://trello.com/conniekephart) to track stories/progress; project board is [Red Rover](https://trello.com/b/zXJaTWNl/red-rover). Updated wireframes.

![](assets/landingWireframe.JPG)
![](assets/gameWireframe.JPG)

7/10/17: Started design with some rough wireframes of the landing page and game board.


---

### installation instructions

---

### unsolved problems

Overall project status is tracked in [Trello](https://trello.com/b/zXJaTWNl/red-rover).

---

### etc.
