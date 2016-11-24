angular.module('userModule',['userService'])

.controller('UserController',function (User, $location, $window) {
    var self = this;
    //?????
    self.processing = true;
    User.all()
        .success(function (data) {
            self.users = data;
        });


    self.signupUser = function () {
        self.message = '';
        User.create(self.userData)
            .then(function (res) {
                self.userData = {};
                self.message = res.data.message;
                $window.localStorage.setItem('token',res.data.token);
                $location.path('/');
            });
    }
});