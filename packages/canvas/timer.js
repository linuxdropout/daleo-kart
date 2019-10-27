const DkTimer = {
    duration: 0,
    current:0,
    remaining: 0,
    onChange:null,
    onEnd:null,
    showTimer:false,
    timerLoaded:false,
    timerBoxHider:null,
    Start(duration, showTimer, onChange, onEnd) {
        this.duration=duration;
        this.remaining=duration;
        this.showTimer=showTimer;
        this.current=0;
        this.onChange = onChange;
        this.onEnd = onEnd;

        var cs = this.checkState
        var t = this;
        if(showTimer){
            this.showTimerBox();
        }
        setTimeout(function(){DkTimer.updateState()}, 1000)
    },
    updateState(){


        if(this.remaining>0){
            this.onChange({remaining:this.remaining, current:this.current})
            this.remaining--;
            this.current++;
            setTimeout(function(){DkTimer.updateState()}, 1000)
        }else{
            this.onEnd();
            this.timerBoxHider = setTimeout(() => {
                DkTimer.hideTimerBox();
            }, 4000);
        }
        this.updateTimerBox();
    },
    showTimerBox(){
        if(!this.timerLoaded){
            this.loadTimer();
        }
        clearTimeout(this.timerBoxHider);
        this.updateTimerBox();
        $("#dkCountdown").show();
    },
    hideTimerBox(){
        if(this.remaining==0){
            $("#dkCountdown").hide();
        }
    },
    updateTimerBox(){
        $("#dkCountdown").html(this.remaining);
    },
    loadTimer(){
        const countdown=`
                <style>
                    #dkCountdown{
                        position: fixed;
                        top: 1em;
                        right: 1em;
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
                <div id="dkCountdown">
                    30
                </div>`;
        const body = document.getElementsByTagName('BODY')[0]
        body.insertAdjacentHTML('afterbegin', countdown)
        $("#dkCountdown").hide();
        this.timerLoaded=true;
    },

};