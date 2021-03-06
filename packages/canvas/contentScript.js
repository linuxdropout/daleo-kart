const head = document.getElementsByTagName('HEAD')[0]
const body = document.getElementsByTagName('BODY')[0]
const left = document.createElement('div')
left.id = 'left'
const right = document.createElement('div')
right.id = 'right'
const host = 'https://aliptahq.com'

const css = scoreboardfont => /* html */`
<style>
    @font-face {
      font-family:scoreboard;
      src: url(${scoreboardfont});
    }
    body {
        display: flex;
        flex-direction: row;
        overflow-y: hidden;
        height: 100vh;
    }
    #left {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    #body {
        height: 100%;
    }
    #right {
        width: 50%;
        display: flex;
        flex-direction: row;
        background: black;
        color: white;
        font-size: 20px;
        justify-content: space-around;
    }
    #score-board {
        margin-top: 1rem;
        font-weight: bold;
        display: flex;
        flex-direction: column;
        font-family: scoreboard;
        border:1px solid white;
        border-radius: 15px;
        padding:20px;
    }
    #basket {
        margin-top: 1rem;
        display: flex;
        flex-direction: column;
        padding-right:10px;
        padding-left:5px;
        margin:15px;
    }
    .basket-item {
        padding: 3px;
        border: solid gray 1px;
        margin: 0.3rem;
        font-size:8pt;
        text-align:center;
    }
    #basket img {
        width: 25px;
    }
    #dkLoader {
        display: inline-block;
    }
    #dkCountdown{
        display: inline-block;
        margin: 1rem;
        float: right;
        background-color:blue;
        border-width:7px;
        border-color:cyan;
        border-style:solid;
        padding:12px;
        font-size:40pt;
        color:#ffe100;
        z-index:20000;
}
</style>
`

body.insertBefore(right, body.firstChild)
body.insertBefore(left, body.firstChild)

const urlParams = new URLSearchParams(window.location.search)

if (!urlParams.has('nodale')) {
    DalesVoice.load()

    const welcomeText = /* html */`
        <p>Hey!! Dale here.</p>
        <p>Why mess around with a boring old Amazon website when you can go wild in the aisles!!</p>
        <p>Come with me and play.... Dale-io Kart.... on Supermarket Sweep!!!</p>
        <button id="dkStartGame" style="float:right">Sure thing Dale... I'm in!</button>
    `

    DalesVoice.speak(welcomeText)
}

function setBodyContent(html) {
    const bodyElement = document.getElementById('body')
    bodyElement.innerHTML = html
}

async function makeApiCall(path, method = 'GET', postBody) {
    const request = {
        method,
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        redirect: 'follow',
        referrer: 'no-referrer',
    }
    if (postBody) {
        request.body = JSON.stringify(postBody)
    }
    const response = await fetch(`${host}${path}`, request)
    return response.json()
}

async function preLoad() {
    let images = [
        chrome.runtime.getURL('images/small_tile.jpg'),
        chrome.runtime.getURL('images/shelving_smaller.png'),
        chrome.runtime.getURL('images/shopping-cart.png'),
        chrome.runtime.getURL('images/shopping-cart-left.png'),
    ]

    const { itemData } = await makeApiCall('/item-data')
    const itemImages = itemData.map(data => data.imageSrc)
    images = images.concat(itemImages)

    start(images, itemData)
}

async function actuallyStartTheGame(playerName, lobbyName) {
    DkGameControl.Prepare(
        playerName,
        lobbyName,
    )
}

// to be sorted later
setTimeout(async () => {
    $('#dkStartGame').click(async () => {
        DalesVoice.speak("<p>Marvellous. You've made the right choice.</p><p>Now let's have your name my lovely</p>")
        body.innerHTML = ''
        body.append(left)
        body.append(right)
        const scoreboardfont = chrome.runtime.getURL('fonts/scoreboard.ttf')
        head.innerHTML += css(scoreboardfont)

        right.innerHTML += /* html */`
            <div id='basket'></div>
            <div id='score-board'><h1>Scores</h1><h3 id="score-board-lobby">Lobby : </h3><table id='score-board-table'></table></div>
        `
        $('#basket').hide()
        $('#score-board').hide()

        left.innerHTML += /* html */`
            <div id='body' style="width: 100%; height: 100%;"></div>
        `
        setBodyContent(/* html */`
            <div id='registration-form'>
                Lobby: <input type='text' name='lobby' id='lobby-input'><br>
                Name: <input type='text' name='name' id='username-input'><br>
                <button id='form-submit'>Start</button>
            </div>
        `)

        DalesVoice.speak("<p>Marvellous. You've made the right choice.</p><p>Now let's have your name, my lovely.</p>")

        document.getElementById('username-input').value = ''

        document.getElementById('form-submit').addEventListener('click', () => {
            const uname = document.getElementById('username-input').value
            const lname = document.getElementById('lobby-input').value

            if (uname && lname) {
                actuallyStartTheGame(
                    uname,
                    lname,
                )
            }
        })

        preLoad()
    })
}, 1000)
