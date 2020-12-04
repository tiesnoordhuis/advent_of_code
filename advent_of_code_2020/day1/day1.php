<?php
$time = round(microtime(true) * 1000);

$input = file("input.txt", FILE_IGNORE_NEW_LINES);

sort($input, SORT_NUMERIC);

function puzzle($list, $answer, $recursion, &$found,$picks = [])
{
    if ($found) {
        return;
    }
    if ($recursion >= 1) {
        foreach ($list as $num) {
            $newPicks = $picks;
            $newPicks[] = (int)$num;
            puzzle($list, $answer, ($recursion - 1), $found, $newPicks);
        }
    } else {
        if (array_sum($picks) == $answer) {
            echo "Found: " . array_product($picks) . PHP_EOL;
            $found = true;
        }
    }
}

$found = false;
puzzle($input, 2020, 3, $found);

$newTime = round(microtime(true) * 1000);
echo "Tijd: " . ($newTime - $time) . PHP_EOL;