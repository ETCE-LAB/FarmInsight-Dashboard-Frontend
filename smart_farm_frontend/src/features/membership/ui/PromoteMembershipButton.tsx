import {promoteMember} from "../useState/promoteMember";
import {Button} from "@mantine/core";
import React from "react";
import {Membership} from "../models/membership";
import {useDispatch} from "react-redux";
import {changedMembership} from "../state/MembershipSlice";
import { useTranslation } from 'react-i18next';
import {showNotification} from "@mantine/notifications";


export const PromoteMembershipButton:React.FC<{member:Membership}> = ({member}) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    function handlePromote(id: string, membershipRole:string) {
        promoteMember({id, membershipRole}).then(r =>{
            showNotification({
                title: t('growingCycleForm.successTitle'),
                message: t('userManagement.userPromoted'),
                color: 'green',
            });
            dispatch(changedMembership())
        })
    }
    return (

        <Button onClick={() => handlePromote(member.id, 'admin' )} variant="outline" size="xs" color="blue">
            {t("header.promote")}
        </Button>
    )

}