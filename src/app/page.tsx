
"use client";
import { useEffect } from 'react';
import Image from "next/image";

export default function Home() {
    
    useEffect(() => {
        let text: Array = ["#include\xa0<stdio.h>", "\xa0", "int\xa0main(int\xa0argc,\xa0char\xa0*argv[])\xa0{", "\xa0\xa0\xa0\xa0printf('Hello\xa0World!');", "}    "];
	let current_line: int = 0;
	
	let cursor: int = text[current_line].length;
	let index: int = text[current_line].length;
	
        const get_character_position = (text_node, char_index, end) => {
            if (!text_node || text_node.nodeType !== Node.TEXT_NODE) {
	        console.error("[ERROR]: Invalid or missing text node.");
	        return null;
	    }
	    if (char_index < 0 || char_index > text_node.length) {
	        console.error("[ERROR]: Index is out of the bounds.");
		return null;
	    }
            const range = document.createRange();
    	    range.setStart(text_node, char_index);
    	    range.setEnd(text_node, end);
    	    const rects = range.getClientRects();
	    
    	    if (rects.length > 0) {
    	        const rect = rects[0];
    	        return { x: rect.left, y: rect.top - (rect.height) };
    	    }
    	    return null;
    	}
	const get_text_size = () => {
	    let size_t: int = 0;
	    for (let i: int = 0; i < text.length; i++) {
	        for (let j: int = 0; j < text[i].length; j++) {
		    size_t++;
		}
	    }
	    return size_t;
	}
	
        const update = () => {
	    document.getElementById("text-body").textContent = "";
	    // TODO: no.
	    for (let i: int = 0; i < text.length; i++) {
	        document.getElementById("text-body").textContent += text[i] + '\n';
	    }
	    
	    let cursor_pos = get_character_position(document.getElementById("text-body").firstChild, cursor, get_text_size());
	    if (cursor_pos) {
	       document.getElementById("cursor").style["transform"] = `translate(${cursor_pos.x - 60}px, ${cursor_pos.y - 164}px)`;
	    }
	}
	update();
	
	const keydown = (event) => {
	    event.preventDefault();
	    switch (event.key) {
	        case "Shift":
		case "Control":
		case "Alt":
		case "Meta":
		case "CapsLock":
		case "Enter":
		case "Dead":
		    break;
		case "Tab":
		    text[current_line] = text[current_line].slice(0, index) + "\xa0\xa0\xa0\xa0" + text[current_line].slice(index);
		    index += 4;
		    break;
		case "ArrowLeft":
		    if (cursor > 0) {
		        cursor--;
		        index--;
			if (index < 0 && current_line > 0) {
			    current_line--;
			    index = text[current_line].length;
			}
			break;
		    } else break;
		case "ArrowRight":
		    if (cursor < get_text_size()) {
		        cursor++;
		        index++;
			if (index > text[current_line].length) {
			    current_line++;
			    index = 0;
			}
			break;
		    } else break;
		case "ArrowDown":
		     if (current_line < text.length) {
			 if (index <= text[current_line + 1].length) {
			     cursor += text[current_line].length - index;
			     cursor += index + 1;
			 } else {
			     cursor += text[current_line].length - index;
			     cursor += text[current_line + 1].length + 1;
			     index = text[current_line + 1].length;
			 }
		         current_line++;
		     }
		     break;
		case "ArrowUp":
		     if (current_line > 0) {
		         if (index <= text[current_line - 1].length) {
			     cursor -= index + text[current_line - 1].length + 1;
			     cursor += index;
			 } else {
			     cursor -= index + text[current_line - 1].length;
			     cursor -= 1;
			     index = 0;
			 }
		         current_line--;
		     }
		     break;
		case "End":
		     cursor += text[current_line].length - index - 1;
		     index = text[current_line].length;
		     cursor += 1;
		     break;
		case "Home":
		     cursor -= index + 1;
		     index = 0;
		     cursor += 1;
		     break;
		case "Backspace":
		    if (cursor > 0) {
		        text[current_line] = text[current_line].substring(0, index - 1) + text[current_line].substring(index);
			cursor--;
			index--;
		    }
		    break;
		default:
	            if (event.key === " ") {
		        text[current_line] = text[current_line].slice(0, index) + "\xa0" + text[current_line].slice(index);
			cursor++;
			index++;
			break;
		    };
		    text[current_line] = text[current_line].slice(0, index) + `${event.key}` + text[current_line].slice(index);
		    cursor++;
		    index++;
	    }
	    update();
	});
    	document.addEventListener("keydown", keydown);
    })
    
    return (
        <div className="p-15">
            <div id="text-body">
            </div>
	    <div id="cursor" className="bg-[#00FF00] w-3 h-5 absolute"></div>
	</div>
    );
}
