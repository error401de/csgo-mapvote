# csgo-mapvotes

## websocket message interface

The sent messages contain a json string (apart from ping/pong messages).
The structure of the messages is
```json
	[
		"type_of_message",
		{ "some": "data" }
	]
```

Where the first entry of the array is the type of message being sent and the second entry contains the payload.

The types of messages a user can send to the server and their payloads are:

### voted
```json
	"maps": ["de_dust2"]
```
Which maps does one want to play?

### vetoed
```json
	"maps": ["de_dust2"]
```
Which maps does one not want to play?

### show_result
No payload required.
Only the admin (the first participant) can send this. A message containing all votes will be broadcasted to everyone.

### reset
No payload required.
Only the admin (the first participant) can send this. All votes will be reset.


The types of messages the server will send to the participants and their payloads are:

### reset
No payload. The client should update the view do enable voting again.

### participants
```json
{
	"items": [
		{
			"name": 1,
			"voted": true,
			"vetoed": false
		}
	]
}
```

This message is broadcasted to everyone, every time someone joins or leaves or submits a vote or a veto.

### result
```json
{
	"items": [
		{
			"name": 1,
			"votes": ["de_dust2"],
			"vetos": ["de_anubis"]
		}
	]
}
```

This message is broadcastet after the admin sent the `show_result" message.
