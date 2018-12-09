import numpy as np
import string

with open('../input5.txt', 'r') as f:
    file_lines = [event for event in f.read().splitlines()]
    line = file_lines[0]

#line = "dabAcCaCBAcCcaDA"

def can_reduce(char_left, char_right):
    if char_left.upper() == char_right.upper():
        if char_left != char_right:
            return True
    return False

def find_reduce_indexs(line_copy):
    reduce_indexs = []
    for index, char in enumerate(line_copy):
        if index == 0:
            continue
        if can_reduce(line_copy[index - 1], char):
            reduce_indexs.append(index)
    return reduce_indexs

def find_reduce_index(line_copy):
    for index, char in enumerate(line_copy):
        if index == 0:
            continue
        if can_reduce(line_copy[index - 1], char):
            return index - 1
    return -1

def reduce_line_at_index(old_line, index):
    if index < 0 or index > len(old_line):
        print(error)
        return old_line
    new_line = ""
    new_line_left = ""
    new_line_right = ""
    if index == 0:
        new_line_left = ""
    else:
        new_line_left = old_line[:index]
    if index == len(old_line):
        new_line_right = ""
    else:
        new_line_right = old_line[index + 2:]
    new_line = "".join((new_line_left, new_line_right))
    return new_line

def reduce_line_at_indexs(old_line, indexs):
    prev_index = 0
    for cycle, index in enumerate(indexs):
        if prev_index + 1 == index:
            continue
        old_line = reduce_line_at_index(old_line, index - 2 * cycle)
        prev_index = index
    return old_line

def can_reduce_line(check_line):
    if find_reduce_index(check_line) == -1:
        return False
    else:
        return True

continue_reduce = True

def remove_key_form_line(line, key):
    new_line = line.replace(key, "")
    return new_line

def remove_keys_form_line(line, key):
    new_line = remove_key_form_line(line, key)
    new_line = remove_key_form_line(new_line, key.upper())
    return new_line

check_lines = []

for char in string.ascii_lowercase:
    print(char)
    check_lines.append(remove_keys_form_line(line, char))

shortest_line = len(line)
shortest_char = ""

for char_index, line in enumerate(check_lines):
    print("checking line: ")
    print(string.ascii_lowercase[char_index])
    continue_reduce = True
    while continue_reduce:
        reduce_index = find_reduce_index(line)
        line = reduce_line_at_index(line, reduce_index)
        continue_reduce = can_reduce_line(line)
        if len(line) < shortest_line:
            shortest_line = len(line)
            shortest_char = string.ascii_lowercase[char_index]
            #print(shortest_line)


print(len(line))
print(type(line))
print(shortest_line)
print(shortest_char)
