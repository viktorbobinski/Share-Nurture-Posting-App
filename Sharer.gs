var sharer = {

  shareBitlinkWithSchedule(bitlinkCell) {
    var groupName = volunteerSheet.getGroupName(bitlinkCell);
    var week = volunteerSheet.getWeek(bitlinkCell);
  
    try {
      var scheduleRow = rowFinder.findRowInSchedule(groupName, week);
      var scheduleBitlinkCell = scheduleRow.getCell(1, scheduleSheet.bitlinkColumn());
      scheduleBitlinkCell.setValue(bitlinkCell.getValue());
      scheduleBitlinkCell.offset(0, scheduleSheet.timeBitlinkGeneratedColumn() - scheduleSheet.bitlinkColumn()).setValue(new Date());
    } catch(e) {
      sharer.emptyCellAndRaiseAlert(bitlinkCell, messages.cannotFindGroupInSchedule(groupName, week));
    }
  },
  
  shareLinkToFbPostWithSchedule(linkToFbPostCell) {
    var groupName = volunteerSheet.getGroupName(linkToFbPostCell);
    var week = volunteerSheet.getWeek(linkToFbPostCell);
    
    var scheduleRow = rowFinder.findRowInSchedule(groupName, week);
    if (scheduleRow != null) {
      scheduleRow.getCell(1, scheduleSheet.linkToFbPostColumn()).setValue(linkToFbPostCell.getValue());
    } else {
      this.emptyCellAndRaiseAlert(linkToFbPostCell, messages.cannotFindGroupInSchedule(groupName, week));
    }    
  },
  
  shareLinkToFbPostWithSecondary(linkToFbPostCell) {   
    var groupName = volunteerSheet.getGroupName(linkToFbPostCell);
    var week = volunteerSheet.getWeek(linkToFbPostCell);
    var secondaryVolunteer = volunteerSheet.getSecondaryVolunteer(linkToFbPostCell);
  
    var volunteerRow = rowFinder.findRowInVolunteerSheet(groupName, week, secondaryVolunteer);
    if (volunteerRow != null) {
      volunteerRow.getCell(1, volunteerSheet.linkToFbPostColumn()).setValue(linkToFbPostCell.getValue());
    } else {
      this.emptyCellAndRaiseAlert(linkToFbPostCell, messages.cannotFindGroupInSecondaryVolunteer(groupName, week, secondaryVolunteer));  
    }
  },
  
  shareDateCommentedWithSchedule(dateCommentedCell) {
    var groupName = volunteerSheet.getGroupName(dateCommentedCell);
    var week = volunteerSheet.getWeek(dateCommentedCell);
  
    var scheduleRow = rowFinder.findRowInSchedule(groupName, week);
    if (scheduleRow != null) {
      scheduleRow.getCell(1, scheduleSheet.dateCommentedColumn()).setValue(dateCommentedCell.getValue());
    } else {
      this.emptyCellAndRaiseAlert(dateCommentedCell, messages.cannotFindGroupInSchedule(groupName, week));
    }
  },
  
  setValueToCellAndRaiseAlert(activeCell, value, message) {
    activeCell.setValue(value);
    ui.alert(message);
  },
  
  emptyCellAndRaiseAlert(activeCell, message) {
    activeCell.setValue("");
    ui.alert(message);
  },
}