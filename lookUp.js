var ss = SpreadsheetApp.getActiveSpreadsheet();
var inputSheet = ss.getSheetByName("ScoreSheet");
var dataSheet = ss.getSheetByName("BackEnd");
var outSheet = ss.getSheetByName("Data");

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

var hOrA = {
  "Home": 0,
  "Away": 1
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
  
  function UiAlertFail() {
  SpreadsheetApp.getUi().alert('The results being requested, have not been entered.\n Please try again.');
  
  }
  
  /*
  reads the input file and checks if the opposition has been entred
  if it has then the scores will be writen back into the input
  sheet. If not then and error message wiil be displayed
  */
  function getData() {
  //all objects bellow are for saving which item is where to
  //  find the right column
  var teamDic = {
  "M1": 0,
  "W1": 1,
  "M2": 2,
  "W2": 3
  };
  
  var hOrA = {
  "Home": 0,
  "Away": 1
  };
  
  var oppRow = [
  [10, 29],
    [48, 67],
      [86, 105],
        [124, 143]
        ];

var oppRowLength = [
  [2, 3],
  [4, 5],
  [6, 7],
  [8, 9]
];

var weaponShiftRow = {
  "Foil": 4,
  "Epee": 9,
  "Sabre": 14
};

//get info required

var recallInfo = inputSheet.getRange(3,3,3).getValues();  //[0]:team, [1]:hOrA, [2]:Opposition

//reads which weapon would like to be read
var weapon = inputSheet.getRange("C15").getValue(); 

//reads the number of opposiotion entered
var numEntred = outSheet.getRange(oppRowLength[teamDic[recallInfo[0]]][hOrA[recallInfo[1]]], 3).getValue();

//sets the range and gets all the values of the opposiotion for a given team
var oppositionRange = outSheet.getRange(oppRowLength[teamDic[recallInfo[0]]][hOrA[recallInfo[1]]], 4, 1, numEntred);
var opposition = oppositionRange.getValues();

//finds the index of the opposition that is beeing retrieved
var indexOfOpp = opposition[0].indexOf(recallInfo[2][0]);


if(indexOfOpp == -1) {
  SpreadsheetApp.getUi().alert('The results being requested, have not been entered.\n Please try again.');
  return;
} else {
  //TODO add 
  var TestTeam = oppRow[teamDic[recallInfo[0]]][hOrA[recallInfo[1]]];
  var Testshift = weaponShiftRow[weapon];
  var rowWeapShift = oppRow[teamDic[recallInfo[0]]][hOrA[recallInfo[1]]] + weaponShiftRow[weapon];//10 + 4
  var columnShift = 3 + (2*indexOfOpp);
  var rangeIn = outSheet.getRange(rowWeapShift, columnShift, 5, 2);
  var readData = rangeIn.getValues();
  
  if(outSheet.getRange(rowWeapShift, columnShift).isBlank()){
    SpreadsheetApp.getUi().alert('The results being requested, have not been entered.\n Please try again.');
    return;
  }
}

//  splits the team members name into an array then transposes it
var homeMemb = transpose(readData[0][0].split(","));
var awayMemb = transpose(readData[0][1].split(","));

//  splits and rotates the score entred and will return it transposed
//  deletes the last element which is the total score
var homeScore = transpose(readData[3][0].split(","));
var awayScore = transpose(readData[3][1].split(","));

Logger.log(homeScore);

//  writes the team members to the sheet
inputSheet.getRange("C10:C13").setValues(homeMemb);
inputSheet.getRange("E10:E13").setValues(awayMemb);

//  writes the scores to the sheet
inputSheet.getRange("C18:C26").setValues(homeScore);
inputSheet.getRange("E18:E26").setValues(awayScore);

reserveRemake(readData[2][0].split(","), 17, 2);
reserveRemake(readData[2][0].split(","), 17, 4);

}

//taken from stack exchange and edited to only transpose 1D
function transpose(original) {
  var copy = [];
  for (var i = 0; i < original.length; ++i) {
    // skip undefined values to preserve sparse array
    if (original[i] === undefined){
      continue;
    }
    //makes sure that the array is the proper length
    copy.push([]);
    
    copy[i][0] = original[i];
  }
  
  return copy;
}

/*
function converts the numeric values stored representing the reserves 
to the actual reserve values nad changes the sheet to match
give start string as reserve B17 and D17
*/
function reserveRemake(reserveList, startRow, startColumn) {
  //assigns the values to its initial range
  var reset = [["TRUE"],["TRUE"],["TRUE"],["TRUE"],["TRUE"],["TRUE"],["TRUE"],["TRUE"],["TRUE"]];
  inputSheet.getRange(Number(startRow)+1, startColumn, 9).setValues(reset);
  //loops throught the reservList and changing
  for(i=0; i < 3; i++){
    if (reserveList[i] != 0){
      inputSheet.getRange((Number(startRow) + Number(reserveList[i])), startColumn).setValue("FALSE");
    }
  }
}

function recall() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var inputSheet = ss.getSheetByName("ScoreSheet");
  var dataSheet = ss.getSheetByName("BackEnd");
  var outSheet = ss.getSheetByName("Data");
  var startRow = 26;
  var dataLength = 19;
  var dataWidth = 2;
  var pos = [];
  
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
    [22, 23]
  ];
  
  //looks up how many rows from the initial row of a data cell it needs to shift
  var weaponRowShift = {
    "Foil": 4,
    "Epee": 9,
    "Sabre": 14
  };
  
  var dataIn = inputSheet.getRange(3, 3, 3).getValues();//[0]team,[1]H/A,[2]Opp
  var weapon = inputSheet.getRange('C15').getValue();
  
  //finds the number of columns offset from look up
  var oppOffNum = outSheet.getRange(oppositionPos[teamDic[dataIn[0]]][hOrArr[dataIn[1]]], 3).getValue();
  
  var oppOffset = outSheet.getRange(oppositionPos[teamDic[dataIn[0]]][hOrArr[dataIn[1]]], 4, 1, oppOffNum).getValues();
  var oppIndex = oppOffset[0].indexOf(dataIn[2][0]);//looks up the opposition
  //  Logger.log(dataIn[2]);
  //  Logger.log(oppOffset[0].indexOf(searchElement));
  //  Logger.log(oppOffset[0][0]);
  if(oppIndex != -1) {//if it is in the list then the program looks up the row and uses index
    pos[0] = startRow + (dataLength * rowShift[teamDic[dataIn[0]]][hOrArr[dataIn[1]]]);
    pos[1] = 3 + (oppIndex*2);
  } else {
    SpreadsheetApp.getUi().alert("The team you are looking for has not been entered.");
    return;
  }
  
  if (outSheet.getRange(pos[0] + weaponRowShift[weapon], pos[1]).isBlank()){
    SpreadsheetApp.getUi().alert("The weapon you are looking for has not been entered.");
    return;
  } else {
    //    this reads in all of the data for a given weapon
    var readTeamWeap = outSheet.getRange(pos[0] + weaponRowShift[weapon], pos[1], 5, 2).getValues()
    var readDate = outSheet.getRange(pos[0] + 1, pos[1] + 1).getValue();//reads the date
    //    var matchType = outSheet.getRange(pos[0] + 2, pos[1]).getValue();//league or cup
    //stores and transposes the team names    
    var homeMemb = transpose(readTeamWeap[0][0].split(","));
    var awayMemb = transpose(readTeamWeap[0][1].split(","));
    
    //transposes the scores
    var homeScore = transpose(readTeamWeap[3][0].split(","));
    var awayScore = transpose(readTeamWeap[3][1].split(","));
    
    //  writes the team members to the sheet
    inputSheet.getRange("C10:C13").setValues(homeMemb);
    inputSheet.getRange("E10:E13").setValues(awayMemb);
    
    //  writes the scores to the sheet
    inputSheet.getRange("C18:C26").setValues(homeScore);
    inputSheet.getRange("E18:E26").setValues(awayScore);
    
    reserveRemake(readTeamWeap[2][0].split(","), 17, 2);
    reserveRemake(readTeamWeap[2][1].split(","), 17, 4);
  }
}
