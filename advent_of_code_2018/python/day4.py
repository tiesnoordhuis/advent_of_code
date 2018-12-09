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

grouped_events = []
grouped_event = {}
prev_event = {}
first = True

for parsed_event in parsed_events:
    if parsed_event["event_data"][0] == "G":
        if first == False:
            grouped_event["end"] = prev_event["date"]
            grouped_events.append(grouped_event)
        grouped_event = {}
        grouped_event["start"] = parsed_event["date"]
        grouped_event["ID"] = parsed_event["event_data"].split()[1][1:]
        grouped_event["asleep"] = []
        grouped_event["awake"] = []
    if parsed_event["event_data"][0] == "f":
        grouped_event["asleep"].append(parsed_event["date"])
    if parsed_event["event_data"][0] == "w":
        grouped_event["awake"].append(parsed_event["date"])
    prev_event = parsed_event
    first = False

parsed_grouped_event = {}
parsed_grouped_events = []
guard_awake = True
for grouped_event in grouped_events:
    parsed_grouped_event["ID"] = grouped_event["ID"]
    if np.datetime64(grouped_event["start"], "D") == np.datetime64(grouped_event["start"] + np.timedelta64(1, "h"), "D"):
        parsed_grouped_event["day"] = np.datetime64(grouped_event["start"], "D")
    else:
        parsed_grouped_event["day"] = np.datetime64(grouped_event["start"] + np.timedelta64(1, "h"), "D")
    parsed_grouped_event["delta_awake"] = [0]
    for wake_date in grouped_event["awake"]:
        delta = parsed_grouped_event["day"] - wake_date
        delta = delta / np.timedelta64(1, 'm')
        delta = int(0 - delta)
        parsed_grouped_event["delta_awake"].append(delta)
    parsed_grouped_event["delta_asleep"] = []
    for wake_date in grouped_event["asleep"]:
        delta = parsed_grouped_event["day"] - wake_date
        delta = delta / np.timedelta64(1, 'm')
        delta = int(0 - delta)
        parsed_grouped_event["delta_asleep"].append(delta)
    parsed_grouped_events.append(parsed_grouped_event.copy())

complete_event = {}
complete_events = []

for parsed_grouped_event in parsed_grouped_events:
    complete_event["ID"] = parsed_grouped_event["ID"]
    complete_event["day"] = parsed_grouped_event["day"]
    complete_event["schedule"] = []
    for minute in range(60):
        if guard_awake:
            if minute in parsed_grouped_event["delta_asleep"]:
                guard_awake = False
        if guard_awake == False:
            if minute in parsed_grouped_event["delta_awake"]:
                guard_awake = True
        complete_event["schedule"].append((minute, guard_awake))
    complete_event["awake_time"] = 0
    for active_minute in complete_event["schedule"]:
        if active_minute[1]:
            complete_event["awake_time"] += 1
    complete_event["sleep_time"] = 60 - complete_event["awake_time"]
    complete_events.append(complete_event.copy())

sleep_times_with_ID_doubles = [event["ID"] for event in complete_events]
sleep_times_with_ID = set(sleep_times_with_ID_doubles)

guard_times = []

for ID in sleep_times_with_ID:
    guard_events = {"ID": ID, "schedules": [], "highest_score": 0, "most_sleep_min": 0}
    for index, event in enumerate(complete_events):
        if event["ID"] == ID:
            if len(guard_events["schedules"]) < 1:
                guard_events["schedules"] = [0] * 60
                for minute, sleep_time in enumerate(event["schedule"]):
                    if not event["schedule"][minute][1]:
                        guard_events["schedules"][minute] = 1
            else:
                for minute, sleep_time in enumerate(event["schedule"]):
                    if not event["schedule"][minute][1]:
                        guard_events["schedules"][minute] += 1
    guard_times.append(guard_events.copy())

for guard_events in guard_times:
    for index, minute in enumerate(guard_events["schedules"]):
        if minute > guard_events["highest_score"]:
            guard_events["highest_score"] = minute
            guard_events["most_sleep_min"] = index
    print(guard_events["highest_score"], guard_events["most_sleep_min"] * int(guard_events["ID"]))


minutes_sleeping = [0] * 60
highest_min = 0

for event in longest_sleeper:
    for event_minute in event["schedule"]:
        if not event_minute[1]:
            minutes_sleeping[event_minute[0]] += 1

index_highest = 0

for index, min_asleep in enumerate(minutes_sleeping):
    if min_asleep > highest_min:
        highest_min = min_asleep
        index_highest = index
