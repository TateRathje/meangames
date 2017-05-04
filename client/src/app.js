import angular from 'angular'

angular.module('olympics', [])
.controller('sportsController', function($http){
	// this.sports = ["Weightlifting", "Cycling"];
	$http.get('/sports').then((response) => {
		this.sports = response.data;
	});
})

