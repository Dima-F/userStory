angular.module('storyModule', ['storyService'])

    .controller('StoryController', function (Story, Socket) {
        var self = this;
        Story.all().success(function (data) {
            self.stories = data;
        });
        self.createStory = function () {
            self.message = '';
            Story.create(self.storyData)
                .success(function (data) {
                    self.processing = false;
                    //clear up the form
                    self.storyData = {};
                    self.message = data.message;
                });
        };
        Socket.on('story', function (data) {
            self.stories.push(data);
        });
    })

    .controller('AllStoriesController', function (stories, Socket) {
        var self = this;
        self.stories = stories.data;
        Socket.on('story', function (data) {
            self.stories.push(data);
        });
    });