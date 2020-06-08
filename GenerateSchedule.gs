Logger.log('Setting numbers for Schedule generation...');
Logger.log('The currently added columns are: week, bitly url, date commented, link to posted article')
var groupsWidth = 6;
var contentWidth = 3;
var addedColumnsWidth = 5;
var sumWidth = groupsWidth + contentWidth + addedColumnsWidth;


//IEOContent is a map with 2 values: ieo:[list] and sub:[list]. The [list] represents the 3 elements array of content name, url and category.
function generateSchedule(startWeek, noWeeks, IEOContent) {
  Logger.log('Entering generateSchedule() function');
  
  Logger.log('Preparing IEO Content Map... (remove this responsibility to the dashboard spreadsheet');
  IEOContent = new Map();
  IEOContent.set('IEO AD',['IEO PROMO','IEO AD', 'promo link']);
  IEOContent.set('IEO AD SUB',['IEO PROMO SUB','IEO AD SUB', 'sub link']);
  Logger.log('IEO Content Map: ' + IEOContent);

  startWeek = 1;
  Logger.log('startWeek: ' + startWeek);
  noWeeks = 2;
  Logger.log('noWeeks: ' + noWeeks);
  
  //first load content queues and reroll them according to startWeek. One week's reroll is calling dequeue() #groups -times. The content
  //queues are already enqueued with IEO Content, which gets enqueued every 4 contents (3 in between). The dequeue() happens in each contentqueue separately,
  //just after creating and feeding the queue.
  Logger.log('Starting loading the contentQueues...');
  var contentQueues = loadContentQueues(startWeek, IEOContent.get('IEO AD'));
  
  Logger.log('Starting generating Schedule sheet...');
  var newSheet = getSheetOrCreate(SCHEDULE).clear();
  Logger.log('Opened Schedule sheet');
  var groupsDB = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(GROUPS_DB);
  Logger.log('Opened Groups DB sheet');
  
  Logger.log('Copying the header row');
  groupsDB.getRange(1, 1, 1, groupsWidth)
    .copyTo(newSheet.getRange(1, 1, 1, groupsWidth));
  newSheet.getRange(1, groupsWidth + 1, 1, 1).setValue(['Week']);
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONTENT_DB).getRange(1, 1, 1, contentWidth)
    .copyTo(newSheet.getRange(1, groupsWidth + 2, 1, contentWidth));
  newSheet.getRange(1, groupsWidth + contentWidth + 2, 1, 4).setValues([['Bitly URL', 'Date Commented' ,'Link to Posted Article', 'Date Posted']]);
    newSheet.getRange(1, 1, 1, sumWidth).setFontWeight('bold');
  newSheet.autoResizeColumns(1, sumWidth);
  
  
  Logger.log('Starting copying groups...');
  for (var w = 0; w < noWeeks; ++w) {
    groupsDB.getRange(2, 1, groupsDB.getLastRow() - 1, groupsWidth)
    .copyTo(newSheet.getRange(2 + NO_GROUPS * w, 1, groupsDB.getLastRow() - 1), groupsWidth);
  }
  Logger.log('Copied');
    
  Logger.log('Starting writing content...');
  for (var w = 1; w <= noWeeks; ++w) {
    Logger.log('Writing content for week: ' + w);
    var values = [];
    for (var i = 2; i <= NO_GROUPS + 1; ++i) {
      Logger.log('Writing content to group: ' + newSheet.getRange(i, 4).getValue());
    
      //[w] represents week number in column week. The contentQueues is a map {groupCategory:contentQueueForCategory}
      var value = [w].concat(contentQueues.get(newSheet.getRange(i, 3).getValue()).dequeue());
      Logger.log('The added content: ' + value);
      
      //if the group does not accept ads replace the IEO AD with IEO AD SUB
      if (value[1] === 'IEO PROMO') {
        Logger.log('The current group doesn\' allow IEO Content. Changing to IEO AD SUB...');
        if (newSheet.getRange(i, 6).getValue() == 'No') {
          value[1] = IEOContent.get('IEO AD SUB')[0];
          value[2] = IEOContent.get('IEO AD SUB')[1];
          value[3] = IEOContent.get('IEO AD SUB')[2];
        }
      }
      values.push(value);
    }
    Logger.log('Pushing content for week: ' + w);
    var range = newSheet.getRange(2 + NO_GROUPS * (w - 1), groupsWidth + 1, NO_GROUPS, 4);
    range.setValues(values);  
  }
  Logger.log('Finished writing content');
  
  Logger.log('Clipping the Sheet');   
  newSheet.getDataRange().setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP);  
  Logger.log('Finished generating Schedule');
  
  Logger.log('Starting distribution to volunteers: ' + ALL_VOLUNTEERS);
  for (volunteer of ALL_VOLUNTEERS) {
    distribute(SpreadsheetApp.getActiveSpreadsheet().getSheetByName(volunteer), noWeeks);
  }
}

function distribute(volunteerSheet, noWeeks) {
    Logger.log('Starting distributing to sheet: ' + volunteerSheet.getName());
    
    var scheduleSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SCHEDULE);
    var allValues = scheduleSheet.getRange(2, 1, scheduleSheet.getLastRow() - 1, scheduleSheet.getLastColumn()).getValues();
    
    var volunteerSheet = getSheetOrCreate(volunteer).clear();
    Logger.log('Opened the sheet: ' + volunteerSheet.getName());

    Logger.log('Copying the header row...');
    volunteerSheet.getRange(1, 1, 1, sumWidth).setValues(scheduleSheet.getRange(1, 1, 1, sumWidth).getValues());
    volunteerSheet.autoResizeColumns(1, sumWidth);
    
    //rowIter iterator for jumping on the spreadsheet to get correct ranges (depends on how many it filters)
    Logger.log('Starting copying content values...');
    var rowIter = 2;
    for (var w = 1; w <= noWeeks; ++w) {
      Logger.log('Copying content for week: ' + w);
      
      Logger.log('Getting values for week: ' + w);
      var weekValues = allValues.filter(row => row[6] === w);
      
      Logger.log('Setting "Date Commented" column value for primary volunteers to "N/A"...');
      var filteredPrimary = weekValues.filter(row => {
        if (row[0] == volunteer) {
          row[11] = 'N/A';
          return true;
        }
        return false;
      });
      
      Logger.log('Copying content for primary groups...');
      volunteerSheet.getRange(rowIter, 1, filteredPrimary.length, sumWidth).setValues(filteredPrimary);
      
      Logger.log('Sharing "N/A" values with Schedule...');
      var dateCommentedSharer = new DateCommentedSharer();
      for (var i = rowIter, j = 0; j < filteredPrimary.length; ++i, ++j) {
        Logger.log('sharing val;ue: ' + volunteerSheet.getRange(i, 12).getValue())
        dateCommentedSharer.shareWithSchedule(volunteerSheet.getRange(i, 12));
      }
      rowIter += filteredPrimary.length;
      
      Logger.log('Copying content for secondary groups...');
      filteredSecondary = weekValues.filter(row => row[1] == volunteer);
      volunteerSheet.getRange(rowIter, 1, filteredSecondary.length, sumWidth).setValues(filteredSecondary);
        rowIter += filteredSecondary.length;
    }
    
    Logger.log('Deleting column ' + 6 + ' because it\'s not needed in volunteer sheet');
    volunteerSheet.deleteColumn(6);
       
    Logger.log('Clipping the Sheet');   
    volunteerSheet.getDataRange().setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP);  
    Logger.log('Finished generating sheet for volunteer: ' + volunteerSheet.getName());
}