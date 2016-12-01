(function(){
	angular.module("adminapp").config(function($routeProvider, $locationProvider){
		$routeProvider
			.when("/", {
				templateUrl : "views/inicio.html"
			})
			.otherwise({redirectTo : "/login"});
	});
}());