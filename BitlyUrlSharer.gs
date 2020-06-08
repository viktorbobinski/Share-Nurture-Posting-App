
//Cell indexes should be setup according to the layout of Schedule sheets, not the Volunteer sheets
function shareBitlyUrlWithSchedule(urlCell) {
  Logger.log('Opened Schedule sheet');
  var scheduleSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SCHEDULE);
  var values = scheduleSheet.getRange(2, 1, scheduleSheet.getLastRow() - 1, scheduleSheet.getLastColumn()).getValues();
  
  var week = urlCell.offset(0, -4).getValue();
  Logger.log('Our content is from week: ' + week);
  var groupName = urlCell.offset(0, -6).getValue();
  Logger.log('Our groupName to match: ' + groupName);
  
  //set row so that it points to first item of the proper week
  var rowIter;
  for (i = 0; i < values.length; ++i) {
    if (values[i][6] == week) {
      Logger.log('Week: ' + week + ' starts at row: ' + i);
      rowIter = i;
      break;
    }
  }
  
  //Iterate all groups and stop on that which has the same groupName
  //INFINITE LOOP when no matching groups in schedule and primary (shouldn't happen)
  var rowToUpdate;
  for (var j = rowIter; true; ++j) {
    if (values[j][3] == groupName) {
      Logger.log('The matched groupName: ' + values[j][3]);
      rowToUpdate = j + 1; //convert to range index
      break;
    }
  }
  
  //Why rowToUpdate+1 ???
  Logger.log('Setting Bitly URL to cell: ' + scheduleSheet.getRange(rowToUpdate + 1, 11).getA1Notation() 
      + ' in Sheet: ' + scheduleSheet.getName());
  scheduleSheet.getRange(rowToUpdate + 1, 11).setValue(urlCell.getValue());
  
  Logger.log('EXITING shareBitlyUrlsWithSchedule()...');
}

//Cell indexes should be setup according to the layout of Volunteer sheets, not the Schedule sheet
function shareBitlyUrlsWithSecondary(urlCell, secondaryVolunteerSheet) {
  Logger.log('Opened secondary volunteer sheet: ' + secondaryVolunteerSheet.getName());
  
  var values = secondaryVolunteerSheet.getRange(2, 1, secondaryVolunteerSheet.getLastRow() - 1, secondaryVolunteerSheet.getLastColumn()).getValues();
  var week = urlCell.offset(0, -4).getValue();
  Logger.log('Our content is from week: ' + week);
  var groupName = urlCell.offset(0, -6).getValue();
  Logger.log('Our groupName to match: ' + groupName);
  
  //set row so that it points to first item of the proper week
  var rowIter;
  for (i = 0; i < values.length; ++i) {
    if (values[i][5] == week) {
      Logger.log('Week: ' + week + ' starts at row: ' + i);
      rowIter = i;
      break;
    }
  }
  
  //Iterate all groups and stop on that which has the same groupName
  //INFINITE LOOP when no matching groups in secondary and primary (shouldn't happen)
  var rowToUpdate;
  for (var j = rowIter; true; ++j) {
    if (values[j][3] == groupName) {
      Logger.log('The matched groupName: ' + values[j][3]);
      rowToUpdate = j + 1; //convert to range index
      break;
    }
  }
  
    //Why rowToUpdate+1 ???
  Logger.log('Setting Bitly URL to cell: ' + secondaryVolunteerSheet.getRange(rowToUpdate + 1, 10).getA1Notation() 
      + ' in Sheet: ' + secondaryVolunteerSheet.getName());
  secondaryVolunteerSheet.getRange(rowToUpdate + 1, 10).setValue(urlCell.getValue());
}