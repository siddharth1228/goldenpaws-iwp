<?php 
use PHPMailer\PHPMailer\PHPMailer; 
use PHPMailer\PHPMailer\Exception; 
  
require 'vendor/autoload.php'; 

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "v1";
$params = explode(",", $argv[1]);
$val=$params[1];
// Create connection
$conn = mysqli_connect($servername, $username, $password, $dbname);
// Check connection
if (!$conn) {
  die("Connection failed: " . mysqli_connect_error());
}
$query1="SELECT * from mails where email='$val'";

$result = $conn->query($query1);
if ($result->num_rows > 0) {
    echo "<b>Mail to this account has already been sent</b><br>";

}



/*
    $to = "siddharthdahiya12@gmail.com"; // this is your Email address
    $from = $params[3]; // this is the sender's Email address
    $first_name = $params[1];
    $last_name = $params[2];
    $subject = "Form submission";
    $subject2 = "Copy of your form submission";
    $message = $first_name . " " . $last_name . " wrote the following:" . "\n\n" . $params[4];
    $message2 = "Here is a copy of your message " . $first_name . "\n\n" . $params[4];

    $headers = "From:" . $from;
    $headers2 = "From:" . $to;
    mail($to,$subject,$message,$headers);
    mail($from,$subject2,$message2,$headers2); // sends a copy of the message to the sender
    
    echo "Mail Sent. Thank you  we will contact you shortly.";
    // You can also use header('Location: thank_you.php'); to redirect to another page.
    
*/
else{
    $query2="INSERT into mails(email)values('$val')";
    mysqli_query($conn,$query2);
    //
    $mail = new PHPMailer(true); 
  
    
        $mail->SMTPDebug = 2;                                        
        $mail->isSMTP();                                             
        $mail->Host       = 'smtp.gmail.com;';                     
        $mail->SMTPAuth   = true;                              
        $mail->Username   = 'isaa.project.vit1@gmail.com';                  
        $mail->Password   = 'ISAAproject123';                         
        $mail->SMTPSecure = 'tls';                               
        $mail->Port       = 587;   
      
        $mail->setFrom('siddharthdahiya12@gmail.com', 'Team GoldenPaws');            
        $mail->addAddress($params[1]); 
    
           
        $mail->isHTML(true);                                   
        $mail->Subject = 'GoldenPaws'; 
        $mail->Body    = 'GoldenPaws is an online application that can be used to purchase or sell dogs. The system
        accepts any valid user to register and allows him/her to sell or purchase a dog. Furthermore, they
        can even rate or comment on the breed of other dogs. This aids in the decision-making process of
        non frequent customers. Github:-https://github.com/siddharth1228/goldenpaws-iwp'; 
        $mail->AltBody = 'Body in plain text for non-HTML mail '; 
        $mail->send();
    
        echo "Mail has been sent successfully!"; 
        
        exit;
     
      
}
    //
?>
