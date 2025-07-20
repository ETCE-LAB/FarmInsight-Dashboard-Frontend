import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {Hardware} from "../models/hardware";
import {Box, Button, Flex, TextInput} from "@mantine/core";
import {showNotification} from "@mantine/notifications";
import {updateHardware} from "../useCase/updateHardware";
import {createHardware} from "../useCase/createHardware";
import {createdFpf} from "../../fpf/state/FpfSlice";
import {useAppDispatch} from "../../../utils/Hooks";


export const HardwareForm : React.FC<{ toEditHardware?: Hardware, fpfId: string, close: () => void }> = ({ toEditHardware, fpfId, close }) => {
    const {t} = useTranslation();
    const dispatch = useAppDispatch();

    const [hardware, setHardware] = useState<Hardware>({FPF: fpfId} as Hardware);

    useEffect(() => {
        if (toEditHardware) {
            setHardware(toEditHardware);
        }
    }, [toEditHardware]);

    const handleInputChange = (field: string, value: any) => {
        setHardware((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        if (toEditHardware) {
            updateHardware(hardware).then((result) => {
                showNotification({
                    title: t('common.updateSuccess'),
                    message: '',
                    color: "green",
                });
                dispatch(createdFpf());
                close();
            }).catch ((error)=> {
                showNotification({
                    title: t('common.updateError'),
                    message: `${error}`,
                    color: "red",
                });
            });
        } else {
            createHardware(hardware).then((result) => {
                showNotification({
                    title: t('common.saveSuccess'),
                    message: '',
                    color: "green",
                });
                dispatch(createdFpf());
                close();
            }).catch ((error)=> {
                showNotification({
                    title: t('common.saveError'),
                    message: `${error}`,
                    color: "red",
                });
            });
        }
    };

    return (
        <Box>
            <TextInput
                label={t("hardware.name")}
                placeholder={t("hardware.name")}
                required
                type="string"
                value={hardware.name}
                onChange={(e) => {
                    handleInputChange("name", e.currentTarget.value);
                }}
                style={{ width: "100%", marginBottom: "15px" }}
            />
            <Flex justify="flex-end">
                <Button
                    style={{ width: "30%", marginTop: "1rem" }}
                    type="submit"
                    onClick={handleSubmit}
                >
                    {t("common.saveButton")}
                </Button>
            </Flex>
        </Box>
    );
}
