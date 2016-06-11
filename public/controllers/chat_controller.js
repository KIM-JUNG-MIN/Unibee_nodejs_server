var myApp = angular.module('myApp',[]);

myApp.controller('AppChat', ['$scope','$http', function($scope, $http) {
  console.log("access chat memeberlist controller");

  $http.get('/chat/memberlist').success(function(response){
    $scope.memberlist = response;
  });
}]);
