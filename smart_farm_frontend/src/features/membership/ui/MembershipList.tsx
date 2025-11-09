import {Table} from "@mantine/core";
import React, {useEffect, useState} from "react";
import {receiveUserProfile} from "../../userProfile/useCase/receiveUserProfile";
import {Membership, MembershipRole} from "../models/membership";
import {PromoteMembershipButton} from "./PromoteMembershipButton";
import {KickMemberButton} from "./KickMemberButton";
import { useTranslation } from 'react-i18next';
import {SystemRole, UserProfile} from "../../userProfile/models/UserProfile";
import {DemoteMembershipButton} from "./DemoteMembershipButton";
import {showNotification} from "@mantine/notifications";
import {useAppSelector} from "../../../utils/Hooks";
import {RootState} from "../../../utils/store";


export  const MembershipList: React.FC<{members:Membership[]}> = ( {members} ) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isSysAdmin, setIsSysAdmin] = useState<boolean>(false);
    const [user, setUser] = useState<UserProfile | null>(null);
    const { t } = useTranslation();

    const userProfileSelector =  useAppSelector((state) => state.userProfile.ownUserProfile);

    const selectedOrganization = useAppSelector((state: RootState) => state.organization.selectedOrganization);

    useEffect(() => {
        if(userProfileSelector && selectedOrganization ){

            setUser(userProfileSelector);
            const userIsAdmin = selectedOrganization.memberships.some(
                (member) => member.userprofile.id === userProfileSelector.id && member.membershipRole === MembershipRole.ADMIN
            );
            setIsAdmin(userIsAdmin);
            setIsSysAdmin(userProfileSelector.systemRole === SystemRole.ADMIN);
        }
    }, [members, t, userProfileSelector]);

    return (
        <Table striped highlightOnHover withColumnBorders>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th style={{ textAlign: "left"}}>{t("header.name")}</Table.Th>
                    <Table.Th style={{ textAlign: "left"}}>{t("header.email")}</Table.Th>
                    <Table.Th style={{ textAlign: "left"}}>{t("header.role")}</Table.Th>
                    {user && isAdmin &&
                        <>
                            <Table.Th style={{ textAlign: "center"}}></Table.Th>
                            <Table.Th style={{ textAlign: "center"}}></Table.Th>
                        </>
                    }
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {members.map((member : Membership ) => (
                    <Table.Tr key={member.id}>
                        <Table.Td style={{ textAlign: "left"}}>{member.userprofile.name}</Table.Td>
                        <Table.Td style={{ textAlign: "left"}}>{member.userprofile.email}</Table.Td>
                        <Table.Td style={{ textAlign: "left" }}>
                            {member.membershipRole.charAt(0).toUpperCase() + member.membershipRole.slice(1)}
                        </Table.Td>
                        {user && isAdmin &&
                            <>
                                <Table.Td style={{ textAlign: "center"}}>
                                    { member.membershipRole !== MembershipRole.ADMIN ? (
                                        <PromoteMembershipButton member={member}/>
                                    ) : (isSysAdmin && member.userprofile.id !== user.id) && (
                                        <DemoteMembershipButton member={member}/>
                                    )}

                                </Table.Td>
                                <Table.Td style={{ textAlign: "center"}}>
                                    { member.membershipRole !== MembershipRole.ADMIN && (
                                        <KickMemberButton id={member.id}/>
                                    )}
                                </Table.Td>
                            </>
                        }
                    </Table.Tr>
                ))}
            </Table.Tbody>
        </Table>
    );
};