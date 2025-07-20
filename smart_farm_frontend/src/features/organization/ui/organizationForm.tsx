import React, { useState } from 'react';
import {Button, TextInput, Switch, Box, Popover} from "@mantine/core";
import { useAuth } from "react-oidc-context";
import { createOrganization } from "../useCase/createOrganization";
import { useDispatch } from "react-redux";
import { createdOrganization } from "../state/OrganizationSlice";
import { useNavigate } from "react-router-dom";
import {AppRoutes} from "../../../utils/appRoutes";
import {Organization} from "../models/Organization";
import { useTranslation } from 'react-i18next';
import {IconEye, IconEyeOff} from "@tabler/icons-react";
import {showNotification} from "@mantine/notifications";

export const OrganizationForm: React.FC = () => {
    const auth = useAuth();
    const [name, setName] = useState("");
    const [isPublic, setIsPublic] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [createOrgaErrorListener , triggerCreateOrgaError] = useState(false)

    const handleSave = () => {
        createOrganization({ name, isPublic }).then((org: Organization) => {
            showNotification({
                title: t('common.saveSuccess'),
                message: ``,
                color: 'green',
            });

            dispatch(createdOrganization());
            navigate(AppRoutes.organization.replace(":organizationId", org.id));
        }).catch((error) => {
            showNotification({
                title: t('common.saveError'),
                message: `${error}`,
                color: 'red',
            });
            triggerCreateOrgaError(true);
        });
    };

    return (
        <>
            {!auth.isAuthenticated ? (
                <Button
                    onClick={() => auth.signinRedirect()}
                    variant="filled"
                    color="#105385"
                    style={{ margin: '10px' }}
                >
                    {t('button.loginToManage')}
                </Button>
            ) : (
                <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                    <Popover width={200} opened position="bottom-start" withArrow arrowPosition="side" arrowOffset={50} arrowSize={12}>
                        <Popover.Target>
                            <TextInput
                                label={t('label.organizationName')}
                                placeholder={t('placeholder.enterOrganizationName')}
                                value={name}
                                onChange={(e) => setName(e.currentTarget.value)}
                                required
                                mt="xs" // margin-top
                                mb="md" // margin-bottom
                                style={{ width: '100%' }}
                            />
                        </Popover.Target>
                        {createOrgaErrorListener && (
                            <Popover.Dropdown>
                                {t('error.organizationNameTaken')}
                            </Popover.Dropdown>
                        )}
                    </Popover>
                    <Switch
                        label={t('label.setPublic')}
                        onLabel={<IconEye size={16} stroke={2.5} />}
                        offLabel={<IconEyeOff size={16} stroke={2.5} />}
                        checked={isPublic}
                        onChange={(e) => setIsPublic(e.currentTarget.checked)}
                        mt="sm"
                        mb="md"
                    />
                    <Box mt="md" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            type="submit"
                            variant="filled"
                            color="#199ff4"
                            style={{ margin: '10px' }}
                        >
                            {t('button.create')}
                        </Button>
                    </Box>
                </form>
            )}
        </>
    );
};
