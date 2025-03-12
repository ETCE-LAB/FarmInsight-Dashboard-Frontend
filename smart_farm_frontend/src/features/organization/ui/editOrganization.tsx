import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrganization } from "../useCase/getOrganization";
import { Organization } from "../models/Organization";
import {
    Button,
    Card,
    Modal,
    TextInput,
    Switch,
    Flex,
    Title,
    Text,
    Box,
    Badge,
} from "@mantine/core";
import { IconEdit, IconUserPlus, IconSquareRoundedMinus, IconEye, IconEyeOff } from "@tabler/icons-react";
import { MembershipList } from "../../membership/ui/MembershipList";
import { SearchUserProfile } from "../../userProfile/ui/searchUserProfile";
import { UserProfile } from "../../userProfile/models/UserProfile";
import { addUserToOrganization } from "../useCase/addUserToOrganization";
import { showNotification } from "@mantine/notifications";
import { useTranslation } from "react-i18next";
import { FpfForm } from "../../fpf/ui/fpfForm";
import {useSelector} from "react-redux";
import {changedMembership} from "../../membership/state/MembershipSlice";
import {editOrganization} from "../useCase/editOrganization";
import {useAppDispatch} from "../../../utils/Hooks";
import {RootState} from "../../../utils/store";
import {receiveUserProfile} from "../../userProfile/useCase/receiveUserProfile";

export const EditOrganization = () => {
    const { organizationId } = useParams();
    const { t } = useTranslation();
    const [organization, setOrganization] = useState<Organization | null>(null);
    const [usersToAdd, setUsersToAdd] = useState<UserProfile[]>([]);
    const [userModalOpen, setUserModalOpen] = useState(false);
    const [fpfModalOpen, setFpFModalOpen] = useState(false);
    const [newOrganizationName, setNewOrganizationName] = useState<string>(organization?.name || "");
    const [isPublic, setIsPublic] = useState<boolean>(organization?.isPublic || false);
    const [isModified, setIsModified] = useState<boolean>(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const membershipEventListener = useSelector((state: RootState) => state.membership.changeMembershipEvent);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (organizationId)
            getOrganization(organizationId)
                .then((org) => {
                    setOrganization(org);
                    setNewOrganizationName(org.name);
                    setIsPublic(org.isPublic);
                    setIsModified(false);
                })
                .catch((error) => {
                    console.error("Failed to fetch organization:", error);
                });
    }, [organizationId, membershipEventListener]);


    useEffect(() => {
        if (organization) {
            receiveUserProfile().then((user) => {
                const userIsAdmin = organization.memberships.some(
                    (member) => member.userprofile.id === user.id && member.membershipRole === "admin"
                );
                setIsAdmin(userIsAdmin);
            });
        }
    }, [organization]);

    const handleRemoveUser = (user: UserProfile) => {
        setUsersToAdd((prevUsers) => prevUsers.filter((u) => u.id !== user.id));
    };

    const userSelected = (user: UserProfile) => {
        if (!usersToAdd.includes(user)) {
            setUsersToAdd((prevUsers) => [...prevUsers, user]);
        }
    };

    const handleAddUsers = () => {
        Promise.all(
            usersToAdd.map((user) =>
                addUserToOrganization({
                    organizationId: organization?.id || '',
                    userprofileId: user.id,
                    membershipRole: "member",
                })
            )
        )
            .then(() => {
                showNotification({
                    title: t('growingCycleForm.successTitle'),
                    message: `${usersToAdd.length} ${t("header.userAdded")}`,
                    color: 'green',
                });
                setUsersToAdd([]);
                dispatch(changedMembership());
                setUserModalOpen(false);
            })
            .catch((error) => {
                showNotification({
                    title: 'There was an error adding the users.',
                    message: `${error}`,
                    color: 'red',
                });
                console.error("Error adding users:", error);
            });
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewOrganizationName(e.target.value);
        setIsModified(e.target.value !== organization?.name);
    };

    const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsPublic(e.target.checked);
        setIsModified(e.target.checked !== organization?.isPublic);
    };

    const handleUpdateOrganization = () => {
        if (!organizationId) return;

        if (!organization?.id) {
            throw new Error("Organization ID is undefined");
        }

        const updatedOrganization = {
            ...organization,
            name: newOrganizationName,
            isPublic: isPublic,
        };

        editOrganization(updatedOrganization)
            .then(() => {
                showNotification({
                    title: t('growingCycleForm.successTitle'),
                    message: `${t("header.organizationUpdated")}`,
                    color: 'green',
                });
                setOrganization(updatedOrganization);
                setIsModified(false);
                setEditModalOpen(false);
            })
            .catch((error) => {
                showNotification({
                    title: 'Error updating organization',
                    message: `${error}`,
                    color: 'red',
                });
                console.error("Error updating organization:", error);
            });
    };

    return (
        <>
            {organization ? (
                <>
                    <Card padding="lg" radius="md">
                        <Flex align="center" justify="space-between" mb="lg">
                            <Title order={2}>
                                {t("header.organization")}: {organization.name}
                            </Title>
                            {isAdmin && (
                                <IconEdit
                                    size={24}
                                    onClick={() => setEditModalOpen(true)}
                                    style={{ cursor: "pointer", color: "#199ff4" }}
                                />
                            )}
                        </Flex>
                        <Flex align="center" gap={10}>
                            <Text fw="bold" size="lg" c="dimmed">
                                {t("header.status")}:
                            </Text>
                            <Badge color={isPublic ? "green" : "red"} variant="light">
                                {t(isPublic ? "header.public" : "header.private")}
                            </Badge>
                        </Flex>
                    </Card>

                    <Card padding="lg" radius="md" mt="lg">
                        <Box mt="xl">
                            <Flex justify="space-between" align="center" mb="lg">
                                <Text size="xl" fw="bold">
                                    {t("header.members")}
                                </Text>
                                {isAdmin && (
                                    <IconUserPlus
                                        size={30}
                                        onClick={() => setUserModalOpen(true)}
                                        style={{ cursor: "pointer", color: "#199ff4" }}
                                    />
                                )}
                            </Flex>
                            <MembershipList members={organization.memberships} />
                        </Box>
                    </Card>

                    <Modal
                        opened={fpfModalOpen}
                        onClose={() => setFpFModalOpen(false)}
                        title={t("header.addFpf")}
                        centered
                    >
                        <FpfForm organizationId={organizationId} close={setFpFModalOpen}/>
                    </Modal>

                    <Modal
                        opened={userModalOpen}
                        onClose={() => setUserModalOpen(false)}
                        title={t("header.addUser")}
                        centered
                    >
                        <SearchUserProfile onUserSelected={userSelected} />
                        <Box mt="lg">
                            {usersToAdd.length > 0 ? (
                                usersToAdd.map((user) => (
                                    <Flex key={user.id} justify="space-between" align="center" py="xs">
                                        <Text>{user.name || user.email}</Text>
                                        <IconSquareRoundedMinus
                                            size={18}
                                            style={{ cursor: "pointer", color: "#a53737" }}
                                            onClick={() => handleRemoveUser(user)}
                                        />
                                    </Flex>
                                ))
                            ) : (
                                <Text>{t("header.noUserSelected")}</Text>
                            )}
                            {usersToAdd.length > 0 && (
                                <Button
                                    fullWidth
                                    mt="md"
                                    onClick={handleAddUsers}
                                    variant="filled"
                                    color="#199ff4"
                                >
                                    {t("header.addSelectedUser")}
                                </Button>
                            )}
                        </Box>
                    </Modal>

                    <Modal
                        opened={editModalOpen}
                        onClose={() => setEditModalOpen(false)}
                        title={t("header.organization")}
                        centered
                    >
                        <TextInput
                            label={t("header.table.name")}
                            value={newOrganizationName}
                            onChange={handleNameChange}
                            disabled={!isAdmin}  // Disable if not admin
                        />
                        <Switch
                            style={{ marginTop: "20px" }}
                            label={t("header.public")}
                            onLabel={<IconEye size={16} stroke={2.5} />}
                            offLabel={<IconEyeOff size={16} stroke={2.5} />}
                            size="md"
                            checked={isPublic}
                            onChange={handleSwitchChange}
                            disabled={!isAdmin}  // Disable if not admin
                        />
                        <Button
                            onClick={handleUpdateOrganization}
                            mt="lg"
                            disabled={!isModified || !isAdmin}
                            variant="filled"
                            color="#199ff4"
                        >
                            {t("userprofile.saveChanges")}
                        </Button>
                    </Modal>
                </>
            ) : (
                <Text>{t("header.loading")}</Text>
            )}
        </>
    );
};
