var scheduleGenerator = {
  
  generateSchedule() {
    var contentQueues = contentQueueService.loadContentQueues();
    var groupsValues =  groupsDBSheet.getValues();
    var scheduleValues = [];
    
    for (var i = 0; i < project.getNoWeeksToGenerate(); ++i) {
      var weekValues = [];
      var weeklyContentQueues = contentQueueService.getWeeklyContentQueues(contentQueues);
      
      for (var j = 0; j < groupsValues.length; ++j) {
        var groupCategory =  groupsValues[j][groupsDBSheet.groupCategoryColumn() - 1];
        var groupLanguage = groupsValues[j][groupsDBSheet.groupLanguageColumn() - 1];
        var content = weeklyContentQueues[groupCategory][groupLanguage].dequeue();
        
        if (content[contentDBSheet.contentCategoryColumn() - 1] == "IEO Ad") {
          var allowsAds = groupsValues[j][groupsDBSheet.allowsAdsColumn() - 1];
          
          if (allowsAds == "No") {
            var contentName = content[contentDBSheet.contentNameColumn() - 1];
            content = advertisements.getAdSub(contentName);
          }
          
          if (i < project.getNoWeekToWhichNoAdsAppear()) { 
            var language = groupsValues[j][groupsDBSheet.groupLanguageColumn() - 1];
            content = advertisements.getAdWarmupSub(language);
          }
        }
        var week = i + project.getStartingWeek();
        var scheduleRow = groupsValues[j].concat(week).concat(content).concat(["", "", "", ""]);
        weekValues.push(scheduleRow);
      }
      
      scheduleValues = scheduleValues.concat(weekValues);
    }
    
    this.putValuesToScheduleAndMakePretty(scheduleValues);    
  },
  
  putValuesToScheduleAndMakePretty(scheduleValues) {  
    var Schedule = scheduleSheet.getNewScheduleSheet(); 
    
    Schedule.getRange(1, 1, 1, scheduleSheet.getSheetWidth()).setValues(scheduleSheet.headerRows());
    Schedule.getRange(1, 1, 1, scheduleSheet.getSheetWidth()).setFontWeight("bold");
    Schedule.getRange(1, 1, 1, scheduleSheet.getSheetWidth()).setBackground(scheduleSheet.headerRowBackgroundColor());
    Schedule.autoResizeColumns(1, scheduleSheet.getSheetWidth());
    Schedule.setFrozenRows(1); 

    Schedule.getRange(2, 1, scheduleValues.length, scheduleValues[0].length).setValues(scheduleValues);
    if (Schedule.getMaxRows() >= 2 + project.getNoGroups() * project.getNoWeeksToGenerate()) {
      Schedule.deleteRows(scheduleValues.length + 2, Schedule.getMaxRows() - (scheduleValues.length + 1));
    }
  
    Schedule.getDataRange().setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP);
    Schedule.getDataRange().setFontFamily(scheduleSheet.fontFamily());
    Schedule.deleteColumns(scheduleSheet.getSheetWidth() + 1, Schedule.getMaxColumns() - scheduleSheet.getSheetWidth());

    scheduleSheet.protectSheet();
  },
}
