var list = document.getElementsByTagName("BODY")[0].insertAdjacentHTML("afterbegin", "<div id='daleokart' style='position:relative;top:0;left:0;height:200;width:100%;background-color:red;z-index:10000'>" + document.title + "</div>");

var kart = $("#daleokart")
kart.innerHTML = document.title;
