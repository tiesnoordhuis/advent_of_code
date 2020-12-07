<?php

$input = file("input.txt", FILE_IGNORE_NEW_LINES);

$groups = [];
$index = 0;
foreach($input as $line) {
    if (strlen($line) === 0) {
        $index++;
        continue;
    }
    $parts = str_split($line);
    if (empty($groups[$index])) {
        $groups[$index] = [];
    }
    $groups[$index] = array_merge($groups[$index], $parts);
}
$groupsUnique = [];
foreach ($groups as $group) {
    $groupsUnique[] = array_unique($group);
}
$sum = 0;
foreach ($groupsUnique as $groupUnique) {
    $sum += count($groupUnique);
}

echo "total anyone: $sum" . PHP_EOL;

$groups = [];
$index = 0;
foreach ($input as $line) {
    if (strlen($line) === 0) {
        $index++;
        continue;
    }
    $parts = str_split($line);
    if (!isset($groups[$index])) {
        $groups[$index] = [];
        $newParts = $parts;
    } else {
        $newParts = [];
        foreach ($parts as $part) {
            if (in_array($part, $groups[$index])) {
                $newParts[] = $part;
            }
        }
        $oldParts = [];
        foreach ($groups[$index] as $oldPart) {
            if (in_array($oldPart, $newParts)) {
                $oldParts[] = $oldPart;
            }
        }
        $groups[$index] = $oldParts;
    }
    $groups[$index] = array_merge($groups[$index], $newParts);
}

$groupsUnique = [];
foreach ($groups as $group) {
    $groupsUnique[] = array_unique($group);
}
$sum = 0;
foreach ($groupsUnique as $groupUnique) {
    $sum += count($groupUnique);
}

echo "total everyone: $sum" . PHP_EOL;