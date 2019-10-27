const DkGameControl = {
    name:"",
    timeToPlay:3,
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
        function(){DkGameControl.ReviewScores()});
        enterUsername(this.name)
    },
    ReviewScores(){
        $("#body").hide();

        DalesVoice.speak("<p>... and time's up.<p><p>Stop your trolley, come back over here and let's see how you've done...</p>");
    
        setTimeout(() => {
            DkGameControl.SignOff()
        }, 2000);
    },
    SignOff(){
        const swlogo = chrome.runtime.getURL("images/Supermarket_Sweep-logo-UK-1.png");
    
        DalesVoice.speak(`
            <p>Thanks for stopping by, its been lovely.</p>
            <p>I've been Dale Winton and I hope I will see you again soon but please remember...</p>
            <p>The next time you're at the checkout and you hear the beep... </p>
            <p>think of the fun you could be having on Supermarket Sweeeeep!</p>
        `);

        setTimeout(() => {
            DalesVoice.hide();
       
            setTimeout(() => {
                document.getElementsByTagName('BODY')[0].innerHTML = `<img id="swlogo" src="${swlogo}" style="left: 50%; margin-top: -67px; margin-left: -175px;position: absolute; top: 50%;"/>`;
    
                setTimeout(() => {
                    var url = window.location.href;    
                    if (url.indexOf('?') > -1){
                    url += '&nodale=1'
                    }else{
                    url += '?nodale=1'
                    }
                    window.location.href = url;
                }, 5000);
                
            }, 2000);
            
        }, 5000);
        
        
        


        
    }

};


