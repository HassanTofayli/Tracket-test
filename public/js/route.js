let map;
//33.268, 35.2098

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");
  map = new Map(document.getElementById("map"), {
    center: { lat: 33.268, lng: 35.2098 },
    zoom: 8,
  });
  
var marker1, marker2;

function calculateAndDisplayRouteDetails(start, end) {
  var directionsService = new google.maps.DirectionsService();
  var directionsRenderer = new google.maps.DirectionsRenderer();
  var distanceMatrixService = new google.maps.DistanceMatrixService();

  directionsRenderer.setMap(map);

  var request = {
    origin: start,
    destination: end,
    travelMode: google.maps.TravelMode.DRIVING,
  };

  directionsService.route(request, function (response, status) {
    if (status === "OK") {
      directionsRenderer.setDirections(response);

      // Access the coordinates of the route
      var routeCoordinates = response.routes[0].overview_path;
      document.querySelector("input[name='coordinates']").value = routeCoordinates; 
    }
  });
   distanceMatrixService.getDistanceMatrix(request, function (response, status)  {
     if (status == "OK") {
       var distance = response.rows[0].elements[0].distance.text;
       var duration = response.rows[0].elements[0].duration.text;
      //  console.log("Distance: " + distance);
      //  console.log("Duration: " + duration);
      document.querySelector("input[name='distance']").value =
        distance; 
      document.querySelector("input[name='duration']").value =
        duration; 
       
     }
   }); 
}

map.addListener("click", function (event) {
  if (!marker1) {
    marker1 = new google.maps.Marker({
      position: event.latLng,
      map: map,
    });
  } else if (!marker2) {
    marker2 = new google.maps.Marker({
      position: event.latLng,
      map: map,
    });

    // Call a function to calculate and display the route
    calculateAndDisplayRouteDetails(marker1.getPosition(), marker2.getPosition());
    
  }
});

}

initMap();



