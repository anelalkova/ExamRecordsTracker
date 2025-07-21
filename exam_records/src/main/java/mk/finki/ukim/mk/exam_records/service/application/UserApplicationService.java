package mk.finki.ukim.mk.exam_records.service.application;

import mk.finki.ukim.mk.exam_records.models.dto.CreateUserDTO;
import mk.finki.ukim.mk.exam_records.models.dto.DisplayUserDTO;
import mk.finki.ukim.mk.exam_records.models.dto.LoginResponseDTO;
import mk.finki.ukim.mk.exam_records.models.dto.LoginUserDTO;

import java.util.Optional;

public interface UserApplicationService {
    Optional<DisplayUserDTO> register(CreateUserDTO createUserDto);

    Optional<LoginResponseDTO> login(LoginUserDTO loginUserDto);

    Optional<DisplayUserDTO> findByEmail(String email);

}
