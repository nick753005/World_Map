/*******************************************************************

    Sheffield Mallam    MSc Computer Science

    Web Technologies    Final Assessment

    Nicholas Daniel     April 2025

**********************************************************************/

// Leaflet
// initialize the map and set its view to geographical coordinates and zoom level
var map = L.map('map').setView([35.0, 0.0], 1);

// add a tile layer to add to the map
// must include attribution
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19,
    attribution: 'Tiles &copy; Esri'
}).addTo(map);  

var markersGroup = L.layerGroup().addTo(map);

// Create a red icon by specifying the red marker image
const redIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],     // size of the icon
    iconAnchor: [12, 41],   // point of the icon which corresponds to marker's location
    popupAnchor: [1, -34],  // point from which the popup should open relative to the iconAnchor
    tooltipAnchor: [12,-24],
    shadowSize: [41, 41]    // size of the shadow
  });


var latlng = [54.07252, -2.00980];   // My House
var max_zoom = 19;
var min_zoom = 1;

var marker = [];
var num_marker = 0;

var home_capital = [];
var capital_2 = [];
var home_latlng = [];
var latlng_2 = [];

//------------------------------------------------------------------------------
// place popup on map at position Latlng with country name

function locateCountry( latlng, country ) {

    var popup = L.popup()
        .setLatLng( latlng )
        .setContent( country )
        .openOn(map);
}
//--------------------------------------------------------------------------------------
function findNewCountry() {

    const selectElement = document.getElementById("sel_con");
    index = selectElement.value;
    const country = selectElement.options[selectElement.selectedIndex].text;

    displayCountry(index);

}
//---------------------------------------------------------------------------------
// place marker on map at position Latlng with capital tooltip

function findCapital() {

    const selectElement = document.getElementById("sel_con");
    index = selectElement.value;

    latlng = reply[index].capitalInfo.latlng;
    //console.log("Lat Lng = " + latlng);
    capital = reply[index].capital.toString();

    map.closePopup();       // if any

    if(country == "South Africa")
        capital = "Pretoria";       // just administrative capital

    // if there is no home capital, then make this the home and use red marker
    // else make this is the second capital, and use default blue marker

    if( home_capital == "" ) {
        home_capital = capital;
        home_latlng = latlng;
        marker[num_marker] = L.marker( latlng, { icon: redIcon } ).addTo(markersGroup);
    } else {
        capital_2 = capital;
        latlng_2 = latlng; 
        marker[num_marker] = L.marker( latlng ).addTo(markersGroup);      
    }

    marker[num_marker].bindTooltip(capital);
    num_marker++;

    zoom = map.getZoom();
    map.flyTo( latlng, zoom, { duration: 0.5 });  // animated zoom to capital location
   
    // if two or more capitals are marked then display the distance between them
    if( num_marker >= 2) {
        dist = haversine( home_latlng,latlng_2 );
       // dist = dist.toFixed(0);
        document.getElementById("distance").innerHTML="The distance between "+home_capital+" and "+capital_2+" is "+dist+" kms"+
            "<br>Hover over the map to view";
        console.log(home_capital +":"+home_latlng+"----"+capital_2+":"+latlng_2+" = "+dist);
        //pnt1 = latlng_1;
        //pnt2 = latlng_2;
    }

    //capital_2 = capital_1;
    //latlng_2 = latlng_1;
}
//-------------------------------------------------------------------------------
// remove tooltips and line between last markers

function mOut() {

    if(num_marker >= 2) {
        map.removeLayer(polyline);  

        marker[0].closeTooltip();
        marker[num_marker - 1].closeTooltip();  
    }
}
//-------------------------------------------------------------------------------
// show tooltips and draw line between two markers

function mOver() {
    //console.log("Mouse over");

    if(num_marker >= 2) {
        polyline = L.polyline([home_latlng, latlng_2], { color: 'blue' }).addTo(map);

        marker[0].openTooltip();
        marker[num_marker - 1].openTooltip();  

        polyline.bindTooltip(dist+" km", { permanent: true, direction: "center" });
    }
}
//--------------------------------------------------------------------------------
// return map to initial zoom and position
function resetMap() {
    map.setView([35.0 ,0.0], 1);
}
//-------------------------------------------------------------------------------------
function  zoomOutOnLatlng() {
    zoom = map.getZoom() - 2;
    if( zoom < min_zoom )
        zoom = min_zoom;

    //map.setView([62,10], 4);      // instant zoom to Norway zoom level 4
    map.flyTo( latlng, zoom, { duration: 1.5 });  // animated zoom
}

//-------------------------------------------------------------------------------------
function  zoomInOnLatlng() {
    zoom = map.getZoom() + 2;
    if( zoom > max_zoom )
        zoom = max_zoom;

    //map.setView([62,10], 4);      // instant zoom to Norway zoom level 4
    map.flyTo( latlng, zoom, { duration: 1.5 });  // animated zoom
}
//-------------------------------------------------------------------------------------
// Display information about country from reply[i]

function displayCountry(i) {
   
    //console.log(index);
   
    if( !reply.length ) {   // return if no data
        document.getElementById("api_line1").innerHTML="<strong>Sorry - Cannot find a country containing '"+
            country+"' - Please try again</strong>";
        return;
    }

    latlng = reply[i].latlng;  
    country = reply[i].name.common; 
    //map.setView( latlng, map.getZoom() );   
    map.flyTo( latlng, map.getZoom(), { duration: 0.5 });  // animated zoom 
    locateCountry( latlng, country )

    population = reply[i].population;
    if( population > 10000)
        population = Math.round(population / 1000) * 1000;     // round to the nearest 1000

    if( population >= 1000000)
        population = Math.round(population / 1000000) + "m";    // round to nearest million

    continent = reply[i].continents.toString();
    continent = continent.replace(",", " and ");         // reply could be "Europe,Asia" so replace comma with "and"

    capital = reply[i].capital;
    if(country == "South Africa")
        capital = "Pretoria";                           // just administrative capital
      
    document.getElementById("api_line1").innerHTML = country + " is a country in " + continent;
    document.getElementById("api_line2").innerHTML = "The population is " + population + " and its capital is " + capital;

    img = document.getElementById("flag");     
    img.src = reply[i].flags.png; 
    img.style.display = 'block';
    img = document.getElementById("coatOfArms");     

    if (reply[i].coatOfArms.png == undefined) {
        //console.log("The coatOfArms.png property is undefined.");
        img.style.display = 'none';
    } else {
        img.src = reply[i].coatOfArms.png; 
        img.style.display = 'block';
    }
      
    document.getElementById("capital-button").style.display = 'inline';     // make button visible
}
//---------------------------------------------------------------------------------
function removeMarkers() {

    if(num_marker) {
        for(let n = 0; n < num_marker; n++)
           map.removeLayer(marker[n]);  
    }
   
    num_marker = 0;
    document.getElementById("distance").innerHTML="";

    home_capital = [];          // clear home capital
}
//----------------------------------------------------------------------------------
// change the tile layer

function mapButClick(option) {
    //console.log("Radio Button Clicked = " + option);

    // Remove the current tile layer
    map.eachLayer(function (layer) {
        if (layer instanceof L.TileLayer) {
            map.removeLayer(layer);
        }
    });

    if(option == 1){
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
            maxZoom: 19,
            attribution: 'Tiles &copy; Esri'
        }).addTo(map);     
    }

    if(option == 2) {
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            maxZoom: 19,
            attribution: 'Tiles &copy; Esri'
        }).addTo(map);
    }
    if(option == 3) {
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
    }
}

//--------------------------------------------------------------------------------
// Calculate the distance along the surface of the earth between two points
// using the Haversine formula
// return integer formatted value 

function haversine(point1, point2) {
   
    const R = 6371;         // Earth radius in kms
    const toRadians = angle => (angle * Math.PI) / 180;
  
    const dLat = toRadians(point2[0] - point1[0]);
    const dLon = toRadians(point2[1] - point1[1]);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRadians(point1[0])) * Math.cos(toRadians(point2[0])) * Math.sin(dLon / 2) ** 2; 
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    distance = R * c;           // Distance in kms

    // format distance as d,ddd km

    //console.log("Unformatted "  + distance);

    distance = distance.toFixed(0);

    if( distance >= 1000) {
        d = (distance % 1000).toString();   // add leading zeros
        if(d.length == 1)
            d = "0" + d;
        if(d.length == 2)
            d = "0" + d;

        distance = Math.floor(distance / 1000) + "," + d;
    }
    
    //console.log("Formatted "  + distance);
    
    return(distance);
  }
  //-------------------------------------------------------------

