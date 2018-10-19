app.controller('notificationsCtrl', function($scope, $rootScope, $http) {

  //declare vars
  $scope.messages = [];
  $scope.messagesCount = 0;
  $scope.messagesStatus = false;

  //API - set all messages in firebase as read
  $scope.setMessagesAsRead = function() {
    //set counter to zero
    $scope.messagesCount = 0;
    //mark all as read
    $http.get("/api/notifications/read")
      .then(function(response) {}).catch(function() {});
  };

  //API - remove all messages
  $scope.removeMessages = function($event) {
    //prevent popup from closing
    $event.stopPropagation();
    //set array empty
    $scope.messages = [];
    //remove all
    $http.get("/api/notifications/remove")
      .then(function(response) {

      }).catch(function() {

      });
  };

  //start functionality
  $scope.init = function(pathParam, config) {

    // Initialize Firebase
    firebase.initializeApp(config);

    var basepath = pathParam + '/';
    var newmessagePath = basepath + 'newmessage';
    var messagesPath = basepath + 'messages/';

    firebase.auth().signInWithEmailAndPassword(config.email, config.password).catch(function(error) {
      // Handle Errors here.
      console.log('error code: ' + error.code);
      console.log('error message: ' + error.message);
    });

    var newMessageDb = firebase.database().ref(newmessagePath);
    var messagesDb = firebase.database().ref(messagesPath);

    newMessageDb.on('value', function(snapshot) {
      $scope.messagesStatus = snapshot.val();
    });

    messagesDb.on('child_added', function(snapshot) {

      var message = snapshot.val();
      $scope.$apply(function() {
        $scope.messages.push(message); //add new message
        if (message.read && message.read == true) {

        } else {
          $scope.messagesCount = $scope.messagesCount + 1;
        }
      });
    });
  }
});
