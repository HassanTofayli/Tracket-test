
document.addEventListener("DOMContentLoaded", function () {
    var map = L.map('map').setView([33.2680, 35.2098], 12);
    mapLink = "<a href='http://openstreetmap.org'>OpenStreetMap</a>";
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', { maxZoom: 18 }).addTo(map);

    
    var marker1, marker2;
    var markerCount = 0;
    

    function handleMapClick(event) {
        if(markerCount>1){
            return  map.off("click", handleMapClick);
        
        }
      if (markerCount === 0) {
        marker1 = L.marker(event.latlng).addTo(map);
        marker1.draggable.enable();
        markerCount++;
      } else if (markerCount === 1) {
        marker2 = L.marker(event.latlng).addTo(map);
        marker2.draggable.enable();
        markerCount++;
      }else{

      }
    }

    map.on("click", handleMapClick);

    function handleMarkerDragEnd(event) {
      var marker = event.target;
      var position = marker.getLatLng();
      // Update the marker's location as needed
      console.log("Marker position:", position);
    }

    marker1.on("dragend", handleMarkerDragEnd);
    marker2.on("dragend", handleMarkerDragEnd);
  });