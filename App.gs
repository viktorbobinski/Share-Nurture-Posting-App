//The repository on github to this script: https://github.com/IshaPoland/Share-Nurture

function onOpen() { 
  ui.createMenu("Isha Tools")
  .addItem("Create Bitlink", "app.createBitlink")
  .addSeparator()
  .addItem("Mark a group for replacement", "app.markGroup")
  .addSeparator()
  .addSubMenu(ui.createMenu("Coordinator tools")  
                .addItem("Replace a group", "app.replaceGroup")
                .addItem("Replace a volunteer", "app.replaceVolunteer")
                .addItem("Replace a coordinator", "app.replaceCoordinator")
                .addSeparator()
                .addItem("Count needed contents", "app.countNeededContents")
                .addItem("Generate Schedule", "app.generateSchedule"))
  .addToUi();
  
  //For those who have small screens and Isha Tools is not visible for them.
  ui.createAddonMenu().addItem("Create Bitlink", "createBitlink").addToUi();   
}

function onEdit() {
  var activeSheet = ss.getActiveSheet();
  var activeCell = activeSheet.getActiveCell();
  
  if (project.getVolunteerNames().includes(activeSheet.getName())) {  

      if (activeCell.getColumn() == volunteerSheet.linkToFbPostColumn()) {    

        if (activeSheet.getName() == volunteerSheet.getPrimaryVolunteer(activeCell)) {
          sharer.shareLinkToFbPostWithSchedule(activeCell);
          sharer.shareLinkToFbPostWithSecondary(activeCell);
        } else {
          ui.alert(messages.onlyPrimaryEditsLinkToFbPost());
          var valueFromPrimarySheet = rowFinder.findRowInVolunteerSheet(volunteerSheet.getGroupName(activeCell), 
                                                                        volunteerSheet.getWeek(activeCell), 
                                                                        volunteerSheet.getPrimaryVolunteer(activeCell))
                                                .getValues()[0][volunteerSheet.linkToFbPostColumn() - 1];
          activeCell.setValue(valueFromPrimarySheet);
        }

    } else if (activeCell.getColumn() == volunteerSheet.dateCommentedColumn()) {      

      if (activeSheet.getName() == volunteerSheet.getSecondaryVolunteer(activeCell)) {
        sharer.shareDateCommentedWithSchedule(activeCell);
      } else {
        ui.alert(messages.onlySecondaryEditsDateCommented());
        activeCell.setValue(volunteerSheet.blockedValueSign());
      }      

    } else if (activeCell.getColumn() == volunteerSheet.bitlinkColumn()) {      

      if (activeSheet.getName() == volunteerSheet.getPrimaryVolunteer(activeCell)) {   
        ui.alert(messages.bitlinkShouldBeGeneratedNotInserted());
        activeCell.setValue("");
      } else {
        ui.alert(messages.bitlinkShouldBeGeneratedByPrimary());
        activeCell.setValue(volunteerSheet.blockedValueSign());
      }
    }
    
  } else {
    //editing outside volunteer sheets
  }
}


//FUNCTION UNDER ISHA TOOLS
var app = {
  
  createBitlink() {  
    var activeSheet = ss.getActiveSheet();

    if (project.getVolunteerNames().includes(activeSheet.getName())) {
      var activeCell = activeSheet.getActiveCell();

      if (activeSheet.getName() == volunteerSheet.getPrimaryVolunteer(activeCell) && activeCell.getColumn() == volunteerSheet.contentUrlColumn()) {
        var longUrl = bitlyService.getLongUrl(activeCell);
        var bitlink = bitlyService.getBitlink(longUrl);
        var bitlinkCell = volunteerSheet.getBitlinkCell(activeCell);
        bitlinkCell.setValue(bitlink);
        sharer.shareBitlinkWithSchedule(bitlinkCell);
      } else {
        ui.alert(messages.creatingBitlinkShouldBeUsedOnlyByPrimaryAndOnContentUrl());
      }  
    } else {
      ui.alert(messages.creatingBitlinkShouldBeUsedOnlyInVolunteerSheets());
    }
  },

  markGroup() {
    var groupName = input.textInput(messages.nameOfTheGroupToBeMarked());
    var week = input.textInput(messages.weekToMarkTheGroupFrom());
    
    var weeks = [];
    for (var i = week; i < project.getStartingWeek() + project.getNoWeeksToGenerate(); ++i) {
      weeks.push(i);
    }

    try {
      response = input.warningButtonInput(messages.reviewMarkGroup(groupName, week));
      if (response == ui.Button.YES) {
        replacer.markGroup(groupName, weeks); 
      } else {
        ui.alert(messages.operationCanceled());
      }
    } catch(e) {
      ui.alert("Error: replace volunteer", e.message, ui.ButtonSet.OK);
    }
  },

  replaceGroup() {
    if (!project.getDocumentOwners().includes(Session.getActiveUser().getEmail())) {
      ui.alert(messages.youAreNotAllowedToPerformThisOperation());
      return;
    }

    var groupName = input.textInput(messages.nameOfGroupToBeReplaced());
    var week = input.textInput(messages.weekToReplaceTheGroupFrom());
    var newGroupName = input.textInput(messages.nameOfNewGroup());
    var newGroupUrl = input.textInput(messages.urlOfNewGroup());
    var newAdPolicy = input.buttonInput(messages.doesNewGroupAllowAds());
    var newSize = input.numberInput(messages.sizeOfNewGroup());
    var newPostsInLast30Days = input.numberInput(messages.newPostsInLast30Days());
    if (newAdPolicy == ui.Button.NO) {
      newAdPolicy = "No"; 
    } else {
      newAdPolicy = "Yes";
    }
    
    var weeks = [];
    for (var i = week; i < project.getStartingWeek() + project.getNoWeeksToGenerate(); ++i) {
      weeks.push(i);
    }

    try {
      response = input.warningButtonInput(messages.reviewReplaceGroup(groupName, weeks, newGroupName, newGroupUrl, newAdPolicy));
      if (response == ui.Button.YES) {
        replacer.replaceGroup(groupName, weeks, newGroupName, newGroupUrl, newAdPolicy, newSize, newPostsInLast30Days);
      } else {
        ui.alert(messages.operationCanceled());
      }
    } catch(e) {
      ui.alert("Error: replace group", e.message, ui.ButtonSet.OK);
    }
  },
  
  replaceVolunteer() {
    if (!project.getDocumentOwners().includes(Session.getActiveUser().getEmail())) {
      ui.alert(messages.youAreNotAllowedToPerformThisOperation());
      return;
    }

    var oldName = input.textInput(messages.nameOfOldVolunteer());
    var oldEmail = input.textInput(messages.emailOfOldVolunteer());

    var newName = input.textInput(messages.nameOfNewVolunteer());
    var newEmail = input.textInput(messages.emailOfNewVolunteer());

    try {
      response = input.warningButtonInput(messages.reviewReplaceVolunteer(oldName, oldEmail, newName, newEmail));
      if (response == ui.Button.YES) {
       replacer.replaceVolunteer(oldName, oldEmail, newName, newEmail);
      } else {
        ui.alert(messages.operationCanceled());
      }
    } catch(e) {
      ui.alert("Error: replace volunteer", e.message, ui.ButtonSet.OK);
    }
  },

  replaceCoordinator() {
    if (!project.getDocumentOwners().includes(Session.getActiveUser().getEmail())) {
      ui.alert(messages.youAreNotAllowedToPerformThisOperation());
      return;
    }

    var oldEmail = input.textInput(messages.emailOfOldCoordinator());
    var newEmail = input.textInput(messages.emailOfNewCoordinator());

    if (oldEmail == Session.getActiveUser().getEmail()) {
      ui.alert(messages.contactTheAdministratorToPerformThisAction());
      return;
    }

    try {
      response = input.warningButtonInput(messages.reviewReplaceCoordinator(oldEmail, newEmail));
      if (response == ui.Button.YES) {
       replacer.replaceCoordinator(oldEmail, newEmail);
      } else {
        ui.alert(messages.operationCanceled());
      }
    } catch(e) {
      ui.alert("Error: replace coordinator", e.message, ui.ButtonSet.OK);
    }
  },

  countNeededContents() {
    var groupsDBValues = groupsDBSheet.getValues();
    project.initialiseLanguages();
    project.initialiseCategories();
    
    var languages = project.getLanguages();
    var categories = project.getCategories();
    
    var groupsCount = {};
    for (var language of languages) {
      groupsCount[language] = [];
      for (var category of categories) {
        groupsCount[language][category] = 0;
      }
    }
    
    var combinedGroups = 0;
    for (var row of groupsDBValues) {
      var groupLanguage = row[groupsDBSheet.groupLanguageColumn() - 1];
      var groupCategory = row[groupsDBSheet.groupCategoryColumn() - 1];
      ++groupsCount[groupLanguage][groupCategory];
      ++combinedGroups;
    }
    
    var message = "Content needed for 7 weeks:\n";
    var combinedContents = 0;
    
    for (var language of languages) {
      for (var category of categories) {
        var neededContents = (Math.ceil(groupsCount[language][category] / 5) + 5);
        if (groupsCount[language][category] == 0) {
          neededContents = 0;
        }
        combinedContents += neededContents;
        message +=  language + ", " + category + ": " + neededContents + "\n";
      }
    }
    message += "Combined contents needed: " + combinedContents + "\n";

    message += "\nGroups count:\n";
    for (var language of languages) {
      for (var category of categories) {
        message +=  language + ", " + category + ": " + groupsCount[language][category] + "\n";
      }
    }
    message += "Combined groups: " + combinedGroups;
    
    ui.alert(message);
  },

  generateSchedule() {
    if (project.getDocumentOwners() == null) {
      project.initialiseDocumentOwners();
    }
  
    if (!project.getDocumentOwners().includes(Session.getActiveUser().getEmail())) {
        ui.alert(messages.youAreNotAllowedToPerformThisOperation());
        return;
    }

    var response = input.warningButtonInput(messages.areYouSureGenerateSchedule());
    if (response == ui.Button.YES) {
        project.resetProjectSettings();

        var startingWeek = input.numberInput(messages.weekToStartTheGenerationFrom());
        var noWeeksToGenerate = input.numberInput(messages.numberOfWeeksToGenerate());    
        var batchSize = 3;
        var ieoAdFrequency = 3;
        var weeksWithoutAds = 0;
      
        response = input.warningButtonInput(messages.reviewGenerateSchedule(startingWeek, noWeeksToGenerate, batchSize, ieoAdFrequency, weeksWithoutAds));
        if (response == ui.Button.YES) {
          project.setStartingWeek(startingWeek);
          project.setNoWeeksToGenerate(noWeeksToGenerate);

          project.setBatchSize(batchSize);
          project.setIEOAdFrequency(ieoAdFrequency);
          project.setNoWeekToWhichNoAdsAppear(weeksWithoutAds);

          scheduleGenerator.generateSchedule();       
          volunteerDistributor.distributeSchedule();
        }
      } else {
        ui.alert(messages.operationCanceled());
      }
  },
}