import React, { useState, useMemo, useEffect } from "react";
import { Button, Flex, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useTranslation } from "react-i18next";
import { showNotification } from "@mantine/notifications";
import { useAppDispatch } from "../../../utils/Hooks";
import { createHarvestEntity } from "../useCase/createHarvestEntity";
import { modifyHarvestEntity } from "../useCase/modifyHarvestEntity";

import { HarvestEntity } from "../models/harvestEntity";
import {
    addHarvestEntity,
    changedGrowingCycle,
    updateHarvestEntity
} from "../../growthCycle/state/GrowingCycleSlice";

export const HarvestEntityForm: React.FC<{ growingCycleId: string; toEditHarvestEntity: HarvestEntity | null; onSuccess: () => void; }> = ({ growingCycleId, toEditHarvestEntity, onSuccess }) => {
    const { t } = useTranslation();
    const [harvestEntity, setHarvestEntity] = useState<HarvestEntity>({ growingCycleId: growingCycleId } as HarvestEntity);
    const dispatch = useAppDispatch();

    const handleInputChange = (field: string, value: any) => {
        setHarvestEntity((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        if (toEditHarvestEntity) {
            modifyHarvestEntity(harvestEntity.id, harvestEntity).then((updatedEntity) => {
                showNotification({
                    title: t('common.updateSuccess'),
                    message: "",
                    color: "green",
                });
                dispatch(updateHarvestEntity(updatedEntity));
                dispatch(changedGrowingCycle());
                onSuccess();
            }).catch((error) => {
                showNotification({
                    title: t('common.updateError'),
                    message: `${error}`,
                    color: "red",
                });
            });
        } else {
            createHarvestEntity(harvestEntity).then((newEntity) => {
                showNotification({
                    title: t('common.saveSuccess'),
                    message: "",
                    color: "green",
                });
                dispatch(addHarvestEntity({cycleId: growingCycleId, harvestEntity: newEntity}));
                dispatch(changedGrowingCycle());
                onSuccess();
            }).catch((error) => {
                showNotification({
                    title: t('common.saveError'),
                    message: `${error}`,
                    color: "red",
                });
            });
        }
    };

    const isFormValid = useMemo(() => {
        return harvestEntity.date && harvestEntity.amountInKg > 0;
    }, [harvestEntity]);

    useEffect(() => {
        if (toEditHarvestEntity) {
            setHarvestEntity(toEditHarvestEntity);
        }
    }, [toEditHarvestEntity]);

    return (
        <>
            <DateInput
                label={t("harvestEntityForm.dateLabel")}
                placeholder={t("harvestEntityForm.datePlaceholder")}
                required
                value={harvestEntity.date ? new Date(harvestEntity.date) : null}
                onChange={(date) => handleInputChange("date", date)}
                style={{ width: "100%", marginBottom: "15px" }}
                description={t("harvestEntityForm.hint.dateDescription")}
            />
            <TextInput
                label={t("harvestEntityForm.amountLabel")}
                placeholder={t("harvestEntityForm.amountPlaceholder")}
                description={t("harvestEntityForm.hint.amountDescription")}
                required
                type="number"
                value={harvestEntity.amountInKg !== undefined ? harvestEntity.amountInKg : ""}
                onChange={(e) => {
                    const value = e.currentTarget.value;
                    const parsedValue = parseFloat(value);
                    handleInputChange("amountInKg", isNaN(parsedValue) ? "" : parsedValue);
                }}
                style={{ width: "100%", marginBottom: "15px" }}
            />
            <TextInput
                label={t("harvestEntityForm.notesLabel")}
                placeholder={t("harvestEntityForm.notesPlaceholder")}
                value={harvestEntity.note || ""}
                onChange={(e) => handleInputChange("note", e.currentTarget.value)}
                style={{ width: "100%", marginBottom: "15px" }}
                description={t("harvestEntityForm.hint.notesDescription")}
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
