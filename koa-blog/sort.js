let $arr = [];
(function() {
    for (let i = 0; i < 100; i++) {
        $arr.push(i)
    }

    $arr.sort(() => {
        return Math.random() - 0.5
    })
})();

;
(function() {
    let arr = $arr.slice(0)
    let temp = ""
    let i = arr.length

    while (i > 0) {
        let pos = 0
        for (let j = 0; j < i; j++) {
            if (arr[j] > arr[j + 1]) {
                temp = arr[j]
                arr[j] = arr[j + 1]
                arr[j + 1] = temp
                pos = j
            }
        }
        i = pos
    }
    //console.log("sort1",arr)
})();


;
(function() {
    let arr = $arr.slice(0)
    let right = arr.length - 1
    let left = 0,
        temp

    while (left < right) {
        for (let i = left; i < right; i++) {
            if (arr[i] > arr[i + 1]) {
                temp = arr[i]
                arr[i] = arr[i + 1]
                arr[i + 1] = temp
            }
        }
        --right

        for (let j = right; j > left; j--) {
            if (arr[j] < arr[j - 1]) {
                temp = arr[j]
                arr[j] = arr[j - 1]
                arr[j - 1] = temp
            }
        }
        ++left
    }

    console.log("sort2", arr)
})();