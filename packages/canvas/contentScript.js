const head = document.getElementsByTagName('HEAD')[0]
const body = document.getElementsByTagName('BODY')[0]
const left = document.createElement('div')
left.id = 'left'
const right = document.createElement('div')
right.id = 'right'

body.insertBefore(right, body.firstChild)
body.insertBefore(left, body.firstChild)

DalesVoice.load()

const welcomeText = `<p>Hey!! Dale here.</p>
<p> Why mess around with a boring old Amazon website when you can go wild in the aisles!!</p>
<p>Come with me and play.... Dale-io Kart!!!</p>

<button id="dkStartGame" style="float:right">Sure thing Dale... I'm in!</button>`

DalesVoice.speak(welcomeText)

// to be sorted later
setTimeout(() => {
    $('#dkStartGame').click(async () => {
        DalesVoice.speak("<p>Marvellous. You've made the right choice.</p><p>Now let's have your name my lovely</p>")
        body.innerHTML = ''
        body.append(left)
        body.append(right)
        head.innerHTML += `
          <style>
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
              height: 100%
            }
            #right {
              width: 200px;
              display: flex;
              flex-direction: column;
              background: black;
              color: white;
              font-size: 20px;
            }
            #score-board {
              font-weight: bold;
            }
            #basket {
              margin-top: 1rem;
            }
            #basket > img {
              width: 50%;
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
        right.innerHTML += `
          <div id='score-board'>
            <h3> Scores </h3>
          </div>
          <div id='basket'>
            <div> Your basket </div>
          </div>
        `
        left.innerHTML += `
          <div id='body' style="width: 100%; height: 100%;">
            <div id='registration-form'>
              <input type='text' name='name' id='username-input'>
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
            DkGameControl.Prepare(document.getElementById('username-input').value)
        })

        start(images, itemData)
    })
}, 1000)
