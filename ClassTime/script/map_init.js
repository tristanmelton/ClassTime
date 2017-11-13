var map;
var infowindow;

var markers = [];

var startLoc = null;
var startLocName;
var endLoc = null;
var endLocName;
var d;
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
			startLocName = place.name;
			startLoc = marker;
			flip = !flip;
		}
		else
		{
			endLocName = place.name;
			endLoc = marker;
			flip = !flip;
		}
	});
	marker.addListener('mouseover', function()
	{
		infowindow.setContent(place.name);
		infowindow.open(map, this);
	});
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
		var r = 6378137;
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

		d = r * c;// / speed / 60;
		var googDist = -1;
		var directionsService = new google.maps.DirectionsService();

		var request =
		{
			origin: startLoc.getPosition(),
			destination: endLoc.getPosition(),
			travelMode: google.maps.DirectionsTravelMode.WALKING
		};

		directionsService.route(request, function(request, status) 
		{
			if ( status === google.maps.DirectionsStatus.OK ) 
			{
				googDist = request.routes[0].legs[0].distance.value;
				if(d >=150)
					alert(googDist + " meters");
					//alert(startLocName);
					updateTable();
			}
			else 
			{
				alert("A kitten died");
			}
		});
		if(d < 150)
		{
			//alert(d.toFixed(2) + " meters");
		}
	}	
}

function updateMap()
{
	var newInfo = document.getElementById('wheretogo').value;
	initMap(newInfo);
}	

function updateTable() {
	alert(d);
	document.getElementById("startloc").innerHTML = startLocName;
	document.getElementById("dest").innerHTML = endLocName;
	document.getElementById("traveltime").innerHTML = d;
	/*
	document.getElementById("startloc").innerHTML = startLoc.place.name;
	document.getElementById("dest").innerHTML = endLoc.place.name;
	document.getElementById("traveltime").innerHTML = d
	*/
	alert(startLoc.place.name);
}