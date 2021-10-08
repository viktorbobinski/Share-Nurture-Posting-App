var rowFinder = {
  
  findRowInSchedule(groupName, week) {
    var values = scheduleSheet.getValues();
    
    var startingRow = (week - project.getStartingWeek()) * project.getNoGroups();
    var endingRow = startingRow + project.getNoGroups();
  
    for (var i = startingRow; i < endingRow; ++i) {
      if (values[i][scheduleSheet.groupNameColumn() - 1] == groupName) {
        return scheduleSheet.getSheet().getRange(2 + i, 1, 1, scheduleSheet.getSheetWidth());
      }
    }
    
    throw new Error(messages.cannotFindGroupInSchedule(groupName, week));
  },
  
  findRowInVolunteerSheet(groupName, week, volunteerName) {
    var values = volunteerSheet.getValues(volunteerName);
    
    var noRowsForVolunteer = project.getNoRowsForVolunteer(volunteerName, "both");
    var startingRow = (week - project.getStartingWeek()) * noRowsForVolunteer;
    var endingRow = startingRow + noRowsForVolunteer;

    for (var i = startingRow; i < endingRow; ++i) {
      if (values[i][volunteerSheet.groupNameColumn() - 1] == groupName) {
        return volunteerSheet.getSheet(volunteerName).getRange(2 + i, 1, 1, volunteerSheet.getSheetWidth());
      }
    }
  
    throw new Error(messages.cannotFindGroupInVolunteerSheet(groupName, week, volunteerName));
  },
}



