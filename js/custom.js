var mapGoogleDiv = document.getElementById('map-google');
var mapMapBoxDiv = document.getElementById('map');
var clearButton = document.getElementById('clear');
var inputField = document.getElementById('ip-input');
var intro = document.getElementById('intro');
// prevent enter key default behaviour
function preventRefresh() {
  inputField.addEventListener('keypress', function (event) {
      if (event.keyCode == 13) {
          event.preventDefault();
      }
  });
}
// Search function and fire 'prevent enter default'
function search(){
  var apiURL = 'http://freegeoip.net/json/';
  var apiURL = apiURL + inputField.value;
  loadDoc(apiURL, searchIP);
  preventRefresh();
  intro.style.display = 'none';
  clearButton.style.display = 'block';
}
// 'Enter' key to fire search function 'Go!' button
inputField.onkeydown = function (event) {
  if (event.keyCode == 13) {
      search();
  }
};
// 'Go!' button to fire search function
document.getElementById('go-button').addEventListener('click', function() {
  search();
});
// Ajax Request generic function
function loadDoc(url, cFunction) {
    var xhttp;
    xhttp=new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        cFunction(this);
      }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
  }
//Get API result and convert to an object, write outputs to page
var searchResult;
  function searchIP(xhttp) {
      var ipData = JSON.parse(xhttp.responseText);
      searchResult = document.getElementById('search-result');
        for (var prop in ipData){
      }
        searchResult.innerHTML = "";
        searchResult.innerHTML += "<p><b>IP Address:</b> " + ipData.ip + "</p>";
        searchResult.innerHTML += "<p><b>Country Code:</b> " + ipData.country_code + "</p>";
        searchResult.innerHTML += "<p><b>Country:</b> " + ipData.country_name + "</p>";
        searchResult.innerHTML += "<p><b>Region Code:</b> " + ipData.region_code + "</p>";
        searchResult.innerHTML += "<p><b>Region Name:</b> " + ipData.region_name + "</p>";
        searchResult.innerHTML += "<p><b>City:</b> " + ipData.city + "</p>";
        searchResult.innerHTML += "<p><b>Post Code:</b> " + ipData.zip_code + "</p>";
        searchResult.innerHTML += "<p><b>Time Zone:</b> " + ipData.time_zone + "</p>";
        searchResult.innerHTML += "<p><b>Latitude:</b> " + ipData.latitude + "</p>";
        searchResult.innerHTML += "<p><b>Longitude:</b> " + ipData.longitude + "</p>";
        markerArrayMapBox.push([ipData.latitude, ipData.longitude]);
        newMapBoxMarker()
        markerArray.push({lat: ipData.latitude, lng: ipData.longitude });
        newMarker();
  }
// Button to toggle between maps
var toggleMaps = document.getElementById('toggle-map');
  document.getElementById('toggle-map').addEventListener('click', function() {
      if (toggleMaps.innerHTML === 'Switch To Google Maps') {
          toggleMaps.innerHTML = 'Switch To Mapbox';
          mapMapBoxDiv.style.display = 'none';
          mapGoogleDiv.style.display = 'block';
          initMap();
      } else{
            toggleMaps.innerHTML = 'Switch To Google Maps';
            mapMapBoxDiv.style.display = 'block';
            mapGoogleDiv.style.display = 'none';
      }
});
// Map variables
var markerArray = [];
var storeMarker = [];
var infoWindows = [];
var marker;
var map;
var markerArrayMapBox = [];
var storeMarkerMapBox = [];
var markerMapBox;
var mapLeaflet;
//var mapMapBox;
// Load google map
// Set map with zoom and center
function initMap() {
  var mapDefault = {lat: 26.8206, lng: 30.8025};
  map = new google.maps.Map(document.getElementById('map-google'), {
    zoom: 3,
    center: mapDefault
  });
}
// Set new marker and add it to array
function newMarker(){
  var infoTitle = inputField.value;

    marker = new google.maps.Marker({
    position: markerArray[markerArray.length-1],
    map: map,
    title: infoTitle
    });
    // reset zoom and center to new marker
    // map.setZoom(3),
    // map.setCenter(markerArray[markerArray.length-1])
    // Store markers in new array to allow for removeMarkers function
    storeMarker.push(marker);
    // Set info window to marker and define content
    infoWindows[storeMarker.length-1] = new google.maps.InfoWindow({
      content: infoTitle
    });
    // Add info window to marker when marker is hovered over
    google.maps.event.addListener(storeMarker[storeMarker.length-1], 'mouseover', function(innerKey) {
      return function(){
      infoWindows[innerKey].open(map, storeMarker[innerKey]);
      }
    }(storeMarker.length-1));
      inputField.value = "";
}
// Create listener on 'clear' button
clearButton.addEventListener('click', function(){
  removeMarkers();
  removeMarkersMapBox();
  mapLeaflet.setView([26.8206, 30.8025], 3);
  searchResult.innerHTML = "";
  intro.style.display = 'block';
  clearButton.style.display = 'none';
});
// Remove all markers from the map.
function removeMarkers(){
  for(i = 0; i < storeMarker.length; i++){
      storeMarker[i].setMap(null);
      markerArray = [];
  }
}
//load mapbox map
function loadMapBox() {
  L.mapbox.accessToken = 'pk.eyJ1Ijoia29tYmltZWRpYSIsImEiOiJjajQ2M28yOGswYzhqMzJvYTU1OG42MDh4In0.-IoC5RhVmzev92o14vX32w';
  mapLeaflet = L.mapbox.map('map', 'mapbox.streets')
  .setView([26.8206, 30.8025], 3);
}
loadMapBox();
//Add markers to map
function newMapBoxMarker(){
  markerMapBox = L.marker(markerArrayMapBox[markerArrayMapBox.length-1]);
  markerMapBox.addTo(mapLeaflet);
  mapLeaflet.flyTo((markerArrayMapBox[markerArrayMapBox.length-1]), 10, {
        animate: true,
        duration: 2
    });
  storeMarkerMapBox.push(markerMapBox);
}
//Remove markers and empty arrays
function removeMarkersMapBox(){
  for(i = 0; i < storeMarkerMapBox.length; i++){
    mapLeaflet.removeLayer(storeMarkerMapBox[i]);
    markerArrayMapBox = [];
    storeMarkerMapBox[i] = [];
  }
}



// function loadMapBox() {
//   mapboxgl.accessToken = 'pk.eyJ1Ijoia29tYmltZWRpYSIsImEiOiJjajQ2M28yOGswYzhqMzJvYTU1OG42MDh4In0.-IoC5RhVmzev92o14vX32w';
//   mapMapBox = new mapboxgl.Map({
//       container: 'map',
//       style: 'mapbox://styles/mapbox/streets-v9',
//       center: [30.8025, 26.8206],
//       zoom: 2
//   });
// }
// loadMapBox();

// function newMapBoxMarker(){
//   markerMapBox = new mapboxgl.Marker()
//     .setLngLat([30.5, 50.5])
//     .addTo(mapMapBox);
// }
// newMapBoxMarker()






// var geojson = {
//     "type": "FeatureCollection",
//     "features": [
//         {
//             "type": "Feature",
//             "properties": {
//                 "message": "Foo",
//                 "iconSize": [60, 60]
//             },
//             "geometry": {
//                 "type": "Point",
//                 "coordinates": [
//                     markerArrayMapBox
//                 ]
//             }
//         },
//         {
//             "type": "Feature",
//             "properties": {
//                 "message": "Bar",
//                 "iconSize": [50, 50]
//             },
//             "geometry": {
//                 "type": "Point",
//                 "coordinates": [
//                     -61.2158203125,
//                     -15.97189158092897
//                 ]
//             }
//         },
//         {
//             "type": "Feature",
//             "properties": {
//                 "message": "Baz",
//                 "iconSize": [40, 40]
//             },
//             "geometry": {
//                 "type": "Point",
//                 "coordinates": [
//                     -63.29223632812499,
//                     -18.28151823530889
//                 ]
//             }
//         }
//     ]
// };

// // add markers to map
// geojson.features.forEach(function(marker) {
//     // create a DOM element for the marker
//     var el = document.createElement('div');
//     el.className = 'marker';
//     el.style.backgroundImage = 'url(https://placekitten.com/g/' + marker.properties.iconSize.join('/') + '/)';
//     el.style.width = marker.properties.iconSize[0] + 'px';
//     el.style.height = marker.properties.iconSize[1] + 'px';

//     el.addEventListener('click', function() {
//         window.alert(marker.properties.message);
//     });

//     // add marker to map
//     new mapboxgl.Marker(el, {offset: [-marker.properties.iconSize[0] / 2, -marker.properties.iconSize[1] / 2]})
//         .setLngLat(marker.geometry.coordinates)
//         .addTo(mapMapBox);
// });



