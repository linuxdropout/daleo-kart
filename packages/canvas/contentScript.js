const base=`
  <div id='daleokart' style='position:relative;top:0;left:0;width:100%;background-color:white;z-index:10000'>
  </div>
`

const canvas = `
<div id='dkCanvas' style='position:relative;top:0;left:0;height:200;width:100%;background-color:red;z-index:10000'>
  <canvas id='canvas' style='background-color:white;float:left'></canvas>
  <div id='dkBasket'style='float:left'>Basket (value = <span id='dkBasketTotal'></span>)
    <ul id='dkBasketList'></ul>
  </div>
  <div style='clear:both'></div>
</div>`

const dwface = chrome.runtime.getURL("images/dale_winton_face.webp");
const images = [
  chrome.runtime.getURL('images/small_tile.jpg'),
  chrome.runtime.getURL('images/shelving_smaller.png'),
  chrome.runtime.getURL('images/shopping-cart.png'),
]

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
#score-board {
  position: absolute;
  top: 10px;
  right: 10px;
  color: white;
}
</style>
<div id='dkLoader'>
  <div id="dalesFace" style="float:left; display: none; margin:10px;">
    <img src = "` + dwface + `" style="height:100px;width:100px" style="float:left"/>
  </div>
  <div id="dalesVoice" class="speech-bubble" style="float:left;display: none;">
    <p>Hey!! Dale here.</p>
    <p> Why mess around with a boring old Amazon website when you can go wild in the aisles!!</p>
    <p>Come with me and play.... Dale-io Kart!!!</p>

    <button id="dkStartGame" style="float:right">Sure thing Dale... I'm in!</button>

  </div>
  <div style='clear:both'></div>
</div>`


const body = document.getElementsByTagName('BODY')[0]
body.insertAdjacentHTML('afterbegin', base)


showContent(loader);
$("#dalesFace").slideDown( "slow",  function() {;
  $("#dalesVoice").show( );
});

function showContent(content){
  document.getElementById("daleokart").innerHTML = content;
}

$('#dkStartGame').click(() => {
  
  body.innerHTML = `
    <div id='body' style="position: fixed; width: 100%; height: 100%;">
      <div id='registration-form'>
        <input type='text' name='name' id='username-input'>
        <button id='form-submit'>Start</button>
      </div>
      <div id='score-board'></div>
    </div>
  `

  document.getElementById('form-submit').addEventListener('click', () => {
    const name = document.getElementById('username-input').value
    enterUsername(name)
  })

  start(images)
})


/*
var list = document.getElementsByTagName("BODY")[0].insertAdjacentHTML("afterbegin", );

var kart = document.getElementById("dkBasketList")
var basketTotal = document.getElementById("dkBasketTotal")

DkBasket.Add("pants", "12.99")
DkBasket.Add("bananas", "4.69")

for(i=0;i<DkBasket.items.length;i++){
  var li = document.createElement('li');
  li.appendChild(document.createTextNode(DkBasket.items[i].name + " - " + DkBasket.items[i].price));
  kart.appendChild(li);
}

basketTotal.innerHTML = DkBasket.total;


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    alert(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.greeting == "spangle")
      sendResponse({farewell: "goodbye mr P"});
  });

  */