import React, { useEffect, useState } from "react";
import {useNavigate, useParams} from "react-router-dom";
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
    Table,
} from "@mantine/core";
import {
    IconEdit,
    IconUserPlus,
    IconSquareRoundedMinus,
    IconEye,
    IconEyeOff,
    IconGripVertical
} from "@tabler/icons-react";
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
import {useAppDispatch, useAppSelector} from "../../../utils/Hooks";
import {RootState} from "../../../utils/store";
import {receiveUserProfile} from "../../userProfile/useCase/receiveUserProfile";
import {ResourceType} from "../../logMessages/models/LogMessage";
import {LogMessageModalButton} from "../../logMessages/ui/LogMessageModalButton";
import {LocationList} from "../../location/ui/LocationList";
import {useAuth} from "react-oidc-context";
import {AuthRoutes} from "../../../utils/Router";
import {DragDropContext, Draggable, DraggableProvided, Droppable} from "@hello-pangea/dnd";
import {moveArrayItem} from "../../../utils/utils";
import {Fpf} from "../../fpf/models/Fpf";
import {postFpfOrder} from "../../fpf/useCase/postFpfOrder";
import {createdFpf} from "../../fpf/state/FpfSlice";
import {MembershipRole} from "../../membership/models/membership";
import {storeSelectedOrganization} from "../state/OrganizationSlice";

export const EditOrganization = () => {
    const { t } = useTranslation();
    const auth = useAuth();
    const navigate = useNavigate();

    const dispatch = useAppDispatch();
    const userProfileSelector =  useAppSelector((state) => state.userProfile.ownUserProfile);

    const { organizationId } = useParams();

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
    const [fpfs, setFpfs] = useState<Fpf[]>([]);

    useEffect(() => {
        if (auth.isAuthenticated && organizationId) {
            getOrganization(organizationId).then((org) => {
                setOrganization(org);
                setFpfs(org.FPFs);
                setNewOrganizationName(org.name);
                setIsPublic(org.isPublic);
                setIsModified(false);
                dispatch(storeSelectedOrganization(org))
            }).catch((error) => {
                showNotification({
                    title: t('common.loadError'),
                    message: `${error}`,
                    color: 'red',
                });
            });
        } else {
            navigate(AuthRoutes.signin);
        }
    }, [auth.isAuthenticated, navigate, organizationId, membershipEventListener, t]);

    useEffect(() => {
        if (organization && userProfileSelector) {
            const userIsAdmin = organization.memberships.some(
                (member) => member.userprofile.id === userProfileSelector.id && member.membershipRole === MembershipRole.ADMIN
            );
            setIsAdmin(userIsAdmin);
        }
    }, [organization, t]);

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
        ).then(() => {
            showNotification({
                title: t('common.success'),
                message: `${usersToAdd.length} ${t("header.userAdded")}`,
                color: 'green',
            });
            setUsersToAdd([]);
            dispatch(changedMembership());
            setUserModalOpen(false);
        }).catch((error) => {
            showNotification({
                title: t('common.error'),
                message: `${error}`,
                color: 'red',
            });
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
        if (!organization) return;

        const updatedOrganization = {
            ...organization,
            name: newOrganizationName,
            isPublic: isPublic,
        };

        editOrganization(updatedOrganization).then(() => {
            showNotification({
                title: t('growingCycleForm.successTitle'),
                message: `${t("header.organizationUpdated")}`,
                color: 'green',
            });
            setOrganization(updatedOrganization);
            setIsModified(false);
            setEditModalOpen(false);
        }).catch((error) => {
            showNotification({
                title: t('common.updateError'),
                message: `${error}`,
                color: 'red',
            });
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
                        <Flex justify="space-between" >
                            <Flex align="center" gap={10}>
                                <Text fw="bold" size="lg" c="dimmed">
                                    {t("header.status")}:
                                </Text>
                                <Badge color={isPublic ? "green" : "red"} variant="light">
                                    {t(isPublic ? "header.public" : "header.private")}
                                </Badge>
                            </Flex>
                            <LogMessageModalButton resourceType={ResourceType.ORGANIZATION} resourceId={organizationId}></LogMessageModalButton>
                        </Flex>
                    </Card>

                    <Card padding="lg" radius="md" mt="lg">
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
                    </Card>

                    <Card padding={"lg"} radius={"md"} mt="lg">
                        <LocationList locationsToDisplay={organization.locations} isAdmin={isAdmin}/>
                    </Card>

                    {isAdmin &&
                        <Card padding="lg" radius="md" mt="lg">
                            <Flex justify="space-between" align="center" mb="lg">
                                <Text size="xl" fw="bold">
                                    {t("header.fpfs")}
                                </Text>
                            </Flex>
                            <Table highlightOnHover withColumnBorders style={{ minWidth: "100%" }}>
                                <DragDropContext
                                    onDragEnd={({ destination, source }) => {
                                        const reordered: Fpf[] = moveArrayItem(fpfs, source.index, destination?.index || 0);
                                        setFpfs(reordered);
                                        postFpfOrder(organization.id, reordered.map((x: Fpf) => x.id)).then(() => {
                                            // don't need to get list again since we keep the order locally
                                        }).catch((error) => {
                                            showNotification({
                                                title: t('common.updateError'),
                                                message: `${error}`,
                                                color: 'red',
                                            })
                                        });
                                    }}
                                >
                                    <Table.Thead>
                                        <Table.Tr>
                                            {isAdmin && <Table.Th />}
                                            <Table.Th>{t("header.name")}</Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Droppable droppableId="sensors" direction="vertical">
                                        {(provided) => (
                                            <Table.Tbody {...provided.droppableProps} ref={provided.innerRef}>
                                                {fpfs.map((fpf, index) => (
                                                    <Draggable key={fpf.id} index={index} draggableId={fpf.id}>
                                                        {(provided: DraggableProvided) => (
                                                            <Table.Tr ref={provided.innerRef} {...provided.draggableProps}>
                                                                {isAdmin &&
                                                                    <Table.Td>
                                                                        <div {...provided.dragHandleProps}>
                                                                            <IconGripVertical size={18} stroke={1.5} />
                                                                        </div>
                                                                    </Table.Td>
                                                                }
                                                                <Table.Td>{fpf.name}</Table.Td>
                                                            </Table.Tr>
                                                        )}
                                                    </Draggable>

                                                ))}
                                                {provided.placeholder}
                                            </Table.Tbody>
                                        )}
                                    </Droppable>
                                </DragDropContext>
                            </Table>
                        </Card>
                    }

                    <Modal
                        opened={fpfModalOpen}
                        onClose={() => setFpFModalOpen(false)}
                        title={t("header.addFpf")}
                        centered
                    >
                        {organizationId &&
                            <FpfForm organizationId={organizationId} close={setFpFModalOpen}/>
                        }
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
