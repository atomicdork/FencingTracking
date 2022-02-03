var ss = SpreadsheetApp.getActiveSpreadsheet();
var inputSheet = ss.getSheetByName("ScoreSheet");
var dataSheet = ss.getSheetByName("BackEnd");

//look up assisstace table
var teamDic = {
  "M1": 0,
  "W1": 1,
  "M2": 2,
  "W2": 3,
  "M3": 4,
  "W3": 5,
  "M4": 6,
  "W4": 7,
  "M5": 8,
  "W5": 9,
  "M6": 10,
  "W6": 11,
};

var hOrArr = {
  "Home": 0,
  "Away": 1
};

//looks up how many rows from the initial row of a data cell it needs to shift
var weaponRowShift = {
  "Foil": 4,
  "Epee": 9,
  "Sabre": 14
};

var oppositionPos = [//[0]:team, [1]:H/A, [2]:row use look uptable this if for entering the opposition
  [2, 3],//M1 home away
  [4, 5],//W1 home away
  [6, 7],//M2 home away
  [8, 9],//W2 home away
  [10, 11],//M3
  [12, 13],//W3
  [14, 15],//M4
  [16, 17],//W4
  [18, 19],//M5
  [20, 21],//W5
  [22, 23],//M6
  [24, 25]//W6
];

/*
runs the save function after checking if the inputs are correct
*/
function saveMain() {
  var ui = SpreadsheetApp.getUi();
  var homeTotal = inputSheet.getRange(27, 3).getValue();
  var awayTotal = inputSheet.getRange(27, 5).getValue();
  //if the input sheet team totals are greater than 45 alert user
  if(inputSheet.getRange('C5').isBlank()){
    ui.alert("The team opposition is empty");
  }else if(homeTotal > 45 || awayTotal > 45){
    ui.alert("Team total greater than 45 change score or switch entry method to Running");
  } else {
    Save()
  }
}


/*
This functions job is to save data from the input form
and the computed results in the backend sheet, placing
the results in the output file formated
*/
function Save() {
  var ui = SpreadsheetApp.getUi();
  var outSheet = ss.getSheetByName("Data");
  
  var teamDic = {
    "M1": 0,
    "W1": 1,
    "M2": 2,
    "W2": 3,
    "M3": 4,
    "W3": 5,
    "M4": 6,
    "W4": 7,
    "M5": 8,
    "W5": 9,
    "M6": 10,
    "W6": 11,
  };
  
  //  var oppositionPos = [//[0]:team, [1]:H/A, [2]:row use look uptable
  //    [2, 3],//M1 home away
  //    [4, 5],//W1 home away
  //    [6, 7],//M2 home away
  //    [8, 9]//W2 home away
  //  ];
  
  inputSheet.getRange('A1').activate();
  
  //Input Values
  var yorkTeam = inputSheet.getRange("C3").getValue();
  var homeOrAway = inputSheet.getRange("C4").getValue();
  var opposition = inputSheet.getRange("C5").getValue();
  var dateMatch = inputSheet.getRange("C6").getValue();
  var matchType = inputSheet.getRange("C7").getValue();
  
  var weapon = inputSheet.getRange("C15").getValue();
  var entryType = inputSheet.getRange("C16").getValue(); 
  
  //scores of home
  var homeScore = inputSheet.getRange("C18:C26").getValues();
  var totalHome = inputSheet.getRange("C27").getValue();
  
  //scores of away 
  var awayScore = inputSheet.getRange("E18:E26").getValues();
  var totalAway = inputSheet.getRange("E27").getValue();
  
  //reserve Boolean array
  var homeReserve = dataSheet.getRange("G6").getValue();
  var awayReserve = dataSheet.getRange("H6").getValue();
  
  //team members
  var homeTeamMemb = dataSheet.getRange("E3").getValue();
  var awayTeamMemb = dataSheet.getRange("F3").getValue();
  
  //joined indicator
  var homeIndicator = dataSheet.getRange("J7").getValue();
  var awayIndicator = dataSheet.getRange("K7").getValue();
  
  //join arrays to one singular var
  var joinHome = homeScore.join();
  var joinAway = awayScore.join();
  Logger.log(yorkTeam);
  Logger.log(teamDic[yorkTeam]);
  Logger.log(oppositionPos[teamDic[yorkTeam]][hOrArr[homeOrAway]]);
  //finds the number of columns offset from look up
  var oppOffNum = outSheet.getRange(oppositionPos[teamDic[yorkTeam]][hOrArr[homeOrAway]], 3).getValue();
  var oppOffset = outSheet.getRange(oppositionPos[teamDic[yorkTeam]][hOrArr[homeOrAway]], 3, 1, oppOffNum).getValues();
  
  
  
  //array for individual weapons
  var weaponValArray = [
    [homeTeamMemb, awayTeamMemb],
    [homeIndicator, awayIndicator],
    [homeReserve, awayReserve],
    [joinHome, joinAway],
    [totalHome, totalAway]
  ];
  
  if (oppOffset[0].indexOf(opposition) == -1) {// if the team has not been entered before
    var posOut = findPos(yorkTeam, homeOrAway, opposition);
    
    var matchValArray = [
      [yorkTeam, opposition],
      [homeOrAway, dateMatch],
      [matchType, 0]
    ];
    
    
    
    // this adds a formula to find the final scores of both
    var formulas = [
      ["=SUM((R[5]C[0]),(R[10]C[0]),(R[15]C[0]))", "=SUM((R[5]C[0]),(R[10]C[0]),(R[15]C[0]))"]
    ];
    
    outSheet.getRange(posOut[0], posOut[1], 3, 2).setValues(matchValArray);//entres the over all match data
    outSheet.getRange(oppositionPos[teamDic[yorkTeam]][hOrArr[homeOrAway]], (3+oppOffNum)).setValue(opposition);//writes the name of the opposition into the list
    outSheet.getRange(oppositionPos[teamDic[yorkTeam]][hOrArr[homeOrAway]], 3).setValue(Number(oppOffNum) + 1);//increases the count of teams entred
    
    //adding the oppOffset to the out
    outSheet.getRange(posOut[0] +  weaponRowShift[weapon], posOut[1], 5, 2).setValues(weaponValArray);
    outSheet.getRange(posOut[0] + 3, posOut[1], 1, 2).setFormulasR1C1(formulas);
    
    teamIndiSave(homeTeamMemb,awayTeamMemb,yorkTeam,weapon,homeOrAway);//saves the york indicator
  } else {//if the team has been entered ask if user wants to edit
    var posFound = findPos(yorkTeam, homeOrAway, opposition);
    var weapEdit = weapCheck(opposition, weapon, posFound);
    var weapCntPos = outSheet.getRange(posFound[0] + 2, posFound[1] + 1);
    var weapCnt = weapCntPos.getValue();
    
    if (weapEdit == 0) {//if it is blank write to it and update the count
      outSheet.getRange(posFound[0] +  weaponRowShift[weapon], posFound[1], 5, 2).setValues(weaponValArray);
      weapCntPos.setValue(weapCnt + 1);
      teamIndiSave(homeTeamMemb,awayTeamMemb,yorkTeam,weapon,homeOrAway);//saves the york indicator
    } else if(weapEdit == 1) {//if the user would like to edit
      outSheet.getRange(posFound[0] +  weaponRowShift[weapon], posFound[1], 5, 2).setValues(weaponValArray);
    } else {
      return;//the user wishes to cancel
    }
  }
}


/*

This fuction finds the row and column that the data should be inputed to.
Assumes each data set has a height of 5 cells and width of 7. Looks up the
latest open coloum and updates the stored value

*/
function findPos(yTeam, hOrA, opposition) {
  var position = [];//[0] row, [1] column
  //  var startRow = 10;//this is what needs to be changed if one wishes to add more data
  var startRow = 26;
  var dataLength = 19;//stores how long the data is can be changed to allow for larger values
  var dataWidth = 2;//width of data
  var outSheet = ss.getSheetByName("Data");
  
  var teamDic = {
    "M1": 0,
    "W1": 1,
    "M2": 2,
    "W2": 3,
    "M3": 4,
    "W3": 5,
    "M4": 6,
    "W4": 7,
    "M5": 8,
    "W5": 9,
    "M6": 10,
    "W6": 11,
  };
  
  var rowShift = [
    [0, 1],
    [2, 3],
    [4, 5],
    [6, 7],
    [8, 9],
    [10, 11],
    [12, 13],
    [14, 15],
    [16, 17],
    [18, 19],
    [20, 21],
    [22, 23],
  ];
    
    
    position[0] = 0;//this is the row
  position[1] = 0;//column
  
  //finds the number of columns offset from look up
  var oppOffNum = outSheet.getRange(oppositionPos[teamDic[yTeam]][hOrArr[hOrA]], 3).getValue();
  var oppOffset = outSheet.getRange(oppositionPos[teamDic[yTeam]][hOrArr[hOrA]], 4, 1, oppOffNum).getValues();
  var oppIndex = oppOffset[0].indexOf(opposition);
  
  if(oppIndex != -1) {//if it is in the list then the program looks up the row and uses index
    position[0] = startRow + (dataLength * rowShift[teamDic[yTeam]][hOrArr[hOrA]]);
    position[1] = 3 + (oppIndex*2);
  } else {//
    position[0] = startRow + (dataLength * rowShift[teamDic[yTeam]][hOrArr[hOrA]]);
    position[1] = outSheet.getRange(3 + teamDic[yTeam], 1 + hOrArr[hOrA]).getValue();
    //    updates the column count
    outSheet.getRange(3 + teamDic[yTeam], 1 + hOrArr[hOrA]).setValue(position[1] + 2);
  }
  return position;
}


/*
checks if weapon has been entred or not if it has been asks if the user wouuld like to edit
2 is cancel the action and just end
1 is the weapon has been entred and user would like to edit
0 is empty
*/
function weapCheck(opposition, weapon, pos) {
  var ui = SpreadsheetApp.getUi();
  var trueFalse = 1;
  var outSheet = ss.getSheetByName("Data");
  var weaponPos = outSheet.getRange(pos[0] + weaponRowShift[weapon], pos[1]);
  
  if(weaponPos.isBlank()){//return 0 to show that it is blank
    trueFalse = 0;
  } else {
    var response;
    var msg = "You are about to edit the ";
    msg += weapon;
    msg += " results against ";
    msg += opposition;
    msg += ".";
    
    response = ui.alert(msg, "Continue?", ui.ButtonSet.OK_CANCEL);
    if (response == ui.Button.OK) {
      trueFalse = 1;//the user would like to edit given weapon in given team
    } else if (response == ui.Button.CANCEL){
      trueFalse = 2;//user wishes to stop actions
    }
  }
  
  return trueFalse;    
}
