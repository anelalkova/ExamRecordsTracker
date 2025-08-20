package mk.finki.ukim.mk.exam_records.service.application.impl;

import mk.finki.ukim.mk.exam_records.models.Room;
import mk.finki.ukim.mk.exam_records.models.dto.CreateRoomDTO;
import mk.finki.ukim.mk.exam_records.models.dto.DisplayRoomDTO;
import mk.finki.ukim.mk.exam_records.service.application.RoomApplicationService;
import mk.finki.ukim.mk.exam_records.service.domain.impl.RoomDomainServiceImpl;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RoomApplicationServiceImpl implements RoomApplicationService {

    private final RoomDomainServiceImpl roomDomainService;

    public RoomApplicationServiceImpl(RoomDomainServiceImpl roomDomainService) {
        this.roomDomainService = roomDomainService;
    }

    @Override
    public Optional<DisplayRoomDTO> getRoom(Long id) {
        Room room = roomDomainService.findRoom(id);
        return Optional.of(DisplayRoomDTO.from(room));
    }

    @Override
    public List<DisplayRoomDTO> getRooms() {
        return roomDomainService.findAllRooms().stream().map(DisplayRoomDTO::from).toList();
    }

    @Override
    public Optional<DisplayRoomDTO> addRoom(CreateRoomDTO room) {
        Room newRoom = roomDomainService.createRoom(room.name(), room.capacity());
        return Optional.of(DisplayRoomDTO.from(newRoom));
    }

    @Override
    public Optional<DisplayRoomDTO> updateRoom(Long id, CreateRoomDTO room) {
        Room updatedRoom = roomDomainService.updateRoom(id, new Room(room.name(), room.capacity()));
        return Optional.of(DisplayRoomDTO.from(updatedRoom));
    }
}
