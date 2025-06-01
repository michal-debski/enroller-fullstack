package com.company.enroller.persistence;

import com.company.enroller.model.Meeting;
import com.company.enroller.model.Participant;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.springframework.stereotype.Component;

import java.util.Collection;

@Component("meetingService")
public class MeetingService {

    Session session;

    public MeetingService() {
        session = DatabaseConnector.getInstance().getSession();
    }

    public Collection<Meeting> getAll() {
        String hql = "FROM Meeting";
        Query query = this.session.createQuery(hql);
        return query.list();
    }

    public Meeting findById(long id) {
        return this.session.get(Meeting.class, id);
    }

    public Collection<Meeting> findMeetings(String title, String description, Participant participant, String sortMode) {
        String hql = "FROM Meeting as meeting WHERE title LIKE :title AND description LIKE :description ";
        if (participant != null) {
            hql += " AND :participant in elements(participants)";
        }
        if (sortMode.equals("title")) {
            hql += " ORDER BY title";
        }
        Query query = this.session.createQuery(hql);
        query.setParameter("title", "%" + title + "%").setParameter("description", "%" + description + "%");
        if (participant != null) {
            query.setParameter("participant", participant);
        }
        return query.list();
    }

    public void delete(Meeting meeting) {
        Transaction transaction = this.session.beginTransaction();
        this.session.delete(meeting);
        transaction.commit();
    }

    public void add(Meeting meeting) {
        Transaction transaction = this.session.beginTransaction();
        this.session.save(meeting);
        transaction.commit();
    }

    public Meeting update(Meeting meeting) {
        Transaction transaction = this.session.beginTransaction();
        Meeting meetingFromDatabase = findById(meeting.getId());
        if (meeting.getDate() != null && !meeting.getDate().isEmpty()) {
            meetingFromDatabase.setTitle(
                    meeting.getTitle().isEmpty() ? meetingFromDatabase.getTitle() : meeting.getTitle());
            meetingFromDatabase.setDescription(
                    meeting.getDescription().isEmpty() ? meetingFromDatabase.getDescription() : meeting.getDescription());
            meetingFromDatabase.setDate(meeting.getDate());
            this.session.merge(meetingFromDatabase);
        } else {
            meetingFromDatabase.setTitle(
                    meeting.getTitle().isEmpty() ? meetingFromDatabase.getTitle() : meeting.getTitle()
            );
            meetingFromDatabase.setDescription(
                    meeting.getDescription().isEmpty() ? meetingFromDatabase.getDescription() : meeting.getDescription()
            );
            this.session.merge(meetingFromDatabase);
        }
        transaction.commit();
        return meetingFromDatabase;
    }

    public void addParticipantToMeeting(Participant participant, Meeting meeting) {
        if (!meeting.getParticipants().contains(participant)) {
            meeting.addParticipant(participant);
            Transaction transaction = session.beginTransaction();
            session.merge(meeting);
            transaction.commit();
        }
    }


    public boolean alreadyExist(Meeting meeting) {
        String hql = "FROM Meeting WHERE title=:title AND date=:date";
        Query query = this.session.createQuery(hql);
        Collection resultList = query.setParameter("title", meeting.getTitle()).setParameter("date", meeting.getDate())
                .list();
        return query.list().size() != 0;
    }

    public void deleteParticipantFromMeeting(Participant foundParticipant, Meeting meeting) {
        meeting.removeParticipant(foundParticipant);
        Transaction transaction = session.beginTransaction();
        session.save(meeting);
        transaction.commit();
    }

}
