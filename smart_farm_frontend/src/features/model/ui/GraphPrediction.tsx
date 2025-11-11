import React, {useEffect, useState} from "react";
import {useAuth} from "react-oidc-context";
import {LineChart} from "@mantine/charts";
import {Forecast} from "../models/Model";
import {Card, Flex} from "@mantine/core";


export const GraphPrediction: React.FC<{ forecast: Forecast }> = ({ forecast }) => {
    const auth = useAuth();

    const [series, setSeries] = useState<any[]>([]);
    const [data, setData] = useState<any[]>([]);



    useEffect(() => {
        console.log(forecast.name);
        console.log(forecast.values);
        //Get Series and Color
        setSeries([
            { name: forecast.values[0].name, color: 'green' },
            { name: forecast.values[1].name, color: 'yellow' },
            { name: forecast.values[2].name, color: 'red' },
        ])

        //Get Data Points
        const dataPoints: any[] = [];
        forecast.values.forEach((forecastCase) => {
            forecastCase.value.forEach((forecastValue) => {
                let existingPoint = dataPoints.find(point => point.timestamp === forecastValue.timestamp);
                if (!existingPoint) {
                    existingPoint = { timestamp: forecastValue.timestamp };
                    dataPoints.push(existingPoint);
                }
                existingPoint[forecastCase.name] = forecastValue.value;
            });
        });
        setData(dataPoints);
        console.log(dataPoints);

    }, [forecast]);


    return (
        <Card p="md" radius="md" style={{ marginBottom: '20px', width: "100%", boxSizing: 'border-box' }}>

            {forecast.name}
            <LineChart
                h={300}
                data={data}
                series={series}
                dataKey="timestamp"
                curveType="bump"
            />
        </Card>
    );
};
