var PanelMktCtrl = function() {
    
	var self;
	var PanelMktCtrl = function() {};

    var domain = "http://dvdpansardis.github.io/teste_gauge/";

    var listBrands = [];
    var listInteractions = [];
    var listUsers = [];
	
    var distinctBrands = [];

	PanelMktCtrl.prototype = {
		
		init: function(){
			self = this;

            self.loadData();
            self.distinctBrands();
            self.loadComboBrands();
            self.loadChart();
            self.filterByBrand(self.distinctBrands[0]);
            self.loadListeners();

		},
		
        loadListeners : function(){
            $("#cmbBrands").change(function(){
                self.filterByBrand($("#cmbBrands option:selected").val());
            });
            $("#btnFilter").click(function(){
                self.filterByBrand($("#cmbBrands option:selected").val());
            });
        },

		loadData : function(){
            $.ajax({
		        url: domain + "assets/brands.json",
		        type: 'get',
		        async: false,
		        success: function(data) {
		        	self.listBrands = data;
		        } 
		    });

            $.ajax({
		        url: domain + "assets/interactions.json",
		        type: 'get',
		        async: false,
		        success: function(data) {
		        	self.listInteractions = data;
		        } 
		    });

            $.ajax({
		        url: domain + "assets/users.json",
		        type: 'get',
		        async: false,
		        success: function(data) {
		        	self.listUsers = data;
		        } 
		    });
        },

        distinctBrands : function(){
            if(self.listBrands.length > 0){
                var brands = self.listBrands.map(function(obj) { return obj.id; });
                self.distinctBrands = brands.filter(function(v, i) { return brands.indexOf(v) == i; });
            }
        },

        loadComboBrands : function(){
            var options = "";

            for (var i = 0; i <= self.distinctBrands.length - 1; i++) {
                var id = self.distinctBrands[i];
            	options += '<option value="' + id + '">' + self.findNameBrandByID(id) + '</option>';                
            };

            $("#cmbBrands").html(options);
        },

        findNameBrandByID : function(id){
            for(var i = 0; i <= self.listBrands.length - 1; i++){
                if(self.listBrands[i].id == id){
                    return self.listBrands[i].name;
                }
            }
        },

        findUserByID : function(id){
            for(var i = 0; i <= self.listUsers.length - 1; i++){
                if(self.listUsers[i].id == id){
                    return self.listUsers[i];
                }
            }
        },

        filterByBrand : function(selectedBrand){
            var thumbnailsUsers = "";
            var sumInteractions = [];
            for(var i = 0; i <= self.listUsers.length - 1; i++){
                var cont = 0
                for(var j = 0; j <= self.listInteractions.length - 1; j++){
                    if(self.listUsers[i]["id"] == self.listInteractions[j]["user"] && 
                        self.listInteractions[j]["brand"] == selectedBrand){

                        cont++;
                    }
                }
                sumInteractions.push({"user":self.listUsers[i]["id"],"total":cont});
            }
            /** sumInteractions.sort(function(a, b){
                return a["total"] > b["total"];
            });*/
           
            sumInteractions.sort(function(obj1, obj2) {
                return obj1["total"] - obj2["total"];
            });

            for(var i = sumInteractions.length - 1; i >= 0 ; i--){
                if(sumInteractions[i]["total"] > 0){
                    var user = self.findUserByID(sumInteractions[i]["user"]);
                    thumbnailsUsers += '<div class="col-md-4">';
                    thumbnailsUsers += '<p><b>Name:</b> ' + user["name"]["title"]  + '. ' + user["name"]["first"] + ' ';
                    thumbnailsUsers += user["name"]["last"] + '</p>';
                    thumbnailsUsers += '<center><img src = ' + user["picture"]["large"] + ' ></center>';
                    thumbnailsUsers += '<br><p><b>total interactions:</b> ' + sumInteractions[i]["total"] + '</p>';
                    thumbnailsUsers += '</div>';
                }
            }

            $("#thumbnailsUsers").html(thumbnailsUsers);
        },

        loadChart : function(){
            var sumInteractions = [];

            for(var i = 0; i <= self.distinctBrands.length - 1; i++){
                var cont = 0
                for(var j = 0; j <= self.listInteractions.length - 1; j++){
                    if(self.distinctBrands[i] == self.listInteractions[j]["brand"]){
                        cont++;
                    }
                }
                sumInteractions.push({"brand":self.distinctBrands[i],"total":cont});
            }

            sumInteractions.sort(function(obj1, obj2) {
                return obj1["total"] - obj2["total"];
            });

            var labels = [];
            var data = [];
            var datasets = [];
            var backgroundColor = [];
            var borderColor = [];

            for(var i = sumInteractions.length - 1; i >= 0 ; i--){
                labels.push(self.findNameBrandByID(sumInteractions[i]["brand"]));
                data.push(sumInteractions[i]["total"]);
                var r = Math.floor(Math.random() * 256);
                var g = Math.floor(Math.random() * 256);
                var b = Math.floor(Math.random() * 256);
                backgroundColor.push('rgba(' + r + ', ' + g + ', ' + b + ', 0.2)');
                borderColor.push('rgba(' + r + ', ' + g + ', ' + b + ', 1)');
            }

            var ctx = document.getElementById("chartBrands");
            var myBarChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Number of Interactions',
                        data: data,
                        backgroundColor: backgroundColor,
                        borderColor: borderColor,
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero:true
                            }
                        }]
                    }
                }
            });
        }
	};
	return PanelMktCtrl;
}();

var panelMkt = new PanelMktCtrl();

panelMkt.init();

