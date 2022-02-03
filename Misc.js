
function clearSheet() {
  var ss = SpreadsheetApp.getActive();
  var scoreSheet = ss.getSheetByName("ScoreSheet");
  
  var matchName = [[null],
                   [null]];

  var blankTeam = [[null],
                   [null],
                   [null],
                   [null]];
  
  var blankPoints = [[TRUE, null, TRUE, null],
                     [TRUE, null, TRUE, null],
                     [TRUE, null, TRUE, null],
                     [TRUE, null, TRUE, null],
                     [TRUE, null, TRUE, null],
                     [TRUE, null, TRUE, null],
                     [TRUE, null, TRUE, null],
                     [TRUE, null, TRUE, null],
                     [TRUE, null, TRUE, null]];
  
  scoreSheet.getRange(5, 3, 2, 1).setValues(matchName);//clears the match data
  //clears the team members names
  scoreSheet.getRange(10, 3, 4, 1).setValues(blankTeam);
  scoreSheet.getRange(10, 5, 4, 1).setValues(blankTeam);
  //clears the points of the match
  scoreSheet.getRange(18, 3, 9, 4).setValues(blankPoints);
}