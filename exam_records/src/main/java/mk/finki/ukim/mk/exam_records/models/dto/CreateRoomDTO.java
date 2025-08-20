package mk.finki.ukim.mk.exam_records.models.dto;

import mk.finki.ukim.mk.exam_records.models.Room;

public record CreateRoomDTO (String name, Integer capacity) {
    public Room toRoom() {
        return new Room(name, capacity);
    }
}
