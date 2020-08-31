import("../pkg/index.js")
// .then(m => {
//     var fileInuputElement = document.getElementById("file-input");
//     var result = document.getElementById("result");

//     var fileReader = new FileReader();

//     fileReader.onprogress = e => {
//         result.innerText = "On progress..."
//     }
//     fileReader.onloadend = e => {
//         var res = new Uint8Array(e.target.result)
//         m.read(res)
//     }
//     fileReader.onerror = e => {
//         result.innerText = "Error."
//     }

//     // m.greet('World!');
//     fileInuputElement.addEventListener("change", e => fileReader.readAsArrayBuffer(fileInuputElement.files[0]));

// })
.catch(console.error);
