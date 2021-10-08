var contentQueueService = {

  loadAdQueue() {   
    var adQueue = {};
    for (language of project.getLanguages()) {
      var ads = advertisements.getAd(language);
      adQueue[language] = new Queue();
      
      for (var i = 0; i < ads.length; ++i) {
        adQueue[language].enqueue(ads[i]);
      }
    }
    
    return adQueue;
  },
  
  loadContentQueues() {
    var contentDBValues = contentDBSheet.getValues();
    var noWeeksToGenerate = project.getNoWeeksToGenerate();
    var IEOAdFrequency = project.getIEOAdFrequency();
  
    var categories = project.getCategories();
    var languages = project.getLanguages();
  
    var adQueue = this.loadAdQueue();
    var allContentQueues = {};  
    var noContent = 0;
    
    for (var category of categories) {
      allContentQueues[category] = {};
      
      for (var language of languages) {
        var contentQueue = new Queue();
        var content = this.getContent(contentDBValues, category, language);
        noContent += content.length;
        
        var noGroups = project.getGroupCategoriesCount(category, language);
  
        var reminderGroupsCount = noGroups - project.getBatchSize() * noWeeksToGenerate;
        if (reminderGroupsCount < 0) {
          reminderGroupsCount = 0;
        }
    
        for (var w = 0, i = 0; w < noWeeksToGenerate + Math.ceil(reminderGroupsCount / project.getBatchSize()); ++w) {
          //after every "project.getIEOAdFrequency()" weeks load 1 IEO Ad
          if (w % IEOAdFrequency + 1 == IEOAdFrequency) {
            contentQueue.enqueue(adQueue[language].dequeue());
          } else {
            contentQueue.enqueue(content[i]);
            ++i;
          }
        }
  
        allContentQueues[category][language] = contentQueue;
      }
    }
    // project.setAllContentCount(noContent);
  
    return allContentQueues;
  },
  
  getWeeklyContentQueues(contentQueues) {
    var allWeeklyContentQueues = {};
    var categories = project.getCategories();
    var languages = project.getLanguages();
    
    for (var category of categories) {
      allWeeklyContentQueues[category] = {};
      
      for (var language of languages){
        var weeklyContentQueue = new Queue();
  
        var groupCategoriesCount = project.getGroupCategoriesCount(category, language);
        var batchSize = project.getBatchSize()
        for (var i = 0; i < Math.ceil(groupCategoriesCount / batchSize); ++i) {
          var content = contentQueues[category][language].peek(i);
          for (var j = 0; j < batchSize; ++j) {
            weeklyContentQueue.enqueue(content);
          }
        }
        allWeeklyContentQueues[category][language] = weeklyContentQueue;
      }
    }
    
    //dequeue the contentQueues once because calling this functions means one week has passed
    for (var category of categories) {
      for (var language of languages) {
        contentQueues[category][language].dequeue();
      }
    }
    return allWeeklyContentQueues;
  },
  
  getContent(values, category, language) {    
    var content = [];
    for (var i = 0; i < values.length; ++i) {
      if (values[i][contentDBSheet.contentCategoryColumn() - 1] == category && values[i][contentDBSheet.contentLanguageColumn() - 1] == language) {
        content.push(values[i]);
      }
    }
    return content;
  }
}
