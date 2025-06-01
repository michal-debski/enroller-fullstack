import {format} from "date-fns";
import pl from 'date-fns/locale/pl';
import UpdateMeetingPage from "./UpdateMeetingPage";

export default function MeetingsList({
                                         updateMeeting,
                                         setUpdateMeeting,
                                         meetings,
                                         onDelete,
                                         onAddParticipant,
                                         onDeleteParticipant,
                                         onUpdate
                                     }) {

    function showDeleteButton(meeting) {
        return <ul>
            <button id="deleteButton" onClick={() => onDelete(meeting)}>Usuń</button>
        </ul>
    }

    function showSimilarButtonsForTwoOptions(meeting) {
        return <>
            <ul>
                <button onClick={() => onAddParticipant(meeting)}>Przypisz się!</button>
            </ul>
            <ul>
                <button onClick={() => onDeleteParticipant(meeting)}>Wypisz się!</button>
            </ul>
            <ul>{
                updateMeeting === meeting.id
                    ? <UpdateMeetingPage
                        meeting={meeting}
                        onSubmit={onUpdate}
                        setUpdateMeeting={setUpdateMeeting}/>
                    : <button onClick={() => setUpdateMeeting(meeting.id)}>Edytuj spotkanie</button>
            }
            </ul>
        </>
    }

    return (
        <table>
            <thead>
            <tr>
                <th>Nazwa spotkania</th>
                <th>Data i czas</th>
                <th>Opis</th>
                <th>Participants</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {
                meetings.map((meeting, index) => <tr key={index}>
                    <td>{meeting.title}</td>
                    <td>{format(meeting.date, "do MMMM yyyy H:mm", {
                        locale: pl
                    })}</td>
                    <td>{meeting.description}</td>
                    <td>
                        {
                            meeting.participants
                                .filter(p => p !== null)
                                .sort((a, b) => a.login.localeCompare(b.login))
                                .map((participant, index) =>
                                    <ul key={index}>
                                        <li>
                                            {participant.login}
                                        </li>
                                    </ul>
                                )
                        }
                    </td>
                    {
                        meeting.participants.length === 0 ?
                            <td>
                                {showDeleteButton(meeting)}
                                {showSimilarButtonsForTwoOptions(meeting)}
                            </td>
                            :
                            <dl>
                                {showSimilarButtonsForTwoOptions(meeting)}
                            </dl>
                    }
                </tr>)
            }
            </tbody>
        </table>
    );
}
