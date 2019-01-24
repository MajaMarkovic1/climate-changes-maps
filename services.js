class Service{

    createServicesList(services, serviceList, selectLabel){
        serviceList.innerHTML = '';
        services.forEach(element => {
            let option = document.createElement("option");
            option.textContent = element.name.substring(20);
            serviceList.appendChild(option);
        });
    }

    createLayersList(layers, layerslist){
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
            this.showLayer(checkbox, layer);
        });
    }

    showLayer(checkbox){
        checkbox.addEventListener("click", function(e){
            let clickedLayer = layer.findSublayerById(Number(e.target.value));
            clickedLayer.visible = e.target.checked;
        }) 
    }
}