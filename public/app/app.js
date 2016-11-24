angular.module("myApp",['appRoutes','authModule','authService',
    'userModule','storyService','storyModule','reverseDirective'])

.config(function ($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
});
