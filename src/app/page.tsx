
"use client";
import { useEffect } from 'react';
import Image from "next/image";

export default function Home() {
    let text: String = "It's the start of a new project that I'll never finish.";
    
    useEffect(() => {
        const keydown = (e) => {
	    if (e.key === "Shift" || e.key === "Ctrl") return;
	    else if (e.key === "Backspace") {
	        text = text.substring(0, text.length - 1);
	        document.querySelector(".text-body").innerHTML = text;
		return
	    } else {
	        text += e.key;
	        document.querySelector(".text-body").innerHTML = text;
	    }
	};
    	document.addEventListener("keydown", keydown);
    })
    
    return (
        <div className="text-body">
            {text}
        </div>
    );
}
