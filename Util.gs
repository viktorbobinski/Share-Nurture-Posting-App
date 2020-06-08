function isVolunteersSheet(sheet) {
  return ALL_VOLUNTEERS.includes(sheet.getName());
}

function getSheetOrCreate(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name)
  if (sheet == null) {
    sheet = ss.insertSheet(name);
  }
  return sheet;
}

function deleteAllSheets() {
  for (sheet of ss.getSheets()) {
    if (sheet.getName() != 'Groups DB' && sheet.getName() != 'Content DB') {
      ss.deleteSheet(sheet);
    }
  }
}

function getNoGroups(category) {
  var sss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(GROUPS_DB);
  var data = sss.getDataRange().getValues();
  return data.filter(row => row[2] == category).length;
}