function addDateToCell(cell) {
  cell.setValue(new Date());
  cell.setNumberFormat("mm/dd/yy h:mm");
  
  Logger.log('new Date set in: ' + cell.getA1Notation());
}

//TODO: CHAGNE THIS FUNCTION TO HAVE LESS RANGE CALLS AND MORE VALUE CALLS
function onEdit() {
  Logger.log('Entered onEdit() function');
  var activeSheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var activeCell = activeSheet.getActiveCell();
  
  if (!isVolunteersSheet(activeSheet)) {
    Logger.log('The active sheet was not one of the voluneers sheet. Exiting onEdit() function');
  }
  
  Logger.log('The active sheet is: ' + activeSheet.getName());
  Logger.log('The active cell is: ' + activeCell.getA1Notation());
  Logger.log('The value of the active cell is: ' + activeCell.getValue());
  
  if (activeCell.getValue() === null) {
    Logger.log('The active cell is empty. EXITING onEdit()...');
    return;
  }
  
//Added value to Link to Posted Article column. Share this value. Then:
//Insert current date in the cell.offset(0,1) and share this value.
  if (activeCell.getColumn() == 12) {
    Logger.log('Volunteer added a value to "Link to Posted Article" column');
    
    Logger.log('Starting sharing the Link to Posted Article value...');
    var linkToPostedArticleSharer = new LinkToPostedArticleSharer();
    
    var value = activeCell.getValue();
    Logger.log('The Link to Posted Article: ' + value);
    
    linkToPostedArticleSharer.shareWithSchedule();
    
    var primaryVolunteer = activeCell.offset(0, -11).getValue();
    if (primaryVolunteer == activeSheet.getName()) {
      Logger.log('We are in Primary Volunteer Sheet');
      var secondaryVolunteer = activeCell.offset(0, -10).getValue();
      linkToPostedArticleSharer.shareWithVolunteer(activeCell, SpreadsheetApp.getActiveSpreadsheet().getSheetByName(secondaryVolunteer));
    } else {
      Logger.log('We are in Secondary Volunteer Sheet');
      linkToPostedArticleSharer.shareWithVolunteer(activeCell, SpreadsheetApp.getActiveSpreadsheet().getSheetByName(primaryVolunteer));
    }
    
    
    Logger.log('Starting sharing the new Date');
    var cell = activeCell.offset(0, 1);
    Logger.log('Adding new Date to cell: ' + cell.getA1Notation());
    addDateToCell(cell);
    activeSheet.autoResizeColumn(cell.getColumn());

    var dateSharer = new DateSharer();
    dateSharer.shareWithSchedule(cell);
    
    var primaryVolunteer = cell.offset(0, -12).getValue();
    if (primaryVolunteer == activeSheet.getName()) {
      Logger.log('We are in Primary Volunteer Sheet');
      var secondaryVolunteer = cell.offset(0, -11).getValue();
      dateSharer.shareWithVolunteer(cell, SpreadsheetApp.getActiveSpreadsheet().getSheetByName(secondaryVolunteer));
    } else {
      Logger.log('We are in Secondary Volunteer Sheet');
      dateSharer.shareWithVolunteer(cell, SpreadsheetApp.getActiveSpreadsheet().getSheetByName(primaryVolunteer));
    }
    
    Logger.log('EXIT from onEdit()...');
    return;
  }

//When the activeCell is in ContentURL column (9) this means this onEdit() is triggered by the CreateShortLinks method.
//We take the activeCell.offset(0, 1) and share it with the primary/secondary volunteer and with the Schedule
//TODO: in case is secondary share with primary
//TODO: share with Schedule in cases primary or secondary
  if (activeCell.getColumn() == 9) {
    Logger.log('The long_urls used for generation: ' + activeSheet.getActiveRange().getValues());
  
    var bitlyUrlsRange = activeSheet.getActiveRange().offset(0, 1);
    Logger.log('Bitly URLs were generated: ' + bitlyUrlsRange.getValues());
   
    for (var i = 1; i <= bitlyUrlsRange.getHeight(); ++i) {
      var bitlyUrlCell = bitlyUrlsRange.getCell(i, 1);
      Logger.log('Now sharing Bitly URL: ' + bitlyUrlCell.getValue());
      
      if (activeSheet.getRange(activeCell.getRow(), 1).getValue() == activeSheet.getName()) {
        Logger.log('We are in Primary Volunteer Sheet');
        
        var secondaryVolunteer = bitlyUrlCell.offset(0, -8).getValue();
        Logger.log('Sharing Bitly URL with Secondary Volunteer Sheet: ' + secondaryVolunteer);
        shareBitlyUrlsWithSecondary(bitlyUrlCell, SpreadsheetApp.getActiveSpreadsheet().getSheetByName(secondaryVolunteer)); 
        
      } else {
        Logger.log('We are in Secondary Volunteer Sheet');
        //This also means that someone generated the bitlyURL on the behalf of the primary volunteer and we dont have any record on it, the best would be to somehow
        //change the UTM tag because we need a new bitly link in that sittuation.'. The UTM Could be also provided with random data and always be regenerated anew.
        Logger.log('ERROR: Bitly URL should not be generated in the Secondary Volunteer Sheet!');
        var ui = SpreadsheetApp.getUi();
        ui.alert('ERROR', 'Bitly URLs should not be generated from the Secondary Volunteer Sheet!' +
            '\nThe Bitly URLs that have been generated will be deleted now.', ui.ButtonSet.OK);
        
        Logger.log('Clearing the generated Bitly URL: ' + bitlyUrlsRange.getValues());
        bitlyUrlsRange.clear();
        
        Logger.log('EXITING onEdit()...')
        return;
      }
    
      Logger.log('Sharing Bitly URL with Schedule');
      shareBitlyUrlWithSchedule(bitlyUrlCell);      
    }
  }
  
  //the secondary volunteer updated the "date commented" column. 
  //share this 
  if (activeCell.getColumn() == 11) {
    Logger.log('Secondary Volunteer added a value to "Date Commented" column');
    Logger.log('Sharing with Schedule and Primary');
    
    var dateCommentedSharer = new DateCommentedSharer();
    
    dateCommentedSharer.shareWithSchedule(activeCell);
  }
}

