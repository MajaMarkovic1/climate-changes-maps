class Basemap{

    constructor(){
        this.basemaps = ["osm", "gray", "hybrid", "national-geographic", "satellite", "streets", "terrain", "topo"];
        this.listbasemaps = document.getElementById("basemaps");
    }
    
    createBasemapButtons(){
        this.basemaps.forEach(element => {
            let button = document.createElement("button");
            button.textContent = element;
            button.className = "btn";
            this.listbasemaps.appendChild(button);
            if (element === "topo"){ button.className += " active"; }
        });
    }

    selectBasemap(){
        this.listbasemaps.addEventListener("click", function(event){
            let selectedBasemap = event.target.innerHTML;
            mapview.map.basemap = selectedBasemap;
            let current = document.getElementsByClassName("active");
            current[0].className = current[0].className.replace(" active", "");
            event.target.className += " active";
        })  
    }
}
