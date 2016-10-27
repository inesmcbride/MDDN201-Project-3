$(document).ready(function() {
  $menuLeft = $('.pushmenu-left');
  $nav_list = $('#nav_list');

  $nav_list.click(function() {
    $(this).toggleClass('active');
    $('.pushmenu-push').toggleClass('pushmenu-push-toright');
    $menuLeft.toggleClass('pushmenu-open');
  });

  $('.containerTwo').hide();
  $('.containerThree').hide();

  $('#runMap').click(function(){
    $('#searchInput').empty();
    $('.containerTwo').show();
    $('.Three').hide();
    $('#mainMap').css('background-image', 'none');
  });

  $('#findAPark').click(function() {
      location.reload();
  });

});

var map;
var destinationLatLngs = ['-41.297571,174.783568', '-41.294291,174.784479', '-41.294052,174.785287', '-41.292271,174.785944', '-41.291124,174.771171', '-41.305645,174.774314', '-41.310746,174.780346', '-41.312232,174.780285', '-41.297297,174.785897', '-41.300345,174.782743' ];
var stored;
var show;

var directionsService;
var directionsDisplay;
var directionsDisplay2;

function initMap() {
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  directionsDisplay2 = new google.maps.DirectionsRenderer;
    map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: {lat: -41.287, lng: 174.75}
  });

  directionsDisplay.setMap(map);
  directionsDisplay2.setMap(map);
  directionsDisplay.setPanel(document.getElementById('right-panel'));
  directionsDisplay2.setPanel(document.getElementById('left-panel'));


  var onChangeHandler = function() {
    calculateAndDisplayRoute(directionsService, directionsDisplay);
    calculateAndDisplayRoute(directionsService, directionsDisplay2);
    }
}


function calculateAndDisplayChosenRoute(directionsService, directionsDisplay, directionsDisplay2, location) {
  if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function (position) {
  var lat = position.coords.latitude;
  var long = position.coords.longitude;
  var coords = new google.maps.LatLng(lat, long);
  console.log(coords);
  var end = location;
  directionsService.route({
    origin: coords,
    destination: end,
    travelMode: 'DRIVING'
  }, function(response, status) {
    if (status === 'OK') {
      directionsDisplay.setDirections(response);
      directionsDisplay2.setDirections(response);
    }
  });
});
}
}

var myIcon = 'images/location2.png'
var marker;


function placePin(location){
  var marker = new google.maps.Marker({
    position: location,
    map: map,
    icon: myIcon,
  });
google.maps.event.addListener(map, 'click', function() {
  //marker.setVisible(false);
console.log('visible_changed triggered');
});
}

function runMap(){
  var origin1 = $('#address').val();
  origin1 = origin1 + ', New Zealand';
  console.log(origin1);
  var service = new google.maps.DistanceMatrixService();

  service.getDistanceMatrix(
    {
      origins: [origin1],
      destinations: destinationLatLngs,
      travelMode: 'DRIVING',
    }, callback);
  }


function callback(response, status) {
    console.log(response);
    google.maps.event.trigger(map, 'resize');

    render(response);

    // Catch click event
    $('p#ordered').click(function(event){
      $('.Two').hide();
      $('.Three').show();
      var addressString = $(this).data("address");
      console.log(addressString);
      $('.streetName').append('<p>' + addressString)
      calculateAndDisplayChosenRoute(directionsService, directionsDisplay, directionsDisplay2, addressString);
    });

    // Place pins on map
    $.each(destinationLatLngs, function(index, value){
      var data = value.split(',');
      var location = {lat: parseFloat(data[0]), lng: parseFloat(data[1])};
      placePin(location);
    });
}

function render(response){
  $('#distanceResults, #distanceResults1').empty();

  $.each(response.rows[0].elements, function(index, value) {
    var address = response.destinationAddresses[index];
    var distance = value.distance.text;
    console.log(distance)
    $('#distanceResults, #distanceResults1').append('<p id="ordered" data-address="' +  address + '">' + '<img src="images/Location.png" width="10%"/>' +  distance + ' <br> ' + address + '</p>' + ' <br> ' + '<img class="line" src="images/BlueLine.png">' + ' <br> ')

    var orders = document.getElementById("ordered");
    var show = orders.dataset.address;
    console.log(show);
  });

}
