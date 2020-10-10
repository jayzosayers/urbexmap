var map;
var locations = [];

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


function initialiseMap() {

  // Load data from an example Google spreadsheet that contains latitude and longitude columns using Google Sheets API v4 that returns JSON.
  // Replace the ID of your Google spreadsheet and you API key in the URL:
  // https://sheets.googleapis.com/v4/spreadsheets/ID_OF_YOUR_GOOGLE_SPREADSHEET/values/Sheet1!A2:Q?key=YOUR_API_KEY
  // Also make sure your API key is authorised to access Google Sheets API - you can enable that through your Google Developer console.
  // Finally, in the URL, fix the sheet name and the range that you are accessing from your spreadsheet. 'Sheet1' is the default name for the first sheet.
  $.getJSON("https://sheets.googleapis.com/v4/spreadsheets/1K-rWGh9SKkrkuGt1PSfU-G4HykE3zlvlIUGbB6zYIJc/values/'ROC Posts'!A2:M?key=AIzaSyAwhjy9-JjXUOIKjez_1auka6ThFfQEksY", function(data) {
    	// data.values contains the array of rows from the spreadsheet. Each row is also an array of cell values.
    	// Modify the code below to suit the structure of your spreadsheet.
    	$(data.values).each(function() {
    		var location = {};
				location.title = this[2];
				location.latitude = parseFloat(this[0]);
      	        		location.longitude = parseFloat(this[1]);
                		location.group = this[3];
       	        	location.condition = this[4];
                		location.visited = this[6];
                		location.visitdate = this[7];
	  		    	locations.push(location);
    	});

      // Center on (0, 0). Map center and zoom will reconfigure later (fitbounds method)
      var mapOptions = {
        zoom: 10,
        center: new google.maps.LatLng(0, 0)
      };
      var map = new google.maps.Map(document.getElementById('map'), mapOptions);
      setLocations(map, locations);
  });
}


function setLocations(map, locations) {
  var bounds = new google.maps.LatLngBounds();
  // Create nice, customised pop-up boxes, to appear when the marker is clicked on
  var infowindow = new google.maps.InfoWindow({
    content: "Content String"
  });
  for (var i = 0; i < locations.length; i++) {
    var new_marker = createMarker(map, locations[i], infowindow);
    bounds.extend(new_marker.position);
  }
  map.fitBounds(bounds);
}

function createMarker(map, location, infowindow) {

  // Modify the code below to suit the structure of your spreadsheet (stored in variable 'location')
  var position = {
    lat: parseFloat(location.latitude),
    lng: parseFloat(location.longitude)
  };
  var iconType = 'none';
  
  if (location.condition === undefined) {
      iconType = 'none';
  } else {
      iconType = location.condition;
      iconType = iconType.replace(/\s/g, '');
  }
  
  var marker = new google.maps.Marker({
    position: position,
    icon: icons[iconType].icon,
    map: map,
    title: location.title,
  });
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent('<div>'+
    '<p><strong>' + location.title + '</strong></p>' +
    ((location.group === undefined) ? "" : ('<p><strong>Group: </strong>' + location.group + '</p>')) +
    ((location.condition === undefined) ? "" : ('<p><strong>Condition: </strong>' + location.condition + '</p>')) +
    ((location.visited === undefined) ? "" : ('<p><strong>Visited: </strong>' + location.visited + ((location.visited === 'NO') ? "" : (' (' + location.visitdate + ')')) + '</p>')) +
    ((location.notes === undefined) ? "" : ('<p><strong>Notes: </strong>' + location.notes)) +
    '</div>');
    infowindow.open(map, marker);
  });
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
