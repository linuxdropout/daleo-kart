const DkTimer = {
    duration: 0,
    current: 0,
    remaining: 0,
    onChange: null,
    onEnd: null,
    showTimer: false,
    timerLoaded: false,
    timerBoxHider: null,
    Start(duration, showTimer, onChange, onEnd) {
        this.duration = duration
        this.remaining = duration
        this.showTimer = showTimer
        this.current = 0
        this.onChange = onChange
        this.onEnd = onEnd

        const cs = this.checkState
        const t = this
        if (showTimer) {
            this.showTimerBox()
        }
        setTimeout(() => { DkTimer.updateState() }, 1000)
    },
    updateState() {
        if (this.remaining > 0) {
            this.onChange({ remaining: this.remaining, current: this.current })
            this.remaining--
            this.current++
            setTimeout(() => { DkTimer.updateState() }, 1000)
        } else {
            this.onEnd()
            this.timerBoxHider = setTimeout(() => {
                DkTimer.hideTimerBox()
            }, 4000)
        }
        this.updateTimerBox()
    },
    showTimerBox() {
        if (!this.timerLoaded) {
            this.loadTimer()
        }
        clearTimeout(this.timerBoxHider)
        this.updateTimerBox()
        $('#dkCountdown').show()
    },
    hideTimerBox() {
        if (this.remaining === 0) {
            $('#dkCountdown').hide()
        }
    },
    updateTimerBox() {
        $('#dkCountdown').html(this.remaining)
    },
    loadTimer() {
        const countdown = document.createElement('div')
        countdown.id = 'dkCountdown'
        countdown.innerHTML = 30

        const daleokart = document.getElementById('daleokart')
        daleokart.append(countdown)
        $('#dkCountdown').hide()
        this.timerLoaded = true
    },

}
