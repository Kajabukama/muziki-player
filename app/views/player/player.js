var app = angular.module('Player.player', ['ngRoute']);
app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/player', {
            templateUrl: './views/player/player.html',
            controller: 'PlayerController'
        })
}])

app.controller('PlayerController', ['$scope','$location', function ($scope, $location){

    console.log('Player Controller loaded');
    $scope.selectedMusic = false;
    $scope.trackName = null;
    $scope.songPlaying = false;
    $scope.playListVisible = false;
    $scope.wave = null;
    $scope.songList = [];

    const ipc = require('electron').ipcRenderer;
    const path = require('path');

    ipc.on('modal-file-content', function (event, arg){

        console.log(arg.path);
        $scope.songList = arg.files;

        var songsArrayForPlaying = [];

        for (var i = 0; i < $scope.songList.length; i++) {
            songsArrayForPlaying.push({
                title: arg.path + '/' + $scope.songList[i],
                file: arg.path  + '/' + $scope.songList[i],
                howl: null,
                name:path.parse($scope.songList[i]).name,
            });
        }
        console.log(songsArrayForPlaying);

        $scope.player = new Player(songsArrayForPlaying);

        $scope.selectedMusic = true;
        $scope.wave =  new SiriWave({
            container: waveform,
            width: window.innerWidth,
            height: window.innerHeight * 0.5,
            cover: true,
            speed: 0.03,
            amplitude: 0.7,
            frequency: 2,
            color: '#0be881'
        });
        $scope.wave.start();
        $scope.$apply();
    });

    $scope.seekToTime =  function($event) {
        $scope.player.seek(($event.clientX) / (window.innerWidth));
    }

    $scope.playPlaylistSong =  function (index) {
        $scope.player.skipTo(index);
        $scope.songPlaying = true;
    }
    $scope.prevSong = function () {
        $scope.player.skip('prev');
        $scope.songPlaying = true;
    }

    $scope.nextSong = function () {
        $scope.player.skip('next');
        $scope.songPlaying = true;
    }

    $scope.showPlayList =  function (){
        if ($scope.playListVisible) {
            document.getElementById('list-menu').addEventListener('click', function(){
                $('.ui.dropdown.list-menu').dropdown({
                    direction: 'upward'
                });
            })
            $scope.playListVisible = false;
        }
        else {
            $scope.playListVisible = true;
        }
    }

    $scope.playMusic =  function () {
        if ($scope.songPlaying) {
            $scope.songPlaying = false;
            $scope.player.pause();
        }
        else {
            $scope.songPlaying = true;
            $scope.player.play();
        }
    }

    // create a Player object
    var Player =  function (playlist) {
        this.playlist = playlist;
        this.index = 0;
    }

    Player.prototype =  {

        // play function of the Player object
        play: function (index) {
            var self = this;
            var sound = null;
            index =  typeof index === 'number' ? index : self.index;
            var data = self.playlist[index];
            $scope.trackName = path.parse(data.name).name;

            if (data.howl) {
                sound = data.howl;
            }
            else {
                sound = data.howl = new Howl({
                    src: [data.file],
                    html5: true,
                    onplay: function(){
                        $scope.timer = self.formatTime(Math.round(sound.duration()));
                        requestAnimationFrame(self.step.bind(self));
                        $scope.$apply();
                    },
                    onend: function () {
                        self.skip('prev');
                    }
                })
            }
            sound.play();
            self.index = index;
        },

        formatTime: function (secs) {
            var minutes = Math.floor(secs/60) || 0;
            var seconds = ( secs - minutes * 60) || 0;
            return minutes + ':' + ( seconds < 10 ? '0' : '') + seconds;
        },

        step: function () {
            var self = this;
            var sound =  self.playlist[self.index].howl;
            var seek =  sound.seek() || 0;
            progress.style.width = (((seek / sound.duration()) * 100) || 0 ) + '%';
            if (sound.playing()) {
                requestAnimationFrame(self.step.bind(self));
            }
        },

        // pause function of the Play object
        pause: function (index) {
            var self = this;
            var sound = self.playlist[self.index].howl;
            sound.pause();
        },

        // skip function of the Player object
        skip: function (direction) {
            var self = this;
            var index =  0;

            if (direction === 'prev') {
                index = self.index - 1;
                if (index < 0 ) {
                    index = self.playlist.length - 1;
                }
            }
            else {
                index = self.index + 1;
                if (index >= self.playlist.length) {
                    index = 0;
                }
            }
            self.skipTo(index);
        },

        // skip-to function of then player object
        skipTo: function (index) {
            var self = this;
            if (this.playlist[self.index].howl) {
                this.playlist[self.index].howl.stop();
            }
            self.play(index);
        },

        // seek function of the Player object
        seek: function (time) {
            var self = this;
            var sound = self.playlist[self.index].howl;
            if (sound.playing()) {
                sound.seek(sound.duration * time);
            }
        }
    }

}]);
