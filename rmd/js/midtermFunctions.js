/* ================================
Week 6 Assignment: Midterm Functions + Signatures
================================ */
//Leaflet Configuration
var map = L.map('map', {
  center: [39.0902, -95.7129],
  zoom: 5
});

map.options.maxZoom = 10;

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
var yesterday = (("00" + (today.getMonth() + 1)).slice(-2))+'-'+(today.getDate())+'-'+today.getFullYear();
$("#date").text(yesterday);
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

//define variables and dataset links
var dataset = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/"+yesterday+".csv";
//var dataset = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/03-26-2020.csv";
var census = "link here";
var featureGroup;

//define colors or size of the individual marker with respect to covid 19 cases
var myStyle = function(row) {
  confirmed = row[7];
  death = row[8];
  if (!!confirmed && !!death){
    if (confirmed < 100) {
      return {color: "red",
              fillColor: "#f03",
              fillOpacity: 0.1,
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
              fillOpacity: 0.3,
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
              fillOpacity: 0.4,
              radius: 4.0,
              Country: row[3],
              State: row[2],
              City: row[1],
              Confirmed: row[7],
              Death: row[8],
              Recovered: row[9],
              Active: row[10]};
    } else if (confirmed < 1500 && confirmed >= 1000) {
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
    } else if (confirmed < 2000 && confirmed >= 1500) {
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
    } else if (confirmed >= 2000) {
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
    lat = row[5];
    lng = row[6];
    //console.log(lat, lng);
    if (!!lat && !!lng) {
    return L.circleMarker([lat, lng], myStyle(row));
  }});
  return addmarker;
};

// and puts them on the map
var plotMarkers = function (marker) {
  _.each(marker, function (x){
    if (typeof(x) != "undefined") {return x.addTo(map); }
  });
};

//join the US data and the US census
var joinFunction = function(cases, census){ };

//show results
var showResults = function() {
  $('#intro').hide();
  // => <div id="results">
  $('#results').show();
};

//close results and return to original state
var closeResults = function() {
  $('#intro').show();
  $('#results').hide();
  //map.fitBounds(markers.getBounds());
  map.setView([39.0902, -95.7129], 5);
};

//change side bar information with respect to each country
var eachFeatureFunction = function(marker) {
  if (typeof(marker) != "undefined") {
    marker.on('click', function(event) {
      //console.log(event);
      //console.log(event.target.options.City);
      $(".city").text(event.target.options.City);
      $("#state").text(event.target.options.State);
      $("#confirmed").text(event.target.options.Confirmed);
      $("#death").text(event.target.options.Death);
      $("#recovered").text(event.target.options.Recovered);
      $("#active").text(event.target.options.Active);
      $("#month").text(monthNames[today.getMonth()]);
      $("#day").text(today.getDate());
      $("#year").text(today.getFullYear());
      showResults();
      //zoom in to the selected region
      bounds = event.target.getBounds();
      map.fitBounds(bounds);

    });
  }

};

//run the analysis by start the request of the dataset
$(document).ready(function() {
  $.ajax(dataset).done(function(data) {

    //parse the csv file
    var rows = data.split("\n");
    worlddata = [];
    for (var i=0;i<rows.length;i=i+1){
        worlddata.push(rows[i].split(','));}
    filtered_worlddata = _.filter(worlddata, function(row){return Number(row[7])>0;});

    //make markers and plot them
    markers = makeMarkers(filtered_worlddata);
    featureGroup = plotMarkers(markers);

    //click event for each marker
    _.each(markers, function(marker){eachFeatureFunction(marker);});
    //featureGroup.eachLayer(eachFeatureFunction);

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
