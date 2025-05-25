import {useEffect, useState} from "react";
import NewMeetingForm from "./NewMeetingForm";
import MeetingsList from "./MeetingsList";

export default function MeetingsPage({username}) {
    const [meetings, setMeetings] = useState([]);
    const [addingNewMeeting, setAddingNewMeeting] = useState(false);

    async function handleNewMeeting(meeting) {
        const response = await fetch(`/api/meetings`, {
            method: 'POST',
            body: JSON.stringify(meeting),
            headers: {'Content-Type': 'application/json'}
        });
        if (response.ok) {
            const newMeeting = await response.json();
            const nextMeetings = [...meetings, newMeeting];
            setMeetings(nextMeetings);
            setAddingNewMeeting(false);
        }

    }

    async function handleDeleteMeeting(meeting) {
        if (meeting.participants.length === 0){
            const response = await fetch(`/api/meetings/${meeting.id}`, {
                method: 'DELETE',
                body: JSON.stringify(meeting),
                headers: {'Content-Type': 'application/json'}
            });
            if (response.ok) {
                const nextMeetings = meetings.filter(m => m !== meeting);
                setMeetings(nextMeetings);
            }
        } else {

        }
    }


async function handleAddParticipant(meeting) {
    const response = await fetch(`api/meetings/${meeting.id}/participants/${username}`, {
        method: 'POST',
        body: JSON.stringify(meeting),
        headers: {'Content-Type': 'application.json'}
    });

    if (response.ok) {
        const updatedMeeting = await response.json();
        const nextMeetings = meetings.map(m => {
            if (m === meeting) {
                return updatedMeeting
            } else {
                return m
            }
        })
        setMeetings(nextMeetings);
    }

}

async function handleDeleteParticipant(meeting) {
    const response = await fetch(`api/meetings/${meeting.id}/participants/${username}`, {
        method: 'DELETE',
        body: JSON.stringify(meeting),
        headers: {'Content-Type': 'application.json'}
    });
    if (response.ok) {
        const updatedMeeting = await response.json();
        const nextMeetings = meetings.map(m => {
            if (m === meeting) {
                return updatedMeeting
            } else {
                return m
            }
        })
        setMeetings(nextMeetings);
    }
}

useEffect(() => {
    const fetchMeetings = async () => {
        const response = await fetch(`/api/meetings`);
        if (response.ok) {
            const meetings = await response.json();
            setMeetings(meetings);
        }
    };
    fetchMeetings();
}, []);

return (
    <div>
        <h2>Zajęcia ({meetings.length})</h2>
        {
            addingNewMeeting
                ? <NewMeetingForm onSubmit={(meeting) => handleNewMeeting(meeting)}/>
                : <button onClick={() => setAddingNewMeeting(true)}>Dodaj nowe spotkanie</button>
        }
        {meetings.length > 0 &&
            <MeetingsList meetings={meetings} username={username}
                          onDelete={handleDeleteMeeting}
                          onAddParticipant={handleAddParticipant}
                          onDeleteParticipant={handleDeleteParticipant}/>}

    </div>
)

}
