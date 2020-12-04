<?php

$input = file("input.txt", FILE_IGNORE_NEW_LINES);

$grid = [[]];

$grid_width = strlen($input[0]);
var_dump($grid_width);

foreach ($input as $row => $item) {
    $trees = str_split($item);
    foreach ($trees as $column => $tree) {
        if ($tree === '#') {
            $grid[$row][$column] = true;
        } else {
            $grid[$row][$column] = false;
        }
    }
}

$directions = [
    [1, 1],
    [1, 3],
    [1, 5],
    [1, 7],
    [2, 1]
];

$ans = [];

foreach($directions as $direction) {

    $column = 0;
    $counter = 0;
    for ($row = 0; $row < count($grid); $row += $direction[0]) {

        if ($grid[$row][$column]) {
            $counter++;
        }

        $column += $direction[1];
        if ($column >= $grid_width) {
            $column -= $grid_width;
        }
    }

    echo "counter: $counter" . PHP_EOL;
    $ans[] = $counter;
}

echo "final: " . array_product($ans) . PHP_EOL;