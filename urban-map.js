let map;
let mapview;

require([
    "esri/Map",
    "esri/views/MapView"
    ], function(Map, MapView) {
        map = new Map({
            basemap: "topo"
        });
        mapview = new MapView({
            container: "map",
            map: map,
            center: [10.947334793566274, 54.38122882484246],
            zoom: 4
        })
 });

 let basemaps = ["osm", "gray", "hybrid", "national-geographic", "satellite", "streets", "terrain", "topo"];
 let listbasemaps = document.getElementById("basemaps");
 basemaps.forEach(element => {
     let option = document.createElement("option");
     option.textContent = element;
     listbasemaps.appendChild(option);
     
 });
 document.getElementById("basemaps").addEventListener("change", function(){
    let selectedBasemap = listbasemaps.options[listbasemaps.selectedIndex].textContent;
    mapview.map.basemap = selectedBasemap;
})
 
