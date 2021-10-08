var ui = SpreadsheetApp.getUi();
var ss = SpreadsheetApp.getActiveSpreadsheet();

var scheduleSheet = {

  getSheetName() {
    return "Schedule";
  },

  getNewScheduleSheet() {
    var sheet = ss.getSheetByName(scheduleSheet.getSheetName());
    if (sheet != null) {
      ss.deleteSheet(ss.getSheetByName(scheduleSheet.getSheetName()));
    }
    sheet = ss.insertSheet(scheduleSheet.getSheetName());
    return sheet;
  },
  
  getSheet() {
    return ss.getSheetByName(scheduleSheet.getSheetName());
  },
  
  getValues() {
    var Schedule = scheduleSheet.getSheet();
    return Schedule.getRange(2, 1, Schedule.getLastRow() - 1, scheduleSheet.getSheetWidth()).getValues();
  },
  
  protectSheet() {
    var Schedule = scheduleSheet.getSheet();
    var protection = Schedule.getRange(1, 1, Schedule.getLastRow(), scheduleSheet.protectionWidth()).protect();
    protection.removeEditors(protection.getEditors());
    protection.addEditors(project.getDocumentOwners());
  },

  protectionWidth() {
    return 13;
  },
  
  getSheetWidth() {
    return 17;
  },
  
  primaryVolunteerColumn() {
    return 1;
  },
  
  secondaryVolunteerColumn() {
    return 2;
  },
  
  groupCategoryColumn() {
    return 3;
  },
  
  groupLanguageColumn() {
    return 4;
  },
  
  groupNameColumn() {
    return 5;
  },
  
  groupUrlColumn() {
    return 6;
  },
  
  allowsAdsColumn() {
    return 7;
  },
  
  weekColumn() {
    return 8;
  },
  
  contentTypeColumn() {
    return 9;
  },
  
  contentCategoryColumn() {
    return 10;
  },
  
  contentLanguageColumn() {
    return 11;
  },
  
  contentNameColumn() {
    return 12;
  },
  
  contentUrlColumn() {
    return 13;
  },
  
  bitlinkColumn() {
    return 14;
  },
  
  timeBitlinkGeneratedColumn() {
    return 15;
  },
  
  linkToFbPostColumn() {
    return 16;
  },
  
  dateCommentedColumn() {
    return 17;
  },
  
  headerRows() {
    return [["Primary volunteer",
             "Secondary volunteer",	
             "Group category",
             "Group language",	
             "Group name",	
             "Group URL",	
             "Allows ads",
             "Week",	
             "Content Type",
             "Content category",
             "Content language",	
             "Content name",	
             "Content URL",	
             "Bitlink",	
             "Time Bitlink generated",
             "Link to FB Post",
             "Date Commented"]];
  },
  
  headerRowBackgroundColor() {
   return '#f3cd51';
  },
  
  fontFamily() {
    return "Open Sans";
  },

  scheduleSheetName() {
    return "Schedule";
  },

  blockedValueSign() {
    return "-";
  },
}

var volunteerSheet = {

  getNewVolunteerSheet(name) {
    var sheet = ss.getSheetByName(name);
    if (sheet != null) {
      ss.deleteSheet(sheet);
    }
    sheet = ss.insertSheet(name);
    return sheet;
  },
  
  getSheet(name) {
    return ss.getSheetByName(name);
  },

  getValues(name) {
    var Volunteer = volunteerSheet.getSheet(name);
    return Volunteer.getRange(2, 1, Volunteer.getLastRow() - 1, volunteerSheet.getSheetWidth()).getValues();
  },

  protectSheet(name) {
    var Volunteer = volunteerSheet.getSheet(name);
    var protection = Volunteer.getRange(1, 1, Volunteer.getLastRow(), volunteerSheet.protectionWidth()).protect();
    protection.removeEditors(protection.getEditors());
    protection.addEditors(project.getDocumentOwners());
  },
  
  protectionWidth() {
    return 7;
  },  

  getBitlinkCell(activeCell) {
    return activeCell.offset(0, this.bitlinkColumn() - activeCell.getColumn());
  },
  
  getContentUrl(activeCell) {
    return activeCell.offset(0, this.contentUrlColumn() - activeCell.getColumn()).getValue();
  },
  
  getContentName(activeCell) {
    return activeCell.offset(0, this.contentNameColumn() - activeCell.getColumn()).getValue();
  },
  
  getPrimaryVolunteer(activeCell) {
    return activeCell.offset(0, this.primaryVolunteerColumn() - activeCell.getColumn()).getValue();
  },
    
  getSecondaryVolunteer(activeCell) {
    return activeCell.offset(0, this.secondaryVolunteerColumn() - activeCell.getColumn()).getValue();
  },
  
  getGroupName(activeCell) {
    return activeCell.offset(0, this.groupNameColumn() - activeCell.getColumn()).getValue();
  },
  
  getWeek(activeCell) {
    return activeCell.offset(0, this.weekColumn() - activeCell.getColumn()).getValue();
  },
  
  getSheetWidth() {
    return 12;
  },
  
  primaryVolunteerColumn() {
    return 1;
  },

  secondaryVolunteerColumn() {
    return 2;
  },
  
  groupCategoryColumn() {
    return 3;
  },
    
  groupNameColumn() {
    return 4;
  },
  
  groupUrlColumn() {
    return 5;
  },
  
  weekColumn() {
    return 6;
  },
  
  contentLanguageColumn() {
    return 7;
  },
  
  contentNameColumn() {
    return 8;
  },
    
  contentUrlColumn() {
    return 9;
  },
  
  bitlinkColumn() {
    return 10;
  },
  
  linkToFbPostColumn() {
    return 11;
  },
  
  dateCommentedColumn() {
    return 12;
  },
  
  rowHeaders() {
    return [["Primary",
      "Secondary",
      "Group category",
      "Group name",
      "Group URL",
      "Week",
      "Language",
      "Content name",
      "Content URL",
      "Bitlink",
      "Link to FB post",
      "Date commented"]];
  },

  fontFamily() {
   return "Open Sans";
  },
  
  backgroundColor() {
    return "#FDE9BF";
  },
  
  headerRowBackgroundColor() {
   return '#f3cd51';
  },

  blockedValueSign() {
    return "-";
  },
}

var groupsDBSheet = {

  getSheetName() {
    return "Groups DB";
  },

  getSheet() {
    return ss.getSheetByName(groupsDBSheet.getSheetName());
  },
    
  getValues() {
    var GroupsDB = groupsDBSheet.getSheet();
    return GroupsDB.getRange(2, 1, GroupsDB.getLastRow() - 1, this.getSheetWidth()).getValues();
  },
  
  cropSheet() {
    var GroupsDB = groupsDBSheet.getSheet();
    if (GroupsDB.getLastColumn() < GroupsDB.getMaxColumns()) {
      GroupsDB.deleteColumns(GroupsDB.getLastColumn() + 1, GroupsDB.getMaxColumns() - GroupsDB.getLastColumn());  
    }   
    if (GroupsDB.getLastRow() < GroupsDB.getMaxRows()) {
       GroupsDB.deleteRows(GroupsDB.getLastRow() + 1, GroupsDB.getMaxRows() -  GroupsDB.getLastRow());
    }
  },

  //The number of columns in GroupsDB which are used in Schedule
  getSheetWidth() {
    return 7;
  },
  
  primaryVolunteerColumn() {
    return 1;
  },
  
  secondaryVolunteerColumn() {
    return 2;
  },
  
  groupCategoryColumn() {
    return 3;
  },
  
  groupLanguageColumn() {
    return 4;
  },
  
  groupNameColumn() {
    return 5;
  },

  groupUrlColumn() {
    return 6;
  },
  
  allowsAdsColumn() {
    return 7;
  },

  sizeColumn() {
    return 8;
  },

  postsInLast30daysColumn() {
    return 9;
  },
  
  fontFamily() {
   return "Open Sans";
  },
  
  headerRowBackgroundColor() {
   return '#f3cd51';
  },
}

var contentDBSheet = {

  getSheetName() {
    return "Content DB";
  },

  getSheet() {
    return ss.getSheetByName(contentDBSheet.getSheetName());
  },

  getValues() {
    var ContentDB = contentDBSheet.getSheet();
    return ContentDB.getRange(2, 1, ContentDB.getLastRow() - 1, contentDBSheet.getSheetWidth()).getValues();
  },
  
  cropSheet() {
    var ContentDB = contentDBSheet.getSheet();
    if (ContentDB.getLastColumn() < ContentDB.getMaxColumns()) {
      ContentDB.deleteColumns(ContentDB.getLastColumn() + 1, ContentDB.getMaxColumns() - ContentDB.getLastColumn());  
    }
    if (ContentDB.getLastRow() < ContentDB.getMaxRows()) {
       ContentDB.deleteRows(ContentDB.getLastRow() + 1, ContentDB.getMaxRows() -  ContentDB.getLastRow());
    }
  },

  //The number of columns in ContentDB which are used in Schedule
  getSheetWidth() {
    return 5;
  },
  
  contentTypeColumn() {
    return 1;
  },
  
  contentCategoryColumn() {
    return 2;
  },
  
  contentLanguageColumn() {
    return 3;
  },
  
  contentNameColumn() {
    return 4;
  },

  fontFamily() {
   return "Open Sans";
  },
  
  headerRowBackgroundColor() {
   return '#f3cd51';
  },
}
