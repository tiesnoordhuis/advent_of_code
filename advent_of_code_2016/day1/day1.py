import sys

file_location = 'day1.txt'

if sys.gettrace() != None:
    file_location = "advent_of_code_2016/day1/" + file_location

with open(file_location, 'r') as f:
    input_list = [(instruction[0], instruction[1:]) for instruction in f.read().split(", ")]

class Direction():
    def __init__(self):
        self.compas = ["N", "E", "S", "W"]
        self.direction = 0
        self.turns = {"R": self.__turn_right, "L": self.__turn_left}
    
    def turn(self, turn):
        self.turns[turn]()

    def __turn_right(self):
        if self.direction == 3:
            self.direction = 0
        else:
            self.direction += 1

    def __turn_left(self):
        if self.direction == 0:
            self.direction = 3
        else:
            self.direction -= 1
    
    def my_direction(self):
        return self.compas[self.direction]

class Santa():
    def __init__(self):
        self.direction = Direction()
        self.distance = [0, 0]
        self.visited = []
        self.not_found = True

    def turn(self, turn):
        self.direction.turn(turn)
    
    def move(self, move_distance):
        for i in range(move_distance):
            if self.direction.direction == 0:
                self.distance[1] += 1
            elif self.direction.direction == 1:
                self.distance[0] += 1
            elif self.direction.direction == 2:
                self.distance[1] -= 1
            elif self.direction.direction == 3:
                self.distance[0] -= 1
            self.add_location()
            self.check_found()
    
    def add_location(self):
        self.visited.append(self.distance.copy())

    def check_found(self):
        if self.distance in self.visited[:-1]:
            self.not_found = False

santa = Santa()



for instruction in input_list:
    santa.turn(instruction[0])
    santa.move(int(instruction[1]))
print(len(santa.visited))
duplicate_distances = [x for x in santa.visited if santa.visited.count(x) > 1]

print(duplicate_distances)

print(abs(santa.distance[0]) + abs(santa.distance[1]))



