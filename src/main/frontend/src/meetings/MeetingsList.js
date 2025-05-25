export default function MeetingsList({meetings, onDelete, onAddParticipant, onDeleteParticipant}) {

    return (
        <table>
            <thead>
            <tr>
                <th>Nazwa spotkania</th>
                <th>Opis</th>
                <th>Participants</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {
                meetings.map((meeting, index) => <tr key={index}>
                    <td>{meeting.title}</td>
                    <td>{meeting.description}</td>
                    <td>
                        <table>
                            <thead>
                            <tr>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                meeting.participants.map((participant, index) =>
                                    <li key={index}>
                                    <ul>{participant.login} </ul>
                                    </li>
                                )
                            }
                            </tbody>
                        </table>

                    </td>
                    <td>
                        <button id="deleteButton" onClick={() => onDelete(meeting)}>Usuń</button>
                        <button onClick={() => onAddParticipant(meeting)}>Przypisz się!</button>
                        <button onClick={() => onDeleteParticipant(meeting)}>Wypisz się!</button>
                    </td>
                </tr>)
            }
            </tbody>
        </table>
    );
}
