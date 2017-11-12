var map;
var infowindow;

var markers = [];

var startLoc = null;
var endLoc = null;

var flip = false;

function initMap(dName) 
{
	var ucla = {lat: 34.0689, lng: -118.4452};

	map = new google.maps.Map(document.getElementById('map'), 
	{
		center: ucla,
		zoom: 15
	});
	
	//var input = document.getElementById('pac-input');
	//var searchBox = new google.maps.places.SearchBox(input);
	//map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

	infowindow = new google.maps.InfoWindow();
	var service = new google.maps.places.PlacesService(map);
	service.nearbySearch({
		location: ucla,
		radius: 1000,
		name: dName
	}, callback);
}

function callback(results, status) 
{
	if (status === google.maps.places.PlacesServiceStatus.OK) 
	{
		for (var i = 0; i < results.length; i++) 
		{
			createMarker(results[i]);
		}	
	}
}


function createMarker(place) 
{
	var placeLoc = place.geometry.location;
	var marker = new google.maps.Marker({
		map: map,
		position: place.geometry.location
	});
	
	markers.push(marker);
	
	google.maps.event.addListener(marker, 'click', function() 
	{
		if(!flip)
		{
			startLoc = marker;
			flip = !flip;
		}
		else
		{
			endLoc = marker;
			flip = !flip;
		}
	});
	marker.addListener('mouseover', function()
	{
		infowindow.setContent(place.name);
		infowindow.open(map, this);
	});
	marker.addListener('mouseout', function()
	{
		infowindow.setContent(place.name);
		infowindow.open(map, this);
	});
// assuming you also want to hide the infowindow when user mouses-out
marker.addListener('mouseout', function() {
    infowindow.close();
});

}
function calculateDistance()
{
	if(startLoc === null || endLoc === null)
	{
		alert("Start and end positions cannot be nothing!!!");
	}
	else
	{
		var ddl = document.getElementById("speedselect");
		var speed = ddl.options[ddl.selectedIndex].value;
		
		var toRad = Math.PI / 180;
		var r = 6371e3;
		var lat1 = startLoc.position.lat() * toRad;
		var long1 = startLoc.position.lng();
		var lat2 = endLoc.position.lat() * toRad;
		var long2 = endLoc.position.lng();
		
		var dlat = (lat2 - lat1);
		var dlong = (long2 - long1) * toRad;
		
		var a = Math.sin(dlat/2) * Math.sin(dlat/2) +
        Math.cos(lat1) * Math.cos(lat2) *
        Math.sin(dlong/2) * Math.sin(dlong/2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

		var d = r * c / speed / 60;
		alert(d.toFixed(2) + " minutes");
	}	
}

function updateMap()
{
	var newInfo = document.getElementById('wheretogo').value;
	initMap(newInfo);
}	
