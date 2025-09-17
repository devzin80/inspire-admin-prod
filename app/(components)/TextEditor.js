import React, { useEffect, useRef } from 'react'
import SunEditor from 'suneditor-react'
import 'suneditor/dist/css/suneditor.min.css'
import 'katex/dist/katex.min.css'
import katex from 'katex'

const RichTextEditor = ({ value = '', onChange }) => {
    const editorRef = useRef(null)

    // Sync external value into the editor whenever it changes
    useEffect(() => {
        if (editorRef.current && value !== undefined) {
            editorRef.current.setContents(value)
        }
    }, [value])

    return (
        <SunEditor
            getSunEditorInstance={(editor) => {
                editorRef.current = editor
            }}
            setOptions={{
                height: 300,
                buttonList: [
                    ['undo', 'redo'],
                    ['font', 'fontSize', 'formatBlock'],
                    [
                        'bold',
                        'italic',
                        'underline',
                        'strike',
                        'subscript',
                        'superscript',
                    ],
                    ['fontColor', 'hiliteColor'],
                    ['removeFormat'],
                    [
                        'outdent',
                        'indent',
                        'align',
                        'horizontalRule',
                        'list',
                        'table',
                    ],
                    ['math'], // ✅ KaTeX works now
                    [
                        'fullScreen',
                        'showBlocks',
                        'codeView',
                        'preview',
                        'print',
                    ],
                    ['paragraphStyle', 'blockquote'],
                    ['lineHeight'],
                ],
                katex: katex,
                placeholder: 'Write something...',
                minHeight: '200px',
                showPathLabel: false,
            }}
            onChange={onChange}
        />
    )
}

export default RichTextEditor
