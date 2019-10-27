const head = document.getElementsByTagName('HEAD')[0]
const body = document.getElementsByTagName('BODY')[0]
const left = document.createElement('div')
left.id = 'left'
const right = document.createElement('div')
right.id = 'right'

body.insertBefore(right, body.firstChild)
body.insertBefore(left, body.firstChild)

const urlParams = new URLSearchParams(window.location.search)

if (!urlParams.has('nodale')) {
    DalesVoice.load()


    const welcomeText = `
  <p>Hey!! Dale here.</p>
  <p> Why mess around with a boring old Amazon website when you can go wild in the aisles!!</p>
  <p>Come with me and play.... Dale-io Kart!!!</p>
  <button id="dkStartGame" style="float:right">Sure thing Dale... I'm in!</button>
  `

    DalesVoice.speak(welcomeText)
}

// to be sorted later
setTimeout(async () => {
    $('#dkStartGame').click(async () => {
        DalesVoice.speak("<p>Marvellous. You've made the right choice.</p><p>Now let's have your name my lovely</p>")
        body.innerHTML = ''
        body.append(left)
        body.append(right)
        const scoreboardfont = chrome.runtime.getURL('fonts/scoreboard.ttf')
        head.innerHTML += /* html */`
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
                }
                #basket {
                    margin-top: 1rem;
                    display: flex;
                    flex-direction: column;
                }
                .basket-item {
                    padding: 0.5rem;
                    border: solid white 2px;
                    margin: 0.3rem;
                }
                #basket img {
                    width: 100px;
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
        right.innerHTML += /* html */`
            <div id='basket'></div>
            <div id='score-board'></div>
        `
        left.innerHTML += /* html */`
            <div id='body' style="width: 100%; height: 100%;">
                <div id='registration-form'>
                    Lobby: <input type='text' name='lobby' id='lobby-input'><br>
                    Name: <input type='text' name='name' id='username-input'><br>
                    <button id='form-submit'>Start</button>
                </div>
            </div>
        `

        DalesVoice.speak("<p>Marvellous. You've made the right choice.</p><p>Now let's have your name, my lovely.</p>")

        document.getElementById('username-input').value = new Date().getTime()
        let images = [
            chrome.runtime.getURL('images/small_tile.jpg'),
            chrome.runtime.getURL('images/shelving_smaller.png'),
            chrome.runtime.getURL('images/shopping-cart.png'),
            chrome.runtime.getURL('images/shopping-cart-left.png'),
        ]

        const response = await fetch('https://aliptahq.com/item-data', {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
            },
            redirect: 'follow',
            referrer: 'no-referrer',
        })
        const { itemData } = await response.json()
        const itemImages = itemData.map(data => data.imageSrc)
        images = images.concat(itemImages)

        document.getElementById('form-submit').addEventListener('click', () => {
            console.log(document.getElementById('lobby-input').value)
            DkGameControl.Prepare(
                document.getElementById('username-input').value,
                document.getElementById('lobby-input').value,
            )
        })

        start(images, itemData)
    })
}, 1000)
