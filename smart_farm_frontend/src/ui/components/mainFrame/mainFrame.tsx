import React, {useEffect, useState} from 'react';
import TimeseriesGraph from "../../../features/measurements/ui/timeseriesGraph";
import placeholderImage from "../../../placeholder-presi.jpg";
import {Sensor} from "../../../features/sensor/models/Sensor";
import {useLocation} from "react-router-dom";
import {Fpf} from "../../../features/fpf/models/Fpf";
import {receiveFpfData} from "../../../features/fpf/useCase/receiveFpfData";
import {getFpf} from "../../../features/fpf/useCase/getFpf";
import GrowingCycleList from "../../../features/growthCycle/ui/growingCycleList";
import {Text, Title} from '@mantine/core';

export const MainFrame = () => {

    const [sensors, setSensors] = useState<Sensor[]>([])
    const [fpf, setFpf] = useState<Fpf>()

    const { id, fpfName, fpfId } = useLocation().state;

    useEffect(() => {

        console.log(fpfId)
        getFpf(fpfId).then( resp => {
            setFpf(resp)
            console.log(resp)
        })
    }, [fpfId]);


    return (
        <div style={{ display: 'flex', height: 'auto', width: '100vw' }}>
            <div style={{ flexGrow: 1, padding: '20px', display: 'flex', flexDirection: 'column' }}>
                <Title order={1}>
                    {fpfName}
                </Title>
                <div style={{ display: 'flex', flexGrow: 1 }}>
                    <div style={{ flex: 1, marginRight: '20px', overflowY: "scroll", maxHeight: "85vh", maxWidth: "50vw" }}>
                        {fpf && fpf.Sensors.map((sensor) => (
                            <div key={sensor.id}>
                                <TimeseriesGraph sensor={sensor}/>
                            </div>
                        ))}
                    </div>
                    <div style={{ width: '30%', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ height: '40vh', marginBottom: '20px'}}>
                            {/* Camera feed placeholder */}
                            <img src={placeholderImage} alt="Placeholder" style={{width: '100%', height: '100%', objectFit: 'cover'}}/>
                        </div>
                        <div>
                            <GrowingCycleList fpfId={'d47d820738ba44ee953be36b50becf2f'}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
