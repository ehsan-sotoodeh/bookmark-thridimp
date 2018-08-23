$(document).ready(function(){
	//Load First Content
	//height Of main = 48305;

	$.ajax({
		url : "allData.txt",
		dataType: "text",
		success:function(html,e,f) {
			process(html);
		}
	});
	
	//sbjId	interface	blk	trail	targetId	targetLand	onland	LM1Selected	LM2Selected	comp	eventTy	timelen	distance

	//res = 	"subject, condition, block, trail, targetId, err, comp, totalTime, Click, TimeOUt <br/>" ;		
	res = 	"subject, phase, block, trail, targetId, err, comp, distance, totalTime, startTimeToComplete, Click, TimeOUt <br/>" ;		
		
	$(".main").append(res);
	
	
	
	/* 	log =  + " #subjectId: " + subjectId + " #interfaceNumber: " + interfaceNumber + " #phase: " + currentPhase + " #block: " + block 
	+ " #trail: " + trail + " #targetId: " + targetId+ " #completed: " + completed +" #eventType: " + eventType +" #distance: " + distance 
	+" #eventTarget: "+ eventTarget +" #timeLength: " + timeLength+ " #startTimeToComplete: " + startTimeToCompletePlaceHolder +" #difficulty: " + difficulty  +" #now: " + Date.now()  + "<br/>"; 
	 */
	//logId 0/subjectId 1/interfaceNumber 2/phase 3/block 4/trail 5/targetId 6/completed 7/eventType 8/distance 9/eventTarget 10/timeLength 11/startTimeToComplete 12/
	
	var sbjIdIndex = 1;
	var interfaceIndex = 2
	var phaseIndex = 3
	var blockIndex = 4
	var trailIndex = 5;
	var targetIdIndex = 6;
	var compIndex = 7;
	var eventTyIndex = 8;
	var distanceIndex = 9;
	var eventTarget = 10;
	var timelenIndex = 11;
	var startTimeToCompleteIndex = 12;
	

	function process(input){
		var row = input.split("\n");
		var trail = -1;
		var totalTime = 0;
		var err = 0;
		var id = 1;
		var comp = "";
		var block = "";
		var condition = "";
		var subject = "";
		var phase = "";
		var startTimeToComplete = "";
		var distance = "";


		var C = 0;
		var TO = 0;
		for(i= 0; i < row.length;i++){
			var rowArray = row[i].split("#");
			
			switch(rowArray[eventTyIndex]){
				case "click":
					C++
					break;
				case "TO":
					TO++
					break;
			}
			console.log(trail+" "+trailIndex);
			if(trail == rowArray[trailIndex]){
				//console.log(trail);
				totalTime += parseInt(rowArray[timelenIndex]);
				block = rowArray[blockIndex];
				phase = rowArray[phaseIndex];
				distance = rowArray[distanceIndex];
				subject = rowArray[sbjIdIndex];
				condition = rowArray[interfaceIndex];
				startTimeToComplete = rowArray[startTimeToCompleteIndex];
				comp = rowArray[compIndex];
				targetId = rowArray[targetIdIndex];
				err++;
							console.log("11111");
			}else{
							console.log("00000");

				if(trail != "-1"){
					
					

					


					
					/*console.log("SI: " + subject + " Con:" + condition  + " B:" + block + " T:" + trail
								+ " ER:" + err + " CMP:" + comp+ " Tim:" + totalTime+ " FDis:" + fristDistance
								+ " dis:" + avgDis +" FC:"+ FC+" SC:"+ SC +" SU:"+ SU+" SD:"+ SD +" DU:"+ DU
								+" DD:"+ DD+" TO:"+ TO );*/

					
					res = 	"" + subject + " " + phase  + " " + block + " " + trail+ " " + targetId
								+ " " + err + " " + comp+ " " + distance+ " " + totalTime+ " " 
								+ startTimeToComplete+ " " + " " + " " + C +" "+ TO + "<br/>" ;		
								
					console.log(res);
					$(".main").append(res);
				}
				
				totalTime = parseInt(rowArray[timelenIndex]);
				comp = rowArray[compIndex];		
				condition = rowArray[interfaceIndex];
				trail = rowArray[trailIndex];
				block = rowArray[blockIndex];
				phase = rowArray[phaseIndex];
				distance = rowArray[distanceIndex];
				subject = rowArray[sbjIdIndex];
				targetId = rowArray[targetIdIndex];
				startTimeToComplete = rowArray[startTimeToCompleteIndex];

				err = 0;
				C = 0;TO = 0;
				//console.log(trail);
				
				
			}
		
		
		
		
		
		
		}
		
		
		
		
	}
	

	
	
});