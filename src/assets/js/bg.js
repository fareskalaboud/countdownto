chrome.runtime.onInstalled.addListener(function(details){
  if(details.reason == "install"){
    const templateData = '{ "countdowns" : [' +
      '{ "title":"Later" , "date":"2019-04-24" },' +
      '{ "title":"Occasion" , "date":"2018-05-25" },' +
      '{ "title":"Past Occasion" , "date":"2017-05-25" }' +
      ']}';
    chrome.storage.local.set({'data': JSON.parse(templateData)});
  }
});
