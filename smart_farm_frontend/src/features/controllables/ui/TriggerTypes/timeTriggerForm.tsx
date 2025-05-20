import React, {useEffect, useState} from "react";
import { TimeInput } from '@mantine/dates';

import {Grid} from "@mantine/core";

export const TimeTriggerForm:React.FC<{setTriggerLogic:React.Dispatch<React.SetStateAction<string>> }> = ({setTriggerLogic}) => {
    const[from, setFrom] = useState("")
    const[to, setTo] = useState("")

    useEffect(() => {
        if(from !== "" && to !== ""){
            //{comparison: "between", from: 6:00, to:18:00}
            let jsonString = "{\"comparison\": \"between\", \"from\":\"" + from + "\", \"to\":\""+ to +"\"}"
            setTriggerLogic(jsonString)
        }
    }, [from, to]);

    return (
        <Grid>
            <Grid.Col span={6}>
                <TimeInput
                    label={"From"}
                    onChange={(event) => setFrom(event.currentTarget.value)}
                />
            </Grid.Col>
            <Grid.Col span={6}>
                <TimeInput
                    label={"To"}
                    onChange={(event) => setTo(event.currentTarget.value)}
                />
            </Grid.Col>
        </Grid>
    )
}