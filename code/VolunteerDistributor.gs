var volunteerDistributor = {

  distributeSchedule() {
    var scheduleValues = scheduleSheet.getValues();
    for (var volunteerName of project.getVolunteerNames()) {
      this.putValuesToVolunteerSheet(scheduleValues, volunteerName);
    }
  },
  
  putValuesToVolunteerSheet(scheduleValues, volunteerName) {    
    var noPrimaryRows = 0;
    var noSecondaryRows = 0;
    var volunteerValues = [];
    
    for (var w = 0; w < project.getNoWeeksToGenerate(); ++w) {
      var startingRow = w * project.getNoGroups();
      var endingRow = startingRow + project.getNoGroups();
      
      var volunteerPrimaryRows = [];
      var volunteerSecondaryRows = [];
      
      for (var i = startingRow; i < endingRow; ++i) {
        var row = scheduleValues[i];
        var values = [row[scheduleSheet.primaryVolunteerColumn() - 1], 
                      row[scheduleSheet.secondaryVolunteerColumn() - 1], 
                      row[scheduleSheet.groupCategoryColumn() - 1],
                      row[scheduleSheet.groupNameColumn() - 1], 
                      row[scheduleSheet.groupUrlColumn() - 1], 
                      row[scheduleSheet.weekColumn() - 1], 
                      row[scheduleSheet.contentLanguageColumn() - 1],
                      row[scheduleSheet.contentNameColumn() - 1], 
                      row[scheduleSheet.contentUrlColumn() - 1]];
        if (scheduleValues[i][scheduleSheet.primaryVolunteerColumn() - 1] == volunteerName) {
          values.push("", "", scheduleSheet.blockedValueSign());
          volunteerPrimaryRows.push(values);
          ++noPrimaryRows;
        } else if (scheduleValues[i][scheduleSheet.secondaryVolunteerColumn() - 1] == volunteerName) {
          values.push(scheduleSheet.blockedValueSign(), "", "");
          volunteerSecondaryRows.push(values);
          ++noSecondaryRows;
        }
      }
      
      volunteerValues = volunteerValues.concat(volunteerPrimaryRows.concat(volunteerSecondaryRows));
    }   
    
    project.setPrimaryVolunteerRowsCount(volunteerName, noPrimaryRows / project.getNoWeeksToGenerate());
    project.setSecondaryVolunteerRowsCount(volunteerName, noSecondaryRows / project.getNoWeeksToGenerate());
  
    this.putValuesToVolunteerSheetAndMakePretty(volunteerName, volunteerValues);
  },
  
  putValuesToVolunteerSheetAndMakePretty(volunteerName, values) {
    var Volunteer = volunteerSheet.getNewVolunteerSheet(volunteerName);
  
    Volunteer.getRange(1, 1, 1, volunteerSheet.getSheetWidth()).setValues(volunteerSheet.rowHeaders());
    Volunteer.getRange(1, 1, 1, volunteerSheet.getSheetWidth()).setFontWeight("bold");
    Volunteer.getRange(1, 1, 1, volunteerSheet.getSheetWidth()).setBackground(volunteerSheet.headerRowBackgroundColor());
    Volunteer.autoResizeColumns(1, volunteerSheet.getSheetWidth());
  
    var noPrimaryRows = parseInt(PropertiesService.getScriptProperties().getProperty(volunteerName + ".primary"), 10);
    var noSecondaryRows = parseInt(PropertiesService.getScriptProperties().getProperty(volunteerName + ".secondary"), 10);
    var allRows = noPrimaryRows + noSecondaryRows;
  
    for (var w = 0; w < project.getNoWeeksToGenerate(); ++w) {
      Volunteer.getRange(2 + w * allRows, 1, noPrimaryRows, volunteerSheet.getSheetWidth()).setBackground(volunteerSheet.backgroundColor()); //different background color where groups are primary
      Volunteer.getRange(2 + w * allRows, 1, noPrimaryRows, 1).setFontWeight("bold"); //name in bold where groups are primary
      Volunteer.getRange(2 + w * allRows + noPrimaryRows, 2, noSecondaryRows, 1).setFontWeight("bold"); //name in bold where groups are secondary
      Volunteer.getRange(2 + (w + 1) * allRows, 1, 1, volunteerSheet.getSheetWidth()).setBorder(true, null, null, null, null, null, "black", SpreadsheetApp.BorderStyle.SOLID_THICK); //border between weeks
    }
    
    Volunteer.getRange(2, 1, (noPrimaryRows + noSecondaryRows) * project.getNoWeeksToGenerate(), volunteerSheet.getSheetWidth()).setValues(values);
    Volunteer.deleteRows(2 + allRows * project.getNoWeeksToGenerate(), Volunteer.getMaxRows() - (allRows * project.getNoWeeksToGenerate() + 1));
    Volunteer.getDataRange().setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP);  
    Volunteer.getDataRange().setFontFamily(volunteerSheet.fontFamily());
    Volunteer.autoResizeColumns(1,2);
    Volunteer.setFrozenRows(1); 
    Volunteer.deleteColumns(volunteerSheet.getSheetWidth() + 1, Volunteer.getMaxColumns() - volunteerSheet.getSheetWidth());
  
    volunteerSheet.protectSheet(volunteerName);
  }  
}
