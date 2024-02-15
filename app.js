var teams;

const points = {
  'Advanced': 3,
  'Intermediate': 2,
  'Beginner': 1
};

const defList = [
  'CD','LD','RD'
];

const forList = [
  'CM','CF','LW','RW'
];
var selectedPlayers = [];

run();
function run()
{
  let playerData = JSON.parse(getPlayerData());

  if (playerData.values) {
    let playerList = createPlayerList(playerData.values);
    createPlayerListElement(playerList);
    //let finalTeam = createTeam(playerList)
    //console.log('teams : ', finalTeam);
  } else {
    console.log('error');
  }
  
}

$(document).ready(function() {
  $('#create-team-btn').click(function() {
      var teams = createTeam(selectedPlayers); // Call the createTeam function with selectedPlayers
      // Hide the player list
      $('#player-legend').hide();
      $('#player-list').hide();

      // Show the team information
      var teamInfo = $('<div>');
      teamInfo.append('<h2>Team 1</h2>');
      var team1List = $('<ul>');
      Object.keys(teams[0]).forEach(function(key) {
          team1List.append('<li><strong>' + key + ':</strong> ' + teams[0][key] + '</li>');
      });
      teamInfo.append(team1List);

      teamInfo.append('<h2>Team 2</h2>');
      var team2List = $('<ul>');
      Object.keys(teams[1]).forEach(function(key) {
          team2List.append('<li><strong>' + key + ':</strong> ' + teams[1][key] + '</li>');
      });
      teamInfo.append(team2List);

      $('#team-info').html(teamInfo).show(); // Assuming you have a div with id 'team-info' to show the team information

      // Update the footer text
      $('#player-count').hide();

      // Hide existing button
      $('#create-team-btn').hide();

      // Show Reset and Switch buttons
      $('#reset-btn, #switch-btn').show();
  });

  // Reset button click event
  $('#reset-btn').click(function() {
      location.reload(); // Reload the page to reset the app
  });

  // Switch button click event
  $('#switch-btn').click(function() {
      // Simulate click on create-team-btn
      $('#create-team-btn').trigger('click');
  });
});


function createPlayerListElement (players) {
  $(document).ready(function() {
    var playerListDiv = $('#player-list');
    players.forEach(function(player) {
        var checkbox = $('<input>').attr({
            type: 'checkbox',
            name: 'player',
            value: player.name,
            id: player.name.toLowerCase().replace(/ /g, '-')
        });
        var label = $('<label>').attr('for', checkbox.attr('id')).text(player.name);
        playerListDiv.append(checkbox).append(label).append('<br>');
        // Add event listener to track checkbox changes
        checkbox.change(function() {
          if (this.checked) {
              // Add player to selectedPlayers list
              selectedPlayers.push(player);
          } else {
              // Remove player from selectedPlayers list
              selectedPlayers = selectedPlayers.filter(function(name) {
                  return name !== player.name;
              });
          }
          console.log('selectedPlayers : ', selectedPlayers);
          // Update the display of selected players
          updateSelectedPlayers();
        });
    });
  });
}

function updateSelectedPlayers() {
  var selectedPlayersList = $('#selected-players');
  selectedPlayersList.empty(); // Clear previous list

  // Add each selected player to the list
  selectedPlayers.forEach(function(name) {
      selectedPlayersList.append($('<li>').text(name));
  });
}

function getPlayerData()
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", "https://sheets.googleapis.com/v4/spreadsheets/13KfhY0zVeFHNXjdKgSgYSYYnvVc7sh5x8m4Gbi4bTk4/values/Sheet1?key=AIzaSyD7XwZblV4qvWVH6sKh0F7Iry56MbVZWmo", false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function createPlayerList (playerData) {
    let playerList = [];
    playerData.forEach((player, index) => {
        if (index !== 0) {
            let playerObj = {
              name: player[1] ? `${player[0]} (${player[1]})` : player[0],
              primaryPosition: player[2],
              secondaryPosition: player[3],
              level: player[4]
            };
            playerList.push(playerObj);
        }
    });

    return playerList;
}

function createTeam (playerList) {
  teams = [
    {
      CD: null,
      LD: null,
      RD: null,
      CM: null,
      CF: null,
      LW: null,
      RW: null,
      Strength: 0,
      playerCount: 0
    },
    {
      CD: null,
      LD: null,
      RD: null,
      CM: null,
      CF: null,
      LW: null,
      RW: null,
      Strength: 0,
      playerCount: 0
    }
  ];
  const advPoint = 3;
  const intPoint = 2;
  const begPoint = 1;
  shuffle(playerList);
  
  let advancedPlayers = playerList.filter(player => {return player.level == 'Advanced'});
  let intermediatePlayers = playerList.filter(player => {return player.level == 'Intermediate'});
  let beginnerPlayers = playerList.filter(player => {return player.level == 'Beginner'});
  
  console.log('advancedPlayers : ', advancedPlayers);
  console.log('intermediatePlayers : ', intermediatePlayers);
  console.log('beginnerPlayers : ', beginnerPlayers);

  if (advancedPlayers.length) {
    advancedPlayers.forEach(assignPlayer);
  }
  if (intermediatePlayers.length) {
    intermediatePlayers.forEach(assignPlayer);
  }
  if (beginnerPlayers.length) {
    beginnerPlayers.forEach(assignPlayer);
  }

  return teams;
}

function assignPlayer (player, index) {
    let thisTeam, otherTeam;

    if (teams[0].playerCount < teams[1].playerCount && teams[0].playerCount < 7) {
      thisTeam = 0;
      otherTeam = 1;

    } else  if (teams[0].playerCount == teams[1].playerCount && teams[0].Strength < teams[1].Strength && teams[0].playerCount < 7) {
      thisTeam = 0;
      otherTeam = 1;
    } else {
      thisTeam = 1;
      otherTeam = 0;
    }

    if(!teams[thisTeam][player.primaryPosition]) {
      setTeamMember(player, thisTeam, player.primaryPosition);
    } else if(!teams[otherTeam][player.primaryPosition]) {
      setTeamMember(player, otherTeam, player.primaryPosition);
    } else if(player.secondaryPosition && !teams[thisTeam][player.secondaryPosition]) {
      setTeamMember(player, thisTeam, player.secondaryPosition);
    } else if(player.secondaryPosition && !teams[otherTeam][player.secondaryPosition]) {
      setTeamMember(player, otherTeam, player.secondaryPosition);
    } else if(defList.indexOf(player.primaryPosition) > -1 || (player.secondaryPosition && defList.indexOf(player.secondaryPosition) > -1)) {
      if (!teams[thisTeam]['LD']) {
        setTeamMember(player, thisTeam, 'LD');
      } else if (!teams[thisTeam]['RD']) {
        setTeamMember(player, thisTeam, 'RD');
      } else if (!teams[thisTeam]['LW']) {
        setTeamMember(player, thisTeam, 'LW');
      } else if (!teams[thisTeam]['RW']) {
        setTeamMember(player, thisTeam, 'RW');
      } else if (!teams[thisTeam]['CD']) {
        setTeamMember(player, thisTeam, 'CD');
      } else if (!teams[thisTeam]['CF']) {
        setTeamMember(player, thisTeam, 'CF');
      } else if (!teams[thisTeam]['CM']) {
        setTeamMember(player, thisTeam, 'CM');
      }
    } else if(forList.indexOf(player.primaryPosition) > -1 || (player.secondaryPosition && forList.indexOf(player.secondaryPosition) > -1)) {
      if (!teams[thisTeam]['LW']) {
        setTeamMember(player, thisTeam, 'LW');
      } else if (!teams[thisTeam]['RW']) {
        setTeamMember(player, thisTeam, 'RW');
      } else if (!teams[thisTeam]['CF']) {
        setTeamMember(player, thisTeam, 'CF');
      } else if (!teams[thisTeam]['CM']) {
        setTeamMember(player, thisTeam, 'CM');
      } else if (!teams[thisTeam]['LD']) {
        setTeamMember(player, thisTeam, 'LD');
      } else if (!teams[thisTeam]['RD']) {
        setTeamMember(player, thisTeam, 'RD');
      } else if (!teams[thisTeam]['CD']) {
        setTeamMember(player, thisTeam, 'CD');
      }
    }
}

function setTeamMember (player, index, position) {
    teams[index][position] = player.name;
    teams[index].Strength += player.level ? points[player.level] : 1;
    ++teams[index].playerCount;
}

function updateSelectedPlayers() {
  var selectedPlayersList = $('#selected-players');
  selectedPlayersList.empty(); // Clear previous list

  // Add each selected player to the list
  selectedPlayers.forEach(function(name) {
      selectedPlayersList.append($('<li>').text(name));
  });

  // Update the text in the footer with the number of selected players
  $('.app-footer p').text('Number of Players: ' + selectedPlayers.length);
}

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  while (currentIndex > 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}
