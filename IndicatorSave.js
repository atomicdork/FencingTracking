
/*
Saves the york teams indicators per fencer to a seperate sheet
it will avg the current value with the next value
*/
function teamIndiSave(HnameJoin, AnameJoin, team, weapon, hOrA){
  //https://stackoverflow.com/questions/32565859/find-cell-matching-value-and-return-rownumber
  var split;

  if(hOrA == "Home"){
    split = HnameJoin.split(",");
  } else {
    split = AnameJoin.split(",");
  }
  
  for(i = 0; i < split.length; i++) {
    individSave(split[i], team, weapon, hOrA);
  }
  Logger.log(split[split.length]);
}

/*
this looks up and returns an array for the york fencers
if there is no reserve it skips the last one 
*/
function individSave(name, team, weapon, hOrA){
  var fencerSheet = ss.getSheetByName("FencerData");
  var data = fencerSheet.getDataRange().getValues();  
  
  var pos = findIndiPos(data, name, team, weapon);
  var indi = indicatorLookUp(name, hOrA);//maybe place this in a larger function above
  
  if(pos[2] == 1){
    var array = [[name, team, weapon, indi, 1]];
    fencerSheet.getRange(pos[0], pos[1]).setFormulaR1C1('=JOIN(",",R[0]C[1]:R[0]C[3])'); 
  } else {
    var privIndi = data[pos[0] - 1][4];
    var cnt = data[pos[0] - 1][5];//this reads the count of the num of indicators entered
    var indiAvg = avgIndicator(indi, privIndi, cnt);
    var array = [[name, team, weapon, indiAvg, cnt +1]];
  }
  fencerSheet.getRange(pos[0], pos[1] + 1, 1, 5).setValues(array);
  
}

/*
finds the position of where everything should be entered
if there is no matching position then the returned value will be the bottom emptry row

*/
function findIndiPos(dataArray, name, team, weapon) {
  var fencerSheet = ss.getSheetByName("FencerData");
  var rowOffset = 1;//as the first row is a title row it shifts down by one 
  var pos;//[0] is the row [1] is the column [2] if it is 1 means it is the bottom pos
  
  pos = [0,0,0];
  
  for(var i=0; i < dataArray.length;i++){
    if(dataArray[i][1] == name) {
      if(dataArray[i][2] == team) {
        if(dataArray[i][3] == weapon){
          pos[0] = i + rowOffset;
          pos[1] = 1;
          pos[2] = 0;
          return pos;
        }
      }
    }
  }
  
  pos[0] = fencerSheet.getDataRange().getHeight() + 1;
  pos[1] = 1;
  pos[2] = 1;
  return pos;
}

/*
function to look uo the indicator based on home and away values
changes where it looks up based on if it is home or away
*/
function indicatorLookUp(name, homeOrAway){
  var backend = ss.getSheetByName("BackEnd");
  var data = backend.getRange(3, 9, 4, 4).getValues();//I3:L6
  //looks through the back end first column if home last if away
  for (i = 0; i < 4; i++) {
    if (homeOrAway == "Home") {
      if (data[i][0] == name) {//if it matches the name find the equivalent value
        var indicator = backend.getRange(3 + i, 10).getValue();
        return indicator;
      }
    } else {
      if (data[i][3] == name) {
        var indicator = backend.getRange(3 + i, 11).getValue();
        return indicator;
      }
    }
  }
}

/*
will avg the indicator
*/
function avgIndicator(currentIndicator, avgIndi, entryCnt) {
  var weighted = avgIndi * entryCnt;
  var sum = currentIndicator + weighted;
  var final = sum/(entryCnt + 1);
  
  return final;
}