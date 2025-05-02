import React, {useEffect, useState} from "react";
import {Sensor} from "../../../sensor/models/Sensor";
import {getSensor} from "../../../sensor/useCase/getSensor";
import {useParams} from "react-router-dom";
import {getFpf} from "../../../fpf/useCase/getFpf";
import {Box, Grid, NumberInput, Select, Text, TextInput} from "@mantine/core";
import {IconHelp} from "@tabler/icons-react";


export const SensorTriggerForm: React.FC<{setTriggerLogic:React.Dispatch<React.SetStateAction<string>> }> = ({setTriggerLogic} ) => {
    const [availableSensors, setAvailableSensors] = useState<Sensor[]>([]);
    const [sensorsToDisplay, setSensorsToDisplay] = useState<{ value: string, label: string }[]>([])
    const {organizationId, fpfId} = useParams();

    const[sensorId, setSensorId] = useState<string | null>(null)
    const[operator, setOperator] = useState<string | null>(null)
    const [value, setValue] = useState<string | number>("null")

    useEffect(() => {

        if(sensorId != "" && operator != "" && value != ""){
            //{comparison: "between", from: 6:00, to:18:00}
            let jsonString = "{\"sensorId\":"+ sensorId + ", \"comparison\":\""+ operator +"\", \"value\":\""+ value + "\"}"
            setTriggerLogic(jsonString)
        }
    }, [sensorId, operator, value]);

    useEffect(() => {
        if (!fpfId) return;               // nothing to do

        const fetchSensors = async () => {
            try {
                const response = await getFpf(fpfId);
                const sensors = (response?.Sensors ?? []).map((sensor: any): { value: string; label: string } => ({
                    value: sensor.id,
                    label: sensor.name + " ; Unit: " + sensor.unit + " ; " + sensor.parameter,
                }));
                setSensorsToDisplay(sensors);  // update state once
                // setAvailableSensors(response.Sensors); // if you still need this
            } catch (err) {
                console.error("Failed to load sensors:", err);
            }
        };

        fetchSensors();
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