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