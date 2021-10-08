var replacer = {
  
  markGroup(groupName, weeks) {
    try {
      var groupScheduleRow = rowFinder.findRowInSchedule(groupName, weeks[0]);
      for (var week of weeks) {
        var primaryVolunteer = groupScheduleRow.getCell(1, scheduleSheet.primaryVolunteerColumn()).getValue();
        var primaryVolunteerRowRange = rowFinder.findRowInVolunteerSheet(groupName, week, primaryVolunteer);
        primaryVolunteerRowRange.getCell(1, volunteerSheet.bitlinkColumn()).setBackground("red");
        primaryVolunteerRowRange.getCell(1, volunteerSheet.linkToFbPostColumn()).setBackground("red");
        primaryVolunteerRowRange.getCell(1, volunteerSheet.dateCommentedColumn()).setBackground("red");

        var secondaryVolunteer = groupScheduleRow.getCell(1, scheduleSheet.secondaryVolunteerColumn()).getValue();
        var secondaryVolunteerRowRange = rowFinder.findRowInVolunteerSheet(groupName, week, secondaryVolunteer);
        secondaryVolunteerRowRange.getCell(1, volunteerSheet.bitlinkColumn()).setBackground("red");
        secondaryVolunteerRowRange.getCell(1, volunteerSheet.linkToFbPostColumn()).setBackground("red");
        secondaryVolunteerRowRange.getCell(1, volunteerSheet.dateCommentedColumn()).setBackground("red");
      }
    } catch(e) {
      ui.alert("Error: Mark group for replacement", e.message, ui.ButtonSet.OK);
    }   
  },
  
  replaceGroup(groupName, weeks, newGroupName, newGroupUrl, newAdPolicy, newSize, newPostsInLast30Days) {
    var GroupsDB = groupsDBSheet.getSheet();
    var groupsDBValues = groupsDBSheet.getValues();
    for (var i = 0; i < groupsDBValues.length; ++i) {
      if (groupsDBValues[i][groupsDBSheet.groupNameColumn() - 1] == groupName) {
        GroupsDB.getRange(i + 2, groupsDBSheet.groupNameColumn()).setValue(newGroupName);
        GroupsDB.getRange(i + 2, groupsDBSheet.groupUrlColumn()).setValue(newGroupUrl);
        GroupsDB.getRange(i + 2, groupsDBSheet.allowsAdsColumn()).setValue(newAdPolicy);
        GroupsDB.getRange(i + 2, groupsDBSheet.sizeColumn()).setValue(newSize);
        GroupsDB.getRange(i + 2, groupsDBSheet.postsInLast30daysColumn()).setValue(newPostsInLast30Days);
      }
    }

    var groupScheduleRow = rowFinder.findRowInSchedule(groupName, weeks[0]);
    var oldAdPolicy = groupScheduleRow.getCell(1, scheduleSheet.allowsAdsColumn()).getValue();
    var oldContentName = groupScheduleRow.getCell(1, scheduleSheet.contentNameColumn()).getValue();
    var adSub = advertisements.getAdSub(oldContentName);
    for (var week of weeks) {
      var scheduleRowRange = rowFinder.findRowInSchedule(groupName, week);
      var currentContentCategory = scheduleRowRange.getCell(1, scheduleSheet.contentCategoryColumn()).getValue();
      scheduleRowRange.getCell(1, scheduleSheet.groupNameColumn()).setValue(newGroupName);
      scheduleRowRange.getCell(1, scheduleSheet.groupUrlColumn()).setValue(newGroupUrl);
      scheduleRowRange.getCell(1, scheduleSheet.allowsAdsColumn()).setValue(newAdPolicy);

      if (currentContentCategory == "IEO Ad" && oldAdPolicy == "Yes" && newAdPolicy == "No") {
        scheduleRowRange.getCell(1, scheduleSheet.contentTypeColumn()).setValue(adSub[0]);
        scheduleRowRange.getCell(1, scheduleSheet.contentCategoryColumn()).setValue(adSub[1]);
        scheduleRowRange.getCell(1, scheduleSheet.contentLanguageColumn()).setValue(adSub[2]);
        scheduleRowRange.getCell(1, scheduleSheet.contentNameColumn()).setValue(adSub[3]);
        scheduleRowRange.getCell(1, scheduleSheet.contentUrlColumn()).setValue(adSub[4]);
      }

      var primaryVolunteer = scheduleRowRange.getCell(1, scheduleSheet.primaryVolunteerColumn()).getValue();
      var primaryVolunteerRowRange = rowFinder.findRowInVolunteerSheet(groupName, week, primaryVolunteer);
      primaryVolunteerRowRange.getCell(1, volunteerSheet.groupNameColumn()).setValue(newGroupName);
      primaryVolunteerRowRange.getCell(1, volunteerSheet.groupUrlColumn()).setValue(newGroupUrl);
      primaryVolunteerRowRange.getCell(1, volunteerSheet.bitlinkColumn()).setBackground(volunteerSheet.backgroundColor());
      primaryVolunteerRowRange.getCell(1, volunteerSheet.linkToFbPostColumn()).setBackground(volunteerSheet.backgroundColor());
      primaryVolunteerRowRange.getCell(1, volunteerSheet.dateCommentedColumn()).setBackground(volunteerSheet.backgroundColor());  

      if (currentContentCategory == "IEO Ad" && oldAdPolicy == "Yes" && newAdPolicy == "No") {
        primaryVolunteerRowRange.getCell(1, volunteerSheet.contentLanguageColumn()).setValue(adSub[2]);
        primaryVolunteerRowRange.getCell(1, volunteerSheet.contentNameColumn()).setValue(adSub[3]);
        primaryVolunteerRowRange.getCell(1, volunteerSheet.contentUrlColumn()).setValue(adSub[4]);
      }      

      var secondaryVolunteer = scheduleRowRange.getCell(1, scheduleSheet.secondaryVolunteerColumn()).getValue();
      var secondaryVolunteerRowRange = rowFinder.findRowInVolunteerSheet(groupName, week, secondaryVolunteer);
      secondaryVolunteerRowRange.getCell(1, volunteerSheet.groupNameColumn()).setValue(newGroupName);
      secondaryVolunteerRowRange.getCell(1, volunteerSheet.groupUrlColumn()).setValue(newGroupUrl);
      secondaryVolunteerRowRange.getCell(1, volunteerSheet.bitlinkColumn()).setBackground("white");
      secondaryVolunteerRowRange.getCell(1, volunteerSheet.linkToFbPostColumn()).setBackground("white");
      secondaryVolunteerRowRange.getCell(1, volunteerSheet.dateCommentedColumn()).setBackground("white");

      if (currentContentCategory == "IEO Ad" && oldAdPolicy == "Yes" && newAdPolicy == "No") {
        secondaryVolunteerRowRange.getCell(1, volunteerSheet.contentLanguageColumn()).setValue(adSub[2]);
        secondaryVolunteerRowRange.getCell(1, volunteerSheet.contentNameColumn()).setValue(adSub[3]);
        secondaryVolunteerRowRange.getCell(1, volunteerSheet.contentUrlColumn()).setValue(adSub[4]);
      }       
    }
  },

  replaceVolunteer(oldName, oldEmail, newName, newEmail) {
    project.removeVolunteer(oldName, oldEmail);
    project.addVolunteer(newName, newEmail);
    project.swapVolunteerProperties(oldName, newName);

    ss.getSheetByName(oldName).setName(newName);
    
    var GroupsDB = groupsDBSheet.getSheet();
    var groupsDBValues = groupsDBSheet.getValues();
    for (var i = 0; i < groupsDBValues.length; ++i) {
      if (groupsDBValues[i][groupsDBSheet.primaryVolunteerColumn() - 1] == oldName) {
        GroupsDB.getRange(i + 2, groupsDBSheet.primaryVolunteerColumn()).setValue(newName);
      } else if (groupsDBValues[i][groupsDBSheet.secondaryVolunteerColumn() - 1] == oldName) {
        GroupsDB.getRange(i + 2, groupsDBSheet.secondaryVolunteerColumn()).setValue(newName);
      }
    }
    
    var Schedule = scheduleSheet.getSheet();
    var scheduleValues = scheduleSheet.getValues();
    for (var i = 0; i < scheduleValues.length; ++i) {
      if (scheduleValues[i][scheduleSheet.primaryVolunteerColumn() - 1] == oldName) {
        Schedule.getRange(i + 2, scheduleSheet.primaryVolunteerColumn()).setValue(newName);
      } else if (scheduleValues[i][scheduleSheet.secondaryVolunteerColumn() - 1] == oldName) {
        Schedule.getRange(i + 2, scheduleSheet.secondaryVolunteerColumn()).setValue(newName);
      }
    }

    for (var volunteer of project.getVolunteerNames()) {
      var Volunteer = volunteerSheet.getSheet(volunteer);
      var volunteerValues = volunteerSheet.getValues(volunteer);
      for (var i = 0; i < volunteerValues.length; ++i) {
        if (volunteerValues[i][volunteerSheet.primaryVolunteerColumn() - 1] == oldName) {
          Volunteer.getRange(i + 2, volunteerSheet.primaryVolunteerColumn()).setValue(newName);
        } else if (volunteerValues[i][volunteerSheet.secondaryVolunteerColumn() - 1] == oldName) {
          Volunteer.getRange(i + 2, volunteerSheet.secondaryVolunteerColumn()).setValue(newName);
        }
      }
    }
  },

  replaceCoordinator(oldEmail, newEmail) {//just replaces the protected ranges and document owner emails. The replaced coordinator still is a volunteer which can post and her/his name will not be replaced in the whole sheet.
    project.removeOwner(oldEmail);
    project.addOwner(newEmail);
  },
}
