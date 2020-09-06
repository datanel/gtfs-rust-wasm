import("../pkg/index.js")
.then(m => {
    var fileInuputElement = document.getElementById("file-input");
    var result = document.getElementById("result");

    var fileReader = new FileReader();

    fileReader.onprogress = e => {
        result.innerText = `Loading GTFS...`
    }
    fileReader.onload = e => {
        console.timeEnd("Load JS");
        var res = new Uint8Array(e.target.result)
        console.time("Load Rust");
        var nbLines = m.number_of_stop_points(res);
        console.timeEnd("Load Rust");
        result.innerText = `Numbers of stop points: ${nbLines}`;
    }
    fileReader.onloadend = e => {
        result.innerHTML = `GTFS Loaded<br>${result.innerText}`;
    }
    fileReader.onerror = e => {
        result.innerText = "Error."
    }

    fileInuputElement.addEventListener("change", e => {
        console.time("Load JS");
        fileReader.readAsArrayBuffer(fileInuputElement.files[0]);
    });

})
.catch(console.error);
