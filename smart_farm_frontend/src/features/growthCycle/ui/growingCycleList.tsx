import React, { useState } from "react";
import { Card, Modal, Table } from "@mantine/core";
import {IconCircleMinus, IconCirclePlus, IconSeeding} from "@tabler/icons-react";
import { GrowingCycleForm } from "./growingCycleForm";

const GrowingCycleList: React.FC<{ fpfId: string }> = ({ fpfId }) => {
    const [showGrowingCycleForm, setShowGrowingCycleForm] = useState(false);

    // Mock data for growing cycles
    const [growingCycles, setGrowingCycles] = useState([
        { id: 1, plant: "Cannabis", planted: "10-01-2024", harvested: "10-31-2024", notes: "Grows quickly." },
        { id: 2, plant: "Tobacco", planted: "10-31-2024", harvested: "", notes: "" },
    ]);

    // Function to handle deletion of a cycle
    const deleteCycle = (id: number) => {
        setGrowingCycles((prev) => prev.filter((cycle) => cycle.id !== id));
    };

    return (
        <>
            {/* Modal for Adding Growing Cycles */}
            <Modal
                opened={showGrowingCycleForm}
                onClose={() => setShowGrowingCycleForm(false)}
                title="Add Growing Cycle"
            >
                <GrowingCycleForm fpfId={fpfId} />
            </Modal>

            {/* Card Component */}
            <Card
                shadow="sm"
                padding="md"
                radius="md"
                style={{ boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)", position: "relative" }}
            >
                {/* Add Button */}
                <IconCirclePlus
                    size={25}
                    onClick={() => setShowGrowingCycleForm(true)}
                    style={{
                        cursor: "pointer",
                        color: "#105385",
                        position: "absolute",
                        top: "10px",
                        left: "10px",
                    }}
                />
                {/* TODO: Replace mock table with real growing cycles */}
                {/* Spacing and Table */}
                <div style={{ marginTop: "2rem" }}>
                    <Table
                        style={{
                            textAlign: "center",
                            borderCollapse: "collapse",
                            width: "100%",
                        }}
                    >
                        <thead>
                        <tr>
                            <th style={{ textAlign: "center" }}></th>
                            <th style={{ textAlign: "center" }}>Plant</th>
                            <th style={{ textAlign: "center" }}>Planted</th>
                            <th style={{ textAlign: "center" }}>Harvested</th>
                            <th style={{ textAlign: "center" }}>Notes</th>
                            <th style={{ textAlign: "center" }}></th>
                        </tr>
                        </thead>
                        <tbody>
                        {growingCycles.map((cycle) => (
                            <tr key={cycle.id}>
                                <IconSeeding
                                    style={{
                                        marginRight: "0.5rem",
                                        color: cycle.harvested ? 'grey' : 'green'  // Grey if harvested, green if not
                                    }}
                                />
                                <td style={{textAlign: "center"}}>{cycle.plant}</td>
                                <td style={{textAlign: "center"}}>{cycle.planted}</td>
                                <td style={{textAlign: "center"}}>{cycle.harvested || ""}</td>
                                <td style={{textAlign: "center"}}>{cycle.notes}</td>
                                <td style={{textAlign: "center"}}>
                                    <IconCircleMinus
                                        size={20}
                                        style={{cursor: "pointer", color: "red"}}
                                        onClick={() => deleteCycle(cycle.id)}
                                    />
                                </td>
                            </tr>

                        ))}
                        </tbody>
                    </Table>
                </div>
            </Card>
        </>
    );
};

export default GrowingCycleList;
