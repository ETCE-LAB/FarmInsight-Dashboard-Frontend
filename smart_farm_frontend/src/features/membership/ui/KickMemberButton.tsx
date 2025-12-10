import {Button} from "@mantine/core";
import React from "react";
import {kickMember} from "../useState/kickMember";
import {useDispatch} from "react-redux";
import {changedMembership} from "../state/MembershipSlice";
import { useTranslation } from 'react-i18next';
import {showNotification} from "@mantine/notifications";


export const KickMemberButton:React.FC<{id:string}> = ({id}) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    function handleKick(id: string) {
        kickMember({id}).then(() =>{
            showNotification({
                    title: t('common.success'),
                    message: t('userManagement.userKicked'),
                    color: 'green',
                });
            dispatch(changedMembership());
        }).catch((error) => {
            showNotification({
                title: t('common.error'),
                message: `${error}`,
                color: 'red',
            });
        });
    }

    return (
        <Button onClick={() => handleKick(id)} variant="outline" size="xs" color="red">
            {t("userManagement.kick")}
        </Button>
    )

}