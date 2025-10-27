import React, { useEffect, useState } from 'react';
import {AppRoutes} from "../../../utils/appRoutes";
import {Text, Group} from '@mantine/core';
import {UserProfile} from "../models/UserProfile"
import {useAppSelector} from "../../../utils/Hooks";
import {changedUserProfileEvent, receivedUserProfileEvent} from "../state/UserProfileSlice";
import {useAuth} from "react-oidc-context";
import {receiveUserProfile} from "../useCase/receiveUserProfile";
import {IconUserCog} from "@tabler/icons-react";
import {useNavigate} from "react-router-dom";
import {showNotification} from "@mantine/notifications";
import {useTranslation} from "react-i18next";

const UserProfileComponent: React.FC<{onNavigate?: () => void}> = ({onNavigate}) => {
    const auth = useAuth();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const userProfileReceivedEventListener = useAppSelector(receivedUserProfileEvent);
    const changedUserProfile = useAppSelector(changedUserProfileEvent);
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        if (auth.isAuthenticated) {
            receiveUserProfile().then((resp) => {
                setUserProfile(resp);
            }).catch((error) => {
                showNotification({
                    title: t("common.loadError"),
                    message: `${error}`,
                    color: 'red',
                });
            });
        }
    }, [auth.isAuthenticated, userProfileReceivedEventListener, changedUserProfile, t]);

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
