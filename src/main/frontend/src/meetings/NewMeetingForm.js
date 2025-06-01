import {useState} from "react";

export default function NewMeetingForm({onSubmit}) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('')

    function submit(event) {
        event.preventDefault();
        onSubmit({title, description, date, participants: []});
    }

    function checkDateTimeInput(date) {
        return Date.parse(date) < Date.now();
    }

    return (
        <form onSubmit={submit}>
            <h3>Dodaj nowe spotkanie</h3>
            <label>Nazwa</label>
            <input type="text" value={title} required={true}
                   onChange={(e) => setTitle(e.target.value)}/>
            <label>Data i czas</label>
            <input type="datetime-local" id="dateTimeInput" value={date} required={true}
                   onChange={(e) => {
                       const newDate = new Date(e.target.value);
                       if (checkDateTimeInput(newDate)) {
                       alert("Date cannot be empty or before now");
                   } else {
                       setDate(e.target.value);
                   }}}/>
            <label>Opis</label>
            <textarea value={description} required={true}
                      onChange={(e) => setDescription(e.target.value)}></textarea>
            <button>Dodaj</button>
        </form>
    );
}