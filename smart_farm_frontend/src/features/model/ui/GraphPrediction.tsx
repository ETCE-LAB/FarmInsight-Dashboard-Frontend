import React, {useEffect, useState} from "react";
import {useAuth} from "react-oidc-context";
import {LineChart} from "@mantine/charts";
import {Forecast} from "../models/Model";
import {Card, Flex} from "@mantine/core";
import {formatFloatValue} from "../../../utils/utils";


export const GraphPrediction: React.FC<{ forecast: Forecast }> = ({ forecast }) => {
    const auth = useAuth();

    const [series, setSeries] = useState<any[]>([]);
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        if (!forecast) return;

        // Hardcoded Colors for Cases
        setSeries([
            { name: forecast.values[0].name, color: 'green' },
            { name: forecast.values[1].name, color: 'yellow' },
            { name: forecast.values[2].name, color: 'red' },
        ]);

        // 1) Gather all Tags / unique Days
        const dayMap = new Map<
            string,
            { dateLabel: string; time: number }
        >();

        forecast.values.forEach((forecastCase: any) => {
            forecastCase.value.forEach((v: any) => {
                const d = new Date(v.timestamp);

                const dayKey = d.toISOString().slice(0, 10);
                if (!dayMap.has(dayKey)) {
                    dayMap.set(dayKey, {
                        dateLabel: d.toLocaleDateString('de-DE'),
                        time: d.getTime(),
                    });
                }
            });
        });

        // 2) Sort List by Date just to make sure
        const sortedDays = Array.from(dayMap.entries())
            .sort((a: any, b: any) => a[1].time - b[1].time);

        // 3) Create Object for each day
        const result: any[] = sortedDays.map(([dayKey, info]) => ({
            date: info.dateLabel,
            __key: dayKey,
        }));

        // Fast access Magic
        const byKey: Record<string, any> = Object.fromEntries(
            result.map((row) => [row.__key, row])
        );

        // 4) Write Value for each Case into the corresponding Day
        forecast.values.forEach((forecastCase: any) => {
            const seriesName = forecastCase.name; // z.B. "best-case"
            forecastCase.value.forEach((v: any) => {
                const d = new Date(v.timestamp);
                const dayKey = d.toISOString().slice(0, 10);
                const row = byKey[dayKey];
                if (row) row[seriesName] = v.value;
            });
        });

        // 5) Remove __key before setting Data
        const dataPoints = result.map(({ __key, ...rest }) => rest);

        setData(dataPoints);
    }, [forecast]);


    return (
        <Card p="md" radius="md" style={{ marginBottom: '20px', width: "100%", height: '150%' , boxSizing: 'border-box' }}>
            <Flex style={{  marginBottom: '20px' }}>
                {forecast.name}
            </Flex>
            <LineChart
                h={300}
                data={data}
                series={series}
                dataKey="date"
                curveType="bump"
                withLegend
                //Hey Tom here, what is happening here: Normally Mantine should be Able to render the Legend by it self
                // but it seems like it has issues in our case
                // therefore "we" create a custom Legend here to make sure all Cases are shown correctly with their colors
                legendProps={{
                verticalAlign: 'bottom',
                align: 'center',
                height: 50,
                content: (props: any) => {
                    const items = props?.payload ?? [];
                    return (
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: 16,
                                paddingTop: 8,
                                flexWrap: 'wrap',
                            }}
                        >
                            {items.map((it: any) => (
                                <div
                                    key={it.value}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 8,
                                    }}
                                >
                              <span
                                  style={{
                                      width: 10,
                                      height: 10,
                                      borderRadius: '50%',
                                      background: it.color,
                                      display: 'inline-block',
                                  }}
                              />
                                    <span>{it.value}</span>
                                </div>
                            ))}
                        </div>
                    );
                },
            }}
                tooltipProps={{
                    content: ({ label, payload }) => {
                        if (payload && payload.length > 0) {
                            return (
                                <Card color="grey">
                                    <strong>
                                        {new Date(label).toLocaleDateString([], {
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit',
                                        })}
                                    </strong>
                                    {payload.map((item) => (
                                        <Flex key={item.name}>
                                            {item.name}: {formatFloatValue(item.value)}
                                        </Flex>
                                    ))}
                                </Card>
                            );
                        }
                        return null;
                    },
                }}
            />
        </Card>
    );
};
