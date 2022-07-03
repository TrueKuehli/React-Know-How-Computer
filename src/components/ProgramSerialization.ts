import {COMMAND_ARGUMENT_COMMANDS, REGISTER_COMMANDS, CommandStruct, CommandType} from "./Command";

function serializeProgram(commands: CommandStruct[], registers: number[], name: string,
                          serializeRegisters: boolean): {name: string, code: string} {
    let indexOfLastNonNOP = commands.slice().reverse().findIndex(command => command.type !== "NOP");
    indexOfLastNonNOP = indexOfLastNonNOP === -1 ? commands.length - 1 : indexOfLastNonNOP;
    indexOfLastNonNOP = commands.length - 1 - indexOfLastNonNOP;

    const lastCommandReference = commands.reduce((max, command) =>
        Math.max(max, COMMAND_ARGUMENT_COMMANDS.includes(command.type) ? command.reference : 0), 0);

    const processedCommands = commands.slice(0, Math.max(0, indexOfLastNonNOP, lastCommandReference) + 1)
        .map((command) => {
            return {
                type: command.type,
                reference: command.reference,
            }
        });

    if (serializeRegisters) {
        let indexOfLastNonZero = registers.slice().reverse().findIndex(register => register !== 0);
        indexOfLastNonZero = indexOfLastNonZero === -1 ? registers.length - 1 : indexOfLastNonZero;
        indexOfLastNonZero = commands.length - 1 - indexOfLastNonZero;

        const lastRegisterReference = commands.reduce((max, command) =>
            Math.max(max, REGISTER_COMMANDS.includes(command.type) ? command.reference : 0), 0);

        const processedRegisters = registers.slice(0, Math.max(0, indexOfLastNonZero, lastRegisterReference) + 1)

        return {
            name,
            code: JSON.stringify({
                commands: processedCommands,
                registers: processedRegisters,
            }),
        };
    }

    return {
        name,
        code: JSON.stringify({
            commands: processedCommands,
        }),
    };
}

function deserializeProgram(fileContent: string): [CommandStruct[], number[]] | string {
    const program: {commands: CommandStruct[], registers: number[] | undefined} = JSON.parse(fileContent);

    // Determine if read json program is valid
    if (typeof(program) !== "object" || !program.commands) {
        return "No commands found in file.";
    }

    let error = "";
    // Check if commands are properly formatted
    if (!program.commands.every((command, idx) => {
        // Check types
        if (typeof(command) !== "object"
                || !Object.values(CommandType).includes(command.type)
                || typeof(command.reference) !== "number")
        {
            error = `Command ${idx} is not properly formatted.`;
            return false;
        }

        // Check if reference is in range
        if (command.reference < 0
            || (COMMAND_ARGUMENT_COMMANDS.includes(command.type) && command.reference >= program.commands.length))
        {
            error = `Command ${idx} is referencing a non-existent command.`;
            return false;
        }

        return true;
    }))
    {
        return error;
    }

    // Check if registers are properly formatted
    if (program.registers && !program.registers.every(register => typeof(register) === "number")) {
        return "Non-numeric register found.";
    }

    // Check if register references are in range. Otherwise, regenerate registers
    const maxRegisterReference = program.commands.reduce((max, command) =>
        Math.max(max, REGISTER_COMMANDS.includes(command.type) ? command.reference : 0), 0);
    if (!program.registers) {
        program.registers = new Array(maxRegisterReference + 1).fill(0);
    } else if (program.registers.length < maxRegisterReference + 1) {
        program.registers = [...program.registers,
                             ...new Array(maxRegisterReference + 1 - program.registers.length).fill(0)];
    }

    // Regenerate command IDs
    program.commands = program.commands.map((command, idx) => {return {...command, id: idx}});

    return [
        program.commands,
        program.registers || Array(maxRegisterReference + 1).fill(0),
    ];
}

export {serializeProgram, deserializeProgram};