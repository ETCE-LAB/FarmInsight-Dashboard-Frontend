import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {getFpf} from "../../../fpf/useCase/getFpf";
import {Grid, NumberInput, Select, Text} from "@mantine/core";
import {getBackendTranslation} from "../../../../utils/utils";
import {useTranslation} from "react-i18next";
import {showNotification} from "@mantine/notifications";

type SensorTriggerLogic = {
  sensorId : string,
  comparison :string,
  value : number
};

interface Props {
  triggerLogic:  string | undefined;
  setTriggerLogic: React.Dispatch<React.SetStateAction<string>>;
}


export const SensorTriggerForm: React.FC<Props> = ({ triggerLogic, setTriggerLogic }) => {
    const parsedLogic: Partial<SensorTriggerLogic> = (() => {
        try {
            if (triggerLogic)
                return JSON.parse(triggerLogic);
            return {};
        } catch {
            return {};
        }
    })();

    const [sensorsToDisplay, setSensorsToDisplay] = useState<{ value: string, label: string }[]>([])
    const { fpfId } = useParams();

    const [sensorId, setSensorId] = useState<string | null>(parsedLogic.sensorId ?? null);
    const [operator, setOperator] = useState<string | null>(parsedLogic.comparison ?? null);
    const [value, setValue] = useState<number | string | undefined>(parsedLogic.value ?? "");

    const { t, i18n } = useTranslation();

    useEffect(() => {
      if (sensorId && operator && value !== undefined && value !== "") {
        const logic: SensorTriggerLogic = {
          sensorId,
          comparison: operator,
          value: typeof value === "string" ? parseFloat(value) : value,
        };
        setTriggerLogic(JSON.stringify(logic));
      }
    }, [sensorId, operator, value, setTriggerLogic]);

    useEffect(() => {
        if (!fpfId) return;               // nothing to do

        getFpf(fpfId).then((response) => {
            const sensors = (response?.Sensors ?? []).map((sensor: any): { value: string; label: string } => ({
                value: sensor.id,
                    label: getBackendTranslation(sensor.name, i18n.language) + " ; Unit: " + sensor.unit + " ; " + sensor.parameter,
            }));
            setSensorsToDisplay(sensors);
        }).catch((err) => {
            showNotification({
                title: t('common.loadingError'),
                message: '',
                color: "red",
            });
        });
    }, [fpfId]);

    return (
        <>
            {(sensorsToDisplay && sensorsToDisplay.length > 0) ? (
                <Grid>
                    <Grid.Col span={5}>
                        <Select
                            label={"Sensor"}
                            placeholder={"Select Sensor"}
                            checkIconPosition="left"
                            data={sensorsToDisplay}
                            withAsterisk
                            value={sensorId}
                            onChange={setSensorId}
                        />
                    </Grid.Col>
                    <Grid.Col span={2}>
                        <Select
                            label={"Operator"}
                            data={["<", ">", "=="]}
                            withAsterisk
                            value={operator}
                            onChange={setOperator}
                        />
                    </Grid.Col>
                    <Grid.Col span={4}>
                        <NumberInput
                            label={"Value"}
                            placeholder={"Enter Value"}
                            withAsterisk
                            value={value}
                            onChange={setValue}
                        />

                    </Grid.Col>
                </Grid>
            ) : (
                <Text>No Sensors available!</Text>
            )}
        </>
    )
}