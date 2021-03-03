//based on https://bl.ocks.org/mbostock/1096355
	//apple design:https://images.apple.com/watch/features/images/fitness_large.jpg
      // code modified from https://codepen.io/mrwilly/pen/bVqZoR 
	// "use strict";
console.log('running progress bar script');
function ctlProgressGoal(teamPercentComplete) {
	(function(){
		var gap = 2;
        // should be able to remove index because I only have one ring
		var ranDataset = [ {index: 0, percentage: teamPercentComplete} ]; // TOME: percent is percent as who number 84% is 84 

		var colors = ["#00bfa5", "#a0ff03", "#1ad5de"];
		var width = 160,
				height = 160,
				τ = 2 * Math.PI;

		function build(dataset){

            // Ring width
			var arc = d3.svg.arc()
					.startAngle(0)
					.endAngle(function (d) {
						return d.percentage / 100 * τ;
					})
					.innerRadius(function (d) {
						return 50 
					})
					.outerRadius(function (d) {
						return 70
					})
					.cornerRadius(10); //modified d3 api only

            // Shadow ring radius
			var background = d3.svg.arc()
					.startAngle(0)
					.endAngle(τ)
					.innerRadius(function (d, i) {
						return 50
					})
					.outerRadius(function (d, i) {
						return 70
					});

			var svg = d3.select(".canvas").append("svg")
					.attr("width", width)
					.attr("height", height)
					.append("g")
					.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

			//add linear gradient, notice apple uses gradient alone the arc..
			//meh, close enough...


			var gradient = svg.append("svg:defs")
					.append("svg:linearGradient")
					.attr("id", "gradient")
					.attr("x1", "0%")
					.attr("y1", "100%")
					.attr("x2", "50%")
					.attr("y2", "0%")
					.attr("spreadMethod", "pad");

			gradient.append("svg:stop")
					.attr("offset", "0%")
					.attr("stop-color", "#84FFF8")
					.attr("stop-opacity", 1);

			gradient.append("svg:stop")
					.attr("offset", "100%")
					.attr("stop-color", "#00bfa5")
					.attr("stop-opacity", 1);


			//add some shadows
			var defs = svg.append("defs");

			var filter = defs.append("filter")
					.attr("id", "dropshadow")

			filter.append("feGaussianBlur")
					.attr("in", "SourceAlpha")
					.attr("stdDeviation", 4)
					.attr("result", "blur");
			filter.append("feOffset")
					.attr("in", "blur")
					.attr("dx", 1)
					.attr("dy", 1)
					.attr("result", "offsetBlur");

			var feMerge = filter.append("feMerge");

			feMerge.append("feMergeNode")
					.attr("in", "offsetBlur");
			feMerge.append("feMergeNode")
					.attr("in", "SourceGraphic");

			var field = svg.selectAll("g")
					.data(dataset)
					.enter().append("g");

			field.append("path").attr("class", "progress").attr("filter", "url(#dropshadow)");

			field.append("path").attr("class", "bg")
					.style("fill", function (d) {
						return colors[d.index];
					})
					.style("opacity", 0.2)
					.attr("d", background);

			// field.append("text").attr('class','icon');


            field.append("text").attr('class','goal').text("OF 15,000").attr("transform","translate(0,15)");
            field.append("text").attr('class','completed').attr("transform","translate(0,0)");

            // this each was previously when there were three
            field = field
                    .each(function (d) {
                        this._value = d.percentage;
                    })
                    .data(dataset)
                    .each(function (d) {
                        d.previousValue = this._value;
                    });

            field.select("path.progress").transition().duration(1750).delay(function (d, i) {
                return i * 200
            })
                    .ease("elastic")
                    .attrTween("d", arcTween)
                    .style("fill", function (d) {
                        if(d.index===0){
                            return "url(#gradient)"
                        }
                        return colors[d.index];
                    });

            // field.select("text.icon").text(function (d) {
            // 	return d.icon;
            // }).attr("transform", function (d) {
            // 			return "translate(10," + -(150 - d.index * (40 + gap)) + ")"

            // 		});

            // set the goal (20,000) and then return the goal number with comma based on percent ... prob easier way to do this
            field.select("text.completed").text(function (d) {
                    
                return Math.round(d.percentage / 100 * 15000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",").replace();
            });


			function arcTween(d) {
				var i = d3.interpolateNumber(d.previousValue, d.percentage);
				return function (t) {
					d.percentage = i(t);
					return arc(d);
				};
			}


		}
        
		build(ranDataset);


	})()
}
