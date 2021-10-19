# Share&Nurture Posting App

This is the Posting App for the Share&Nurture Team at Isha Foundation. 

The application is used for creating a posting schedule and is a platform for a Team of Volunteers, which are posting content related to Yoga on Facebook groups.

Link to the spreadsheet: https://docs.google.com/spreadsheets/d/1aEwVAFVsE5zDzhRyN-DG1fK8AJcUzxy-IGMHVpcl6wY/edit#gid=1071128398

![schedule-sheet](schedule-sheet.PNG)

## Basic characteristics

- written in Google Apps Script (JavaScript)
- Object-Oriented structure
- Many custom functions in UI (Isha Tools tab, see examples below)
- API calls to the Bitly API for generating Bitly links (UrlFetchApp.fetch())
- Spreadsheet project properties managment
- Managing spreadsheet access
- Creating sheets from a template with values provided by user
- Manipulating cells with values provided by user
- Automatically updating values in different sheets when specific information is provided (example #1 below)
- Posting schedule creation includes business logic (f.e. using backup content if ads are not allowed in the Fb group)

## Examples

### #1 sharing a FB post between two sheets
Once the primary volunteer puts the link to the Facebook post, it gets automatically shared with the secondary volunteer.

![share-fb-post](gif_share-fb-post.gif) 


### #2 creating a Bitly link from a Youtube link with Bitly API
  - Custom UTM parameters: https://www.youtube.com/watch?v=46DnVgHD_FM/?utm_source=Best%20series%20on%20Netflix&utm_medium=fb&utm_campaign=poleng&utm_content=Most%20watched%20series%20on%20Netflix
  - UTM parameters are later used by a different application for tracking which groups/contents are best.

![create-bitlink](gif_create-bitlink.gif)


### #3 marking a group for deletion

![mark group for deletion](gif_mark-group-for-deletion.gif)


### #4 replacing a posting person
This function changes the values in the spreadsheet and also manages 

![replace volunteer](gif_replace-volunteer.gif)

- the bitlink created also contains additional information from the utm parameters:
 - link is: https://www.youtube.com/watch?v=46DnVgHD_FM/
 - information kept is: ?utm_source=Best%20series%20on%20Netflix&utm_medium=fb&utm_campaign=poleng&utm_content=Most%20watched%20series%20on%20Netflix
 - Using this information + knowing which bitlink has how many clicks from the Bitly API, we can get the information on our best group and content. This is done by the Content Scheduler Dashboard, under: https://github.com/moononfire/Content-Scheduler-Dashboard_appsscript

## Code snippets

Bitly API call
![bitlyservice-code](bitlyservice-code.PNG)

Rowfinder class
![rowfinder-code](rowfinder-code.PNG)

## How to start using Share&Nurture Posting App

- The easiest way is to first install the "Google Apps Script GitHub Assistant" Google Chrome extension (https://chrome.google.com/webstore/detail/google-apps-script-github/lfjcgcmkmjjlieihflfhjopckgpelofo?hl=en).
  - Alternatively copy all files from this Github into the code section ("Tools > Script editor").
- Fork this project on Github.
- Make a copy of the Google spreadsheet (https://docs.google.com/spreadsheets/d/1aEwVAFVsE5zDzhRyN-DG1fK8AJcUzxy-IGMHVpcl6wY/edit?usp=sharing) 
- Open the spreadsheet and go to the code section ("Tools > Script editor"). 
- Using Apps Script GitHub Assistant, login to your Github account and pull the code from the forked repository into the spreadsheet.
- Start using the application!

## Other
- How to create nice README files
  - https://carbon.now.sh/ - make pictures of your code
  - https://shields.io/ - get interactive banners like github download count, ready to add to github
  - https://github.com/matiassingers/awesome-readme - examples of good readmes

- Writing in Markdown tutorial
  -https://www.youtube.com/watch?v=eJojC3lSkwg
