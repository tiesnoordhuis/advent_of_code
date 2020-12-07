<?php

$input = file("input.txt", FILE_IGNORE_NEW_LINES);

$boardingIds = [];

foreach ($input as $line) {
    $chars = str_split($line);
    $binrow = "";
    $bincol = "";
    foreach ($chars as $index => $char) {
        if ($index < 7) {
            $binrow .= $char === "F" ? 0 : 1;
        } else {
            $bincol .= $char === "L" ? 0 : 1;
        }
    }
    $row = bindec($binrow);
    $col = bindec($bincol);
    $boardingId = ($row * 8 + $col);
    echo "Boarding ID: $boardingId" . PHP_EOL;
    $boardingIds[] = $boardingId;
}

echo "hoogste: " . max($boardingIds) . PHP_EOL;

sort($boardingIds);
foreach ($boardingIds as $index => $boardingId) {
    if ($index == 0) {
        continue;
    }
    $diff = $boardingId - $boardingIds[$index - 1];
    if ($diff != 1) {
        echo $boardingIds[$index - 1] . PHP_EOL;
        echo $boardingId . PHP_EOL;
        echo "missing: " . ($boardingIds[$index - 1] + 1) . PHP_EOL;
    }
}