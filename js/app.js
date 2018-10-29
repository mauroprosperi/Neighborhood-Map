var map, clientId, clientSecretId

function viewModel() {
    var self = this;
    this.markers = [];


    this.populateInfoWindow = function(marker, infowindow) {
        //Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
          //Clear the infowindow content to give the streetview time to load.
          infowindow.setContent('');
          infowindow.marker = marker;
          //Forsquare API
          clientId = 'YJF01YJ145HRMOEXPWXZQ10KXZB0KBUXIKNEI1NS4SEFQFGK';
          clientSecretId = 'UAHG4CEA5NI0CQGNT0BECNFTWXKQMWHEQLDVF5TZWNEN0XHH';
          var url = 'https://api.foursquare.com/v2/venues/search?ll=' + marker.lat + ',' +
                marker.lng + '&client_id=' + clientId + '&client_secret=' +
                clientSecretId + '&query=' + marker.title + '&v=20170708' + '&m=forsquare';

          $.getJSON(url).done(function(marker) {
            var response = marker.response.venues[0];
            self.city = response.location.formattedAddress[1];
            self.zip = response.location.formattedAddress[3];
            self.country = response.location.formattedAddress[4];

            self.responseContent =
                '<div>' +
                    '<h6 class="iw_address_title"> Address: </h6>' +
                    '<p class="iw_address">' + self.city + '</p>' +
                    '<p class="iw_address">' + self.zip + '</p>' +
                    '<p class="iw_address">' + self.country + '</p>' +
                '</div>' +
            '</div>';   // el div se abre mas abajo en el content del html,
                        // revisar para ver si se puede eliminar aca
            infowindow.setContent(self.markupContent + self.responseContent);
          }).fail(function(){
              alert(" there was an issue loading the api, please killyourself");
          });
          // aca se abre el div
          this.markupContent = '<div>' + '<h4 class="iw_title">' + marker.title + '</h4>';

          infowindow.open(map, marker);
                            // CLOSECLICK FTW 
          infowindow.addListener('closeclick', function(){
              infowindow.marker = null;
          });
        }
    };


    this.markerPopulate = function() {
        self.populateInfoWindow(this, self.largeinfowindow); // cambiar nobmre ?
        this.setAnimation(google.maps.Animation.BOUNCE); // asd 
        setTimeout((function() {
            this.setAnimation(null);
        }).bind(this), 1400);
    };

    initMap = function() {
        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: -32.912951, lng: -68.862329},
            zoom: 15,
            styles: styles,
            mapTypeControl: false
          });
   


    this.infoWindowMaps = new google.maps.InfoWindow();
    for ( var i = 0; i < locations.length; i++) {
        this.title = locations[i].title;
        this.lat = locations[i].lat;
        this.lng = locations[i].lng;

        this.googleMarker = new google.maps.Marker({
            map: map,
            position: {
                lat:  this.lat,
                lng:  this.lng
            },
            title: this.title,
            lat: this.lat,
            lng: this.lng,
            id: i,
            animation: google.maps.Animation.DROP
        });
        this.googleMarker.setMap(map);
        this.markers.push(this.googleMarker);
        this.googleMarker.addListener('click', self.markerPopulate)
    }
};

    this.initMap();
// cambiar giladas
    this.myLocationsFilter = ko.computed(function() {
       var result = [];
       for (var i = 0; i < this.markers.length; i++) {
            var markerLocation = this.markers[i];
         if (markerLocation.title.toLowerCase().includes(this.searchOption()
                    .toLowerCase())) {
              result.push(markerLocation);
             this.markers[i].setVisible(true);
          } else {
             this.markers[i].setVisible(false);
          }
        }
    return result;
    }, this);

} // fin de la viewmodel
// cambiar giladas
googleError = function googleError() {
    alert(
        'Oops. Google Maps did not load. Please refresh the page and try again!'
    );
};

function init(){
    ko.applyBindings(new viewModel());
}