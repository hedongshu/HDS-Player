var music = $('#id-music')[0]
var play = function () {
    music.play()
}
var pause = function () {
    music.pause()
}
var changeVolume = function (num) {
    music.volume = num
}
var changeProgress = function (num) {
    music.currentTime = num
}

var showtime = function () {
    
}
var songLength = $('#id-music')[0].duration
music.addEventListener("timeupdate", showtime, true);