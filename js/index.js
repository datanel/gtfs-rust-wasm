async function main() {
    const rust = await import("../pkg/index.js").catch(console.error);
    const output = document.getElementById("output");
    const fileInput = document.getElementById("file-input");
    const fileReader = new FileReader();

    function addListeners(fileReader) {
        fileReader.onloadstart = () => {
            output.innerText = `Loading GTFS...`
        }
        fileReader.onload = e => {
            const view = new Uint8Array(e.target.result)
            const stats = rust.get_stats(view);
            console.timeEnd("Load GTFS (JS + Rust)");
            const text = `
            GTFS Loaded<br><br>
            Number of stop points: ${stats.nb_stop_points}<br>
            Number of stop areas: ${stats.nb_stop_areas}<br>
            Number of lines: ${stats.nb_lines}<br>
            Number of routes: ${stats.nb_routes}<br>
            Number of vehicles journeys: ${stats.nb_vehicles_journeys}
            `
            output.innerHTML = text;
        }
        fileReader.onerror = () => {
            output.innerText = "Error."
        }
    }

    function onChange() {
        output.innerText = "";
        const file = this.files[0];
        if (file) {
            addListeners(fileReader);
            console.time("Load GTFS (JS + Rust)");
            fileReader.readAsArrayBuffer(this.files[0]);
        }
    }

    fileInput.addEventListener("change", onChange);
}

main();