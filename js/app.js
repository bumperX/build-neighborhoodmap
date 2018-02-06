// Handle google map loading error
mapError = function() {
  alert('Fail to load Google Map. Please refresh the page.');
};

// Initialize global vm
var vm;
var infoWindow;


// MODEL
var Location = function(locations, vm) {
  var self = this;
  var position = locations.location;
  this.title = ko.observable(locations.title);
  var id = locations.id;

  // This function takes in a purpose, and then creates a new marker
  // icon with that purpose. The icon will be 28 px wide by 30 high, 
  // have an origin of 0, 0 and be anchored at 0, 30)
  function makeMarkerIcon(purpose) {
    defaultIconUrl = 'https://cdn2.iconfinder.com/data/icons/st-'+
      'patrick-s-day-13/32/mask-carnival-celebrate-festival-saint'+
      '-patricks-day-256.png';
    highlightedIconUrl = 'https://cdn3.iconfinder.com/data/icons/'+
      'st-patrick-s-day-6/32/mask-carnival-celebrate-festival-saint'+
      '-patricks-day-256.png';
    var markerImage = new google.maps.MarkerImage(
      purpose == 'default' ? defaultIconUrl : highlightedIconUrl,
      new google.maps.Size(28, 30),
      new google.maps.Point(0, 0),
      new google.maps.Point(0, 30),
      new google.maps.Size(28, 30)
      );
    return markerImage;
  }

  // Style the markers a bit. This will be our listing marker icon
  var defaultIcon = makeMarkerIcon('default');
  // Create a "highlighted location" marker color for when the user
  // mouses over the marker
  var highlightedIcon = makeMarkerIcon('highlightedIcon');

  // Create a marker
  this.marker = new google.maps.Marker({
    position: position,
    title: this.title(),
    animation: google.maps.Animation.DROP,
    icon: defaultIcon,
    id: id,
    map: map,
    visible: true
  });

  // Create an onclick event to open the large infowindow at each marker
  this.marker.addListener('click', function() {
    populateInfoWindow(this, infoWindow);
    map.panTo(this.position);
    this.setAnimation(google.maps.Animation.BOUNCE);
    // Hide the marker after 1000 milliseconds
    var marker = this;
    setTimeout(function() {
      marker.setAnimation(null);
    }, 1000);
    // Update the vm
    vm.currentLocation(marker);
  }, this);

  // Two event listeners - one for mouseover, one for mouseout,
  // to change the colors back and forth.
  this.marker.addListener('mouseover', function() {
    this.setIcon(highlightedIcon);
  });
  this.marker.addListener('mouseout', function() {
    this.setIcon(defaultIcon);
  });

  google.maps.event.addListener(map, 'click', function(event) {
    infoWindow.close();
  });

  // This function populates the infowindow when the marker is clicked. We'll only allow
  // one infowindow which will open at the marker that is clicked, and populate based
  // on that markers position.
  populateInfoWindow = function(marker, infowindow) {
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
    });
    // Populate the infowindow with phone and address info from FourSquare
    ClientID = 'GBK1GQQSWL2BJR3VATDCWGRMYP5Z3S3OPIRVG3Z5ODAZGZYB';
    ClientSecret = 'RGJKPDGTPX3M2RHFAQCOBJNKLL2Y0XDTYODEQEVWAYUX2YF0';
    var url = 'https://api.foursquare.com/v2/venues/search?ll='+marker.position.lat()+
      ','+marker.position.lng()+'&client_id='+ClientID+'&client_secret='+ClientSecret+
      '&query='+marker.title+'&v=20180204';
    $.getJSON(url).done(function(marker) {
      var response = marker.response.venues[0];
      self.phone = response.contact.formattedPhone;
      self.address = response.location.formattedAddress;
      infowindow.setContent('<p><strong>Phone</strong>: '+self.phone+
        '</p><p><strong>Address</strong>: '+self.address+'</p>');
    }).fail(function() {
      // Send alert if fail to load API
      alert("Fail to load Foursquare API ...");
    });

    infowindow.open(map, marker);
  };
};


// ViewModel
var ViewModel = function() {
  var self = this;
  this.locationsList = ko.observableArray([]);

  // Constructor creates a new map - only center and zoom are required.
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.761831, lng: -73.982781},
    zoom: 16,
    styles: styles,
    mapTypeControl: false
  });

  // Initialize info-window
  initializeInfoWindow = function() {
    var infoHTML = '<div id="info-window" data-bind="template:'+
      '{name:\'info-template\'}"></div>';
    infoWindow = new google.maps.InfoWindow({
      content: infoHTML
    });

    var infoShow = false;
    google.maps.event.addListener(infoWindow, 'domready', function() {
      if (!infoShow) {
        ko.applyBindings(self, document.getElementById('info-window'));
        infoShow = true;
      }
    });
  };

  initializeInfoWindow();

  // Populate locationList with locations
  locations.forEach(function(item){
    self.locationsList().push(new Location(item, self));
  });
  // Set current location
  self.currentLocation = ko.observable(this.locationsList()[0]);

  // Set filtered list
  self.search = ko.observable('');
  this.searchList = ko.computed(function() {
    var res = self.locationsList().filter(function(item) {
      if (item.title().toLowerCase().indexOf(self.search().toLowerCase())>=0) {
        item.marker.setVisible(true);
      } else {
        item.marker.setVisible(false);
      }
      return item.title().toLowerCase().indexOf(self.search().toLowerCase())>=0;
    });
    return res;
  });

  // In case list item is clicked, highlight its marker
  this.triggerMarker = function(loc) {
    google.maps.event.trigger(loc.marker, 'click');
  };
};

// Initialize app
appInit = function() {
  vm = new ViewModel();
  ko.applyBindings(vm);
};

