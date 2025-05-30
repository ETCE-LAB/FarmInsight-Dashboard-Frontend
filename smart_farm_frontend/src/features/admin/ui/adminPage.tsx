import {useAuth} from "react-oidc-context";
import {useTranslation} from "react-i18next";
import React, {useEffect, useState} from "react";
import {receiveUserProfile} from "../../userProfile/useCase/receiveUserProfile";
import {SystemRole, UserProfile} from "../../userProfile/models/UserProfile";
import {useNavigate} from "react-router-dom";
import {AppRoutes} from "../../../utils/appRoutes";
import {Button, Container, Flex, Modal, Table, Text} from "@mantine/core";
import {getAllUserprofiles} from "../useCase/getAllUserprofiles";


export const AdminPage = () => {
    const auth = useAuth();
    const { t } = useTranslation();
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();
    const [users, setUsers] = useState<UserProfile[] | undefined>(undefined);

    useEffect(() => {
        if (auth.isAuthenticated) {
            receiveUserProfile().then((user) => {
                if (user.systemRole === SystemRole.ADMIN) {
                    setIsAdmin(true);
                    getAllUserprofiles().then((users) => {
                        setUsers(users);
                    })
                } else {
                    navigate(AppRoutes.base);
                }
            });
        } else {
            navigate(AppRoutes.base);
        }
    }, [auth.isAuthenticated]);

    const [confirmModal, setConfirmModal] = useState<{ open: boolean, userId?: string}>({open: false});

    const resetPassword = (userId: string) => {

    }

    return (
      <Container>
          {isAdmin && users &&
              <>
                  <Modal
                      opened={confirmModal.open}
                      onClose={() => setConfirmModal({open: false})}
                      title={t("controllableActionList.confirmTitle")}
                  >
                      <Text>{t("controllableActionList.confirmMessage")}</Text>
                      <Flex justify="flex-end" gap="md" mt="md">
                          <Button variant="light" onClick={() => setConfirmModal({open: false})}>
                              {t("common.cancel")}
                          </Button>
                          <Button onClick={() => {
                              if (confirmModal.userId) {
                                  resetPassword(confirmModal.userId);
                              }
                          }}>
                              {t("common.confirm")}
                          </Button>
                      </Flex>
                  </Modal>

                  <Table striped highlightOnHover withColumnBorders>
                      <Table.Thead>
                          <Table.Tr>
                              <Table.Th>{t("header.name")}</Table.Th>
                              <Table.Th>{t("header.email")}</Table.Th>
                              <Table.Th></Table.Th>
                          </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                          {users.map((user : UserProfile ) => (
                              <Table.Tr key={user.id}>
                                  <Table.Td>{user.name}</Table.Td>
                                  <Table.Td>{user.email}</Table.Td>
                                  <Table.Td align='right'>
                                      <Button onClick={() => setConfirmModal({
                                          open: true,
                                          userId: user.id,
                                      })}>{t('admin.resetPassword')}</Button>
                                  </Table.Td>
                              </Table.Tr>
                          ))}
                      </Table.Tbody>
                  </Table>
              </>
          }
      </Container>
    );
}