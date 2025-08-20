package mk.finki.ukim.mk.exam_records.service.domain.impl;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import mk.finki.ukim.mk.exam_records.models.Room;
import mk.finki.ukim.mk.exam_records.repository.RoomRepository;
import mk.finki.ukim.mk.exam_records.service.domain.RoomDomainService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class RoomDomainServiceImpl implements RoomDomainService {

    private final RoomRepository roomRepository;

    public RoomDomainServiceImpl(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    @Override
    public Room createRoom(String name, Integer capacity) {
        Room room = new Room(name, capacity);
        return roomRepository.save(room);
    }

    @Override
    public Room findRoom(Long id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Room with id " + id + " not found"));
    }

    @Override
    public Room updateRoom(Long id, Room room) {
        Room existingRoom = findRoom(id);
        existingRoom.setName(room.getName());
        existingRoom.setCapacity(room.getCapacity());
        return roomRepository.save(existingRoom);
    }

    @Override
    public List<Room> findAllRooms() {
        return roomRepository.findAll();
    }

    @Transactional
    @Override
    public List<Room> findAvailableRooms(Long examId, LocalDate date, LocalTime start, LocalTime end) {
        return roomRepository.findAvailableRooms(examId, date, start, end);
    }
}
