
const DalesVoice = {
    fillers: [
        'Oooooh, look at them go!!!',
        "They're like a bolt from a gun, aren't they!",
        "Well, not the best I've ever seen...",
        "Come on, my loves, it's all there to be won.",
        'This is Supermarket Sweep dear, not Supermarket sleep.',
    ],
    load() {
        console.log('LOADING')
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
                </style>
            
                <div id='daleokart' style='position:relative;top:0;left:0;width:100%;background-color:white;z-index:10000'>
                    <div id='dkLoader'>
                    <div id="dalesFace" style="float:left; display: none; margin:10px;">
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
    simpleSpeak(words) {
        words = `<p style='min-width:200px; min-height:65px; font-size:16pt; vertical-align:middle;'>${words}</p>`
        this.speak(words)
    },
    speak(words) {
        $('#dalesFace').slideDown('slow', () => {
            $('#dalesVoice').show()
            document.getElementById('dalesVoice').innerHTML = words
        })
    },
    hide(words) {
        $('#dalesFace').slideUp('slow', () => {
            $('#dalesVoice').hide()
            document.getElementById('dalesVoice').innerHTML = ''
        })
    },

}
