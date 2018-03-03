document.addEventListener("DOMContentLoaded", function(e) {
    document.body.classList.remove('fade');
});


// DEFINING ALL MAP CONTAINER SVG VARIABLES IN D3
var svg1 = d3.select("#graph1");
var svg2 = d3.select("#graph2");
var svg3 = d3.select("#graph3");
var svg4 = d3.select("#graph4");
var svg5 = d3.select("#graph5");


// DEFINING VARIABLES AND SCALES
var projection = d3.geoEquirectangular().scale(75);
var pathGenerator = d3.geoPath().projection(projection);

var happinessColors = ['#cc0000', '#ffff00', '#329932']
var percentScale = d3.scaleLinear().domain([5.19, 6.36, 7.53]).range(happinessColors);

var countries;
var atlas;


// function to handle any row-by-row processing on CSV
var parseRow = function(row) {
    return row;
}


// GENERAL HELPERS!
var areaScale = d3.scalePow().
exponent([0.5]);

// Since attr modification takes in a string, we must transform each scale value
// into a string such that .attr("transform", to_string_scale(value)) is in
// an acceptable format
var to_string_scale = function(variable) {
    return "scale(" + variable + ", " + variable + ")";
};

// Transforms x and y coordinates into a translate function string input
// so that it is compatible with a .attr call
var to_string_x_y = function(x, y) {
    return "translate(" + x + "," + y + ")";
};

// Concatenates the transform functions into one, else overwriting will occur
var transformHelper = function(x, y, imageHelperUsed, dataPoint) {
    return to_string_x_y(x, y) + " " + imageHelperUsed(dataPoint);
};



// DEFINING ALL IMAGE MAKING FUNCTIONS FOR HEALTH, CORRUPTION, EDUCATION , PILLS


//HEALTH

//Constant to resize image
var healthImageConstant = .00004;

//Quantile scale based on data values
var healthPercentileScale = d3.scaleQuantile()
    .domain([438.7428921, 1277.69566, 2933.400094, 3735.9829, 6905.530344])
    .range([1, 2, 4, 8]);

//Makes linear scale using resizing constant and quantile scale
var linearHealthScale = function(health) {
    return healthImageConstant * healthPercentileScale(health)
};

var healthImageHelper = function(healthData) {
    return to_string_scale(areaScale(linearHealthScale(healthData)));
};

//Generates image for the map SVG
var healthGeneratorMap = function(d) {
    var image = svg1.append("g")
        .attr("transform", transformHelper(projection(d.coordinates)[0],
            projection(d.coordinates)[1],
            healthImageHelper, d.health));
    healthImageManipulator(image);
}

//Generates image for the map key SVG such that images are proportional to map sizing.
var healthGeneratorKey = function(arrInput, svgInput) {
    var image = d3.select(svgInput).append("g")
        .attr("transform", transformHelper(arrInput[0],
            arrInput[1],
            healthImageHelper, arrInput[2]));
    var adjustedimage = image.append("g")
        .attr("transform", "scale(" + ((45 / 8) * (1200 / 240)) + "," + ((45 / 8) * (1200 / 240)) + ")");
    healthImageManipulator(adjustedimage);
}

//Generates image for the circle key SVG 
var healthGeneratorKeyCircle = function(arrInput, svgInput) {
    var image = d3.select(svgInput).append("g")
        .attr("transform", transformHelper(arrInput[0],
            arrInput[1],
            healthImageHelper, arrInput[2]));
    var adjustedimage = image.append("g")
        .attr("transform", "scale(" + (13) + "," + (13) + ")");
    healthImageManipulator(adjustedimage);
}

//This function is called in the image generators for map, map key and circle key. Centers around 0,0 and creates the image.
var healthImageManipulator = function(image) {

    var innerimage = image.append("g")
        .attr("transform", "translate(-204, -188)")
        .attr("opacity", "0.75");

    innerimage.append("path")
        .attr("d", "M245.685,215.694c31.903-30.012,71.505-67.284,76.951-100.446     c3.818-23.446,0.094-42.781-11.094-57.462c-11.298-14.819-28.459-23.275-52.512-25.852c-2.312-0.232-4.423-0.342-6.518-0.342     c-17.022,0-34.186,6.331-47.376,17.039c-13.173-10.708-30.352-17.039-47.341-17.039c-2.114,0-4.208,0.109-6.536,0.342     c-24.054,2.576-41.23,11.032-52.513,25.852C87.559,72.467,83.833,91.802,87.65,115.248     c5.447,33.178,45.048,70.435,76.953,100.446c0,0,15.921,15.983,20.699,20.08c3.604,3.088,11.395,9.295,19.849,9.295     c8.442,0,16.248-6.207,19.833-9.295C229.763,231.677,245.685,215.694,245.685,215.694z")
        .style("fill", "blue");

    innerimage.append("path")
        .attr("d", "M148.829,267.338c-1.736-1.334-15.503-11.746-53.69-14.293c-2.096-0.17-4.223-1.66-6.086-2.9     c-0.454-0.303-0.911-0.611-1.367-0.922c-1.924-1.316-3.816-2.73-5.275-4.463c-2.915-3.492-6.22-6.426-8.998-10.305     c-18.558-25.883-36.76-31.066-39.479-32.105c-3.614-1.736-6.082-2.244-6.887-4.717c-0.327-1.148-3.477-31.205-4.038-36.25     c-1.564-14.494-3.117-25.232-11.42-28.148c-2.14-0.762-3.662-0.512-5.243,1.178c-1.896,1.988-3.011,12.51-3.556,19.166     c0,0-3.128,38.89-2.76,52.373s23.699,67.345,36.2,79.914s70.358,45.453,70.358,45.453c2.081,1.736,13.642,10.629,13.642,22.299     v13.152c0,0-1.649,12.17,11.686,12.17s31.834,0.053,45.001,0.053s10.598-11.891,10.608-16.057     c0.008-2.965,0.014-5.328,0.017-6.451c0.001-0.455,0.001-0.711,0.001-0.711c0.157-4.299,0.887-8.566,1.399-12.834     c1.458-4.887,0.295-14.121-0.389-17.705C180.731,290.368,151.961,269.776,148.829,267.338z")
        .style("fill", "#DEC8AE");

    innerimage.append("path")
        .attr("d", "M407.497,153.579c-0.545-6.656-1.66-17.178-3.556-19.166c-1.581-1.689-3.103-1.939-5.243-1.178     c-8.304,2.916-9.856,13.654-11.42,28.148c-0.561,5.045-3.711,35.102-4.038,36.25c-0.805,2.473-3.273,2.98-6.887,4.717     c-2.719,1.039-20.921,6.223-39.479,32.105c-2.778,3.879-6.083,6.813-8.998,10.305c-1.459,1.732-3.351,3.146-5.275,4.463     c-0.456,0.311-0.913,0.619-1.367,0.922c-1.864,1.24-3.99,2.73-6.086,2.9c-38.187,2.547-51.954,12.959-53.69,14.293     c-3.132,2.438-31.902,23.029-39.724,57.896c-0.684,3.584-1.847,12.818-0.389,17.705c0.512,4.268,1.242,8.535,1.399,12.834     c0,0,0,0.256,0.001,0.711c0.003,1.123,0.009,3.486,0.017,6.451c0.011,4.166-2.559,16.057,10.608,16.057     s31.666-0.053,45.001-0.053s11.686-12.17,11.686-12.17v-13.152c0-11.67,11.561-20.563,13.642-22.299     c0,0,62.396-35.971,70.358-45.453s34.675-66.764,36.2-79.914S407.497,153.579,407.497,153.579z")
        .style("fill", "#DEC8AE");
}





//CORRUPTION

//Constant to resize image
var corruptionImageConstant = .00001;

//Makes linear scale using resizing constant and quantile scale
var linearCorruptionScale = function(corruption) {
    return corruptionImageConstant * corruptionPercentileScale(corruption)
};

//Quantile scale based on data values
var corruptionPercentileScale = d3.scaleQuantile()
    .domain([41, 57.5, 70, 81, 90])
    .range([1, 2, 4, 8]);

var corruptionImageHelper = function(corruptionData) {
    return to_string_scale(areaScale(linearCorruptionScale(corruptionData)));
};

//Generates image for the map SVG
var corruptionGeneratorMap = function(d) {
    var image = svg2.append("g")
        .attr("transform", transformHelper(projection(d.coordinates)[0],
            projection(d.coordinates)[1],
            corruptionImageHelper, d.corruption));
    corruptionImageManipulator(image);
}

//Generates image for the map key SVG such that images are proportional to map sizing.
var corruptionGeneratorKey = function(arr, svg) {

    var image = d3.select(svg).append("g")
        .attr("transform", transformHelper(arr[0],
            arr[1],
            corruptionImageHelper, arr[2]));
    var adjustedimage = image.append("g")
        .attr("transform", "scale(" + ((45 / 8) * (1200 / 240)) + "," + ((45 / 8) * (1200 / 240)) + ")");
    corruptionImageManipulator(adjustedimage);
}

//Generates image for the circle key SVG
var corruptionGeneratorKeyCircle = function(arr, svg) {

    var image = d3.select(svg).append("g")
        .attr("transform", transformHelper(arr[0],
            arr[1],
            corruptionImageHelper, arr[2]));
    var adjustedimage = image.append("g")
        .attr("transform", "scale(" + (10) + "," + (10) + ")");
    corruptionImageManipulator(adjustedimage);
}

//This function is called in the image generators for map, map key and circle key. It centers around 0,0 and creates the image.
var corruptionImageManipulator = function(image) {
    var innerimage = image.append("g")
        .attr("transform", "translate(-256, -256)")
        .attr("opacity", "0.9");

    innerimage.append("circle")
        .attr("r", 300)
        .attr("cx", 256)
        .attr("cy", 256)
        .style("fill", "#445280")

    innerimage.append("path")
        .attr("d", "M291.07,131.992l-2.529,2.518L169.433,253.618l-23.96,23.959L36.031,387.02  c-8.714-14.597-16.018-30.135-21.713-46.435c-5.078-14.493-8.882-29.581-11.285-45.129L226.265,72.223l2.518-2.518  c10.48-10.48,27.481-10.47,37.961,0.01l24.315,24.315C301.55,104.511,301.55,121.511,291.07,131.992z")
        .style("fill", "#D8874E");

    innerimage.append("path")
        .attr("d", "M145.474,277.577L36.031,387.02c-8.714-14.597-16.018-30.135-21.713-46.435l75.588-75.588  l2.529-2.518c10.48-10.48,27.481-10.47,37.961,0.01L145.474,277.577z")
        .style("fill", "#F7A15F");

    innerimage.append("path")
        .attr("d", "M334.946,204.586c-31.809,31.809-63.619,63.619-95.427,95.427  C163.359,259.69,101.077,197.407,60.754,121.249c31.809-31.809,63.619-63.619,95.427-95.427  C232.34,66.145,294.622,128.427,334.946,204.586z")
        .style("fill", "#FDD36E");

    innerimage.append("path")
        .attr("d", "M356.356,206.2l-0.866-0.866c-5.88-5.88-15.412-5.88-21.292,0l-93.931,93.931   c-5.88,5.88-5.88,15.412,0,21.292l0.866,0.866c5.88,5.88,15.412,5.88,21.292,0l93.931-93.931   C362.236,221.613,362.236,212.08,356.356,206.2z")
        .style("fill", "#F7A15F");

    innerimage.append("path")
        .attr("d", "M155.433,5.278l-0.866-0.866c-5.88-5.88-15.412-5.88-21.292,0l-93.931,93.93   c-5.88,5.88-5.88,15.412,0,21.292l0.866,0.866c5.88,5.88,15.412,5.88,21.292,0l93.931-93.931   C161.312,20.69,161.312,11.157,155.433,5.278z")
        .style("fill", "#F7A15F");

    innerimage.append("path")
        .attr("d", "M263.838,275.682l-24.323,24.323C163.36,259.685,101.075,197.4,60.757,121.247L85.08,96.924  C134.531,163.944,196.816,226.23,263.838,275.682z")
        .style("fill", "#FBB659");

    innerimage.append("path")
        .attr("d", "M294.921,288.914l-32.503,32.503c-5.873,5.873-15.412,5.882-21.287,0.007l-0.871-0.871   c-5.882-5.882-5.874-15.42,0-21.294l32.503-32.503c-5.882,5.882-5.882,15.412,0,21.294l0.871,0.871   C279.509,294.796,289.041,294.796,294.921,288.914z")
        .style("fill", "#D8874E");

    innerimage.append("path")
        .attr("d", "M94.005,87.998L61.503,120.5c-5.873,5.873-15.42,5.873-21.294,0l-0.871-0.871   c-5.874-5.874-5.874-15.42,0-21.294L71.84,65.832c-5.882,5.882-5.873,15.42,0,21.294l0.871,0.871   C78.585,93.872,88.124,93.879,94.005,87.998z")
        .style("fill", "#D8874E");

    innerimage.append("path")
        .attr("d", "M412.915,458.282C369.584,491.959,315.134,512,256.003,512s-113.58-20.041-156.912-53.718H412.915z")
        .style("fill", "#D6D6D6");

    innerimage.append("path")
        .attr("d", "M176.894,472.064v26.248c0,0.428,0.021,0.846,0.063,1.254c-28.463-9.226-54.742-23.312-77.866-41.284  h91.596C183.069,458.282,176.894,464.447,176.894,472.064z")
        .style("fill", "#BCBCBC");

    innerimage.append("path")
        .attr("d", "M410.405,442.042v16.238H102.139v-16.238c0-12.654,10.261-22.915,22.915-22.915H387.5  C400.154,419.127,410.405,429.388,410.405,442.042z")
        .style("fill", "#D63072");

    innerimage.append("path")
        .attr("d", "M410.405,442.042v16.238H161.698v-16.238c0-12.654,10.261-22.915,22.915-22.915H387.5  C400.154,419.127,410.405,429.388,410.405,442.042z")
        .style("fill", "#F43F7E");

    innerimage.append("path")
        .attr("d", "M356.048,349.224c-2.773,0-5.461-1.475-6.884-4.08c-2.075-3.798-0.678-8.56,3.119-10.635   l52.737-28.815c3.799-2.076,8.56-0.678,10.635,3.119c2.075,3.798,0.678,8.56-3.119,10.635l-52.737,28.815   C358.606,348.914,357.317,349.224,356.048,349.224z")
        .style("fill", "#4D65A3");

    innerimage.append("path")
        .attr("d", "M403.895,393.805c-0.289,0-0.581-0.016-0.875-0.049l-44.038-4.893   c-4.302-0.478-7.401-4.353-6.923-8.654c0.479-4.302,4.357-7.399,8.654-6.923l44.038,4.893c4.302,0.479,7.401,4.353,6.924,8.654   C411.228,390.841,407.835,393.805,403.895,393.805z")
        .style("fill", "#4D65A3");

    innerimage.append("path")
        .attr("d", "M330.484,320.408c-1.815,0-3.637-0.627-5.119-1.906c-3.276-2.83-3.637-7.778-0.809-11.053   l30.99-35.883c2.83-3.276,7.776-3.637,11.054-0.809c3.276,2.83,3.637,7.778,0.809,11.053l-30.99,35.883   C334.87,319.488,332.683,320.408,330.484,320.408z")
        .style("fill", "#4D65A3");
}





//EDUCATION

//Constant to resize image
var educationImageConstant = .00002;

//Makes linear scale using resizing constant and quantile scale
var linearEducationScale = function(education) {
    return educationImageConstant * educationPercentileScale(education)
};

//Quantile scale based on data values
var educationPercentileScale = d3.scaleQuantile()
    .domain([10.2, 18.15, 26.3, 30.35, 47.6])
    .range([1, 2, 4, 8]);

var educationImageHelper = function(educationData) {
    return to_string_scale(areaScale(linearEducationScale(educationData)));
};

//Generates image for the map SVG
var educationGeneratorMap = function(d) {
    var image = svg3.append("g")
        .attr("transform", transformHelper(projection(d.coordinates)[0],
            projection(d.coordinates)[1],
            educationImageHelper, d.education));
    educationImageManipulator(image);
}

//Generates image for the map key SVG such that images are proportional to map sizing.
var educationGeneratorKey = function(arr, svg) {

    var image = d3.select(svg).append("g")
        .attr("transform", transformHelper(arr[0],
            arr[1],
            educationImageHelper, arr[2]));
    var adjustedimage = image.append("g")
        .attr("transform", "scale(" + ((45 / 8) * (1200 / 240)) + "," + ((45 / 8) * (1200 / 240)) + ")");
    educationImageManipulator(adjustedimage);
}

//Generates image for the circle key SVG
var educationGeneratorKeyCircle = function(arr, svg) {

    var image = d3.select(svg).append("g")
        .attr("transform", transformHelper(arr[0],
            arr[1],
            educationImageHelper, arr[2]));
    var adjustedimage = image.append("g")
        .attr("transform", "scale(" + (13) + "," + (13) + ")");
    educationImageManipulator(adjustedimage);
}

//This function is called in the image generators for map, map key and circle key. It centers around 0,0 and creates the image.
var educationImageManipulator = function(image) {


    var innerimage = image.append("g")
        .attr("transform", "translate(-256, -185)")
        .attr("opacity", "0.95");

    innerimage.append("path")
        .attr("d", "M453.074,372.434c0,22.103-13.175,42.043-33.478,50.777C384.91,438.133,326.013,457.74,256,457.74  s-128.91-19.606-163.596-34.529c-20.303-8.734-33.478-28.675-33.478-50.777V158.48h394.147V372.434z")
        .style("fill", "#3E3D42");

    innerimage.append("path")
        .attr("d", "M58.927,158.48v213.954c0,22.085,13.151,42.029,33.437,50.759  c34.681,14.924,93.596,34.546,163.636,34.546c3.489,0,6.942-0.062,10.375-0.156c-4.353-10.536-6.189-20.93-6.745-29.969  c-0.995-16.202,7.674-31.467,21.963-39.166l171.481-92.403V158.48H58.927z")
        .style("fill", "#2D2D30");

    innerimage.append("path")
        .attr("d", "M220.041,46.575L15.109,159.435c-20.145,11.094-20.145,40.045,0,51.139l204.932,112.86  c22.388,12.329,49.531,12.329,71.919,0l204.932-112.86c20.145-11.094,20.145-40.045,0-51.139L291.96,46.575  C269.572,34.246,242.429,34.246,220.041,46.575z")
        .style("fill", "#57565C");

    innerimage.append("path")
        .attr("d", "M291.96,46.575c-22.388-12.329-49.531-12.329-71.919,0L15.109,159.435  c-20.145,11.094-20.145,40.045,0,51.139L220.04,323.434c22.388,12.329,49.531,12.329,71.919,0  C53.383,178.187,291.96,46.575,291.96,46.575z")
        .style("fill", "#3E3D42");

    innerimage.append("ellipse")
        .style("fill", "#FFEB99")
        .attr("cx", 256)
        .attr("cy", 185)
        .attr("rx", 37.437)
        .attr("ry", 22.464);

    innerimage.append("path")
        .attr("d", "M239.841,185.004c0-10.188,11.307-18.787,26.8-21.538c-3.374-0.6-6.942-0.926-10.641-0.926  c-20.678,0-37.441,10.058-37.441,22.464c0,12.406,16.763,22.464,37.441,22.464c3.697,0,7.267-0.327,10.641-0.926  C251.148,203.792,239.841,195.193,239.841,185.004z")
        .style("fill", "#FFDE55");

    innerimage.append("path")
        .attr("d", "M393.663,385.09c-4.268,0-7.726-3.458-7.726-7.726V271.803l-133.905-80.171  c-3.661-2.192-4.852-6.936-2.66-10.597c2.192-3.662,6.936-4.852,10.597-2.66l137.663,82.421c2.331,1.395,3.757,3.913,3.757,6.629  v109.94C401.39,381.632,397.93,385.09,393.663,385.09z")
        .style("fill", "#EEBF00");

    innerimage.append("path")
        .attr("d", "M417.72,409.869v54.175c0,5.87-4.758,10.628-10.628,10.628h-26.153  c-5.87,0-10.628-4.758-10.628-10.628v-54.961c0-13.24,10.854-23.943,24.148-23.7C407.509,385.622,417.72,396.818,417.72,409.869z")
        .style("fill", "#FFCD00");

    innerimage.append("path")
        .attr("d", "M394.016,464.044v-54.961c0-8.729,4.719-16.354,11.745-20.468c-3.327-1.982-7.171-3.158-11.301-3.233  c-13.296-0.243-24.148,10.461-24.148,23.7v54.961c0,5.87,4.758,10.628,10.628,10.628h23.704  C398.774,474.673,394.016,469.914,394.016,464.044z")
        .style("fill", "#EEBF00");

    innerimage.append("circle")
        .style("fill", "#FFEB99")
        .attr("cx", 394.014)
        .attr("cy", 383.217)
        .attr("r", 23.704)

    innerimage.append("path")
        .attr("d", "M394.016,383.219c0-8.773,4.769-16.426,11.852-20.525c-3.487-2.018-7.534-3.179-11.852-3.179  c-13.092,0-23.704,10.613-23.704,23.704s10.613,23.704,23.704,23.704c4.32,0,8.365-1.161,11.852-3.179  C398.784,399.646,394.016,391.992,394.016,383.219z")
        .style("fill", "#FFDE55");
}





//PILLS

//Constant to resize image
var pillsImageConstant = 0.0009;

//Makes linear scale using resizing constant and quantile scale
var linearPillsScale = function(pills) {
    return pillsImageConstant * pillsPercentileScale(pills)
};

//Quantile scale based on data values
var pillsPercentileScale = d3.scaleQuantile()
    .domain([12.3, 44.75, 55, 70.65, 129.6])
    .range([1, 2, 4, 8]);

var pillsImageHelper = function(pillsData) {
    return to_string_scale(areaScale(linearPillsScale(pillsData)));
};


//Generates image for the map SVG
var pillGeneratorMap = function(d) {
    var image = svg4.append("g")
        .attr("transform", transformHelper(projection(d.coordinates)[0],
            projection(d.coordinates)[1],
            pillsImageHelper, d.pills));
    pillsImageManipulator(image);
}

//Generates image for the map key SVG such that images are proportional to map sizing.
var pillGeneratorKey = function(arr, svg) {
    var image = d3.select(svg).append("g")
        .attr("transform", transformHelper(arr[0],
            arr[1],
            pillsImageHelper, arr[2]));
    var adjustedimage = image.append("g")
        .attr("transform", "scale(" + ((45 / 8) * (1200 / 240)) + "," + ((45 / 8) * (1200 / 240)) + ")");
    pillsImageManipulator(adjustedimage);
}

//Generates image for the circle key SVG
var pillGeneratorKeyCircle = function(arr, svg) {
    var image = d3.select(svg).append("g")
        .attr("transform", transformHelper(arr[0],
            arr[1],
            pillsImageHelper, arr[2]));
    var adjustedimage = image.append("g")
        .attr("transform", "scale(" + (12) + "," + (12) + ")");
    pillsImageManipulator(adjustedimage);
}

//This function is called in the image generators for map, map key and circle key. It centers around 0,0 and creates the image.
var pillsImageManipulator = function(image) {

    var innerimage = image.append("g")
        .attr("transform", "translate(-29, -29)")
        .attr("opacity", "0.75")

    innerimage.append("path")
        .attr("d", "M17.775,17.594L4.667,30.702c-6.223,6.223-6.223,16.405,0,22.627h0   c6.223,6.223,16.405,6.223,22.627,0l13.108-13.108L17.775,17.594z")
        .style("fill", "blue")

    innerimage.append("path")
        .attr("d", "M40.422,40.202l12.908-12.907c6.222-6.223,6.222-16.405,0-22.627h0   c-6.223-6.223-16.405-6.223-22.627,0L17.794,17.574L40.422,40.202z")
        .style("fill", "#EBBA16")

    innerimage.append("path")
        .attr("d", "M22.046,21.826l-17.11,17.11c-0.586,0.585-0.586,1.536,0,2.121c0.293,0.293,0.677,0.439,1.061,0.439   s0.768-0.146,1.061-0.439l17.11-17.11L22.046,21.826z")
        .style("fill", "#F46767")

    innerimage.append("path")
        .attr("d", "M24.165,23.948L40.057,8.057c0.586-0.585,0.586-1.536,0-2.121c-0.586-0.586-1.535-0.586-2.121,0   L22.044,21.827L24.165,23.948z")
        .style("fill", "#FCD770")
}





// CIRCLES FOR COMPREHENSIVE CROSS DATA COMPARISON PLOT

//Scales for all 4 variables from min observed value to max observed value mapping these to the range 10 - 30, 
//the range of radii of our concentric circles.
var circleHealthScale = d3.scaleLinear()
    .domain([438.742892, 6905.53034])
    .range([10, 30]);

var circleCorruptionScale = d3.scaleLinear()
    .domain([41, 90])
    .range([10, 30]);


var circleEducationScale = d3.scaleLinear()
    .domain([10.02, 47.6])
    .range([10, 30]);


var circlePillsScale = d3.scaleLinear()
    .domain([12.3, 129.6])
    .range([10, 30]);

//Constant to change size of circle
var circleEnlarge = (450 / 85) / 4;


//Returns spacing of the x,y coordinates after circle enlargement with constant.
var xCircles = function(x) {
    return (circleEnlarge * 35) + ((x - 1) * (660 - (circleEnlarge * 35) - (circleEnlarge * 35)) / 6)
};

var yCircles = function(y) {
    return (circleEnlarge * 35) + ((y - 1) * (450 - (circleEnlarge * 35) - (circleEnlarge * 45)) / 3)
};


//Makes path for polygon within circle based on the 4 variables data values
var circlePathFormer = function(d) {

    var pathstring = 'M 0 ' + circleHealthScale(d.health) + ' L ' + circleCorruptionScale(d.corruption) + ' 0 ' +
        '0 ' + (-1 * circleEducationScale(d.education)) + ' ' + (-1 * circlePillsScale(d.pills)) + ' 0 Z';
    return pathstring;
}

//Graphing positions for the circles. 
var graphingPositions = [{
        "x": 1,
        "y": 1
    }, {
        "x": 2,
        "y": 1
    }, {
        "x": 3,
        "y": 1
    }, {
        "x": 4,
        "y": 1
    }, {
        "x": 5,
        "y": 1
    }, {
        "x": 6,
        "y": 1
    }, {
        "x": 7,
        "y": 1
    },
    {
        "x": 1,
        "y": 2
    }, {
        "x": 2,
        "y": 2
    }, {
        "x": 3,
        "y": 2
    }, {
        "x": 4,
        "y": 2
    }, {
        "x": 5,
        "y": 2
    }, {
        "x": 6,
        "y": 2
    }, {
        "x": 7,
        "y": 2
    },
    {
        "x": 1,
        "y": 3
    }, {
        "x": 2,
        "y": 3
    }, {
        "x": 3,
        "y": 3
    }, {
        "x": 4,
        "y": 3
    }, {
        "x": 5,
        "y": 3
    }, {
        "x": 6,
        "y": 3
    }, {
        "x": 7,
        "y": 3
    },
    {
        "x": 1,
        "y": 4
    }, {
        "x": 2,
        "y": 4
    }, {
        "x": 3,
        "y": 4
    }, {
        "x": 4,
        "y": 4
    }, {
        "x": 5,
        "y": 4
    }, {
        "x": 6,
        "y": 4
    }
];

//Generates circle based on the x and y coordinates and variable data values
var circleGenerator = function(d, xtransform, ytransform) {
    
    var image = svg5.append("g")
        .attr("transform", "translate(" + xCircles(xtransform) + "," + yCircles(ytransform) + ")");

    var innerimage = image.append("g")
        .attr("transform", "scale(" + circleEnlarge + "," + circleEnlarge + ")");

    innerimage.append("circle")
        .attr("r", 1);

    innerimage.append("circle")
        .attr("r", 10)
        .style("stroke-width", 1)
        .style("stroke", "pink")
        .style("fill", "none");

    innerimage.append("circle")
        .attr("r", 20)
        .style("stroke-width", 1)
        .style("stroke", "violet")
        .style("fill", "none");

    innerimage.append("circle")
        .attr("r", 30)
        .style("stroke-width", 1)
        .style("stroke", "magenta")
        .style("fill", "none");

    innerimage.append("path")
        .attr("d", circlePathFormer(d))
        .style("opacity", 0.85)
        .style("fill", "" + percentScale(d.happiness));

    innerimage.append("text")
        .text(d.country)
        .attr("x", 0)
        .attr("y", 40)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("font-size", 8)
        .attr("fill", "black")

};


// GENERATING THE CIRCLE KEY (KEY FOR THE COMPREHENSIVE CROSS DATA COMPARISON PLOT)
var svg6 = d3.select("#keys5");

var circleLegend = svg6.append("g")
    .attr("id", "circleLegend")
    .attr("transform", "translate (615, 130) scale(4.2, 4.2)");

circleLegend.append("rect")
    .attr("x", -150)
    .attr("y", -150)
    .attr("height", 300)
    .attr("width", 300)
    .style("fill", "white");

//Adding concentric circles in the key
circleLegend.append("circle")
    .attr("r", 1);

circleLegend.append("circle")
    .attr("r", 30)
    .style("stroke-width", 1)
    .style("stroke", "pink")
    .style("fill", "none");

circleLegend.append("circle")
    .attr("r", 60)
    .style("stroke-width", 1)
    .style("stroke", "violet")
    .style("fill", "none");

circleLegend.append("circle")
    .attr("r", 90)
    .style("stroke-width", 1)
    .style("stroke", "magenta")
    .style("fill", "none");


//Filling the text for Health
circleLegend.append("text")
    .text("439")
    .attr("x", 0)
    .attr("y", -30)
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .attr("font-size", 11)
    .attr("fill", "grey")

circleLegend.append("text")
    .text("3672")
    .attr("x", 0)
    .attr("y", -60)
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .attr("font-size", 11)
    .attr("fill", "grey")

circleLegend.append("text")
    .text("6906")
    .attr("x", 0)
    .attr("y", -90)
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .attr("font-size", 11)
    .attr("fill", "grey")

circleLegend.append("text")
    .text("GOVT. HEALTH EXPENDITURE ($/citizen)")
    .attr("x", 0)
    .attr("y", -110)
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .attr("font-size", 9)
    .attr("fill", "black")
    .style("font-weight", "bold")


//Filling the text for Bureaucratic Honesty.
circleLegend.append("text")
    .text("41")
    .attr("x", 30)
    .attr("y", 0)
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .attr("font-size", 11)
    .attr("fill", "grey")

circleLegend.append("text")
    .text("66")
    .attr("x", 60)
    .attr("y", 0)
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .attr("font-size", 11)
    .attr("fill", "grey")

circleLegend.append("text")
    .text("90")
    .attr("x", 90)
    .attr("y", 0)
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .attr("font-size", 11)
    .attr("fill", "grey")

circleLegend.append("text")
    .text("BUREAUCRATIC HONESTY (CPI 2016)")
    .attr("x", 110)
    .attr("y", 0)
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .attr("font-size", 9)
    .attr("fill", "black")
    .attr("transform", "rotate (90,110,0)")
    .style("font-weight", "bold")


//Filling the text for Education
circleLegend.append("text")
    .text("10")
    .attr("x", 0)
    .attr("y", 30)
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .attr("font-size", 11)
    .attr("fill", "grey")

circleLegend.append("text")
    .text("29")
    .attr("x", 0)
    .attr("y", 60)
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .attr("font-size", 11)
    .attr("fill", "grey");

circleLegend.append("text")
    .text("48")
    .attr("x", 0)
    .attr("y", 90)
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .attr("font-size", 11)
    .attr("fill", "grey")

circleLegend.append("text")
    .text("COLLEGE EDUCATED CITIZENS (AGE 55-64) (%)")
    .attr("x", 0)
    .attr("y", 110)
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .attr("font-size", 9)
    .attr("fill", "black")
    .style("font-weight", "bold")


//Filling the text for Pills
circleLegend.append("text")
    .text("12")
    .attr("x", -30)
    .attr("y", 0)
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .attr("font-size", 11)
    .attr("fill", "grey")

circleLegend.append("text")
    .text("71")
    .attr("x", -60)
    .attr("y", 0)
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .attr("font-size", 11)
    .attr("fill", "grey")

circleLegend.append("text")
    .text("130")
    .attr("x", -90)
    .attr("y", 0)
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .attr("font-size", 11)
    .attr("fill", "grey")

circleLegend.append("text")
    .text("ANTIDEPRESSANTS USAGE( /1000 citizens)")
    .attr("x", -110)
    .attr("y", 0)
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .attr("font-size", 9)
    .attr("fill", "black")
    .attr("transform", "rotate (-90,-110,0)")
    .style("font-weight", "bold")


//Adding min, mid and max labels
circleLegend.append("text")
    .text("MIN")
    .attr("x", -22)
    .attr("y", -22)
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .attr("font-size", 9)
    .attr("fill", "black")
    .style("font-weight", "bold")

circleLegend.append("text")
    .text("MID")
    .attr("x", -42.5)
    .attr("y", -42.5)
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .attr("font-size", 9)
    .attr("fill", "black")
    .style("font-weight", "bold")

circleLegend.append("text")
    .text("MAX")
    .attr("x", -65)
    .attr("y", -65)
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .attr("font-size", 9)
    .attr("fill", "black")
    .style("font-weight", "bold")


//Adding directional arrows
circleLegend.append("path")
    .attr("d", "M 0 -10 L 0 -85 -15 -70 M 0 -85 L 15 -70 ")
    .style("opacity", 0.2)
    .style("fill", "none")
    .style("stroke", "blue")
    .style("stroke-width", 3)
    .style("font-weight", "bold");

circleLegend.append("path")
    .attr("d", "M 0 -10 L 0 -85 -15 -70 M 0 -85 L 15 -70 ")
    .style("opacity", 0.2)
    .style("fill", "none")
    .style("stroke", "blue")
    .style("stroke-width", 3)
    .attr("transform", "rotate (90)")
    .style("font-weight", "bold");

circleLegend.append("path")
    .attr("d", "M 0 -10 L 0 -85 -15 -70 M 0 -85 L 15 -70 ")
    .style("opacity", 0.2)
    .style("fill", "none")
    .style("stroke", "blue")
    .style("stroke-width", 3)
    .attr("transform", "rotate (180)")
    .style("font-weight", "bold");

circleLegend.append("path")
    .attr("d", "M 0 -10 L 0 -85 -15 -70 M 0 -85 L 15 -70 ")
    .style("opacity", 0.2)
    .style("fill", "none")
    .style("stroke", "blue")
    .style("stroke-width", 3)
    .attr("transform", "rotate (270)")
    .style("font-weight", "bold");


//Generating images for all 4 variables in the circle legend
healthGeneratorKeyCircle([0, -135, 0], "#circleLegend");
corruptionGeneratorKeyCircle([130, 0, 0], "#circleLegend");
educationGeneratorKeyCircle([0, 125, 0], "#circleLegend");
pillGeneratorKeyCircle([-133, 0, 0], "#circleLegend");




//LOADING DATA FILES
d3.queue()
    .defer(d3.json, "world-50m.json")
    .defer(d3.csv, "FINAL_DATA.csv", parseRow)
    .await(callback);


//CALLBACK FUNCTION THAT MANIPULATES DATA AND CALLS FUNCTIONS TO CREATE MAPS, MAP KEYS AND FINAL COMPREHENSIVE PLOT CIRCLES
function callback(error, rawMap, rawISO) {

    //MANIPULATING DATA
    rawcsvdata = rawISO;
    rawcsvdata.forEach(function(d) {
        d.coordinates = d.coordinates.split(",").map(function(x) {
            return Number(x)
        });
        d.countryid = Number(d.countryid);
        d.happiness = Number(d.happiness);
        d.health = Number(d.health);
        d.corruption = Number(d.corruption);
        d.education = Number(d.education);
        d.pills = Number(d.pills);
    });

    atlas = d3.map(rawISO, function(d) {
        return Number(d.countryid);
    });

    countries = topojson.feature(rawMap, rawMap.objects.countries);

    //CREATING MAPS FOR ALL 4 MAPS SVGS
    showMap(percentScale, "happiness", svg1);
    showMap(percentScale, "happiness", svg2);
    showMap(percentScale, "happiness", svg3);
    showMap(percentScale, "happiness", svg4);

    //CREATING MAP KEYS FOR ALL 4 MAP SVGS
    makeHappyScale("#keys1");
    makeHealthScale("#keys1");
    makeHappyScale("#keys2");
    makeCorruptionScale("#keys2");
    makeHappyScale("#keys3");
    makeEducationScale("#keys3");
    makeHappyScale("#keys4");
    makePillsScale("#keys4");

    //CALLING IMAGE MAKING FUNCTIONS FOR ALL 4 TYPES OF IMAGES
    rawcsvdata.forEach(function(d) {
        pillGeneratorMap(d)
        corruptionGeneratorMap(d)
        healthGeneratorMap(d)
        educationGeneratorMap(d);
    });

    //GENERATING CIRCLES IN THE FINAL COMPREHENSIVE CROSS VALIDATION PLOT
    rawcsvdata.forEach(function(d, i) {
        circleGenerator(d, graphingPositions[i].x, graphingPositions[i].y);
    });
}




//MAKES MAP SHOW FOR THE PARTICULAR SVG
function showMap(scale, variable, svg) {

    projection.fitExtent([
        [0, 0],
        [svg.attr("width"), svg.attr("height")]
    ], countries);
    pathGenerator = d3.geoPath().projection(projection);

    var paths = svg.selectAll("path.country").data(countries.features);

    paths = paths.enter().append("path").attr("class", "country")
        .merge(paths);

    paths
        .transition().duration(1000)
        .style("fill", function(country) {
            var countryData = atlas.get(country.id);
            if (countryData) {
                return scale(countryData[variable]);
            }
        })

        .attr("d", function(country) {
            return pathGenerator(country);
        });
}


//CREATES HAPPINESS SCALE FOR PARTICULAR SVG
function makeHappyScale(svg) {

    var svg = d3.select(svg);

    var textLabelHappiness = svg.append("text")
        .text("Happiness")
        .attr("x", "50")
        .attr("y", "-450")
        .attr("text-anchor", "left")
        .attr("alignment-baseline", "middle")
        .attr("font-size", "60");

    //Creating gradient for happiness
    var gradient = svg.append("rect")
        .attr("x", "50")
        .attr("y", "-400")
        .attr("width", "120")
        .attr("height", "1100")
        .attr("fill", "url(#happinessGradient)")
        .attr("rx", "50")
        .attr("rx", "50");

    //Creating the smile face and the frown face, for happy and sad respectively
    var happyImage = svg.append("g")
        .attr("transform", "translate(210, -370) scale(.28)");

    var sadImage = svg.append("g")
        .attr("transform", "translate(210, 540) scale(.28)");


    happyImage.append("path")
        .attr("d", "M409.132,109.205c-19.608-33.592-46.205-60.189-79.798-79.796C295.733,9.803,259.054,0.002,219.273,0.002 c-39.781,0-76.47,9.801-110.063,29.407c-33.595,19.604-60.192,46.201-79.8,79.796C9.801,142.802,0,179.491,0,219.269 c0,39.78,9.804,76.463,29.407,110.062c19.607,33.592,46.204,60.189,79.799,79.798c33.597,19.603,70.283,29.403,110.063,29.403 s76.47-9.801,110.065-29.403c33.593-19.608,60.189-46.206,79.795-79.798c19.603-33.599,29.403-70.284,29.403-110.062 C438.533,179.487,428.732,142.797,409.132,109.205z M387.433,290.215c-9.709,22.556-22.696,41.973-38.969,58.245 c-16.271,16.269-35.689,29.26-58.245,38.965c-22.555,9.712-46.202,14.564-70.946,14.564c-24.744,0-48.391-4.859-70.948-14.564 c-22.554-9.705-41.971-22.696-58.245-38.965c-16.269-16.275-29.259-35.687-38.97-58.245 c-9.707-22.552-14.562-46.206-14.562-70.946c0-24.744,4.854-48.391,14.562-70.948c9.707-22.554,22.697-41.968,38.97-58.245 c16.274-16.269,35.691-29.26,58.245-38.97c22.554-9.704,46.205-14.558,70.948-14.558c24.74,0,48.395,4.851,70.946,14.558 c22.556,9.707,41.97,22.698,58.245,38.97c16.272,16.274,29.26,35.688,38.969,58.245c9.709,22.554,14.564,46.201,14.564,70.948 C402.001,244.013,397.142,267.666,387.433,290.215z")
    happyImage.append("path")
        .attr("d", "M312.06,247.533c-4.757-1.532-9.418-1.136-13.99,1.144s-7.617,5.899-9.13,10.849 c-4.754,15.229-13.562,27.555-26.412,36.973c-12.844,9.421-27.265,14.134-43.255,14.134c-15.986,0-30.402-4.716-43.252-14.134 c-12.847-9.421-21.65-21.744-26.409-36.973c-1.521-4.949-4.521-8.569-8.992-10.849c-4.473-2.279-9.087-2.676-13.846-1.144 c-4.949,1.52-8.564,4.518-10.85,8.987c-2.284,4.469-2.666,9.096-1.141,13.846c7.039,23.038,20.173,41.593,39.397,55.679 c19.226,14.086,40.924,21.121,65.096,21.121c24.169,0,45.873-7.035,65.098-21.121c19.212-14.093,32.347-32.641,39.389-55.679 c1.533-4.75,1.15-9.377-1.136-13.846C320.334,252.051,316.81,249.061,312.06,247.533z")
    happyImage.append("path")
        .attr("d", "M146.181,182.727c10.085,0,18.699-3.576,25.837-10.709c7.139-7.135,10.708-15.749,10.708-25.837 c0-10.089-3.569-18.699-10.708-25.837s-15.752-10.709-25.837-10.709c-10.088,0-18.702,3.571-25.84,10.709 c-7.135,7.139-10.707,15.749-10.707,25.837c0,10.088,3.568,18.702,10.707,25.837C127.482,179.154,136.092,182.727,146.181,182.727 z")
    happyImage.append("path")
        .attr("d", "M292.359,109.633c-10.089,0-18.706,3.571-25.845,10.709c-7.132,7.139-10.708,15.749-10.708,25.837 c0,10.088,3.576,18.702,10.708,25.837c7.139,7.137,15.756,10.709,25.845,10.709c10.081,0,18.698-3.576,25.837-10.709 c7.139-7.135,10.708-15.749,10.708-25.837c0-10.089-3.569-18.699-10.708-25.837S302.44,109.633,292.359,109.633z")


    sadImage.append("path")
        .attr("d", "M409.133,109.203c-19.608-33.592-46.205-60.189-79.798-79.796C295.736,9.801,259.058,0,219.273,0 c-39.781,0-76.47,9.801-110.063,29.407c-33.595,19.604-60.192,46.201-79.8,79.796C9.801,142.8,0,179.489,0,219.267 c0,39.78,9.804,76.463,29.407,110.062c19.607,33.592,46.204,60.189,79.799,79.798c33.597,19.605,70.283,29.407,110.063,29.407 s76.47-9.802,110.065-29.407c33.593-19.602,60.189-46.206,79.795-79.798c19.603-33.596,29.403-70.284,29.403-110.062 C438.533,179.485,428.732,142.795,409.133,109.203z M387.434,290.213c-9.709,22.556-22.696,41.97-38.969,58.245 c-16.271,16.269-35.689,29.26-58.245,38.965c-22.555,9.712-46.202,14.564-70.946,14.564c-24.744,0-48.391-4.853-70.948-14.564 c-22.554-9.705-41.971-22.696-58.245-38.965c-16.269-16.275-29.259-35.687-38.97-58.245 c-9.707-22.552-14.562-46.206-14.562-70.946c0-24.744,4.854-48.391,14.562-70.948c9.707-22.554,22.697-41.968,38.97-58.245 c16.274-16.269,35.691-29.26,58.245-38.97c22.554-9.704,46.205-14.558,70.948-14.558c24.74,0,48.395,4.851,70.946,14.558 c22.556,9.707,41.97,22.698,58.245,38.97c16.272,16.274,29.26,35.688,38.969,58.245c9.709,22.554,14.564,46.201,14.564,70.948 C402.002,244.011,397.143,267.664,387.434,290.213z")
    sadImage.append("path")
        .attr("d", "M284.368,258.668c-19.219-14.086-40.926-21.129-65.095-21.129c-24.172,0-45.871,7.039-65.096,21.129 c-19.224,14.085-32.358,32.641-39.397,55.671c-1.521,4.757-1.143,9.381,1.141,13.847c2.286,4.469,5.898,7.467,10.85,8.993 c4.758,1.526,9.373,1.143,13.846-1.144c4.471-2.285,7.467-5.899,8.991-10.848c4.759-15.235,13.562-27.556,26.409-36.979 c12.847-9.418,27.263-14.127,43.252-14.127c15.987,0,30.412,4.712,43.251,14.127c12.854,9.424,21.655,21.744,26.412,36.979 c1.52,4.948,4.564,8.562,9.134,10.848c4.568,2.286,9.236,2.67,13.989,1.144c4.761-1.526,8.278-4.524,10.564-8.993 c2.286-4.466,2.669-9.09,1.14-13.847C316.729,291.312,303.591,272.75,284.368,258.668z")
    sadImage.append("path")
        .attr("d", "M146.181,182.725c10.085,0,18.699-3.576,25.837-10.709c7.139-7.135,10.708-15.749,10.708-25.837 c0-10.089-3.569-18.699-10.708-25.837s-15.752-10.709-25.837-10.709c-10.088,0-18.702,3.571-25.84,10.709 c-7.135,7.139-10.707,15.749-10.707,25.837c0,10.088,3.568,18.702,10.707,25.837C127.482,179.152,136.093,182.725,146.181,182.725 z")
    sadImage.append("path")
        .attr("d", "M292.359,109.631c-10.089,0-18.706,3.571-25.845,10.709c-7.132,7.139-10.708,15.749-10.708,25.837 c0,10.088,3.576,18.702,10.708,25.837c7.139,7.137,15.756,10.709,25.845,10.709c10.081,0,18.698-3.576,25.837-10.709 c7.139-7.135,10.708-15.749,10.708-25.837c0-10.089-3.569-18.699-10.708-25.837S302.44,109.631,292.359,109.631z")
}


// x and y positions for SVG text
var xPosSideText = 870;
var iconRectWidth = 350;
var iconRectHeight = 1100;

//x constant for the quartile icons
var iconX = 670;

//y values for quartile text
var quart1YPos = -330;
var values1YPos = quart1YPos + 80;

var quart2YPos = -20;
var values2YPos = quart2YPos + 80;

var quart3YPos = 280;
var values3YPos = quart3YPos + 80;

var quart4YPos = 550;
var values4YPos = quart4YPos + 80;


//Helper functions
function makeTextLabel(mySVG, string, xPos, yPos) {
    return mySVG.append("text")
        .text(string)
        .attr("x", xPos)
        .attr("y", yPos)
        .attr("class", "key-text");
}

function makeTextLabelItalic(mySVG, string, xPos, yPos) {
    return mySVG.append("text")
        .text(string)
        .attr("x", xPos)
        .attr("y", yPos)
        .attr("class", "ital-key-text");
}

function makeRect(mySVG, xPos, yPos, rectW, rectH) {
    return mySVG.append("rect")
        .attr("x", xPos)
        .attr("y", yPos)
        .attr("width", rectW)
        .attr("height", rectH)
        .attr("fill", "white")
        .attr("rx", "50");
}


//MAKES VARIABLE SCALE FOR THE PARTICULAR SVG

//Health
function makeHealthScale(svg_string) {

    var svg = d3.select(svg_string);

    var textLabelVar = svg.append("text")
        .text("Expenditure ($/citizen)")
        .attr("x", "500")
        .attr("y", "-450")
        .attr("class", "key-text");

    makeRect(svg, 500, -400, iconRectWidth, iconRectHeight);

    //Defining quartile values
    makeTextLabel(svg, "4th Quartile", xPosSideText, quart1YPos);
    makeTextLabelItalic(svg, "[3756, 6906]", xPosSideText, values1YPos);

    makeTextLabel(svg, "3rd Quartile", xPosSideText, quart2YPos);
    makeTextLabelItalic(svg, "[2933, 3756)", xPosSideText, values2YPos);

    makeTextLabel(svg, "2nd Quartile", xPosSideText, quart3YPos);
    makeTextLabelItalic(svg, "[1278, 2933)", xPosSideText, values3YPos);

    makeTextLabel(svg, "1st Quartile", xPosSideText, quart4YPos);
    makeTextLabelItalic(svg, "[439, 1278)", xPosSideText, values4YPos);


    //Defining x,y and data values for creating map scale images
    var imageArrays = [
        [iconX, -300, 3735.9829],
        [iconX, 0, 2933.400094],
        [iconX, 300, 1277.69566],
        [iconX, 550, 438.7428921]
    ]

    //Generating map scale images
    imageArrays.forEach(function(arr) {
        healthGeneratorKey(arr, svg_string);
    });

}


//Corruption
function makeCorruptionScale(svg_string) {

    var svg = d3.select(svg_string);

    var textLabelVar = svg.append("text")
        .text("Honesty (CPI)")
        .attr("x", "500")
        .attr("y", "-450")
        .attr("class", "key-text");

    makeRect(svg, 500, -400, iconRectWidth, iconRectHeight);

    //Defining quartile values
    makeTextLabel(svg, "4th Quartile", xPosSideText, quart1YPos);
    makeTextLabelItalic(svg, "[81, 90]", xPosSideText, values1YPos);

    makeTextLabel(svg, "3rd Quartile", xPosSideText, quart2YPos);
    makeTextLabelItalic(svg, "[70, 81)", xPosSideText, values2YPos);

    makeTextLabel(svg, "2nd Quartile", xPosSideText, quart3YPos);
    makeTextLabelItalic(svg, "[58, 70)", xPosSideText, values3YPos);

    makeTextLabel(svg, "1st Quartile", xPosSideText, quart4YPos);
    makeTextLabelItalic(svg, "[41, 58)", xPosSideText, values4YPos);

    //Defining x,y and data values for creating map scale images
    var imageArrays = [
        [iconX, -300, 81],
        [iconX, 0, 70],
        [iconX, 300, 57.5],
        [iconX, 550, 41]
    ]

    //Generating map scale images
    imageArrays.forEach(function(arr) {
        corruptionGeneratorKey(arr, svg_string);
    });

}


//Education
function makeEducationScale(svg_string) {

    var svg = d3.select(svg_string);

    var textLabelVar = svg.append("text")
        .text("Education (%)")
        .attr("x", "500")
        .attr("y", "-450")
        .attr("text-anchor", "left")
        .attr("alignment-baseline", "middle")
        .attr("font-size", "60")
        .attr("fill", "black");

    makeRect(svg, 500, -400, iconRectWidth, iconRectHeight);

    //Defining quartile values
    makeTextLabel(svg, "4th Quartile", xPosSideText, quart1YPos);
    makeTextLabelItalic(svg, "[30, 48]", xPosSideText, values1YPos);

    makeTextLabel(svg, "3rd Quartile", xPosSideText, quart2YPos);
    makeTextLabelItalic(svg, "[26, 30)", xPosSideText, values2YPos);

    makeTextLabel(svg, "2nd Quartile", xPosSideText, quart3YPos);
    makeTextLabelItalic(svg, "[18, 26)", xPosSideText, values3YPos);

    makeTextLabel(svg, "1st Quartile", xPosSideText, quart4YPos);
    makeTextLabelItalic(svg, "[10, 18)", xPosSideText, values4YPos);

    //Defining x,y and data values for creating map scale images
    var imageArrays = [
        [iconX, -300, 30.35],
        [iconX, 0, 26.3],
        [iconX, 300, 18.15],
        [iconX, 550, 10.2]
    ]

    //Generating map scale images
    imageArrays.forEach(function(arr) {
        educationGeneratorKey(arr, svg_string);
    });

}


//Pills
function makePillsScale(svg_string) {

    var svg = d3.select(svg_string);

    var textLabelVar = svg.append("text")
        .text("Usage (/1000 citizens)")
        .attr("x", "500")
        .attr("y", "-450")
        .attr("text-anchor", "left")
        .attr("alignment-baseline", "middle")
        .attr("font-size", "60")
        .attr("fill", "black");

    makeRect(svg, 500, -400, iconRectWidth, iconRectHeight);

    //Defining quartile values
    makeTextLabel(svg, "4th Quartile", xPosSideText, quart1YPos);
    makeTextLabelItalic(svg, "[71, 130]", xPosSideText, values1YPos);

    makeTextLabel(svg, "3rd Quartile", xPosSideText, quart2YPos);
    makeTextLabelItalic(svg, "[55, 71)", xPosSideText, values2YPos);

    makeTextLabel(svg, "2nd Quartile", xPosSideText, quart3YPos);
    makeTextLabelItalic(svg, "[45, 55)", xPosSideText, values3YPos);

    makeTextLabel(svg, "1st Quartile", xPosSideText, quart4YPos);
    makeTextLabelItalic(svg, "[12, 45)", xPosSideText, values4YPos);

    //Defining x,y and data values for creating map scale images
    var imageArrays = [
        [iconX, -300, 70.65],
        [iconX, 0, 55],
        [iconX, 300, 44.75],
        [iconX, 550, 12.3]
    ]

    //Generating map scale images
    imageArrays.forEach(function(arr) {
        pillGeneratorKey(arr, svg_string);
    });



}