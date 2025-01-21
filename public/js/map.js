
    maplibregl.accessToken=mapToken;
    const map = new maplibregl.Map({
        container: 'map', // container id
        style: `https://maps.geoapify.com/v1/styles/osm-carto/style.json?apiKey=${mapToken}`,

        center: [77.216721, 28.644800], // starting position [lng, lat]
        zoom: 7 // starting zoom
    });


    


   