import {useEffect, useState} from "react";
import NewMeetingForm from "./NewMeetingForm";
import MeetingsList from "./MeetingsList";

export default function MeetingsPage({username, participant}) {
    const [meetings, setMeetings] = useState([]);
    const [addingNewMeeting, setAddingNewMeeting] = useState(false);
    const [updateMeeting, setUpdateMeeting] = useState(null);

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

    async function handleUpdateMeeting(meeting) {
        const response = await fetch(`/api/meetings/${meeting.id}`, {
            method: 'PUT',
            body: JSON.stringify(meeting),
            headers: {'Content-Type': 'application/json'}
        });
        if(response.ok) {
            const updatedMeeting = await response.json();
            const nextMeetings = meetings
                .map(meeting => meeting.id === updatedMeeting.id ? updatedMeeting : meeting);
            setMeetings(nextMeetings);
            setUpdateMeeting(null);
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
        }
    }


    async function handleAddParticipant(meeting) {
        const response = await fetch(`/api/meetings/${meeting.id}/participants`, {
            method: 'POST',
            body: JSON.stringify(participant),
            headers: {'Content-Type': 'application/json'}
        });
        if (response.ok) {
            const updatedMeeting = await response.json();
            const nextMeetings = meetings.map(m =>
                m.id === updatedMeeting.id ? updatedMeeting : m
            );
            setMeetings(nextMeetings);
        }
    }

    async function handleDeleteParticipant(meeting) {
        const response = await fetch(`api/meetings/${meeting.id}/participants/${username}`, {
            method: 'DELETE',
            body: JSON.stringify(participant),
            headers: {'Content-Type': 'application/json'}
        });
        if (response.ok) {
            const updatedMeeting = await response.json();
            const nextMeetings = meetings.map(m =>
                m.id === updatedMeeting.id ? updatedMeeting : m
            );
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
                              onDeleteParticipant={handleDeleteParticipant}
                              setUpdateMeeting={setUpdateMeeting}
                              updateMeeting={updateMeeting}
                              onUpdate={handleUpdateMeeting}
                />}

        </div>
    )
}
