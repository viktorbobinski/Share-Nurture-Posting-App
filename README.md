# Content Scheduler

Content Scheduler is an extension for Google Spreadsheets used for creating posting schedules for a Team of people.

![schedule-sheet](schedule-sheet.PNG)


## Use cases

Content Scheduler can be used for:
  - generating a posting calendar for X weeks ahead
  - creating bitly links from content url's
  - sharing the posted link between sheets, the commenting person does not have to search for the links
  - managing who has access to the spreadsheet, and what actions can be made by them
  - updating groups in case someone is removed

Below are some examples:

- sharing a FB post between two sheets

![share-fb-post](gif_share-fb-post.gif) 


- creating a bitlink from a youtube link

![create-bitlink](gif_create-bitlink.gif)


- marking a group for deletion

![mark group for deletion](gif_mark-group-for-deletion.gif)


- replacing a posting person

![replace volunteer](gif_replace-volunteer.gif)

- the bitlink created also contains additional information on the link itself:
  link is: https://www.youtube.com/watch?v=46DnVgHD_FM/
  information kept is: ?utm_source=Best%20series%20on%20Netflix&utm_medium=fb&utm_campaign=poleng&utm_content=Most%20watched%20series%20on%20Netflix
  Using this information + knowing which bitlink has how many clicks from the Bitly API, we can get the information on our best group and content. This is done by the Content Scheduler Dashboard, under: https://github.com/moononfire/Content-Scheduler-Dashboard_appsscript

## How to start using Content Scheduler

- The easiest way is to first install the "Google Apps Script GitHub Assistant" Google Chrome extension (https://chrome.google.com/webstore/detail/google-apps-script-github/lfjcgcmkmjjlieihflfhjopckgpelofo?hl=en).
- Fork this project on Github.
- Make a copy of the "Content Scheduler" Google spreadsheet (https://docs.google.com/spreadsheets/d/1aEwVAFVsE5zDzhRyN-DG1fK8AJcUzxy-IGMHVpcl6wY/edit?usp=sharing) 
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
