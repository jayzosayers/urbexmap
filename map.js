var map;
var roclocations = [];
var civlocations = [];
var millocations = [];

var showRoc = true;
var showCiv = false;
var showMil = false;

var iconBase = 'https://mt.google.com/vt/icon/name=icons/onion/SHARED-mymaps-container-bg_4x.png,icons/onion/SHARED-mymaps-container_4x.png,icons/onion/1642-nuclear-radioactive_4x.png&highlight=ff000000,';
var iconTail = ',ff000000&scale=1.0';
var icons = {
  ConditionUnknown: {
    icon: iconBase + '01579B' + iconTail
  },
  Flooded: {
    icon: iconBase + '0288D1' + iconTail
  },
  Accessible: {
    icon: iconBase + '689F38' + iconTail
  },
  HeavilyDamaged: {
    icon: iconBase + 'FDD835' + iconTail
  },
  Locked: {
    icon: iconBase + 'FFA000' + iconTail
  },
  Inaccessible: {
    icon: iconBase + 'BF360C' + iconTail
  },
  Demolished: {
    icon: iconBase + 'C2185B' + iconTail
  },
  Destroyed: {
    icon: iconBase + '7B1FA2' + iconTail
  },
  Private: {
    icon: iconBase + '6D4C41' + iconTail
  },
  none: {
    icon: iconBase + 'BDBDBD' + iconTail
  }
};

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
  $.getJSON("https://sheets.googleapis.com/v4/spreadsheets/1K-rWGh9SKkrkuGt1PSfU-G4HykE3zlvlIUGbB6zYIJc/values/'ROC Posts'!A2:M?key=AIzaSyAwhjy9-JjXUOIKjez_1auka6ThFfQEksY", function (data) {
    // data.values contains the array of rows from the spreadsheet. Each row is also an array of cell values.
    // Modify the code below to suit the structure of your spreadsheet.
    $(data.values).each(function () {
      var location = new google.maps.Marker({});
      location.title = this[2];
      location.latitude = parseFloat(this[0]);
      location.longitude = parseFloat(this[1]);
      location.group = this[3];
      location.condition = this[4];
      location.visited = this[6];
      location.visitdate = this[7];
      location.type = 'rocpost';
      roclocations.push(location);
    });

    // Center on (0, 0). Map center and zoom will reconfigure later (fitbounds method)
    var mapOptions = {
      zoom: 6,
      center: new google.maps.LatLng(55.7663893,-3.8858562)
    };
    var map = new google.maps.Map(document.getElementById('rocmap'), mapOptions);
    setLocations(map, roclocations, "roc");
  });
}

function initCivMap() {
  // Load data from an example Google spreadsheet that contains latitude and longitude columns using Google Sheets API v4 that returns JSON.
  // Replace the ID of your Google spreadsheet and you API key in the URL:
  // https://sheets.googleapis.com/v4/spreadsheets/ID_OF_YOUR_GOOGLE_SPREADSHEET/values/Sheet1!A2:Q?key=YOUR_API_KEY
  // Also make sure your API key is authorised to access Google Sheets API - you can enable that through your Google Developer console.
  // Finally, in the URL, fix the sheet name and the range that you are accessing from your spreadsheet. 'Sheet1' is the default name for the first sheet.
  $.getJSON("https://sheets.googleapis.com/v4/spreadsheets/1K-rWGh9SKkrkuGt1PSfU-G4HykE3zlvlIUGbB6zYIJc/values/'Abandoned Civil Sites'!A2:J?key=AIzaSyAwhjy9-JjXUOIKjez_1auka6ThFfQEksY", function (data) {
    // data.values contains the array of rows from the spreadsheet. Each row is also an array of cell values.
    // Modify the code below to suit the structure of your spreadsheet.
    $(data.values).each(function () {
      var location = new google.maps.Marker({});
      location.title = this[2];
      location.latitude = parseFloat(this[0]);
      location.longitude = parseFloat(this[1]);
      location.group = this[3];
      location.condition = this[4];
      location.risk = this[5];
      location.visited = this[6];
      location.visitdate = this[7];
      location.priority = this[8];
      location.type = 'civsite';
      location.notes = this[9];
      civlocations.push(location);
    });

    // Center on (0, 0). Map center and zoom will reconfigure later (fitbounds method)
    var mapOptions = {
      zoom: 6,
      center: new google.maps.LatLng(55.7663893,-3.8858562)
    };
    var map = new google.maps.Map(document.getElementById('civmap'), mapOptions);
    setLocations(map, civlocations, "civ");
  });
}

function initMilMap() {
  // Load data from an example Google spreadsheet that contains latitude and longitude columns using Google Sheets API v4 that returns JSON.
  // Replace the ID of your Google spreadsheet and you API key in the URL:
  // https://sheets.googleapis.com/v4/spreadsheets/ID_OF_YOUR_GOOGLE_SPREADSHEET/values/Sheet1!A2:Q?key=YOUR_API_KEY
  // Also make sure your API key is authorised to access Google Sheets API - you can enable that through your Google Developer console.
  // Finally, in the URL, fix the sheet name and the range that you are accessing from your spreadsheet. 'Sheet1' is the default name for the first sheet.
  $.getJSON("https://sheets.googleapis.com/v4/spreadsheets/1K-rWGh9SKkrkuGt1PSfU-G4HykE3zlvlIUGbB6zYIJc/values/'Abandoned Military Sites'!A2:J?key=AIzaSyAwhjy9-JjXUOIKjez_1auka6ThFfQEksY", function (data) {
    // data.values contains the array of rows from the spreadsheet. Each row is also an array of cell values.
    // Modify the code below to suit the structure of your spreadsheet.
    $(data.values).each(function () {
      var location = new google.maps.Marker({});
      location.title = this[2];
      location.latitude = parseFloat(this[0]);
      location.longitude = parseFloat(this[1]);
      location.group = this[3];
      location.condition = this[4];
      location.risk = this[5];
      location.visited = this[6];
      location.visitdate = this[7];
      location.priority = this[8];
      location.type = 'milsite';
      location.notes = this[9];
      millocations.push(location);
    });

    // Center on (0, 0). Map center and zoom will reconfigure later (fitbounds method)
    var mapOptions = {
      zoom: 6,
      center: new google.maps.LatLng(55.7663893,-3.8858562)
    };
    var map = new google.maps.Map(document.getElementById('milmap'), mapOptions);
    setLocations(map, millocations, "mil");
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
  map.fitBounds(bounds);
}

// get a subset of the filters that are set to true
var get_set_options = function() {
  ret_array = []
  for (option in conditionfilters) {
    if (conditionfilters[option]) {
      ret_array.push(option)
    }
  }
  return ret_array;
}

var filter_markers = function() {  
  set_filters = get_set_options()
  
  // for each marker, check to see if all required options are set
  for (i = 0; i < locations.length; i++) {
    //thislocation = locations[i];

    // start the filter check assuming the marker will be displayed
    // if any of the required features are missing, set 'keep' to false
    // to discard this marker
    var keep=true;
    for (opt=0; opt<set_filters.length; opt++) {
      if (!set_filters.includes(locations[i].condition)) {
        // (!locations[i].condition == set_filters[opt])
        keep = false
      }
    }

    console.log(locations[i].title + ' visibility: [' + keep + ']');
    if (keep) {
      locations[i].setMap(map);
      console.log(locations[i].title + ' shown.')
    } else {
      locations[i].setMap(null);
      locations[i].setPosition(null);
      console.log(locations[i].title + ' hidden.')
    }
    //locations[i].setVisible(keep)
  }
}

var map_filter = function(id_val) {
  console.log('Value:' + conditionfilters[id_val])
  if (conditionfilters[id_val]) 
    conditionfilters[id_val] = false
  else
    conditionfilters[id_val] = true
}

$('input[name=filter]').change(function (e) {
  map_filter(this.id);
  filter_markers();
})

function createMarker(map, location, infowindow, maptype) {

  // Modify the code below to suit the structure of your spreadsheet (stored in variable 'location')
  var position = {
    lat: parseFloat(location.latitude),
    lng: parseFloat(location.longitude)
  };
  var iconType = 'none';
  console.log(location.title)
  if (location.condition == null || location.condition === undefined || location.condition == '') {
    iconType = 'none';
  } else {
    iconType = location.condition;
    iconType = iconType.replace(/\s/g, '');
  }
  console.log(iconType)

  var marker = new google.maps.Marker({
    position: position,
    icon: icons[iconType].icon,
    map: map,
    title: location.title,
  });
  if (maptype == "civ") {
    // Civ Sites
    google.maps.event.addListener(marker, 'click', function () {
      infowindow.setContent('<div>' +
        ('<h6><span class="dataheader">' + location.title + '</span></h6>') +
        ((location.group === undefined) ? "" : ('<p class="balloon"><span class="dataheader">Category: </span>' + location.group + '</p>')) +
        ((location.condition === undefined) ? "" : ('<p class="balloon"><span class="dataheader">Condition: </span>' + location.condition + '</p>')) +
        ((location.visited === undefined) ? "" : ('<p class="balloon"><span class="dataheader">Visited: </span>' + location.visited + ((location.visited === 'NO') ? "" : (' (' + location.visitdate + ')')) + '</p>')) +
        ((location.notes === undefined) ? "" : ('<p class="balloon"><span class="dataheader">Risk: </span>' + location.risk)) +
        ((location.notes === undefined) ? "" : ('<p class="balloon"><span class="dataheader">Priority: </span>' + location.priority)) +
        ((location.notes === undefined) ? "" : ('<p class="balloon"><span class="dataheader">Notes: </span>' + location.notes)) +
        '</div>');
      infowindow.open(map, marker);
    });
  } else if (maptype == "mil") {
    // Mil Sites
    google.maps.event.addListener(marker, 'click', function () {
      infowindow.setContent('<div>' +
        ('<h6><span class="dataheader">' + location.title + '</span></h6>') +
        ((location.group === undefined) ? "" : ('<p class="balloon"><span class="dataheader">Category: </span>' + location.group + '</p>')) +
        ((location.condition === undefined) ? "" : ('<p class="balloon"><span class="dataheader">Condition: </span>' + location.condition + '</p>')) +
        ((location.visited === undefined) ? "" : ('<p class="balloon"><span class="dataheader">Visited: </span>' + location.visited + ((location.visited === 'NO') ? "" : (' (' + location.visitdate + ')')) + '</p>')) +
        ((location.notes === undefined) ? "" : ('<p class="balloon"><span class="dataheader">Risk: </span>' + location.risk)) +
        ((location.notes === undefined) ? "" : ('<p class="balloon"><span class="dataheader">Priority: </span>' + location.priority)) +
        ((location.notes === undefined) ? "" : ('<p class="balloon"><span class="dataheader">Notes: </span>' + location.notes)) +
        '</div>');
      infowindow.open(map, marker);
    });
  } else {
    // ROC Posts
    google.maps.event.addListener(marker, 'click', function () {
      infowindow.setContent('<div>' +
        ('<h6><span class="dataheader">' + location.title + '</span></h6>') +
        ((location.group === undefined) ? "" : ('<p class="balloon"><span class="dataheader">Group: </span>' + location.group + '</p>')) +
        ((location.condition === undefined) ? "" : ('<p class="balloon"><span class="dataheader">Condition: </span>' + location.condition + '</p>')) +
        ((location.visited === undefined) ? "" : ('<p class="balloon"><span class="dataheader">Visited: </span>' + location.visited + ((location.visited === 'NO') ? "" : (' (' + location.visitdate + ')')) + '</p>')) +
        ((location.notes === undefined) ? "" : ('<p class="balloon"><span class="dataheader">Notes: </span>' + location.notes)) +
        '</div>');
      infowindow.open(map, marker);
    });
  }
  google.maps.event.addListener(map, 'zoom_changed', function () {
    var maptype = map.getMapTypeId();
    if (map.getZoom() >= map.mapTypes[maptype].maxZoom) {
      if (map.getMapTypeId() != google.maps.MapTypeId.HYBRID) {
        map.setMapTypeId(google.maps.MapTypeId.HYBRID)
        map.setTilt(0); // disable 45 degree imagery
      }
    }
  });;
  return marker;
}

function setFilterFlags(checkbox) {
  if(checkbox.checked) {
    
  } else {

  }
}