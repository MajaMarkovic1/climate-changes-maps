let map;
let mapview;
let layer;
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
        let serviceList = document.getElementById("services");
        let selectLabel = document.getElementById("select_label");
        let serviceUrl = "https://climate.discomap.eea.europa.eu/arcgis/rest/services/Urban_Vulnerability?f=pjson";
        let options = {responseType: "json"};
        Request(serviceUrl, options)
            .then((response) => {
                let services = response.data.services;
                service.createServicesList(services, serviceList, selectLabel);
                
                serviceList.addEventListener("click", function(){
                    let selectedLayer = serviceList.options[serviceList.selectedIndex].textContent;
                    layer = new MapImageLayer({
                        url: "https://climate.discomap.eea.europa.eu/arcgis/rest/services/Urban_Vulnerability/" + selectedLayer + "/MapServer"
                    });
                    map.removeAll();                
                    map.add(layer);
                    layer.when(function(){
                        mapview.goTo(layer.fullExtent).then(() => {
                            mapview.zoom = 4;
                        })
                        let citiesDiv = document.getElementById("cities");
                        citiesDiv.innerHTML = ""; 
                        document.getElementById("card").style.display = "none";
                        let layers = document.getElementById("layers");
                        layers.innerHTML = '';
                        let layerslist = layer.sublayers.items;
                        service.createLayersList(layers, layerslist);
                        layerslist.forEach(element => {
                            let layerId = element.id;
                            let queryUrl = "https://climate.discomap.eea.europa.eu/arcgis/rest/services/Urban_Vulnerability/" + selectedLayer + "/MapServer/" + layerId + "/query"
                            let queryOptions = {
                                responseType: "json",
                                query: {
                                    f: "json",
                                    where: "1=1",
                                    outSR: "4326",
                                    //orderByFields: "CITY_NAME",
                                    outFields: "*"
                                }
                            };
                            Request(queryUrl, queryOptions)
                                .then((response) => {
                                    let r = response.data.features;
                                    citiesDiv.style.display = "block";
                                    r.forEach(element => {
                                        let option = document.createElement("div");
                    
                                        let city = new City();
                                        city.createList(element, option);
                                        citiesDiv.appendChild(option);

                                        option.addEventListener("click", function(){
                                            city.setActiveClass(option);
                                            let geomType = response.data.geometryType;
                                            city.checkGeometry(element, geomType);
                                            let card = document.getElementById("card");
                                            card.innerHTML = "";
                                            Object.keys(element.attributes).forEach(function (key) {
                                                card.innerHTML += '<b>' + key + '</b>' + ": " + element.attributes[key] + "<br>"; 
                                                card.style.display = "block"; 
                                            })
                                           
                                        })
                                    });
                                    citiesDiv.innerHTML = option.innerHTML;
                                })
                        });
                    });
                });
            });           
});  
    
 //basemaps

 let basemap = new Basemap();
 basemap.createBasemapButtons();
 basemap.selectBasemap();
