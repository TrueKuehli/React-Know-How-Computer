import React, {useCallback, useRef} from "react";

import {useAppDispatch, useAppSelector} from "../state/stateHooks";
import {executeCells} from "../state/computerSlice";

import ActionsPalette from "./ActionsPalette/ActionsPalette";
import CommandPalette from "./CommandPalette/CommandPalette";
import Computer from "./Computer/Computer";
import "./KHComputer.scss";


/**
 * Main app component
 */
function KHComputer() {
    const dispatch = useAppDispatch();
    const running = useAppSelector((state) => state.computer.running);
    const speed = useAppSelector((state) => state.computer.speed);

    const lastAnimationFrame = useRef<number>(performance.now());
    const animationRequestRef = useRef<number>();
    const animate = useCallback((time: DOMHighResTimeStamp) => {
        if (running) {
            if (time - lastAnimationFrame.current > 1000 / speed) {
                const commandsToRun = Math.floor((time - lastAnimationFrame.current) / (1000 / speed));
                lastAnimationFrame.current = lastAnimationFrame.current + commandsToRun * (1000 / speed);

                dispatch(executeCells(commandsToRun));
            }
        }

        animationRequestRef.current = requestAnimationFrame(animate);
    }, [running, speed, dispatch]);

    // Start program execution loop
    React.useEffect(() => {
        animationRequestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationRequestRef.current || 0);
    }, [animate]);


    // Main Component render
    return (
        <div className="KHComputer">
            <CommandPalette/>
            <Computer/>
            <ActionsPalette lastAnimationFrameRef={lastAnimationFrame}/>
        </div>
    );
}

export default KHComputer;