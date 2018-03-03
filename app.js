// 参考api :  https://zhuanlan.zhihu.com/p/30246788

// 构造函数
var player = function () {
    this.songId = ''
    this.songName = ''
    this.artists = ''
    this.songUrl = ''
    this.picUrl = ''
    this.lyric = ''
}
var player = new player()
var musicIdList = []



var music = $('#id-music')[0]
// 播放
var togglePlay = function (event) {
    var target = $(event.target)
    if (target.hasClass('icon-play2')) {
        music.play()
    } else if (target.hasClass('icon-pause2')) {
        music.pause()
    }
}
// 暂停的时候
var playerOnpause = function () {
    $('.iconSpan i').removeClass('icon-pause2').addClass('icon-play2')
}
// 开始的时候
var playerOnplaying = function () {
    $('.iconSpan i').removeClass('icon-play2').addClass('icon-pause2')
}
// 改变音量
var changeVolume = function (num) {
    music.volume = num
}
// 改变歌曲进度
var changeProgress = function (num) {
    music.currentTime = num
}

// 秒转换成分钟
var getMinute = function (second) {
    var s = Math.round(second) % 60
    var m = (Math.round(second) - s) / 60
    if (s < 10) {
        s = '0' + s
    }
    return m + ':' + s
}
// 设置歌曲进度条
var setProgress = function (duration, currentTime) {
    var progress = $('.progress')
    var progress_num = $('.progress-num')
    var width = (currentTime / duration) * 100
    progress.css('width', `${width}%`)
    var duration_minute = getMinute(duration)
    var currentTime_minute = getMinute(currentTime)
    if (duration) {
        progress_num.text(`${currentTime_minute}/${duration_minute}`)
    }

}
// 根据歌曲播放 更新当前歌曲进度条
var uptadaProgress = function () {
    var duration = music.duration
    var currentTime = music.currentTime
    setProgress(duration, currentTime)
}

// 点击进度条
var clickProgressRange = function () {
    // e.pageX 鼠标点击的坐标  -  进度条的坐标
    var currentTime = event.pageX - $('.progress-range').offset().left
    // 获取到width为 '200px'   需要去掉px并转number
    var width = parseInt($('.progress-range').css('width').slice(0, -2))
    // 歌曲总长度 * 比例 
    var num = (currentTime / width) * music.duration
    changeProgress(num)
}
// 静音按钮
var clickMuted = function () {
    var volume = $('#id-music')[0].volume * 100
    $(this).toggleClass('icon-shengyin')
    $(this).toggleClass('icon-jingyin')
    if (music.muted) {
        music.muted = false
        $('.volume').css('width', `${volume}%`)
    } else {
        music.muted = true
        $('.volume').css('width', '0%')
    }
}
// 改变音量
var clickVolume = function () {
    var volume = event.pageX - $('.volume-range').offset().left
    var width = parseInt($('.volume-range').css('width').slice(0, -2))
    var num = volume / width
    $('.volume').css('width', `${num*100}%`)
    changeVolume(num)
}

// 搜索
var clickSearch = function (event) {
    if (event.which == 13) {
        var searchType = $('.searchType').val()
        var searchData = $('.searchIpu').val()
        var data = getSearchData(searchType, searchData)
        if (searchType == 1) {
            renderSongView(data)
        } else if (searchType == 100) {
            renderArtistsView(data)
        } else if (searchType == 1000) {
            renderSonglistView(data)
        }
    }
}

// 显示/隐藏 list
var clickToggleList = function () {
    $('#id-view').slideToggle(170);
}

// 加载歌曲
var loadSong = function (target) {
    if (target.hasClass('songName')) {
        var id = target[0].id
        var songData = getSongData(id)
        songDataToPlayer(songData)
    } else if (target.hasClass('artistsName')) {
        var id = target[0].id
        artistsIntroduce(id)
    }
}

// 加载歌手
var loadArtists = function (target) {
    if (target.hasClass('artistsName')) {
        var id = target[0].id
        artistsIntroduce(id)
    }
}

// 加载歌单
var loadPlaylists = function (target) {
    if (target.hasClass('listName')) {
        var id = target[0].id
        playlistDetails(id)
    }
}

// 事件委托
var clickView = function (event) {
    var target = $(event.target)
    // 歌曲列表
    if ($(this).hasClass('type-songs')) {
        loadSong(target)
    }
    // 歌手列表
    else if ($(this).hasClass('type-artists')) {
        loadArtists(target)
    }
    // 歌单列表
    else if ($(this).hasClass('type-playlists')) {
        loadPlaylists(target)
    }
    // 播放全部按钮
    else if ($(this).hasClass('playAll')) {
        clickPlayAll()
    }
}

// 点击切换单曲循环
var toggleLoop = function () {
    $('.loop-but.iconfont').toggleClass('icon-liebiaoxunhuan')
    $('.loop-but.iconfont').toggleClass('icon-danquxunhuan')    
}

// 播放结束后触发
var musicEnd = function () {
    var playList = $('.view .type-songs')
    var loopBut = $('.loop-but.iconfont')
    if (loopBut.hasClass('icon-liebiaoxunhuan')) {
        console.log('列表循环')
        getNextIdFromList()
    } else {
        console.log('单曲循环')
        music.play()
    }
}

// 播放全部
var clickPlayAll =function () {
    var divList = $('.type-songs .songName')
    var list = []
    for (let i = 0; i < divList.length; i++) {
        var id = divList[i].id
        list.push(id)
    }
    musicIdList = list
    console.log(musicIdList)
    getNextIdFromList()
}
// 获取下一个播放id 并播放
var getNextIdFromList = function () {
    var nowId = player.songId
    var i = musicIdList.indexOf(nowId)
    if (i == -1) {
        var id = musicIdList[0]
        playSong(id)
    } else {
        var id = musicIdList[i+1]
        playSong(id)
    }
}

// 绑定事件函数
var bindEvent = function () {
    // 自动更新进度条
    music.addEventListener("timeupdate", uptadaProgress)
    // 播放
    $('#id-player-img').on('click', togglePlay)
    // 点击进度条事件
    $('.progress-range').on('click', clickProgressRange)
    // 静音按钮
    $('.muted').on('click', clickMuted)
    // 点击音量
    $('.volume-range').on('click', clickVolume)
    // 按下回车搜索
    $('.searchIpu').on('keydown', clickSearch)
    // 点击显示/隐藏list
    $('.toggle-list').on('click', clickToggleList)
    // 点击切换单曲循环
    $('.loop-but.iconfont').on('click', toggleLoop)

    // 事件委托 view 
    $('.view').on('click', 'li', clickView)
    // 歌曲播放完成后事件
    $('#id-music').on('ended',musicEnd)
    // 歌曲暂停的时候
    $('#id-music').on('pause',playerOnpause)
    // 歌曲正在播放的时候
    $('#id-music').on('playing',playerOnplaying)
    // 播放全部按钮
    $('.playAllDiv').on('click', 'button', clickPlayAll)


    // 手机端第一次触摸播放音乐
    $('html').one('touchstart',function(){
        audio.play();
    });
}
// 显示播放全部按钮
var showPlayAll = function () {
    var html = '<button class="playAll">播放全部</button>'
    $('.playAllDiv').append(html)
} 

var playSong = function (id) {
    // 根据id 播放歌曲
    var data = getSongData(id)
    songDataToPlayer(data)
}

var __main = function () {
    bindEvent()
    playSong(410714658)
}

__main()