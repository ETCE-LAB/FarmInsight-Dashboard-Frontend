import React, {useEffect, useState} from 'react';
import { Button, List, Loader, Box } from '@mantine/core';
import { useAuth } from 'react-oidc-context';
import {getMyOrganizations} from "../useCase/getMyOrganizations";
import {Organization} from "../models/Organization";
import {useSelector} from "react-redux";
import {RootState} from "../../../utils/store";
import { useTranslation } from 'react-i18next';

export const MyOrganizations: React.FC = () => {
    const auth = useAuth();
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation();

    const [error, setError] = useState<string | null>(null);
    const organizationEventListener = useSelector((state: RootState) => state.organization.createdOrganizationEvent);
    //const socket = useContext(SocketContext)

    useEffect(() => {
            if (auth.isAuthenticated) {
                try {
                    getMyOrganizations().then(resp => {
                        if (resp !== undefined)
                            setOrganizations(resp)
                    })
                } catch (err) {
                    setError('Failed to load organizations');
                } finally {
                    setLoading(false);
                }

            }
        },[auth.isAuthenticated, organizationEventListener])


    if (!auth.isAuthenticated) {
        return (
            <Button onClick={() => auth.signinRedirect()} variant="filled" color="#105385" style={{ margin: '0 10px' }}>
                {t('header.loginToSee')}
            </Button>
        );
    }

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <Box color="red">{error}</Box>;
    }

    return (
        <List>
            {organizations.map((org) => (
                <List.Item key={org.id}>{org.name}</List.Item>
            ))}
        </List>
    );
};
