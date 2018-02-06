// Create a styles array to use with the map
var styles = [
  {
    'featureType': 'administrative',
    'elementType': 'labels.text.fil',
    'stylers': [
      {'color': '#444444'},
      {'weight': 0.5}
    ]
  },
  {
    'featureType': 'landscape',
    'elementType': 'all',
    'stylers': [
      {'color': '#f2f2f2'}
    ]
  },
  {
    'featureType': 'poi',
    'elementType': 'all',
    'stylers': [
      {'visibility': 'off'}
    ]
  },
  {
    'featureType': 'road',
    'elementType': 'all',
    'stylers': [
      {'saturation': -100},
      {'lightness': 45}
    ]
  },
  {
    'featureType': 'road.highway',
    'elementType': 'all',
    'stylers': [
      {'visibility': 'simplified'}
    ]
  },
  {
    'featureType': 'road.arterial',
    'elementType': 'labels.icon',
    'stylers': [
      {'visibility': 'off'}
    ]
  },
  {
    'featureType': 'transit',
    'elementType': 'all',
    'stylers': [
      {'visibility': 'off'}
    ]
  },
  {
    'featureType': 'water',
    'elementType': 'all',
    'stylers': [
      {'color': '#46bcec'},
      {'visibility': 'on'}
    ]
  }
];