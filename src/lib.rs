use js_sys::Uint8Array;
use std::io::Cursor;
use transit_model::{gtfs, read_utils, Model};
use wasm_bindgen::prelude::*;
// use wasm_bindgen::JsCast;
// use web_sys::console;

// When the `wee_alloc` feature is enabled, this uses `wee_alloc` as the global
// allocator.
//
// If you don't want to use `wee_alloc`, you can safely delete this.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

// This is like the `main` function, except for JavaScript.
// #[wasm_bindgen(start)]
// pub fn main_js() -> Result<(), JsValue> {
//     // This provides better error messages in debug mode.
//     // It's disabled in release mode so it doesn't bloat up the file size.
//     #[cfg(debug_assertions)]
//     console_error_panic_hook::set_once();

//     let document = web_sys::window().unwrap().document().unwrap();

//     let file_input_elt = document
//         .get_element_by_id("file-input")
//         .unwrap()
//         .dyn_into::<web_sys::HtmlInputElement>()
//         .unwrap();

//     let result_elt = document
//         .get_element_by_id("result")
//         .unwrap()
//         .dyn_into::<web_sys::HtmlElement>()
//         .unwrap();
//     let result_elt_copy1 = result_elt.clone();
//     let result_elt_copy2 = result_elt.clone();

//     let file_reader = web_sys::FileReader::new().unwrap();
//     let fr_c = file_reader.clone();

//     let onprogress = Closure::wrap(Box::new(move |_: web_sys::ProgressEvent| {
//         result_elt_copy1.set_inner_text("On progress...");
//     }) as Box<dyn FnMut(_)>);
//     file_reader.set_onprogress(Some(onprogress.as_ref().unchecked_ref()));
//     onprogress.forget();

//     let onerror = Closure::wrap(Box::new(move |_: web_sys::ProgressEvent| {
//         result_elt_copy2.set_inner_text("An error occured");
//     }) as Box<dyn FnMut(_)>);
//     file_reader.set_onerror(Some(onerror.as_ref().unchecked_ref()));
//     onerror.forget();

//     let onloadended = Closure::wrap(Box::new(move |e: web_sys::ProgressEvent| {
//         let file_reader: web_sys::FileReader = e.target().unwrap().dyn_into().unwrap();
//         let array = Uint8Array::new(&file_reader.result().unwrap());

//         console::log_1(&JsValue::from_str("Loading GTFS"));
//         result_elt.set_inner_text("Loading GTFS");

//         let model = read(array.to_vec());

//         console::log_1(&JsValue::from_str("GTFS Loaded"));
//         result_elt.set_inner_text(&format!("GTFS Loaded: There are {} lines", model.lines.len()));
//     }) as Box<dyn FnMut(_)>);
//     file_reader.set_onloadend(Some(onloadended.as_ref().unchecked_ref()));
//     onloadended.forget();

//     let onchange = Closure::wrap(Box::new(move |e: web_sys::Event| {
//         let input: web_sys::HtmlInputElement = e.target().unwrap().dyn_into().unwrap();
//         let files = input.files().unwrap();
//         let file = files.get(0).unwrap();
//         fr_c.read_as_array_buffer(&file).unwrap();
//     }) as Box<dyn FnMut(_)>);

//     file_input_elt.set_onchange(Some(onchange.as_ref().unchecked_ref()));
//     onchange.forget();

//     Ok(())
// }

#[wasm_bindgen]
pub fn number_of_stop_points(data: &Uint8Array) -> usize {
    let bytes = data.to_vec();

    let model = read(bytes);

    return model.stop_points.len();
}

fn read(bytes: Vec<u8>) -> Model {
    let (contributor, dataset, feed_infos) = read_utils::read_config(None::<&str>).unwrap();

    let configuration = transit_model::gtfs::Configuration {
        contributor,
        dataset,
        feed_infos,
        prefix_conf: None,
        on_demand_transport: false,
        on_demand_transport_comment: None,
    };

    let reader = Cursor::new(bytes);
    let mut file_handler = read_utils::ZipHandler::new(reader, "").unwrap();
    gtfs::read(&mut file_handler, configuration).unwrap()
}
