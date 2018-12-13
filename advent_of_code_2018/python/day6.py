import numpy as np

with open('../input6.txt', 'r') as f:
    locations = [location.split(", ") for location in f.read().splitlines()]

max_xs = {"left": 100, "right": 100}
max_ys = {"top": 100, "bot": 100}
max_coords = {
    "x": max_xs,
    "y": max_ys,
    "left": [0, 0],
    "right": [0, 0],
    "top": [0, 0],
    "bot": [0, 0],
    "rest": [],
}

for index, location in enumerate(locations):
    locations[index] = [int(location[0]), int(location[1]), index]

for index, location in enumerate(locations):
    if location[0] < max_coords["x"]["left"]:
        max_coords["x"]["left"] = location[0]
        max_coords["left"] = location.copy()
    if location[0] > max_coords["x"]["right"]:
        max_coords["x"]["right"] = location[0]
        max_coords["right"] = location.copy()
    if location[1] < max_coords["y"]["top"]:
        max_coords["y"]["top"] = location[1]
        max_coords["top"] = location.copy()
    if location[1] > max_coords["y"]["bot"]:
        max_coords["y"]["bot"] = location[1]
        max_coords["bot"] = location.copy()

#for index, location in enumerate(locations):
print(max_coords)
def find_closest(point, locations):
    for location in locations:
        x_point = point["x"]
        y_point = point["y"]
        x_loc = location[0]
        y_loc = location[1]
        delta_x = abs(x_point - x_loc)
        delta_y = abs(y_point - y_loc)
        man_dist = delta_x + delta_y
        if man_dist < point["distance"]:
            point["distance"] = man_dist
            point["closest"] = location[2]
        elif man_dist == point["distance"]:
            point["closest"] = 10000
    return point

board = []

for delta_x, collum in enumerate(range(max_coords["x"]["right"] - max_coords["x"]["left"])):
    new_collum = []
    for delta_y, row in enumerate(range(max_coords["y"]["bot"] - max_coords["y"]["top"])):
        point = {
            "x": delta_x + max_coords["x"]["left"],
            "y": delta_y + max_coords["y"]["top"],
            "closest": 1000,
            "distance": 10000,
        }
        point = find_closest(point, locations)
        new_collum.append(point)
    board.append(new_collum)


total = [0] * len(locations)

for collum in board:
    for point in collum:
        if point["closest"] != 1000:
            total[point["closest"]] += 1

for index, item in enumerate(total):
    print(index, ":  ", item)
