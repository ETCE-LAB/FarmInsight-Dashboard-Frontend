import {updateMembershipRole} from "../useState/updateMembershipRole";
import {Button} from "@mantine/core";
import React from "react";
import {Membership, MembershipRole} from "../models/membership";
import {useDispatch} from "react-redux";
import {changedMembership} from "../state/MembershipSlice";
import { useTranslation } from 'react-i18next';
import {showNotification} from "@mantine/notifications";


export const PromoteMembershipButton:React.FC<{member:Membership}> = ({member}) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    function handlePromote() {
        if (member) {
            updateMembershipRole({id: member.id, membershipRole: MembershipRole.ADMIN}).then(() => {
                showNotification({
                    title: t('common.success'),
                    message: t('userManagement.userPromoted'),
                    color: 'green',
                });
                dispatch(changedMembership())
            }).catch((error) => {
                showNotification({
                    title: t('common.error'),
                    message: `${error}`,
                    color: 'red',
                });
            });
        }
    }

    return (
        <Button onClick={handlePromote} variant="outline" size="xs" color="blue">
            {t("userManagement.promote")}
        </Button>
    )

}