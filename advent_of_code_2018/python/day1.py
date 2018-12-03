with open('../input1.txt', 'r') as f:
    input_list = [int(number) for number in f.read().split()]

print(input_list)
frequency = 0
seen_values = []
not_found = True

while not_found:
    for value in input_list:
        frequency += value
        if frequency in seen_values:
            not_found = False
            print(frequency)
            break
        else:
            seen_values.append(frequency)
            #print(len(seen_values), "  ", frequency, "  ", seen_values.count(frequency))
