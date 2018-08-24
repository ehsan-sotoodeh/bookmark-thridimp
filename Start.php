<html>
<head>
	<script src="scripts/jquery-3.2.1.js"></script>
</head>
<body>
<center>
<img src="ScreenShots/guide/part1.png" /><br/>
<img src="ScreenShots/guide/part2.png" />
<br/>
<br/>
<br/>
<br/>
</center>
<div style="width:400px; height:300px;margin:0px auto !important;" >
	<p><b> Counter Balance </b></p>
	<input  align="right"  type="text" id="subjectId" value="testUSer"> 
	<br/>
	<br/>
	<br/>
	<select name="type" id="interface" >
		<option name="phase 1" value="1">Plain</option>
		<option name="phase 2" value="2">Random</option>
		<option name="phase 3" value="3">User-Selected</option> 
		<option name="phase 3" value="4">Automatic label</option> 
		<option name="phase 3" value="5">User label</option> 
	</select> &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp
	<br/><br/><br/>
	<select name="type" id="phase" >
		<option name="phase 1" value="1">Phase 1</option>
		<option name="phase 2" value="2">Phase 2</option>
		<option name="phase 3" value="3">Phase 3</option> 
	</select> &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp
	<input type="checkbox" id="SampleRound" value="SampleRound" > Practice Round<br>
	<br/>
	<br/>
	<button style="   height: 30px; width: 80px;" id="next" > Next </button>
</div>	

	<br/>
	<br/>	<br/>
	<br/>	<br/>
	<br/>	<br/>
	<br/>
<script>
$(document).ready(function(){
	$("#next").click(function(){
		phase = $("#phase").val();
		interface = $("#interface").val();
		subjectId = $("#subjectId").val();
		subjectId = subjectId.trim();
		if(subjectId.length < 1){
			alert("Subject Id");
			return;
		}
		SampleRound = false;
		if($('#SampleRound').is(':checked')) {
			SampleRound = true;
		}
		
		
 		switch(interface){
			case "1":
				window.location.replace("http://127.0.0.1/bookmark-thridimp/standard1.html?phase="+phase+"&interface=plain&SampleRound="+SampleRound+"&subjectId="+subjectId);
			break;
			case "2":
				window.location.replace("http://127.0.0.1/bookmark-thridimp/standard2.html?phase="+phase+"&interface=randomIcon&SampleRound="+SampleRound+"&subjectId="+subjectId);
			
			break;
			case "3":
				window.location.replace("http://127.0.0.1/bookmark-thridimp/standard5.html?phase="+phase+"&interface=userselectedIcon&SampleRound="+SampleRound+"&subjectId="+subjectId);
			
			break;
			case "4":
				window.location.replace("http://127.0.0.1/bookmark-thridimp/standard4.html?phase="+phase+"&interface=autolabel&SampleRound="+SampleRound+"&subjectId="+subjectId);
			
			break;
			case "5":
				window.location.replace("http://127.0.0.1/bookmark-thridimp/standard5.html?phase="+phase+"&interface=userlabel&SampleRound="+SampleRound+"&subjectId="+subjectId);
			
			break;



		} 
	});
});


</script>
</body>
</html>