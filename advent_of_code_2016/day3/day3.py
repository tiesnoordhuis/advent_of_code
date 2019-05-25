import sys

file_location = 'day3.txt'

if sys.gettrace() != None:
    file_location = "advent_of_code_2016/day3/" + file_location

triangles_raw = []

with open(file_location, 'r') as f:
    input_list = [instruction for instruction in f.read().split('\n')]

for triangle in input_list:
    triangles_raw.append(triangle.split())

triangles_raw_2 = []

for index, row in enumerate(triangles_raw):
    if index % 3 == 0 and index < 1913:
        row2 = triangles_raw[index + 1]
        row3 = triangles_raw[index + 2]
        triangles_raw_2.append([row[0], row2[0], row3[0]])
        triangles_raw_2.append([row[1], row2[1], row3[1]])
        triangles_raw_2.append([row[2], row2[2], row3[2]])

class Triangle():
    def __init__(self, lengths):
        self.sides = [int(lengths[0]), int(lengths[1]), int(lengths[2])]
        self.compare_matrix = [[0, 1, 2], [1, 2, 0], [2, 0, 1]]
        self.valid = self.is_valid()
    
    def is_valid(self):
        valid = True
        for matrix in self.compare_matrix:
            if self.sides[matrix[0]] + self.sides[matrix[1]] <= self.sides[matrix[2]]:
                valid = False
        return valid

valids = 0
triangles = []

for lengths in triangles_raw_2:
    triangles.append(Triangle(lengths))

for triangle in triangles:
    if triangle.valid:
        valids +=1

print(valids)
