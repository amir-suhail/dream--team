run();
function run()
{
  let playerList = getPlayList();
  console.log('playerList : ', playerList)
}

function getPlayList()
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", "https://sheets.googleapis.com/v4/spreadsheets/13KfhY0zVeFHNXjdKgSgYSYYnvVc7sh5x8m4Gbi4bTk4/values/Sheet1?key=AIzaSyD7XwZblV4qvWVH6sKh0F7Iry56MbVZWmo", false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
}
