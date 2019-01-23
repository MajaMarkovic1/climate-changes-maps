class Basemap{

    constructor(){
        this.basemaps = ["osm", "gray", "hybrid", "national-geographic", "satellite", "streets", "terrain", "topo"];
        this.listbasemaps = document.getElementById("basemaps");
    
    }
    
    createBasemapButtons(){
        this.basemaps.forEach(element => {
            let button = document.createElement("button");
            button.textContent = element;
            button.className = "btn btn-primary";
            this.listbasemaps.appendChild(button);
        });
    }

    selectBasemap(){
        this.listbasemaps.addEventListener("click", function(event){
            let selectedBasemap = event.target.innerHTML;
            mapview.map.basemap = selectedBasemap;
        })
    }
}