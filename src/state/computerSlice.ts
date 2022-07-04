import {createSlice, Draft, PayloadAction} from "@reduxjs/toolkit";

import {COMMAND_ARGUMENT_COMMANDS, CommandStruct,
        CommandType, REGISTER_COMMANDS} from "../components/Computer/CodeField/Command";


const INITIAL_COMMAND_AMT = 10;
const INITIAL_REGISTER_AMT = 10;

type State = ReturnType<typeof computerSlice.getInitialState>;

/**
 * Limits the value of a reference depending on the command type
 * @param state The state to adjust
 * @param index The index of the command to adjust
 */
function constrainReference(state: Draft<State>, index: number) {
    if (COMMAND_ARGUMENT_COMMANDS.includes(state.commands[index].type)) {
        state.commands[index].reference = Math.min(state.commands[index].reference, state.commands.length - 1);
    } else if (REGISTER_COMMANDS.includes(state.commands[index].type)) {
        state.commands[index].reference = Math.min(state.commands[index].reference, state.registers.length - 1);
    } else {
        state.commands[index].reference = 0;
    }
}

/**
 * Readjusts references after removing a command or register
 * @param state The state to adjust
 * @param commandTypes The types of commands to adjust
 * @param idx The index of the removed command
 */
function readjustReferences(state: Draft<State>, commandTypes: CommandType[], idx: number) {
    for (let i = 0; i < state.commands.length; i++) {
        if (commandTypes.includes(state.commands[i].type)) {
            state.commands[i].reference = state.commands[i].reference === idx ?
                0 : state.commands[i].reference > idx ?
                    state.commands[i].reference - 1 : state.commands[i].reference;
        }
    }
}



export const computerSlice = createSlice({
    name: "computer",
    initialState: {
        running: false,
        pc: 0,
        speed: 1,
        commands: Array(INITIAL_COMMAND_AMT).fill(null)
            .map<CommandStruct>((_, idx) => {return {id: idx, type: CommandType.NOP, reference: 0}}),
        registers: Array<number>(INITIAL_REGISTER_AMT).fill(0),
        nextCommandID: INITIAL_COMMAND_AMT,
    },
    reducers: {
        start: (state) => {
            state.running = true;
        },
        stop: (state) => {
            state.running = false;
        },
        toggleRunning: (state) => {
            state.running = !state.running;
        },
        incrementPC: (state) => {
            state.pc++;
        },
        setPC: (state, action: PayloadAction<number>) => {
            state.pc = action.payload;
        },
        setSpeed: (state, action: PayloadAction<number>) => {
            state.speed = action.payload;
        },
        setCommands: (state, action: PayloadAction<CommandStruct[]>) => {
            state.commands = action.payload;
            state.nextCommandID = action.payload.reduce(
                (max: number, command) => Math.max(max, command.id), 0) + 1 ;
        },
        setCommand: (state, action: PayloadAction<{id: number, command: CommandStruct}>) => {
            const index = state.commands.findIndex(c => c.id === action.payload.id);
            if (index === -1) return;

            state.commands[index].type = action.payload.command.type;
            state.commands[index].reference = action.payload.command.reference;
            constrainReference(state, index);
        },
        setCommandType: (state, action: PayloadAction<{id: number, commandType: CommandType}>) => {
            const index = state.commands.findIndex(c => c.id === action.payload.id);
            if (index === -1) return;

            state.commands[index].type = action.payload.commandType;
            constrainReference(state, index);
        },
        setCommandReference: (state, action: PayloadAction<{id: number, ref: number}>) => {
            const index = state.commands.findIndex(c => c.id === action.payload.id);
            if (index === -1) return;

            state.commands[index].reference = action.payload.ref;
            constrainReference(state, index);
        },
        setCommandRegister: (state, action: PayloadAction<{id: number, ref: number}>) => {
            const index = state.commands.findIndex(c => c.id === action.payload.id);
            if (index === -1) return;

            if (REGISTER_COMMANDS.includes(state.commands[index].type)) {
                state.commands[index].reference = action.payload.ref;
                constrainReference(state, index);
            }
        },
        addCommand: (state) => {
            state.commands.push({id: state.nextCommandID++, type: CommandType.NOP, reference: 0});
        },
        removeCommand: (state, action: PayloadAction<number>) => {
            const index = state.commands.findIndex(c => c.id === action.payload);
            if (index === -1) return;
            if (state.commands.length < 2) return;

            state.commands.splice(index, 1);

            // Update references >= the removed command
            readjustReferences(state, COMMAND_ARGUMENT_COMMANDS, index);
        },
        setRegisters: (state, action: PayloadAction<number[]>) => {
            state.registers = action.payload;
        },
        setRegister: (state, action: PayloadAction<{id: number, value: number}>) => {
            state.registers[action.payload.id] = action.payload.value;
        },
        addRegister: (state) => {
            state.registers.push(0);
        },
        removeRegister: (state, action: PayloadAction<number>) => {
            if (state.registers.length < 2) return;

            state.registers.splice(action.payload, 1);

            // Update references >= the removed register
            readjustReferences(state, REGISTER_COMMANDS, action.payload);
        },
        incrementRegister: (state, action: PayloadAction<number>) => {
            state.registers[action.payload]++;
        },
        decrementRegister: (state, action: PayloadAction<number>) => {
            state.registers[action.payload]--;
        },
        executeCells: (state, action: PayloadAction<number>) => {
            for (let i = 0; i < action.payload; i++) {
                const currentCommand = state.commands[state.pc];
                if (currentCommand === undefined) {
                    state.pc = 0;
                    state.running = false;
                    return;
                }

                switch (currentCommand.type) {
                    case CommandType.NOP:
                        state.pc++;
                        break;
                    case CommandType.INCREMENT:
                        state.registers[currentCommand.reference]++;
                        state.pc++;
                        break;
                    case CommandType.DECREMENT:
                        state.registers[currentCommand.reference]--;
                        state.pc++;
                        break;
                    case CommandType.JUMP:
                        state.pc = currentCommand.reference;
                        break;
                    case CommandType.IF_ZERO:
                        if (state.registers[currentCommand.reference] === 0) {
                            state.pc += 2;
                        } else {
                            state.pc++;
                        }
                        break;
                    case CommandType.STOP:
                        state.running = false;
                        return;
                }

                if (state.pc >= state.commands.length) {
                    state.pc = 0;
                    state.running = false;
                    return;
                }
            }
        }
    },
});



// Action creators are generated for each case reducer function
export const {start, stop, toggleRunning, incrementPC, setPC, setSpeed, setCommands, setCommand, setCommandType,
              setCommandReference, setCommandRegister, addCommand, removeCommand, setRegisters, setRegister,
              addRegister, removeRegister, incrementRegister, decrementRegister, executeCells} = computerSlice.actions;

export default computerSlice.reducer
