import sys

file_location = 'day2.txt'

if sys.gettrace() != None:
    file_location = "advent_of_code_2016/day2/" + file_location

with open(file_location, 'r') as f:
    input_list = [instruction for instruction in f.read().split()]

code = []

class Keypad():
    def __init__(self, layout):
        self.layout = layout
        self.moves = {"U": self.up, "D": self.down, "L": self.left, "R": self.right}
        self.position = [2, 0]
        self.sizes = self.calc_sizes()
        self.codes_layout = [[0, 0, 1], [0, 2, 3, 4], [
            5, 6, 7, 8, 9], [0, "A", "B", "C"], [0, 0, "D"]]

    def calc_sizes(self):
        return [[2, 2], [1, 3], [0, 4], [1, 3], [2, 2]]

    def move(self, direction):
        self.moves[direction]()
        return self.check_move()

    def check_move(self):
        if abs(self.position[0] - 2) + abs(self.position[1] - 2) > 2:
            return True
        return False
            
    def up(self):
        if self.position[0] > self.sizes[self.position[1]][0]:
            self.position[0] -= 1

    def down(self):
        if self.position[0] < self.sizes[self.position[1]][1]:
            self.position[0] += 1

    def left(self):
        if self.position[1] > self.sizes[self.position[0]][0]:
            self.position[1] -= 1

    def right(self):
        if self.position[1] < self.sizes[self.position[0]][1]:
            self.position[1] += 1

    def pick_code(self):
        return self.codes_layout[self.position[0]][self.position[1]]

layout = [[1], [2, 3, 4], [5, 6, 7, 8, 9], ["A", "B", "C"], ["D"]]

keypad = Keypad(layout)

for instruction_set in input_list:
    for instruction in instruction_set:
        if keypad.move(instruction):
            print(keypad.position)
    code.append(keypad.pick_code())

print(code)

