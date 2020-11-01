var rocmap;
var civmap;
var milmap;

var rocdata = [];
var civdata = [];
var mildata = [];

var roclocations = [];
var civlocations = [];
var millocations = [];

var showRoc = true;
var showCiv = false;
var showMil = false;

var rociconBase = 'https://mt.google.com/vt/icon/name=icons/onion/SHARED-mymaps-container-bg_4x.png,icons/onion/SHARED-mymaps-container_4x.png,icons/onion/1642-nuclear-radioactive_4x.png&highlight=ff000000,';
var civiconBase = 'https://mt.google.com/vt/icon/name=icons/onion/SHARED-mymaps-container-bg_4x.png,icons/onion/SHARED-mymaps-container_4x.png,icons/onion/1565-factory_4x.png&highlight=ff000000,';
var miliconBase = "https://mt.google.com/vt/icon/name=icons/onion/SHARED-mymaps-container-bg_4x.png,icons/onion/SHARED-mymaps-container_4x.png,icons/onion/1657-police-officer_4x.png&highlight=ff000000,";
var iconTail = ',ff000000&scale=1.0';
var rocIcons = {
  ConditionUnknown: {
    icon: rociconBase + '01579B' + iconTail
  },
  Flooded: {
    icon: rociconBase + '0288D1' + iconTail
  },
  Accessible: {
    icon: rociconBase + '689F38' + iconTail
  },
  HeavilyDamaged: {
    icon: rociconBase + 'FDD835' + iconTail
  },
  Locked: {
    icon: rociconBase + 'FFA000' + iconTail
  },
  Inaccessible: {
    icon: rociconBase + 'BF360C' + iconTail
  },
  Demolished: {
    icon: rociconBase + 'C2185B' + iconTail
  },
  Destroyed: {
    icon: rociconBase + '7B1FA2' + iconTail
  },
  Private: {
    icon: rociconBase + '6D4C41' + iconTail
  },
  none: {
    icon: rociconBase + 'BDBDBD' + iconTail
  }
};
var civIcons = {
  ConditionUnknown: {
    icon: civiconBase + '01579B' + iconTail
  },
  Flooded: {
    icon: civiconBase + '0288D1' + iconTail
  },
  Accessible: {
    icon: civiconBase + '689F38' + iconTail
  },
  HeavilyDamaged: {
    icon: civiconBase + 'FDD835' + iconTail
  },
  Locked: {
    icon: civiconBase + 'FFA000' + iconTail
  },
  Inaccessible: {
    icon: civiconBase + 'BF360C' + iconTail
  },
  Demolished: {
    icon: civiconBase + 'C2185B' + iconTail
  },
  Destroyed: {
    icon: civiconBase + '7B1FA2' + iconTail
  },
  Private: {
    icon: civiconBase + '6D4C41' + iconTail
  },
  none: {
    icon: civiconBase + 'BDBDBD' + iconTail
  }
};
var milIcons = {
  ConditionUnknown: {
    icon: miliconBase + '01579B' + iconTail
  },
  Flooded: {
    icon: miliconBase + '0288D1' + iconTail
  },
  Accessible: {
    icon: miliconBase + '689F38' + iconTail
  },
  HeavilyDamaged: {
    icon: miliconBase + 'FDD835' + iconTail
  },
  Locked: {
    icon: miliconBase + 'FFA000' + iconTail
  },
  Inaccessible: {
    icon: miliconBase + 'BF360C' + iconTail
  },
  Demolished: {
    icon: miliconBase + 'C2185B' + iconTail
  },
  Destroyed: {
    icon: miliconBase + '7B1FA2' + iconTail
  },
  Private: {
    icon: miliconBase + '6D4C41' + iconTail
  },
  none: {
    icon: miliconBase + 'BDBDBD' + iconTail
  }
};

var selectedTab = 0;

var conditionfilters = {
  Accessible: true,
  HeavilyDamaged: true,
  Locked: true,
  Inaccessible: true,
  Flooded: true,
  Demolished: true,
  Destroyed: true,
  Private: true,
  ConditionUnknown: true
};

function initialiseMap() {
  initRocMap();
  initCivMap();
  initMilMap();
}

function initRocMap() {
  // Load data from an example Google spreadsheet that contains latitude and longitude columns using Google Sheets API v4 that returns JSON.
  // Replace the ID of your Google spreadsheet and you API key in the URL:
  // https://sheets.googleapis.com/v4/spreadsheets/ID_OF_YOUR_GOOGLE_SPREADSHEET/values/Sheet1!A2:Q?key=YOUR_API_KEY
  // Also make sure your API key is authorised to access Google Sheets API - you can enable that through your Google Developer console.
  // Finally, in the URL, fix the sheet name and the range that you are accessing from your spreadsheet. 'Sheet1' is the default name for the first sheet.
  $.getJSON("https://sheets.googleapis.com/v4/spreadsheets/1K-rWGh9SKkrkuGt1PSfU-G4HykE3zlvlIUGbB6zYIJc/values/'ROC Posts'!A2:O?key=AIzaSyAwhjy9-JjXUOIKjez_1auka6ThFfQEksY", function (data) {
    // Center on (0, 0). Map center and zoom will reconfigure later (fitbounds method)
    var mapOptions = {
      zoom: 6,
      center: new google.maps.LatLng(55.7663893, -3.8858562),
      mapTypeId: google.maps.MapTypeId.HYBRID,
      tilt: 0,
      disableDefaultUI: true,
      rotateControl: false,
      zoomControl: true,
      mapTypeControl: true,
      scaleControl: true,
      streetViewControl: true,
      fullscreenControl: true
    };  
    
    rocmap = new google.maps.Map(document.getElementById('rocmap'), mapOptions);

    // data.values contains the array of rows from the spreadsheet. Each row is also an array of cell values.     
    // Modify the code below to suit the structure of your spreadsheet.
    $(data.values).each(function () {
      
      var datcondition = this[4];
      var iconType = 'none'
      if (datcondition == null || datcondition === undefined || datcondition == '') {
        iconType = 'none';
      } else {
        iconType = datcondition;
        iconType = iconType.replace(/\s/g, '');
      }

      var location = new google.maps.Marker({
        position: new google.maps.LatLng(this[0], this[1]),
        icon: rocIcons[iconType].icon,
        map: rocmap,
        title: this[2],
        group: this[3],
        condition: datcondition,
        visited: this[6],
        visitdate: this[7],
        notes: this[12],
        extimgsrc: this[13],
        intimgsrc: this[14],
        type: 'rocpost'
      });
      roclocations.push(location);
    });
    setLocations(rocmap, roclocations, 'roc');
  });
}

function initCivMap() {
  // Load data from an example Google spreadsheet that contains latitude and longitude columns using Google Sheets API v4 that returns JSON.
  // Replace the ID of your Google spreadsheet and you API key in the URL:
  // https://sheets.googleapis.com/v4/spreadsheets/ID_OF_YOUR_GOOGLE_SPREADSHEET/values/Sheet1!A2:Q?key=YOUR_API_KEY
  // Also make sure your API key is authorised to access Google Sheets API - you can enable that through your Google Developer console.
  // Finally, in the URL, fix the sheet name and the range that you are accessing from your spreadsheet. 'Sheet1' is the default name for the first sheet.
  $.getJSON("https://sheets.googleapis.com/v4/spreadsheets/1K-rWGh9SKkrkuGt1PSfU-G4HykE3zlvlIUGbB6zYIJc/values/'Abandoned Civil Sites'!A2:L?key=AIzaSyAwhjy9-JjXUOIKjez_1auka6ThFfQEksY", function (data) {
      // Center on (0, 0). Map center and zoom will reconfigure later (fitbounds method)
      var mapOptions = {
        zoom: 6,
        center: new google.maps.LatLng(55.7663893, -3.8858562),
        mapTypeId: google.maps.MapTypeId.HYBRID,
        tilt: 0,
        disableDefaultUI: true,
        rotateControl: false,
        zoomControl: true,
        mapTypeControl: true,
        scaleControl: true,
        streetViewControl: true,
        fullscreenControl: true
      };  

    civmap = new google.maps.Map(document.getElementById('civmap'), mapOptions);

    // data.values contains the array of rows from the spreadsheet. Each row is also an array of cell values.     
    // Modify the code below to suit the structure of your spreadsheet.
    $(data.values).each(function () {
      
      var datcondition = this[4];
      var iconType = 'none'
      if (datcondition == null || datcondition === undefined || datcondition == '') {
        iconType = 'none';
      } else {
        iconType = datcondition;
        iconType = iconType.replace(/\s/g, '');
      }

      var location = new google.maps.Marker({
        position: new google.maps.LatLng(this[0], this[1]),
        icon: civIcons[iconType].icon,
        map: civmap,
        title: this[2],
        group: this[3],
        condition: datcondition,
        risk: this[5],
        visited: this[6],
        visitdate: this[7],
        priority: this[8],
        notes: this[9],
        extimgsrc: this[10],
        intimgsrc: this[11],
        type: 'civsite'
      });
      civlocations.push(location);
    });
    setLocations(civmap, civlocations, 'civ');
  });
}

function initMilMap() {
  // Load data from an example Google spreadsheet that contains latitude and longitude columns using Google Sheets API v4 that returns JSON.
  // Replace the ID of your Google spreadsheet and you API key in the URL:
  // https://sheets.googleapis.com/v4/spreadsheets/ID_OF_YOUR_GOOGLE_SPREADSHEET/values/Sheet1!A2:Q?key=YOUR_API_KEY
  // Also make sure your API key is authorised to access Google Sheets API - you can enable that through your Google Developer console.
  // Finally, in the URL, fix the sheet name and the range that you are accessing from your spreadsheet. 'Sheet1' is the default name for the first sheet.
  $.getJSON("https://sheets.googleapis.com/v4/spreadsheets/1K-rWGh9SKkrkuGt1PSfU-G4HykE3zlvlIUGbB6zYIJc/values/'Abandoned Military Sites'!A2:L?key=AIzaSyAwhjy9-JjXUOIKjez_1auka6ThFfQEksY", function (data) {
    // Center on (0, 0). Map center and zoom will reconfigure later (fitbounds method)
    var mapOptions = {
      zoom: 6,
      center: new google.maps.LatLng(55.7663893, -3.8858562),
      mapTypeId: google.maps.MapTypeId.HYBRID,
      tilt: 0,
      disableDefaultUI: true,
      rotateControl: false,
      zoomControl: true,
      mapTypeControl: true,
      scaleControl: true,
      streetViewControl: true,
      fullscreenControl: true
    };  
    
    milmap = new google.maps.Map(document.getElementById('milmap'), mapOptions);

    // data.values contains the array of rows from the spreadsheet. Each row is also an array of cell values.     
    // Modify the code below to suit the structure of your spreadsheet.
    $(data.values).each(function () {
      
      var datcondition = this[4];
      var iconType = 'none'
      if (datcondition == null || datcondition === undefined || datcondition == '') {
        iconType = 'none';
      } else {
        iconType = datcondition;
        iconType = iconType.replace(/\s/g, '');
      }

      var location = new google.maps.Marker({
        position: new google.maps.LatLng(this[0], this[1]),
        icon: milIcons[iconType].icon,
        map: milmap,
        title: this[2],
        group: this[3],
        condition: datcondition,
        risk: this[5],
        visited: this[6],
        visitdate: this[7],
        priority: this[8],
        notes: this[9],
        extimgsrc: this[10],
        intimgsrc: this[11],
        type: 'milsite'
      });
      millocations.push(location);
    });
    setLocations(milmap, millocations, 'mil');
  });
}

function setLocations(map, locations, maptype) {
  var bounds = new google.maps.LatLngBounds();
  // Create nice, customised pop-up boxes, to appear when the marker is clicked on
  var infowindow = new google.maps.InfoWindow({
    content: "Content String"
  });

  for (var i = 0; i < locations.length; i++) {
    var new_marker = createMarker(map, locations[i], infowindow, maptype);
    bounds.extend(new_marker.position);
  }
  //map.fitBounds(bounds);
}

// get a subset of the filters that are set to true
var get_set_options = function () {
  ret_array = [];
  for (option in conditionfilters) {
    if (conditionfilters[option]) {
      ret_array.push(option)
    }
  }
  return ret_array;
}

var filter_markers = function (activeTab) {
  if (activeTab == 1) {
    filter_civ();
  } else if (activeTab == 2) {
    filter_mil();
  } else {
    filter_roc();
  }
}

function filter_roc() {
  // for each marker, check to see if all required options are set
  
  for (i = 0; i < roclocations.length; i++) {
    // start the filter check assuming the marker will be displayed
    var keep = true;
    // format the condition string by removing spaces
    var thisCondition = roclocations[i].condition.replace(/\s/g, '')
    
    // if the condition is not in the included conditions, set keep flag to false
    if (!(conditionfilters[thisCondition])) {
      keep = false
    } else {
      keep = true;
    }
    
    // Set pin visibility to the value of keep
    roclocations[i].setVisible(keep);
  }
}

function filter_civ() {
  // for each marker, check to see if all required options are set
  
  for (i = 0; i < civlocations.length; i++) {
    // start the filter check assuming the marker will be displayed
    var keep = true;
    // format the condition string by removing spaces
    var thisCondition = civlocations[i].condition.replace(/\s/g, '')
    
    // if the condition is not in the included conditions, set keep flag to false
    if (!(conditionfilters[thisCondition])) {
      keep = false
    } else {
      keep = true;
    }
    
    // Set pin visibility to the value of keep
    civlocations[i].setVisible(keep);
  }
}

function filter_mil() {
  // for each marker, check to see if all required options are set
  
  for (i = 0; i < millocations.length; i++) {
    // start the filter check assuming the marker will be displayed
    var keep = true;
    // format the condition string by removing spaces
    var thisCondition = millocations[i].condition.replace(/\s/g, '')
    
    // if the condition is not in the included conditions, set keep flag to false
    if (!(conditionfilters[thisCondition])) {
      keep = false
    } else {
      keep = true;
    }
    
    // Set pin visibility to the value of keep
    millocations[i].setVisible(keep);
  }
}

// Handles Filter Switch check event
$('input[name=filtercondition]').change(function (e) {
  var cb_val = $(this).prop("checked");
  // Configure Filter Conditions
  conditionfilters[this.id] = cb_val;
  // Do the filtering
  filter_markers(selectedTab);
})

function createMarker(map, location, infowindow, maptype) {
  var marker = location;
  var elemIdStr =  location.title.replace(/\s/g, '');

  if (maptype == "civ") {
    // Civ Sites
    google.maps.event.addListener(marker, 'click', function () {
      infowindow.setContent('<div class="ballooncontent">' +
        ('<h6><span class="dataheader">' + location.title + '</span></h6>') +
        ((location.extimgsrc == undefined && location.intimgsrc == undefined) ? "" : ('<div id="markerCarousel' + elemIdStr + '" class="carousel slide" data-ride="carousel">' + 
        '<div class="carousel-inner">' + 
        ((location.extimgsrc == undefined) ? "" : '<div class="carousel-item active"><img class="d-block w-100" src="' + location.extimgsrc + '" alt="Exterior View"></div>') + 
        ((location.intimgsrc == undefined) ? "" : '<div class="carousel-item"><img class="d-block w-100" src="' + location.intimgsrc + '" alt="Interior View"></div>') + 
        '<a class="carousel-control-prev" href="#markerCarousel' + elemIdStr + '" role="button" data-slide="prev"><span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="sr-only">Previous</span></a>' + 
        '<a class="carousel-control-next" href="#markerCarousel' + elemIdStr + '" role="button" data-slide="next"><span class="carousel-control-next-icon" aria-hidden="true"></span><span class="sr-only">Next</span></a></div>')) +
        '<table class="table table-borderless table-sm baloontable"><tbody>' +
        '<table class="table table-borderless table-sm baloontable"><tbody>' +
        ((location.group == undefined) ? "" : ('<tr class="balloon"><th scope="row" class="dataheader">Category</th><td>' + location.group + '</td></tr>')) +
        ((location.condition == undefined) ? "" : ('<tr class="balloon"><th scope="row" class="dataheader">Condition</th><td><span class="' + location.condition.replace(/\s/g, '').toLowerCase() + '">' + location.condition + '</span></td></tr>')) +
        ((location.visited == undefined) ? "" : ('<tr class="balloon"><th scope="row" class="dataheader">Visited</th><td><span class="' + location.visited.toLowerCase() + '">' + location.visited + '</span>' + ((location.visited === 'NO' || location.visited === 'N/A') ? "" : (' (' + location.visitdate + ')')) + '</td></tr>')) +
        ((location.notes == undefined) ? "" : ('<tr class="balloon"><th scope="row" class="dataheader">Risk</th><td>' + location.risk + '</td></tr>')) +
        ((location.notes == undefined) ? "" : ('<tr class="balloon"><th scope="row" class="dataheader">Priority</th><td>' + location.priority + '</td></tr>')) +
        ((location.notes == undefined) ? "" : ('<tr class="balloon"><th scope="row" class="dataheader">Notes</th><td><p  class="notesbox">' + location.notes + '</p></td></tr>')) +
        '</div>');
      infowindow.open(map, marker);
    });
  } else if (maptype == 'mil') {
    google.maps.event.addListener(marker, 'click', function () {
      infowindow.setContent('<div class="ballooncontent">' +
        ('<h6><span class="dataheader">' + location.title + '</span></h6>') +
        ((location.extimgsrc == undefined && location.intimgsrc == undefined) ? "" : ('<div id="markerCarousel' + elemIdStr + '" class="carousel slide" data-ride="carousel">' + 
        '<div class="carousel-inner">' + 
        ((location.extimgsrc == undefined) ? "" : '<div class="carousel-item active"><img class="d-block w-100" src="' + location.extimgsrc + '" alt="Exterior View"></div>') + 
        ((location.intimgsrc == undefined) ? "" : '<div class="carousel-item"><img class="d-block w-100" src="' + location.intimgsrc + '" alt="Interior View"></div>') + 
        '<a class="carousel-control-prev" href="#markerCarousel' + elemIdStr + '" role="button" data-slide="prev"><span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="sr-only">Previous</span></a>' + 
        '<a class="carousel-control-next" href="#markerCarousel' + elemIdStr + '" role="button" data-slide="next"><span class="carousel-control-next-icon" aria-hidden="true"></span><span class="sr-only">Next</span></a></div>')) +
        ('<table class="table table-borderless table-sm baloontable"><tbody>') +
        ((location.group == undefined) ? "" : ('<tr class="balloon"><th scope="row" class="dataheader">Category</th><td>' + location.group + '</td></tr>')) +
        ((location.condition == undefined) ? "" : ('<tr class="balloon"><th scope="row" class="dataheader">Condition</th><td><span class="' + location.condition.replace(/\s/g, '').toLowerCase() + '">' + location.condition + '</span></td></tr>')) +
        ((location.visited == undefined) ? "" : ('<tr class="balloon"><th scope="row" class="dataheader">Visited</th><td><span class="' + location.visited.toLowerCase() + '">' + location.visited + '</span>' + ((location.visited === 'NO' || location.visited === 'N/A') ? "" : (' (' + location.visitdate + ')')) + '</td></tr>')) +
        ((location.notes == undefined) ? "" : ('<tr class="balloon"><th scope="row" class="dataheader">Risk</th><td>' + location.risk + '</td></tr>')) +
        ((location.notes == undefined) ? "" : ('<tr class="balloon"><th scope="row" class="dataheader">Priority</th><td>' + location.priority + '</td></tr>')) +
        ((location.notes == undefined) ? "" : ('<tr class="balloon"><th scope="row" class="dataheader">Notes</th><td><p  class="notesbox">' + location.notes + '</p></td></tr>')) +
        '</div>');
      infowindow.open(map, marker);
    });
  } else {
    // ROC Posts
    google.maps.event.addListener(marker, 'click', function () {
      infowindow.setContent('<div class="ballooncontent">' +
        ('<h6><span class="dataheader">' + location.title + '</span></h6>') +
        ((location.extimgsrc == undefined && location.intimgsrc == undefined) ? "" : ('<div id="markerCarousel' + elemIdStr + '" class="carousel slide" data-ride="carousel">' + 
        '<div class="carousel-inner">' + 
        ((location.extimgsrc == undefined) ? "" : '<div class="carousel-item active"><img class="d-block w-100" src="' + location.extimgsrc + '" alt="Exterior View"></div>') + 
        ((location.intimgsrc == undefined) ? "" : '<div class="carousel-item"><img class="d-block w-100" src="' + location.intimgsrc + '" alt="Interior View"></div>') + 
        '<a class="carousel-control-prev" href="#markerCarousel' + elemIdStr + '" role="button" data-slide="prev"><span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="sr-only">Previous</span></a>' + 
        '<a class="carousel-control-next" href="#markerCarousel' + elemIdStr + '" role="button" data-slide="next"><span class="carousel-control-next-icon" aria-hidden="true"></span><span class="sr-only">Next</span></a></div>')) +
        '<table class="table table-borderless table-sm baloontable"><tbody>' +
        '<table class="table table-borderless table-sm baloontable"><tbody></tbody>' +
        ((location.group == undefined) ? "" : ('<tr class="balloon"><th scope="row" class="dataheader">Group</th><td>' + location.group + '</td></tr>')) +
        ((location.condition == undefined) ? "" : ('<tr class="balloon"><th scope="row" class="dataheader">Condition</th><td><span class="' + location.condition.replace(/\s/g, '').toLowerCase() + '">' + location.condition + '</span></td></tr>')) +
        ((location.visited == undefined) ? "" : ('<tr class="balloon"><th scope="row" class="dataheader">Visited</th><td><span class="' + location.visited.toLowerCase() + '">' + location.visited + '</span>' + ((location.visited === 'NO' || location.visited === 'N/A') ? "" : (' (' + location.visitdate + ')')) + '</td></tr>')) +
        ((location.notes == undefined) ? "" : ('<tr class="balloon"><th scope="row" class="dataheader">Notes:</th><td><p class="notesbox">' + location.notes + '</p></td></tr>')) +
        '</tbody></table>');
      infowindow.open(map, marker);
    });
  }
  return marker;
}

$(function () {
  //#layers-menu a
  $('a.dropdown-item').click(function (e) {
    e.preventDefault();
    $('a[href="' + $(this).attr('href') + '"]').tab('show');
    $('#layers-menu a.dropdown-item').removeClass('active');
    var thisTab = $(this).attr('href');
    $(this).addClass('active');

    if (thisTab == '#civ') {
      selectedTab = 1;
    } else if (thisTab == '#mil') {
      selectedTab = 2;
    } else {
      selectedTab = 0;
    }
  })

});