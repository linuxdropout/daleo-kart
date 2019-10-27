const DkGameControl = {
    name: '',
    timeToPlay: 60,
    players: [],
    SortScores() {
        // adding some rnd scores in for testing

        this.players = allPlayers
        /*this.players.forEach(player => {
            player.score = parseInt(Math.random() * 100, 10)
        })*/

        this.players = this.players.sort(
            (a, b) => ((a.score > b.score) ? 1 : ((b.score > a.score) ? -1 : 0)),
        )
    },   
    SortScoresDesc() {
        // adding some rnd scores in for testing

        this.players = allPlayers
        /*this.players.forEach(player => {
            player.score = parseInt(Math.random() * 100, 10)
        })*/

        this.players = this.players.sort(
            (a, b) => ((a.score < b.score) ? 1 : ((b.score < a.score) ? -1 : 0)),
        )
    },
    ShowScoreboard(){
        this.SortScoresDesc();
        if(this.players.length>0){
            $("#score-board").show();
            $("#score-board-table").html();

            let s = ''
            this.players.forEach((player, index) => {
                s += `<tr><td>${player.name}</td><td style="text-align:right">£${player.score.toFixed(2) }</td><tr>`
                
            })

            $("#score-board-table").html(s);
        }else{
            $("#score-board").hide();
        }
    },
    Prepare(name, lobby) {
        this.name = name
        this.lobby = lobby
        DalesVoice.speak(`<p>That's grand, ${name}. Lovely to have you here in my supermarket, much better than that nasty Amazon.</p><p>Keep calm now, we'll have you up and running in a minute...</p>`)

        $('#registration-form').hide()

        setTimeout(() => {
            DkGameControl.StartCountdown()
        }, 3000)
    },
    StartCountdown() {
        DalesVoice.speak(`<p>Right, we're all ready now, ${this.name}, my love.</p><p>You've got ${this.timeToPlay} seconds to grab what you can... </p><p>Get ready to start shopping.... </p>`)

        setTimeout(() => {
            DkTimer.Start(5, false,
                state => DalesVoice.simpleSpeak(state.remaining + "..."),
                () => {
                    DalesVoice.simpleSpeak('Go wild in the aisles!!!')
                    DkGameControl.Start()
                })
        }, 3000)
    },
    Start() {
        DkTimer.Start(this.timeToPlay, true, state => {
            if (state.remaining % 5 === 0) {
                if (state.remaining % 10 === 0) {
                    this.SortScores()
                    DalesVoice.commentate(this.players)
                } else {
                    DalesVoice.sayFiller()
                }
            }
        },
        () => DkGameControl.ReviewItems())
        enterUsername(this.name, this.lobby)
    },
    ReviewItems() {
        $('#body').hide()

        DalesVoice.speak("<p>... and time's up.<p><p>Stop your trolley, come back over here and let's see how you've done...</p>")

        setTimeout(() => {
            let s = ''
            const currentPlayer = allPlayers.find(player => player.name === GLOBALS.player.username)

            const { basket } = currentPlayer
            basket.forEach((basketItem, index) => {
                if (index === 0) {
                    s += `
                    <p>
                        You collected one 
                        <span style="color: gold; font-weight:bold;">${basketItem.name}</span>
                        worth <span style="color: gold; font-weight:bold;">£ ${basketItem.price.toFixed()}</span>,
                    </p>`
                } else if (index === basket.length - 1) {
                    s += `
                    <p> 
                        and one <span style="color: gold; font-weight:bold;">${basketItem.name}</span>
                        worth <span style="color: gold; font-weight:bold;">£ ${basketItem.price.toFixed()}</span>!
                    </p>`
                } else {
                    s += `
                        <p>
                            one <span style="color: gold; font-weight:bold;">${basketItem.name}</span>
                            worth <span style="color: gold; font-weight:bold;">£ ${basketItem.price.toFixed()}</span>,
                        </p>`
                }
            })

            DalesVoice.speak(s)

            setTimeout(() => {
                DkGameControl.ReviewScores()
            }, 10000)
        }, 2000)
    },
    ReviewScores() {
        $('#body').hide()

        setTimeout(() => {
            this.SortScores()

            let s = ''
            this.players.forEach((player, index) => {
                if (index === 0 && this.players.length > 1) {
                    s += `<p>In last place with £${player.score}  was ${player.name}</p>`
                } else if (index === this.players.length - 1) {
                    s += `<p style='font-size:150%'> and the winner with <span style='text-weight:bold;font-size:150%;color:gold;'>£${player.score.toFixed(2)}</span>  was... <div style='text-align:center;text-weight:bold;font-size:300%;color:gold;'>${player.name}</div></p><p> Well done ${player.name}, you played out of your skin there!!!</p>`
                } else {
                    s += `<p>followed by the lovely ${player.name} who scored £${player.score.toFixed(2)}</p>`
                }
            })

            DalesVoice.speak(s)

            setTimeout(() => {
                DkGameControl.EnforcePayment()
            }, 10000)
        }, 2000)
    },
    EnforcePayment() {
        setTimeout(() => {
            const losingPlayer = this.players[0]
            let s = ''
            if (this.name === losingPlayer.name) {
                s += `
                    <p> You came last so you'll be paying for everyone else's basket. Unlucky! </p>
                `
            } else {
                s += `
                    <p> ${losingPlayer.name} came last so they'll be paying for your entire basket! </p>
                `
            }
            DalesVoice.speak(s)

            setTimeout(() => {
                DkGameControl.SignOff()
            }, 6000)
        }, 2000)
    },
    SignOff() {
        const swlogo = chrome.runtime.getURL('images/Supermarket_Sweep-logo-UK-1.png')

        DalesVoice.speak(`
            <p>Thanks for stopping by, its been lovely.</p>
            <p>I've been Dale Winton and I hope I will see you again soon but please remember...</p>
            <p style="color:gold; font-size:125%">The next time you're at the checkout and you hear the beep... </p>
            <p style="color:gold; font-size:125%">think of the fun you could be having on Supermarket Sweeeeep!</p>
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
