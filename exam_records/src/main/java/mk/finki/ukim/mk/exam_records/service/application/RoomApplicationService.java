package mk.finki.ukim.mk.exam_records.service.application;

import mk.finki.ukim.mk.exam_records.models.dto.CreateRoomDTO;
import mk.finki.ukim.mk.exam_records.models.dto.DisplayRoomDTO;

import java.util.List;
import java.util.Optional;

public interface RoomApplicationService {
    Optional<DisplayRoomDTO> getRoom(Long id);
    List<DisplayRoomDTO> getRooms();
    Optional<DisplayRoomDTO> addRoom(CreateRoomDTO room);
    Optional<DisplayRoomDTO> updateRoom(Long id, CreateRoomDTO room);
}
