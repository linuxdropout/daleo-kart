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

        var cs = this.checkState
        var t = this;
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
        }
    }

};