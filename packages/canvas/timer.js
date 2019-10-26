const DkTimer = {
    duration: 0,
    current:0,
    remaining: 0,
    onChange:null,
    onEnd:null,
    Start(duration, onChange, onEnd) {
        this.duration=duration;
        this.remaining=duration;
        this.current=0;
        this.onChange = onChange;
        this.onEnd = onEnd;
        
        console.log("started")
        console.log("remaining = " + this.remaining)
        console.log("current = " + this.current)

        var cs = this.checkState
        var t = this;
        setTimeout(function(){DkTimer.updateState()}, 1000)
    },
    updateState(){
        console.log("check state");
        console.log("remaining = " + this.remaining)
        console.log("current = " + this.current)

        if(this.remaining>0){
            this.remaining--;
            this.current++;
            this.onChange({remaining:this.remaining, current:this.current})
            setTimeout(function(){DkTimer.updateState()}, 1000)
        }else{
            console.log("timed out")
        }
    }

};