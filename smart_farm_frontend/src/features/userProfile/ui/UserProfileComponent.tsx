import React, { useEffect, useState } from 'react';
import {AppRoutes} from "../../../utils/appRoutes";
import {Text, Group} from '@mantine/core';
import {UserProfile} from "../models/UserProfile"
import {useAppSelector} from "../../../utils/Hooks";
import {changedUserProfileEvent, receivedUserProfileEvent} from "../state/UserProfileSlice";
import {useAuth} from "react-oidc-context";
import {receiveUserProfile} from "../useCase/receiveUserProfile";
// @ts-ignore
import {IconUserCog} from "@tabler/icons-react";
import {useNavigate} from "react-router-dom";

const UserProfileComponent = () => {
    const auth = useAuth();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const userProfileReceivedEventListener = useAppSelector(receivedUserProfileEvent);
    const changedUserProfile = useAppSelector(changedUserProfileEvent);
    const navigate = useNavigate();

    useEffect(() => {
        if (auth.user) {
            receiveUserProfile()
                .then((resp) => {
                    if (resp) {
                        setUserProfile(resp);
                    } else {
                        console.warn('No user profile data received');
                        setUserProfile(null);
                    }
                })
                .catch((error) => {
                    console.error('Error fetching user profile:', error);
                });
        }
    }, [auth.user, userProfileReceivedEventListener, changedUserProfile]);

    const editProfile = () => {
        navigate(AppRoutes.editUserProfile);
    };

    return (
        <>
            {auth.isAuthenticated && userProfile && (
                <Group gap="center">
                    <IconUserCog
                        size={30}
                        cursor="pointer"
                        onClick={editProfile}
                    />
                    <Text
                        variant="filled"
                        style={{
                            backgroundColor: '#199ff4',
                            borderRadius: "6px",
                            padding: '6px 10px',
                            color: 'white',
                        }}
                    >
                        {userProfile.email}
                    </Text>
                </Group>
            )}
        </>
    );
};

export { UserProfileComponent };
