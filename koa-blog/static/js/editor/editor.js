import SimpleMDE from "simplemde"

let simplemde = new SimpleMDE({
    element: document.getElementById("textarea"),
    promptURLs: true,
    autoDownloadFontAwesome: false
})





simplemde.codemirror.on("change", function() {
    let v = simplemde.value()

    let v2 = simplemde.markdown(v)

})