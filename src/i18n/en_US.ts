const translation = {
    "<head>": {
        title: "Know-How Computer",
        description: "Web application simulating the Know-How Computer",
    },

    "About": {
        "Button": {
            "AriaLabel": "About",
            "HoverText": "About",
        },
        "Title": "About",
        "KnowHowComputerDescription": "The <1>Know-How Computer</1> (also known as the WDR paper computer) is a "
                                    + "teaching tool roughly based on <3>register machines</3>. This web application "
                                    + "can be used to emulate the Know-How Computer by writing a program in the "
                                    + "Commands field and executing it by using the controls at the bottom of the "
                                    + "screen. Commands can be entered using the keyboard or by clicking on the "
                                    + "corresponding buttons at the top of the screen. The program can be saved to a "
                                    + "file or to the browser to restore the current state at a later time.",
        "License": "© 2022 Timon Scholz. The <1>source code</1> is available on GitHub under MIT license."
    },

    "LanguageSelector": {
        "Tooltip": "Language",
        "AriaLabel": "Language",
    },

    "Command": {
        "Command": {
            "AriaLabel": "Command",
            "Tooltip": "Command",
        },
        "Target": {
            "AriaLabel": "Target",
            "Tooltip": "Target",
        },
        "Delete": {
            "AriaLabel": "Delete command",
            "Tooltip": "Delete command",
        },
    },

    "Register": {
        "Value": {
            "AriaLabel": "Register value",
        },
        "DeleteButton": {
            "AriaLabel": "Delete register",
            "Tooltip": "Delete register",
        }
    },

    "Commands": {
        "NOP": {
            "Tooltip":  "Does nothing and increments the PC by 1.",
            "AriaLabel": "Insert NOP command",
        },
        "+": {
            "Tooltip": "Increments the register XX by 1 and increments the PC by 1.",
            "AriaLabel": "Insert Increment command",
        },
        "-": {
            "Tooltip": "Decrements the register XX by 1and increments the PC by 1.",
            "AriaLabel": "Insert Decrement command",
        },
        "j": {
            "Tooltip": "Sets the PC to XX",
            "AriaLabel": "Insert Jump command",
        },
        "0": {
            "Tooltip": "If register XX is 0, increments PC by 2, otherwise increments PC by 1.",
            "AriaLabel": "Insert If Zero command",
        },
        "Stop": {
            "Tooltip": "Stops execution.",
            "AriaLabel": "Insert Stop command",
        },
    },
    "CommandBox": {
        "Title": "Commands",
        "AddCommand": {
            "AriaLabel": "Add new command",
        },
    },
    "RegisterBox": {
        "Title": "Registers",
        "AddRegister": {
            "AriaLabel": "Add new register",
        },
    },
    "ActionsPalette": {
        "PC": {
            "Label": "PC",
            "AriaLabel": "Program Counter",
            "Tooltip": "Program Counter",
        },
        "Start": {
            "AriaLabel": "Start program execution starting at the current PC",
            "Tooltip": "Start program execution starting at the current PC",
        },
        "Pause": {
            "AriaLabel": "Pause program execution at current PC",
            "Tooltip": "Pause program execution at current PC",
        },
        "Step": {
            "AriaLabel": "Step forward one command",
            "Tooltip": "Step forward one command",
        },
        "ResetPC": {
            "AriaLabel": "Reset PC to 0",
            "Tooltip": "Reset PC to 0",
        },
    },
    "SpeedSelector": {
        "Button": {
            "Tooltip": "Change execution speed",
            "AriaLabel": "Change execution speed",
        },
        "Slider": {
            "AriaLabel": "Execution speed in commands per second",
            "ThumbAriaLabel": "Execution speed slider thumb",
            "Tooltip": "Commands per second: {{val, number}}",
        },
    },

    "Error": {
        "InvalidJSON": "Invalid JSON file.",
        "NoCommands": "No commands found in file.",
        "IncorrectFormatting": "Command {{line, number}} is not properly formatted.",
        "InvalidCommandReference": "Command {{line, number}} is referencing a non-existent command.",
        "NonNumericRegister": "Non-numeric register found.",
    },

    "SaveProgram": {
        "Button": {
            "Tooltip": "Save current program",
            "AriaLabel": "Save current program",
        },
        "Title": "Save Current Program",
        "SaveButtonLabel": "Save to Browser",
        "ExportButtonLabel": "Export to File",
        "NameInput": {
            "Label": "Program Name",
            "Placeholder": "example",
        },
        "SaveRegisterValuesSwitch": {
            "Label": "Save Register Values",
        },
        "SuccessNotification": {
            "Title": "Saving Successful",
            "Message": "Successfully saved program to browser",
        },
        "DefaultName": "khc-program",
    },
    "LoadProgram": {
        "Button": {
            "Tooltip": "Load saved program",
            "AriaLabel": "Load saved program",
        },
        "Title": "Load Program",
        "DeleteButton": {
            "AriaLabel": "Delete saved program",
            "Tooltip": "Delete saved program",
        },
        "ErrorNotification": {
            "Title": "Invalid File",
            "Message": "File content does not appear to be a valid Know-How Computer program:\n{{message}}",
        },
        "SuccessNotification": {
            "Title": "Loading Successful",
            "Message": "Successfully loaded program",
        },
    },

    "ProgramUpload": {
        "Dropzone": {
            "TitleAccept": "Drop program here to load...",
            "TitleReject": "Only .json files are accepted.",
        },
        "Notification": {
            "Error": {
                "Title": "Incorrect File Format",
                "Message": "Only .json files generated by this web application can be read",
            }
        },
        "UploadButton": {
            "AriaLabel": "Upload program",
            "Label": "Upload file...",
        }
    },
};

export default translation;