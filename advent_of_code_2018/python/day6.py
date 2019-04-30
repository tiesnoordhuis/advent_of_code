import numpy as np
import os

class Cell:
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.valid = True
        self.distances = 0

    def addDistance(self, location):
        self.distances += calcDistance({"x": self.x, "y": self.y}, location)
        if self.distances > 10000:
            self.valid = False

filePath = os.path.dirname(__file__)
relativePath = "../input6.txt"
txtFilePath = os.path.join(filePath, relativePath)

with open(txtFilePath, 'r') as f:
    locations = [location.split(", ") for location in f.read().splitlines()]

max_coords = {
    "x_min": 0,
    "x_max": 100,
    "y_min": 0,
    "y_max": 100,
}

for index, location in enumerate(locations):
    locations[index] = [int(location[0]), int(location[1])]
    if locations[index][0] > max_coords["x_max"]:
        max_coords["x_max"] = locations[index][0]
    if locations[index][0] < max_coords["x_min"]:
        max_coords["x_min"] = locations[index][0]
    if locations[index][1] > max_coords["y_max"]:
        max_coords["y_max"] = locations[index][1]
    if locations[index][1] < max_coords["y_min"]:
        max_coords["y_min"] = locations[index][1]

print(max_coords)

grid = [[]]

for x in range(max_coords["x_min"], max_coords["x_max"]):
    grid.append([])
    for y in range(max_coords["y_min"], max_coords["y_max"]):
        grid[x].append(Cell(x, y))


print(grid[4][4])

def calcDistance(point1, point2):
    x = abs(point1[0] - point2[0])
    y = abs(point1[1] - point2[1])
    return x + y
