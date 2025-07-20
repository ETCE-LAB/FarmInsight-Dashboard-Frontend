import React, { useState, useMemo, useEffect } from "react";
import { Button, Flex, TextInput } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { showNotification } from "@mantine/notifications";
import { useAppDispatch } from "../../../utils/Hooks";
import {Threshold} from "../models/threshold";
import {modifyThreshold} from "../useCase/modifyThreshold";
import {createThreshold} from "../useCase/createThreshold";
import {receivedSensor} from "../../sensor/state/SensorSlice";

export const ThresholdForm: React.FC<{sensorId: string; toEditThreshold: Threshold | null; onSuccess: () => void;}> = ({ sensorId, toEditThreshold, onSuccess }) => {
    const { t } = useTranslation();
    const [threshold, setThreshold] = useState<Threshold>({ sensorId: sensorId } as Threshold);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (toEditThreshold) {
            setThreshold(toEditThreshold);
        }
    }, [toEditThreshold]);

    const handleSubmit = () => {
        if (toEditThreshold) {
            modifyThreshold(toEditThreshold.id, threshold).then((v) => {
                showNotification({
                    title: t('common.updateSuccess'),
                    message: ``,
                    color: "green",
                });
                dispatch(receivedSensor());
                onSuccess();
            }).catch((error) => {
                showNotification({
                    title: t('threshold.failedToSave'),
                    message: `${error}`,
                    color: "red",
                });
            });
        } else {
            createThreshold(threshold).then((v) => {
                showNotification({
                    title: t('common.saveSuccess'),
                    message: ``,
                    color: "green",
                });
                dispatch(receivedSensor());
                onSuccess();
            }).catch((error) => {
                showNotification({
                    title: t('threshold.failedToSave'),
                    message: `${error}`,
                    color: "red",
                });
            });
        }
    };

    const handleInputChange = (field: string, value: any) => {
        setThreshold((prev) => ({ ...prev, [field]: value }));
    };

    const isFormValid = useMemo(() => {
        if (threshold.upperBound && threshold.lowerBound)
            return threshold.upperBound > threshold.lowerBound;

        return threshold.upperBound || threshold.lowerBound;
    }, [threshold]);

    return (
        <>
            <TextInput
                label={t("threshold.lowerBound")}
                value={threshold.lowerBound}
                type="number"
                onChange={(v) => handleInputChange("lowerBound", parseFloat(v.currentTarget.value))}
                style={{ width: "100%", marginBottom: "15px" }}
            />
            <TextInput
                label={t("threshold.upperBound")}
                value={threshold.upperBound}
                type="number"
                onChange={(v) => handleInputChange("upperBound", parseFloat(v.currentTarget.value))}
                style={{ width: "100%", marginBottom: "15px" }}
            />
            <TextInput
                label={t("threshold.color")}
                value={threshold.color}
                onChange={(v) => handleInputChange("color", v.currentTarget.value)}
                style={{ width: "100%", marginBottom: "15px" }}
                description={t('threshold.colorHint')}
            />
            <TextInput
                label={t("threshold.description")}
                value={threshold.description}
                onChange={(v) => handleInputChange("description", v.currentTarget.value)}
                style={{ width: "100%", marginBottom: "15px" }}
            />
            <Flex justify="flex-end">
                <Button
                    style={{ width: "30%", marginTop: "1rem" }}
                    type="submit"
                    onClick={handleSubmit}
                    disabled={!isFormValid}
                >
                    {t("harvestEntityForm.saveButton")}
                </Button>
            </Flex>
        </>
    );
};
