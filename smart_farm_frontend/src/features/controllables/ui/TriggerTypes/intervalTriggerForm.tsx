import React, {useEffect, useState} from "react";
import {Grid, NumberInput, Select} from "@mantine/core";
import {useTranslation} from "react-i18next";

type IntervalTriggerLogic = {
  delayInSeconds: number;
};

interface Props {
  triggerLogic:  string | undefined;
  setTriggerLogic: React.Dispatch<React.SetStateAction<string>>;
}

export const IntervalTriggerForm: React.FC<Props> = ({ triggerLogic, setTriggerLogic }) => {
    const { t } = useTranslation();

    const parsedLogic: Partial<IntervalTriggerLogic> = (() => {
    try {
        if (triggerLogic)
      return JSON.parse(triggerLogic);
        return {}
    } catch {
      return {};
    }
  })();

    const [delay, setDelay] = useState<number>(parsedLogic.delayInSeconds ?? 1);
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

        const newLogic: IntervalTriggerLogic = {
          delayInSeconds : delayInSeconds
        };

        setTriggerLogic(JSON.stringify(newLogic));
    }, [delay, delayUnit, setTriggerLogic]);

    return (

          <Grid gutter="md" align="flex-end">
           <Grid.Col span={6}>
                <NumberInput
                  value={delay}
                  onChange={(value) => setDelay(value as number ?? 1)}
                  min={0}
                  step={1}
                  description={t("controllableActionList.trigger.intervalTriggerDesc")}
                  hideControls
                  label={t("controllableActionList.trigger.delay")}
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