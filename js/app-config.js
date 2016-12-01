(function(){
	var app = angular.module("adminapp", ["ngRoute", 'ngAnimate', "angular.filter", 'angular-loading-bar', 'ngStorage', 'toastr']);

	app.config(function(toastrConfig) {
		angular.extend(toastrConfig, {
			autoDismiss: false,
			containerId: 'toast-container',
			closeButton: true,
			closeHtml: '<button>&times;</button>',
			maxOpened: 2,    
			newestOnTop: true,
			positionClass: 'toast-top-right',
			timeOut: 2500,
			extendedTimeOut: 1000,
			tapToDismiss: true,
			progressBar: true,
			preventOpenDuplicates: false,
			target: 'body'
		});
	});
}());