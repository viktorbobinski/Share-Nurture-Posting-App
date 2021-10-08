var bitlyService = {
  
  getBitlink(longUrl) { 
    var apiUrl = "https://api-ssl.bitly.com/v4/bitlinks";
    var options = {method:"POST", muteHttpExceptions:true, contentType:"application/json", headers:{Authorization:"Bearer " + project.getBitlyToken()},
                   payload:JSON.stringify({"long_url": longUrl, "group_guid": project.getBitlyGUID()})};
          
    var response = UrlFetchApp.fetch(apiUrl, options);
    
    if (response.getResponseCode() != 200 && response.getResponseCode() != 201){
      throw new Error(response.getContentText());
    }
    
    return JSON.parse(response.getContentText()).id;
  },
    
  getLongUrl(contentUrlCell) {
    var contentUrl = contentUrlCell.getValue();
    var groupName = volunteerSheet.getGroupName(contentUrlCell);
    var contentName = volunteerSheet.getContentName(contentUrlCell);
    
    var longUrl = contentUrl + '/?utm_source=' + groupName + '&utm_medium=fb' +
                  '&utm_campaign=' + project.getUtmCampaign() + '&utm_content=' + contentName;
    return longUrl;
  },
}
