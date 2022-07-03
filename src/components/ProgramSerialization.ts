import {COMMAND_ARGUMENT_COMMANDS, REGISTER_COMMANDS, CommandStruct} from "./Command";

function serializeProgram(commands: CommandStruct[], registers: number[], name: string,
                          serializeRegisters: boolean): {name: string, code: string} {
    let indexOfLastNonNOP = commands.slice().reverse().findIndex(command => command.type !== "NOP");
    indexOfLastNonNOP = indexOfLastNonNOP === -1 ? commands.length - 1 : indexOfLastNonNOP;
    indexOfLastNonNOP = commands.length - 1 - indexOfLastNonNOP;

    const lastCommandReference = commands.reduce((max, command) =>
        Math.max(max, COMMAND_ARGUMENT_COMMANDS.includes(command.type) ? command.reference : 0), 0);

    const processedCommands = commands.slice(0, Math.max(0, indexOfLastNonNOP, lastCommandReference) + 1)
        .map((command, idx) => {
            return {
                id: idx,
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

function deserializeProgram(fileContent: string): [CommandStruct[], number[]] {
    const program: {commands: CommandStruct[], registers: number[] | undefined} = JSON.parse(fileContent);
    const maxRegisterReference = program.commands.reduce((max, command) =>
        Math.max(max, REGISTER_COMMANDS.includes(command.type) ? command.reference : 0), 0);

    return [
        program.commands,
        program.registers || Array(maxRegisterReference + 1).fill(0),
    ];
}

export {serializeProgram, deserializeProgram};