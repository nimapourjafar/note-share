import { useCallback, useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { io } from "socket.io-client";
import {useParams } from "react-router-dom"
import { set } from "mongoose";

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
];

const TextEditor = () => {
  const {id:documentId} = useParams();
  const [socket, setSocket] = useState();
  const [quill, setQuill] = useState();

  useEffect(() => {
    const s = io("http://localhost:3001");
    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket==null || quill==null) return
    const handler = (delta, oldDelta, source) => {
      if (source !== "user") return;
      socket.emit("send-changes", delta);
    };
    quill.on("text-change", handler);
    return () => {
      quill.off("text-change", handler);
    };
  }, [quill,socket]);

  useEffect(() => {
    if (socket==null || quill==null) return
    const handler = (delta) => {
      quill.updateContents(delta);
    };
    socket.on("recieve-changes", handler);
    return () => {
      quill.off("recieve-changes", handler);
    };
  }, [quill,socket]);

  useEffect(() => {
    if (socket==null || quill==null) return
    const interval = setInterval(() => {
      socket.emit("save-changes",quill.getContents())
    }, 1000)
    return () => {
      clearInterval(interval);
    }
  },[socket,quill])

  useEffect(() => {
    if (socket==null || quill==null) return;
    socket.once("load-document",document => {
      quill.setContents(document);
      quill.enable()
    })
    socket.emit("send-document", documentId);
  }, [socket,quill,documentId])

  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) return;
    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);
    const quill = new Quill(editor, {
      theme: "snow",
      modules: { toolbar: TOOLBAR_OPTIONS },
    });
    quill.disable()
    quill.setText("Loading...")
    setQuill(quill);
  }, []);

  return <div className="container" ref={wrapperRef}></div>;
};

export default TextEditor;
