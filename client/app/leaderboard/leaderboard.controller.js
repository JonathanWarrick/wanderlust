'use strict';

angular.module('wanderlustApp')
  .controller('LeaderboardCtrl', function ($scope, Points) {
    $scope.users = [{
      // test user 1
      position: 1,
      name: 'Jonathan',
      points: 100
    },
    {
      // test user 2
      position: 3,
      name: 'Collin',
      points: 25
    },
    {
      // test user 3
      position: 2,
      name: 'Tommy',
      points: 75
    },
    {
      // test user 4
      position: 4,
      name: 'Luby',
      points: -100
    },
    {
      // test user 5
      position: 5,
      name: 'Test User',
      points: Points.user.points
    }
    ];
  });
