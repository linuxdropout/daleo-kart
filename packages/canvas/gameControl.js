const DkGameControl = {
    name: '',
    timeToPlay: 30,
    Prepare(name) {
        this.name = name
        DalesVoice.speak(`<p>That's grand, ${name}. Lovely to have you here in my supermarket, much better than that nasty Amazon.</p><p>Keep calm now, we'll have you up and running in a minute...</p>`)

        $('#registration-form').hide()

        setTimeout(() => {
            DkGameControl.StartCountdown()
        }, 3000)
    },
    StartCountdown() {
        DalesVoice.speak(`<p>Right, we're all ready now, ${this.name}, my love.</p><p>You've got ${this.timeToPlay} seconds to grab what you can... </p><p>Get set to go in.... </p>`)

        setTimeout(() => {
            DkTimer.Start(5, false, state => { DalesVoice.simpleSpeak(state.remaining) }, () => { DalesVoice.simpleSpeak('Go wild in the aisles!!!'); DkGameControl.Start() })
        }, 3000)
    },
    Start() {
        DkTimer.Start(this.timeToPlay, true, state => {
            if (state.remaining % 3 == 0) {
                DalesVoice.sayFiller()
            }
        },
        () => { DkGameControl.ReviewScores() })
        enterUsername(this.name)
    },
    ReviewScores() {
        $('#body').hide()

        DalesVoice.speak("<p>... and time's up.<p><p>Stop your trolley, come back over here and let's see how you've done...</p>")

        setTimeout(() => {
            //

            // adding some rnd scores in for testing
            allPlayers.forEach(player => {
                player.score = parseInt(Math.random() * 100)
            })

            allPlayers = allPlayers.sort((a, b) => ((a.score > b.score) ? 1 : ((b.score > a.score) ? -1 : 0)))

            let s = ''
            allPlayers.forEach((player, index) => {
                if (index === 0) {
                    s += `<p>In last place with ${player.score}  was ${player.name}</p>`
                } else if (index === allPlayers.length - 1) {
                    s += `<p style='font-size:150%'> and the winner with <span style='text-weight:bold;font-size:150%;color:gold;'>${player.score}</span>  was... <div style='text-align:center;text-weight:bold;font-size:300%;color:gold;'>${player.name}</div></p><p> Well done ${player.name}, you played out of your skin there!!!</p>`
                } else {
                    s += `<p>followed by ${player.name} who scored ${player.score}</p>`
                }
            })

            DalesVoice.speak(s)

            setTimeout(() => {
                DkGameControl.SignOff()
            }, 10000)
        }, 2000)
    },
    SignOff() {
        const swlogo = chrome.runtime.getURL('images/Supermarket_Sweep-logo-UK-1.png')

        DalesVoice.speak(`
            <p>Thanks for stopping by, its been lovely.</p>
            <p>I've been Dale Winton and I hope I will see you again soon but please remember...</p>
            <p>The next time you're at the checkout and you hear the beep... </p>
            <p>think of the fun you could be having on Supermarket Sweeeeep!</p>
        `)

        setTimeout(() => {
            DalesVoice.hide()

            setTimeout(() => {
                document.getElementsByTagName('BODY')[0].innerHTML = `<img id="swlogo" src="${swlogo}" style="left: 50%; margin-top: -67px; margin-left: -175px;position: absolute; top: 50%;"/>`

                setTimeout(() => {
                    let url = window.location.href
                    if (url.indexOf('?') > -1) {
                        url += '&nodale=1'
                    } else {
                        url += '?nodale=1'
                    }
                    window.location.href = url
                }, 5000)
            }, 2000)
        }, 5000)
    },

}
