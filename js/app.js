var map, clientId, clientSecretId;

function viewModel() {
    var self = this;
    this.markers = [];

    this.populateInfoWindow = function (marker, infowindow) {
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

            $.getJSON(url).done(function (marker) {
                var response = marker.response.venues[0];
                self.street = response.location.formattedAddress[0];
                self.city = response.location.formattedAddress[1];
                self.zip = response.location.formattedAddress[3];
                self.country = response.location.formattedAddress[4];
                self.category = response.categories[0].shortName;
                self.htmlContentFoursquare = '<div>';
                if (self.category) {
                    self.htmlContentFoursquare +=
                        '<h5 class="marker_subtitle">(' +
                        self.category +
                        ')</h5>';
                }
                if (self.street) {
                    self.htmlContentFoursquare +=
                        '<h6 class="marker_address_title"> Address: </h6> <p class="marker_address">' +
                        self.street +
                        '</p>';
                }
                if (self.city) {
                    self.htmlContentFoursquare +=
                        '<p class="marker_address">' +
                        self.city +
                        '</p>';
                }
                if (self.zip) {
                    self.htmlContentFoursquare +=
                        '<p class="marker_address">' +
                        self.zip +
                        '</p>  </div>';
                }
                infowindow.setContent(self.markupContent + self.htmlContentFoursquare);
            }).fail(function () {
                alert(" an error was found loading the API");
            });
            this.markupContent = '<h4 class="marker_title">' + marker.title + '</h4>';
            infowindow.open(map, marker);
            infowindow.addListener('click', function () {
                infowindow.marker = null;
            });
        }
    };

    /* This function takes in a COLOR, and then creates a new marker
    icon of that color. The icon will be 21 px wide by 34 high, have an origin
    of 0, 0 and be anchored at 10, 34). */
    this.makeMarkerIcon = function (markerColor) {
        var markerImage = new google.maps.MarkerImage(
            'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
            '|40|_|%E2%80%A2',
            new google.maps.Size(21, 34),
            new google.maps.Point(0, 0),
            new google.maps.Point(10, 34),
            new google.maps.Size(21, 34));
        return markerImage;
    };

    this.markerPopulate = function () {
        self.populateInfoWindow(this, self.infoWindowMaps);
        this.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout((function () {
            this.setAnimation(null);
        }).bind(this), 1400);
    };
    /* Two event listeners - one for mouseover, one for mouseout,
    to change the colors back and forth. */
    this.changeIcontoHighlight = function () {
        this.setIcon(self.highlightedIcon);
    };
    this.changeIconToDefault = function () {
        this.setIcon(self.defaultIcon);
    };

    this.initMap = function () {
        map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: -32.904111, lng: -68.8617993},
            zoom: 14,
            styles: styles,
            mapTypeControl: false
        });

        // Style the markers a bit. This will be our listing marker icon.      
        self.defaultIcon = this.makeMarkerIcon('0091ff');
        /* Create a "highlighted location" marker color for when the user
        mouses over the marker.*/
        self.highlightedIcon = this.makeMarkerIcon('FFFF24');
        this.infoWindowMaps = new google.maps.InfoWindow();
        for (var i = 0; i < locations.length; i++) {
            // Get the position from the location array.
            this.title = locations[i].title;
            // Create a marker per location, and put into markers array.
            this.position = locations[i].location;
            this.googleMarker = new google.maps.Marker({
                map: map,
                position: this.position,
                title: this.title,
                id: i,
                icon: this.defaultIcon,
                animation: google.maps.Animation.DROP
            });
            this.googleMarker.setMap(map);
            this.markers.push(this.googleMarker);
            this.googleMarker.addListener('click', self.markerPopulate);
            /* Two event listeners - one for mouseover, one for mouseout,
            to change the colors back and forth.*/
            this.googleMarker.addListener('mouseover', self.changeIcontoHighlight);
            this.googleMarker.addListener('mouseout', self.changeIconToDefault);
        }

    };

    this.initMap();

    this.searchOption = ko.observable("");
    this.myLocationsFilter = ko.computed(function () {
        var result = [];
        for (var i = 0; i < this.markers.length; i++) {
            var markerLocation = this.markers[i];
            // here I compare the input to the markers with the includes method( not suppoerted in IE 11 and earlier versions )
            if (markerLocation.title.toLowerCase().includes(this.searchOption()
                .toLowerCase())) {
                // if there is a match, push to the result array and make it visible, then return the results
                result.push(markerLocation);
                this.markers[i].setVisible(true);
            } else {
                this.markers[i].setVisible(false);
            }
        }
        return result;
    }, this);

}
googleError = function googleError() {
    alert(
        'Google Maps did not load. Please refresh the page or try again later'
    );
};

function init() {
    ko.applyBindings(new viewModel());
}