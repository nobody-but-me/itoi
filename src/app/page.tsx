

"use client";
import React, { useEffect, useState } from 'react';
import Image from "next/image";

let text: Array = ["#include\xa0<stdio.h>", "", "int\xa0main(int\xa0argc,\xa0char\xa0*argv[])\xa0{", "\xa0\xa0\xa0\xa0printf('Hello\xa0World!');", "}", ""];
let current_line: int = 0;

let cursor: int = text[current_line].length;
let index: int = text[current_line].length;
let data;

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
    for (let i in text) {
        for (let j in text[i]) {
            size_t++;
        }
        size_t++;
    }
    return size_t;
}

const parse = (string) => {
    return string.replace(/\xa0/g, "·").replace(/ /g, "·");
}

const update = () => {
    document.getElementById("text-body").textContent = "";
    // TODO: no.
    for (let i: int = 0; i < text.length; i++) {
        document.getElementById("text-body").textContent += parse(text[i]) + '\n';
    }
    
    let cursor_pos = get_character_position(document.getElementById("text-body").firstChild, cursor, get_text_size());
    if (cursor_pos) {
        document.getElementById("cursor").style["transform"] = `translate(${cursor_pos.x - 60}px, ${cursor_pos.y - 67 - (24 * text.length - 24)}px)`;
    }
}

function load_file(event) {
    const file = event.target.files[0];
    if (!file) {
        console.error("Please select a file.");
        return;
    }
    // if (!file.name.endsWith('.txt')) {
    //     console.error("Please upload a text file.");
    //     return;
    // }
    const reader = new FileReader();
    
    let is_loading = false;
    reader.onload = (e) => {
        data = e.target.result;
        is_loading = true;
	parse(data);
	
        text = data.split("\n");
        cursor = 0;
        index = 0;
        update();
    };
    reader.readAsText(file);
}

export default function Home() {
    
    useEffect(() => {
	update();
	
	const keydown = (event) => {
	    event.stopImmediatePropagation();
	    event.preventDefault();
	    switch (event.key) {
	        case "Shift":
		case "Control":
		case "Alt":
		case "Meta":
		case "CapsLock":
		case "Dead":
		    break;
		case "Tab":
		    text[current_line] = text[current_line].slice(0, index) + "\xa0\xa0\xa0\xa0" + text[current_line].slice(index);
		    cursor += 4;
		    index += 4;
		    break;
		case "Enter":
		    if (index === text[current_line].length) {
		        text.splice(current_line + 1, 0, "");
		        cursor += text[current_line].length - index;
		        cursor += text[current_line + 1].length + 1;
		        index = text[current_line + 1].length;
		        current_line++;
		    } else {
		        text.splice(current_line + 1, 0, "");
		        
		        // let i = text[current_line].split(text[current_line][index - 1]);
			let i = text[current_line].substring(0, index - 1) + "," + text[current_line].substring(index);
			let j = i.split(",");
			
		        text[current_line] = text[current_line].replace(j[j.length - 1], "");
		        
		        cursor += text[current_line].length - index;
		        cursor += text[current_line + 1].length + 1;
		        index = text[current_line + 1].length;
		        
		        text[current_line + 1] += j[j.length - 1];
		        current_line++;
		    }
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
		    if (cursor < get_text_size() - 1) {
		        cursor++;
		        index++;
			if (index > text[current_line].length) {
			    current_line++;
			    index = 0;
			}
			break;
		    } else break;
		case "ArrowDown":
		     if (current_line < text.length - 1) {
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
			     cursor -= index + 1;
			     index = text[current_line - 1].length;
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
		    if (index > 0) {
		        text[current_line] = text[current_line].substring(0, index - 1) + text[current_line].substring(index);
			cursor--;
			index--;
			break;
		    } else {
		        if (current_line > 0) {
		            if (text[current_line].length >= 1) {
			        let last_line_length: int = text[current_line].length;
			        cursor += last_line_length;
			        
			        text[current_line - 1] += text[current_line];
			        text.splice(current_line, 1);
			        
			        current_line--;
			        
			        cursor -= last_line_length + 1;
			        index = text[current_line].length - last_line_length;
			        break;
			    } else {
			        cursor += text[current_line].length;
			        text.splice(current_line, 1);
			        current_line--;
			        cursor -= 1;
			        index = text[current_line].length;
			    }
			}
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
	    <input type="file" className="p-2 m-5 rounded-md border-1 border-solid border-white hover:border-[#00FF00]" onChange={load_file} />
	    <div id="test"></div>
	</div>
    );
}
