import React from "react";

import CodeField from "./CodeField/CodeField";
import RegisterField from "./RegisterField/RegisterField";
import "./Computer.scss";


function Computer() {
    return (
        <div className={"Computer"}>
            <div className={"Gap"}></div>
            <CodeField />
            <div className={"Gap"}></div>
            <RegisterField />
            <div className={"Gap"}></div>
        </div>
    );
}

export default Computer;