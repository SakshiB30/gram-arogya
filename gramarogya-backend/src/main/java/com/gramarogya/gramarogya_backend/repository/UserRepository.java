package com.gramarogya.gramarogya_backend.repository;

import com.gramarogya.gramarogya_backend.dto.Role;
import com.gramarogya.gramarogya_backend.dto.VerificationStatus;
import com.gramarogya.gramarogya_backend.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByEmail(String email);

    Optional<User> findByEmployeeId(String employeeId);

    boolean existsByEmail(String email);

    boolean existsByEmployeeId(String employeeId);

    Optional<User> findTopByRoleOrderByEmployeeIdDesc(Role role);

    List<User> findBySupervisorId(String supervisorId);

    List<User> findBySupervisorIdAndVerificationStatus(
            String supervisorId,
            VerificationStatus verificationStatus
    );

    List<User> findByRole(Role role);

    List<User> findByRoleAndVerificationStatus(
            Role role,
            VerificationStatus verificationStatus
    );

    Optional<User> findFirstByRole(Role role);

    long countBySupervisorId(String supervisorId);

    long countBySupervisorIdAndVerificationStatus(
            String supervisorId,
            VerificationStatus verificationStatus);

    long countByRole(Role role);

    long count();

    List<User> findByVerificationStatus(VerificationStatus verificationStatus);
}