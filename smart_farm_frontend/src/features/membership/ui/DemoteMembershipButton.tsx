import {updateMembershipRole} from "../useState/updateMembershipRole";
import {Button} from "@mantine/core";
import React from "react";
import {Membership, MembershipRole} from "../models/membership";
import {useDispatch} from "react-redux";
import {changedMembership} from "../state/MembershipSlice";
import { useTranslation } from 'react-i18next';
import {showNotification} from "@mantine/notifications";


export const DemoteMembershipButton:React.FC<{member:Membership}> = ({member}) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    function handlePromote() {
        updateMembershipRole({id: member.id, membershipRole: MembershipRole.MEMBER}).then(r =>{
            showNotification({
                title: t('common.success'),
                message: t('userManagement.userDemoted'),
                color: 'green',
            });
            dispatch(changedMembership())
        })
    }
    return (

        <Button onClick={handlePromote} variant="outline" size="xs" color="blue">
            {t("userManagement.demote")}
        </Button>
    )

}