let map;
let mapview;
let layer;
let Graphic;
require([
    "esri/Map",
    "esri/views/MapView",
    "esri/request",
    "esri/layers/MapImageLayer",
    "esri/widgets/Legend",
    "esri/widgets/Search"
    ], function(Map, MapView, Request, MapImageLayer, Legend, Search) {
        map = new Map({
            basemap: "topo"
        });
        mapview = new MapView({
            container: "map",
            map: map,
            center: [3.947334793566274, 54.38122882484246],
            zoom: 4
        })
        
        let legend = new Legend({view: mapview});
        mapview.ui.add(legend, "bottom-left");
        let search = new Search({view: mapview});
        mapview.ui.add(search, "top-left");

        // layers

        let url = "https://climate.discomap.eea.europa.eu/arcgis/rest/services?f=pjson";
        let options = {responseType: "json"};
        Request(url, options)
            .then((response) => {

                // folders

                let folders = response.data.folders;
                let listfolders = document.getElementById("folders");
                
                createFoldersList(listfolders, folders);

                let service = document.getElementById("services");
                let select_label = document.getElementById("select_label");
                service.style.display = "none";
                select_label.style.display = "none";
                
                listfolders.addEventListener("click", function(){
                    let selectedFolder = listfolders.options[listfolders.selectedIndex].textContent;
                    let folderUrl = "https://climate.discomap.eea.europa.eu/arcgis/rest/services/" + selectedFolder + "?f=pjson";
                    Request(folderUrl, options)
                        .then((response) => {

                            //services

                            let services = response.data.services;
                            createServicesList(service, services);
                            service.addEventListener("click", function(){

                                // adding layers

                                let selectedLayer = service.options[service.selectedIndex].textContent;
                                layer = new MapImageLayer({
                                    url: "https://climate.discomap.eea.europa.eu/arcgis/rest/services/" + selectedLayer + "/MapServer"
                                });
                                map.removeAll();                
                                map.add(layer);
                                layer.when(function(){
                                    // mapview.goTo(layer.fullExtent);
                                    createLayersList(layer);
                                });
                            });
                        });
                });
            });
            
    });

 //basemaps

let basemaps = ["osm", "gray", "hybrid", "national-geographic", "satellite", "streets", "terrain", "topo"];
let listbasemaps = document.getElementById("basemaps");

createBasemapButtons();
chooseBasemap();

function createBasemapButtons(){
    basemaps.forEach(element => {
        let button = document.createElement("button");
        button.textContent = element;
        button.className = "btn btn-primary";
        listbasemaps.appendChild(button);
    });
}

function chooseBasemap(){
    listbasemaps.addEventListener("click", function(event){
        let selectedBasemap = event.target.innerHTML;
        mapview.map.basemap = selectedBasemap;
    })
}

let createFoldersList = function(listfolders, folders){
    listfolders.innerHTML = '';
    folders.forEach(element => {
        let option = document.createElement("option");
        option.textContent = element;
        listfolders.appendChild(option);
    });
}

let createServicesList = function(service, services){
    service.innerHTML = '';
    service.style.display = "block";
    select_label.style.display = "block";
    services.forEach(element => {
        let option = document.createElement("option");
        option.textContent = element.name;
        service.appendChild(option);
    });
}

let createLayersList = function(layer){
    let layers = document.getElementById("layers");
    layers.innerHTML = '';
    let layerslist = layer.sublayers.items;
    layerslist.forEach(element => {
        let div = document.createElement("div");
        let checkbox = document.createElement("input");
        let label = document.createElement("label");
        checkbox.type = "checkbox";
        checkbox.value = element.id;
        checkbox.checked = element.visible;
        label.textContent = element.title;
        layers.appendChild(div);
        div.appendChild(checkbox);
        div.appendChild(label);
        showLayer(checkbox, layer);
    });
}

let showLayer = function(checkbox, layer){
    checkbox.addEventListener("click", function(e){
        let clickedLayer = layer.findSublayerById(Number(e.target.value));
        clickedLayer.visible = e.target.checked;
    })
}

