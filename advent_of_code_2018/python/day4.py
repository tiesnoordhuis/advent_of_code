import numpy as np

with open('../input4.txt', 'r') as f:
    events = [event for event in f.read().splitlines()]

parsed_events_unsorted = []
sorting_events = []

for index, event in enumerate(events):
    date = np.datetime64(event.split("]")[0][1:])
    event_data = event.split("] ")[1]
    sorting_event = (date, index)
    sorting_events.append(sorting_event)
    parsed_event = {}
    parsed_event["date"] = date
    parsed_event["event_data"] = event_data
    parsed_events_unsorted.append(parsed_event)

sorting_events = sorted(sorting_events, key=lambda x: x[0])

parsed_events = [i for i in range(len(events))]

for index, sorting_event in enumerate(sorting_events):
    parsed_events[index] = parsed_events_unsorted[sorting_event[1]]
    print(parsed_events[index])

print(parsed_events)

grouped_events = []
grouped_event = {}

for parsed_event in parsed_events:
    if parsed_event["event_data"][0] == "G":
        grouped_event["start"]
