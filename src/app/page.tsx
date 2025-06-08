
"use client";
import { useEffect } from 'react';
import Image from "next/image";

export default function Home() {
    const DISTANCE: int = 15;
    
    let text: String = "It's the start of a new project that I'll never finish.";
    let cursor: int = 0;
    let index: int = text.length;
    let row: int = -23;
    
    useEffect(() => {
        const update = () => {
	    var el = document.getElementById("text-body");
	    var style = window.getComputedStyle(el, null).getPropertyValue('font-size');
	    var font_size = parseFloat(style);
	    
	    document.getElementById("text-body").innerHTML = text;
	    console.log(index);
	    
	    document.getElementById("cursor").style["transform"] = `translate(${cursor}px, ${row}px)`;
	}
	
	const keydown = (event) => {
	    event.preventDefault();
	    if (event.key === "Shift" || event.key === "Control" || event.key === "Alt" || event.key === "Meta") return;
	    else if (event.key === "ArrowLeft") {
	        if (index > 0) { index--; update(); }
	    }
	    else if (event.key === "ArrowRight") {
	    	if (index < text.length) { index++; update(); }
	    }
	    else if (event.key === "Backspace") {
		text = text.substring(0, index - 1) + text.substring(index);
		index--;
		update();
		return;
	    }
	    else {
	        let txt: String = "";
	        if (event.key === " ") {
		    txt = text.slice(0, index) + "\xa0" + text.slice(index);
		    text = txt;
		    index++;
		    update();
		    return;
		};
		txt = text.slice(0, index) + `${event.key}` + text.slice(index);
	        text = txt;
		index++;
		update();
	   }
	});
    	document.addEventListener("keydown", keydown);
    })
    
    return (
        <>
            <div id="text-body">
                {text}
            </div>
	    <div id="cursor" className="bg-[#ffffff] w-1 h-5 absolute"></div>
	</>
    );
}
