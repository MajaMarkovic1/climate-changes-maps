let map;
let mapview;
let layer;

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

        let url = "https://climate.discomap.eea.europa.eu/arcgis/rest/services?f=pjson";
        let options = {responseType: "json"};
        Request(url, options)
            .then((response) => {
                let folders = response.data.folders;
                let listfolders = document.getElementById("folders");
                folders.forEach(element => {
                    let option = document.createElement("option");
                    option.textContent = element;
                    listfolders.appendChild(option);
                });
                let service = document.getElementById("services");
                let select_label = document.getElementById("select_label");
                service.style.display = "none";
                select_label.style.display = "none";
                
                listfolders.addEventListener("change", function(){
                    let selectedFolder = listfolders.options[listfolders.selectedIndex].textContent;
                    let folderUrl = "https://climate.discomap.eea.europa.eu/arcgis/rest/services/" + selectedFolder + "?f=pjson";
                    Request(folderUrl, options)
                        .then((response) => {
                            let services = response.data.services;
                            service.innerHTML = '';
                            service.style.display = "block";
                            select_label.style.display = "block";
                            services.forEach(element => {
                                let option = document.createElement("option");
                                option.textContent = element.name;
                                service.appendChild(option);
                            
                            });
                        });
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


 
