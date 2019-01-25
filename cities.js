class City {

    createList(element, option){
        let cityNames = [
            "CITY_NAME",
            "name",
            "URAU_NAME",
            "NAME_ASCI",
            "lonely_pensioners_change_csv_CITY_NAME",
            "city_name",
            "CITIES_TIM",
            "lonely_pensioners_most_recent_csv_CITY_ME"
        ];
        cityNames.forEach(el => {
            Object.keys(element.attributes).forEach(function(key){
                if(el === key){
                    option.innerHTML = element.attributes[el];
                }
            })
        });
        option.className = "option";
    }

    setActiveClass(option){
        let current = document.getElementsByClassName("option active");
        if(current.length > 0){
            current[0].className = current[0].className.replace(" active", "");
            option.className += " active";      
        } else {
            let current = document.getElementsByClassName("option");
            option.className += " active";                                                
        }
    }

    checkGeometry(element, geomType){
        if(geomType === "esriGeometryPoint"){
            let x = element.geometry["x"];
            let y = element.geometry["y"];
            mapview.goTo(layer.fullExtent).then(() => {
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
    }
}