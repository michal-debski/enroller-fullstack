import {useState} from "react";

export default function UpdateMeetingPage({meeting, setUpdateMeeting, onSubmit}) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('')

    function submit(event) {
        event.preventDefault();
        onSubmit({id: meeting.id,title, description, date, participants: meeting.participants});
        setUpdateMeeting(null);
    }

    function checkDateTimeInput(date) {
        return Date.parse(date) < Date.now();
    }

    return (
        <form onSubmit={submit} >
            <h3>Edytuj spotkanie</h3>
            <label>Nazwa</label>
            <input type="text" value={title}
                   onChange={(e) => setTitle(e.target.value)}/>
            <label>Data i czas</label>
            <input type="datetime-local" value={date}
                   onChange={(e) => {
                       const newDate = new Date(e.target.value);
                       if (checkDateTimeInput(newDate)) {
                           alert("Date cannot be empty or before now");
                       } else {
                           setDate(e.target.value);
                       }}}/>
            <label>Opis</label>
            <textarea value={description}
                      onChange={(e) => setDescription(e.target.value)}></textarea>
            <button>Edytuj</button>
            <div>
                <button onClick={ () =>
                    setUpdateMeeting(null)
                }>Zamknij edycję</button>
            </div>

        </form>
    );
}