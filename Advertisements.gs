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
  },
  
  // getAdWarmupSub(language) {
  //   var warmupSubs = {"ENG": [["YT", 
  //                             "IEO Ad substitute", 
  //                             "ENG", "Isha Kriya: A Free Guided Meditation", 
  //                             "https://youtu.be/EwQkfoKxRvo"]],
  //                    "GER": [["YT", 
  //                             "IEO Ad Week 1-6 substitute", 
  //                             "GER", "Yoga für Gesundheit: Gerichtete Bewegung der Arme", 
  //                             "https://www.youtube.com/watch?v=EwY_N466xT4"]]};

  //   return warmupSubs[language]
  // },
}
