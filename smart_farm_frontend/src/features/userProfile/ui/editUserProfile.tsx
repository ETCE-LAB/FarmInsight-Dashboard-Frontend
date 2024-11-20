import { Button, Group, Notification, TextInput } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { modifyUserProfile } from "../useCase/modifyUserProfile";
import { UserProfile } from "../models/UserProfile";
import { receiveUserProfile } from "../useCase/receiveUserProfile";
import { useAuth } from "react-oidc-context";
import { useAppDispatch, useAppSelector } from "../../../utils/Hooks";
import { changedUserProfile, receivedUserProfileEvent } from "../state/UserProfileSlice";

export const EditUserProfile = () => {
    const [editableProfile, setEditableProfile] = useState({
        email: '',
        name: ''
    });
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const auth = useAuth();
    const userProfileReceivedEventListener = useAppSelector(receivedUserProfileEvent);
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const dispatch = useAppDispatch();

    const handleInputChange = (field: keyof typeof editableProfile, value: string) => {
        setEditableProfile((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        console.log('Saving updated profile:', editableProfile);
        try {
            const response = await modifyUserProfile({
                name: editableProfile.name,
            });
            dispatch(changedUserProfile());
            console.log('Profile updated:', response);
            setUserProfile((prev) => (prev ? { ...prev, ...response } : null)); // Update local state

            // Show success notification
            setNotification({
                type: 'success',
                message: 'Your profile has been updated successfully!',
            });

            // Auto-close notification after 3 seconds
            setTimeout(() => {
                setNotification(null);
            }, 3000);

        } catch (error) {
            console.error('Error updating profile:', error);

            // Show error notification
            setNotification({
                type: 'error',
                message: 'There was an error updating your profile.',
            });

            // Auto-close notification after 3 seconds
            setTimeout(() => {
                setNotification(null);
            }, 3000);
        }
    };

    useEffect(() => {
        if (auth.user) {
            receiveUserProfile()
                .then((resp) => {
                    if (resp) {
                        setUserProfile(resp);
                        setEditableProfile({
                            email: resp.email || '',
                            name: resp.name || '',
                        });
                    } else {
                        console.warn('No user profile data received');
                        setUserProfile(null);
                    }
                })
                .catch((error) => {
                    console.error('Error fetching user profile:', error);
                });
        }
    }, [auth.user, userProfileReceivedEventListener]);

    return (
        <>
            {/* Notification component from Mantine */}
            {notification && (
                <Notification
                    color={notification.type === 'success' ? 'teal' : 'red'}
                    title={notification.type === 'success' ? 'Success!' : 'Error'}
                    onClose={() => setNotification(null)}
                >
                    {notification.message}
                </Notification>
            )}

            <TextInput
                label="Email"
                value={editableProfile.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled
                style={{
                    marginBottom: '16px',
                }}
            />
            <TextInput
                label="Name"
                placeholder="Enter your display name"
                value={editableProfile.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                style={{
                    marginBottom: '16px',
                }}
            />
            <Group gap="right" mt="md">
                <Button
                    onClick={handleSave}
                    style={{
                        backgroundColor: '#199ff4',
                        color: 'white',
                        borderRadius: '6px',
                    }}
                >
                    Save changes
                </Button>
            </Group>
        </>
    );
};
