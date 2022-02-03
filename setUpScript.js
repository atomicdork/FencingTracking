/*
makes the user confirm that they want to start a new year
*/
function confirmTest() {
  SpreadsheetApp.getUi()
  .createMenu('New Season confirm')
  .addItem('do you want to continue', 'setUp')
  .addToUi();
}

/*
This creates a new sheet for the new year
renames the current data sheet to the previous season
and creates a new "Data" sheet that has data added to it for the new year
*/
function setUp() {
  var ui = SpreadsheetApp.getUi();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var inputSheet = ss.getSheetByName("ScoreSheet");
  var backEnd = ss.getSheetByName("BackEnd");
  //gets the last two digits of the year
  var year = Utilities.formatDate(new Date, "GMT", "yy");
  //stores all of the data that one wishes to add to the sheet to start
  var initSetUp= [
    ["Data Sheet For " + year + "-" + (Number(year)+1) + " Season", null, null],
    ["Home", "Away", 1],
    [3, 3, 1],
    [3, 3, 1],
    [3, 3, 1],
    [3, 3, 1],
    [3, 3, 1],
    [3, 3, 1],
    [3, 3, 1],
    [3, 3, 1],
    [3, 3, 1],
    [3, 3, 1],
    [3, 3, 1],
    [3, 3, 1],
    [null, null, 1],
    [null, null, 1],
    [null, null, 1],
    [null, null, 1],
    [null, null, 1],
    [null, null, 1],
    [null, null, 1],
    [null, null, 1],
    [null, null, 1],
    [null, null, 1],
    [null, null, 1]    
  ];
  
  // yes or no prompt
  var result = ui.alert('Please Confirm',
                        'Are you sure you would like to start a new season?',
                        ui.ButtonSet.YES_NO);
  
  if (result == ui.Button.YES) {
    var numOfTeams = ui.prompt('Please enter the maximum number of teams in play.',
                               'choose the gratest number of teams from M or W teams.',
                               ui.ButtonSet.OK_CANCEL);
    
    var button = numOfTeams.getSelectedButton();
    var response = numOfTeams.getResponseText();
    if(response >= 6){
      response = 6;
    }
    
    if(button == ui.Button.OK){
      inputSheet.getRange('C3').activate();
//      intut for the team look up
      inputSheet.getRange('C3').setDataValidation(SpreadsheetApp.newDataValidation()//this sets up the drop down list for the team
                                                  .setAllowInvalid(true).requireValueInRange(backEnd.getRange(3, 1, response*2, 1), true)
                                                  .build());
//      bellow are the drop down list for the fencer look up
      inputSheet.getRange('H16').setDataValidation(SpreadsheetApp.newDataValidation()//this sets up the drop down list for the team
                                                  .setAllowInvalid(true).requireValueInRange(backEnd.getRange(3, 1, response*2, 1), true)
                                                  .build());
      inputSheet.getRange('H17').setDataValidation(SpreadsheetApp.newDataValidation()//this sets up the drop down list for the team
                                                  .setAllowInvalid(true).requireValueInRange(backEnd.getRange(3, 1, response*2, 1), true)
                                                  .build());
      
    }
    //sets the sheet for fencer data to fencer data old
    ss.setActiveSheet(ss.getSheetByName("FencerData"));
    ss.renameActiveSheet("FencerData"+year);
    //creates sheets called rename me and fencerdata
    ss.insertSheet("Rename Me", 1);
    ss.insertSheet("FencerData", 2);
    SpreadsheetApp.flush();
    
    var dataSheet = ss.getSheetByName("Rename Me");
    var fencerSheet = ss.getSheetByName("FencerData");
    var FDataArray = [["Name", "Team", "Weapon", "Indicator", "entry count"]];
   
    
    dataSheet.getRange(1, 1, 25, 3).setValues(initSetUp);
    fencerSheet.getRange(1, 2, 1, 5).setValues(FDataArray);
    
    ui.alert('Confirmation received, please rename "Data" to season dates\n Good luck with the new season');
    
    dataSheet.getRange("A1").setFontSize(14).setFontWeight('bold');
    ss.setActiveSheet(ss.getSheetByName("ScoreSheet"));
  } else {
    ui.alert('Operation cancelled');
  }
  
}