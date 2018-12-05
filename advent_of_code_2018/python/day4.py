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
    print(complete_event)

list_IDs = []
sleep_times = {}

for event in complete_events:
    if event["ID"] in list_IDs:
        sleep_times[event["ID"]] += event["sleep_time"]
    else:
        sleep_times[event["ID"]] = event["sleep_time"]
        list_IDs.append(event["ID"])

print(sleep_times)

longest_sleep_time = 0
longest_sleep_ID = ""

for item_key in sleep_times:
    if sleep_times[item_key] > longest_sleep_time:
        longest_sleep_time = sleep_times[item_key]
        longest_sleep_ID = item_key

print(longest_sleep_ID)

longest_sleeper = []

for event in complete_events:
    if longest_sleep_ID == event["ID"]:
        longest_sleeper.append(event)
        print(event)
