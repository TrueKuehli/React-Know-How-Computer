import React, {useRef, memo} from 'react';
import {Divider, TextInput, Tooltip, useMantineTheme} from "@mantine/core";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ClearIcon from '@mui/icons-material/Clear';
import DragHandleIcon from '@mui/icons-material/DragHandle';

import NonEmptyNumInput from "./NonEmptyNumInput";
import TooltipIconButton from "./TooltipIconButton";
import './Command.scss';

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
    updateCommand: (index: number, command: CommandType, register: number) => void;
    removeCommand: (index: number) => void;
    onClick: (index: number) => void;
}

function Command(props: Props) {
    const ref = useRef<HTMLInputElement>(null);
    const theme = useMantineTheme();

    return (
        <div className="Command" onClick={() => props.onClick(props.line)}
             style={{...(props.selected ? {backgroundColor: theme.colors[theme.primaryColor][2]} : {}),
                     ["--line_number_min_width" as any]: `${props.lineDigits + 2.5}ch`}}>
            <DragHandleIcon className={"DragHandle"} fontSize={"medium"}/>
            <div className="LineNumber">
                {props.current ? <ArrowForwardIcon fontSize={"medium"} className={"LineArrow"}/> : props.line}
            </div>
            <Divider className="Divider" orientation="vertical"/>
            <Tooltip label={"Command"} position="top" withArrow>
                <TextInput className="CommandInput"
                           aria-label={"Command"}
                           value={props.command.type}
                           ref={ref}
                           onInput={(evt) => {
                                switch ((evt.nativeEvent as InputEvent).data?.toLowerCase()) {
                                    case "n":
                                        props.updateCommand(props.line, CommandType.NOP, props.command.reference);
                                        break;
                                    case "+":
                                        props.updateCommand(props.line, CommandType.INCREMENT, props.command.reference);
                                        break;
                                    case "-":
                                        props.updateCommand(props.line, CommandType.DECREMENT, props.command.reference);
                                        break;
                                    case "j":
                                        props.updateCommand(props.line, CommandType.JUMP, props.command.reference);
                                        break;
                                    case "0":
                                        props.updateCommand(props.line, CommandType.IF_ZERO, props.command.reference);
                                        break;
                                    case "s":
                                        props.updateCommand(props.line, CommandType.STOP, props.command.reference);
                                        break;
                                }
                           }}/>
            </Tooltip>
            <Tooltip label={"Target"} position="top" withArrow>
                <NonEmptyNumInput className="RegisterSelect"
                                  ariaLabel={"Register or command reference"}
                                  current={props.command.reference || 0}
                                  min={0}
                                  max={props.maxVal - 1}
                                  width={`${6 + props.valDigits}ch`}
                                  update={(register: number) => props.updateCommand(props.line, props.command.type, register)}
                                  disabled={ARGUMENTLESS_COMMANDS.includes(props.command.type)}/>
            </Tooltip>

            <TooltipIconButton className={"RemoveButton"}
                               ariaLabel={"Delete command"}
                               hoverText={"Delete command"}
                               color={"pink"}
                               size={"lg"}
                               position={"right"}
                               onClick={() => props.removeCommand(props.command.id)}>
                <ClearIcon fontSize={"medium"}/>
            </TooltipIconButton>
        </div>
    );
}

export default memo(Command);
export type {CommandStruct};
export {CommandType, COMMAND_ARGUMENT_COMMANDS, ARGUMENTLESS_COMMANDS, REGISTER_COMMANDS};