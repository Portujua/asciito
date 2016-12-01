(function(){
	angular.module("adminapp").factory('RESTService', function($http, $timeout){
		return {
			getTrainData: function(s){
				$http.get("api/traindata").then(function(obj){
					s.traindata = obj.data;
					s.trainNetwork();
				});
			}
		};
	})
}());