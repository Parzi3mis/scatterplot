var color = ["#C39BD3", "#5499C7", "#F4D03F", "#5D6D7E", "#EC7063"];
var carTypes = ["Minivan", "Sedan", "Sports Car", "SUV", "Wagon"];
var txt;

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
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
// read and draw data
d3.csv("cars.csv", function(d) {

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

    // Scale of the area according to the horsepower 
    let sqrtScale = d3.scaleSqrt()
      .domain([73, 493])
      .range([10, 30])

    // Scale of the color according to the type of cars
    let colorScale = d3.scaleOrdinal()
      .domain(carTypes)
      .range(color)
  
    var highlight = function(d){    

          d3.selectAll(".dot")
            .transition()
            .duration(100)
            .style("fill", "transparent")                
                      
          d3.selectAll("." + d.Type)                
            .transition()
            .duration(100)
            .style("fill", colorScale(d.Type))
        }     
    
    var doNotHighlight = function(d){
      d3.selectAll(".dot")
        .transition()
        .duration(100)
        .style("fill", function(d) { return colorScale(d.Type)})
    }

    // Add dots
    svg.append('g')
      .selectAll("dot")
      .data(d)
      .enter()
      .append("circle")
          .attr("class", function(d) { return "dot " + d.Type})
          .attr("cx", function (d) { return x(d.CityMilesPerGallon); } )
          .attr("cy", function (d) { return y(d.HighwayMilesPerGallon); } )
          .attr("r", function(d) { return sqrtScale(d.Horsepower)/3; })
          .style("fill", function(d) { return colorScale(d.Type)})
      .on("mouseover", highlight)
      .on("mouseleave", doNotHighlight )

      console.log(d3.selectAll(".dot"));
    for(i =0; i < 5; i++){
      svg.append("circle")
                          .attr("class", "legend")
                          .attr("cx",600)
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
      svg.append("circle").attr("class", "legend")
                          .attr("cx", 600)
                          .attr("cy", 350 + i*30)
                          .attr("r", sqrtScale((i+1)*100/3))
                          .attr("fill", "black")
      svg.append("text").attr("x", 620)
                        .attr("y", 350 + i*30)
                        .text((i+1)*100)
                        .style("font-size", "15px")
                        .attr("alignment-baseline","middle")
     }

     let tooltip = d3.select("#details")
                     .attr("class", "tooltip")
                     .style("opacity", "0")

     d3.selectAll(".dot").on("mouseover", function(d){
       console.log(d3.event.pageY);
       tooltip.html('Car Type:'+ d.Type + '<br/>' + 'Horsepower:' + 
       d.Horsepower + '<br/>' + 'HighwayMPG:' + d.HighwayMilesPerGallon +
       '<br/>' + 'CityMPG:' + d.CityMilesPerGallon)
              .style("left", (d3.event.pageX) + "px")
              .style("top", (d3.event.pageY) + "py")
              .style("opacity", "1")
     })

     d3.selectAll(".dot").on("mouseout", function(){
       tooltip.style("opacity", "0")
     })

  })



