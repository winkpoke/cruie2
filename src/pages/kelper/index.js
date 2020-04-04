import React, {Component} from 'react';
import * as wasm from "hello-wasm-pack";
import { start, GlCanvas, ViewType } from "kepler";
//wasm.greet('ss');

class Kelper extends Component {



    componentDidMount(){

         let canvas = document.getElementById("mycanvas");
        let w = canvas.clientWidth;
        let h = canvas.clientHeight;
        var glcanvas = GlCanvas.new("mycanvas", w, h, 360, 12000, 15000);
        glcanvas.load_shaders();
        console.log(ViewType.SAGITTAL);
        var image_file = document.getElementById('read_image');
        image_file.addEventListener('change', function (e) {
            console.log(glcanvas.window);
            let file_name = image_file.files[0];
            // wasm.read_texture_file(file_name);
            glcanvas.load_volume_from_file(file_name, 1024, 1024, 360);
            glcanvas.set_window(12000);
            glcanvas.set_level(15000);
            glcanvas.setup_geometry();
            glcanvas.render();
        });

        slider_window.addEventListener('input', function(evt) {
            console.log(slider_window.value);
            let win = slider_window.value;
            glcanvas.set_window(win);
            glcanvas.render();
            // update_scene(context, win, lev, z, scale);
        }, false)

        slider_level.addEventListener('input', function(evt) {
            console.log(slider_level.value);
            let lev = slider_level.value;
            glcanvas.set_level(lev);
            glcanvas.render();
        }, false)

        slider_scale.addEventListener('input', function(evt) {
            console.log(slider_scale.value);
            let scale = slider_scale.value;
            if (radio_transverse.checked) {
                glcanvas.set_scale_transverse(scale);
            } else if (radio_sagittal.checked) {
                glcanvas.set_scale_sagittal(scale);
            } else if (radio_coronal.checked) {
                glcanvas.set_scale_coronal(scale);
            }
            glcanvas.render();
        }, false)
        slider_pan_x.addEventListener('input', function(evt) {
            console.log(slider_pan_x.value);
            let x = slider_pan_x.value;
            if (radio_transverse.checked) {
                glcanvas.set_pan_transverse_x(x);
            } else if (radio_sagittal.checked) {
                glcanvas.set_pan_sagittal_x(x);
            } else if (radio_coronal.checked) {
                glcanvas.set_pan_coronal_x(x);
            }
            glcanvas.render();
        }, false)
        slider_pan_y.addEventListener('input', function(evt) {
            console.log(slider_pan_y.value);
            let y = slider_pan_y.value;
            if (radio_transverse.checked) {
                glcanvas.set_pan_transverse_y(y);
            } else if (radio_sagittal.checked) {
                glcanvas.set_pan_sagittal_y(y);
            } else if (radio_coronal.checked) {
                glcanvas.set_pan_coronal_y(y);
            }
            glcanvas.render();
        }, false)
        slider_slice.addEventListener('input', function(evt) {
            console.log(slider_slice.value);
            let slice = slider_slice.value;
            if (radio_transverse.checked) {
                glcanvas.set_slice_transverse(slice);
            } else if (radio_sagittal.checked) {
                glcanvas.set_slice_sagittal(slice);
            } else if (radio_coronal.checked) {
                glcanvas.set_slice_coronal(slice);
            }
            glcanvas.render();
        }, false)
    }
    render() {
        return (
             <div>
                 <input type="file" id="read_image" multiple="multiple" /><br /><br />
                 <canvas id="mycanvas" width="750" height="500"></canvas>
                 {/*slider_window*/}
                 <div className="slide">
                     <input type="range" min="1" max="65535" name="slider_window" value="18500" onChange={this.fnChange.bind(this)} className="slider" id="slider_window"/>
                     <span>Window</span>
                 </div>
                 {/*slider_level*/}
                 <div className="slide">
                     <input type="range" min="0" max="65535" name="slider_level" value="12000" className="slider" id="slider_level"/>
                     <span>Level</span>
                 </div>
                 <form>
                     {/*pan*/}
                     <input type="radio" id="radio_transverse" name="pan" value="Transverse" />
                     <label htmlFor="transverse">Transverse</label>
                     <input type="radio" id="radio_sagittal" name="pan" value="Sagittal"/>
                     <label htmlFor="transverse">Sagittal</label>
                     <input type="radio" id="radio_coronal" name="pan" value="Coronal"/>
                    <label htmlFor="transverse">Coronal</label>
                 </form>
                 {/*scale*/}
                 <div className="slide">
                     <input type="range" min="1" max="10" name="slider_scale" value="1" step="0.1" className="slider" id="slider_scale"/>
                         <span>Zoom in/out</span>
                 </div>
                 {/*slider_pan_x*/}
                 <div className="slide">
                     <input type="range" min="-1" max="1" name="slider_pan_x" value="0" step="0.01" className="slider" id="slider_pan_x"/>
                         <span>Pan: X</span>
                 </div>
                 {/*slider_pan_y*/}
                 <div className="slide">
                     <input type="range" min="-1" max="1" name="slider_pan_y" value="0" step="0.01" className="slider" id="slider_pan_y"/>
                         <span>Pan: Y</span>
                 </div>
                 {/*slice*/}
                 <div className="slide">
                     <input type="range" min="0" max="1" name="slider_slice" value="0" step="0.01" className="slider" id="slider_slice"/>
                         <span>Slice</span>
                 </div>
             </div>
        );
    }
}


export default Kelper;
