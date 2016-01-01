//Udacity Requirement: use Knockout.js

var viewModel = {

    //Udacity Requirement: Your project should include at least 5 locations and display those locations when the page is loaded

    //TODO: these could be in a separate json file, loaded up server side, etc.
    _locations: [{
        name: "Farm",
        address: "96 Targosh Road, Candor NY 13743",
        website: "htp://??"
    }, {
        name: "Library",
        address: "2 Bank Street, Candor NY 13743",
    }, {
        name: "Ice Cream Shop",
        address: "49 Owego Rd, Candor, NY 13743",
    }, {
        name: "Village Psychic",
        address: "100 Main St, Candor, NY 13743",
    }, {
        name: "Elementary School",
        address: "2 Academy St, Candor, NY 13743",
    }, {
        name: "Turkey Trot Acres Hunting Lodge",
        address: "188 Tubbs Hill Rd, Candor, NY 13743",
    }],

    // public member variables (view will access these)
    filter: ko.observable(""),

    // private member variables 
    _map: null,
    _mapBounds: null,
    _callbackCount: 0,

    // Main entry point
    // public
    init: function() {

        //Udacity Requirement: call the google map API only once
        this._map = new google.maps.Map(document.getElementById("map"), {});
        this._mapBounds = new google.maps.LatLngBounds();

        this._drawLocations();
        this._buildLocationPlaces();

        //Udacity Requirement: implement a filter on the list view
        this.filter.subscribe(function() {
            var filter = this.filter();
            this._drawLocations(filter);
        }, this);

        window.addEventListener('resize', (function(e) {
            this._map.fitBounds(this._mapBounds);
            this._map.setCenter(this._mapBounds.getCenter());
        }).bind(this));

        ko.applyBindings(this);
    },

    // Add list items & markers that match the filter (or add all if there is no filter)
    // NOTE: I spent a lot of time trying to use an observable array that would track the visibility
    //       of items and update accordingly, as well as binding to a filtered array. It worked well 
    //       in the simple case of the list items tracking the filter box, but it started to break down 
    //       and get ugly once the markers and list items sharing visibility and click events.
    //       In the end, a koObservableArray became awkward and forced and felt like I was hacking 
    //       knockout to do something it didn't do well for this use case. For the sake of simplicity, 
    //       I swapped out my koObservableArray to instead building the UL list as the user filters. 
    //       I understand how binding with MVVM works with knockout, but for the way this code is 
    //       structured, it's a square peg in a round hole.
    // private
    _drawLocations: function(filter) {

        var locations = $("#locations");
        locations.empty(); //this will also drop any event handlers in child nodes (click events)

        //POSSIBLE REFACTOR: while it's nice to loop just once, the logic is confusing
        //          since it's both building lists & sorting out marker visibility

        for (var i = 0; i < this._locations.length; i++) {

            var location = this._locations[i];
            if (typeof(location.marker) != "undefined")
                location.marker.setMap(null);

            //TODO: this could be cleaner
            var name = null;
            if (typeof(filter) == "undefined")
                name = location.name;
            else if (location.name.indexOf(filter) != -1)
                name = location.name.replace(filter, "<b>" + filter + "</b>");

            if (name !== null) { // this location matches the filter, or there is no filter

                locations.append("<li><a id=\"l" + i + "\" href=\"#\">" + name + "</a></li>");
                $("#l" + i).on("click", this._locationClicked.bind(this, i));

                if (typeof(location.marker) != "undefined")
                    location.marker.setMap(this._map);
            }
        }
    },

    // Given this._locations, use google's PlaceService API to turn addresses into locations. 
    // private
    _buildLocationPlaces: function() {

        var service = new google.maps.places.PlacesService(this._map);

        // Given the function above, go through each location and run the search, binding it to 'this' and 'i'
        //  for context and tracking of which callback relates to which location
        for (var i = 0; i < this._locations.length; i++) {

            var location = this._locations[i];
            var request = {
                query: location.address
            };

            var boundCallback = this._buildLocationPlacesCallback.bind(this, i);

            service.textSearch(request, boundCallback);
        }
    },

    // private
    _buildLocationPlacesCallback: function(i, results, status) {

        if (status == google.maps.places.PlacesServiceStatus.OK) {

            var placeData = results[0];

            var marker = new google.maps.Marker({
                map: this._map,
                position: placeData.geometry.location,
                title: placeData.name,
                formatted_address: placeData.formatted_address
            });

            google.maps.event.addListener(marker, 'click', this._locationClicked.bind(this, i));

            this._mapBounds.extend(placeData.geometry.location);

            this._locations[i].marker = marker;
        }

        // Track our callbacks from marker creations and center / fit the map on the last one
        ++this._callbackCount;
        //if (this._callbackCount == this._locations.length) {
        if (this._callbackCount == this._locations.length) {

            // this is the last one to call back: now that we have all the pins,
            // size & center the map. If we did this for each callback, or didn't do 
            // it last, then this would be a mess. Note that we can't rely on the 
            // order of callbacks since they're async
            this._map.fitBounds(this._mapBounds);
            this._map.setCenter(this._mapBounds.getCenter());
        }

    },

    // Udacity Requirement: Add additional functionality to animate a map marker when either 
    //                     the list item associated with it or the map marker itself is selected.
    // Note that this function is used for both marker and list item selection
    _locationClicked: function(i) {

        var marker = this._locations[i].marker;

        // smoothly move the map so the selected item is in the middle
        this._map.panTo(marker.getPosition());

        //bounce the marker around a little
        this._animateMarker(marker);

        var flickrHtml = this._locations[i].flickrHtml;
        var name = this._locations[i].name;
        var address = this._locations[i].address;
        var locationDetails = document.getElementById("locationDetails");

        //NOTE: we're hitting the 3rd party API as little as needed: only on demand per item and only
        //      once: box up the results and serve them leftovers the next time
        if (flickrHtml !== null) { //PULL FROM CACHE !
            console.log("Pulling flicker html from cache for " + name + " **  not making another trip **");
            locationDetails.innerHTML = flickrHtml;
        } else { //Make a trip out to the internets. Do this only once !
            locationDetails.innerHTML = "<h1>Loading ...</h1>";
            flickr.fetch(name, address, locationDetails, (function(i, html) {
                locationDetails.innerHTML = html;
                this._locations[i].flickrHtml = html;
            }).bind(this, i));
        }
    },

    _animateMarker: function(marker) {

        window.setTimeout(function() { //kick to background thread to smooth out the display
            marker.setAnimation(google.maps.Animation.BOUNCE);
        }, 0);

        // .. and stop the bouncing after a couple seconds ...
        window.setTimeout(function() {
            marker.setAnimation(null);
        }, 2000);
    }
};
