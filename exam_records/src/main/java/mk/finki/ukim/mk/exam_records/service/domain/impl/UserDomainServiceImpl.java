package mk.finki.ukim.mk.exam_records.service.domain.impl;

import mk.finki.ukim.mk.exam_records.models.User;
import mk.finki.ukim.mk.exam_records.models.UserRole;
import mk.finki.ukim.mk.exam_records.models.constants.Roles;
import mk.finki.ukim.mk.exam_records.models.exceptions.*;
import mk.finki.ukim.mk.exam_records.repository.UserRepository;
import mk.finki.ukim.mk.exam_records.repository.UserRoleRepository;
import mk.finki.ukim.mk.exam_records.service.domain.UserDomainService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserDomainServiceImpl implements UserDomainService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserRoleRepository userRoleRepository;

    public UserDomainServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, UserRoleRepository userRoleRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userRoleRepository = userRoleRepository;
    }

    @Override
    public User register(String email, String password, String repeatPassword,
                         String name, String surname, Long index, String studentProgram,
                         Long roleId) {

        if (email == null || email.isEmpty() || password == null || password.isEmpty())
            throw new InvalidEmailOrPasswordException("The email or password you entered is invalid");

        if (!password.equals(repeatPassword))
            throw new PasswordsDoNotMatchException("The passwords do not match");

        if (userRepository.findByEmail(email).isPresent())
            throw new EmailAlreadyExistsException(email);

        UserRole role = userRoleRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role not found: " + roleId));

        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setName(name);
        user.setSurname(surname);
        user.setRole(role);

        if (Roles.STUDENT.equals(role.getRole())) {
            user.setIndex(index);
            user.setStudentProgram(studentProgram);
        }
        return userRepository.save(user);
    }

    @Override
    public User login(String email, String password) {
        if (email == null || email.isEmpty() || password == null || password.isEmpty())
            throw new InvalidArgumentsException();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(email));
        if (!passwordEncoder.matches(password, user.getPassword()))
            throw new InvalidUserCredentialsException();
        return user;
    }

    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new UserNotFoundException(email));
    }

    @Override
    public List<User> findAll() {
        return userRepository.findAll();
    }

    @Override
    public List<User> findAllByRole(UserRole role) {
        return userRepository.findAllByRole(role);
    }

    @Override
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public Optional<User> getLoggedInUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof User) {
            return Optional.of((User) principal);
        }
        return Optional.empty();
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = this.findByEmail(username);

        if (user == null) {
            throw new UsernameNotFoundException("User with email '" + username + "' not found");
        }

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole().getRole())
                .build();
    }

    @Override
    public User update(User user) {
        if (user == null || user.getId() == null) {
            throw new IllegalArgumentException("Cannot update null or transient user");
        }

        User existingUser = userRepository.findById(user.getId())
                .orElseThrow(() -> new RuntimeException("User not found: " + user.getId()));

        existingUser.setName(user.getName());
        existingUser.setSurname(user.getSurname());
        existingUser.setEmail(user.getEmail());
        existingUser.setPassword(user.getPassword());
        existingUser.setRole(user.getRole());
        existingUser.setIndex(user.getIndex());
        existingUser.setStudentProgram(user.getStudentProgram());

        return userRepository.save(existingUser);
    }
}
