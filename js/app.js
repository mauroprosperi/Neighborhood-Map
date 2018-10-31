var map, clientId, clientSecretId;

function viewModel() {
    var self = this;
    this.markers = [];
    this.searchOption = ko.observable("");

    this.populateInfoWindow = function(marker, infowindow) {
        //Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
          //Clear the infowindow content to give the streetview time to load.
          infowindow.setContent('');
          infowindow.marker = marker;
          //I research through the documentation and find the getPosition method, this returns a LatLng class!
          var lat = marker.getPosition().lat();
          var lng = marker.getPosition().lng();
          //Forsquare API 
          clientId = 'YJF01YJ145HRMOEXPWXZQ10KXZB0KBUXIKNEI1NS4SEFQFGK';
          clientSecretId = 'UAHG4CEA5NI0CQGNT0BECNFTWXKQMWHEQLDVF5TZWNEN0XHH';
          var url = 'https://api.foursquare.com/v2/venues/search?ll=' + lat + ',' +
                lng + '&client_id=' + clientId + '&client_secret=' +
                clientSecretId + '&query=' + marker.title + '&v=20170708' + '&m=foursquare';

            $.getJSON(url).done(function(marker) {
                var response = marker.response.venues[0];
                self.street = response.location.formattedAddress[0];
                self.city = response.location.formattedAddress[1];
                self.zip = response.location.formattedAddress[3];
                self.country = response.location.formattedAddress[4];
                self.category = response.categories[0].shortName;
                // htmlContentFoursquare
                self.htmlContentFoursquare = '<div>';
                if (self.category) {
                	self.htmlContentFoursquare += '<h5 class="iw_subtitle">('+ self.category +')</h5>'
                }
                if (self.street) {
                	self.htmlContentFoursquare += '<h6 class="iw_address_title"> Address: </h6> <p class="iw_address">' + self.street + '</p>'
                }
                if (self.city) {
                	self.htmlContentFoursquare += '<p class="iw_address">' + self.city + '</p>'
                }
                if (self.zip) {
                    self.htmlContentFoursquare += '<p class="iw_address">' + self.zip + '</p>  </div>'
                }
                infowindow.setContent(self.markupContent + self.htmlContentFoursquare);
            }).fail(function(){
              alert(" an error was found loading the API");
          });
          this.markupContent = '<h4 class="iw_title">' + marker.title + '</h4>';
          infowindow.open(map, marker);
          infowindow.addListener('click', function(){
              infowindow.marker = null;
          });
        }
    };


    this.markerPopulate = function() {
        self.populateInfoWindow(this, self.infoWindowMaps);
        this.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout((function() {
            this.setAnimation(null);
        }).bind(this), 1400);
    };

    this.initMap = function() {
        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: -32.912951, lng: -68.862329},
            zoom: 15,
            styles: styles,
            mapTypeControl: false
          });
   


    this.infoWindowMaps = new google.maps.InfoWindow();
    for ( var i = 0; i < locations.length; i++) {
        this.title = locations[i].title;
        this.position = locations[i].location;

        this.googleMarker = new google.maps.Marker({
            map: map,
            position: this.position,
            title: this.title,
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
        'Google Maps did not load. Please refresh the page or try again later'
    );
};

function init(){
    ko.applyBindings(new viewModel());
}