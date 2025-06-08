
"use client";
import { useEffect } from 'react';
import Image from "next/image";

export default function Home() {
    const DISTANCE: int = 20;
    
    let text: String = "Text\xa0Anything\xa0You\xa0Want ";
    let index: int = text.length - 1;
    
    useEffect(() => {
        const get_character_position = (text_node, char_index) => {
            if (!text_node || text_node.nodeType !== Node.TEXT_NODE) {
	        console.error("[ERROR]: Invalid or missing text node.");
	        return null;
	    }
	    if (char_index < 0 || char_index >= text_node.length) {
	        console.error("[ERROR]: Index is out of the bounds.");
		return null;
	    }
            const range = document.createRange();
    	    range.setStart(text_node, char_index);
    	    range.setEnd(text_node, char_index + 1);
    	    const rects = range.getClientRects();
	    
    	    if (rects.length > 0) {
    	        const rect = rects[0];
    	        return { x: rect.left, y: rect.top };
    	    }
    	    return null;
    	}
	
        const update = () => {
	    document.getElementById("text-body").innerHTML = text;
	    
	    let cursor_pos = get_character_position(document.getElementById("text-body").firstChild, index);
	    document.getElementById("cursor").style["transform"] = `translate(${cursor_pos.x}px, ${cursor_pos.y - 10}px)`;
	}
	
	const keydown = (event) => {
	    event.preventDefault();
	    switch (event.key) {
	        case "Shift":
		case "Control":
		case "Alt":
		case "Meta":
		case "CapsLock":
		    break;
	        case "End":
	            index = text.length - 1;
		    update();
		    break;
		case "ArrowLeft":
		    if (index > 0) {
		        index--;
			update();
			break;
		    } else break;
		case "ArrowRight":
		    if (index < text.length - 1) {
		        index++;
			update();
			break;
		    } else break;
		case "Backspace":
		    if (index > 0) {
		        text = text.substring(0, index - 1) + text.substring(index);
			index--;
			update();
		    }
		    break;
		default:
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
	    <div id="cursor" className="bg-[#ffffff] w-3 h-1/1000 absolute"></div>
	</>
    );
}
