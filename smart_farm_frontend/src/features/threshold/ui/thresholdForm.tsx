import React, { useState, useMemo, useEffect } from "react";
import { Button, Flex, TextInput } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { showNotification } from "@mantine/notifications";
import { useAppDispatch } from "../../../utils/Hooks";
import {Threshold} from "../models/threshold";
import {modifyThreshold} from "../useCase/modifyThreshold";
import {createThreshold} from "../useCase/createThreshold";
import {receivedSensor} from "../../sensor/state/SensorSlice";
import {MultiLanguageInput} from "../../../utils/MultiLanguageInput";
import {receivedModel} from "../../model/state/ModelSlice";

export const ThresholdForm: React.FC<{objectId: string; toEditThreshold: Threshold | null; thresholdType: string; rMMForecastName?:string; onSuccess: () => void;}> = ({ objectId, toEditThreshold, thresholdType,rMMForecastName,  onSuccess }) => {
    const { t } = useTranslation();
    const [threshold, setThreshold] = useState<Threshold>({thresholdType: thresholdType  } as Threshold);
    const dispatch = useAppDispatch();

    useEffect(() => {
       if(thresholdType === "sensor") {
           threshold.thresholdType = "sensor";
           threshold.sensorId = objectId
           threshold.resourceManagementModelId = null
       }
       else if(thresholdType === "model") {
           threshold.thresholdType = "model";
           threshold.resourceManagementModelId = objectId
           threshold.sensorId = null
           threshold.rMMForecastName = rMMForecastName
       }
    }, [thresholdType, threshold]);

    useEffect(() => {
        if (toEditThreshold) {
            setThreshold(toEditThreshold);
        }
    }, [toEditThreshold]);

    const handleSubmit = () => {
        if (toEditThreshold) {
            modifyThreshold(toEditThreshold.id, threshold).then(() => {
                showNotification({
                    title: t('common.updateSuccess'),
                    message: ``,
                    color: "green",
                });
                if(thresholdType == "sensor") {
                    dispatch(receivedSensor());
                }
                else if(thresholdType == "model") {
                    dispatch(receivedModel());
                }
                onSuccess();
            }).catch((error) => {
                showNotification({
                    title: t('threshold.failedToSave'),
                    message: `${error}`,
                    color: "red",
                });
            });
        } else {
            createThreshold(threshold).then(() => {
                showNotification({
                    title: t('common.saveSuccess'),
                    message: ``,
                    color: "green",
                });
                if(thresholdType == "sensor") {
                    dispatch(receivedSensor());
                }
                else if(thresholdType == "model") {
                    dispatch(receivedModel());
                }
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
    }, [threshold.upperBound, threshold.lowerBound]);

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
            <MultiLanguageInput
                label={t("threshold.description")}
                value={threshold.description}
                onChange={(value) => handleInputChange("description", value)}
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
