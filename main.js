var d3;
var color = ["#C39BD3", "#5499C7", "#F4D03F", "#5D6D7E", "#EC7063"];
var carTypes = ["Minivan", "Sedan", "Sports Car", "SUV", "Wagon"];
var size = [];

// location and scale of the graph
var margin = {top: 50, right: 200, bottom: 100, left: 50},
    width = 800 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#mydata")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// read and draw data
d3.dsv(",","cars.csv", function(data) {
  return {
    Horsepower: +data.Horsepower,
    CityMilesPerGallon: +data.CityMilesPerGallon,
    HighwayMilesPerGallon: +data.HighwayMilesPerGallon,
    Type: data.Type
  };}).then(function(d){
    // console.log(d);

    // Add X axis
    var x = d3.scaleLinear()
      .domain([5, 65])
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
  
    // Add Y axis
    var y = d3.scaleLinear()
      .domain([5, 65])
      .range([ height, 0]);
    svg.append("g")
      .call(d3.axisLeft(y));

    // Scale of the size according to the horsepower 
    let sqrtScale = d3.scaleSqrt()
      .domain([73, 493])
      .range([10, 30])
    
    // Add dots
    svg.append("g")
      .selectAll("dot")
      .data(d)
      .enter()
      .append("circle")
        .attr("cx", function (d) { return x(d.CityMilesPerGallon); } )
        .attr("cy", function (d) { return y(d.HighwayMilesPerGallon); } )
        .attr("r", function(d){ return sqrtScale(d.Horsepower)/3; })
        .style("fill", function(d) {
          if(d.Type == carTypes[0]){
            return color[0]
          }else if(d.Type == carTypes[1]){
            return color[1]
          }else if(d.Type == carTypes[2]){
            return color[2]
          }else if(d.Type == carTypes[3]){
            return color[3]
          }else return color[4]
        })
        
        // legends for car types (color)
        for(i =0; i < 5; i++){
          svg.append("circle").attr("cx",600)
                              .attr("cy",200 + i*25)
                              .attr("r", 5)
                              .style("fill", color[i])
          svg.append("text").attr("x", 610)
                            .attr("y", 200 + i*25)
                            .text(carTypes[i])
                            .style("font-size", "15px")
                            .attr("alignment-baseline","middle")
        }
        

        // legends for horsepower (size)
        for(i = 0; i < 4; i++){
          svg.append("circle").attr("cx", 600)
                              .attr("cy", 350 + i*30)
                              .attr("r", sqrtScale((i+1)*100/3))
                              .attr("fill", "black")
          svg.append("text").attr("x", 620)
                            .attr("y", 350 + i*30)
                            .text((i+1)*100)
                            .style("font-size", "15px")
                            .attr("alignment-baseline","middle")
        }
      })

