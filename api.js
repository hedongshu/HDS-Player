// 获取歌曲的某种信息
var getData = function (type, id) {
    var url = `https://api.imjad.cn/cloudmusic/?type=${type}&id=${id}`
    console.log(url)
    var data
    $.ajax({
        url: url,
        type: 'get',
        async: false,
        success: function (res) {
            if (res.code == 200) {
                return data = res
            }
        }
    })
    return data
}
// 获取歌曲的所有信息 songData
var getSongData = function (id) {
    var typeList = ['song', 'detail']
    var songData = {}
    for (let i = 0; i < typeList.length; i++) {
        songData[typeList[i]] = getData(typeList[i], id)
    }
    return songData
}


// 把数据渲染到页面
var renderPlayer = function (player) {
    $('#id-music').attr('src', player.songUrl)
    $('#id-show img').attr('src', player.picUrl)
    $('.song-name').text(player.songName)
    $('.artists').text(player.artists)
}

// 把歌曲信息对象传给播放器对象
var songDataToPlayer = function (songData) {
    player.songUrl = songData.song.data[0].url
    player.picUrl = songData.detail.songs[0].al.picUrl
    player.songName = songData.detail.songs[0].al.name
    player.artists = songData.detail.songs[0].ar[0].name
    console.log(player)
    renderPlayer(player)
}
// 获取搜索结果data
var getSearchData = function (type, data) {
    var url = `https://api.imjad.cn/cloudmusic/?type=search&search_type=${type}&s=${data}`
    console.log(url)
    var data
    $.ajax({
        url: url,
        type: 'get',
        async: false,
        success: function (res) {
            if (res.code == 200) {
                return data = res
            }
        }
    })
    return data
}

// 渲染歌曲列表
var renderSongView = function (data) {
    $('.view').html('')
    var list = data.result.songs
    for (let i = 0; i < list.length; i++) {
        var songName = list[i].name
        var songId = list[i].id
        var artistsName = list[i].ar[0].name
        var artistsId = list[i].ar[0].id
        var html = `
        <li class='type-songs' >
            <a class="songName" id=${songId} href="javascript:;">${songName}</a>
            <a class="artistsName" id=${artistsId} href="javascript:;">${artistsName}</a>
        </li>`
        $('.view').append(html)
    }
}

// 渲染歌手详情
var renderArtistsView = function (data) {
    $('.view').html('')
    var list = data.result.artists
    for (let i = 0; i < list.length; i++) {
        var artistsName = list[i].name
        var artistsId = list[i].id
        var picUrl = list[i].picUrl
        var html = `
        <li class='type-artists'>
            <img src=${picUrl} alt="图片">
            <a class="artistsName" id=${artistsId} href="javascript:;">${artistsName}</a>
        </li>`
        $('.view').append(html)
    }
}

// 渲染歌单列表
var renderSonglistView = function (data) {
    $('.view').html('')
    var list = data.result.playlists
    for (let i = 0; i < list.length; i++) {
        var listName = list[i].name
        var listId = list[i].id
        var playCount = list[i].playCount
        var bookCount = list[i].bookCount
        var html = `
        <li class='type-playlists'>
            <a class="listName" id=${listId} href="javascript:;">${listName}</a>
            <span>播放次数: ${playCount}</span>
            <span>歌曲数量: ${bookCount}</span>
        </li>`
        $('.view').append(html)
    }
}

// 渲染歌手详情页
var artistsIntroduce = function (id) {
    $('.view').html('')
    var data = getData('artist', id)
    if (data.code == 200) {
        var img1v1Url = data.artist.img1v1Url
        var briefDesc = data.artist.briefDesc
        var name = data.artist.name
        var hotSongs = data.hotSongs
        var html = `
            <img src=${img1v1Url} alt="图片">
            <p>${name}</p>
            <p>${briefDesc}</p>
            <button class="hotSongs">Hot Songs</button>
        `
        $('.artistsIntroduce').append(html)
    }
    $('.artistsIntroduce .hotSongs').click(function () {
        $('.artistsIntroduce').html('')
        renderSongs(hotSongs)
    })
}
// 渲染hotSongs数组内的歌曲
var renderSongs = function (arr) {
    for (let i = 0; i < arr.length; i++) {
        var id = arr[i].id
        var name = arr[i].name
        var html = `
        <li class='type-songs' >
            <a class="songName" id=${id} href="javascript:;">${name}</a>
        </li>`
        $('.view').append(html)
    }
}

// 渲染歌单详情
var playlistDetails = function (id) {
        $('.view').html('')
        var data = getData('playlist', id)
        var coverImgUrl = data.playlist.coverImgUrl
        var description = data.playlist.description
        $('.artistsIntroduce').html(`
        <img src=${coverImgUrl} alt="图片">
        <p>${description}</p>`)
        var list = data.playlist.tracks
        console.log(list)
        for (let i = 0; i < list.length; i++) {
            var id = list[i].id
            var name = list[i].name
            var html = `
            <li class='type-songs' >
                <a class="songName" id=${id} href="javascript:;">${name}</a>
            </li>`
        $('.view').append(html)
    }
}




