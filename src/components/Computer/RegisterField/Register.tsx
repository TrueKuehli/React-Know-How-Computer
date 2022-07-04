import React, {memo} from "react";
import {Divider} from "@mantine/core";
import ClearIcon from "@mui/icons-material/Clear";
import {useTranslation} from "react-i18next";

import {useAppSelector, useAppDispatch} from "../../../state/stateHooks";
import {removeRegister, setCommandRegister, setRegister} from "../../../state/computerSlice";

import NonEmptyNumInput from "../../generic/NonEmptyNumInput";
import TooltipIconButton from "../../generic/TooltipIconButton";
import "./Register.scss";

type Props = {
    key: string;
    index: number;
    indexDigits: number;
    maxDigits: number;
    value: number;
}

function Register(props: Props) {
    const dispatch = useAppDispatch();
    const selectedCommand = useAppSelector((state) => state.computerUI.selectedCommand);

    const {t} = useTranslation();

    return (
        <div className="Register" style={{["--line_number_min_width" as any]: `${props.indexDigits + 2.5}ch`}}
             onClick={() => dispatch(setCommandRegister({"id": selectedCommand, "ref": props.index}))}
        >
            <div className="Index">
                {props.index}
            </div>
            <Divider className="Divider" orientation="vertical"/>
            <NonEmptyNumInput className="RegisterValue"
                              ariaLabel={t("Register.Value.AriaLabel")}
                              current={props.value}
                              width={`${6.5 + props.maxDigits}ch`}
                              onClick={(e: React.MouseEvent<HTMLInputElement>) => {e.preventDefault(); e.stopPropagation()}}
                              update={(value: number) => dispatch(setRegister({id: props.index, value}))}/>

            <TooltipIconButton icon={{className: "RemoveButton"}}
                               color={"pink"}
                               size={"lg"}
                               hoverText={t("Register.DeleteButton.Tooltip")}
                               ariaLabel={t("Register.DeleteButton.AriaLabel")}
                               position={"right"}
                               onClick={(e: React.MouseEvent) => {
                                   e.preventDefault(); e.stopPropagation();
                                   dispatch(removeRegister(props.index));
                               }}>
                <ClearIcon fontSize={"medium"}/>
            </TooltipIconButton>
        </div>
    );
}

export default memo(Register);