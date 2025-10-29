import React, { useEffect, useState } from 'react';
import {AppRoutes} from "../../../utils/appRoutes";
import {Text, Group} from '@mantine/core';
import {UserProfile} from "../models/UserProfile"
import {useAppDispatch, useAppSelector} from "../../../utils/Hooks";
import {useAuth} from "react-oidc-context";
import {IconUserCog} from "@tabler/icons-react";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";

const UserProfileComponent: React.FC<{onNavigate?: () => void}> = ({onNavigate}) => {
    const auth = useAuth();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const navigate = useNavigate();
    const { t } = useTranslation();

    //Redux hooks
    const dispatch = useAppDispatch();
    const userProfileSelector = useAppSelector((state) => state.userProfile.ownUserProfile);
    const changedUserProfileEvent = useAppSelector((state) => state.userProfile.changedUserProfileEvent);

    useEffect(() => {
        if (auth.isAuthenticated ) {
            //Fetch user profile from backend if not in the redux store
            //If we already have the user profile in the redux store, we use it
            //Otherwise we fetch it from the backend
            if(userProfileSelector != null && userProfileSelector.email && userProfileSelector.email.length > 0) {
                //Only Update if there differences to avoid infinite loop
                if (userProfile !== userProfileSelector) {
                    setUserProfile(userProfileSelector);
                }
            }
        }
    }, [auth.isAuthenticated,changedUserProfileEvent, t, dispatch, userProfile, userProfileSelector]);

    const editProfile = () => {
        navigate(AppRoutes.editUserProfile);
        if (onNavigate) onNavigate();
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
