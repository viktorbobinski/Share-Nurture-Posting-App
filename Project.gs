var project = {

  resetProjectSettings() {
    PropertiesService.getScriptProperties().deleteAllProperties();
    project.deleteAllSheets();
    project.deleteAllEditors();

    project.putBitlyProps();
    project.putUtmCampaign();

    project.initialiseDocumentOwners();
    project.initialiseVolunteerNames();
    project.putVolunteerEmails();
    project.putCoordinator();
    project.initialiseProtections();

    project.initialiseGroupsDB();
    project.initialiseContentDB();
  },
  deleteAllSheets() {
    for (var sheet of ss.getSheets()) {
      if (sheet.getName() != groupsDBSheet.getSheetName() && sheet.getName() != contentDBSheet.getSheetName()) {
        ss.deleteSheet(sheet);
      }
    }
  },
  deleteAllEditors() {
    for (var editor of ss.getEditors()) {
      ss.removeEditor(editor);
    }
  },
  putBitlyProps() {
    var bitlyToken = input.textInput(messages.provideBitlyToken());
    var bitlyGuid = input.textInput(messages.provideBitlyGuid());

    PropertiesService.getScriptProperties().setProperty("BITLY_TOKEN", bitlyToken);
    PropertiesService.getScriptProperties().setProperty("BITLY_GUID", bitlyGuid);
  },
  putUtmCampaign() {
    var utmCampaign = input.textInput(messages.utmCampaignToSet());
    PropertiesService.getScriptProperties().setProperty("UTMCampaign", utmCampaign);
  },
  initialiseDocumentOwners() {
    var owners = ["eu.promotions@ishafoundation.org", 
                  "eu.promotionsupport@ishafoundation.org", 
                  "dauciunas@gmail.com", 
                  "julia.jasinska97@gmail.com", 
                  "radja.saminada@gmail.com"];

    PropertiesService.getScriptProperties().setProperty("documentOwners", JSON.stringify(owners));
    ss.addEditors(owners);
  },
  initialiseVolunteerNames() {
    var volunteers = new Set();
    var groupsDBValues = groupsDBSheet.getValues();
    
    for (row of groupsDBValues) {
      var primaryVolunteer = row[groupsDBSheet.primaryVolunteerColumn() - 1];
      volunteers.add(primaryVolunteer);

      var secondaryVolunteer = row[groupsDBSheet.primaryVolunteerColumn() - 1];
      volunteers.add(secondaryVolunteer);
    }
  
    PropertiesService.getScriptProperties().setProperty("volunteers", JSON.stringify(Array.from(volunteers)));
  },
  putVolunteerEmails() {
    var volunteers = project.getVolunteerNames();
    var emails = [];
    for (var name of volunteers) {
      var email = input.textInput(messages.emailOfVolunteer(name));
      emails.push(email);
    }
    ss.addEditors(emails);
  },
  putCoordinator() {
    var response = input.buttonInput(messages.doesDocumentHaveCoordintor());
    if (response == ui.Button.YES) {
      var email = input.textInput(messages.emailOfCoordinator());
      project.addOwner(email);
      ss.addEditor(email);
    }
  },
  initialiseProtections() {
    var protections = ss.getProtections(SpreadsheetApp.ProtectionType.RANGE);
    for (var protection of protections) {
      protection.removeEditors(protection.getEditors());
    }
  
    protections = ss.getProtections(SpreadsheetApp.ProtectionType.SHEET);
    for (var protection of protections) {
      protection.removeEditors(protection.getEditors());
    }

    var GroupsDB = groupsDBSheet.getSheet();
    var groupsDBProtection = GroupsDB.protect();
    groupsDBProtection.addEditors(project.getDocumentOwners());

    var ContentDB = contentDBSheet.getSheet();
    var contentDBProtection = ContentDB.protect();
    contentDBProtection.addEditors(project.getDocumentOwners());
  },
  initialiseGroupsDB() {
    project.initialiseCategories();
    project.initialiseLanguages();
    project.initialiseGroupLanguageCategoryCount(project.getLanguages(), project.getCategories());
    groupsDBSheet.getSheet().getDataRange().setFontFamily(groupsDBSheet.fontFamily());
    groupsDBSheet.cropSheet();
  },
  initialiseContentDB() {
    contentDBSheet.getSheet().getDataRange().setFontFamily(contentDBSheet.fontFamily());
    contentDBSheet.cropSheet();
  },



  getBitlyToken() {
    return PropertiesService.getScriptProperties().getProperty('BITLY_TOKEN');          
  },
  getBitlyGUID() {
    return PropertiesService.getScriptProperties().getProperty('BITLY_GUID');          
  },
  getUtmCampaign() {
    return PropertiesService.getScriptProperties().getProperty("UTMCampaign");
  },
  


  initialiseLanguages() {
    var languages = new Set();
    var groupsDBValues = groupsDBSheet.getValues();

    for (var row of groupsDBValues) {
      var groupLanguage = row[groupsDBSheet.groupLanguageColumn() - 1];
      languages.add(groupLanguage);
    }
    PropertiesService.getScriptProperties().setProperty("languages", JSON.stringify(Array.from(languages)));
  },
  getLanguages() {
    return JSON.parse(PropertiesService.getScriptProperties().getProperty("languages"));
  },  
  initialiseCategories() {
    var categories = new Set();
    var groupsDBValues = groupsDBSheet.getValues();

    for (var row of groupsDBValues) {
      var groupCategory = row[groupsDBSheet.groupCategoryColumn() - 1];
      categories.add(groupCategory);
    }
    PropertiesService.getScriptProperties().setProperty("categories", JSON.stringify(Array.from(categories)));
  },
  getCategories() {
    return JSON.parse(PropertiesService.getScriptProperties().getProperty("categories"));
  },
  initialiseGroupLanguageCategoryCount(languages, categories) {
    languageCategoryCount = [];
    for (var language of languages) {
      languageCategoryCount[language] = [];
      for (var category of categories) {
        languageCategoryCount[language][category] = 0;
      }
    }

    var groupsDBValues = groupsDBSheet.getValues();
    var totalGroupCount = 0;
    for (var row of groupsDBValues) {
      var language = row[groupsDBSheet.groupLanguageColumn() - 1];
      var category = row[groupsDBSheet.groupCategoryColumn() - 1];
      ++languageCategoryCount[language][category];
      ++totalGroupCount;
    }

    for (var language of languages) {
      for (var category of categories) {
        PropertiesService.getScriptProperties().setProperty("groups." + language + "." + category, languageCategoryCount[language][category]);
      }  
    }
    PropertiesService.getScriptProperties().setProperty("groups.all", totalGroupCount);
  },
  getGroupCategoriesCount(category, language) {
    return parseInt(PropertiesService.getScriptProperties().getProperty("groups." + language + "." + category), 10);
  },
  getNoGroups() {
    return parseInt(PropertiesService.getScriptProperties().getProperty("groups.all"), 10);
  },


  
  getStartingWeek() {
    return parseInt(PropertiesService.getScriptProperties().getProperty("startingWeek"), 10);
  },
  setStartingWeek(startingWeek) {
    PropertiesService.getScriptProperties().setProperty("startingWeek", startingWeek);
  },
  getNoWeeksToGenerate() {
    return parseInt(PropertiesService.getScriptProperties().getProperty("noWeeksToGenerate"), 10);
  },
  setNoWeeksToGenerate(noWeeksToGenerate) {
    PropertiesService.getScriptProperties().setProperty("noWeeksToGenerate", noWeeksToGenerate);
  },
  getBatchSize() {
    return parseInt(PropertiesService.getScriptProperties().getProperty("batchSize"), 10);
  },
  setBatchSize(batchSize) {
    PropertiesService.getScriptProperties().setProperty("batchSize", batchSize);
  },
  


  getDocumentOwners() {
    return JSON.parse(PropertiesService.getScriptProperties().getProperty("documentOwners"));
  },
  removeOwner(oldOwner) {
    var protections = ss.getProtections(SpreadsheetApp.ProtectionType.RANGE);
    for (var protection of protections) {
      protection.removeEditor(oldOwner);
    }
  
    protections = ss.getProtections(SpreadsheetApp.ProtectionType.SHEET);
    for (var protection of protections) {
      protection.removeEditor(oldOwner);
    }

    var owners = this.getDocumentOwners();
    if (owners != null) {
      for (var i = 0; i < owners.length; ++i) {
        if (owners[i] == oldOwner) {
          owners.splice(i, 1);
        }
      }
      PropertiesService.getScriptProperties().setProperty("documentOwners", JSON.stringify(owners));
    }
  },
  addOwner(owner) {
    var owners = this.getDocumentOwners();
    if (owners == null) {
      owners = [];
    }
    owners.push(owner);
    PropertiesService.getScriptProperties().setProperty("documentOwners", JSON.stringify(owners));
    
    var protections = ss.getProtections(SpreadsheetApp.ProtectionType.RANGE);
    for (var protection of protections) {
      protection.addEditor(owner);
    }
  
    protections = ss.getProtections(SpreadsheetApp.ProtectionType.SHEET);
    for (var protection of protections) {
      protection.addEditor(owner);
    }
  },
  addProtection(protection) {
    var owners = project.getDocumentOwners();
    Logger.log(owners);
    Logger.log(protection.toString());
    protection.addEditors(owners);
  },


  swapVolunteerProperties(oldName, newName) {
    var primaryValue = project.getNoRowsForVolunteer(oldName, "primary");
    var secondaryValue = project.getNoRowsForVolunteer(oldName, "secondary");
    
    PropertiesService.getScriptProperties().deleteProperty(oldName + ".primary");
    PropertiesService.getScriptProperties().deleteProperty(oldName + ".secondary");

    project.setPrimaryVolunteerRowsCount(newName, primaryValue);
    project.setSecondaryVolunteerRowsCount(newName, secondaryValue);
  },
  addVolunteer(volunteer, email) {
    ss.addEditor(email);
    var volunteers = project.getVolunteerNames();
    if (volunteers == null) {
      volunteers = [];
    }
    volunteers.push(volunteer);
    PropertiesService.getScriptProperties().setProperty("volunteers", JSON.stringify(volunteers));
  },
  removeVolunteer(volunteer, email) {
    var volunteers = project.getVolunteerNames();
    if (volunteers == null) {
      volunteers = [];
    }
    if (volunteers.includes(volunteer)) {
      volunteers.splice(volunteers.indexOf(volunteer), 1);
      PropertiesService.getScriptProperties().setProperty("volunteers", JSON.stringify(volunteers));
    } else {
      ui.alert("No such volunteer in project properties: " + volunteer);
    }
    ss.removeEditor(email);
  },
  getNoVolunteers() { 
    return parseInt(PropertiesService.getScriptProperties().getProperty("noVolunteers"), 10);
  },
  setNoVolunteers(noVolunteers) {
    PropertiesService.getScriptProperties().setProperty("noVolunteers", noVolunteers);
  },
  getVolunteerNames() {
    return JSON.parse(PropertiesService.getScriptProperties().getProperty("volunteers"));
  },
  getNoRowsInSchedule() {
    return this.getNoGroups() * this.getNoWeeksToGenerate();
  },
  setPrimaryVolunteerRowsCount(volunteerName, count) {
    PropertiesService.getScriptProperties().setProperty(volunteerName + ".primary", count);
  },
  setSecondaryVolunteerRowsCount(volunteerName, count) {
    PropertiesService.getScriptProperties().setProperty(volunteerName + ".secondary", count);   
  },
  getNoRowsForVolunteer(volunteerName, which) {
    if (which == "both") {
      var noRows = parseInt(PropertiesService.getScriptProperties().getProperty(volunteerName + "." + "primary"), 10);
      noRows += parseInt(PropertiesService.getScriptProperties().getProperty(volunteerName + "." + "secondary"), 10);
      return noRows;
    }
    return parseInt(PropertiesService.getScriptProperties().getProperty(volunteerName + "." + which), 10);
  },
  


  //load an IEO Ad after every x contents
  //f.e. when equal to 6 ads will appear every 7th week
  setIEOAdFrequency(frequency) {
    PropertiesService.getScriptProperties().setProperty("IEOAdFrequency", frequency);
  },
  getIEOAdFrequency() {
    return parseInt(PropertiesService.getScriptProperties().getProperty("IEOAdFrequency"), 10);
  },
  setNoWeekToWhichNoAdsAppear(frequency) {
    PropertiesService.getScriptProperties().setProperty("NoWeekToWhichNoAdsAppear", frequency);
  },
  getNoWeekToWhichNoAdsAppear() {
    PropertiesService.getScriptProperties().getProperty("NoWeekToWhichNoAdsAppear");
  },
}