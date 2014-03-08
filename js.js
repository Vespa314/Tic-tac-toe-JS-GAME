 window.onload = init;
 var gridSize = 50;
 var boardState = new Array();
 var TimeLeft = new Array();
 var WhoseTurn = 1;
 var MaxLifeTime = 6;

 function init() {
 	document.getElementById("gameboard").onmousedown = MouseClick;

 	for (var i = 0; i < 3; i++) {
 		boardState[i] = new Array();
 		TimeLeft[i] = new Array();
 		for (var j = 0; j < 3; j++) {
 			boardState[i][j] = -1;
 			TimeLeft[i][j] = 0;
 		};
 	};

 }

 function MouseClick(event) {
 	var e = event || window.event;
 	var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
 	var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
 	var div = document.getElementById("gameboard");
 	var x = (e.pageX || e.clientX + scrollX - offsetX) - div.offsetLeft;
 	var y = (e.pageY || e.clientY + scrollY - offsetY) - div.offsetTop;
 	SetGame(Math.floor(x / 50), Math.floor(y / 50))
 }

 function SetGame(x, y) {
 	if( boardState[y][x] != -1)
 		return;
 	boardState[y][x] = WhoseTurn;
 	TimeLeft[y][x] = MaxLifeTime + 1;
 	WhoseTurn = 1 - WhoseTurn;
 	for (var i = 0; i < 3; i++) {
 		for (var j = 0; j < 3; j++) {
 			if (TimeLeft[i][j] > 0) TimeLeft[i][j]--;
 			if (TimeLeft[i][j] == 0) boardState[i][j] = -1;
 		};
 	};
 	DrawGame();
 }

 function DrawGame() {
 	for (var i = 0; i < 3; i++) {
 		for (var j = 0; j < 3; j++) {
 			var grid = document.getElementById("grid" + (i + 1) + (j + 1)).getElementsByTagName("div");
 			if (boardState[i][j] == 1) grid[0].innerHTML = "x";
 			else if (boardState[i][j] == 0) grid[0].innerHTML = "o";
 			else {
 				grid[0].innerHTML = " ";
 				grid[1].innerHTML = " ";
 			}

 			if (TimeLeft[i][j] != 0)
 				grid[1].innerHTML = TimeLeft[i][j];
 		}
 	}
 }

 