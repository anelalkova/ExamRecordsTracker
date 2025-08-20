package mk.finki.ukim.mk.exam_records.models.dto;

import mk.finki.ukim.mk.exam_records.models.Room;

public record DisplayRoomDTO(String name, Integer capacity) {
    public static DisplayRoomDTO from(Room room) {
        return new DisplayRoomDTO(
                room.getName(),
                room.getCapacity()
        );
    }
}
