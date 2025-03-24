import {ReactNode, useState} from "react";
import {Button, Card, Container, Group, SegmentedControl} from "@mantine/core";
import {Calendar} from "@mantine/dates";
import {format} from "node:url";


export const TimeRangeSelector = () => {
    const [selectedRange, setSelectedRange] = useState<string>("24h");
    const [customDate, setCustomDate] = useState<{ from: Date; to: Date } | null>(
        null
    );

    return (
       <Container>
           <SegmentedControl
               value={selectedRange}
               onChange={setSelectedRange}
               data={[
                   { label: 'Last 24h', value: '24h' },
                   { label: 'Last Week', value: 'Week' },
                   { label: 'Last Month', value: 'Month' },
                   { label: 'Last Year', value: 'Year' },
                   {label: 'Custom Date', value: 'Custom'}
               ]}
           />
       </Container>
    );
}

export default TimeRangeSelector