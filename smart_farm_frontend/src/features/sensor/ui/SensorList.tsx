import React, {useEffect, useState} from "react";
import {EditSensor, Sensor} from "../models/Sensor";
import {ActionIcon, Box, Button, Group, Modal, Switch, Table} from "@mantine/core";
import {IconEdit, IconPlus} from "@tabler/icons-react";
import {FpfForm} from "../../fpf/ui/fpfForm";
import {SensorForm} from "./SensorForm";
import {getFpf} from "../../fpf/useCase/getFpf";
import {useAppSelector} from "../../../utils/Hooks";
import {receivedSensorEvent} from "../state/SensorSlice";


export const SensorList:React.FC<{sensorsToDisplay?:Sensor[], fpfId:string}> = ({sensorsToDisplay, fpfId}) => {
    const [sensor, setSensor] = useState<Sensor[]>()
    const [sensorModalOpen, setSensorModalOpen] = useState(false);
    const [selectedSensor, setSelectedSensor] = useState<EditSensor | undefined>(undefined);

    const sensorReceivedEventListener = useAppSelector(receivedSensorEvent);

    useEffect(() => {
        if (sensorsToDisplay) {
            setSensor(sensorsToDisplay);
    }
  }, [sensorsToDisplay, sensorReceivedEventListener]);


    const onClickEdit = (sensor: Sensor) => {
        const editSensor: EditSensor = {
          id: sensor.id,
          name: sensor.name,
          unit: sensor.unit,
          location: sensor.location,
          modelNr: sensor.modelNr,
          intervalSeconds: sensor.intervalSeconds,
          isActive: sensor.isActive,
          fpfId,

          // Add hardwareConfiguration (either default or derived)
          hardwareConfiguration: {
              sensorClassId: "",
              additionalInformation: {},
          }
        };

        setSelectedSensor(editSensor);
        setSensorModalOpen(true)
    }

    const onClickAddSensor = () => {
        setSelectedSensor(undefined)
        setSensorModalOpen(true)
    }

    return (
        <Box>
            {/* Add FpF Modal */}
            <Modal
                opened={sensorModalOpen}
                onClose={() => setSensorModalOpen(false)}
                title={selectedSensor ? "Edit Sensor": "Create Sensor"}
                centered
            >
                <SensorForm toEditSensor={selectedSensor} setClosed={setSensorModalOpen}/>
            </Modal>

            <Group mb="md">
                <h2>Sensor</h2>
               <IconPlus size={16}
                         stroke={3}
                         onClick={ () => onClickAddSensor()}
                         style={{cursor:"pointer"}} />
            </Group>
            <Table highlightOnHover>
                <thead>
                <tr>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Location</Table.Th>
                    <Table.Th>Unit</Table.Th>
                    <Table.Th>ModelNr</Table.Th>
                    <Table.Th>Interval</Table.Th>
                    <Table.Th>Is Active?</Table.Th>
                    <Table.Th>Actions</Table.Th>
                </tr>
                </thead>
                <tbody>
                {sensorsToDisplay && sensorsToDisplay.map((sensor, index) => (
                    <Table.Tr key={index}>
                        <Table.Td>{sensor.name}</Table.Td>
                        <Table.Td>{sensor.location}</Table.Td>
                        <Table.Td>{sensor.unit}</Table.Td>
                        <Table.Td>{sensor.modelNr}</Table.Td>
                        <Table.Td>{sensor.intervalSeconds}</Table.Td>
                        <Table.Td>
                            <Switch checked={sensor.isActive} />
                        </Table.Td>
                        <Table.Td>
                            <Group>
                                <ActionIcon color="blue">
                                    <IconEdit
                                        size={16}
                                        stroke={2}
                                        onClick={() => onClickEdit(sensor)}
                                        style={{cursor:"pointer"}} />
                                </ActionIcon>
                            </Group>
                        </Table.Td>
                    </Table.Tr>
                ))}
                </tbody>
            </Table>
        </Box>
    );
};

