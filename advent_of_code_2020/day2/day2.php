<?php

$input = file("input.txt", FILE_IGNORE_NEW_LINES);

$counter1 = 0;
$counter2 = 0;

foreach ($input as $item) {
    $parts = explode(" ", $item);
    $amounts = explode("-", $parts[0]);
    $min = intval($amounts[0]);
    $max = intval($amounts[1]);
    $letter = substr($parts[1], 0, 1);
    $password = $parts[2];
    echo PHP_EOL . "Met gegeven item '$item'" . PHP_EOL;
    echo "Letter $letter moet tussen de $min en $max keer voorkomen in $password" . PHP_EOL;
    if (passwordIsRight1($password, $letter, $min, $max)) {
        $counter1++;
    }
    $pos1 = $min;
    $pos2 = $max;
    echo "Letter $letter moet voorkomen op positie $pos1 of $pos2 in $password" . PHP_EOL;
    if (passwordIsRight2($password, $letter, $pos1, $pos2)) {
        $counter2 ++;
    }
}

echo PHP_EOL . "1. Er zijn $counter1 goede wachtwoorden" . PHP_EOL;
echo PHP_EOL . "2. Er zijn $counter2 goede wachtwoorden" . PHP_EOL;

function passwordIsRight1($password, $letter, $min, $max) {
    $passArray = str_split($password);
    $passCollection = array_count_values($passArray);
    if (!isset($passCollection[$letter])) {
        return false;
    }
    if ($passCollection[$letter] >= $min and $passCollection[$letter] <= $max) {
        return true;
    }
    return false;
}

function passwordIsRight2($password, $letter, $pos1, $pos2) {
    $passArray = str_split($password);
    if ($passArray[$pos1 - 1] == $letter xor $passArray[$pos2 - 1] == $letter) {
        return true;
    }
    return false;
}