
"use client";
import { useEffect } from 'react';
import Image from "next/image";

export default function Home() {
    let text: String = "It's the start of a new project that I'll never finish.";
    
    useEffect(() => {
        const keydown = (event) => {
	    event.preventDefault();
	    if (event.key === "Shift" || event.key === "Control" || event.key === "Alt" || event.key === "Meta") return;
	    else if (event.key === "Backspace") {
	        text = text.substring(0, text.length - 1);
	        document.querySelector(".text-body").innerHTML = text;
		return;
	    } else {
	        text += event.key;
	        document.querySelector(".text-body").innerHTML = text;
	   }
	});
    	document.addEventListener("keydown", keydown);
    })
    
    return (
        <div className="text-body">
            {text}
        </div>
    );
}
