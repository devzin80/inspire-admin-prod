import React, { useEffect, useRef } from 'react'
import SunEditor from 'suneditor-react'
import 'suneditor/dist/css/suneditor.min.css'
import 'katex/dist/katex.min.css'
import katex from 'katex'

const QuizEditor = ({ value = '', onChange, height = 150 }) => {
    const editorRef = useRef(null)
    const initialLoad = useRef(true)

    useEffect(() => {
        if (editorRef.current && value !== undefined) {
            if (
                initialLoad.current ||
                editorRef.current.getContents() !== value
            ) {
                editorRef.current.setContents(value)
                initialLoad.current = false
            }
        }
    }, [value])

    return (
        <SunEditor
            getSunEditorInstance={(editor) => {
                editorRef.current = editor

                // ✅ enforce LTR only once
                editor.onload = () => {
                    try {
                        const body =
                            editor.core.context.element.wysiwygFrame
                                .contentDocument.body
                        body.setAttribute('dir', 'ltr')
                        body.style.textAlign = 'left'
                    } catch (err) {
                        console.warn('Could not enforce LTR:', err)
                    }
                }
            }}
            setOptions={{
                height: height, // ✅ dynamic height
                buttonList: [
                    ['undo', 'redo'],
                    [
                        'bold',
                        'italic',
                        'underline',
                        'strike',
                        'subscript',
                        'superscript',
                    ],
                    ['math'],
                ],
                katex: katex,
                placeholder: 'Write something...',
                showPathLabel: false,
                defaultStyle: 'text-align:left; direction:ltr;',
                addTagsWhitelist: 'span',
                attributesWhitelist: {
                    all: 'contenteditable',
                },
            }}
            onChange={(content) => {
                if (onChange) onChange(content)
            }}
        />
    )
}

export default QuizEditor
