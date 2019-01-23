class Service{

    constructor(){
        this.url = "https://climate.discomap.eea.europa.eu/arcgis/rest/services";
        this.folderUrl = this.url + '?f=pjson';
        this.options = {responseType: "json"};
    }

    createFoldersList(listfolders, folders){
        listfolders.innerHTML = '';
        folders.forEach(element => {
            let option = document.createElement("option");
            option.textContent = element;
            listfolders.appendChild(option);
        });
    }

    createServicesList(services, serviceList, selectLabel){
        serviceList.innerHTML = '';
        serviceList.style.display = "block";
        selectLabel.style.display = "block";
        services.forEach(element => {
            let option = document.createElement("option");
            option.textContent = element.name;
            serviceList.appendChild(option);
        });
    }

    createLayersList(){
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