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

    for (var i = 0; i <= arr.length; i++) {
        if (arr[i] > arr[i + 1]) {
            [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]]
            i = i - 2;
        }
    }

})();

;
(function() {
    let arr = $arr.slice(0)

    function binaryInsertionSort(array) {
        if (Object.prototype.toString.call(array).slice(8, -1) === 'Array') {
            console.time('二分插入排序耗时：');
            for (var i = 1; i < array.length; i++) {
                var key = array[i],
                    left = 0,
                    right = i - 1;
                while (left <= right) {
                    var middle = parseInt((left + right) / 2);
                    if (key < array[middle]) {
                        right = middle - 1;
                    } else {
                        left = middle + 1;
                    }
                }
                for (var j = i - 1; j >= left; j--) {
                    array[j + 1] = array[j];
                }
                array[left] = key;
            }
            console.timeEnd('二分插入排序耗时：');
            return array;
        } else {
            return 'array is not an Array!';
        }
    }
    var arr = [3, 44, 38, 5, 47, 15, 36, 26, 27, 2, 46, 4, 19, 50, 48];
    console.log(binaryInsertionSort(arr))

})();

;
(function() {
    let arr = $arr.slice(0)
    console.time()
    for (var i = 1; i < arr.length; i++) {
        var key = arr[i]
        var j = i - 1

        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j]
            j--
        }
        arr[j + 1] = key
    }
    console.timeEnd()
    console.log(arr)
})();


;
(function() {
    let arr = $arr.slice(0)
    let temp, len = arr.length
    let min

    console.time()
    for (let i = 0; i < len - 1; i++) {
        min = i
        for (let j = i + 1; j < len; j++) {
            if (arr[j] < arr[min]) {
                min = j
            }
        }
        temp = arr[i]
        arr[i] = arr[min]
        arr[min] = temp
    }
    console.timeEnd()
    console.log(arr)
})();

;
(function() {
    let arr = $arr.slice(0)
    let temp, len = arr.length
    console.time()
    for (let i = 0; i < len - 1; i++) {
        for (let j = i + 1; j < len; j++) {
            if (arr[i] > arr[j]) {
                temp = arr[i]
                arr[i] = arr[j]
                arr[j] = temp
            }
        }
    }
    console.timeEnd()
    console.log(arr)

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