import("../pkg/index.js")
    .then(m => {
        var fileInuputElement = document.getElementById("file-input");
        var output = document.getElementById("output");

        fileInuputElement.addEventListener("change", function () {
            loadGTFS(this.files[0]);
        });

        function loadGTFS(file) {
            var gtfs = new m.Gtfs;
            var CHUNCK_SIZE = 10 * 1024;
            var offset = 0;
            var fileReader = new FileReader();

            fileReader.onprogress = () => {
                output.innerText = `Loading GTFS...`
            }
            fileReader.onload = e => {
                var result = e.target.result;
                var view = new Uint8Array(result);
                // console.log(view);

                if (view.length === 0) {
                    console.timeEnd("append chunk");
                    // output.innerHTML = `GTFS Loaded<br>${result.innerText}`;
                    output.innerHTML = `GTFS Loaded`;
                    console.time("Load Rust GTFS");
                    var nbLines = m.number_of_stop_points(gtfs)
                    console.timeEnd("Load Rust GTFS");
                    output.innerText = `Numbers of stop points: ${nbLines}`;
                    return;
                }

                gtfs.append(view);
                offset += CHUNCK_SIZE;
                seek();

            }

            fileReader.onerror = () => {
                output.innerText = "An error occured."
            }
            console.time("append chunk");
            seek();


            function seek() {
                var slice = file.slice(offset, offset + CHUNCK_SIZE);
                fileReader.readAsArrayBuffer(slice);

            }
        }
    })
    .catch(console.error);