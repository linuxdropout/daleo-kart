const DkGameControl = {
    name:"",
    timeToPlay:30,
    Prepare(name) {
        this.name=name;
        DalesVoice.speak("<p>That's grand, " + name + ". Lovely to have you here in my supermarket, much better than that nasty Amazon.</p><p>Keep calm now, we'll have you up and running in a minute...</p>");
   
        $("#registration-form").hide();

        setTimeout(() => {
            DkGameControl.StartCountdown();
        }, 3000);
    },
    StartCountdown(){
        DalesVoice.speak("<p>Right, we're all ready now, " + this.name + ", my love.</p><p>You've got " + this.timeToPlay + " seconds to grab what you can... </p><p>Get set to go in.... </p>");
 
        setTimeout(() => {
            DkTimer.Start(5, false, function(state){DalesVoice.simpleSpeak(state.remaining)}, function(){DalesVoice.simpleSpeak("Go wild in the aisles!!!"); DkGameControl.Start()});  
        }, 3000);

    },
    Start(){
        DkTimer.Start(this.timeToPlay, true, function(state){
            if(state.remaining % 3==0){
                DalesVoice.sayFiller();
            }
        }, 
        function(){DalesVoice.speak("<p>... and time's up.<p><p>Stop your trolley, come back over here and let's see how you've done...</p>")});
        enterUsername(this.name)
    }

};
