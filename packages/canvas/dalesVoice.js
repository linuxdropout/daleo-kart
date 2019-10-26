
const DalesVoice = {
    load(){
        const dwface = chrome.runtime.getURL("images/dale_winton_face.webp");
        const speechBubble=`
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
                </div>`;
        const body = document.getElementsByTagName('BODY')[0]
        body.insertAdjacentHTML('afterbegin', speechBubble)
    },
    speak(words){
        $("#dalesFace").slideDown( "slow",  function() {;
            $("#dalesVoice").show( );
            document.getElementById("dalesVoice").innerHTML = words
            
        });
    },
    hide(words){
        $("#dalesFace").slideUp( "slow",  function() {;
            $("#dalesVoice").hide( );
            document.getElementById("dalesVoice").innerHTML = "";
            
        });
    }

}



function speakDale(){
return;
    const dwface = chrome.runtime.getURL("images/dale_winton_face.webp");
    const loader = `
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
            <p>Hey!! Dale here.</p>
            <p> Why mess around with a boring old Amazon website when you can go wild in the aisles!!</p>
            <p>Come with me and play.... Dale-io Kart!!!</p>

            <button id="dkStartGame" style="float:right">Sure thing Dale... I'm in!</button>

        </div>
        <div style='clear:both'></div>
        </div>
    </div>`

    const body = document.getElementsByTagName('BODY')[0]
    body.insertAdjacentHTML('afterbegin', loader)
    //document.getElementById("daleokart").innerHTML = loader;
    $("#dalesFace").slideDown( "slow",  function() {;
    $("#dalesVoice").show( );
    });

}