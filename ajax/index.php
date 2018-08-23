<?php
if(isset($_POST['subjectId'])){
	
//var_dump($_POST);
	$conn = connectToDb();
		
	$sql = "INSERT INTO loggertable ( subjectNumber, log) VALUES (:subjectNumber,:log)";

	//Prepare our statement.
	$statement = $conn->prepare($sql);
	
	//Bind our values to our parameters 
	$statement->bindValue(':subjectNumber', $_POST['subjectId']);
	$statement->bindValue(':log', $_POST['log']);


	//Execute the statement and insert our values.
	$inserted = $statement->execute();
	echo "Saved On Server";


	
	
	
	
}else{
	die("Restricted Access!!!");
}





function connectToDb(){
	try {
		$servername = "localhost";
		$username = "root";
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