angular.module('authModule',['authService'])

.controller("AuthController",function ($rootScope, $location, Auth) {
    var self = this;
    self.loggedIn = Auth.isLoggedIn();
    $rootScope.$on('$routeChangeStart', function () {
        self.loggedIn = Auth.isLoggedIn();
        Auth.getUser().then(function (data) {
            self.user = data.data;
        });
    });
    self.doLogin = function () {
        self.processing = true;
        self.error = '';
        Auth.login(self.loginData.username, self.loginData.password)
                    .success(function (data) {
                        self.processing = false;
                        Auth.getUser()
                    .then(function (data) {
                        self.user = data.data;
                    });
                if(data.success)
                    $location.path('/');
                else
                    self.error = data.message;
            });
    };
    self.doLogout = function () {
        Auth.logout();
        $location.path('/');
    };
});
