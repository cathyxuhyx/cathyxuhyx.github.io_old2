/* ================================
Week 6 Assignment: Midterm Functions + Signatures
================================ */
//Leaflet Configuration
var map = L.map('map', {
  center: [35.584675, 10.114703],
  zoom: 2
});

//map.options.maxZoom = 15;

var Stamen_TonerLite = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
}).addTo(map);

//get today's date and find yesteday's date as strings
var today = new Date();
today.setDate(today.getDate() - 1);
console.log(today);
var yesterday = (("00" + (today.getMonth() + 1)).slice(-2))+'-'+(("00" + (today.getDate())).slice(-2))+'-'+today.getFullYear();
$("#date").text(yesterday);
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

//define variables and dataset links
var dataset = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/"+yesterday+".csv";
var markers;

//define colors or size of the individual marker with respect to covid 19 cases
var myStyle = function(row) {
  confirmed = row[7];
  death = row[8];
  if (!!confirmed && !!death){
    if (confirmed < 100) {
      return {color: "red",
              fillColor: "#f03",
              opacity: 0.1,
              radius: 0.5,
              Country: row[3],
              State: row[2],
              City: row[1],
              Confirmed: row[7],
              Death: row[8],
              Recovered: row[9],
              Active: row[10]};
    } else if (confirmed < 500 && confirmed >= 100) {
      return {color: "red",
              fillColor: "#f03",
              opacity: 0.3,
              radius: 1,
              Country: row[3],
              State: row[2],
              City: row[1],
              Confirmed: row[7],
              Death: row[8],
              Recovered: row[9],
              Active: row[10]};
    } else if (confirmed < 1000 && confirmed >= 500) {
      return {color: "red",
              fillColor: "#f03",
              opacity: 0.4,
              radius: 4.0,
              Country: row[3],
              State: row[2],
              City: row[1],
              Confirmed: row[7],
              Death: row[8],
              Recovered: row[9],
              Active: row[10]};
    } else if (confirmed < 5000 && confirmed >= 1000) {
      return {color: "red",
              fillColor: "#f03",
              fillOpacity: 0.5,
              radius: 7.0,
              Country: row[3],
              State: row[2],
              City: row[1],
              Confirmed: row[7],
              Death: row[8],
              Recovered: row[9],
              Active: row[10]};
    } else if (confirmed < 10000 && confirmed >= 5000) {
      return {color: "red",
              fillColor: "#f03",
              fillOpacity: 0.6,
              radius: 10,
              Country: row[3],
              State: row[2],
              City: row[1],
              Confirmed: row[7],
              Death: row[8],
              Recovered: row[9],
              Active: row[10]};
    } else if (confirmed >= 10000) {
      return {color: "red",
              fillColor: "#f03",
              fillOpacity: 0.7,
              radius: 14.0,
              Country: row[3],
              State: row[2],
              City: row[1],
              Confirmed: row[7],
              Death: row[8],
              Recovered: row[9],
              Active: row[10]};
    }
  }
};

//function to plot the locations
var makeMarkers = function (data) {
  addmarker = _.map(_.rest(data), function (row) {
    lat = Number(row[5]);
    lng = Number(row[6]);
    if (!isNaN(lat) && !isNaN(lng)) {
      return L.circleMarker([lat, lng], myStyle(row));}
});
  return addmarker;
};

// and puts them on the map
var plotMarkers = function (marker) {
  _.each(marker, function (x){
    if (typeof(x) !== "undefined") {return x.addTo(map); }
  });
};

// Remove markers
var removeMarkers = function (marker) {
  _.each(marker, function (x){
    if (typeof(x) !== "undefined") {return map.removeLayer(x);}
  });
};

//show results
var showResults = function() {
  $('#intro').hide();
  $('#USonly').hide();
  // => <div id="results">
  $('#results').show();
};

//close results and return to original state
var closeResults = function() {
  $('#intro').show();
  $('#USonly').hide();
  $('#results').hide();
  map.setView([38.8, -97.6129], 4);
};

//change side bar information with respect to each country
var eachFeatureFunction = function(marker) {
  if (typeof(marker) != "undefined") {
    marker.on('click', function(event) {
      $(".city").text(event.target.options.City);
      $(".state").text(event.target.options.State);
      $(".country").text(event.target.options.Country);
      $("#confirmed").text(event.target.options.Confirmed);
      $("#death").text(event.target.options.Death);
      $("#recovered").text(event.target.options.Recovered);
      $("#active").text(event.target.options.Active);
      $("#month").text(monthNames[today.getMonth()]);
      $("#day").text(today.getDate());
      $("#year").text(today.getFullYear());
      showResults();
      //zoom in to the selected region
      var tmp = event.target;
      map.fitBounds([[tmp._latlng.lat-0.5, tmp._latlng.lng-0.5],
        [tmp._latlng.lat+0.5, tmp._latlng.lng+0.5]]);
    });
  }

};

var notUS, US_marker;
//run the analysis by start the request of the dataset
$(document).ready(function() {
  $.ajax(dataset).done(function(data) {

    //parse the csv file
    var rows = data.split("\n");
    worlddata = [];
    for (var i=0;i<rows.length;i=i+1){
        worlddata.push(rows[i].split(','));}
    filtered_worlddata = _.filter(worlddata, function(row){
      return Number(row[7])>0;});

    //make markers and plot them
    markers = makeMarkers(filtered_worlddata);
    // find non-US markers
    var realmarkers = _.filter(markers, function(marker){
      return typeof(marker) != "undefined";});
    notUS = _.filter(realmarkers, function(marker) {
      return marker.options.Country != "US";});
    US_marker = _.filter(realmarkers, function(marker) {
      return marker.options.Country == "US";});
    plotMarkers(notUS);
    plotMarkers(US_marker);

    //click event for each marker
    _.each(markers, function(marker){eachFeatureFunction(marker);});

    //see the highest number of cases cities in the US
    filtered = _.filter(worlddata, function(row){return row[3]=='US';} );

    colCounts = _.sortBy(filtered, function(row){return Number(row[7]);}).reverse();
    //console.log(colCounts);
    $("#Top1").text(colCounts[0][1]+", "+colCounts[0][2]+", "+colCounts[0][7]);
    $("#Top2").text(colCounts[1][1]+", "+colCounts[1][2]+", "+colCounts[1][7]);
    $("#Top3").text(colCounts[2][1]+", "+colCounts[2][2]+", "+colCounts[2][7]);
    $("#Top4").text(colCounts[3][1]+", "+colCounts[3][2]+", "+colCounts[3][7]);
    $("#Top5").text(colCounts[4][1]+", "+colCounts[4][2]+", "+colCounts[4][7]);


  });
});
$("button").click(function() {closeResults();});


//US only results:
var US_only = function(){
  $('#intro').hide();
  $('#USonly').show();
  $('#results').hide();
  map.setView([38.8, -97.6129], 4);
};

//button to return to the world
$("button#world").click(function() {
  $('#intro').show();
  $('#USonly').hide();
  $('#results').hide();
  map.setView([35.584675, 10.114703],2);
  //removeMarkers
  var realmarkers = _.filter(markers, function(marker){
    return typeof(marker) != "undefined";});
  notUS = _.filter(realmarkers, function(marker) {
    return marker.options.Country != "US";});
  plotMarkers(notUS);

  //remove legend
  if (typeof(cens_pop) !== "undefined"){
    map.removeLayer(cens_pop);
    $('.legend#pop').hide();
  }
  if (typeof(elder_pop) !== "undefined"){
    map.removeLayer(elder_pop);
    $('.legend#elder').hide();
  }
});

//query and display census data
//styling function for total population
var censusstyle1 = function(feature) {
    return feature.properties.B00001_001E > 500000 ? {fillColor: "#0c2c84"}
      : feature.properties.B00001_001E > 24000 ? {fillColor: "#225ea8"}
      : feature.properties.B00001_001E > 9000 ? {fillColor: "#1d91c0"}
      : feature.properties.B00001_001E > 3800 ? {fillColor: "#41b6c4"}
      : feature.properties.B00001_001E > 2000 ? {fillColor: "#7fcdbb"}
      : feature.properties.B00001_001E > 1200 ? {fillColor: "#c7e9b4"}
      : {fillColor: "#ffffcc"};
  };

//styling function for elder population density
var censusstyle = function(feature) {
    return feature.properties.DP05_0024PE > 45 ? {fillColor: "#BD0026"}
      : feature.properties.DP05_0024PE > 35 ? {fillColor: "#E31A1C"}
      : feature.properties.DP05_0024PE > 25 ? {fillColor: "#FC4E2A"}
      : feature.properties.DP05_0024PE > 15 ? {fillColor: "#FD8D3C"}
      : feature.properties.DP05_0024PE > 5 ? {fillColor: "#FEB24C"}
      : {fillColor: "#FFF"};
  };

//population counts
var cens_pop;
$("button#population").click(function() {
  $('.legend#pop').show();
  census(
    {
      vintage: "2018",
      geoHierarchy: {
        county: "*"
      },
      geoResolution: "20m", // required,
      sourcePath: ["acs", "acs5"],
      values: ["B00001_001E"], // population count
    }, function(error, response) {
          cens_pop = L.geoJson(response.features, {
        weight: 0.5, color: 'white', fillOpacity: 0.4, style: censusstyle1});
          cens_pop.addTo(map);
    }
  );

  // //make markers and plot them
  // markers = makeMarkers(filtered_worlddata);
  // featureGroup = plotMarkers(markers);
  US_only();
});

//old ppl population counts
var elder_pop;
$("button#elder").click(function() {
  $('.legend#elder').show();
  US_only();
  census(
    {
      vintage: "2018",
      geoHierarchy: {
        county: "*"
      },
      geoResolution: "20m", // required,
      sourcePath: ["acs", "acs5","profile"],
      values: ["DP05_0024PE"], // elders population count
    }, function(error, response) {
          elder_pop = L.geoJson(response.features, {
        weight: 0.5, color: 'white', fillOpacity: 0.4, style: censusstyle});
          elder_pop.addTo(map);
    }
  );

});

$("button#clear").click(function() {
  US_only();
  if (typeof(cens_pop) !== "undefined"){
    map.removeLayer(cens_pop);
    $('.legend#pop').hide();
  }
  if (typeof(elder_pop) !== "undefined"){
    map.removeLayer(elder_pop);
    $('.legend#elder').hide();
  }
});

$("button#USresult").click(function() {
  removeMarkers(notUS);
  //plotMarkers(US_marker);
  US_only();
});
