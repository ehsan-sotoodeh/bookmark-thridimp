$(document).ready(function(){
	
	SCROLL_STEP = 150;
	TRAINING_SESSION_DELAY = 30 * 1000 ; //15 seconds
	EXPERIMENT_TIMER_DELAY = 15 * 100;
	NUMBER_OF_ROUNDS = 4;
	TIME_TO_CHOSE_ICON = 15;
	//TODO
	DELAY_BEFORE_RANDOM_ICON = 5 * 1000;
	
	
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
	var timer1;
	var timer2;
	
	
	document.cookie = "ScreenShot=-1";

	var url_string = window.location.href;
	var url = new URL(url_string);
	icons = -1;


		
	subjectId = url.searchParams.get("subjectId");
	interfaceNumber = url.searchParams.get("land");		
				
				
	
	if(url.searchParams.get("SampleRound") == "true"){
		LandMarkFolder = "SampleRound";
		alert("Practice Round");
		var bookmarksArray	= new Array(
			{id:0 , p :57900 , index:343.259 , i:true,d:"E"},
			{id:1 , p :83400 , index:494.436 , i:false,d:"E"}
		);	
		var targetArray = bookmarksArray.slice();

		interfaceName= "practicerandom";
		NUMBER_OF_ROUNDS = 2;

		sampleRound = true;
		document.cookie = "folder=practicerandom";

	}else if(url.searchParams.get("land") == "simple10"){
		var bookmarksArray = new Array(
			{id:0, p : 6600, index:39.128 , i:true,d:"E"},
			{id:1, p : 22500, index:133.391 , i:true,d:"E"},  
			{id:2, p : 37350, index:221.429 , i:false,d:"E"},  
			{id:3, p : 43650, index:258.778 , i:true,d:"E"}, 
			{id:4, p : 73050, index:433.076 , i:false,d:"E"},
			{id:5, p : 93450, index:554.017 , i:false,d:"H"},
			{id:6 , p : 107850 , index:639.387 , i:true,d:"H"},
			{id:7 , p :128100 , index:759.439 , i:false,d:"H"},
			{id:8 , p :140250 , index:831.47 , i:false,d:"H"},
			{id:9 , p :154500 , index:915.951 , i:true,d:"E"},
		);
		
		var targetArray = bookmarksArray.slice();
		shuffle(targetArray);
		preRoundLastId = targetArray[targetArray.length - 1];
		interfaceName= "random";
		document.cookie = "folder=random";
	}else if(url.searchParams.get("land") == "simple15"){
		var bookmarksArray = new Array(
	/* 		{id:0 , p :6900 , index:40.9066 , i:false},
			{id:1 , p :16350 , index:96.9308 , i:true},
			{id:2 , p :29100 , index:172.519 , i:false},
			{id:3 , p :41850 , index:248.107 , i:true},
			{id:4 , p :53850 , index:319.249 , i:true},
			{id:5 , p :58350 , index:345.927 , i:false},
			{id:6 , p :71550 , index:424.183 , i:true},
			{id:7 , p :84450 , index:500.661 , i:false},
			{id:8 , p :96600 , index:572.692 , i:false},
			{id:9 , p :106800 , index:633.162 , i:true},
			{id:10 , p :112800 , index:668.733 , i:true},
			{id:11 , p :121500 , index:720.311 , i:true},
			{id:12 , p :133500 , index:791.453 , i:false},
			{id:13 , p :143550 , index:851.034 , i:false},
			{id:14 , p :157350 , index:932.847 , i:true}, */
					
		);
		
		var targetArray = bookmarksArray.slice();
		shuffle(targetArray);
		interfaceName= "simple15";
		document.cookie = "folder="+interfaceName;
	}else if(url.searchParams.get("land") == "simple20"){
		var bookmarksArray = new Array(
/* 			{id:0 , p :79200 , index:319.125 , i:true},
			{id:1 , p :83100 , index:334.828125 , i:true},
			{id:2 , p :90900 , index:366.265625 , i:true},
			{id:3 , p :95100 , index:383.1875 , i:true},
			{id:4 , p :99000 , index:398.90625 , i:true},
			{id:5 , p :111750 , index:450.28125 , i:true},
			{id:6 , p :117150 , index:472.03125 , i:true},
			{id:7 , p :129450 , index:521.59375 , i:true},
			{id:8 , p :133200 , index:536.703125 , i:true},
			{id:9 , p :134700 , index:542.75 , i:true},
			{id:10 , p :134700 , index:542.75 , i:true},
			{id:11 , p :134700 , index:542.75 , i:true},
			{id:12 , p :134700 , index:542.75 , i:true},
			{id:13 , p :134700 , index:542.75 , i:true},
			{id:14 , p :134700 , index:542.75 , i:true},
			{id:15 , p :134700 , index:542.75 , i:true},
			{id:16 , p :134700 , index:542.75 , i:true},
			{id:17 , p :134700 , index:542.75 , i:true},
			{id:18 , p :134700 , index:542.75 , i:true},
			{id:19 , p :134700 , index:542.75 , i:true}, */
		);
		
		var targetArray = bookmarksArray.slice();
		shuffle(targetArray);
		interfaceName= "simple20";
		document.cookie = "folder="+interfaceName;
	}

	if(url.searchParams.get("icons") == "random"){
		interfaceNumber= "random";
		icons = 1;
	}else if(url.searchParams.get("icons") == "user"){
		icons = 2;
	}



	alignMainCenter();
	


	//EventHandlers
	
	$('.main , body').bind('mousewheel', function(e){
		if(e.originalEvent.wheelDelta < 0) {
			//scroll down 
			//scrollThePage(false)
		}else {
			//scroll up 
			//scrollThePage(true)
		}
		//console.log("Margin: "+$('.main').css('margin-top'));
		return false;
	});
	
	
	$(document).keyup(function(e){
		//alert(e.which);
		switch(e.which){
			case 66: //B
			//	if(bookmarked) return;
			//	console.log("bookmarked");
				//placeBookmark();
			//	timeTick = 0;
			break;
			case 32: //Space
				if(currentBookmark >= bookmarksArray.length){
					
					return;
				}
				if(!isTraining) return;
				if(!bookmarked){
					msg = "Please wait until bookmark is placed" ;
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
				
				clearTimeout(timer1);
				clearTimeout(timer2);
				gotoNextPage();
				bookmarked = false;
				timeTick = 0;
				break;
			case 81: //Q
				clearInterval(trainingTimer);
				startExperimentTimer();
				isTraining = false;		
			break;
			case 87: //W
				excapeTraining();
			break;
			case 83: //S
				savelog();
			break;
			case 70: //f
				console.log("main :" + $(".main").css("margin-top"));
				console.log("index :" + $("#secondScrollIndex").css("top"));
					currentBookmark++;
					appendBookmark(currentBookmark);
					$("#bm"+currentBookmark).css({"top":$("#secondScrollIndex").css("top")});
					
				
			break;
			case 80: //P
				showsurvayLink();
					
				
			break;
			
		}
	});
	


	
	function gotoNextBookmark(){
		currentBookmark++;
		gotoBookmark(currentBookmark);	
		bookmarked = false;
	}

	function gotoBookmark(index){
		if(currentBookmark >= bookmarksArray.length){
			
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
				}).then((willDelete) => {
					startExperiment();
				});
			}else{
				
			}
			
			
			return;
		}
		$('.main').css('margin-top', "-"+(bookmarksArray[index].p)  + "px");
		$("#secondScrollIndex").css({"top": ( bookmarksArray[index].index ) +"px" });
		currentMargin = Math.abs(parseInt($('.main').css('marginTop')));
		scrollIndex = Math.floor(Math.abs(currentMargin) / SCROLL_STEP) * -1;	

	}
	
	
	
	
	$(document).on('click', '.bookmark', function(e){
		if(!isExperimenting) return;
		index = parseInt($(e.target).attr("id").replace("bm", ""));
		currentBookmark = index;
		gotoBookmark(index);
		isTarget(index);
		if(isTraining) timeTick = 0;
	});

	console.log(targetArray[currentTarget].id + ":" );
	

	
	function startNewRound(){
		experimentRound++;
		currentTarget = 0;
		shuffle(targetArray);
		while(preRoundLastId == targetArray[0]){
				shuffle(targetArray);
				
		}
		
		preRoundLastId = targetArray[targetArray.length - 1];
		
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
		if(!isTraining) return;

		if(currentBookmark >= bookmarksArray.length ) return;
		$(".iconContainer").animate({
			backgroundColor: "rgba(255, 0, 0, 0.7)",
		},1000);	
		$(".iconContainer").animate({
			backgroundColor: "rgb(rgb(255, 255, 255))",
		},1000);
		thumTop = bookmarksArray[currentBookmark].index;
		if(icons != 2) bookmarked = true;
		appendBookmark(currentBookmark);
		$("#bm"+currentBookmark).css({"top":thumTop + "px"});
	}
	
	function appendBookmark(currentBookmark){
		switch (icons){
			case -1: //No Icons
				$("#scroll2").append("<div id='bm"+currentBookmark+"' class='bookmark orangeBc' >"+""+"</div>");
			break;
			case 1: // Random icons 
				$("#scroll2").append("<div id='bm"+currentBookmark
									+"' class='bookmark orangeBc' ><img  class='icon' id='bm"+currentBookmark
									+"' src='icons/"+iconsArray[currentBookmark]+".png' /></div>");
			break;
			case 2: // user Pciked icons
				selectIcon(currentBookmark);
			break;
		}
	}

	
	function goToTheFirstPage(){
		$('.main').css('margin-top', "0px");
		$("#secondScrollIndex").css({"top": "0px" });
		scrollIndex = 0;	
	}
	
	
	function selectIcon(currentBookmark){
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
		iconMenuTimePassed = 0;
		clearInterval(iconMenuTimer);

	});
	
	
	/////////////////////////////////////////////
	//Training Session
	/////////////////////////////////////////////
	isTraining = true;

	swal({
		title: "Training Sesssion",
		text: "In this part you'll be shown some pages of a document.After 5 seconds system will place a bookmark . To go to next target press 'Space' ",
		//icon: "success",
		button: "Start",
		allowOutsideClick: false,
		closeOnClickOutside: false,
	}).then((willDelete) => {
		startTrainingSession();
	});
	
	
	function startTrainingSession(){
		gotoNextPage();
	}
	
	function gotoNextPage(){
		if(currentBookmark < bookmarksArray.length){
			currentBookmark++;
			gotoBookmark(currentBookmark);	
			timer1 = setTimeout(function (){
				placeBookmark();
				
				timer2 = setTimeout(function(){
					gotoNextPage();
				},TRAINING_SESSION_DELAY);
				
				
			},DELAY_BEFORE_RANDOM_ICON);
			
		}else{
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
			}).then((willDelete) => {
				startExperiment();
			});
		}
	}

	
	

	
	//////////////////////////////
	// Experiment
	/////////////////////////////
	function startExperiment(){
		saveIconMenuLog();
		startTime = Date.now();
		requestNextScreenshot();
		pauseTimer = false;
		isTraining = false;
		clearTimeout(timer1);
		clearTimeout(timer2);
		startExperimentTimer();
		timeTick=0;
	}
	
	
	function saveIconMenuLog(){
		if(icons != 2) return; // if the icons is not supposed to be selected by user do nothing
		if(sampleRound) return;
		var request = $.ajax({
			url: "ajax/index.php",
			method: "POST",
			data: { 
				log : iconMenuLog,
				subjectId : ">"+subjectId,
			},
			dataType: "html"
		});


		 
		request.fail(function( jqXHR, textStatus ) {
		  alert( "Error saving log" );
		});
		
		
	}
	
	
	function startExperimentTimer(){
		isExperimenting = true;
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
					if(currentTarget >= targetArray.length){
						nextRound();
					}else{
						requestNextScreenshot();
						goToTheFirstPage();
						timeTick=0;
						pauseTimer = false;
					}
					if(currentTarget < targetArray.length) console.log("CT: "+targetArray[currentTarget].id);
				});
				
			}
			
		}, 10 );
		

	}
	

	
	
	
	function shuffle(targetsArray){
		
	  for (i = targetsArray.length - 1; i >= 0; i -= 1) {
		j = Math.floor(Math.random() * (i + 1))
		temp = targetsArray[i];
 		targetsArray[i] = targetsArray[j];
		targetsArray[j] = temp 
	  }
		
		return targetsArray;
	}
	
	////////////////////////////
	// make log
	////////////////////////////
	


	
	function makeLog(completed,eventType,eventTarget){
		if(currentTarget >= targetArray.length) return;
		
		timeLength = Date.now() - startTime;
		
		//console.log("now()" + Date.now() + " : " + "startTime " + startTime + " : " + timeLength);
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
		
		targetId = targetArray[trail-1].id;
		difficulty = targetArray[trail-1].d;
		


		
		
		log = logId + "#" + subjectId + "#" + interfaceNumber + "#" + block + "#" + trail + "#" + targetId+ "#" + 
		completed +"#" + eventType +"#"+ eventTarget +"#" + timeLength +"#" + Date.now()  + "<br/>"; 
		
		log = logId + " #subjectId: " + subjectId + " #interfaceNumber: " + interfaceNumber + " #block:" + block 
		+ " #trail: " + trail + " #targetId: " + targetId+ " #completed: " + completed +" #eventType: " + eventType 
		+" #eventTarget: "+ eventTarget +" #timeLength: " + timeLength  +" #difficulty: " + difficulty  +" #now: " + Date.now()  + "<br/>"; 
		
		$("#logContainer").append(log);
		console.log(log);
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
			showsurvayLink();
		});
		 
		request.fail(function( jqXHR, textStatus ) {
		  alert( "Request failed: Call Ehsan" );
		});
	}
	
	
	function showsurvayLink(){
		
		html = "<br/><a href='https://goo.gl/forms/WzDSLn3bfRyM2BVO2' target='_blank' >NASA TLX questionnaire</a><br/><br/>";
		html += "<a href='https://goo.gl/forms/8zsls4emmSUs9iwa2' target='_blank' >Overall questionnaire</a>";
		
		$("#modal").html(html);
		//$("#modal").html("");
		$("#modal").show();
		
	}
	
	
	
	function isTarget(index){
		if(currentTarget >= targetArray.length) return;
		if(targetArray[currentTarget].id == index){
			//it is target.
			makeLog(true,"click",index);
			currentTarget++;
			if(currentTarget < targetArray.length) console.log("currentTarget: "+targetArray[currentTarget].id);
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
			
			if(currentTarget >= targetArray.length){
				//Stop going more than number of items in the targetArray
				nextRound();

				
			}

		}else{
			//it is not a target! 
			console.log("c0");
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
			}).then((willDelete) => {
				goToTheFirstPage();
				startNewRound();
				console.log(targetArray[currentTarget].id + ":" );
				requestNextScreenshot();
			});
		}else{
			//experiment is over
			savelog();
			swal({
				title: "Thank you for you participation",
				text: " ",
				icon: "success",
				button: "Finish",
				allowOutsideClick: false,
				closeOnClickOutside: false,
			})
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
		startTime = Date.now();
		document.cookie = "ScreenShot="+ (targetArray[currentTarget].id+1);
	}
	
	
	
	//////////////////////////
	// Icons 
	//////////////////////////
	var iconsArray = new Array (1,2,3,4,5,12,6,8,31,24,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32);
	//shuffle(iconsArray);
	
	
	
	
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
	
	
	
	
});













