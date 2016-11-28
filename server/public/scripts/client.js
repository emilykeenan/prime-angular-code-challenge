var app = angular.module('myApp', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider
  .when('/enterhero', {
    templateUrl: '/views/templates/enterhero.html',
    controller: 'EnterHeroController',
    controllerAs: 'eh'
  })
  .when('/herolist', {
    templateUrl: '/views/templates/herolist.html',
    controller: 'HeroListController',
    controllerAs: 'hl'
  })
  .otherwise({
    redirectTo: 'enterhero'
  });
}]);

// begin EnterHeroController
app.controller("EnterHeroController", ["$http", function($http){
  console.log('EnterHeroController is running');
  var self = this;
  self.newHero = {};
  self.message = 'eh controller is running';
  self.powers = [];

  getSuperpowers();

  function getSuperpowers() {
    $http.get('/powers')
    .then(function(response) {
      console.log(response.data);
      self.powers = response.data;
    });
  };

  // function to add a new hero to the database
  self.addHero = function() {
    self.newHero.power_id = self.newHero.power_id.id;
    console.log('new hero: ', self.newHero.power_id);

    $http.post('/heroes', self.newHero)
    .then(function(response) {
      console.log('new hero added');
      self.newHero = {}
    });
  } // post request finished


}]); // end of EnterHeroController

// begin HeroListController
app.controller("HeroListController", ["$http", function($http){
  console.log('HeroListController is running');
  var self = this;
  self.message = 'hl controller is running';
  self.heroes = [];
  self.currentPowers = [];

  // getSuperpowers();
  getHeroes();

  function getHeroes() {
    $http.get('/heroes')
    .then(function(response) {
      console.log(response.data);
      self.heroes = response.data;
      for (var i = 0; i < self.heroes.length; i++) {
        self.currentPowers.push(self.heroes[i].name);
      }
    });
  };

  self.deleteHero = function(hero) {
    var id = hero.id;
    console.log(hero.id);
    $http.delete('/heroes/' + id)
    .then(function(response) {
      console.log('DELETE finished. Get books again.');
      getHeroes();
    });
  }

  self.editHero = function(hero) {
    var id = hero.id;
    hero.power_id = hero.name.id;
    console.log(hero);
    $http.put('/heroes/' + id, hero)
    .then(function(response) {
      getHeroes();
    });
  }

  function getSuperpowers() {
    $http.get('/powers')
    .then(function(response) {
      console.log(response.data);
      self.powers = response.data;
    });
  };

}]); // end of HeroListController
