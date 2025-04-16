import {Table} from "@mantine/core";
import React, {useEffect, useState} from "react";
import {receiveUserProfile} from "../../userProfile/useCase/receiveUserProfile";
import {Membership} from "../models/membership";
import {PromoteMembershipButton} from "./PromoteMembershipButton";
import {KickMemberButton} from "./KickMemberButton";
import { useTranslation } from 'react-i18next';


export  const MembershipList: React.FC<{members:Membership[]}> = ( {members} ) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        receiveUserProfile().then( (user) => {
            const userIsAdmin = members.some(
                (member) => member.userprofile.id === user.id && member.membershipRole === "admin"
            );
            setIsAdmin(userIsAdmin);
            }
        )
    }, [members]);


    return (
        <Table striped highlightOnHover withColumnBorders>
            <Table.Thead>
                <Table.Tr>
                    <th style={{ textAlign: "left"}}>{t("header.name")}</th>
                    <th style={{ textAlign: "left"}}>{t("header.email")}</th>
                    <th style={{ textAlign: "left"}}>{t("header.role")}</th>
                    {isAdmin &&
                        <>
                            <th style={{ textAlign: "center"}}></th>
                            <th style={{ textAlign: "center"}}></th>
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
                        {isAdmin &&
                            <>
                                <Table.Td style={{ textAlign: "center"}}>
                                    { member.membershipRole !== "admin" && (
                                        <PromoteMembershipButton member={member}/>
                                    )}
                                </Table.Td>
                                <Table.Td style={{ textAlign: "center"}}>
                                    { member.membershipRole !== "admin" && (
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