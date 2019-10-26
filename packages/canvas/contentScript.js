const base = `
  <div id='daleokart' style='position:relative;top:0;left:0;width:100%;background-color:white;z-index:10000'>
  </div>
`

const dwface = chrome.runtime.getURL('images/dale_winton_face.webp')
alert(dwface)
const images = [
    chrome.runtime.getURL('images/small_tile.jpg'),
    chrome.runtime.getURL('images/shelving_smaller.png'),
    chrome.runtime.getURL('images/shopping-cart.png'),
]

const loader = `
<div id='dkLoader' style='position:relative;top:0;left:0;height:200;width:100%;background-color:white;z-index:10000'>
  <div style="float:left">
    <img src = "${dwface}" style="height:100px;width:100px" style="float:left"/>
  </div>
  <div style="float:left">
    <p>Hey!! Dale here.</p>
    <p> Why mess around with a boring old Amazon website when you can go wild in the aisles!!</p>
    <p>Come with me and play.... Dale-io Kart!!!</p>
    <button id="dkStartGame">Sure thing Dale... I'm in!</button>

  </div>
  <div style='clear:both'></div>
</div>`


const body = document.getElementsByTagName('BODY')[0]
body.insertAdjacentHTML('afterbegin', base)

showContent(loader)

function showContent(content) {
    document.getElementById('daleokart').innerHTML = content
}

$('#dkStartGame').click(() => {
    body.innerHTML = '<div id="body" style="position: fixed; width: 100%; height: 100%;"><canvas id="canvas"></canvas></div>'
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
