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

                // folders

                let folders = response.data.folders;
                let listfolders = document.getElementById("folders");
                listfolders.innerHTML = '';
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

                            //services

                            let services = response.data.services;
                            service.innerHTML = '';
                            service.style.display = "block";
                            select_label.style.display = "block";
                            services.forEach(element => {
                                let option = document.createElement("option");
                                option.textContent = element.name;
                                service.appendChild(option);
                            });
                            service.addEventListener("change", function(){

                                // sublayers

                                let selectedLayer = service.options[service.selectedIndex].textContent;
                                layer = new MapImageLayer({
                                    url: "https://climate.discomap.eea.europa.eu/arcgis/rest/services/" + selectedLayer + "/MapServer"
                                });
                                map.removeAll();                
                                map.add(layer);
                                layer.when(function(){
                                    // mapview.goTo(layer.fullExtent);
                                    let layers = document.getElementById("layers");
                                    layers.innerHTML = '';
                                    for (let i = 0; i < layer.sublayers.length; i++) {
                                        let sublayer = layer.sublayers.items[i];
                                        let div = document.createElement("div");
                                        let checkbox = document.createElement("input");
                                        let label = document.createElement("label");
                                        checkbox.type = "checkbox";
                                        checkbox.value = sublayer.id;
                                        checkbox.checked = sublayer.visible;
                                        label.textContent = sublayer.title;
                                        layers.appendChild(div);
                                        div.appendChild(checkbox);
                                        div.appendChild(label);
                                        checkbox.addEventListener("click", function(e){
                                            let clickedLayer = layer.findSublayerById(Number(e.target.value));
                                            clickedLayer.visible = e.target.checked;
                                        })
                                    };
                                   
                                });
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
     let button = document.createElement("button");
     button.textContent = element;
     button.className = "btn btn-primary";
     listbasemaps.appendChild(button);
     
 });
 document.getElementById("basemaps").addEventListener("click", function(event){
    let selectedBasemap = event.target.innerHTML;
    mapview.map.basemap = selectedBasemap;
})


 
