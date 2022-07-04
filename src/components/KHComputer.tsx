import React, {useCallback, useRef, useState} from 'react';
import {flushSync} from "react-dom";
import {ActionIcon, Divider, MantineProvider, MediaQuery, Text, Tooltip} from '@mantine/core';
import {useMediaQuery} from '@mantine/hooks';
import {ReactSortable} from "react-sortablejs";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrow from '@mui/icons-material/PlayArrow';
import RotateLeft from '@mui/icons-material/RotateLeft';

import {digits10} from "../util/Math";
import TooltipButton from './TooltipButton';
import TooltipIconButton from './TooltipIconButton';
import NonEmptyNumInput from "./NonEmptyNumInput";
import SpeedSelector from "./SpeedSelector";
import SaveProgram from "./SaveProgram";
import Register from "./Register";
import Command, {ARGUMENTLESS_COMMANDS, COMMAND_ARGUMENT_COMMANDS, CommandStruct, CommandType} from "./Command";
import {deserializeProgram, serializeProgram} from "./ProgramSerialization";
import './KHComputer.scss';
import About from './About';
import {useTranslation} from "react-i18next";
import LanguageSelector from './LanguageSelector';

const INITIAL_COMMAND_AMT = 10;
const INITIAL_REGISTER_AMT = 10;

/**
 * Main app component
 */
function KHComputer() {
    const [running, setRunning] = useState(false);
    let [pc, setPC] = useState(0);
    const [speed, setSpeed] = useState(1);
    const [selectedCommand, setSelectedCommand] = useState(0);
    const [commands, setCommands] = useState(Array<CommandStruct | null>(INITIAL_COMMAND_AMT).fill(null)
        .map<CommandStruct>((_, idx) => {return {id: idx, type: CommandType.NOP, reference: 0}}));
    const [registers, setRegisters] = useState(Array<number>(INITIAL_REGISTER_AMT).fill(0));
    const [nextID, setNextID] = useState(INITIAL_COMMAND_AMT);

    const addCommandRef = useRef<HTMLDivElement>(null);
    const addRegisterRef = useRef<HTMLDivElement>(null);

    const smallScreen = useMediaQuery('(max-width: 500px)');
    const {t} = useTranslation();


    // Memoized callbacks to prevent updating each command when it's not necessary
    // UI Functions
    const updateCommand = useCallback((index: number, type: CommandType, register: number) => {
        setCommands((prevState) => {
            if (ARGUMENTLESS_COMMANDS.includes(type)) {
                register = 0;
            } else if (COMMAND_ARGUMENT_COMMANDS.includes(type)) {
                if (register >= prevState.length) register = prevState.length - 1;
            } else {
                if (register >= registers.length) register = registers.length - 1;
            }

            return [
                ...prevState.slice(0, index),
                {type, reference: register, id: prevState[index].id},
                ...prevState.slice(index + 1)
            ]
        });
    }, [setCommands, registers.length]);

    const setCurrentCommandType = useCallback((commandType: CommandType) => {
        setCommands((prevState) => {
            let register = prevState[selectedCommand].reference;
            if (ARGUMENTLESS_COMMANDS.includes(commandType)) {
                register = 0;
            } else if (COMMAND_ARGUMENT_COMMANDS.includes(commandType)) {
                if (register >= prevState.length) register = prevState.length - 1;
            } else {
                if (register >= registers.length) register = registers.length - 1;
            }

            return [
                ...prevState.slice(0, selectedCommand),
                {...prevState[selectedCommand], type: commandType, reference: register},
                ...prevState.slice(selectedCommand + 1)
            ]
        });
    }, [selectedCommand, setCommands, registers.length]);

    const setCurrentCommandRegister = useCallback((register: number) => {
        setCommands((prevState) => {
            if (ARGUMENTLESS_COMMANDS.includes(prevState[selectedCommand].type)
                    || COMMAND_ARGUMENT_COMMANDS.includes(prevState[selectedCommand].type)) {
                return prevState;
            }

            return [
                ...prevState.slice(0, selectedCommand),
                {...prevState[selectedCommand], reference: register},
                ...prevState.slice(selectedCommand + 1)
            ]
        });
    }, [selectedCommand, setCommands]);

    const removeCommand = useCallback((index: number) => {
        setCommands((prevState) => {
            if (prevState.length === 1) return prevState;

            const listIndex = prevState.findIndex((command) => command?.id === index);
            return [
                ...prevState.slice(0, listIndex),
                ...prevState.slice(listIndex + 1)
            ]
        });
    }, [setCommands]);

    const addCommand = useCallback(() => {
        setCommands((prevState) => {
            return [
                ...prevState,
                {id: nextID, type: CommandType.NOP, reference: 0}
            ];
        });
        setNextID(nextID + 1);
        setTimeout(() => addCommandRef.current?.scrollIntoView({behavior: 'smooth'}));
    }, [setCommands, nextID, setNextID, addCommandRef]);

    const updateRegister = useCallback((index: number, value: number) => {
        setRegisters((prevState) => {
            return [
                ...prevState.slice(0, index),
                value,
                ...prevState.slice(index + 1)
            ]
        });
    }, [setRegisters]);

    const removeRegister = useCallback((index: number) => {
        setRegisters((prevState) => {
            if (prevState.length === 1) return prevState;

            return [
                ...prevState.slice(0, index),
                ...prevState.slice(index + 1)
            ]
        });
    }, [setRegisters]);

    const addRegister = useCallback(() => {
        setRegisters((prevState) => {
            return [
                ...prevState,
                0
            ];
        });
        setTimeout(() => addRegisterRef.current?.scrollIntoView({behavior: 'smooth'}));
    }, [setRegisters, addRegisterRef]);


    // Program execution
    const executeCurrentCell: (executePC: number, registerContent: number[]) => [number, number[], boolean]
        = useCallback((executePC: number, registerContent: number[]) =>
    {
        let isRunning = true;

        const currentCommand = commands[executePC];
        if (currentCommand === undefined) {
            executePC = 0;
            return [executePC, registerContent, false];
        }

        switch (currentCommand.type) {
            case CommandType.NOP:
                executePC++;
                break;
            case CommandType.INCREMENT:
                registerContent[currentCommand.reference]++;
                executePC++;
                break;
            case CommandType.DECREMENT:
                registerContent[currentCommand.reference]--;
                executePC++;
                break;
            case CommandType.JUMP:
                executePC = currentCommand.reference;
                break;
            case CommandType.IF_ZERO:
                if (registerContent[currentCommand.reference] === 0) {
                    executePC += 2;
                } else {
                    executePC++;
                }
                break;
            case CommandType.STOP:
                isRunning = false;
                break;
        }

        if (executePC > commands.length - 1) {
            executePC = 0;
            isRunning = false;
        }

        return [executePC, registerContent, isRunning];
    }, [commands]);

    const lastAnimationFrame = useRef<number>(performance.now());
    const animationRequestRef = useRef<number>();
    const animate = useCallback((time: DOMHighResTimeStamp) => {
        if (running) {
            if (time - lastAnimationFrame.current > 1000 / speed) {
                const commandsToRun = Math.floor((time - lastAnimationFrame.current) / (1000 / speed));
                lastAnimationFrame.current = lastAnimationFrame.current + commandsToRun * (1000 / speed);

                let localPC = pc;
                let localRegisters = [...registers];
                let localRunning = true;

                for (let i = 0; i < commandsToRun; i++) {
                    [localPC, localRegisters, localRunning] = executeCurrentCell(localPC, localRegisters);

                    if (!localRunning || pc >= commands.length) {
                        localRunning = false;
                        break;
                    }
                }

                flushSync(() => {
                    setRunning(running && localRunning);
                    setPC(localPC);
                    setRegisters(localRegisters);
                });
            }
        }

        animationRequestRef.current = requestAnimationFrame(animate);
    }, [commands.length, registers, pc, running, speed, executeCurrentCell]);

    React.useEffect(() => {
        animationRequestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationRequestRef.current || 0);
    }, [animate]);

    // Main Component render
    return (
        <div className="KHComputer">
            <div className="CommandPalette">
                <MantineProvider
                    theme={{
                        colorScheme: 'light',
                        primaryColor: 'indigo',
                        primaryShade: 9,
                    }}
                >
                    <div className={"Gap"}/> {/* For center aligning */}
                    <TooltipButton command={"NOP"} hover_text={t("Commands.NOP.Tooltip")}
                                   ariaLabel={t("Commands.NOP.AriaLabel")}
                                   size={smallScreen ? "lg" : "xl"}
                                   onClick={setCurrentCommandType.bind(undefined, CommandType.NOP)}/>
                    <TooltipButton command={"+"} hover_text={t("Commands.+.Tooltip")}
                                   ariaLabel={t("Commands.+.AriaLabel")}
                                   size={smallScreen ? "lg" : "xl"}
                                   onClick={setCurrentCommandType.bind(undefined, CommandType.INCREMENT)}/>
                    <TooltipButton command={"-"} hover_text={t("Commands.-.Tooltip")}
                                   ariaLabel={t("Commands.-.AriaLabel")}
                                   size={smallScreen ? "lg" : "xl"}
                                   onClick={setCurrentCommandType.bind(undefined, CommandType.DECREMENT)}/>
                    <TooltipButton command={"j"} hover_text={t("Commands.j.Tooltip")}
                                   ariaLabel={t("Commands.j.AriaLabel")}
                                   size={smallScreen ? "lg" : "xl"}
                                   onClick={setCurrentCommandType.bind(undefined, CommandType.JUMP)}/>
                    <TooltipButton command={"0"} hover_text={t("Commands.0.Tooltip")}
                                   ariaLabel={t("Commands.0.AriaLabel")}
                                   size={smallScreen ? "lg" : "xl"}
                                   onClick={setCurrentCommandType.bind(undefined, CommandType.IF_ZERO)}/>
                    <TooltipButton command={"Stop"} hover_text={t("Commands.Stop.Tooltip")}
                                   ariaLabel={t("Commands.Stop.AriaLabel")}
                                   size={smallScreen ? "lg" : "xl"}
                                   onClick={setCurrentCommandType.bind(undefined, CommandType.STOP)}/>
                </MantineProvider>
                <LanguageSelector buttonSize={smallScreen ? "lg" : "xl"}/>
                <About buttonSize={smallScreen ? "lg" : "xl"}/>
            </div>
            <div className={"Computer"}>
                <div className={"Gap"}></div>

                <div className="CodeField">
                    <Text size="xl" className="CommandsHeader" color="white" weight="bold">
                        {t("CommandBox.Title")}
                    </Text>
                    <ReactSortable handle={".DragHandle"}
                                   list={commands}
                                   setList={setCommands}>
                        {
                            commands.map((command, index) => {
                                return (
                                    <Command key={command.id.toString()}
                                             line={index}
                                             lineDigits={digits10(commands.length)}
                                             maxVal={COMMAND_ARGUMENT_COMMANDS.includes(command.type) ?
                                                 commands.length :
                                                 registers.length}
                                             valDigits={digits10(Math.max(commands.length, registers.length))}
                                             command={command}
                                             selected={selectedCommand === command.id}
                                             current={pc === index}
                                             updateCommand={updateCommand}
                                             removeCommand={removeCommand}
                                             onClick={setSelectedCommand}/>
                                );
                            })
                        }
                    </ReactSortable>
                    <div className="ItemAdd" ref={addCommandRef} onClick={addCommand}>
                        <ActionIcon size={"xl"} className={"CommandAddIcon"} variant={"transparent"}
                                    aria-label={t("CommandBox.AddCommand.AriaLabel")}>
                            <AddCircleIcon fontSize="large" />
                        </ActionIcon>
                    </div>
                </div>

                <div className={"Gap"}></div>

                <div className="RegisterField">
                    <Text size="xl" className="RegistersHeader" color="white" weight="bold">
                        {t("RegisterBox.Title")}
                    </Text>
                    {
                        registers.map((register, index) => {
                            return (
                                <Register key={index.toString()}
                                          index={index}
                                          indexDigits={digits10(registers.length)}
                                          maxDigits={digits10(Math.max(...registers))}
                                          value={register}
                                          removeRegister={removeRegister}
                                          updateValue={updateRegister}
                                          onClick={setCurrentCommandRegister}/>
                            );
                        })
                    }
                    <div className="ItemAdd" ref={addRegisterRef} onClick={addRegister}>
                        <ActionIcon size={"xl"} className={"CommandAddIcon"} variant={"transparent"}
                                    aria-label={t("RegisterBox.AddRegister.AriaLabel")}>
                            <AddCircleIcon fontSize="large" />
                        </ActionIcon>
                    </div>
                </div>

                <div className={"Gap"}></div>
            </div>
            <div className="ActionsPalette">
                <MediaQuery
                    query="(max-width: 500px)"
                    styles={{ display: "none" }}
                >
                    <Text size={smallScreen ? "lg" : "xl"} className="ProgramCounterText" color="white" weight="bold">
                        {t("ActionsPalette.PC.Label")}:
                    </Text>
                </MediaQuery>
                <Tooltip label={t("ActionsPalette.PC.Tooltip")} position={"top"} withArrow>
                    <NonEmptyNumInput className="ProgramCounter"
                                      ariaLabel={t("ActionsPalette.PC.AriaLabel")}
                                      current={pc}
                                      min={0}
                                      max={Math.max(commands.length - 1, 0)}
                                      width={`${6 + digits10(commands.length)}ch`}
                                      update={(pc: number) => setPC(pc)}/>
                </Tooltip>
                <Divider orientation="vertical" className={"Divider"}/>
                <TooltipIconButton icon={{className: "ActionButton"}}
                                   color={"primary"}
                                   size={smallScreen ? "lg" : "xl"}
                                   hoverText={running ? t("ActionsPalette.Pause.Tooltip")
                                                      : t("ActionsPalette.Start.Tooltip")}
                                   ariaLabel={running ? t("ActionsPalette.Pause.AriaLabel")
                                                      : t("ActionsPalette.Start.AriaLabel")}
                                   onClick={() => {
                                       setRunning(!running)

                                       lastAnimationFrame.current = performance.now();
                                   }}>
                    {running ? <PauseIcon fontSize="large"/>
                             : <PlayArrow fontSize="large" />}
                </TooltipIconButton>
                <TooltipIconButton icon={{className: "ActionButton"}}
                                   color={"primary"}
                                   size={smallScreen ? "lg" : "xl"}
                                   hoverText={t("ActionsPalette.Step.Tooltip")}
                                   ariaLabel={t("ActionsPalette.Step.AriaLabel")}
                                   onClick={() => {
                                       const [endPC, registerContent, isRunning] = executeCurrentCell(pc, registers);
                                       flushSync(() => {
                                           setRunning(running && isRunning);
                                           setPC(endPC);
                                           setRegisters(registerContent);
                                       });
                                   }}>
                    <ArrowForwardIcon fontSize="large" />
                </TooltipIconButton>
                <TooltipIconButton icon={{className: "ActionButton"}}
                                   color={"primary"}
                                   size={smallScreen ? "lg" : "xl"}
                                   hoverText={t("ActionsPalette.ResetPC.Tooltip")}
                                   ariaLabel={t("ActionsPalette.ResetPC.AriaLabel")}
                                   onClick={() => setPC(0)}>
                    <RotateLeft fontSize="large" />
                </TooltipIconButton>
                <MediaQuery
                    query="(max-width: 800px)"
                    styles={{ display: "none" }}
                >
                    <Divider orientation="vertical" />
                </MediaQuery>
                <SpeedSelector speed={speed} setSpeed={setSpeed} buttonClass={"ActionButton"}
                               buttonSize={smallScreen ? "lg" : "xl"}/>
                <Divider orientation="vertical" className={"Divider"}/>
                <SaveProgram buttonSize={smallScreen ? "lg" : "xl"}
                             serializationFunction={serializeProgram.bind(null, commands, registers)}
                             deserializationFunction={deserializeProgram}
                             setCommands={(commands) => {setCommands(commands); setNextID(commands.length);}}
                             setRegisters={setRegisters}
                             setPC={setPC}/>
            </div>
        </div>
    );
}

export default KHComputer;