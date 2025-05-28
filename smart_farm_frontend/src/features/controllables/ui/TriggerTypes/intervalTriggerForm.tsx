import React, {useEffect, useState} from "react";
import {Grid, NumberInput, Select} from "@mantine/core";

export const IntervalTriggerForm:React.FC<{setTriggerLogic:React.Dispatch<React.SetStateAction<string>>, actionValue:string }> = ({setTriggerLogic, actionValue}) => {

    const [delay, setDelay] = useState<number>(1);
    const [delayUnit, setDelayUnit] = useState<string>('seconds');

    const timeUnits = [
        { value: 'seconds', label: 'Seconds' },
        { value: 'minutes', label: 'Minutes' },
        { value: 'hours', label: 'Hours' },
    ];

    useEffect(() => {
        let delayInSeconds = delay

        if( delayUnit === "minutes") { delayInSeconds *= 60}
        if( delayUnit === "hours") { delayInSeconds *= 60 * 60}
        let jsonString = "{\"delayInSeconds\": "+ delayInSeconds +"}"
        setTriggerLogic(jsonString)
    }, [delay, delayUnit]);

    return (

          <Grid gutter="md" align="flex-end">
           <Grid.Col span={6}>
                <NumberInput
                  value={delay}
                  onChange={(value) => setDelay(value as number ?? 1)}
                  min={0}
                  step={1}
                  description={"How long until the actionValue will be triggered again."}
                  hideControls
                  label={"Delay"}
                />
           </Grid.Col>
           <Grid.Col span={6}>
            <Select
              data={timeUnits}
              value={delayUnit}
              onChange={(value) => setDelayUnit(value!)}
            />
           </Grid.Col>
      </Grid>
  );
}