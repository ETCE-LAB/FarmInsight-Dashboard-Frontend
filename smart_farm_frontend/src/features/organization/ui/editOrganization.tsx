import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getOrganization } from "../useCase/getOrganization";
import { Organization } from "../models/Organization";
import { Button, Card, Modal, Notification, Paper, Title, Text } from "@mantine/core";
import { SearchUserProfile } from "../../userProfile/ui/searchUserProfile";
import { UserProfile } from "../../userProfile/models/UserProfile";
import { addUserToOrganization } from "../useCase/addUserToOrganization";
import { IconPlus } from "@tabler/icons-react";
import { FpfForm } from "../../fpf/ui/fpfForm";

export const EditOrganization = () => {
    const { name } = useParams<{ name: string }>();
    const [organization, setOrganization] = useState<Organization | null>(null);
    const [usersToAdd, setUsersToAdd] = useState<UserProfile[]>([]);
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [userModalOpen, setUserModalOpen] = useState(false); // Manage user modal visibility
    const [fpfModalOpen, setFpFModalOpen] = useState(false); // Manage FpF modal visibility

    useEffect(() => {
        if (name) {
            getOrganization(name)
                .then((org) => setOrganization(org))
                .catch((error) => {
                    console.error("Failed to fetch organization:", error);
                });
        }
    }, [name]);

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
                setNotification({
                    type: 'success',
                    message: `${usersToAdd.length} users have been added to the organization.`,
                });
                setUsersToAdd([]); // Clear the selected users
            })
            .catch((error) => {
                setNotification({
                    type: 'error',
                    message: 'There was an error adding the users.',
                });
                console.error("Error adding users:", error);
            });
    };

    return (
        <>
            {organization ? (
                <>
                    <Paper
                        radius="md"
                        p="xs"
                        style={{
                            border: "1px solid #105385",
                            textAlign: "center",
                            marginBottom: "20px",
                        }}
                    >
                        <Title order={2} style={{ color: "#105385", marginBottom: "10px" }}>
                            Organization: {organization.name}
                        </Title>
                        <Text
                            size="sm"
                            style={{
                                color: organization.isPublic ? "#28a745" : "#dc3545",
                                padding: "5px 10px",
                                borderRadius: "5px",
                                backgroundColor: organization.isPublic ? "#e6f9f0" : "#fbe5e5",
                                display: "inline-block",
                            }}
                        >
                            {organization.isPublic ? "Public" : "Private"}
                        </Text>
                    </Paper>
                    <Button
                        onClick={() => setUserModalOpen(true)} // Open modal on button click
                        variant="filled"
                        color="#105385"
                        style={{ margin: '10px' }}
                    >
                        <IconPlus size={18} style={{ marginRight: "8px" }} />
                        Add Users
                    </Button>
                    <Button
                        onClick={() => setFpFModalOpen(true)} // Open modal on button click
                        variant="filled"
                        color="#105385"
                        style={{ margin: '10px' }}
                    >
                        <IconPlus size={18} style={{ marginRight: "8px" }} />
                        Add FPF
                    </Button>

                    {/* Add User Modal */}
                    <Modal
                        opened={userModalOpen}
                        onClose={() => setUserModalOpen(false)}
                        title="Add User to Organization"
                        centered
                    >
                        {/* Search and select users */}
                        <SearchUserProfile onUserSelected={userSelected} />

                        {/* Display selected users */}
                        <Card withBorder style={{ marginTop: '20px' }}>
                            {usersToAdd.length > 0 ? (
                                usersToAdd.map((user, index) => (
                                    <div key={index} style={{ padding: '5px 0' }}>
                                        <Text>{user.name || user.email}</Text>
                                    </div>
                                ))
                            ) : (
                                <Text>
                                    No users selected yet
                                </Text>
                            )}
                            {usersToAdd.length > 0 && (
                                <Button
                                    onClick={handleAddUsers}
                                    fullWidth
                                    style={{ marginTop: '15px' }}
                                    variant="filled"
                                >
                                    Add Selected Users
                                </Button>
                            )}
                        </Card>
                    </Modal>

                    {/* Add FpF Modal */}
                    <Modal
                        opened={fpfModalOpen}
                        onClose={() => setFpFModalOpen(false)}
                        title="Create FpF"
                        centered
                    >
                        <FpfForm inputOrganization={organization}></FpfForm>
                    </Modal>

                    {/* Notification */}
                    {notification && (
                        <Notification
                            color={notification.type === 'success' ? 'green' : 'red'}
                            title={notification.type === 'success' ? 'Success' : 'Error'}
                            onClose={() => setNotification(null)}
                            style={{
                                position: 'fixed',
                                top: '20px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                zIndex: 1000,
                            }}
                        >
                            {notification.message}
                        </Notification>
                    )}
                </>
            ) : null}
        </>
    );
};
