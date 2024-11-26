import React, {useEffect, useState} from "react";
import {Sensor} from "../models/Sensor";
import {ActionIcon, Button, Group, Modal, Switch, Table} from "@mantine/core";
import {IconEdit, IconPlus} from "@tabler/icons-react";
import {FpfForm} from "../../fpf/ui/fpfForm";
import {SensorForm} from "./SensorForm";
import {getFpf} from "../../fpf/useCase/getFpf";


export const SensorList:React.FC<{sensorsToDisplay?:Sensor[], fpfid:string}> = ({sensorsToDisplay, fpfid}) => {
    const [sensor, setSensor] = useState<Sensor[]>()
    const [sensorModalOpen, setSensorModalOpen] = useState(false);

    useEffect(() => {

    }, []);


    const onClickEdit = () => {

    }

    return (
        <div>
            {/* Add FpF Modal */}
            <Modal
                opened={sensorModalOpen}
                onClose={() => setSensorModalOpen(false)}
                title="Create Sensor"
                centered
            >
                <SensorForm fpfID={fpfid}/>
            </Modal>

            <Group mb="md">
                <h2>Sensor</h2>
               <IconPlus size={16}
                         stroke={3}
                         onClick={ () => setSensorModalOpen(true)}
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
                        <Table.Td>{sensor.intervallSeconds}</Table.Td>
                        <Table.Td>
                            <Switch checked={sensor.isActive} />
                        </Table.Td>
                        <Table.Td>
                            <Group>
                                <ActionIcon color="blue">
                                    <IconEdit
                                        size={16}
                                        stroke={2}
                                        onClick={onClickEdit}
                                        style={{cursor:"pointer"}} />
                                </ActionIcon>
                            </Group>
                        </Table.Td>
                    </Table.Tr>
                ))}
                </tbody>
            </Table>
        </div>
    );
};
