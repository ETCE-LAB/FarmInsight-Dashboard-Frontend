import React, {useEffect, useState} from 'react';
import TimeseriesGraph from "../../../features/measurements/ui/timeseriesGraph";
import placeholderImage from "../../../placeholder.png";
import {Sensor} from "../../../features/sensor/models/Sensor";
import {useLocation} from "react-router-dom";
import {Fpf} from "../../../features/fpf/models/Fpf";
import {receiveFpfData} from "../../../features/fpf/useCase/receiveFpfData";
import {getFpf} from "../../../features/fpf/useCase/getFpf";
import GrowingCycleList from "../../../features/growthCycle/ui/growingCycleList";

export const MainFrame = () => {

    const [sensors, setSensors] = useState<Sensor[]>([])
    const [fpf, setFpf] = useState<Fpf>()

    const { id } = useLocation().state;

    useEffect(() => {

        console.log(id)
        getFpf(id).then( resp => {
            setFpf(resp)
            console.log(resp)
        })
    }, [id]);


    return (
        <div style={{ display: 'flex', height: 'auto', width: '100vw' }}>
            <div style={{ flexGrow: 1, padding: '20px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', flexGrow: 1 }}>
                    <div style={{ flex: 1, marginRight: '20px', overflowY: "scroll", maxHeight: "85vh", maxWidth: "50vw" }}>
                        {fpf && fpf.Sensors.map((sensor) => (
                            <div key={sensor.id}>
                                <TimeseriesGraph sensor={sensor}/>
                            </div>
                        ))}
                    </div>
                    <div style={{ width: '30%', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ height: 'auto', marginBottom: '20px'}}>
                            {/* Camera feed placeholder */}
                            <img src={placeholderImage} alt="Placeholder" style={{width: '100%', height: 'auto'}}/>
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
