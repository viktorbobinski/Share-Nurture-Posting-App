class Queue {

  constructor() { 
      this.items = []; 
  } 
  
  front() { 
    return this.items[0]; 
  } 
  
  peek(i) {
    return this.items[i];
  }
  
  enqueue(element) {     
    this.items.push(element); 
  } 
  
  //The queue never ends as it pushes enqueues everything that it dequeues
  dequeue() {
    this.enqueue(this.front());
    return this.items.shift(); 
  }
  
  isEmpty() {
    return this.items.length == 0; 
  }
  
  makeEmpty() {
    this.items = [];
  }
}

//Load all category content queues into a map; category_name:content_for_category
function loadContentQueues(startWeek, IEOContent) {
  Logger.log('Entered loadContentQueues() funtion');
  let contentQueues = new Map();
  for (category of CATEGORIES) {
    var contentQueue = getContentQueue(category, startWeek, IEOContent);
    //reroll it to the current week
    for (var i = 1; i < startWeek; ++i) {
      for (var j = 0; j < getNoGroups(category); ++j) {
        contentQueue.dequeue();
      }
    }
   contentQueues.set(category, contentQueue);
  }
  
  return contentQueues;
}

//loads data into queue, additionally adds IEO ADS
function getContentQueue(category, startWeek, IEOContent) {
  var contentQueue = new Queue();
  var allContent = getContent(category);
  for (var i = 0, v = 0; i < allContent.length;) {
    //every 4th content add IEO promotion
    if (v % 4 == 3) {
      v = -1;
      contentQueue.enqueue(IEOContent);
    } else {
      contentQueue.enqueue(allContent[i]);
      ++i;
    }
    ++v;
  }
  return contentQueue;
}

function getContent(category) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var contentSheet = ss.getSheetByName(CONTENT_DB);
  var contentDataRange = contentSheet.getDataRange()
  var values = contentSheet.getRange(2, 1, contentDataRange.getHeight() - 1, contentDataRange.getWidth()).getValues();
  return values.filter(row => row[0] == category);
}