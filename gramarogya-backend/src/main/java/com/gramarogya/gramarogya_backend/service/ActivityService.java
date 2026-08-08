package com.gramarogya.gramarogya_backend.service;

import com.gramarogya.gramarogya_backend.dto.dashboard.ActivityDto;
import com.gramarogya.gramarogya_backend.entity.User;

import java.util.List;

public interface ActivityService {

    /**
     * Create and save an activity.
     *
     * @param user          user who performed the action
     * @param action        CREATE / UPDATE / DELETE / COMPLETE / VERIFY / ASSIGN
     * @param title         activity heading
     * @param description   activity details
     * @param type          BENEFICIARY / VISIT / HEALTH_RECORD / MEDICINE / USER / PROJECT
     * @param referenceId   ID of the related entity
     * @param referenceType type of the related entity
     */
    void log(
            User user,
            String action,
            String title,
            String description,
            String type,
            String referenceId,
            String referenceType
    );

    /**
     * Get the latest activities for the specified users.
     */
    List<ActivityDto> getActivities(
            List<String> userIds
    );
}