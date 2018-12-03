with open('../input3.txt', 'r') as f:
    input_list = [string for string in f.read().splitlines()]

parsed_list = []
fabric = []
max_x = 1000
max_y = 1000
multiple_claims = 0

for string in input_list:
    split_string = string.split()
    raw_position = split_string[2].split(",")
    position = {"x": int(raw_position[0]), "y": int(raw_position[1][:-1])}
    raw_area = split_string[3].split("x")
    area = {"width": int(raw_area[0]), "height": int(raw_area[1])}
    claim = {"ID": int(split_string[0][1:]), "start_position": position, "area": area}
    parsed_list.append(claim)
    if max_x < (claim["start_position"]["x"] + claim["area"]["width"]):
        max_x = (claim["start_position"]["x"] + claim["area"]["width"])
    if max_y < (claim["start_position"]["y"] + claim["area"]["height"]):
        max_y = (claim["start_position"]["y"] + claim["area"]["height"])

for value in range(max_y):
    fabric.append(list([0 for value in range(max_x)]))

for claim in parsed_list:
    for x in range(claim["area"]["width"]):
        for y in range(claim["area"]["height"]):
            fabric[(x + claim["start_position"]["x"])][(y + claim["start_position"]["y"])] += 1

for claim in parsed_list:
    claim_not_overlap = True
    for x in range(claim["area"]["width"]):
        for y in range(claim["area"]["height"]):
            if fabric[(x + claim["start_position"]["x"])][(y + claim["start_position"]["y"])] > 1:
                claim_not_overlap = False
    if claim_not_overlap:
        print(claim["ID"])

for row in fabric:
    for value in row:
        if value > 1:
            multiple_claims += 1

print(multiple_claims)
