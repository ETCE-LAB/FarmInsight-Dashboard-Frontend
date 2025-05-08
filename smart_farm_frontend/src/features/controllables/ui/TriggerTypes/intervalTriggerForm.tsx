import React, {useEffect, useState} from "react";
import { TimeInput } from '@mantine/dates';
import {useParams} from "react-router-dom";

import {Box, Grid, Group, NumberInput, Select, Stack, Text} from "@mantine/core";

export const IntervalTriggerForm:React.FC<{setTriggerLogic:React.Dispatch<React.SetStateAction<string>>, actionValue:string }> = ({setTriggerLogic, actionValue}) => {
    const { organizationId, fpfId } = useParams();
    const[from, setFrom] = useState("")
    const[to, setTo] = useState("")

    const [delay, setDelay] = useState<number>(1);
    const [duration, setDuration] = useState<number>(1);
    const [delayUnit, setDelayUnit] = useState<string>('seconds');
    const [durationUnit, setDurationUnit] = useState<string>('seconds');


    const timeUnits = [
        { value: 'seconds', label: 'Seconds' },
        { value: 'minutes', label: 'Minutes' },
        { value: 'hours', label: 'Hours' },
    ];

    useEffect(() => {
        let delayInSeconds = delay
        let durationInSeconds = duration
        if( delayUnit == "minutes") { delayInSeconds *= 60}
        if( delayUnit == "hours") { delayInSeconds *= 60 * 60}
        if( durationUnit == "minutes") { durationInSeconds *= 60}
        if( durationUnit == "hours") { durationInSeconds *= 60 * 60}
        let jsonString = "{\"durationInSeconds\": "+ durationInSeconds + ", \"delayInSeconds\": "+ delayInSeconds +"}"
        setTriggerLogic(jsonString)
    }, [delay, delayUnit, duration, durationUnit]);

    return (
      <Stack>
        <Group align="flex-end">
            <NumberInput
              value={duration}
              onChange={(value) => setDuration(value as number ?? 1)}
              min={0}
              step={1}
              description={"How long the action will be active."}
              hideControls
              label={"Duration for " + actionValue}
              style={{width: "48%"}}
            />
            <Select
              data={timeUnits}
              value={durationUnit}
              onChange={(value) => setDurationUnit(value!)}
              style={{width: "48%"}}
            />
        </Group>
          <Group align="flex-end">
            <NumberInput
              value={delay}
              onChange={(value) => setDelay(value as number ?? 1)}
              min={0}
              step={1}
              description={"How long until the actionValue will be triggered again."}
              hideControls
              label={"Delay"}
              style={{width: "48%"}}
            />
            <Select
              data={timeUnits}
              value={delayUnit}
              onChange={(value) => setDelayUnit(value!)}
              style={{width: "48%"}}
            />
        </Group>
      </Stack>

  );
}