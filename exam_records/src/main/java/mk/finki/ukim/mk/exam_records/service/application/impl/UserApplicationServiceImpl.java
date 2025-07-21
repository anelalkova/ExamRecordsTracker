package mk.finki.ukim.mk.exam_records.service.application.impl;

import mk.finki.ukim.mk.exam_records.helpers.JwtHelper;
import mk.finki.ukim.mk.exam_records.models.User;
import mk.finki.ukim.mk.exam_records.models.dto.CreateUserDTO;
import mk.finki.ukim.mk.exam_records.models.dto.DisplayUserDTO;
import mk.finki.ukim.mk.exam_records.models.dto.LoginResponseDTO;
import mk.finki.ukim.mk.exam_records.models.dto.LoginUserDTO;
import mk.finki.ukim.mk.exam_records.service.application.UserApplicationService;
import mk.finki.ukim.mk.exam_records.service.domain.UserDomainService;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserApplicationServiceImpl implements UserApplicationService {
    private final UserDomainService userDomainService;
    private final JwtHelper jwtHelper;

    public UserApplicationServiceImpl(UserDomainService userDomainService, JwtHelper jwtHelper) {
        this.userDomainService = userDomainService;
        this.jwtHelper = jwtHelper;
    }

    @Override
    public Optional<DisplayUserDTO> register(CreateUserDTO createUserDto) {
        User user = userDomainService.register(
                createUserDto.email(),
                createUserDto.password(),
                createUserDto.repeatPassword(),
                createUserDto.name(),
                createUserDto.surname(),
                createUserDto.roleId(),
                createUserDto.index(),
                createUserDto.studentProgram()
        );
        return Optional.of(DisplayUserDTO.from(user));
    }

    @Override
    public Optional<LoginResponseDTO> login(LoginUserDTO loginUserDto) {
        User user = userDomainService.login(
                loginUserDto.email(),
                loginUserDto.password()
        );

        String token = jwtHelper.generateToken(user);

        return Optional.of(new LoginResponseDTO(token));
    }

    @Override
    public Optional<DisplayUserDTO> findByEmail(String email) {
        return Optional.empty();
    }
}
