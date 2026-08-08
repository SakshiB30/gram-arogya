package com.gramarogya.gramarogya_backend.service;

import com.gramarogya.gramarogya_backend.dto.dashboard.ActivityDto;
import com.gramarogya.gramarogya_backend.entity.Activity;
import com.gramarogya.gramarogya_backend.entity.User;
import com.gramarogya.gramarogya_backend.repository.ActivityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ActivityServiceImpl implements ActivityService {

    private final ActivityRepository activityRepository;

    @Override
    public void log(
            User user,
            String action,
            String title,
            String description,
            String type,
            String referenceId,
            String referenceType
    ) {

        System.out.println("========== ACTIVITY LOG ==========");
        System.out.println("User ID       : " + user.getId());
        System.out.println("User Role     : " + user.getRole());
        System.out.println("Action        : " + action);
        System.out.println("Title         : " + title);
        System.out.println("Description   : " + description);
        System.out.println("Type          : " + type);
        System.out.println("Reference ID  : " + referenceId);
        System.out.println("Reference Type: " + referenceType);

        Activity activity = Activity.builder()
                .userId(user.getId())
                .userRole(
                        user.getRole() != null
                                ? user.getRole().name()
                                : null
                )
                .action(action)
                .title(title)
                .description(description)
                .type(type)
                .referenceId(referenceId)
                .referenceType(referenceType)
                .createdAt(LocalDateTime.now())
                .build();

        Activity savedActivity =
                activityRepository.save(activity);

        System.out.println("ACTIVITY SAVED SUCCESSFULLY");
        System.out.println("Activity ID: " + savedActivity.getId());
        System.out.println("=================================");
    }

    @Override
    public List<ActivityDto> getActivities(
            List<String> userIds
    ) {

        if (userIds == null || userIds.isEmpty()) {
            return List.of();
        }

        return activityRepository
                .findTop10ByUserIdInOrderByCreatedAtDesc(userIds)
                .stream()
                .map(activity ->
                        ActivityDto.builder()

                                .id(activity.getId())

                                .title(activity.getTitle())

                                .description(
                                        activity.getDescription()
                                )

                                .time(
                                        activity.getCreatedAt()
                                                .toLocalDate()
                                                .toString()
                                )

                                .type(activity.getType())

                                // IMPORTANT
                                .action(activity.getAction())

                                .referenceId(
                                        activity.getReferenceId()
                                )

                                .referenceType(
                                        activity.getReferenceType()
                                )

                                .build()
                )
                .toList();
    }


}