var map;
var infowindow;

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

	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(place.name);
		infowindow.open(map, this);
	});
}
//TODO: FUNCTION CALL DOESN"T DO ANYTHING, NEED TO FIX
function updateMap()
{
	var newInfo = document.getElementById('textbox_id').value;
	initMap("Fowler");
}	
