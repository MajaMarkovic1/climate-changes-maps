let map;
let mapview;
let layer;
require([
    "esri/Map",
    "esri/views/MapView",
    "esri/request",
    "esri/layers/MapImageLayer",
    "esri/widgets/Legend",
    "esri/widgets/Search",
    "esri/Graphic"
    ], function(Map, MapView, Request, MapImageLayer, Legend, Search, Graphic) {
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
                serviceList.addEventListener("change", function(){
                    let selectedLayer = serviceList.options[serviceList.selectedIndex].textContent;
                
                    layer = new MapImageLayer({
                        url: "https://climate.discomap.eea.europa.eu/arcgis/rest/services/Urban_Vulnerability/" + selectedLayer + "/MapServer"
                    });
                    map.removeAll();                
                    map.add(layer);
                    layer.when(function(){
                        // mapview.goTo(layer.fullExtent);
                        mapview.goTo(layer.fullExtent).then(() => {
                            mapview.center = mapview.center;
                        })
                        
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
                                    outSR: "4326"
                                }
                            };
                            Request(queryUrl, queryOptions)
                                .then((response) => {
                                    let r = response.data.features;
                                    let citiesDiv = document.getElementById("cities");
                                    citiesDiv.innerHTML = ""; 
                                    citiesDiv.style.display = "block";
                                    r.forEach(element => {
                                        let cityName1 = element.attributes["CITY_NAME"];
                                        let cityName2 = element.attributes["name"];
                                        let cityName3 = element.attributes["URAU_NAME"];
                                        let cityName4 = element.attributes["lonely_pensioners_change_csv_CITY_NAME"];
                                        let cityName5 = element.attributes["NAME_ASCI"];
                                        let option = document.createElement("div");
                                        if (cityName1 !== undefined){
                                            option.innerHTML = cityName1;
                                        } else if (cityName2 !== undefined){
                                            option.innerHTML = cityName2;
                                        } else if(cityName3 !== undefined){
                                            option.innerHTML = cityName3;
                                        } else if(cityName4 !== undefined){
                                            option.innerHTML = cityName4;
                                        } else if(cityName5 !== undefined){
                                            option.innerHTML = cityName5; 
                                        }
                                        citiesDiv.appendChild(option);
                                        option.addEventListener("click", function(){
                                            option.style.color = "aquamarine";
                                            let geomType = response.data.geometryType;
                                            if(geomType === "esriGeometryPoint"){
                                                mapview.goTo(layer.fullExtent).then(() => {
                                                    let x = element.geometry["x"];
                                                    let y = element.geometry["y"];
                                                    mapview.center = [x,y];
                                                    mapview.zoom = 11;
                                                })
                                            } else if (geomType === "esriGeometryPolygon"){
                                                let rings = element.geometry.rings[0];
                                                rings.forEach(element => {
                                                   let x = element["0"];
                                                   let y = element["1"];
                                                   mapview.goTo(layer.fullExtent).then(() => {
                                                    mapview.center = [x,y];
                                                    mapview.zoom = 10;
                                                })
                                                });
                                            }
                                         
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
