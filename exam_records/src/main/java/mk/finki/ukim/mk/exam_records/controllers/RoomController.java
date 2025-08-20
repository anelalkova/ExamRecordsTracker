package mk.finki.ukim.mk.exam_records.controllers;

import mk.finki.ukim.mk.exam_records.models.dto.CreateRoomDTO;
import mk.finki.ukim.mk.exam_records.models.dto.DisplayRoomDTO;
import mk.finki.ukim.mk.exam_records.service.application.impl.RoomApplicationServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {
    private final RoomApplicationServiceImpl roomApplicationService;

    public RoomController(RoomApplicationServiceImpl roomApplicationService) {
        this.roomApplicationService = roomApplicationService;
    }

    @GetMapping
    public List<DisplayRoomDTO> getRooms() {
        return roomApplicationService.getRooms();
    }

    @GetMapping("/{id}")
    public ResponseEntity<DisplayRoomDTO> getRoom(@PathVariable Long id) {
        return roomApplicationService.getRoom(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/create")
    public ResponseEntity<DisplayRoomDTO> createRoom(@RequestBody CreateRoomDTO createRoomDto) {
        return roomApplicationService.addRoom(createRoomDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/update/{id}")
    public ResponseEntity<DisplayRoomDTO> updateROom(@PathVariable Long id, @RequestBody CreateRoomDTO createRoomDto) {
        return roomApplicationService.updateRoom(id, createRoomDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
