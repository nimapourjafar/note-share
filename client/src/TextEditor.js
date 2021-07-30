import {useCallback} from 'react'
import Quill from 'quill'
import "quill/dist/quill.snow.css"

const TextEditor = () => {
    const wrapperRef = useCallback((wrapper) => {
        if (wrapper == null) return
        wrapper.innerHTML = ''
        const editor = document.createElement('div')
        wrapper.append(editor)
        const quill = new Quill(editor, {theme:"snow"})

    },[])
    return (
        <div id="editor" ref={wrapperRef}>
            
        </div>
    )
}

export default TextEditor
