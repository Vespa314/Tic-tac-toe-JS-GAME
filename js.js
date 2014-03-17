 window.onload = init;
 var gridSize = 50;
 var boardState = new Array();
 var TimeLeft = new Array();
 var PlayerColor = 1;
 var AIColor = 0;
 var MaxLifeTime = 6;
 var EMPTY = -1;
 var GameStartFlag = 0;
 var PlayerFirst = 1;
 var HasWinner = 0;
 var ClickLock = 0;
 var HighLightType = {
 	p1x: -1,
 	p1y: -1,
 	p2x: -1,
 	p2y: -1,
 	p3x: -1,
 	p3y: -1,
 };

 function init() {
 	for (var i = 0; i < 3; i++) {
 		boardState[i] = new Array();
 		TimeLeft[i] = new Array();
 		for (var j = 0; j < 3; j++) {
 			boardState[i][j] = EMPTY;
 			TimeLeft[i][j] = 0;
 			document.getElementById("grid" + (i + 1) + (j + 1)).onclick = MouseClick;
 		};
 	};
 	ClickLock = 0;
 }

 function IsPlayerFirst() {
 	var radio = document.getElementsByName("radio");
 	return radio[0].checked == true ? 1 : 0;
 }

 function StartGame() {
 	if (HasWinner) {
 		GameStartFlag = 1;
 		HasWinner = 0;
 	}
 	if (!GameStartFlag) {
 		GameStartFlag = 1;
 		if (!IsPlayerFirst()) AIMove();
 		document.getElementById("startGame").innerHTML = "结束游戏";
 	} else {
 		GameStartFlag = 0;
 		document.getElementById("startGame").innerHTML = "开始游戏";
 		init();
 		DrawGame();
 	}
 	DrawGame();
 	document.getElementById("cp_dilg").innerHTML = "战个痛！！";
 }

 function MouseClick(event) {
 	if (!GameStartFlag) return;
 	if (ClickLock) return;
 	gridId = this.id;
 	y = parseInt(gridId.charAt(4)) - 1;
 	x = parseInt(gridId.charAt(5)) - 1;

 	var result = SetGame(y, x, boardState, TimeLeft, PlayerColor);
 	DrawGame();
 	if (result == -1) {
 		ClickLock = 1;
 		setTimeout('AIMove()', 800);
 	} else if (result == AIColor) {
 		document.getElementById("cp_dilg").innerHTML = "哇咔咔，我赢了！！";
 		GameStartFlag = 0;
 		HasWinner = 1;
 	} else if (result == PlayerColor) {
 		document.getElementById("cp_dilg").innerHTML = "你。。。居然赢了我。。这不科学！！";
 		GameStartFlag = 0;
 		HasWinner = 1;
 		DrawGame();
 	}
 }

 function SetGame(x, y, mboardState, mTimeLeft, IsPlayerMove) {
 	if (mboardState[x][y] != EMPTY)
 		return;
 	mboardState[x][y] = IsPlayerMove;
 	mTimeLeft[x][y] = MaxLifeTime + 1;
 	for (var i = 0; i < 3; i++) {
 		for (var j = 0; j < 3; j++) {
 			if (mTimeLeft[i][j] > 0) mTimeLeft[i][j]--;
 			if (mTimeLeft[i][j] == 0) mboardState[i][j] = EMPTY;
 		};
 	};
 	return GameFinished(mboardState);
 }

 function DrawGame() {
 	for (var i = 0; i < 3; i++) {
 		for (var j = 0; j < 3; j++) {
 			var grid = document.getElementById("grid" + (i + 1) + (j + 1)).getElementsByTagName("div");
 			grid[0].style.color = "#000";
 			if (boardState[i][j] == PlayerColor) grid[0].innerHTML = "X";
 			else if (boardState[i][j] == AIColor) grid[0].innerHTML = "O";
 			else {
 				grid[0].innerHTML = " ";
 				grid[1].innerHTML = " ";
 			}

 			if (TimeLeft[i][j] != 0)
 				grid[1].innerHTML = TimeLeft[i][j] - 1;
 		}
 	}
 	if (HasWinner) {
 		grid = document.getElementById("grid" + (HighLightType.p1x + 1) + (HighLightType.p1y + 1)).getElementsByTagName("div");
 		grid[0].style.color = "#F00";
 		grid = document.getElementById("grid" + (HighLightType.p2x + 1) + (HighLightType.p2y + 1)).getElementsByTagName("div");
 		grid[0].style.color = "#F00";
 		grid = document.getElementById("grid" + (HighLightType.p3x + 1) + (HighLightType.p3y + 1)).getElementsByTagName("div");
 		grid[0].style.color = "#F00";
 	};
 }

 function GameFinished(mboardState) {
 	for (var i = 0; i < 3; i++) {
 		if (mboardState[i][0] != EMPTY &&
 			mboardState[i][1] == mboardState[i][0] &&
 			mboardState[i][2] == mboardState[i][0]) {
 			HighLightType = {
 				p1x: i,
 				p1y: 0,
 				p2x: i,
 				p2y: 1,
 				p3x: i,
 				p3y: 2,
 			};
 			return mboardState[i][0];
 		}
 		if (mboardState[0][i] != EMPTY &&
 			mboardState[1][i] == mboardState[0][i] &&
 			mboardState[2][i] == mboardState[0][i]) {
 			HighLightType = HighLightType = {
 				p1x: 0,
 				p1y: i,
 				p2x: 1,
 				p2y: i,
 				p3x: 2,
 				p3y: i,
 			};
 			return mboardState[0][i];
 		}
 	}
 	if (mboardState[0][0] != EMPTY &&
 		mboardState[0][0] == mboardState[1][1] &&
 		mboardState[1][1] == mboardState[2][2]) {
 		HighLightType = HighLightType = {
 			p1x: 0,
 			p1y: 0,
 			p2x: 1,
 			p2y: 1,
 			p3x: 2,
 			p3y: 2,
 		};
 		return mboardState[0][0];
 	}
 	if (mboardState[2][0] != EMPTY &&
 		mboardState[2][0] == mboardState[1][1] &&
 		mboardState[1][1] == mboardState[0][2]) {
 		HighLightType = HighLightType = {
 			p1x: 2,
 			p1y: 0,
 			p2x: 1,
 			p2y: 1,
 			p3x: 0,
 			p3y: 2,
 		};
 		return mboardState[0][2];
 	}
 	return -1;
 }

 function AIMove() {
 	var MaxScore = -999999;
 	var bestmove;
 	IterDepth = 10;
 	while (MaxScore < 0 && IterDepth > 2) {
 		var MaxScore = -999999;
 		bestmove = {
 			x: -1,
 			y: -1
 		};
 		for (var i = 0; i < 3; i++) {
 			for (var j = 0; j < 3; j++) {
 				if (boardState[i][j] != EMPTY)
 					continue;
 				var boardState_t = Array2DClone(boardState);
 				var TimeLeft_t = Array2DClone(TimeLeft);

 				var result = SetGame(i, j, boardState_t, TimeLeft_t, AIColor);
 				if (result == AIColor) {
 					MaxScore = 999999;
 					bestmove = {
 						x: i,
 						y: j
 					};
 				} else {
 					var score = MinMax(boardState_t, TimeLeft_t, 0, IsPlayerFirst() ? IterDepth : IterDepth);
 					if (score >= MaxScore) {
 						bestmove = {
 							x: i,
 							y: j
 						};
 						MaxScore = score;
 					};
 				}
 			}
 		}
 		IterDepth--;
 	}
 	if (MaxScore == 1) {
 		document.getElementById("cp_dilg").innerHTML = "我已经看到结局了！！";
 	}
 	if (AIColor == SetGame(bestmove.x, bestmove.y, boardState, TimeLeft, AIColor)) {
 		document.getElementById("cp_dilg").innerHTML = "哇咔咔，我赢了！！";
 		HasWinner = 1;
 		GameStartFlag = 0;
 	}
 	DrawGame();
 	ClickLock = 0;
 }

 function MinMax(mboardState, mTimeLeft, AITurn, Depth) {
 	var curscore = 99999 * (AITurn == 1 ? -1 : 1);
 	Depth--;
 	if (!Depth) return 0;
 	for (var i = 0; i < 3; i++) {
 		for (var j = 0; j < 3; j++) {
 			if (mboardState[i][j] != EMPTY)
 				continue;
 			var boardState_t = Array2DClone(mboardState);
 			var TimeLeft_t = Array2DClone(mTimeLeft);

 			var judge = SetGame(i, j, boardState_t, TimeLeft_t, AITurn ? AIColor : PlayerColor);
 			if (judge == AIColor) return 1;
 			if (judge == PlayerColor) return -1;

 			var temp_score = MinMax(boardState_t, TimeLeft_t, AITurn ? 0 : 1, Depth);
 			if (AITurn && temp_score > curscore) {
 				curscore = temp_score;
 			} else if (!AITurn && temp_score < curscore) {
 				curscore = temp_score;
 			}
 			if (AITurn && curscore == 1) return 1;
 			else if (!AITurn && curscore == -1) return -1;
 		}
 	}
 	return curscore;
 }

 function Array2DClone(src) {
 	var dst = new Array();
 	for (var i = 0; i < 3; i++) {
 		dst[i] = new Array();
 		for (var j = 0; j < 3; j++) {
 			dst[i][j] = src[i][j];
 		};
 	};
 	return dst;
 }