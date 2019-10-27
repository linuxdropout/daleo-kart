
// eslint-disable-next-line no-unused-vars
const DalesVoice = {
    fillers: [
        'Oooooh, look at them go!!!',
        "They're like a bolt from a gun, aren't they!",
        "Well, not the best I've ever seen...",
        "Come on, my loves, it's all there to be won.",
        'This is Supermarket Sweep dear, not Supermarket sleep.',
    ],
    load() {
        const dwface = chrome.runtime.getURL('images/dale_winton_face.webp')
        const speechBubble = `
                <style>
                .speech-bubble {
                    position: relative;
                    background: #000000;
                border-radius: .4em;
                color:white;
                padding:5px;
                padding-left:15px;
                margin:10px;
                margin-left:25px;
                vertical-align:middle;
                }
            
                .speech-bubble:after {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 50%;
                    width: 0;
                    height: 0;
                    border: 26px solid transparent;
                    border-right-color: #000000;
                    border-left: 0;
                    border-bottom: 0;
                    margin-top: -13px;
                    margin-left: -26px;
                }
                #dalesFace{
                    -webkit-transition: -webkit-transform .8s ease-in-out;
                    transition: transform .8s ease-in-out;
                }
                #dalesFace:hover {
                    transform: scale(1.5);
                    -webkit-transform: rotate(360deg);
                    transform: rotate(360deg); 
                  }
                </style>
            
                <div id='daleokart' style='position:relative;top:0;left:0;width:100%;background-color:white;z-index:10000'>
                    <div id='dkLoader'>
                    <div id="dalesFace" style="float:left; display: none; margin:10px;transition: transform .2s;">
                        <img src = "${dwface}" style="height:100px;width:100px" style="float:left"/>
                    </div>
                    <div id="dalesVoice" class="speech-bubble" style="float:left;display: none;">
                        
            
                    </div>
                    <div style='clear:both'></div>
                    </div>
                </div>`
        const left = document.getElementById('left')
        left.insertAdjacentHTML('afterbegin', speechBubble)
    },
    sayFiller() {
        this.simpleSpeak(this.fillers[Math.floor(Math.random() * this.fillers.length)])
    },
    commentate(players) {
        if (players.length <= 1) {
            const rnd = Math.floor(Math.random() * 3)
            switch (rnd) {
                case 0:
                    this.simpleSpeak("I think you might win this... There's only you playing!")
                    break
                case 1:
                    this.simpleSpeak("Quiet in here, isn't it.")
                    break
                case 2:
                    this.simpleSpeak('Is it me? No-one has turned up.')
                    break
            }
        } else {
            const leader = players[players.length - 1]
            const second = players[players.length - 2]
            console.log(leader)
            console.log(second)

            if (leader.score == second.score) {
                const rnd = Math.floor(Math.random() * 3)
                switch (rnd) {
                    case 0:
                        this.speak("<p>It's neck and neck at the top.</p> <p>Someone needs to pull it out of the bag to win this one.</p>")
                        break
                    case 1:
                        this.simpleSpeak('Too close to call at this stage, all to play for.')
                        break
                    case 2:
                        this.simpleSpeak("This one might have to be settled in the car park if they can't setle it in the supermarket.")
                        break
                }
            } else {
                const rnd = Math.floor(Math.random() * 3)
                switch (rnd) {
                    case 0:
                        this.simpleSpeak(`${leader.name} out in front at the moment but can they hold on`)
                        break
                    case 1:
                        this.simpleSpeak(`By George, ${leader.name} is on fire today`)
                        break
                    case 2:
                        this.simpleSpeak(`The rest of you need to up your game or ${leader.name} is taking home the goods.`)
                        break
                }
            }
        }
    },
    simpleSpeak(words) {
        let fontsize=16;
        if(words.length>20){fontsize=12}
        words = `<p style='min-width:200px; min-height:65px; font-size:${fontsize}pt; vertical-align:middle;'>${words}</p>`
        this.speak(words)
    },
    speak(words) {
        $('#dalesFace').slideDown('slow', () => {
            $('#dalesVoice').show()
            document.getElementById('dalesVoice').innerHTML = words
        })
    },
    hide() {
        $('#dalesFace').slideUp('slow', () => {
            $('#dalesVoice').hide()
            document.getElementById('dalesVoice').innerHTML = ''
        })
    },
}
