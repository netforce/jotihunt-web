////////////////////////////////////////////////////////////////////////////////
//
// Initialization
//

var map = null;

function run()
{
  refreshVossenlocaties();
//  addDeelgebieden();

  var mapOptions = { center: { lat: 52.0417576, lng: 5.6198443 }
                   , zoom: 13
                   , disableDefaultUI: true
                   };
  map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
}
$(window).load(run);

////////////////////////////////////////////////////////////////////////////////
//
// addDeelgebieden 
//

//function addDeelgebieden()
//{
//  var ctaLayer = new.google.maps.KmlLayer({url: 'http://jotihunt.net/kml.php?v=2.23'});
//  ctaLayer.setMap(map);
//}


////////////////////////////////////////////////////////////////////////////////
//
// Vossenlocaties
//

function refreshVossenlocaties()
{
  var vossenlocaties = new VossenlocatiesCollection();
  vossenlocaties.fetch(
    { success: function(collection, response, options)
      {
        for (var i = 0; i < collection.length; ++i)
        {
          var obj = collection.at(i);
          var latlng = obj.get('coordinaat').split(',');
          latlng = new google.maps.LatLng(parseFloat(latlng[0]), parseFloat(latlng[1]));

          var marker = new google.maps.Marker(
            { position: latlng
            , map: map
            , title: obj.get('adres') || 'Vos'
            });
        }
      }
    , error: function(collection, response, options)
      {
        console.error(response.status + ": " + response.responseText);
      }
    });
}
