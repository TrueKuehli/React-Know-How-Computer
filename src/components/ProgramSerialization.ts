import {COMMAND_ARGUMENT_COMMANDS, REGISTER_COMMANDS, CommandStruct, CommandType} from "./Command";
import i18next from 'i18next';

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
    let program: {commands: CommandStruct[], registers: number[] | undefined};
    try {
        program = JSON.parse(fileContent);
    } catch (e) {
        return i18next.t("Error.InvalidJSON");
    }

    // Determine if read json program is valid
    if (typeof(program) !== "object" || !program.commands) {
        return i18next.t("Error.NoCommands");
    }

    let error = "";
    // Check if commands are properly formatted
    if (!program.commands.every((command, idx) => {
        // Check types
        // noinspection SuspiciousTypeOfGuard
        if (typeof(command) !== "object"
                || !Object.values(CommandType).includes(command.type)
                || typeof(command.reference) !== "number")
        {
            error = i18next.t("Error.IncorrectFormatting", {line: idx});
            return false;
        }

        // Check if reference is in range
        if (command.reference < 0
            || (COMMAND_ARGUMENT_COMMANDS.includes(command.type) && command.reference >= program.commands.length))
        {
            error = i18next.t("Error.InvalidCommandReference", {line: idx});
            return false;
        }

        return true;
    }))
    {
        return error;
    }

    // Check if registers are properly formatted
    // noinspection SuspiciousTypeOfGuard
    if (program.registers && !program.registers.every(register => typeof(register) === "number")) {
        return i18next.t("Error.NonNumericRegister");
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