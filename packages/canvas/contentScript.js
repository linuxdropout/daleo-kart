/*

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
</div>`*/

DalesVoice.load();

var welcomeText=`<p>Hey!! Dale here.</p>
<p> Why mess around with a boring old Amazon website when you can go wild in the aisles!!</p>
<p>Come with me and play.... Dale-io Kart!!!</p>

<button id="dkStartGame" style="float:right">Sure thing Dale... I'm in!</button>`

DalesVoice.speak(welcomeText);

//to be sorted later
setTimeout(() => {
  $('#dkStartGame').click(() => {

    const body = document.getElementsByTagName('BODY')[0]

    body.innerHTML = `
      <style>
        #score-board {
          position: absolute;
          top: 10px;
          right: 10px;
          color: white;
        }
      </style>
      <div id='body' style="position: fixed; width: 100%; height: 100%;">
        <div id='registration-form'>
          <input type='text' name='name' id='username-input'>
          <button id='form-submit'>Start</button>
        </div>
        <div id='score-board'></div>
      </div>
    `
  
    const images = [
      chrome.runtime.getURL('images/small_tile.jpg'),
      chrome.runtime.getURL('images/shelving_smaller.png'),
      chrome.runtime.getURL('images/shopping-cart.png'),
    ]
  
    document.getElementById('form-submit').addEventListener('click', () => {
      const name = document.getElementById('username-input').value
      enterUsername(name)
    })
  
    start(images)
  })
}, 2000);


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