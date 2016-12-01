(function(){
	var MainController = function($scope, $http, $location, $routeParams, $interval, $timeout, $window, AlertService, RESTService)
	{		
		$scope.safeApply = function(fn) {
		    var phase = this.$root.$$phase;
		    if(phase == '$apply' || phase == '$digest') {
		        if(fn && (typeof(fn) === 'function')) {
		          fn();
		        }
		    } else {
		       this.$apply(fn);
		    }
		};

		$scope.dim_mat = 5;
		$scope.teach = {
			mat: [],
			letter: ""
		};

		$scope.ready = false;

		$scope.phrase = "Dame un segundo, me estoy despertando...";

		RESTService.getTrainData($scope);

		$scope.init_mat = function(){
			$scope.teach.mat = [];

			for (var i = 0; i < $scope.dim_mat*$scope.dim_mat; i++)
				$scope.teach.mat.push(0);
		}

		$scope.reset_mat = function(){
			for (var i = 0; i < $scope.teach.mat.length; i++)
				$scope.teach.mat[i] = 0;
		}

		$scope.range = function(a, b){
			var x = [];

			for (var i = a; i < b; i++)
				x.push(i);

			return x;
		}

		$scope.teach = function(){
			var post = $scope.teach;

			if (typeof post.letter == 'undefined')
			{
				$.alert({
					title: "Hey",
					content: "Solo puedo aprender números :("
				});
				return;
			}

			post.charcode = post.letter.charCodeAt(0);

			post.traindata = "";

			for (var i = 0; i < post.mat.length; i++)
				post.traindata += post.mat[i];

			if (post.traindata.indexOf("1") == -1)
			{
				$.alert({
					title: "Espera",
					content: "¿Qué voy a aprender de eso?"
				});
				return;
			}

			$.ajax({
			    url: "php/run.php?fn=teach",
			    type: "POST",
			    data: post,
			    beforeSend: function(){},
			    success: function(data){
			        try {
			        	var json = $.parseJSON(data);

			        	if (json.status == "ok")
			        	{
			        		$scope.safeApply(function(){
			        			$scope.teach.letter = "";
			        			$scope.reset_mat();
			        			$scope.phrase = json.msg;

			        			RESTService.getTrainData($scope);
			        		});
			        	}
			        }
			        catch (ex){
			        	console.error(data);
			        }
			    }
			});
		}

		$scope.getTotalError = function(actual, desired){
		    if (actual.length != desired.length)
		        console.error("Actual != Desired", actual, desired);

		    var e = 0.0;

		    for (var i = 0; i < actual.length; i++)
		        e += desired[i] - actual[i];

		    return e < 0.0000000000000 ? e * -1 : 0.0;
		}

		$scope.trainNetwork = function(){
			$scope.phrase = $scope.ready ? "Añadiré eso a mis conocimientos" : "Dame un segundo, voy a cepillarme...";

			var learningRate = .3;
			var e = 0.0;
			var error = 0.0001;
			var it = 0;
			var maxit = 1000000;
			var ignoreMaxIT = maxit == -1;

			/* 
			* Poner 512 neuronas de salidas y activar solo aquella del charcode
			* (*) Puede tomar mucho tiempo en converger
			*/
			var inputLayer = new window['synaptic'].Layer($scope.dim_mat*$scope.dim_mat);
			var hiddenLayer = new window['synaptic'].Layer(20);
			var outputLayer = new window['synaptic'].Layer(1);

			inputLayer.project(hiddenLayer);
			hiddenLayer.project(outputLayer);

			$scope.myNetwork = new window['synaptic'].Network({
			    input: inputLayer,
			    hidden: [hiddenLayer],
			    output: outputLayer
			});

			var td = []; // Train data

			for (var i = 0; i < $scope.traindata.length; i++)
			{
				var input = [];

				for (var k = 0; k < $scope.traindata[i].data.length; k++)
					input.push(parseInt($scope.traindata[i].data[k]));

				td.push({
					input: input,
					output: [parseInt(String.fromCharCode(parseInt($scope.traindata[i].charcode)))/10]
				})
			}

			/* El output es 0.1 = 1, 0.2 = 2, etc... */
			$scope.phrase = $scope.ready ? "Mmmm.. Claro, como no lo vi antes.." : "Ya me cepillé, voy a vestirme y estaré listo :)";

			/* Entrenamos la red */
			do
			{
			    e = 0.0;
			    it++;

			    for (var i = 0; i < td.length; i++)
			    {
			        var act = $scope.myNetwork.activate(td[i].input);
			        $scope.myNetwork.propagate(learningRate, td[i].output);

			        var enow = $scope.getTotalError(act, td[i].output);

			        e = enow > e ? enow : e;
			    }
			} while (e > error && (it < maxit || ignoreMaxIT))

			$scope.phrase = $scope.ready ? "Listo, ya lo aprendí :) ¿tienes algo más que enseñarme?" : "Estoy listo, ¿tienes algo que enseñarme?";
			$scope.ready = true;

			console.log("Terminado en", it, "iteraciones");
			console.log("Error:", e);
		}

		$scope.ask = function(){
			var post = $scope.teach;

			var askdata = [];

			for (var i = 0; i < post.mat.length; i++)
				askdata.push(parseInt(post.mat[i]));

			var answer = parseInt($scope.myNetwork.activate(askdata)*10);

			$scope.phrase = "Eso se parece a un " + answer;
		}
	};

	angular.module("adminapp").controller("MainController", MainController);
}());