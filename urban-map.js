let map;
let mapview;

require([
    "esri/Map",
    "esri/views/MapView",
    "esri/request",
    "esri/layers/MapImageLayer",
    "esri/widgets/Legend"
    ], function(Map, MapView, Request, MapImageLayer, Legend) {
        map = new Map({
            basemap: "topo"
        });
        mapview = new MapView({
            container: "map",
            map: map,
            center: [3.947334793566274, 54.38122882484246],
            zoom: 4
        })

        // layers

        let url = "https://climate.discomap.eea.europa.eu/arcgis/rest/services/Urban_Vulnerability?f=pjson";
        let options = {responseType: "json"};
        Request(url, options)
            .then((response) => {
                let services = response.data.services;
                let listservices = document.getElementById("services");
                services.forEach(element => {
                    let option = document.createElement("option");
                    option.textContent = element.name;
                    listservices.appendChild(option);
                });
                listservices.addEventListener("change", function(){
                    let selectedLayer = listservices.options[listservices.selectedIndex].textContent;
                    let layer = new MapImageLayer({
                        url: "https://climate.discomap.eea.europa.eu/arcgis/rest/services/" + selectedLayer + "/MapServer"
                    });
                    map.removeAll();                
                    map.add(layer);
                });
            })

        let legend = new Legend({view: mapview});
        mapview.ui.add(legend, "bottom-left");
 });

 //basemaps

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


 
