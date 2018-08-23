<?php
if(isset($_POST['subjectNumber'])){
	
var_dump($_POST);
	$conn = connectToDb();
		
	$sql = "INSERT INTO `loglist` (`logId`, `subjectNumber`, `interfaceNumber`, `documentNumber`, `target`, `visitNumber`
	, `trail`, `block`, `finishedByUser`, `dateTime`) VALUES (:logId, :subjectNumber, :interfaceNumber, :documentNumber, :target, :visitNumber,
	:trail, :block, :finishedByUser, :dateTime)";

	//Prepare our statement.
	$statement = $conn->prepare($sql);

	//Bind our values to our parameters 
	$statement->bindValue(':logId', Null);
	$statement->bindValue(':subjectNumber', $_POST['subjectNumber']);
	$statement->bindValue(':interfaceNumber', $_POST['interfaceNumber']);
	$statement->bindValue(':documentNumber', $_POST['documentNumber']);
	$statement->bindValue(':target', $_POST['target']);
	$statement->bindValue(':visitNumber', $_POST['visitNumber']);
	$statement->bindValue(':trail', $_POST['trail']);
	$statement->bindValue(':block', $_POST['block']);
	$statement->bindValue(':finishedByUser', $_POST['finishedByUser']);
	$statement->bindValue(':dateTime', $_POST['dateTime']);


	//Execute the statement and insert our values.
	$inserted = $statement->execute();


	//Because PDOStatement::execute returns a TRUE or FALSE value,
	//we can easily check to see if our insert was successful.
	if($inserted){
		$lastInsertId = $conn->lastInsertId();
		echo 'Row inserted: ' . $conn->lastInsertId(); ;
			$sql = "INSERT INTO `logdetails` (`LogId`, `firstScrollbarClick`, `secondScrollbarClick`, `numberOfDragUp1SC`, `numberOfDragDown1SC`,
			`numberOfDragUp2SC`	, `numberOfDragDown2SC`, `numberOfWheelUp`, `numberOfWheelDown`, `timeLength`) VALUES (:LogId, :firstScrollbarClick, 
			:secondScrollbarClick, :numberOfDragUp1SC, :numberOfDragDown1SC, :numberOfDragUp2SC,
			:numberOfDragDown2SC, :numberOfWheelUp, :numberOfWheelDown, :timeLength)";
			
			$statement = $conn->prepare($sql);

			//Bind our values to our parameters 
			$statement->bindValue(':LogId', $lastInsertId);
			$statement->bindValue(':firstScrollbarClick', $_POST['firstScrollbarClick']);
			$statement->bindValue(':secondScrollbarClick', $_POST['secondScrollbarClick']);
			$statement->bindValue(':numberOfDragUp1SC', $_POST['numberOfDragUp1SC']);
			$statement->bindValue(':numberOfDragDown1SC', $_POST['numberOfDragDown1SC']);
			$statement->bindValue(':numberOfDragUp2SC', $_POST['numberOfDragUp2SC']);
			$statement->bindValue(':numberOfDragDown2SC', $_POST['numberOfDragDown2SC']);
			$statement->bindValue(':numberOfWheelUp', $_POST['numberOfWheelUp']);
			$statement->bindValue(':numberOfWheelDown', $_POST['numberOfWheelDown']);
			$statement->bindValue(':timeLength', $_POST['timeLength']);
			$inserted = $statement->execute();

	}
	
	
	
	
}else{
	die("Restricted Access!!!");
}





function connectToDb(){
	try {
		$servername = "localhost";
		$username = "user";
		$password = "user";
		$conn = new PDO("mysql:host=$servername;dbname=experiment", $username, $password);
		// set the PDO error mode to exception
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		return $conn;
	} catch(PDOException $ex) {
		echo("Can't open the database.");
	}
}

?>