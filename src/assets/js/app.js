$(document).ready(function() {
  loadAllCountdowns()
});

$("#add-countdown-form").submit(function(e) {
    e.preventDefault();
    const title = $("#countdown-title").val();
    const date = $("#countdown-date").val();
    if (validated(title,date)) {
      var data = chrome.storage.local.get('data', (result) => {
        result.data.countdowns.push({"title": title, "date": date})
        chrome.storage.local.set({'data': result.data}, () => {
          document.getElementById('add-countdown-form').reset()
          loadAllCountdowns();
        })
      })
    } else {
      alert("Oops! Make sure \n • the date is less than one year away \n • the date is not in the past \n • your entries are valid.")
    }
});

function validated(title, date) {
  return (
    (title != '' && date != '') &&
    (title != null && date != null) &&
    (moment().diff(date, 'days')*-1 <= 365) &&
    (moment().diff(date, 'days')*-1+1 >= 0)
   )
}

function loadAllCountdowns() {
  $("#countdown-list").html('');
  $("#completed-countdown-list").html('');

  var data = chrome.storage.local.get('data', (result) => {
    var html = '<h2>Your Countdowns</h2>'

    var completedHtml = 'Completed Countdowns <br />'

    for (var i = 0; i < result.data.countdowns.length; i++) {
      result.data.countdowns.sort(compare)
      var c = result.data.countdowns[i]
      if ((moment().diff(moment(c.date), 'days') * -1 + 1) >= 0) {
          html += createCountdownHTML(i, c.title, c.date)
      } else {
        completedHtml += createCompletedCountdownHTML(i, c.title, c.date)
      }
    }

    if (completedHtml == 'Completed Countdowns <br />') { completedHtml = '' }

    $("#countdown-list").append(html);
    $("#completed-countdown-list").append(completedHtml);
  })
}

$(document).on('click','.delete-button', function(e){
  deleteId = e.currentTarget.id.split('-')[2]
  var data = chrome.storage.local.get('data', (result) => {
    result.data.countdowns.sort(compare)
    result.data.countdowns.splice(deleteId, 1)
    chrome.storage.local.set({'data': result.data}, () => {
      loadAllCountdowns();
    })
  })
});

function createCountdownHTML(id, title, date) {
  return '<div class="countdown-content">' +
           '<span class="countdown-days-remaining">' + (moment().diff(moment(date), 'days') * -1 + 1) + '</span> '
           + title + '<span class="delete-icon"><button class="delete-button" id="delete-button-'+ id +'" value="'+ id +'"><i class="fa fa-times"></i></button></span>' +
         '</div>'
}

function createCompletedCountdownHTML(id, title, date) {
  return '<div class="completed-countdown-content">' +
           '<span class="completed-countdown-days-remaining">' + (moment().diff(moment(date), 'days') * -1 + 1) + '</span> '
           + title + '<span class="delete-icon"><button class="delete-button" id="delete-button-'+ id +'" value="'+ id +'"><i class="fa fa-times"></i></button></span>' +
         '</div>'
}

function compare(a,b) {
  if (a.date < b.date)
    return -1;
  if (a.date > b.date)
    return 1;
  return 0;
}
