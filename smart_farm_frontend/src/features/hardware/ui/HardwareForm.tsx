import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useAuth} from "react-oidc-context";
import {useAppDispatch} from "../../../utils/Hooks";
import {Hardware} from "../models/hardware";
import {Box, Button, Flex, TextInput} from "@mantine/core";
import {showNotification} from "@mantine/notifications";
import {updateHardware} from "../useCase/updateHardware";
import {createHardware} from "../useCase/createHardware";


export const HardwareForm : React.FC<{ toEditHardware?: Hardware, fpfId: string, close: () => void }> = ({ toEditHardware, fpfId, close }) => {
    const auth = useAuth();
    const dispatch = useAppDispatch();
    const {t} = useTranslation();

    const [hardware, setHardware] = useState<Hardware>({FPF: fpfId} as Hardware);

    useEffect(() => {
        if (toEditHardware) {
            setHardware(toEditHardware);
        }
    }, [toEditHardware]);

    const handleInputChange = (field: string, value: any) => {
        setHardware((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        if (toEditHardware) {
            try {
                const updatedEntity = await updateHardware(hardware);
                showNotification({
                    title: t('common.saveSuccess'),
                    message: '',
                    color: "green",
                });
                close();
            } catch (error) {
                showNotification({
                    title: t('common.saveError'),
                    message: `${error}`,
                    color: "red",
                });
            }
        } else {
            try {
                const newEntity = await createHardware(hardware);
                showNotification({
                    title: t('common.saveSuccess'),
                    message: '',
                    color: "green",
                });
                close();
            } catch (error) {
                showNotification({
                    title: t('common.saveError'),
                    message: `${error}`,
                    color: "red",
                });
            }
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
