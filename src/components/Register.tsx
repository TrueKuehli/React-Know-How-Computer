import React, {memo} from 'react';
import {Divider} from "@mantine/core";
import ClearIcon from '@mui/icons-material/Clear';

import NonEmptyNumInput from "./NonEmptyNumInput";
import TooltipIconButton from "./TooltipIconButton";
import './Register.scss';

type Props = {
    key: string;
    index: number;
    indexDigits: number;
    maxDigits: number;
    value: number;
    removeRegister: (index: number) => void;
    updateValue: (index: number, value: number) => void;
    onClick: (index: number) => void;
}

function Register(props: Props) {
    return (
        <div className="Register" onClick={() => props.onClick(props.index)}
             style={{["--line_number_min_width" as any]: `${props.indexDigits + 2.5}ch`}}>
            <div className="Index">
                {props.index}
            </div>
            <Divider className="Divider" orientation="vertical"/>
            <NonEmptyNumInput className="RegisterValue"
                              ariaLabel={"Register value"}
                              current={props.value}
                              width={`${6.5 + props.maxDigits}ch`}
                              onClick={(e: React.MouseEvent<HTMLInputElement>) => {e.preventDefault(); e.stopPropagation()}}
                              update={(value: number) => { props.updateValue(props.index, value) }}/>

            <TooltipIconButton className={"RemoveButton"}
                               color={"pink"}
                               size={"lg"}
                               hoverText={"Delete register"}
                               ariaLabel={"Delete register"}
                               position={"right"}
                               onClick={(e: React.MouseEvent) => {
                                   e.preventDefault(); e.stopPropagation()
                                   props.removeRegister(props.index)
                               }}>
                <ClearIcon fontSize={"medium"}/>
            </TooltipIconButton>
        </div>
    );
}

export default memo(Register);