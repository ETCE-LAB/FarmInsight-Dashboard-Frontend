import {Stack, TextInput} from "@mantine/core"
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";


interface CustomInputProps {
    label: string,
    placeholder?: string,
    required?: boolean,
    value: string,
    onChange: (value: string) => void,
    description?: string,
}

export const MultiLanguageInput: React.FC<CustomInputProps> = ({label, placeholder, required, value, onChange, description}) => {
    const { t } = useTranslation();
    const [engValue, setEngValue] = useState<string>();
    const [gerValue, setGerValue] = useState<string>();

    useEffect(() => {
        if (value) {
            const split = value.split(';');
            setEngValue(split[0]);
            if (split.length > 1) {
                setGerValue(split[1]);
            }
        }
    }, [value]);

    const onInputChanged = (val: string, lang: string) => {
        // english is the default so that's always gotta be set, but an empty german value shouldn't be sent out
        // cause then it would display nothing instead of falling back to english in utils.getBackendTranslation()
        let result: string;
        if (lang === 'en') {
            if (gerValue) {
                result = `${val};${gerValue}`;
            } else {
                result = `${val}`;
            }
        } else {
            if (val !== '') {
                result = `${engValue};${val}`;
            } else {
                result = `${engValue}`;
            }
        }
        onChange(result);
    }

    return (
        <Stack>
            <TextInput
                label={label}
                placeholder={placeholder}
                required={required !== undefined ? required : false}
                value={engValue}
                onChange={(e) => {onInputChanged(e.currentTarget.value, 'en');}}
                description={`${description || ''} ${t('common.inEnglish')}`}
            />
            <TextInput
                placeholder={placeholder}
                required={false}
                value={gerValue}
                onChange={(e) => {onInputChanged(e.currentTarget.value, 'de');}}
                description={`${description || ''} ${t('common.inGerman')}`}
            />
        </Stack>
    )
}