const DkGameControl = {
    name:"",
    timeToPlay:30,
    Prepare(name) {
        this.name=name;
        DalesVoice.speak("<p>That's grand, " + name + ". Lovely to have you here in my supermarket.</p><p>Keep calm now, we'll have you up and running in a minute...</p>");
   
        $("#registration-form").hide();

        setTimeout(() => {
            DkGameControl.StartCountdown();
        }, 3000);
    },
    StartCountdown(){
        DalesVoice.speak("<p>Right, we're all ready now, " + this.name + ", my love.</p><p>You've got " + this.timeToPlay + " seconds to grab what you can... </p><p>Get set to go in.... </p>");
 
        setTimeout(() => {
            DkTimer.Start(5, function(state){DalesVoice.simpleSpeak(state.remaining)}, function(){DalesVoice.simpleSpeak("Go wild in the aisles!!!"); DkGameControl.Start()});  
        }, 3000);

    },
    Start(){
        DkTimer.Start(10, function(state){DalesVoice.simpleSpeak(state.remaining)}, function(){DalesVoice.simpleSpeak("All done!!!")});
        enterUsername(this.name)
    }

};
