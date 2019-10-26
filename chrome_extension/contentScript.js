var base=`
  <div id='daleokart' style='position:relative;top:0;left:0;width:100%;background-color:white;z-index:10000'>
  </div>
`

var canvas = `
<div id='dkCanvas' style='position:relative;top:0;left:0;height:200;width:100%;background-color:red;z-index:10000'>
  <canvas id='canvas' style='background-color:white;float:left'></canvas>
  <div id='dkBasket'style='float:left'>Basket (value = <span id='dkBasketTotal'></span>)
    <ul id='dkBasketList'></ul>
  </div>
  <div style='clear:both'></div>
</div>`

var dwface = chrome.runtime.getURL("images/dale_winton_face.webp");

var loader = `
<div id='dkLoader' style='position:relative;top:0;left:0;height:200;width:100%;background-color:white;z-index:10000'>
  <div style="float:left">
    <img src = "` + dwface + `" style="height:100px;width:100px" style="float:left"/>
  </div>
  <div style="float:left">
    <p>Hey!! Dale here.</p>
    <p> Why mess around with a boring old Amazon website when you can go wild in the aisles!!</p>
    <p>Come with me and play.... Dale-io Kart!!!</p>
    <button id="dkStartGame">Sure thing Dale... I'm in!</button>

  </div>
  <div style='clear:both'></div>
</div>`


document.getElementsByTagName("BODY")[0].insertAdjacentHTML("afterbegin", base);

showContent(loader);

function showContent(content){
  document.getElementById("daleokart").innerHTML = content;
}

$("#dkStartGame").click(function() {
  showContent(canvas);
});

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