import React, {useRef} from 'react';
import {NumberInput} from '@mantine/core';


type Props = {
    className?: string;
    current: number;
    min?: number;
    max?: number;
    update: (value: number) => void;
    onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
    width?: number | string;
    disabled?: boolean;
}

function NonEmptyNumInput(props: Props) {
    const ref = useRef<HTMLInputElement>(null);
    return (
        <NumberInput
            className={props.className}
            value={props.current}
            onClick={props.onClick}
            onChange={(val) => {
                if (val === undefined) {
                    props.update(0);

                    // Need to give the browser some time before changing the value again.
                    setTimeout(() => {
                        if (ref.current) {
                            ref.current.value = "0";
                        }
                    })
                } else {
                    props.update(val);
                }
            }}
            max={props.max}
            min={props.min}
            step={1}
            styles={{ input: { width: props.width } }}
            ref={ref}
            disabled={props.disabled}
        />
    );
}

export default NonEmptyNumInput;
