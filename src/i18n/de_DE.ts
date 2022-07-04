const translation = {
    "<head>": {
        title: "Know-How Computer",
        description: "Web-Anwendung zur Simulation des Know-How Computers",
    },

    "About": {
        "Button": {
            "AriaLabel": "Info",
            "HoverText": "Info",
        },
        "Title": "Info",
        "KnowHowComputerDescription": "Der <1>Know-How Computer</1> (auch als WDR-Papiercomputer bekannt) ist ein "
            + "Lehrmittel, das an <3>Registermaschinen</3> angelehnt ist. Diese Webanwendung dient zur Simulierung "
            + "dieses Computers. Programme für den Know-How Computer können geschrieben, ausgeführt und gespeichert "
            + "werden. Die Bedienelemente am unteren Bildschirmrand dienen zur Ausführung des Programms, während die "
            + "Bedienelemente am oberen Bildschirmrand zur Eingabe von Befehlen dienen. Alternativ können Befehle auch "
            + "mittels der Tastatur eingegeben werden. Der Programmcode kann in einer Datei oder direkt im Browser "
            + "gespeichert werden und somit zu einem späteren Zeitpunkt wieder geladen werden.",
        "License": "© 2022 Timon Scholz. Der <1>Quellcode</1> ist auf GitHub unter der MIT Lizenz veröffentlicht."
    },

    "LanguageSelector": {
        "Tooltip": "Sprache",
        "AriaLabel": "Sprache ändern",
    },

    "Command": {
        "Command": {
            "AriaLabel": "Befehl",
            "Tooltip": "Befehl",
        },
        "Target": {
            "AriaLabel": "Ziel",
            "Tooltip": "Ziel",
        },
        "Delete": {
            "AriaLabel": "Befehl löschen",
            "Tooltip": "Befehl löschen",
        },
    },

    "Register": {
        "Value": {
            "AriaLabel": "Registerwert",
        },
        "DeleteButton": {
            "AriaLabel": "Register löschen",
            "Tooltip": "Register löschen",
        }
    },

    "Commands": {
        "NOP": {
            "Tooltip":  "Erhöht den PC um 1 ohne etwas anderes zu tun.",
            "AriaLabel": "NOP-Befehl einfügen",
        },
        "+": {
            "Tooltip": "Erhöht den Wert in Register XX und den PC um jeweils 1.",
            "AriaLabel": "Increment-Befehl einfügen",
        },
        "-": {
            "Tooltip": "Verringert den Wert in Register XX um 1 und erhöht den PC um 1.",
            "AriaLabel": "Decrement-Befehl einfügen",
        },
        "j": {
            "Tooltip": "Setzt den PC auf XX.",
            "AriaLabel": "Jump-Befehl einfügen",
        },
        "0": {
            "Tooltip": "Erhöht den PC um 2, wenn Register XX den Wert 0 enthält, erhöht sonst den PC um 1.",
            "AriaLabel": "If-Zero-Befehl einfügen",
        },
        "Stop": {
            "Tooltip": "Beendet die Ausführung.",
            "AriaLabel": "Stop-Befehl einfügen",
        },
    },
    "CommandBox": {
        "Title": "Befehle",
        "AddCommand": {
            "AriaLabel": "Neuen Befehl einfügen",
        },
    },
    "RegisterBox": {
        "Title": "Register",
        "AddRegister": {
            "AriaLabel": "Neues Register einfügen",
        },
    },
    "ActionsPalette": {
        "PC": {
            "Label": "PC",
            "AriaLabel": "Programmzähler",
            "Tooltip": "Programmzähler",
        },
        "Start": {
            "AriaLabel": "Ausführung am aktuellen PC starten",
            "Tooltip": "Ausführung am aktuellen PC starten",
        },
        "Pause": {
            "AriaLabel": "Ausführung am aktuellen PC pausieren",
            "Tooltip": "Ausführung am aktuellen PC pausieren",
        },
        "Step": {
            "AriaLabel": "Schrittweise ausführen",
            "Tooltip": "Schrittweise ausführen",
        },
        "ResetPC": {
            "AriaLabel": "PC auf 0 zurücksetzen",
            "Tooltip": "PC auf 0 zurücksetzen",
        },
    },
    "SpeedSelector": {
        "Button": {
            "Tooltip": "Ausführungsgeschwindigkeit ändern",
            "AriaLabel": "Ausführungsgeschwindigkeit ändern",
        },
        "Slider": {
            "AriaLabel": "Ausführungsgeschwindigkeit in Befehlen/Sekunde",
            "ThumbAriaLabel": "Schieberegler für die Ausführungsgeschwindigkeit",
            "Tooltip": "Befehle/Sekunde: {{val, number}}",
        },
    },

    "Error": {
        "InvalidJSON": "Ungültige JSON Datei.",
        "NoCommands": "Keine Befehle in der gewählten Datei gefunden.",
        "IncorrectFormatting": "Befehl {{line, number}} ist nicht richtig formatiert.",
        "InvalidCommandReference": "Befehl {{line, number}} referenziert einen fehlenden Befehl.",
        "NonNumericRegister": "Nicht-numerischer Registerinhalt gefunden.",
    },

    "SaveProgram": {
        "Button": {
            "Tooltip": "Aktuelles Programm speichern",
            "AriaLabel": "Aktuelles Programm speichern",
        },
        "Title": "Programm speichern",
        "SaveButtonLabel": "Im Browser speichern",
        "ExportButtonLabel": "Als Datei speichern",
        "NameInput": {
            "Label": "Programm-Titel",
            "Placeholder": "beispiel",
        },
        "SaveRegisterValuesSwitch": {
            "Label": "Registerwerte speichern",
        },
        "SuccessNotification": {
            "Title": "Erfolgreich gespeichert",
            "Message": "Programm wurde erfolgreich im Browser gespeichert.",
        },
        "DefaultName": "khc-programm",
    },
    "LoadProgram": {
        "Button": {
            "Tooltip": "Gespeichertes Programm laden",
            "AriaLabel": "Gespeichertes Programm laden",
        },
        "Title": "Programm Laden",
        "DeleteButton": {
            "AriaLabel": "Gespeichertes Programm löschen",
            "Tooltip": "Gespeichertes Programm löschen",
        },
        "ErrorNotification": {
            "Title": "Ungültige Datei",
            "Message": "Datei-Inhalt scheint kein gültiges Know-How-Computer-Programm zu sein:\n{{message}}",
        },
        "SuccessNotification": {
            "Title": "Erfolgreich geladen",
            "Message": "Programm erfolgreich geladen.",
        },
    },

    "ProgramUpload": {
        "Dropzone": {
            "TitleAccept": "Programm hier ablegen zum Laden...",
            "TitleReject": "Nur .json-Dateien können geladen werden.",
        },
        "Notification": {
            "Error": {
                "Title": "Ungültiges Dateiformat",
                "Message": "Nur .json-Dateien können geladen werden.",
            }
        },
        "UploadButton": {
            "AriaLabel": "Programm hochladen",
            "Label": "Programm hochladen...",
        }
    },
};

export default translation;