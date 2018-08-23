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
			var rowArray = row[i].split(" ");

			switch(rowArray[eventTyIndex]){
				case "FC":
					FC++
					break;
				case "SC":
					SC++
					break;
				case "SU":
					SU++
					break;
				case "SD":
					SD++
					break;
				case "DU":
					DU++
					break;
				case "DD":
					DD++
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
				distance += parseInt(rowArray[distanceIndex]);
				err++;
			}else{
				if(trail != "-1"){
					avgDis = (distance / (err-1) );
					
					if(isNaN(avgDis)) avgDis = 0;
					
					avgDis = Math.floor(avgDis);
					
					if(condition == "icon" || condition == "num"|| condition == "alph") err -= 2;
					else err -= 1;
					
					
					if(err == 0){
						avgDis = 0;
						fristDistance = 0;
					}
					
					
					/*console.log("SI: " + subject + " Con:" + condition  + " B:" + block + " T:" + trail
								+ " ER:" + err + " CMP:" + comp+ " Tim:" + totalTime+ " FDis:" + fristDistance
								+ " dis:" + avgDis +" FC:"+ FC+" SC:"+ SC +" SU:"+ SU+" SD:"+ SD +" DU:"+ DU
								+" DD:"+ DD+" TO:"+ TO );*/

					
				}
					res = 	"" + subject + " " + condition  + " " + block + " " + trail+ " " + targetId
								+ " " + err + " " + comp+ " " + totalTime+ " " + fristDistance
								+ " " + avgDis +" "+ FC+" "+ SC +" "+ SU+" "+ SD +" "+ DU
								+ " "+ DD+" "+ TO + "<br/>" ;		
								
					console.log(res);
					$(".main").append(res);
				
				totalTime = parseInt(rowArray[timelenIndex]);
				comp = rowArray[compIndex];		
				condition = rowArray[interfaceIndex];
				trail = rowArray[trailIndex];
				block = rowArray[blockIndex];
				subject = rowArray[sbjIdIndex];
				fristDistance = rowArray[distanceIndex];
				distance = parseInt(rowArray[distanceIndex]);
				targetId = rowArray[targetIdIndex];
				err = 1;
				FC = 0;SC = 0;SU = 0;SD = 0;DU = 0;	DD = 0;TO = 0;
				//console.log(trail);
				
				
			}
				
			
			
			
		}
		
		
	}
	
	function calculateDistance(condition,trail,dis1,dis2){
		if(trail == 0) return 0;
		d2 = 0;
		d1 = 0;
		res = 0;
		if(condition == "icon" || condition == "alphabet" || condition == "num"){
			
			d2 = Math.abs(parseInt(dis2));
			d1 = Math.abs(parseInt(dis1));
			res =d2+ (d1*heightOfBlock);
			//console.log(d2+ ":" +d1+ ":" + (d1*heightOfBlock)+ ":" +res);
		}else if(condition == "OneLandmark"){
			d2 = Math.abs(parseInt(dis2));
			d1 = Math.abs(parseInt(dis1));
			res =d2+ (d1*heightOfBlock);
			//console.log(d2+ ":" +d1+ ":" + (d1*heightOfBlock)+ ":" +res);
		}else if(condition == "Standard"){
			d1 = Math.abs(parseInt(dis1));
			res = d1;
			//console.log(d1);
		}
		
		
		return res;
	}
	
	
	
});