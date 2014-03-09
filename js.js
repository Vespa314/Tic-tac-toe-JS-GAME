 window.onload = init;
 var gridSize = 50;
 var boardState = new Array();
 var TimeLeft = new Array();
 var PlayerColor = 1;
 var AIColor = 0;
 var MaxLifeTime = 7;
 var EMPTY = -1;
 var GameStartFlag = 0;
 var PlayerFirst = 1;
 var MAXDepth = 10;

 function init() {
 	document.getElementById("gameboard").onclick = MouseClick;
 	for (var i = 0; i < 3; i++) {
 		boardState[i] = new Array();
 		TimeLeft[i] = new Array();
 		for (var j = 0; j < 3; j++) {
 			boardState[i][j] = EMPTY;
 			TimeLeft[i][j] = 0;
 		};
 	};

 }

 function IsPlayerFirst() {
 	var radio = document.getElementsByName("radio");
 	return radio[0].checked == true ? 1 : 0;
 }

 function StartGame() {
 	if (!GameStartFlag) {
 		document.getElementById("gameboard").style.display = "block";
 		GameStartFlag = 1;
 		if (!IsPlayerFirst()){
 			AIMove();
 			DrawGame();
 		}
 		document.getElementById("startGame").innerHTML = "结束游戏";
 	} else {
 		document.getElementById("gameboard").style.display = "none";
 		GameStartFlag = 0;
 		document.getElementById("startGame").innerHTML = "开始游戏";
 		init();
 		DrawGame();
 	}
 }

 function MouseClick(event) {
 	var e = event || window.event;
 	var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
 	var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
 	var div = document.getElementById("gameboard");
 	var x = (e.pageX || e.clientX + scrollX - offsetX) - div.offsetLeft;
 	var y = (e.pageY || e.clientY + scrollY - offsetY) - div.offsetTop;
 	var result = SetGame(Math.floor(y / 50), Math.floor(x / 50), boardState, TimeLeft, PlayerColor);
 	DrawGame();
 	if(result == -1){
 		AIMove();
 		DrawGame();
 	}
 	else if(result == AIColor){
 		alert("电脑胜出");
 	}
 	else if(result == PlayerColor){
 		alert("恭喜你打败电脑了！！你作弊了吧。。");
 	}
 }

 function SetGame(x, y, mboardState, mTimeLeft, IsPlayerMove) {
 	if (mboardState[x][y] != EMPTY)
 		return;
 	mboardState[x][y] = IsPlayerMove;

 	var result = GameFinished(mboardState);
 	mTimeLeft[x][y] = MaxLifeTime + 1;
 	if (result == -1) {
 		for (var i = 0; i < 3; i++) {
 			for (var j = 0; j < 3; j++) {
 				if (mTimeLeft[i][j] > 0) mTimeLeft[i][j]--;
 				if (mTimeLeft[i][j] == 0) mboardState[i][j] = EMPTY;
 			};
 		};
 	}
 	return result;
 }

 function DrawGame() {
 	for (var i = 0; i < 3; i++) {
 		for (var j = 0; j < 3; j++) {
 			var grid = document.getElementById("grid" + (i + 1) + (j + 1)).getElementsByTagName("div");
 			if (boardState[i][j] == PlayerColor) grid[0].innerHTML = "x";
 			else if (boardState[i][j] == AIColor) grid[0].innerHTML = "o";
 			else {
 				grid[0].innerHTML = " ";
 				grid[1].innerHTML = " ";
 			}

 			if (TimeLeft[i][j] != 0)
 				grid[1].innerHTML = TimeLeft[i][j];
 		}
 	}
 }

 function GameFinished(mboardState) {
 	for (var i = 0; i < 3; i++) {
 		if (mboardState[i][0] != EMPTY && mboardState[i][1] == mboardState[i][0] && mboardState[i][2] == mboardState[i][0])
 			return mboardState[i][0];
 		if (mboardState[0][i] != EMPTY && mboardState[1][i] == mboardState[0][i] && mboardState[2][i] == mboardState[0][i])
 			return mboardState[0][i];
 	}
 	if (mboardState[0][0] != EMPTY && mboardState[0][0] == mboardState[1][1] && mboardState[1][1] == mboardState[2][2])
 		return mboardState[0][0];
 	if (mboardState[2][0] != EMPTY && mboardState[2][0] == mboardState[1][1] && mboardState[1][1] == mboardState[0][2])
 		return mboardState[0][2];

 	return -1;
 }

 function AIMove() {
 	var MaxScore = -999999;
 	var bestmove = {x:-1,y:-1};
 	for (var i = 0; i < 3; i++) {
 		for (var j = 0; j < 3; j++) {
 			if(boardState[i][j] != EMPTY)
 				continue;
 			var boardState_t = Array2DClone(boardState);
 			var TimeLeft_t = Array2DClone(TimeLeft);

 			var result = SetGame(i, j, boardState_t, TimeLeft_t, AIColor);
 			if(result == AIColor){
 				MaxScore = 999999;
 				bestmove = {x:i,y:j};
 			}
 			else{
 				var score = MinMax(boardState_t,TimeLeft_t,0,MAXDepth);
	 			if (score >= MaxScore) {
	 				bestmove = {x:i,y:j};
	 				MaxScore = score;
	 			};
	 		}
 		}
 	}
 	if(AIColor == SetGame(bestmove.x,bestmove.y,boardState,TimeLeft,AIColor)){
 		alert("AI胜利了!!")
 	}
 }

 function MinMax(mboardState,mTimeLeft,AITurn,Depth) {
 	var curscore = 99999 * (AITurn == 1 ? -1 : 1);
 	Depth--;
 	if(!Depth) return 0;
 	for (var i = 0; i < 3; i++) {
 		for (var j = 0; j < 3; j++) {
 			if (mboardState[i][j] != EMPTY)
 				continue;
 			var boardState_t = Array2DClone(mboardState);
 			var TimeLeft_t = Array2DClone(mTimeLeft);

 			var judge = SetGame(i, j, boardState_t, TimeLeft_t, AITurn ? AIColor : PlayerColor);
 			if (judge == AIColor) return 1;
 			if (judge == PlayerColor) return -1;

 			var temp_score = MinMax(boardState_t,TimeLeft_t,AITurn ? 0 : 1,Depth);
 			if(AITurn && temp_score > curscore){
 				curscore = temp_score;
 			}else if(!AITurn && temp_score < curscore) {
 				curscore = temp_score;
 			}
 		}
 	}
 	return curscore;
 }

 function Array2DClone(src){
 	var dst = new Array();
 	for (var i = 0; i < 3; i++) {
 		dst[i] = new Array();
 		for (var j = 0; j < 3; j++) {
 			dst[i][j] = src[i][j];
 		};
 	};
 	return dst;
 }