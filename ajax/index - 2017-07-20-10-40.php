<?php
if(isset($_POST['subjectNumber'])){
	
//var_dump($_POST);
	$conn = connectToDb();
		
	$sql = "INSERT INTO logTbl ( id, logId, subjectNumber, interfaceNumber, documentNumber, block, trail, targetsArraySet, onLandmark
	, firstScrollbarClick, secondScrollbarClick, numberOfDragUp1SC, numberOfDragDown1SC, numberOfDragUp2SC, numberOfDragDown2SC,
	numberOfWheelUp, numberOfWheelDown,firstScDragLength, completed, LM1SelectedCorrect, LM2SelectedCorrect, firstDistance, secondDistance, dateTime, timeLength)

	VALUES (:id,:logId, :subjectNumber, :interfaceNumber, :documentNumber, :block, :trail,:targetsArraySet,:onLandmark
	,:firstScrollbarClick,:secondScrollbarClick,:numberOfDragUp1SC,:numberOfDragDown1SC,:numberOfDragUp2SC,:numberOfDragDown2SC
	,:numberOfWheelUp,:numberOfWheelDown,:firstScDragLength,:completed, :LM1SelectedCorrect, :LM2SelectedCorrect, :firstDistance,:secondDistance, :dateTime, :timeLength)";

	//Prepare our statement.
	$statement = $conn->prepare($sql);
	if($_POST['onLandmark']) $_POST['onLandmark'] =1; else $_POST['onLandmark'] = 0;
	if($_POST['completed']) $_POST['completed'] =1; else $_POST['completed'] = 0;
	if($_POST['LM1SelectedCorrect']) $_POST['LM1SelectedCorrect'] =1; else $_POST['LM1SelectedCorrect'] = 0;
	if($_POST['LM2SelectedCorrect']) $_POST['LM2SelectedCorrect'] =1; else $_POST['LM2SelectedCorrect'] = 0;
	
	//Bind our values to our parameters 
	$statement->bindValue(':id', Null);
	$statement->bindValue(':logId', $_POST['logId']);
	$statement->bindValue(':subjectNumber', $_POST['subjectNumber']);
	$statement->bindValue(':interfaceNumber', $_POST['interfaceNumber']);
	$statement->bindValue(':documentNumber', $_POST['documentNumber']);
	$statement->bindValue(':block', $_POST['block']);
	$statement->bindValue(':trail', $_POST['trail']);
	$statement->bindValue(':targetsArraySet', $_POST['targetsArraySet']);
	$statement->bindValue(':onLandmark', $_POST['onLandmark']);
	$statement->bindValue(':firstScrollbarClick', $_POST['firstScrollbarClick']);
	$statement->bindValue(':secondScrollbarClick', $_POST['secondScrollbarClick']);
	$statement->bindValue(':numberOfDragUp1SC', $_POST['numberOfDragUp1SC']);
	$statement->bindValue(':numberOfDragDown1SC', $_POST['numberOfDragDown1SC']);
	$statement->bindValue(':numberOfDragUp2SC', $_POST['numberOfDragUp2SC']);
	$statement->bindValue(':numberOfDragDown2SC', $_POST['numberOfDragDown2SC']);
	$statement->bindValue(':numberOfWheelUp', $_POST['numberOfWheelUp']);
	$statement->bindValue(':numberOfWheelDown', $_POST['numberOfWheelDown']);
	$statement->bindValue(':firstScDragLength', $_POST['totalScrollMovement']);
	$statement->bindValue(':completed', $_POST['completed']);
	$statement->bindValue(':LM1SelectedCorrect', $_POST['LM1SelectedCorrect']);
	$statement->bindValue(':LM2SelectedCorrect', $_POST['LM2SelectedCorrect']);
	$statement->bindValue(':firstDistance', $_POST['firstDistance']);
	$statement->bindValue(':secondDistance', $_POST['secondDistance']);
	$statement->bindValue(':dateTime', $_POST['dateTime']);
	$statement->bindValue(':timeLength', $_POST['timeLength']);



	//Execute the statement and insert our values.
	$inserted = $statement->execute();



	
	
	
	
}else{
	die("Restricted Access!!!");
}





function connectToDb(){
	try {
		$servername = "localhost";
		$username = "auser";
		$password = "";
		$conn = new PDO("mysql:host=$servername;dbname=experiment", $username, $password);
		// set the PDO error mode to exception
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		return $conn;
	} catch(PDOException $ex) {
		echo("Can't open the database.");
	}
}

?>