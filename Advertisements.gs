var advertisements = {
  
  getAd(language) {
    var ads = {"ENG": [["Blog", 
                        "IEO Ad", 
                        "ENG",
                        "Free webinars - talk about a specific one or all", 
                        "https://www.ishayoga.eu/index.php/live-webinars/"]]};
    return ads[language];
  },
  
  getAdSub(adName) { 
    var subs = {"Free webinars - talk about a specific one or all": ["YT",  
                                                                     "IEO Ad substitute", "ENG", "Yoga for Wellbeing",   
                                                                     "https://www.youtube.com/watch?v=Opw9G1qKCcM"]};

    return subs[adName];
  }
}
