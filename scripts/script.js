$(document).ready(function(){
	//TODO fix the times
	SCROLL_STEP = 150;

	EXPERIMENT_TIMER_DELAY = 60 * 100;
	NUMBER_OF_ROUNDS = 1;
	
	TRAINING_SESSION_BEFORE_BOOKMARK = 40000 ; // 5 s
	TRAINING_SESSION_AFTER_BOOKMARK = 20 ; // 5 s
	
	
	
	
	allowBookmark = false;
	TIME_TO_CHOSE_ICON = 15;
	
	scrollIndex = 0;
	heightOfScrollIndex = 15;
	currentMargin = 0;
	totalHeightOfDoc = $('.main').height();
	currentBookmark = -1;	
	bookmarked = false;
	isTraining = false;
	isExperimenting = false;
	var trainingTimer;
	var experimentTimer;
	timeTick = 0;
	currentTarget = 0;
	startTime = Date.now();
	logId= 0;
	experimentRound  = 1;
	pauseTimer = false;
	sampleRound	= false;
	iconMenuTimePassed = 0;
	var iconMenuTimer;
	iconMenuLog = "";
	preRoundLastId = -1;
	NumberOfPhases = 4
	var learningSessionArray = new Array();
	var testSessionArray = new Array();



	document.cookie = "ScreenShot=-1";

	var url_string = window.location.href;
	var url = new URL(url_string);
	icons = -1;


		
	subjectId = url.searchParams.get("subjectId");
	interfaceNumber = url.searchParams.get("interface");		
	alert(interfaceNumber);		
				
	alignMainCenter();

	currentPhase = parseInt(url.searchParams.get("phase"));
	

	
	
	icons = -1;


	if(url.searchParams.get("condition") == "icon"){
		document.cookie = "folder=newseries/icons";

		icons = 1;
		var bookmarksArray = new Array(
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
		);
	}else{
		document.cookie = "folder=newseries/plain";

		var bookmarksArray = new Array(
			{id:0 , p :10350 , index:19.88 , i:true,d:"H"},
			{id:1 , p :38100 , index:73.2 , i:true,d:"H"},
			{id:2 , p :62850 , index:120.76 , i:true,d:"H"},
			{id:3 , p :85500 , index:164.28 , i:true,d:"H"},
			{id:4 , p :108450 , index:208.37 , i:true,d:"H"},
			{id:5 , p :138450 , index:266 , i:true,d:"H"},
			{id:6 , p :157650 , index:302.9 , i:true,d:"H"},
			{id:7 , p :178950 , index:343.83 , i:true,d:"H"},
			{id:8 , p :203250 , index:390.52 , i:true,d:"H"},
			{id:9 , p :229800 , index:441.53 , i:true,d:"H"},
			{id:10 , p :253200 , index:486.5 , i:true,d:"H"},
			{id:11 , p :276750 , index:531.74 , i:true,d:"H"},
			{id:12 , p :301350 , index:579 , i:true,d:"H"},
			{id:13 , p :322800 , index:620.23 , i:true,d:"H"},
			{id:14 , p :347250 , index:667.2 , i:true,d:"H"},
			{id:15 , p :372750 , index:716.2 , i:true,d:"H"},
			{id:16 , p :396000 , index:760.87 , i:true,d:"H"},
			{id:17 , p :421200 , index:809.3 , i:true,d:"H"},
			{id:18 , p :444000 , index:853.1 , i:true,d:"H"},
			{id:19 , p :467400 , index:898.06 , i:true,d:"H"}, 
		);
		
	}


	startPhase(currentPhase);



	//EventHandlers
	
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
				clearInterval(trainingTimer);
				startExperimentTimer();
				isTraining = false;		
			break;
			case 87: //W
				//excapeTraining();
				console.log(scrollIndex);
				scrollIndex -= 200;
			break;
			case 83: //S
				savelog();
			break;
			case 70: //f
				console.log("main :" + $(".main").css("margin-top"));
				console.log("index :" + $("#secondScrollIndex").css("top"));
				str = "main :" + $(".main").css("margin-top") + "<br/>";
				str += "index :" + $("#secondScrollIndex").css("top");
				
				$("#logContainer").text(str);
				
					currentBookmark++;
					appendBookmark(currentBookmark);
					$("#bm"+currentBookmark).css({"top":$("#secondScrollIndex").css("top")});
					
				
			break;
			case 89: //y
				console.log("main :" + $(".main").css("margin-top"));
				console.log("index :" + $("#secondScrollIndex").css("top"));
				str = "main :" + $(".main").css("margin-top") + "<br/>";
				str += "index :" + $("#secondScrollIndex").css("top");
				
				$("#logContainer").text(str);
				

					
				
			break;
			case 80: //P
				//showsurvayLink();
					excapeTraining();
				
			break;
			
		}
	});
	


	
	function gotoNextBookmark(){
		currentBookmark++;

		if(isTraining)
			tempArray = learningSessionArray.slice();
		else	
			tempArray = testSessionArray.slice();
		
		
		if(checkEndOfTraining(tempArray)) 
			return;
		
		
		gotoBookmark(learningSessionArray[currentBookmark].id);	
		bookmarked = false;
	}

	function gotoBookmark(index){
		if(isTraining)
			tempArray = learningSessionArray.slice();
		else	
			tempArray = testSessionArray.slice();
		
			console.log(currentBookmark);
			console.log(tempArray.length);
		
		if(checkEndOfTraining(tempArray)) 
			return;
		
		
		
		realIndex = 0;
		for(x in tempArray){
			if(tempArray[x].id == index){
				realIndex = x;
				console.log("------------");
			}
				
		}
		

		$('.main').css('margin-top', "-"+(tempArray[realIndex].p)  + "px");
		$("#secondScrollIndex").css({"top": ( tempArray[realIndex].index ) +"px" });
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
	
	
	$(document).on('click', '.bookmark', function(e){
		if(!isExperimenting) return;
		index = parseInt($(e.target).attr("id").replace("bm", ""));
		console.log("index "+index);
		currentBookmark = index;
		console.log(index);
		gotoBookmark(index);
		isTarget(index);
		if(isTraining) timeTick = 0;
	});

	

	
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
	
	function placeBookmark(){

		if(currentBookmark >= bookmarksArray.length ) return;
		thumTop = testSessionArray[currentBookmark].index;
		id = testSessionArray[currentBookmark].id;
		if(icons != 2) bookmarked = true;
		appendBookmark(id);
		$("#bm"+id).css({"top":thumTop + "px"});
	}
	
	function appendBookmark(id){
		
		switch (icons){
			case -1: //No Icons
				$("#scroll2").append("<div id='bm"+id+"' class='bookmark orangeBc' >"+""+"</div>");
			break;
			case 1: // Random icons 
				$("#scroll2").append("<div id='bm"+id
									+"' class='bookmark orangeBc' ><img  class='icon' id='bm"+id
									+"' src='icons/"+iconsArray[id]+".png' /></div>");
			break;
			case 2: // user Pciked icons
				selectIcon(id);
			break;
		}
	}

	
	function goToTheFirstPage(){
		$('.main').css('margin-top', "0px");
		$("#secondScrollIndex").css({"top": "0px" });
		scrollIndex = 0;	
	}
	
	
	function selectIcon(currentBookmark){
		$("#timer").css("backgroundColor","rgba(0,0,0,0)");
		timeTick=0;
		pauseTimer = true;
		//iconMenuTimerActive = true;
		iconMenuTimer = setInterval(function(){ 
			iconMenuTimePassed += 10;
			showTimer();
		},10);

		
		$("#modal").show();
	}
	
	function showTimer(){
		if(Number.isInteger(iconMenuTimePassed/1000)){
			timePassed = iconMenuTimePassed/1000 ;
			timeRemained = TIME_TO_CHOSE_ICON - timePassed;
		
			if(timeRemained < 0){
				$("#timer").text("Please Select Icon");
				$("#timer").css("backgroundColor","red");
			}else $("#timer").text("Select before: "+timeRemained);
		}
		
		
	}
	
	$("#modal .icon").click(function(e){
		if(currentBookmark >= bookmarksArray.length ) return;
		thumTop = bookmarksArray[currentBookmark].index;
		index = parseInt($(e.target).attr("id").replace("icon", ""));
		
		$("#scroll2").append("<div id='bm"+currentBookmark
					+"' class='bookmark orangeBc' ><img  class='icon' id='bm"+currentBookmark
					+"' src='icons/"+index+".png' /></div>");
		$("#bm"+currentBookmark).css({"top":thumTop + "px"});
		bookmarked = true;	
		$("#modal").hide();
		timeTick=0;
		pauseTimer = false;
		iconMenuLog += "," + iconMenuTimePassed ;
		console.log("iconMenuTimePassed: "+iconMenuTimePassed);
		iconMenuTimePassed = 0;
		clearInterval(iconMenuTimer);

	});
	
	
	/////////////////////////////////////////////
	//Training Session
	/////////////////////////////////////////////
	isTraining = true;

	swal({
		title: "Training Sesssion",
		text: "In this part you'll be shown some pages of a document. You should bookmark these pages by pressing 'B'. To go to next target press 'Space' ",
		//icon: "success",
		button: "Start",
		allowOutsideClick: false,
		closeOnClickOutside: false,
	}).then((willDelete) => {
		
		startTrainingSession();
	});
	
	
	function startTrainingSession(){
		gotoNextBookmark();
		trainingTimer = setInterval(function(){ 
			if (!pauseTimer) timeTick++;
			
			
			if(timeTick > TRAINING_SESSION_BEFORE_BOOKMARK){
				if(!bookmarked){
					allowBookmark = true;
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


	
	

	
	//////////////////////////////
	// Experiment
	/////////////////////////////
	function startExperiment(){
		clearInterval(trainingTimer);
		saveIconMenuLog();
		startTime = Date.now();
		requestNextScreenshot();
		isTraining = false;
		showAllBookmarks();
		testSessionArray = shuffle(testSessionArray);
		startExperimentTimer();


		timeTick=0;
	}
	
	function showAllBookmarks(){
			//currentBookmark=0;
		for(i=0; i < testSessionArray.length;i++){
			placeBookmark();
			currentBookmark++;

		}
		
	}
	
	function saveIconMenuLog(){
		if(icons != 2) return; // if the icons is not supposed to be selected by user do nothing
		if(sampleRound) return;
		console.log(iconMenuLog);
		console.log(iconMenuLog);
		var request = $.ajax({
			url: "ajax/index.php",
			method: "POST",
			data: { 
				log : iconMenuLog,
				subjectId : subjectId,
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
	

	
	
	
	function shuffle(inputArray){
		
	  for (i = inputArray.length - 1; i >= 0; i -= 1) {
		j = Math.floor(Math.random() * (i + 1))
		temp = inputArray[i];
 		inputArray[i] = inputArray[j];
		inputArray[j] = temp 
	  }
		
		return inputArray;
	}
	
	////////////////////////////
	// make log
	////////////////////////////
	


	
	function makeLog(completed,eventType,eventTarget){
		if(currentTarget >= testSessionArray.length) return;

		timeLength = Date.now() - startTime;
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


		
		
		log = logId + "#" + subjectId + "#" + interfaceNumber + "#" + block + "#" + trail + "#" + targetId+ "#" + 
		completed +"#" + eventType +"#"+ eventTarget +"#" + timeLength +"#" + Date.now()  + "<br/>"; 
		
		log = logId + " #subjectId: " + subjectId + " #interfaceNumber: " + interfaceNumber + " #phase: " + currentPhase + " #block: " + block 
		+ " #trail: " + trail + " #targetId: " + targetId+ " #completed: " + completed +" #eventType: " + eventType 
		+" #eventTarget: "+ eventTarget +" #timeLength: " + timeLength+" #difficulty: " + difficulty  +" #now: " + Date.now()  + "<br/>"; 
		
		$("#logContainer").append(log);
		//console.log(log);
		startTime = Date.now();
		
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
					window.location = "http://127.0.0.1/bookmark/standard1.html?phase="+ (parseInt(currentPhase)+1);

				});
		  
			}
		  
		  
			
		});
		 
		request.fail(function( jqXHR, textStatus ) {
		  alert( "Request failed: Call Ehsan" );
		});
	}
	
	
	function showsurvayLink(){
		
		html = "<br/><a href='https://goo.gl/forms/WzDSLn3bfRyM2BVO2' target='_blank' >NASA TLX questionnaire</a><br/><br/>";
		html += "<a href='https://goo.gl/forms/8zsls4emmSUs9iwa2' target='_blank' >Overall questionnaire</a>";
		
		$("#modal").html(html);
		$("#modal").show();
		
	}
	
	
	
	
	function isTarget(index){
		console.log(testSessionArray[currentTarget].id);
		console.log("index: "+index);
		if(currentTarget >= testSessionArray.length) return;
		if(testSessionArray[currentTarget].id == index){

			//it is target.
			makeLog(true,"click",index);
			currentTarget++;
			
			if(currentTarget < testSessionArray.length) console.log("nextTarget: "+testSessionArray[currentTarget].id);
			pauseTimer = true;
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
	
	function nextRound(){
		if(experimentRound < NUMBER_OF_ROUNDS){
			// We still have more rounds to continue.
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
				console.log(targetArray[currentTarget].id + ":" );
				requestNextScreenshot();
			});
		}else{
			//experiment is over
			savelog();

			timeTick = 0;
			pauseTimer = true;
		}
	}
	
	function excapeTraining(){

		for(i=0;i < targetArray.length;i++){
			placeBookmark();
			currentBookmark++;
			
		}
		
		startExperiment();
	}
	
	function requestNextScreenshot(){
		if(currentTarget >= targetArray.length) return;
		console.log("ScreenShot="+ (targetArray[currentTarget].id+1));
		startTime = Date.now();
		document.cookie = "ScreenShot="+ (targetArray[currentTarget].id+1);
		console.log("ScreenShot="+ (targetArray[currentTarget].id+1));
	}
	
	
	
	//////////////////////////
	// Icons 
	//////////////////////////
	var iconsArray = new Array (1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32);
	shuffle(iconsArray);
	
	
	
	
	modalCenter();
	function modalCenter(){
		marginLeft = parseInt($("#modal").css("width").replace("px",""))/2;
		$("#modal").css({"margin-left": "-"+marginLeft +"px"});
	}
	
	
	
	function alignMainCenter(){
		widthOfWindow= $(window).outerWidth();
		mainWidth = parseInt($(".main").css('width'));
		SCWidth = parseInt($(".scrollbarContainer").css('width'));
		margin = (widthOfWindow /2) - (mainWidth/2) - SCWidth;
		$(".main").css('margin-left',margin+'px');
	}


	function startPhase(currentPhase){
		// is it last phase
		if(currentPhase > NumberOfPhases){
			lastPhase();
			return;
		}
		
		getPhaseData(currentPhase);

		
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

	
	function lastPhase(){
		showsurvayLink();
	}
	
	
	function getPhaseData(phase){
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
		
		targetArray = testSessionArray.slice();

		

	}
	
});



// a function to place extra bookmarks for phase 2, 3, 4




//NASA
//https://goo.gl/forms/WzDSLn3bfRyM2BVO2



//overall
//https://goo.gl/forms/8zsls4emmSUs9iwa2








