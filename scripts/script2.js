var bookmarksArray = new Array();
var learningSessionArray = new Array();
var testSessionArray = new Array();
var url = new URL(window.location.href);
var	NumberOfPhases = 4
isTraining = false;
pauseTimer = false;
bookmarked = false;
allowBookmark = true;
sampleRound	= false;
totalHeightOfDoc = $('.main').height();
experimentRound  = 1;
var currentIdInBookmarkArray=-1;
timeTick = 0;
TRAINING_SESSION_AFTER_BOOKMARK = 20 ; // 5 s
TRAINING_SESSION_BEFORE_BOOKMARK = 40 ; // 5 s
EXPERIMENT_TIMER_DELAY = 60000 * 100;

iconMenuTimePassed = 0;
TIME_TO_CHOSE_ICON = 15;

NUMBER_OF_ROUNDS = 3;

var currentBookmark = -1;
var SCROLL_STEP = 150;
var currentTarget = 0;
var subjectId;
var interfaceNumber;
var preRoundLastId = -1;
var	logId= 0;
var iconMenuLog = "";
var userLabelArray = [];
var userIconslist = [];
var randomIconslist = [];
var modalOpen = false;


$(document).ready(function(){

	icons = -1;
	SampleRound = url.searchParams.get("SampleRound");
	interfaceNumber = url.searchParams.get("interface");	
	if(SampleRound === "true"){
		SampleRound = true;
	}
	switch (interfaceNumber){
		case "plain": //No Icons
		case "randomIcon": // Random icons 
		case "userselectedIcon": // user Picked icons
			$("#bookmarklist").hide();
		break;
		case "autolabel": // user Picked icons
		case "userlabel": // user Picked icons
			$("#bookmarklist").show();
		break;
	}
	
	
	setBookmarksArray();
	currentPhase = parseInt(url.searchParams.get("phase"));

	subjectId = url.searchParams.get("subjectId");


	result = getPhaseData(currentPhase);
	learningSessionArray = result.learningSessionArray
	testSessionArray = result.testSessionArray
	startPhase(currentPhase);

	$(document).keyup(function(e){
		//alert(e.which);
		switch(e.which){
			case 66: //B
				if(!isTraining) return;
				if(!allowBookmark) return;
				placeBookmark();
				timeTick = 0;
				allowBookmark = false;
			break;
			case 32: //Space

				if(!bookmarked) return;

				allowBookmark = true;
		
				if(currentBookmark >= learningSessionArray.length){
					
					return;
				}
				if(!isTraining) return;
				if(!bookmarked){
					msg = "Please Bookmark the page by pressing B before going to next page" ;
					swal({
						text: msg,
						//icon: "success",
						button: "OK",
						allowOutsideClick: false,
						closeOnClickOutside: false,
					}).then((willDelete) => {
						timeTick = 0;
					});
					return;
				}
				

				gotoNextBookmark();
				bookmarked = false;
				timeTick = 0;
				break;
			 case 81: //Q
				scrollIndex -= 200;
	
			break;
			case 87: //W
				//excapeTraining();
				scrollIndex += 200;
			break;
			/*case 83: //S
				savelog();
			break;

			case 89: //y
				console.log("main :" + $(".main").css("margin-top"));
				console.log("index :" + $("#secondScrollIndex").css("top"));
				str = "main :" + $(".main").css("margin-top") + "<br/>";
				str += "index :" + $("#secondScrollIndex").css("top");
				
				$("#logContainer").text(str);
				

					
				
			break;*/
/* 			case 70: //f
				console.log("main :" + $(".main").css("margin-top"));
				console.log("index :" + $("#secondScrollIndex").css("top"));
				str = "main :" + $(".main").css("margin-top") + "<br/>";
				str += "index :" + $("#secondScrollIndex").css("top");
				
				$("#logContainer").text(str);
				
					currentBookmark++;
					appendBookmark(currentBookmark);
					$("#bm"+currentBookmark).css({"top":$("#secondScrollIndex").css("top")});
					
				
			break; */
			case 80: //P
				//showsurvayLink();
							goToTheFirstPage();

					excapeTraining();
				
			break;
			 
		}
	});

	$(document).on('click', '.bookmark', function(e){
		if(!isExperimenting) return;
		index = parseInt($(e.target).attr("id").replace("bm", ""));
		currentBookmark = index;
		tempIndex = findIndexInbookmarkArray(index);
		gotoBookmark(testSessionArray,tempIndex);
		isTarget(index);
		if(isTraining) timeTick = 0;
	});
	
	
	$("#logContainer").hide();
	alignMainCenter();
	
	if(currentPhase > 1){
		result = getPhaseData(currentPhase-1);
		showAllBookmarks(result.testSessionArray)
	}else{
		document.cookie = "userLabelArray=";
		document.cookie = "userIconslist=";
		document.cookie = "randomIconslist=";
	}
	
	
	$('.main , body').bind('mousewheel', function(e){
		if(e.originalEvent.wheelDelta < 0) {
			//scroll down todo
			scrollThePage(false)
		}else {
			//scroll up todo
			scrollThePage(true)
		}
		//console.log("Margin: "+$('.main').css('margin-top'));
		return false;
	});
	
	
	$("#modal .icon").click(function(e){
		if(currentBookmark >= bookmarksArray.length ) return;
		thumTop = bookmarksArray[currentIdInBookmarkArray].index;
		index = parseInt($(e.target).attr("id").replace("icon", ""));
		
		$("#scroll2").append("<div id='bm"+currentIdInBookmarkArray
					+"' class='bookmark orangeBc' ><img  class='icon' id='bm"+currentIdInBookmarkArray
					+"' src='icons/"+index+".png' /></div>");
		userIconslist.push({"id":currentIdInBookmarkArray,"time":iconMenuTimePassed,"icon":index});
		$("#bm"+currentIdInBookmarkArray).css({"top":thumTop + "px"});
		$("#modal").hide();
		timeTick=0;
		pauseTimer = false;
		iconMenuLog += "," + iconMenuTimePassed ;
		console.log("iconMenuTimePassed: "+iconMenuTimePassed);
		iconMenuTimePassed = 0;
		clearInterval(iconMenuTimer);
		bookmarked = true;


	});
	
	

	
	

});

function scrollThePage(direction){
	dir = "";
	if(direction){
		dir = "U";
		if(scrollIndex == 0) return false;
		scrollIndex++;
	}else{
		if(currentMargin+500 > totalHeightOfDoc) return;
		dir = "D";
		scrollIndex--;
	}
	$('.main').css('margin-top', (scrollIndex * SCROLL_STEP)  + "px");
	CalculateScrollThumb();
}


function CalculateScrollThumb(){
	currentMargin = Math.abs(parseInt($('.main').css('marginTop')));
	totalHeightOfDoc = $('.main').height();
	heightOfScrollbar = $(".iconContainer").height();
	indexPos = (currentMargin*heightOfScrollbar)/totalHeightOfDoc;
	$("#secondScrollIndex").css({"top": ( indexPos ) +"px" });
}

function alignMainCenter(){
	widthOfWindow= $(window).outerWidth();
	mainWidth = parseInt($(".main").css('width'));
	SCWidth = parseInt($(".scrollbarContainer").css('width'));
	margin = (widthOfWindow /2) - (mainWidth/2) - SCWidth;
	$(".main").css('margin-left',margin+'px');
}

function excapeTraining(){
	startExperiment()
}

function nextRound(){
	if(experimentRound < NUMBER_OF_ROUNDS){
		// We still have more rounds to continue.
		testSessionArray = shuffle(testSessionArray);

		pauseTimer = true;
		timeTick =0;
		swal({
			title: "Round " + (experimentRound) + " out of " + NUMBER_OF_ROUNDS + " is finished",
			text: " You need to find the same targets again",
			//icon: "success",
			button: "Start",
			allowOutsideClick: false,
			closeOnClickOutside: false,
		}).then(() => {
			goToTheFirstPage();
			startNewRound();
			requestNextScreenshot();
		});
	}else{
		//experiment is over
		savelog();

		timeTick = 0;
		pauseTimer = true;
	}
}


function savelog(){
	if(sampleRound) return;

	log = $("#logContainer").html();
	
	console.log($("#logContainer").text());
	
	var request = $.ajax({
		url: "ajax/index.php",
		method: "POST",
		data: { 
			log : log,
			subjectId : subjectId,
		},
		dataType: "html"
	});

	
	request.done(function( msg ) {
		alert( msg );
		if(currentPhase >= NumberOfPhases){
		  showsurvayLink();
		}else{
			swal({
				title: "Please Press Next to go to next Phase",
				text: " ",
				icon: "success",
				button: "Finish",
				allowOutsideClick: false,
				closeOnClickOutside: false,
			}).then(() => {
				//window.location = "http://127.0.0.1/bookmark/standard1.html?phase="+ (parseInt(currentPhase)+1);

			});
	  
		}
	  
	  
		
	});
	 
	request.fail(function( jqXHR, textStatus ) {
	  alert( "Request failed: Call Ehsan" );
	});
}


function requestNextScreenshot(){
	if(currentTarget >= testSessionArray.length) return;

	index = testSessionArray[currentTarget].id + 1;
	//console.log("ScreenShot="+ index);
	document.cookie = "ScreenShot="+ index;
}

/* function findScreenshotIndex(){
	inputScrollIndex = testSessionArray[currentTarget].p
	console.log(currentTarget);
	console.log(testSessionArray);
	console.log(inputScrollIndex);
	for(x in bookmarksArray ){
		if(bookmarksArray[x].p == inputScrollIndex ){
			return x
		}
	}
} */

	
function startNewRound(){
	experimentRound++;
	currentTarget = 0;
	//shuffle(testSessionArray);
	while(preRoundLastId == testSessionArray[0]){
			console.log(testSessionArray);
			//shuffle(testSessionArray);
			
	}
	
	preRoundLastId = testSessionArray[testSessionArray.length - 1];
	
	
	
	pauseTimer = false;
}


function findIndexInbookmarkArray(index){
	scrollIndex = bookmarksArray[index].index;
	for(x in testSessionArray ){
		if(testSessionArray[x].index == scrollIndex ){
			return x
		}
	}
}



//////////////////////////////
// Experiment
/////////////////////////////
function startExperiment(){
	document.cookie = "userLabelArray="+ JSON.stringify(userLabelArray);
	document.cookie = "userIconslist="+ JSON.stringify(userIconslist);
	document.cookie = "randomIconslist="+ JSON.stringify(randomIconslist);

	clearInterval(trainingTimer);
	saveIconMenuLog();
	startTime = Date.now();
	startTimeToComplete = Date.now();
	isTraining = false;
	testSessionArray = shuffle(testSessionArray);
	requestNextScreenshot();
	startExperimentTimer();
	console.log(userLabelArray);
	console.log(userIconslist);
	console.log(randomIconslist);

	timeTick=0;
}


function startExperimentTimer(){
	isExperimenting = true;
	pauseTimer = false;
	experimentTimer = setInterval(function(){ 
		if (!pauseTimer) timeTick++;
		if(timeTick > EXPERIMENT_TIMER_DELAY){
			makeLog(false,"to",currentBookmark);
			timeTick=0;
			pauseTimer = true;
			swal({
				title: "Time up!",
				text: "click next to get next target",
				//icon: "error",
				button: "Next",
				allowOutsideClick: false,
				closeOnClickOutside: false,
			}).then((willDelete) => {
				timeTick=0;
				pauseTimer = false;
				currentTarget++;
				if(currentTarget >= testSessionArray.length){
					nextRound();
				}
				requestNextScreenshot();
				goToTheFirstPage();
				if(currentTarget < testSessionArray.length) console.log("CT: "+testSessionArray[currentTarget].id);
			});
			
		}
		
	}, 10 );
	

}

function isTarget(index){

	if(currentTarget >= testSessionArray.length) return;
	if(testSessionArray[currentTarget].id == index){

		//it is target.
		makeLog(true,"click",index);
		currentTarget++;
		
//		if(currentTarget < testSessionArray.length) console.log("nextTarget: "+testSessionArray[currentTarget].id);
		pauseTimer = true;
		modalOpen = true;
		swal({
			title: "Correct",
			//icon: "success",
			button: "Next",
			allowOutsideClick: false,
			closeOnClickOutside: false,
		}).then((willDelete) => {
			requestNextScreenshot();
			goToTheFirstPage();
			timeTick=0;
			pauseTimer = false;
			modalOpen = false;
		});
		
		if(currentTarget >= testSessionArray.length){
			//Stop going more than number of items in the targetArray
			console.log("nextRound");
			nextRound();

			
			
		}

	}else{
		//it is not a target! 
		makeLog(false,"click",index);
	}


}

function findDistance(eventTarget,targetId ){
//	console.log(testSessionArray);
//	console.log(eventTarget + " : " + targetId);
	count = 0
	if(targetId > eventTarget){
		for(var i=eventTarget; i <= targetId; i++){
			if(isInTestArray(i)){
				count++;
			}
		}
		
	}else if(targetId == eventTarget){
		return 0;
	}else{
		for(var i=targetId; i <= eventTarget ; i++){
			if(isInTestArray(i)){
				count++;
			}
		}
	}
	return (count -1)
}

function isInTestArray(input){
	for(x in testSessionArray){
		if (testSessionArray[x].id == input)
		return true
		
	}
	
	return false;
}

function makeLog(completed,eventType,eventTarget){
	if(currentTarget >= testSessionArray.length) return;
	startTimeToCompletePlaceHolder = 0
	timeLength = Date.now() - startTime;
	if(completed){
		startTimeToCompletePlaceHolder =  Date.now() - startTimeToComplete;
		startTimeToComplete = Date.now();
	}
	
	
	logId++;

	block = experimentRound;
	if((!completed)||(eventType == "TO")){ // cuz if the traget is found the current target will be increased.
		trail = currentTarget+1;	
	}else{
		trail = currentTarget+1 ;	
	}
	var today = new Date();
	var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	var dateTime = date+' '+time;
	
	targetId = testSessionArray[trail-1].id;
	difficulty = testSessionArray[trail-1].d;

	distance = findDistance(eventTarget,targetId );

	
	
	log = logId + "#" + subjectId + "#" + interfaceNumber + "#" + block + "#" + trail + "#" + targetId+ "#" + 
	completed +"#" + eventType +"#"+ eventTarget +"#" + timeLength +"#" + Date.now()  + "<br/>"; 
	
/* 	log = logId + " #subjectId: " + subjectId + " #interfaceNumber: " + interfaceNumber + " #phase: " + currentPhase + " #block: " + block 
	+ " #trail: " + trail + " #targetId: " + targetId+ " #completed: " + completed +" #eventType: " + eventType +" #distance: " + distance 
	+" #eventTarget: "+ eventTarget +" #timeLength: " + timeLength+ " #startTimeToComplete: " + startTimeToCompletePlaceHolder +" #difficulty: " + difficulty  +" #now: " + Date.now()  + "<br/>"; 
	 */
	 
	 log = logId + "#" + subjectId + "#" + interfaceNumber + "#" + currentPhase + "#" + block 
	+ "#" + trail + "#" + targetId+ "#" + completed +"#" + eventType +"#" + distance 
	+"#"+ eventTarget +"#" + timeLength+ "#" + startTimeToCompletePlaceHolder +"#" + difficulty  +"#" + Date.now()  + "<br/>"; 
	
	$("#logContainer").append(log);
	//console.log(log);

	startTime = Date.now();
	
}
	

function showAllBookmarks(inputArray){
	
	userLabelArray = JSON.parse(getCookie("userLabelArray"));
	userIconslist = JSON.parse(getCookie("userIconslist"));
	randomIconslist = JSON.parse(getCookie("randomIconslist"));
	
/* 	console.log(userLabelArray);
	console.log(userIconslist);
	console.log(randomIconslist); */
	
	
	switch (interfaceNumber){
		case "plain": //No Icons
			var index = 0;
			for(i=0; i < inputArray.length;i++){
				thumTop = inputArray[index].index;
				id = inputArray[index].id;
				//if(icons != 2) bookmarked = true;
				appendBookmark(id);
				$("#bm"+id).css({"top":thumTop + "px"});
				index++;
			}
		break;
		case "randomIcon": // Random icons 
		
				var index = 0;
				for(i=0; i < inputArray.length;i++){
					thumTop = inputArray[index].index;
					id = inputArray[index].id;
					//if(icons != 2) bookmarked = true;
					appendAllBookmark(id,findIcon(randomIconslist,id));
					$("#bm"+id).css({"top":thumTop + "px"});
					index++;
				}
					
		break;
		case "userselectedIcon": // user Picked icons
				var index = 0;
				for(i=0; i < inputArray.length;i++){
					thumTop = inputArray[index].index;
					id = inputArray[index].id;
					//if(icons != 2) bookmarked = true;
					appendAllBookmark(id,findIcon(userIconslist,id));
					$("#bm"+id).css({"top":thumTop + "px"});
					index++;
				}
		break;
		case "autolabel": // user Picked icons
			var index = 1;
			userLabelArray = [];
			for(x in inputArray){
				userLabelArray.push({"value":"bookmark "+index,"time":0,"id":inputArray[x].id});
				index++;
			}
			updateBookmarkList();
		break;
		case "userlabel": // user Picked icons
			updateBookmarkList();
		break;
	}
	
	
	
	

	
}
	
function findIcon(inputArray,id){
	console.log(inputArray);
	console.log(id);
	for(x in inputArray){
		if(inputArray[x].id == id)
			return inputArray[x].icon
	}
}


function saveIconMenuLog(){
	if(sampleRound) return;
	

	
	
	var tempArray = [];
	if(userLabelArray.length > 0 ) tempArray = userLabelArray.slice();
	if(userIconslist.length > 0 ) tempArray = userIconslist.slice();
	if(randomIconslist.length > 0 ) tempArray = randomIconslist.slice();
	
	
	var request = $.ajax({
		url: "ajax/index.php",
		method: "POST",
		data: { 
			log : JSON.stringify(tempArray),
			subjectId : subjectId+"#"+interfaceNumber+"#"+currentPhase,
		},
		dataType: "html"
	});

	request.done(function( msg ) {
		console.log( msg );
	});

	 
	request.fail(function( jqXHR, textStatus ) {
	  alert( "Error saving log" );
	});
	
	
}




function placeBookmark(){
	if(currentBookmark >= testSessionArray.length ) return;
	thumTop = testSessionArray[currentBookmark].index;
	id = testSessionArray[currentBookmark].id;
	//if(icons != 2) bookmarked = true;
	appendBookmark(id);
	$("#bm"+id).css({"top":thumTop + "px"});
}
	
function appendBookmark(id){
	
	switch (interfaceNumber){
		case "plain": //No Icons
			$("#scroll2").append("<div id='bm"+id+"' class='bookmark orangeBc' >"+""+"</div>");
 			bookmarked = true;

		break;
		case "randomIcon": // Random icons 
			iconId = checkIfIconIsAlreadySelected(id);

				
			$("#scroll2").append("<div id='bm"+id
								+"' class='bookmark orangeBc' ><img  class='icon' id='bm"+id
								+"' src='icons/"+iconsArray[iconId]+".png' /></div>");
			
			randomIconslist.push({"id":id,"icon":iconsArray[iconId]});
			bookmarked = true;
		
					
		break;
		case "userselectedIcon": // user Picked icons
			selectIcon(id);
		break;
		case "autolabel": // user Picked icons
			placeLable(id,true);
		break;
		case "userlabel": // user Picked icons
			placeLable(id,false);
		break;
	}
}

function checkIfIconIsAlreadySelected(id){
	for(i=0; i < randomIconslist.length; i++){
		if(randomIconslist[i].icon == iconsArray[id]){
			if(id  > 30) id = 0;
			else id++;
			i=0;
		}
	}
	return id;
}

function appendAllBookmark(id,icon){
	console.log( id +" "+ icon);
	$("#scroll2").append("<div id='bm"+id
					+"' class='bookmark orangeBc' ><img  class='icon' id='bm"+id
					+"' src='icons/"+icon+".png' /></div>");
}


function selectIcon(id){
	currentIdInBookmarkArray = id;
	$("#timer").css("backgroundColor","rgba(0,0,0,0)");
	timeTick=0;
	pauseTimer = true;
	//iconMenuTimerActive = true;
	iconMenuTimer = setInterval(function(){ 
		iconMenuTimePassed += 10;
		showTimer2();
	},10);

	
	$("#modal").show();
}

function enterLable(){
	labelDialogue = swal("Enter a label", {
	  content: "input",
	})
	.then((value) => {
		//swal(`You typed: ${value}`);
		if(value.length < 1 ){
			enterLable();
		}else{
			userLabelArray.push({"value":value,"time":iconMenuTimePassed,"id":id});
			clearInterval(iconMenuTimer);
			bookmarked = true;
			updateBookmarkList();
		}
	});
}

function placeLable(id,auto){
	$("#timer").css("backgroundColor","rgba(0,0,0,0)");
	timeTick=0;
	pauseTimer = true;
	if(!auto){
		enterLable();
	}else{
		userLabelArray.push({"value":"bookmark "+ (userLabelArray.length+1) ,"time":iconMenuTimePassed,"id":id});
		bookmarked = true;
		updateBookmarkList();
	}
	
	iconMenuTimer = setInterval(function(){ 
		iconMenuTimePassed += 10;
		$("#timer").text("Please Select Icon");
		showTimer();
	},10);

}
function updateBookmarkList(){
	var res  = "";
	var i = 0;
	var mclass = "even"
	for(x in userLabelArray){
		if(i%2 == 0 ) mclass = "even"
		else mclass = "odd"
		res += `<p class="${mclass}" onclick="gotoLabel(${userLabelArray[x].id},this)" >${userLabelArray[x].value}</p>`;
		i++;
	}
	$("#bookmarklist").html(res);
}

function gotoLabel(id,obj){
	
	if(modalOpen) return;
	$("#bookmarklist p").removeClass("selected");

	$(obj).addClass("selected");
//	if(!isExperimenting) return;
	currentBookmark = id;
	tempIndex = findIndexInbookmarkArray(id);
		console.log(tempIndex);

	gotoBookmark(testSessionArray,tempIndex);
	isTarget(id);
	if(isTraining) timeTick = 0;
	
	
	
	
}
function showTimer(){
	if(Number.isInteger(iconMenuTimePassed/1000)){
		timePassed = iconMenuTimePassed/1000 ;
		timeRemained = TIME_TO_CHOSE_ICON - timePassed;
	
		if(timeRemained < 0){
			$(".swal-text").text("Please Select a Label");
			$(".swal-text").css("color","red");
		}else $(".swal-text").text("Please Select a Label before: "+timeRemained);
	}
	
	
}

function showTimer2(){
	if(Number.isInteger(iconMenuTimePassed/1000)){
		timePassed = iconMenuTimePassed/1000 ;
		timeRemained = TIME_TO_CHOSE_ICON - timePassed;
	
		if(timeRemained < 0){
			$("#timer").text("Please Select an icon");
			$("#timer").css("color","red");
		}else $("#timer").text("Please Select before: "+timeRemained);
	}
	
	
}




	
	
	
function gotoNextBookmark(){
	currentBookmark++;

 	if(isTraining){
		if(checkEndOfTraining(learningSessionArray)) 
			return;

		gotoBookmark(learningSessionArray,currentBookmark);	

	}else{	
		gotoBookmark(testSessionArray,currentBookmark);	

	}
	
	bookmarked = false; 
}

function gotoBookmark(inputArray,index){

//	console.log(index)
//	console.log(inputArray)
	

	$('.main').css('margin-top', "-"+(inputArray[index].p)  + "px");
	$("#secondScrollIndex").css({"top": ( inputArray[index].index ) +"px" });
	currentMargin = Math.abs(parseInt($('.main').css('marginTop')));
	scrollIndex = Math.floor(Math.abs(currentMargin) / SCROLL_STEP) * -1;	

	
}

function checkEndOfTraining(tempArray){
	if(currentBookmark >= (tempArray.length)){
		
		if(isTraining){
			isTraining = false;
			pauseTimer = true;
			timerTick = 0;
			goToTheFirstPage();

			swal({
				title: "Experiment Session",
				text: "Now you will be shown some pages on the left monitor and you should find those pages by clicking on the bookmark you've just made. please do it as fast and accurate as possible",
				//icon: "success",
				button: "OK",
				allowOutsideClick: false,
				closeOnClickOutside: false,
			}).then(() => {
				startExperiment();
			});
		}else{
			
		}
		
		
		return true;
	}
	
}

function goToTheFirstPage(){
	$('.main').css('margin-top', "0px");
	$("#secondScrollIndex").css({"top": "0px" });
	scrollIndex = 0;	
}

function startTrainingSession(){
	gotoNextBookmark();
	trainingTimer = setInterval(function(){ 
		if (!pauseTimer) timeTick++;
		
		
		if(timeTick > TRAINING_SESSION_BEFORE_BOOKMARK){
			if(!bookmarked){
				//allowBookmark = true;
				timeTick=0;
				msg = "Please Bookmark the page by pressing B on keyboard" ;
				swal({
					text: msg,
					//icon: "success",
					button: "OK",
					allowOutsideClick: false,
					closeOnClickOutside: false,
				}).then((willDelete) => {
					timeTick=0;

				})
				

			}
		}

		if(timeTick > TRAINING_SESSION_AFTER_BOOKMARK){
			if(bookmarked){
				timeTick=0;
				msg = "Please press Space to go to next page" ;
				swal({
					text: msg,
					//icon: "success",
					button: "OK",
					allowOutsideClick: false,
					closeOnClickOutside: false,
				}).then((willDelete) => {
					timeTick=0;

				});
			}
		}
		
		
		
		
		
		
	}, 1000 );
}


function startPhase(currentPhase){
		// is it last phase
		if(currentPhase > NumberOfPhases){
			lastPhase();
			return;
		}
		
		isTraining = true;

		swal({
			title: "Training Sesssion",
			text: "In this part you'll be shown some pages of a document. You should bookmark these pages by pressing 'B'. To go to next target press 'Space' ",
			//icon: "success",
			button: "Start",
			allowOutsideClick: false,
			closeOnClickOutside: false,
		}).then(() => {
			
			startTrainingSession();
		});
			
		
		

		// getData for this phase
	}

	
function getPhaseData(phase){
	var learningSessionArray = new Array();
	var testSessionArray = new Array();
	
	if(SampleRound == true){
		console.log(SampleRound);
		learningSessionArray.push(bookmarksArray[20]);
		learningSessionArray.push(bookmarksArray[21]);

	
		testSessionArray.push(bookmarksArray[20]);
		testSessionArray.push(bookmarksArray[21]);
		
		
		return {learningSessionArray , testSessionArray}

		
	}
		switch(phase){
			case 1:
				learningSessionArray.push(bookmarksArray[3]);
				learningSessionArray.push(bookmarksArray[8]);
				learningSessionArray.push(bookmarksArray[12]);
				learningSessionArray.push(bookmarksArray[16]);
				learningSessionArray.push(bookmarksArray[19]);
	
				testSessionArray.push(bookmarksArray[3]);
				testSessionArray.push(bookmarksArray[8]);
				testSessionArray.push(bookmarksArray[12]);
				testSessionArray.push(bookmarksArray[16]);
				testSessionArray.push(bookmarksArray[19]);

				
			break;
			case 2:
				learningSessionArray.push(bookmarksArray[1]);
				learningSessionArray.push(bookmarksArray[6]);
				learningSessionArray.push(bookmarksArray[10]);
				learningSessionArray.push(bookmarksArray[14]);
				learningSessionArray.push(bookmarksArray[18]);

				testSessionArray.push(bookmarksArray[1]);
				testSessionArray.push(bookmarksArray[6]);
				testSessionArray.push(bookmarksArray[10]);
				testSessionArray.push(bookmarksArray[14]);
				testSessionArray.push(bookmarksArray[18]);
				
				testSessionArray.push(bookmarksArray[3]);
				testSessionArray.push(bookmarksArray[8]);
				testSessionArray.push(bookmarksArray[12]);
				testSessionArray.push(bookmarksArray[16]);
				testSessionArray.push(bookmarksArray[19]);
				

			break;
			case 3:
				learningSessionArray.push(bookmarksArray[0]);
				learningSessionArray.push(bookmarksArray[5]);
				learningSessionArray.push(bookmarksArray[9]);
				learningSessionArray.push(bookmarksArray[13]);
				learningSessionArray.push(bookmarksArray[17]);

				testSessionArray.push(bookmarksArray[0]);
				testSessionArray.push(bookmarksArray[5]);
				testSessionArray.push(bookmarksArray[9]);
				testSessionArray.push(bookmarksArray[13]);
				testSessionArray.push(bookmarksArray[17]);
				
				testSessionArray.push(bookmarksArray[1]);
				testSessionArray.push(bookmarksArray[6]);
				testSessionArray.push(bookmarksArray[10]);
				testSessionArray.push(bookmarksArray[14]);
				testSessionArray.push(bookmarksArray[18]);
				
				testSessionArray.push(bookmarksArray[3]);
				testSessionArray.push(bookmarksArray[8]);
				testSessionArray.push(bookmarksArray[12]);
				testSessionArray.push(bookmarksArray[16]);
				testSessionArray.push(bookmarksArray[19]);
				



			break;
			case 4:
				learningSessionArray.push(bookmarksArray[2]);
				learningSessionArray.push(bookmarksArray[4]);
				learningSessionArray.push(bookmarksArray[7]);
				learningSessionArray.push(bookmarksArray[11]);
				learningSessionArray.push(bookmarksArray[15]);	
				
				
				testSessionArray.push(bookmarksArray[2]);
				testSessionArray.push(bookmarksArray[4]);
				testSessionArray.push(bookmarksArray[7]);
				testSessionArray.push(bookmarksArray[11]);
				testSessionArray.push(bookmarksArray[15]);
				
				testSessionArray.push(bookmarksArray[0]);
				testSessionArray.push(bookmarksArray[5]);
				testSessionArray.push(bookmarksArray[9]);
				testSessionArray.push(bookmarksArray[13]);
				testSessionArray.push(bookmarksArray[17]);
				
				testSessionArray.push(bookmarksArray[1]);
				testSessionArray.push(bookmarksArray[6]);
				testSessionArray.push(bookmarksArray[10]);
				testSessionArray.push(bookmarksArray[14]);
				testSessionArray.push(bookmarksArray[18]);

				testSessionArray.push(bookmarksArray[3]);
				testSessionArray.push(bookmarksArray[8]);
				testSessionArray.push(bookmarksArray[12]);
				testSessionArray.push(bookmarksArray[16]);
				testSessionArray.push(bookmarksArray[19]);
				




				
				
			break;
			default:
			
		}
		
		//targetArray = testSessionArray.slice();

		return {learningSessionArray , testSessionArray}

	}
	


function setBookmarksArray(){
	
	switch(interfaceNumber){
		case "plain":
				bookmarksArray = new Array(
				{id:0 , p :13050 , index:25 , i:true,d:"H"},
				{id:1 , p :38100 , index:73, i:true,d:"H"},
				{id:2 , p :60300 , index:115 , i:true,d:"H"},
				{id:3 , p :83400 , index:160 , i:true,d:"H"},
				{id:4 , p :110100 , index:211 , i:true,d:"H"},
				{id:5 , p :133050 , index:255 , i:true,d:"H"},
				{id:6 , p :155700 , index:299 , i:true,d:"H"},
				{id:7 , p :182550 , index:350 , i:true,d:"H"},
				{id:8 , p :205200 , index:394 , i:true,d:"H"},
				{id:9 , p :229200 , index:440 , i:true,d:"H"},
				{id:10 , p :256050 , index:491 , i:true,d:"H"},
				{id:11 , p :276900 , index:532 , i:true,d:"H"},
				{id:12 , p :301800 , index:579 , i:true,d:"H"},
				{id:13 , p :323700 , index:621 , i:true,d:"H"},
				{id:14 , p :347550 , index:667 , i:true,d:"H"},
				{id:15 , p :372300 , index:715 , i:true,d:"H"},
				{id:16 , p :379950 , index:764 , i:true,d:"H"},
				{id:17 , p :420600 , index:808 , i:true,d:"H"},
				{id:18 , p :443400 , index:851 , i:true,d:"H"},
				{id:19 , p :469200 , index:901 , i:true,d:"H"}, 
				{id:20 , p :96600 , index:185.607 , i:true,d:"H"}, 
				{id:21 , p :172950 , index:332.307 , i:true,d:"H"}, 
		)
		document.cookie = "folder=newseries2/plain";

		break;
		case "randomIcon":
			bookmarksArray = new Array(
				{id:0 , p :13050 , index:25 , i:true,d:"H"},
				{id:1 , p :38100 , index:73, i:true,d:"H"},
				{id:2 , p :60300 , index:115 , i:true,d:"H"},
				{id:3 , p :83400 , index:160 , i:true,d:"H"},
				{id:4 , p :110100 , index:211 , i:true,d:"H"},
				{id:5 , p :133050 , index:255 , i:true,d:"H"},
				{id:6 , p :155700 , index:299 , i:true,d:"H"},
				{id:7 , p :182550 , index:350 , i:true,d:"H"},
				{id:8 , p :205200 , index:394 , i:true,d:"H"},
				{id:9 , p :229200 , index:440 , i:true,d:"H"},
				{id:10 , p :256050 , index:491 , i:true,d:"H"},
				{id:11 , p :276900 , index:532 , i:true,d:"H"},
				{id:12 , p :301800 , index:579 , i:true,d:"H"},
				{id:13 , p :323700 , index:621 , i:true,d:"H"},
				{id:14 , p :347550 , index:667 , i:true,d:"H"},
				{id:15 , p :372300 , index:715 , i:true,d:"H"},
				{id:16 , p :379950 , index:764 , i:true,d:"H"},
				{id:17 , p :420600 , index:808 , i:true,d:"H"},
				{id:18 , p :443400 , index:851 , i:true,d:"H"},
				{id:19 , p :469200 , index:901 , i:true,d:"H"}, 
				{id:20 , p :96600 , index:185.607 , i:true,d:"H"}, 
				{id:21 , p :172950 , index:332.307 , i:true,d:"H"}, 
			)
			document.cookie = "folder=newseries2/randomIcon";
		break;
		case "userselectedIcon":
			bookmarksArray = new Array(
					{id:0 , p :13050 , index:25 , i:true,d:"H"},
					{id:1 , p :38100 , index:73, i:true,d:"H"},
					{id:2 , p :60300 , index:115 , i:true,d:"H"},
					{id:3 , p :83400 , index:160 , i:true,d:"H"},
					{id:4 , p :110100 , index:211 , i:true,d:"H"},
					{id:5 , p :133050 , index:255 , i:true,d:"H"},
					{id:6 , p :155700 , index:299 , i:true,d:"H"},
					{id:7 , p :182550 , index:350 , i:true,d:"H"},
					{id:8 , p :205200 , index:394 , i:true,d:"H"},
					{id:9 , p :229200 , index:440 , i:true,d:"H"},
					{id:10 , p :256050 , index:491 , i:true,d:"H"},
					{id:11 , p :276900 , index:532 , i:true,d:"H"},
					{id:12 , p :301800 , index:579 , i:true,d:"H"},
					{id:13 , p :323700 , index:621 , i:true,d:"H"},
					{id:14 , p :347550 , index:667 , i:true,d:"H"},
					{id:15 , p :372300 , index:715 , i:true,d:"H"},
					{id:16 , p :379950 , index:764 , i:true,d:"H"},
					{id:17 , p :420600 , index:808 , i:true,d:"H"},
					{id:18 , p :443400 , index:851 , i:true,d:"H"},
					{id:19 , p :469200 , index:901 , i:true,d:"H"}, 
					{id:20 , p :96600 , index:185.607 , i:true,d:"H"}, 
					{id:21 , p :172950 , index:332.307 , i:true,d:"H"}, 
			)
			document.cookie = "folder=newseries2/userselectedIcon";
		break;
		case "autolabel":
			bookmarksArray = new Array(
					{id:0 , p :13050 , index:25 , i:true,d:"H"},
					{id:1 , p :38100 , index:73, i:true,d:"H"},
					{id:2 , p :60300 , index:115 , i:true,d:"H"},
					{id:3 , p :83400 , index:160 , i:true,d:"H"},
					{id:4 , p :110100 , index:211 , i:true,d:"H"},
					{id:5 , p :133050 , index:255 , i:true,d:"H"},
					{id:6 , p :155700 , index:299 , i:true,d:"H"},
					{id:7 , p :182550 , index:350 , i:true,d:"H"},
					{id:8 , p :205200 , index:394 , i:true,d:"H"},
					{id:9 , p :229200 , index:440 , i:true,d:"H"},
					{id:10 , p :256050 , index:491 , i:true,d:"H"},
					{id:11 , p :276900 , index:532 , i:true,d:"H"},
					{id:12 , p :301800 , index:579 , i:true,d:"H"},
					{id:13 , p :323700 , index:621 , i:true,d:"H"},
					{id:14 , p :347550 , index:667 , i:true,d:"H"},
					{id:15 , p :372300 , index:715 , i:true,d:"H"},
					{id:16 , p :379950 , index:764 , i:true,d:"H"},
					{id:17 , p :420600 , index:808 , i:true,d:"H"},
					{id:18 , p :443400 , index:851 , i:true,d:"H"},
					{id:19 , p :469200 , index:901 , i:true,d:"H"}, 
					{id:20 , p :96600 , index:185.607 , i:true,d:"H"}, 
					{id:21 , p :172950 , index:332.307 , i:true,d:"H"}, 
			)
			document.cookie = "folder=newseries2/autolabel";
		break;
		case "userlabel":
			bookmarksArray = new Array(
					{id:0 , p :13050 , index:25 , i:true,d:"H"},
					{id:1 , p :38100 , index:73, i:true,d:"H"},
					{id:2 , p :60300 , index:115 , i:true,d:"H"},
					{id:3 , p :83400 , index:160 , i:true,d:"H"},
					{id:4 , p :110100 , index:211 , i:true,d:"H"},
					{id:5 , p :133050 , index:255 , i:true,d:"H"},
					{id:6 , p :155700 , index:299 , i:true,d:"H"},
					{id:7 , p :182550 , index:350 , i:true,d:"H"},
					{id:8 , p :205200 , index:394 , i:true,d:"H"},
					{id:9 , p :229200 , index:440 , i:true,d:"H"},
					{id:10 , p :256050 , index:491 , i:true,d:"H"},
					{id:11 , p :276900 , index:532 , i:true,d:"H"},
					{id:12 , p :301800 , index:579 , i:true,d:"H"},
					{id:13 , p :323700 , index:621 , i:true,d:"H"},
					{id:14 , p :347550 , index:667 , i:true,d:"H"},
					{id:15 , p :372300 , index:715 , i:true,d:"H"},
					{id:16 , p :379950 , index:764 , i:true,d:"H"},
					{id:17 , p :420600 , index:808 , i:true,d:"H"},
					{id:18 , p :443400 , index:851 , i:true,d:"H"},
					{id:19 , p :469200 , index:901 , i:true,d:"H"}, 
					{id:20 , p :96600 , index:185.607 , i:true,d:"H"}, 
					{id:21 , p :172950 , index:332.307 , i:true,d:"H"}, 
			)
			document.cookie = "folder=newseries2/userlabel";
		break;
	}
	
	




}


	//////////////////////////
	// Icons 
	//////////////////////////
	var iconsArray = new Array (1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32);
	shuffle(iconsArray);

function shuffle(inputArray){
	
  for (i = inputArray.length - 1; i >= 0; i -= 1) {
	j = Math.floor(Math.random() * (i + 1))
	temp = inputArray[i];
	inputArray[i] = inputArray[j];
	inputArray[j] = temp 
  }
	
	return inputArray;
}

function getCookie(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for(var i = 0; i <ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}