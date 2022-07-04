import React, {useRef, memo} from "react";
import {useTranslation} from "react-i18next";
import {Divider, TextInput, Tooltip, useMantineTheme} from "@mantine/core";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ClearIcon from "@mui/icons-material/Clear";
import DragHandleIcon from "@mui/icons-material/DragHandle";

import {useAppDispatch} from "../../../state/stateHooks";
import {setSelectedCommand} from "../../../state/computerUISlice";
import {removeCommand, setCommandReference, setCommandType} from "../../../state/computerSlice";

import NonEmptyNumInput from "../../generic/NonEmptyNumInput";
import TooltipIconButton from "../../generic/TooltipIconButton";
import "./Command.scss";

enum CommandType {
    NOP = "NOP",
    INCREMENT = "+",
    DECREMENT = "-",
    JUMP = "j",
    IF_ZERO = "0",
    STOP = "Stop",
}

type CommandStruct = {
    id: number;
    type: CommandType;
    reference: number;
}


/** Commands that reference other commands **/
const COMMAND_ARGUMENT_COMMANDS = [CommandType.JUMP];
const REGISTER_COMMANDS = [CommandType.INCREMENT, CommandType.DECREMENT, CommandType.IF_ZERO];
const ARGUMENTLESS_COMMANDS = [CommandType.NOP, CommandType.STOP];

type Props = {
    key: string;
    line: number;
    lineDigits: number;
    maxVal: number;
    valDigits: number;
    command: CommandStruct;
    selected: boolean;
    current: boolean;
}

function Command(props: Props) {
    const dispatch = useAppDispatch();

    const commandInputRef = useRef<HTMLInputElement>(null);
    const referenceInputRef = useRef<HTMLInputElement>(null);
    const theme = useMantineTheme();
    const {t} = useTranslation();

    return (
        <div className="Command" onClick={() => dispatch(setSelectedCommand(props.command.id))}
             style={{...(props.selected ? {backgroundColor: theme.colors[theme.primaryColor][2]} : {}),
                     ["--line_number_min_width" as any]: `${props.lineDigits + 2.5}ch`}}>
            <DragHandleIcon className={"DragHandle"} fontSize={"medium"}/>
            <div className="LineNumber">
                {props.current ? <ArrowForwardIcon fontSize={"medium"} className={"LineArrow"}/> : props.line}
            </div>
            <Divider className="Divider" orientation="vertical"/>
            <Tooltip label={t("Command.Command.Tooltip")} position="top" withArrow>
                <TextInput className="CommandInput"
                           aria-label={t("Command.Command.AriaLabel")}
                           value={props.command.type}
                           ref={commandInputRef}
                           onInput={(evt) => {
                                switch ((evt.nativeEvent as InputEvent).data?.toLowerCase()) {
                                    case "n":
                                        dispatch(setCommandType({"id": props.command.id, "commandType": CommandType.NOP}));
                                        break;
                                    case "+":
                                        setTimeout(() => {
                                            referenceInputRef.current?.select();
                                        }, 0);
                                        dispatch(setCommandType({"id": props.command.id, "commandType": CommandType.INCREMENT}));
                                        break;
                                    case "-":
                                        setTimeout(() => {
                                            referenceInputRef.current?.select();
                                        }, 0);
                                        dispatch(setCommandType({"id": props.command.id, "commandType": CommandType.DECREMENT}));
                                        break;
                                    case "j":
                                        setTimeout(() => {
                                            referenceInputRef.current?.select();
                                        }, 0);
                                        dispatch(setCommandType({"id": props.command.id, "commandType": CommandType.JUMP}));
                                        break;
                                    case "0":
                                        setTimeout(() => {
                                            referenceInputRef.current?.select();
                                        }, 0);
                                        dispatch(setCommandType({"id": props.command.id, "commandType": CommandType.IF_ZERO}));
                                        break;
                                    case "s":
                                        dispatch(setCommandType({"id": props.command.id, "commandType": CommandType.STOP}));
                                        break;
                                }
                           }}/>
            </Tooltip>
            <Tooltip label={t("Command.Target.Tooltip")} position="top" withArrow>
                <NonEmptyNumInput className="RegisterSelect"
                                  ariaLabel={t("Command.Target.AriaLabel")}
                                  current={props.command.reference || 0}
                                  min={0}
                                  max={props.maxVal - 1}
                                  width={`${6 + props.valDigits}ch`}
                                  ref={referenceInputRef}
                                  update={(register: number) => dispatch(setCommandReference(
                                      {id: props.command.id, ref: register}))}
                                  disabled={ARGUMENTLESS_COMMANDS.includes(props.command.type)}/>
            </Tooltip>

            <TooltipIconButton icon={{className: "RemoveButton"}}
                               ariaLabel={t("Command.Delete.AriaLabel")}
                               hoverText={t("Command.Delete.Tooltip")}
                               color={"pink"}
                               size={"lg"}
                               position={"right"}
                               onClick={() => dispatch(removeCommand(props.command.id))}>
                <ClearIcon fontSize={"medium"}/>
            </TooltipIconButton>
        </div>
    );
}

export default memo(Command);
export type {CommandStruct};
export {CommandType, COMMAND_ARGUMENT_COMMANDS, ARGUMENTLESS_COMMANDS, REGISTER_COMMANDS};