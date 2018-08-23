$(document).ready(function(){
	
	
	// Defining var and const
	HEIGHT_OF_WINDOW = $(window).outerHeight();
	WIDTH_OF_WINDOW = $(window).outerWidth();
	HEIGHT_OF_REAL_PAGE = 1300;
	NUMBER_OF_LANDMARKS = 30;
	SCROLL_STEP = 150;
	
	HEIGHT_OF_WINDOW = $(".iconContainer").height();
	heightOfScrollbar = $(".iconContainer").height();
	SIZE_OF_LANDMARK =(HEIGHT_OF_WINDOW) / NUMBER_OF_LANDMARKS;
	SIZE_OF_ICON = SIZE_OF_LANDMARK-4;
	
	NUMBER_OF_ICONS_OF_EACH_CAT  = 5;
	scrollIndex = 0;
	currentLandmarkNum=0;
	firstKeyDown = "";
	heightOfScrollIndex = 20;
	heightOfDocument = 0;
	clickOffset = 0;
	lastPos = 0;
	lastEvent = "";
	uTime = 0;

	//height Of main = 48305;
	
	
	
	EXPERIMENT_TARGET_TIME = 600 * 1000;
	NUMBER_OF_TRAINING_ROUNDS = 2;
	NUMBER_OF_TRAINING_TARGETS = 6;
	NUMBER_OF_EXPERIMENT_ROUNDS = 4;
	NUMBER_OF_EXPERIMENT_TARGETS = 6;
	DELAY_FOR_REACTION = 15 * 1000;
	currentTarget = -1; 
	intractable = true;
	lock = false;
	trainingRound = 0; 
	isTrainingSession = false; 
	trainingTargets = 0; 
	timeTick = 0;
	indexClicked = false;
	startTime = Date.now();
	experimentFinished = false;
	logId= 0;

	var url_string = window.location.href;
	var url = new URL(url_string);
	sampleRound = false;
	
	
	var targetsArray = new Array(
								{id:5, p : 25950, index:529.078 , l : 16,o:true},
								{id:8, p : 25500, index:848.78 , l : 26,o:true},  //No Photo
								{id:9, p : 4200, index:898.765 , l : 28,o:true},  
								{id:3, p : 44250, index:349.14 , l : 10,o:false}, //No Photo
								{id:7, p : 43050, index:732.343 , l : 22,o:false},
								{id:6, p : 23100, index:687.2031 , l : 21,o:true});
								
								
/* 								{id:2, p : 24600, index:304.203 , l : 9,o:true},
								{id:1, p : 23400, index:239.406 , l : 7,o:true},
								{id:0, p : 42450, index:91.9531 , l : 2,o:false},  
								{id:4, p : 44100, index:477.046 , l : 14,o:false}, */
								

								
	var experimentTargetsArray = new Array(0,1,2,3,4,5,6,7,8);
	var lengthOfDoc = new Array(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0);
	
	document.cookie = "ScreenShot=-1";
	var LandMarkFolder = "oneLand";

	if(url.searchParams.get("SampleRound") == "true"){
		LandMarkFolder = "exp";
		alert("Practice Round");
		NUMBER_OF_TRAINING_ROUNDS = 1;
		NUMBER_OF_TRAINING_TARGETS = 2;
		NUMBER_OF_EXPERIMENT_ROUNDS = 1;
		NUMBER_OF_EXPERIMENT_TARGETS = 2;
		sampleRound = true;
		var targetsArray = new Array({id:0, p : 15000 , index:489, l : 15,o:true},{id:1,p : 24450 , index:656.093, l : 20,o:false});
		document.cookie = "folder=oneLandExp";

	}else{
		document.cookie = "folder=oneLand";
		
	}
	$("#subjectId").val(url.searchParams.get("subjectId"));
	
	

	//content aligh center
	mainWidth = parseInt($(".main").css('width'));
	SCWidth = parseInt($(".scrollbarContainer").css('width'));
	margin = (WIDTH_OF_WINDOW /2) - (mainWidth/2) - SCWidth;
	
	$(".main").css('margin-left',margin+'px');
	
	
		
	//Add Icons to scrollbars	
	for(i = 0; i < NUMBER_OF_LANDMARKS; i++ ){
		
		if(i%2 == 0){
			$('#scroll1').append('<img id="icon'+i+'" class="landmarkimg firstScrollIcons " width="'+ SIZE_OF_ICON +'" height="'+ SIZE_OF_ICON +'" src="images/target.png" /><br/>')
			
		}else{
			
			$('#scroll1').append('<img id="icon'+i+'" class="landmarkimg firstScrollIcons " width="'+ SIZE_OF_ICON +'" height="'+ SIZE_OF_ICON +'" src="images/target.png" /><br/>')
		}
			
	}
	
	for(i = 0; i < NUMBER_OF_LANDMARKS; i++ ){
		$('#scroll2').append('<img id="icon'+i+'" class="landmarkimg secondScrollIcons" width="'+ SIZE_OF_ICON +'" height="'+ SIZE_OF_ICON +'" src="images/target.png" /><br/>')
	}

	for(i = 0; i < NUMBER_OF_LANDMARKS; i++ ){
		$('#secondIndex').append('<img id="icon'+i+'" class="indexScrollIcons" width="'+ SIZE_OF_ICON +'" height="'+ SIZE_OF_ICON +'" src="images/target.png" /><br/>')
	}
	//$("#scroll1 #icon0").css({ "background-color":"#78d6e2" });
	$("#secondScrollIndex").css({ "width":SIZE_OF_ICON,"height":heightOfScrollIndex,"top":"0px" });
	
	
	firstNum = 1;
	secondNum = 1;
	$(".firstScrollIcons").each(function(){
		$(this).attr("src","images/icon/"+firstNum+".png");
		firstNum++;
	
	});
	
	
	//Document manipulation
	//content aligh center
	mainWidth = parseInt($(".main").css('width'));
	SCWidth = parseInt($(".scrollbarContainer").css('width'));
	margin = (WIDTH_OF_WINDOW /2) - (mainWidth/2) - SCWidth;
	
	 $(".main").css('margin-left',margin+'px');
	
	//***
	$(".main").css('padding','0px');

	// add extra margin to the icons to make the scrollbar looks longer and fit the window
	endOfscroll = ($("#icon29").position().top +SIZE_OF_LANDMARK );
	newMargin = ((HEIGHT_OF_WINDOW - endOfscroll) / NUMBER_OF_LANDMARKS ) /2;
	$(".landmarkimg").css("margin-top", newMargin + "px");
	
	
	//************** pagination 
	goToLandmark(0,true,0,false,false);
	
	function goToLandmark(id,moveToBegining,y_input,showTarget,moveToEnd){
		currentLandmarkNum = id;
		$.ajax({
			url : "content/newContent/"+LandMarkFolder+"/("+(id+1)+").log",
			dataType: "text",
			success:function(html) {
				$('.main').html(html).promise().done(function() {
					$(".main").css("background-color","#444444");
					$(".gradientback").show();
					
					scrollLock = false;
					changeImgAlignment();
					if(moveToBegining) {
						resetPageScroll();
					}else{
						if(showTarget){
							$(".main").css("margin-top","-" + y_input +"px");
							
							scrollIndex = Math.floor(Math.abs(y_input) / SCROLL_STEP) * -1;
						}else{
							if(moveToEnd){
								moveToEndOfSecondSC();
							}else{
								goToSecondScrollPos(y_input,id);
								
							}
						}
					}
					

					if(lastEvent.length > 1){
						isTarget(lastEvent);
					}
				});
			}
		});

	}
	
	function CalculateSecondScroll(){
	
		currentMargin = Math.abs(parseInt($('.main').css('marginTop')));
		totalHeightOfDoc = $('.main').height()*30;
		heightOfScrollbar = $(".iconContainer").height();
		
		indexPos = (currentMargin*heightOfScrollbar)/totalHeightOfDoc;
		
		indexPos -= 10;
		indexPos += (heightOfScrollIndex / 2);
		indexPos += currentLandmarkNum * (($("#icon1").position().top - $("#icon0").position().top));
		$("#secondScrollIndex").css({"top": ( indexPos ) +"px" });
		
		calculateEndOfBlock();
		calculateStartOfblock();

		
	}
	
	function goToSecondScrollPos(y_input,id){
		clickedPos = y_input - ($("#icon"+id).position().top );
		mainHeight = $(".main").height();
		heightOfLand = $("#icon"+id).height()+4;
		
		//console.log("y_input:" + y_input + " top:" + $("#icon"+id).position().top  );
		currentMargin = (mainHeight * clickedPos)/31.81;
		
		$(".main").css("margin-top","-" + currentMargin + "px");
		scrollIndex = Math.floor(Math.abs(currentMargin) / SCROLL_STEP) * -1;	
		//console.log("m:" + getMainMargin() + " cm:" + currentMargin);

	}
	
	function calculateEndOfBlock(){
		marginTop = Math.abs(parseInt($(".main").css('margin-top')));
		mainHeight = parseInt($(".main").height());
		if((marginTop + (HEIGHT_OF_WINDOW / 1.5) ) > mainHeight){
			if(scrollLock)return;
			if( currentLandmarkNum < 29){
				scrollLock = true;
				currentLandmarkNum++;
				goToLandmark(currentLandmarkNum,true,0,false,false);
			}
			
		}
	}
	
	function calculateStartOfblock(){
		marginTop = Math.abs(parseInt($(".main").css('margin-top')));
		if(marginTop == 0){
			if( currentLandmarkNum > 0){
				scrollLock = true;
				currentLandmarkNum--;
				EndOfIcon = $("#icon" + currentLandmarkNum).position().top + SIZE_OF_LANDMARK - 0.2;
				//console.log("EndOfIcon:"+EndOfIcon);
				goToLandmark(currentLandmarkNum,false,EndOfIcon,false,true);
		
			}
			
		}
	}
	
	function moveToEndOfSecondSC(){
		// Takes us the the position of the where second scroll bar point

		marginTop = $(".main").height();
		marginTop-=500;
		$(".main").css("margin-top","-"+(marginTop)+"px");
		scrollIndex = Math.floor( (marginTop) / SCROLL_STEP) * -1;
		
	} 
	
	function locateIndex(y_input){
		$('#secondScrollIndex').css('top', ((y_input - (heightOfScrollIndex / 2)) + clickOffset )+ "px");
		//$('#secondScrollIndex').css('top', ((y_input - (heightOfScrollIndex / 2)) )+ "px");
	}
	

	
	function findId(y){
		for(i=0;i<30;i++){
			ptop = $("#icon"+i).position().top;
			if(ptop > y){
				return i-1;
			}
		}
	}
	
	
	//********** Events
	
		// Scroll the page
	$('.main , body').bind('mousewheel', function(e){
		if(e.originalEvent.wheelDelta < 0) {
			//scroll down
			scrollThePage(false)
		}else {
			//scroll up
			scrollThePage(true)
		}
		//console.log("Margin: "+$('.main').css('margin-top'));
		return false;
	});
	
	
	function scrollThePage(up){
		if(!intractable && !isTrainingSession) return;
		dir = "";
		if(up){
			dir = "U";
			if(scrollIndex == 0) return false;
			scrollIndex++;
		}else{
			dir = "D";
			scrollIndex--;
		}
		$('.main').css('margin-top', (scrollIndex * SCROLL_STEP)  + "px");
		CalculateSecondScroll();
		lastEvent = "S"+dir;
		isTarget("S"+dir);
	}
	
	
	$(document).on('click', '.landmarkimg', function(e){
		if(!intractable) return;
		locateIndex(e.clientY);
		id = $(this).attr('id').replace("icon", "");
		lastEvent ="FC";
		goToLandmark(parseInt(id),false,e.clientY,false,false);
		currentLandmarkNum = id;
	});
	

		// scrollIndex Drag
	
 	var isDown2 = false;
	$( "#secondScrollIndex" ).mousedown(function(e) {
		if(!intractable) return;
		isDown2 = true;
		lastPos = e.clientY;
		indexpos = $(this).position().top + ( heightOfScrollIndex / 2 );
		clickOffset = Math.round(indexpos - e.clientY);
	});

	$( "#secondScrollIndex" ).click(function(e) {
		if(lock) return;
		indexClicked = true;
	});

	$( "body" ).mouseup(function(e) {
		if(!intractable) return;
		if(isDown2){
			locateIndex(e.clientY);
			id = findId(e.clientY);
			currentLandmarkNum = id;
			goToLandmark(parseInt(id),false,e.clientY + clickOffset,false,false);
			if(lastPos < e.clientY){
				// drag down
				lastEvent = "DD";
			}else if (lastPos > e.clientY){
				// drag up
				lastEvent = "DU";
			}else{
				// click
				lastEvent = "";
			}
		}
			//goToSecondScrollPos(e.clientY,id );
		isDown2 = false;
		clickOffset = 0;
		$(".main").css("background-color","#444444");
		$(".gradientback").show();
		
		
		
	});
	$("#scroll2").mousemove(function(e){
		if(!intractable) return;
		if(isDown2) { 
			locateIndex(e.clientY);
			scrollIndex = 0;
			$(".main").css('margin-top','0px');
			//console.log("Y: "+e.clientY + " clickOffset: " + clickOffset);
			loadPreviewPage(findId(e.clientY),e.clientY + clickOffset);
		}
	});
	$("#scroll2").mouseout(function(e){
		if(isDown2) {        
			//id = findId(e.clientY);
			//currentLandmarkNum = id;
			//goToLandmark(parseInt(id),false,e.clientY);

			//goToSecondScrollPos(e.clientY,id );
		}
			//isDown2 = false;
	});
	$("#scroll2").mouseenter(function(e){
		if(!intractable) return;
		if(isDown2) {        
			locateIndex(e.clientY);
			scrollIndex = 0;
			$(".main").css('margin-top','0px');
			loadPreviewPage(findId(e.clientY),e.clientY + clickOffset);
		}
			//isDown2 = false;
	});

	$(document).mousemove(function(e){
		if(!intractable) return;
		if(isDown2) { 
			locateIndex(e.clientY);
			scrollIndex = 0;
			$(".main").css('margin-top','0px');
			loadPreviewPage(findId(e.clientY),e.clientY + clickOffset);
		}
		clearSelection();
	});
	
	
	
	$(".main").click(function(){
		console.log("margin "+$(".main").css("margin-top"));
		console.log("landMark "+ currentLandmarkNum);
		console.log("index "+ $("#secondScrollIndex").position().top);
		
		
	});
	
	
	
	
	
	
	//************ Experiment and Training
	
	runTraining();
	function runTraining(){
		intractable = false;
		isTrainingSession = true;
		if(trainingRound < NUMBER_OF_TRAINING_ROUNDS){
			if(trainingTargets <NUMBER_OF_TRAINING_TARGETS){
				showTheTarget(trainingTargets,1);
				trainingTargets++;
			}else{
				trainingTargets = 0;
				trainingRound++;
				showTheTarget(trainingTargets,1);
				trainingTargets++;
				showMessage("Training Round: "+ trainingRound + " Finished!!!<br/>Let's do this training again.",1);
			}
			
		}
		
		if(trainingRound >= NUMBER_OF_TRAINING_ROUNDS){
			showTheTarget(-2,1);
			showMessage("Training Finished!!!",1);
			clearInterval(trainingTimer);
			endOfTraining();
		}	
				
	}
	
	
	
	function showTheTarget(input,animationType){
		if(input == -2){
			//Reset
			currentLandmarkNum = 0;
			goToLandmark(currentLandmarkNum,true,0,true);
		}else{
			currentLandmarkNum = targetsArray[input].l;
			$("#secondScrollIndex").css({"top": targetsArray[input].index + "px"});
			goToLandmark(currentLandmarkNum,false,targetsArray[input].p,true);
		}

	}
	
	trainingTimer = setInterval(function(){ 
		//console.log(timeTick);
		timeTick += 10;
		if(indexClicked){
			timeTick = 0;
			runTraining();
			indexClicked = false;
		}else  if(timeTick > DELAY_FOR_REACTION){
			showMessage("Please Try to Remember the Location of the Scroll-thumb (blue square/s) in the Scrollbar for this page.",1);
		}
	}, 10);
	
	
	
	function showMessage(input,size){
		intractable = false;
		lock = true;

		$("#modal").css({"background-color":"#28e0e0"});
		$("#modal-msg").html(input);
		$("#modal").css({"width": "600px"});
		
		switch(size){
			case 1:
				$("#modal-type").val("1");
			break;
			case 2:
				$("#modal-type").val("2");
				trainingRound = -2;
			break;
			case 3:
				$("#modal").css({"background-color":"#fc5a5a"});
				$("#modal-type").val("3");
			break;
			case 4:
				$("#modal-type").val("4");
			break;
			case 5:
				$("#modal-type").val("5");
			break;
			case 6:
				$("#modal").css({"background-color":"#9bffa5"});
				$("#modal-type").val("6");
			break;
		}
		modalCenter();
		$("#modal").show();
		
	}
	
	
	
	$("#modal-btn").click(function(){
		lock = false;
		$("#modal").hide();
		type = $("#modal-type").val();
		switch(type){
			case "1":  //user didn't click on scrollbar or training round finished
				timeTick = 0;
			break;
			case "2": //Training finished
				intractable = true;
				currentLandmarkNum = 0;
				uTime = Date.now();
				targetsArray = shuffle(targetsArray);
				targetsArray = shuffle(targetsArray);
				startExperiment();
				//eventVarReset();
				isTrainingSession = false;
			break;
			case "3": // target not found
 				//tempPosition = 0;
				nextTarget();
				intractable = true;
				startExperiment(); 
			break;
			case "4":  //Experiment Round finished.
				clearTimeout(expTimer);
				goToLandmark(currentLandmarkNum,true,1,false);
				intractable = true;
				uTime = Date.now();
				startExperiment(); 
			break;
			case "5": // Experiment finished.
 				clearTimeout(expTimer);
				saveOnserver();
				$(".main").hide();
				$(".scrollbarContainer").hide(); 
			break;
			case "6": // target found .
 				clearTimeout(expTimer);
				intractable = true;	
				nextTarget();
				startExperiment();
			break;
		}
		
		
	});
	
	function endOfTraining(){
		currentLandmarkNum = 0 ;
		goToLandmark(currentLandmarkNum,true,0,false);
		input = 'Training Session Ended. <br/><br/><b> Testing Session </b><br/> Now, Please Find the Pages Shown in the Left Monitor Using the Scrollbar in the Right Monitor.';
		showMessage(input,2);

	}
	
	experimentRound = 1; 
	currentTarget++;
	
	function startExperiment(){
		goToLandmark(0,true,0,false);
		$("#secondScrollIndex").css("top","0px");

		startTime = Date.now();
		requestNextTarget(targetsArray[currentTarget].id+1);
		expTimer = setTimeout(targetNotFound , EXPERIMENT_TARGET_TIME);

	}
	
	function targetNotFound(){
		lastEvent = "TO";
		//user couldnt find the item .
		// should show the target to user.

		//tempIndexPos = $("#secondScrollIndex").css("top");
		intractable = false;
		showMessage("Page Not Found!<br/>Please Look at the Actual Location/s of blue squre/s in the scrollbar.",3);
 		showTheTarget(currentTarget,2);
		currentTarget++;
	}
	
	function requestNextTarget(input){
		document.cookie = "ScreenShot="+ (input);
	}
	
	function nextTarget(){
		if(currentTarget >= NUMBER_OF_EXPERIMENT_TARGETS ){
			currentTarget = 0;
			showMessage("<b>Round: " + ( experimentRound )+ " out of 4 Finished!!!<br/><br/>Now Round " + (experimentRound+1)+"</b>",4);
			experimentRound++;
			targetsArray = shuffle(targetsArray);
			targetsArray = shuffle(targetsArray);
		}
		isExperimentFinished();


		requestNextTarget(targetsArray[currentTarget].id+1);
	}
	
	
	function isExperimentFinished(){
		if(experimentFinished) return;
		if(experimentRound > NUMBER_OF_EXPERIMENT_ROUNDS){
			showMessage("Experiment Finished!!!",5);
			clearTimeout(expTimer);
			experimentFinished = true;
		}
		
	}
	function isTarget(eventType){
 		lastEvent = "";
		completed = false;
		if(trainingRound != -2) return;
		isExperimentFinished();
		if( currentTarget < 0) return;
		var marginTop = Math.abs(parseInt($(".main").css("margin-top")));

		
		
		var targetLandmark = targetsArray[currentTarget].l ;
		var targetPos = targetsArray[currentTarget].p;
				
		if(currentLandmarkNum == targetLandmark){
			if(((marginTop >= targetPos-500)&&(marginTop <= targetPos))||((marginTop <= targetPos+500)&&(marginTop >= targetPos))){
				clearTimeout(expTimer);
				currentTarget++;
				completed = true;
				showMessage("Target: found!!!<br/>Please Find Next Page.",6);
			}
		}
		

		makeLog(completed,eventType); 
		
	}
	
	
	
	function makeLog(completed,eventType){
		timeLength = Date.now() - startTime;
		logId++;
		subjectId = $("#subjectId").val();
		interfaceNumber = "OneLandmark";
		documentNumber = $("#documentNumber").val();
		block = experimentRound-1;
		if((!completed)||(lastEvent == "TO")){ // cuz if the traget is found the current target will be increased.
			trail = currentTarget;	
		}else{
			trail = currentTarget -1 ;	
		}
		targetsArraySet = $("#targetsArraySet").val();
		onLandmark = targetsArray[trail].o;
		var today = new Date();
		var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
		var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
		var dateTime = date+' '+time;
		LM1SelectedCorrect = false;
		LM2SelectedCorrect = false;
		firstDistance = 0;
		secondDistance = 0;
		targetId = targetsArray[trail].id
		targetLand = targetsArray[trail].l
		LM1SelectedCorrect = true;
		
			
		if(targetsArray[trail].l == currentLandmarkNum){
			// If task completed both are on the right location
			LM2SelectedCorrect = true;
		}else{
			LM2SelectedCorrect = false;	
		}
		LM1SelectedCorrect = LM2SelectedCorrect;
		if(completed){
			distance = 0;
		}else{
/* 			if(targetsArray[trail].l == currentLandmarkNum){
				firstDistance = 0;
			}else{
				//firstDistance = (Math.abs(currentTarget].l - currentLandmarkNum)*SIZE_OF_LANDMARK) - (SIZE_OF_LANDMARK/2) ;
				firstDistance = Math.abs(targetsArray[trail].l - currentLandmarkNum) ;
			}
			
			secondIndexPos = $("#secondScrollIndex").position().top ;//- SIZE_OF_LANDMARK/2;
			if(eventType == "FC"){ // when user click on the sconde scroll bar the index of secondscbar is not in the position. 
				secondIndexPos = 0;
			}
			
			secondDistance = targetsArray[trail].p - getMainMargin(); */
			
			distance = calculateDistance(targetsArray[trail].l,currentLandmarkNum,targetsArray[trail].p,getMainMargin())
			
			
		}
		
   		/*console.log("**********");
		console.log("logId: " + logId);
		console.log("subjectId: " + subjectId);
		console.log("interfaceNumber: " + interfaceNumber);
		console.log("documentNumber: " + documentNumber);
		console.log("block: " + block);
		console.log("trail: " + trail);
		console.log("targetsArraySet: " + targetsArraySet);
		console.log("targetId: " + targetId);
		console.log("onLandmark: " + onLandmark);
		console.log("LM1SelectedCorrect: " + LM1SelectedCorrect);
		console.log("LM2SelectedCorrect: " + LM2SelectedCorrect);
		console.log("firstDistance: " + firstDistance);
		console.log("secondDistance: " + secondDistance);
		console.log("completed: " + completed);
		console.log("eventType: " + eventType);
		console.log("timeLength: " + timeLength);
		console.log("startTime: " + startTime);
		console.log("dateTime: " + dateTime);   
		console.log("distance: " + distance);   */
		
		log = logId + "#" + subjectId + "#" + interfaceNumber + "#" + block + "#" + trail + "#" + targetId+ "#" + targetLand + "#" 
		+ onLandmark + "#" + LM1SelectedCorrect + "#" + LM2SelectedCorrect +"#" + completed +"#" + eventType
		+"#" + timeLength +"#" + uTime +"#" + Date.now() +"#" + distance + "<br/>"; 
		
		$("#logContainer").append(log);
		console.log(log);
		startTime = Date.now();

	}
	
	function calculateDistance(targetLandmark,currentLandmarkNum,targetPos,currentPos){
		//calculate distance between target and event
		res = 0;
		mainHeight = $(".main").height();
		// then usere selected the right landmark so all we need is to subtract targetPos of currentPos
		if(targetLandmark == currentLandmarkNum){ 
			res = targetPos - currentPos;
		}else{ 	//user didn't select the landmark correctly so first we calculate the betweenlandmarks
		
			// see current landmark is up of down the target
			if(targetLandmark > currentLandmarkNum){
				
				for(i = currentLandmarkNum;i < targetLandmark;i++){
					//calculate the margin of all blocks between
					res += mainHeight;
				}
				//to calculate If user is not at the start of the block and already has some margin of top
				res -=  currentPos;
				res +=  targetPos;
				
			}else{
				// see current landmark is up of down the target

				for(i = currentLandmarkNum-1;i >= targetLandmark;i--){
					//calculate the margin of all blocks between
					res += mainHeight;
				}
				//to calculate If user is not at the start of the block and already has some margin of top
				res +=  currentPos;
				res -=  targetPos;
				
			}
		
		}
		return Math.abs(res);
	
	}
	
	
	
	function saveOnserver(){
		if(sampleRound) return;

		subjectId = $("#subjectId").val();
		log = $("#logContainer").html();
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
	
	
	
	
	
	
	
	
	
	
	
	function shuffle(targetsArray){
		
	  for (i = targetsArray.length - 1; i >= 0; i -= 1) {
		j = Math.floor(Math.random() * (i + 1))
		temp = targetsArray[i];
 		targetsArray[i] = targetsArray[j];
		targetsArray[j] = temp 
	  }
		
		return targetsArray;
	}
	
	

	function resetPageScroll(){
		scrollIndex = 0;
		$(".main").css('margin-top','0px');
	}
	
	
		// Align Images Randomly
	function changeImgAlignment(){
		$(".main img").each(function(){
			if($(this).attr("src") == undefined){
				return;	
			}
			num = ($(this).attr("src").length % 10)
	
			
			if(num > 7){
				if($(this).width() + 300 < 940)
					$(this).css('margin-left', '300px');
			}else if(num >= 4){
				if($(this).width() + 600 < 940)
					$(this).css('margin-left', '600px');
			}else{
				
				//$(this).attr('align', 'left');
			}
			
		});
		
	}
	
	function clearSelection() {
		if ( document.selection ) {
			document.selection.empty();
		} else if ( window.getSelection ) {
			window.getSelection().removeAllRanges();
		}
	}
	
	function loadPreviewPage(id,indexPos){
		if(currentLandmarkNum == id){
			goToSecondScrollPos(indexPos,id)
		}else{
			goToLandmark(parseInt(id),false,indexPos,false,false);
		}
		//$(".main").html($("#previews #"+ (id+1) ).html());
		$(".main").css("background-color","#fff");
		$(".gradientback").hide();
		clearSelection();


	}
	modalCenter();
	function modalCenter(){
		marginLeft = parseInt($("#modal").css("width").replace("px",""))/2;
		$("#modal").css({"margin-left": "-"+marginLeft +"px"});
	}
	
	function getMainMargin(){
		return Math.abs(parseInt($(".main").css("margin-top").replace("px","")));
	}
	
		$(document).keyup(function(e){
		//console.log(e.which);
		if(e.which == 83){ //S
			//console.log("secondScrollIndex " + Math.floor((parseInt($("#secondScrollIndex").position().top) + (SIZE_OF_LANDMARK/2) - 5.5)));
			//console.log("secondScrollIndex " + $("#secondScrollIndex").position().top);
			console.log("currentLandmarkNum " + currentLandmarkNum);
		}else if (e.which == 76){ //L
		}else if (e.which == 81){ //Q
			indexClicked = true;
		}else if (e.which == 87){ //W
		}else if (e.which == 69){ //R
		}else if (e.which == 84){ //T
		}else if (e.which == 89){ //Y
		}else if (e.which == 65){ //A
		}else if (e.which == 68){ //D
		}else if (e.which == 70){ //F
			showFinalSurvayLink();
		}else if (e.which == 71){ //G
			saveOnserver();
		}
	});
	
	function gotoNextPrevBlock(){
		//takes us to next block if the margin is grater than the size of the main
		// or to previous block if the margin is less than the size of main		
		marginTop = getMainMargin();
		if(marginTop > $(".main").height()){
			currentLandmarkNum++ ;
			goToLandmark(currentLandmarkNum,true,0,false,false);
		}
	}
	
	
	setInterval(function(){
		gotoNextPrevBlock();
  	},10);
			

			
	function showsurvayLink(){
		showMessage("<a href='https://docs.google.com/forms/d/e/1FAIpQLSdIi9gagowFAk3GVzHt6DCTFPFjZD2CZ8rW1ucm-shTJo7QTw/viewform?usp=sf_link' target='_blank' > survay </a>",6);
	}		
	
	function showFinalSurvayLink(){
		showMessage("<a href='https://docs.google.com/forms/d/e/1FAIpQLScD4G1eJ-l0P5TQdTRxe4DPIo6YW13UR6pNt8zsIVMwUnLoyA/viewform?usp=sf_link' target='_blank' > Final survay </a>",6);
	}
})