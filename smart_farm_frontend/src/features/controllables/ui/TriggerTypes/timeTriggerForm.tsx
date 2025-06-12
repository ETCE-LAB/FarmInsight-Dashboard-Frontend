import React, {useEffect, useState} from "react";
import { TimeInput } from '@mantine/dates';

import {Grid} from "@mantine/core";

type TimeTriggerLogic = {
  comparison: "between";
  from: string;
  to: string;
};

interface Props {
  triggerLogic:  string | undefined;
  setTriggerLogic: React.Dispatch<React.SetStateAction<string>>;
}

export const TimeTriggerForm: React.FC<Props> = ({ triggerLogic, setTriggerLogic }) => {
  const parsedLogic: Partial<TimeTriggerLogic> = (() => {
    try {
        if (triggerLogic)
      return JSON.parse(triggerLogic);
        return {}
    } catch {
      return {};
    }
  })();

  const [from, setFrom] = useState(parsedLogic.from ?? "");
  const [to, setTo] = useState(parsedLogic.to ?? "");

  useEffect(() => {
    const newLogic: TimeTriggerLogic = {
      comparison: "between",
      from,
      to,
    };
    setTriggerLogic(JSON.stringify(newLogic));
  }, [from, to, setTriggerLogic]);


    return (
        <Grid>
            <Grid.Col span={6}>
                <TimeInput
                    label={"From"}
                    onChange={(event) => setFrom(event.currentTarget.value)}
                    value={from}
                />
            </Grid.Col>
            <Grid.Col span={6}>
                <TimeInput
                    label={"To"}
                    onChange={(event) => setTo(event.currentTarget.value)}
                    value={to}
                />
            </Grid.Col>
        </Grid>
    )
}