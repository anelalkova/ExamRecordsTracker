package mk.finki.ukim.mk.exam_records.service.domain;

import mk.finki.ukim.mk.exam_records.models.Room;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface RoomDomainService {
    Room createRoom(String name, Integer capacity);
    Room findRoom(Long id);
    Room updateRoom(Long id, Room room);
    List<Room> findAllRooms();
    List<Room> findAvailableRooms(Long examId, LocalDate date, LocalTime start, LocalTime end);
}
