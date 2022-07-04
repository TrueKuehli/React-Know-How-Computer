import React, {useRef} from "react";
import {NumberInput} from "@mantine/core";


type Props = {
    className?: string;
    ariaLabel: string;
    current: number;
    min?: number;
    max?: number;
    update: (value: number) => void;
    onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
    width?: number | string;
    disabled?: boolean;
}

const NonEmptyNumInput = React.forwardRef((props: Props, ref) => {
    const _ref = useRef<HTMLInputElement>(null);

    return (
        <NumberInput
            className={props.className}
            aria-label={props.ariaLabel}
            value={props.current}
            onClick={props.onClick}
            onChange={(val) => {
                if (val === undefined) {
                    props.update(0);

                    // Need to give the browser some time before changing the value again.
                    setTimeout(() => {
                        if ((ref as React.MutableRefObject<HTMLInputElement> || _ref).current !== null) {
                            // @ts-ignore Does not detect that the value of current is checked above
                            (ref as React.MutableRefObject<HTMLInputElement> || _ref).current.value = "0";
                        }
                    })
                } else {
                    props.update(val);
                }
            }}
            onFocus={(e) => {
                e.currentTarget.select();
            }}
            max={props.max}
            min={props.min}
            step={1}
            styles={{ input: { width: props.width } }}
            ref={ref as React.MutableRefObject<HTMLInputElement> || _ref}
            disabled={props.disabled}
        />
    );
});

export default NonEmptyNumInput;
