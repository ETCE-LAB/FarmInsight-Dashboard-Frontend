import {useAuth} from "react-oidc-context";
import {useTranslation} from "react-i18next";
import React, {useEffect, useState} from "react";
import {receiveUserProfile} from "../../userProfile/useCase/receiveUserProfile";
import {SystemRole, UserProfile} from "../../userProfile/models/UserProfile";
import {useNavigate} from "react-router-dom";
import {AppRoutes} from "../../../utils/appRoutes";
import {Button, Container, Flex, Modal, Table, Text, CopyButton, Title} from "@mantine/core";
import {getAllUserprofiles} from "../useCase/getAllUserprofiles";
import {restUserprofilePassword} from "../useCase/resetUserprofilePassword";
import {showNotification} from "@mantine/notifications";
import {setUserprofileActiveState} from "../useCase/setUserprofileActiveState";
import {AuthRoutes} from "../../../utils/Router";


export const AdminPage = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [isAdmin, setIsAdmin] = useState(false);
    const [activeUsers, setActiveUsers] = useState<UserProfile[] | undefined>(undefined);
    const [inactiveUsers, setInactiveUsers] = useState<UserProfile[] | undefined>(undefined);

    useEffect(() => {
        if (auth.isAuthenticated) {
            receiveUserProfile().then((user) => {
                if (user.systemRole === SystemRole.ADMIN) {
                    setIsAdmin(true);
                    getAllUserprofiles().then((users) => {
                        setActiveUsers(users.filter(v => v.isActive));
                        setInactiveUsers(users.filter(v => !v.isActive));
                    })
                } else {
                    navigate(AppRoutes.base);
                }
            }).catch((error) => {
                showNotification({
                    title: t('common.loadErrorGeneric'),
                    message: `${error}`,
                    color: 'red',
                });
                navigate(AppRoutes.base);
            });
        } else {
            navigate(AuthRoutes.signin);
        }
    }, [auth.isAuthenticated, navigate, t]);

    const [confirmPasswordModal, setConfirmPasswordModal] = useState<{open: boolean, userId?: string}>({open: false});

    const resetPassword = (userId: string) => {
        restUserprofilePassword(userId).then((newPassword) => {
            showNotification({
                title: t('common.updateSuccess'),
                message: '',
                color: 'green',
            });
            setPasswordModal({open: true, password: newPassword});
        }).catch((error) => {
           showNotification({
               title: t('common.updateError'),
               message: `${error}`,
               color: 'red',
           });
        }).finally(() => {
            setConfirmPasswordModal({open: false});
        });
    }

    const [passwordModal, setPasswordModal] = useState<{open: boolean, password?: string}>({open: false});

    const [confirmActiveChangeModal, setConfirmActiveChangeModal] = useState<{open: boolean, userId?: string, active?: boolean}>({open: false});

    return (
        <Container>
            {isAdmin &&
                <>
                    <Modal
                        opened={confirmActiveChangeModal.open}
                        onClose={() => setConfirmActiveChangeModal({open: false})}
                        title={t("common.confirmTitle")}
                    >
                        <Text>{t("controllableActionList.confirmMessage")}</Text>
                        <Flex justify="flex-end" gap="md" mt="md">
                            <Button variant="light" onClick={() => setConfirmActiveChangeModal({open: false})}>
                                {t("common.cancel")}
                            </Button>
                            <Button onClick={() => {
                                if (confirmActiveChangeModal.userId && (confirmActiveChangeModal.active !== undefined)) {
                                    setUserprofileActiveState(confirmActiveChangeModal.userId, confirmActiveChangeModal.active).then(() => {
                                        setConfirmActiveChangeModal({open: false});
                                        getAllUserprofiles().then((users) => {
                                            if (users) {
                                                setActiveUsers(users.filter(v => v.isActive));
                                                setInactiveUsers(users.filter(v => !v.isActive));
                                            }
                                        })
                                    });
                                }
                            }}>
                                {t("common.confirm")}
                            </Button>
                        </Flex>
                    </Modal>

                    <Modal
                      opened={confirmPasswordModal.open}
                      onClose={() => setConfirmPasswordModal({open: false})}
                      title={t("common.confirmTitle")}
                    >
                        <Text>{t("controllableActionList.confirmMessage")}</Text>
                        <Flex justify="flex-end" gap="md" mt="md">
                            <Button variant="light" onClick={() => setConfirmPasswordModal({open: false})}>
                                {t("common.cancel")}
                            </Button>
                            <Button onClick={() => {
                                if (confirmPasswordModal.userId) {
                                    resetPassword(confirmPasswordModal.userId);
                                }
                            }}>
                                {t("common.confirm")}
                            </Button>
                        </Flex>
                    </Modal>

                    <Modal
                      opened={passwordModal.open}
                      onClose={() => setPasswordModal({open: false})}
                      title={t('admin.copyPasswordHint')}
                    >
                        <Flex direction='column' gap="md" mb="md" align="center">
                            <Text>{passwordModal.password}</Text>
                            {passwordModal.password &&
                                <CopyButton value={passwordModal.password}>
                                    {({ copied, copy }) => (
                                        <Button color={copied ? 'teal' : 'blue'} onClick={copy}>
                                            {copied ? t('admin.copied') : t('admin.copy')}
                                        </Button>
                                    )}
                                </CopyButton>
                            }
                        </Flex>
                    </Modal>

                    {activeUsers &&
                        <>
                            <Title order={2}>{t('admin.activeUsers')}</Title>
                            <Table striped highlightOnHover withColumnBorders mb='xl'>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th>{t("header.name")}</Table.Th>
                                        <Table.Th>{t("header.email")}</Table.Th>
                                        <Table.Th />
                                        <Table.Th />
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {activeUsers.map((user : UserProfile ) => (
                                        <Table.Tr key={user.id}>
                                            <Table.Td>{user.name}</Table.Td>
                                            <Table.Td>{user.email}</Table.Td>
                                            <Table.Td align='right'>
                                                <Button onClick={() => setConfirmPasswordModal({
                                                    open: true,
                                                    userId: user.id,
                                                })}>{t('admin.resetPassword')}</Button>
                                            </Table.Td>
                                            <Table.Td align='right'>
                                                <Button onClick={() => setConfirmActiveChangeModal({
                                                    open: true,
                                                    userId: user.id,
                                                    active: false,
                                                })}>{t('admin.deactivate')}</Button>
                                            </Table.Td>
                                        </Table.Tr>
                                    ))}
                                </Table.Tbody>
                            </Table>
                        </>
                    }

                    {inactiveUsers &&
                        <>
                            <Title order={2}>{t('admin.inactiveUsers')}</Title>
                            <Table striped highlightOnHover withColumnBorders>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th>{t("header.name")}</Table.Th>
                                        <Table.Th>{t("header.email")}</Table.Th>
                                        <Table.Th></Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {inactiveUsers.map((user : UserProfile ) => (
                                        <Table.Tr key={user.id}>
                                            <Table.Td>{user.name}</Table.Td>
                                            <Table.Td>{user.email}</Table.Td>
                                            <Table.Td align='right'>
                                                <Button onClick={() => setConfirmActiveChangeModal({
                                                    open: true,
                                                    userId: user.id,
                                                    active: true,
                                                })}>{t('admin.reactivate')}</Button>
                                            </Table.Td>
                                        </Table.Tr>
                                    ))}
                                </Table.Tbody>
                            </Table>
                        </>
                    }
                </>
            }
        </Container>
    );
}