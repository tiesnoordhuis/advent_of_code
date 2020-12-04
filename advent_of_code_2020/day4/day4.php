<?php

$input = file("input.txt", FILE_IGNORE_NEW_LINES);

$cleanedInput = [];

$index = 0;
foreach($input as $line) {
    if (strlen($line) === 0) {
        $index++;
        continue;
    }
    $parts = explode(" ", $line);
    if (empty($cleanedInput[$index])) {
        $cleanedInput[$index] = [];
    }
    $newArray = array_merge($cleanedInput[$index], $parts);
    $cleanedInput[$index] = $newArray;
}

$passports = [];
$index = 0;

foreach ($cleanedInput as $cleanInput) {
    foreach ($cleanInput as $keyValuePair) {
        $parts = explode(":", $keyValuePair);
        $passports[$index][$parts[0]] = $parts[1];
    }
    $index++;
}

$requirements = [
    "byr",
    "iyr",
    "eyr",
    "hgt",
    "hcl",
    "ecl",
    "pid"
];

$eyeColors = [
    "amb",
    "blu",
    "brn",
    "gry",
    "grn",
    "hzl",
    "oth"
];
$counter = 0;

foreach ($passports as $passport) {
    $valid = true;
    foreach ($requirements as $requirement) {
        if (!array_key_exists($requirement, $passport)) {
            $valid = false;
        }
    }
    var_dump($passport);
    var_dump($valid);
    foreach ($passport as $fieldKey => $fieldValue) {
        switch ($fieldKey) {
            case "byr":
                $fieldValue = intval($fieldValue);
                if ($fieldValue < 1920 or $fieldValue > 2002) {
                    var_dump($fieldKey);
                    var_dump($fieldValue);
                    $valid = false;
                }
                break;
            case "iyr":
                $fieldValue = intval($fieldValue);
                if ($fieldValue < 2010 or $fieldValue > 2020) {
                    var_dump($fieldKey);
                    var_dump($fieldValue);
                    $valid = false;
                }
                break;
            case "eyr":
                $fieldValue = intval($fieldValue);
                if ($fieldValue < 2020 or $fieldValue > 2030) {
                    var_dump($fieldKey);
                    var_dump($fieldValue);
                    $valid = false;
                }
                break;
            case "hgt":
                preg_match('/(\d+)(\D+)/', $fieldValue, $matches);
                $matches[0] = intval($matches[0]);
                var_dump($matches);
                switch ($matches[2]) {
                    case "in":
                        if ($matches[0] < 59 or $matches[0] > 76) {
                            var_dump($fieldKey);
                            var_dump($fieldValue);
                            $valid = false;
                        }
                        break;
                    case "cm":
                        if ($matches[0] < 150 or $matches[0] > 193) {
                            var_dump($fieldKey);
                            var_dump($fieldValue);
                            $valid = false;
                        }
                        break;
                    default:
                        var_dump($fieldKey);
                        var_dump($fieldValue);
                        $valid = false;
                }
                break;
            case "hcl":
                if (!preg_grep('/^#[0-9a-f]{6}$/',[$fieldValue])) {
                    var_dump($fieldKey);
                    var_dump($fieldValue);
                    $valid = false;
                }
                break;
            case "ecl":
                if (!in_array($fieldValue, $eyeColors)) {
                    var_dump($fieldKey);
                    var_dump($fieldValue);
                    $valid = false;
                }
                break;
            case "pid":
                if (!preg_grep('/^[0-9]{9}$/',[$fieldValue])) {
                    var_dump($fieldKey);
                    var_dump($fieldValue);
                    $valid = false;
                }
                break;
            default:
                break;
        }
    }
    if ($valid) {
        $counter++;
    }
}

echo $counter . PHP_EOL;