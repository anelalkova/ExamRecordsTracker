package mk.finki.ukim.mk.exam_records.service.utils;

import org.passay.CharacterData;
import org.passay.CharacterRule;
import org.passay.EnglishCharacterData;
import org.passay.PasswordGenerator;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Arrays;

@Service
public class PasswordService {
    
    private final BCryptPasswordEncoder passwordEncoder;
    private final PasswordGenerator passwordGenerator;
    private final SecureRandom secureRandom;
    
    public PasswordService() {
        this.passwordEncoder = new BCryptPasswordEncoder();
        this.passwordGenerator = new PasswordGenerator();
        this.secureRandom = new SecureRandom();
    }
    
    public String generateRandomPassword() {
        CharacterRule lowerCaseRule = new CharacterRule(EnglishCharacterData.LowerCase);
        lowerCaseRule.setNumberOfCharacters(2);
        
        CharacterRule upperCaseRule = new CharacterRule(EnglishCharacterData.UpperCase);
        upperCaseRule.setNumberOfCharacters(2);
        
        CharacterRule digitRule = new CharacterRule(EnglishCharacterData.Digit);
        digitRule.setNumberOfCharacters(2);
        
        CharacterRule specialRule = new CharacterRule(new CharacterData() {
            @Override
            public String getErrorCode() {
                return "INSUFFICIENT_SPECIAL";
            }
            
            @Override
            public String getCharacters() {
                return "!@#$%^&*";
            }
        });
        specialRule.setNumberOfCharacters(2);
        
        int length = 8 + secureRandom.nextInt(5);
        
        return passwordGenerator.generatePassword(length, Arrays.asList(
                lowerCaseRule, upperCaseRule, digitRule, specialRule
        ));
    }
    
    public String encodePassword(String rawPassword) {
        return passwordEncoder.encode(rawPassword);
    }
    
    public boolean matches(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }
    
    public boolean isValidPassword(String password) {
        if (password == null || password.length() < 8) {
            return false;
        }
        
        boolean hasLower = password.chars().anyMatch(Character::isLowerCase);
        boolean hasUpper = password.chars().anyMatch(Character::isUpperCase);
        boolean hasDigit = password.chars().anyMatch(Character::isDigit);
        boolean hasSpecial = password.chars().anyMatch(ch -> "!@#$%^&*".indexOf(ch) >= 0);
        
        return hasLower && hasUpper && hasDigit && hasSpecial;
    }
}

