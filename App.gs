var CONTENT_DB = 'Content DB';
var GROUPS_DB = 'Groups DB';
var SCHEDULE = 'Schedule';

var NO_GROUPS = 41;
var NO_CONTENT = 54;

var ALL_VOLUNTEERS = ['Kasia', 'Viktor', 'Łukasz', 'Marcel', 'Julia']

var CATEGORIES = ['YOGA', 'WELLB: Wellbeing/Healthy lifestyle', 'SPIR/CONS: Spirituality/Consciousness', 'PRNT: Parenting/Raising Children'];

var BATCH_SIZE = 3;

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Isha Tools')
      .addItem('Synchronize', 'synchronizeLinks')
      .addItem('Create short link(s)', 'createShortLinkBulk')
      .addToUi();
}
