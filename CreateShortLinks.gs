//This should be setup according to the layout of volunteer sheets, not the Schedule sheet
function createShortLinkBulk() {
  Logger.log('Entered createShortLinkBulk() function');
  var sss = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var range = SpreadsheetApp.getActiveSpreadsheet().getActiveRange();
  var links = range.getValues();
  Logger.log('The long_urls to shorten: ' + links);
  
  var end = range.getLastRow();
  var beg = end - range.getHeight() + 1;
  var bitlyUrlColumn = range.getLastColumn() + 1;
 
  for (var i = beg, j = 0; i <= end; ++i, ++j) {
    var long_url = links[j][0] 
        + '/?utm_source=' + sss.getRange(i, 4).getValue() 
        +'&utm_medium=FB-Post' 
        + '&utm_campaign=Share&NurtureP1' 
        + '&utm_content=' + sss.getRange(i, bitlyUrlColumn - 2).getValue();
    Logger.log('The long_url with UTM: ' + long_url);
    var tag = sss.getRange(i, bitlyUrlColumn - 3).getValue().split(':')[0].replace('/', '').replace(' ', '');
    Logger.log('Attaching tag: ' + tag);
    
    Logger.log('Inserting Bitly URL in cell: ' + sss.getRange(i, bitlyUrlColumn).getA1Notation() + ' in sheet: ' + SpreadsheetApp.getActiveSheet().getName());
    sss.getRange(i, bitlyUrlColumn).setValue(createShortLink(long_url, [tag]).id);
  }
  Logger.log('Calling onEdit() from generateShortLinkBulk. Exiting createShortLinkBulk()...');
  onEdit();
}


function createShortLink(long_url, tag) {
  var url = 'https://api-ssl.bitly.com/v4/bitlinks';
  var options = {method:"POST", muteHttpExceptions:true, contentType:"application/json", headers:{Authorization:"Bearer " + PropertiesService.getScriptProperties().getProperty('BITLY_TOKEN')},
      payload:JSON.stringify({
          "long_url": long_url,
          "group_guid": PropertiesService.getScriptProperties().getProperty('BITLY_GUID'),
          "tags": tag
        })};
  
  var response = UrlFetchApp.fetch(url, options);
  
  if (response.getResponseCode() != 200 && response.getResponseCode() != 201){
    throw new Error(response.getContentText());
  }
  
  return JSON.parse(response.getContentText());
}
