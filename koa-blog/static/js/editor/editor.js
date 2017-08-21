import Vue from "vue"
import axios from "axios"
import SimpleMDE from "simplemde"

/*
simplemde.codemirror.on("change", function() {
    let v = simplemde.value()

    let v2 = simplemde.markdown(v)

})
*/

let _xy = {
    getParams(name) {
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i")
        let result = window.location.search.substr(1).match(reg)

        if (result != null) {
            return unescape(result[2])
        } else {
            return null
        }
    }
}


let vm = new Vue({
    el: "#editor-box",
    data: {
        simplemde: "",
        id: "",
        title: "",
        content: "",
        md: "",
        articleEmpty: true
    },
    methods: {
        empty() {
            let result = confirm("确定清空吗?")

            if (result) {
                this.clear()
            }
        },
        clear() {
            this.title = ""
            this.content = ""
            this.simplemde.value("")
        },
        submit() {
            this.content = this.simplemde.value()
            if (!this.title || !this.content) {
                alert("请输入内容!")
            } else {
                this.addArticle({
                    id: this.id,
                    title: this.title,
                    md: this.content,
                    text: this.getText(),
                    content: this.simplemde.markdown(this.content)
                })
            }
        },
        getText() {
            let div = document.createElement("div")

            div.innerHTML = this.simplemde.markdown(this.content)

            return div.textContent
        },
        addArticle(d) {
            axios.post("/article/add-edit-article", d).then(result => {
                if (result.data.code == 1) {
                    if (this.articleEmpty) {
                        this.clear()
                    }
                    alert("提交成功!")
                }
            })
        }
    },
    mounted() {
        this.id = _xy.getParams("id")

        this.simplemde = new SimpleMDE({
            element: document.getElementById("textarea"),
            promptURLs: true,
            autoDownloadFontAwesome: false
        })

        if (this.id) {
            axios.get("/article/article-info", {
                params: {
                    id: this.id
                }
            }).then(result => {
                let data = result.data
                if (result.status == 200) {
                    this.title = data.title
                    this.content = data.content
                    this.simplemde.value(data.md)
                }
            })
        }

    }
})