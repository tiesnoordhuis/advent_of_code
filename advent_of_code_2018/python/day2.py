with open('../input2.txt', 'r') as f:
    input_list = [string for string in f.read().split()]

set_list = []

for string in input_list:
    selection = set(string)
    set_list.append(selection)

def full_test_selection(try_string, test_string):
    diff_count = 0
    for try_index, try_char in enumerate(try_string):
        if try_char != test_string[try_index]:
            diff_count += 1
    if diff_count == 1:
        return True
    else:
        return False

for try_index, try_selection in enumerate(set_list):
    for test_index, test_selection in enumerate(set_list):
        if abs(len(try_selection - test_selection)) == 1:
            if full_test_selection(input_list[try_index], input_list[test_index]):
                print(input_list[try_index], " en ", input_list[test_index])
                print(try_selection, " en ", test_selection)
                print(try_selection.intersection(test_selection))
