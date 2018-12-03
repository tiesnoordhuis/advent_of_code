with open('../input21.txt', 'r') as f:
    input_list = [string for string in f.read().splitlines()]

def parse_patern

list_size_2 = []
list_size_3 = []

for patern in input_list:
    if len(patern) == 20:
        list_size_2.append(patern)
    elif len(patern) == 34:
        list_size_3.append(patern)

print(list_size_2)
print(list_size_3)
