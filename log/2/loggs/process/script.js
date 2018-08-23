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

	res = 	"subject, condition, block, trail, targetId, err, comp, totalTime, Click, TimeOUt <br/>" ;		
								
	$(".main").append(res);
	
	
	
	
	
	
	var sbjIdIndex = 1;
	var interfaceIndex = 2
	var blockIndex = 3
	var trailIndex = 4;
	var targetIdIndex = 5;
	var compIndex = 6;
	var eventTyIndex = 7;
	var eventTarget = 8;
	var timelenIndex = 9;
	

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
		
			if(trail == rowArray[trailIndex]){
				//console.log(trail);
				totalTime += parseInt(rowArray[timelenIndex]);
				block = rowArray[blockIndex];
				subject = rowArray[sbjIdIndex];
				condition = rowArray[interfaceIndex];
				comp = rowArray[compIndex];
				targetId = rowArray[targetIdIndex];
				err++;
			}else{
				if(trail != "-1"){
					
					
					
					if(condition == "icon" || condition == "num"|| condition == "alph") err -= 2;
					else err -= 1;
					
					

					
					
					/*console.log("SI: " + subject + " Con:" + condition  + " B:" + block + " T:" + trail
								+ " ER:" + err + " CMP:" + comp+ " Tim:" + totalTime+ " FDis:" + fristDistance
								+ " dis:" + avgDis +" FC:"+ FC+" SC:"+ SC +" SU:"+ SU+" SD:"+ SD +" DU:"+ DU
								+" DD:"+ DD+" TO:"+ TO );*/

					
					res = 	"" + subject + " " + condition  + " " + block + " " + trail+ " " + targetId
								+ " " + err + " " + comp+ " " + totalTime+ " " + " " + " " + C +" "+ TO + "<br/>" ;		
								
					console.log(res);
					$(".main").append(res);
				}
				
				totalTime = parseInt(rowArray[timelenIndex]);
				comp = rowArray[compIndex];		
				condition = rowArray[interfaceIndex];
				trail = rowArray[trailIndex];
				block = rowArray[blockIndex];
				subject = rowArray[sbjIdIndex];
				targetId = rowArray[targetIdIndex];
				err = 1;
				C = 0;TO = 0;
				//console.log(trail);
				
				
			}
		
		
		
		
		
		
		}
		
		
		
		
	}
	

	
	
});