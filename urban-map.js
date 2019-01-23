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

        let service = new Service();
        Request(service.folderUrl, service.options)
            .then((response) => {
                let folders = response.data.folders;
                let listfolders = document.getElementById("folders");
                service.createFoldersList(listfolders, folders);
                let serviceList = document.getElementById("services");
                let selectLabel = document.getElementById("select_label");
                serviceList.style.display = "none";
                selectLabel.style.display = "none";
                listfolders.addEventListener("change", function(){
                    let selectedFolder = listfolders.options[listfolders.selectedIndex].textContent;
                    let serviceUrl = service.url + '/' + selectedFolder + "?f=pjson";
                    Request(serviceUrl, service.options)
                        .then((response) => {
                            let services = response.data.services;
                            service.createServicesList(services, serviceList, selectLabel);
                            serviceList.addEventListener("change", function(){
                                let selectedLayer = serviceList.options[serviceList.selectedIndex].textContent;
                                layer = new MapImageLayer({
                                    url: service.url + '/' + selectedLayer + "/MapServer"
                                });
                                map.removeAll();                
                                map.add(layer);
                                layer.when(function(){
                                    // mapview.goTo(layer.fullExtent);
                                    service.createLayersList();
                                });
                            });
                        });
                });
            });  
    });

 //basemaps

 let basemap = new Basemap();
 basemap.createBasemapButtons();
 basemap.selectBasemap();
