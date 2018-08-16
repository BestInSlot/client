'use strict';

export default {
    theme: 'snow',
    boundary: document.body,
    modules: {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ header: [1, 2, 3, false]}],
            [{ 'list': 'ordered'}, { 'list': 'bullet'}],
            [{'align': []}],
            ['clean']
            ['link', 'image', 'video']
        ],
    },

    readOnly: false
}