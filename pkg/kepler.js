import * as wasm from './kepler_bg.wasm';

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

const lTextDecoder = typeof TextDecoder === 'undefined' ? require('util').TextDecoder : TextDecoder;

let cachedTextDecoder = new lTextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

let WASM_VECTOR_LEN = 0;

const lTextEncoder = typeof TextEncoder === 'undefined' ? require('util').TextEncoder : TextEncoder;

let cachedTextEncoder = new lTextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length);
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len);

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3);
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachegetInt32Memory0 = null;
function getInt32Memory0() {
    if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
        cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachegetInt32Memory0;
}

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1 };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) wasm.__wbindgen_export_2.get(dtor)(a, state.b);
            else state.a = a;
        }
    };
    real.original = state;
    return real;
}
function __wbg_adapter_24(arg0, arg1) {
    wasm._dyn_core__ops__function__FnMut_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__hb5f4ab0214dc77a0(arg0, arg1);
}

/**
* @param {string} name
*/
export function greet(name) {
    var ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    wasm.greet(ptr0, len0);
}

let stack_pointer = 32;

function addBorrowedObject(obj) {
    if (stack_pointer == 1) throw new Error('out of js stack');
    heap[--stack_pointer] = obj;
    return stack_pointer;
}
/**
* @param {string} canvas_id
*/
export function start(canvas_id) {
    var ptr0 = passStringToWasm0(canvas_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    wasm.start(ptr0, len0);
}

function handleError(e) {
    wasm.__wbindgen_exn_store(addHeapObject(e));
}

function isLikeNone(x) {
    return x === undefined || x === null;
}
/**
*/
export const ViewType = Object.freeze({ TRANSVERSE:0,SAGITTAL:1,CORONAL:2, });
/**
*/
export class GlCanvas {

    static __wrap(ptr) {
        const obj = Object.create(GlCanvas.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_glcanvas_free(ptr);
    }
    /**
    * @returns {number}
    */
    get window() {
        var ret = wasm.__wbg_get_glcanvas_window(this.ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set window(arg0) {
        wasm.__wbg_set_glcanvas_window(this.ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get level() {
        var ret = wasm.__wbg_get_glcanvas_level(this.ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set level(arg0) {
        wasm.__wbg_set_glcanvas_level(this.ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get scale_transverse() {
        var ret = wasm.__wbg_get_glcanvas_scale_transverse(this.ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set scale_transverse(arg0) {
        wasm.__wbg_set_glcanvas_scale_transverse(this.ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get scale_sagittal() {
        var ret = wasm.__wbg_get_glcanvas_scale_sagittal(this.ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set scale_sagittal(arg0) {
        wasm.__wbg_set_glcanvas_scale_sagittal(this.ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get scale_coronal() {
        var ret = wasm.__wbg_get_glcanvas_scale_coronal(this.ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set scale_coronal(arg0) {
        wasm.__wbg_set_glcanvas_scale_coronal(this.ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get pan_transverse_x() {
        var ret = wasm.__wbg_get_glcanvas_pan_transverse_x(this.ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set pan_transverse_x(arg0) {
        wasm.__wbg_set_glcanvas_pan_transverse_x(this.ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get pan_transverse_y() {
        var ret = wasm.__wbg_get_glcanvas_pan_transverse_y(this.ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set pan_transverse_y(arg0) {
        wasm.__wbg_set_glcanvas_pan_transverse_y(this.ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get pan_sagittal_x() {
        var ret = wasm.__wbg_get_glcanvas_pan_sagittal_x(this.ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set pan_sagittal_x(arg0) {
        wasm.__wbg_set_glcanvas_pan_sagittal_x(this.ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get pan_sagittal_y() {
        var ret = wasm.__wbg_get_glcanvas_pan_sagittal_y(this.ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set pan_sagittal_y(arg0) {
        wasm.__wbg_set_glcanvas_pan_sagittal_y(this.ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get pan_coronal_x() {
        var ret = wasm.__wbg_get_glcanvas_pan_coronal_x(this.ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set pan_coronal_x(arg0) {
        wasm.__wbg_set_glcanvas_pan_coronal_x(this.ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get pan_coronal_y() {
        var ret = wasm.__wbg_get_glcanvas_pan_coronal_y(this.ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set pan_coronal_y(arg0) {
        wasm.__wbg_set_glcanvas_pan_coronal_y(this.ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get slice_transverse() {
        var ret = wasm.__wbg_get_glcanvas_slice_transverse(this.ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set slice_transverse(arg0) {
        wasm.__wbg_set_glcanvas_slice_transverse(this.ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get slice_sagittal() {
        var ret = wasm.__wbg_get_glcanvas_slice_sagittal(this.ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set slice_sagittal(arg0) {
        wasm.__wbg_set_glcanvas_slice_sagittal(this.ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get slice_coronal() {
        var ret = wasm.__wbg_get_glcanvas_slice_coronal(this.ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set slice_coronal(arg0) {
        wasm.__wbg_set_glcanvas_slice_coronal(this.ptr, arg0);
    }
    /**
    * @param {string} canvas_id
    * @param {number} width
    * @param {number} height
    * @param {number} win
    * @param {number} level
    * @returns {GlCanvas}
    */
    static new(canvas_id, width, height, win, level) {
        var ptr0 = passStringToWasm0(canvas_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.glcanvas_new(ptr0, len0, width, height, win, level);
        return GlCanvas.__wrap(ret);
    }
    /**
    * @param {number} window
    */
    set_window(window) {
        wasm.glcanvas_set_window(this.ptr, window);
    }
    /**
    * @param {number} level
    */
    set_level(level) {
        wasm.glcanvas_set_level(this.ptr, level);
    }
    /**
    * @param {number} scale
    */
    set_scale_transverse(scale) {
        wasm.glcanvas_set_scale_transverse(this.ptr, scale);
    }
    /**
    * @param {number} scale
    */
    set_scale_sagittal(scale) {
        wasm.glcanvas_set_scale_sagittal(this.ptr, scale);
    }
    /**
    * @param {number} scale
    */
    set_scale_coronal(scale) {
        wasm.glcanvas_set_scale_coronal(this.ptr, scale);
    }
    /**
    * @param {number} x
    */
    set_pan_transverse_x(x) {
        wasm.glcanvas_set_pan_transverse_x(this.ptr, x);
    }
    /**
    * @param {number} y
    */
    set_pan_transverse_y(y) {
        wasm.glcanvas_set_pan_transverse_y(this.ptr, y);
    }
    /**
    * @param {number} x
    */
    set_pan_sagittal_x(x) {
        wasm.glcanvas_set_pan_sagittal_x(this.ptr, x);
    }
    /**
    * @param {number} y
    */
    set_pan_sagittal_y(y) {
        wasm.glcanvas_set_pan_sagittal_y(this.ptr, y);
    }
    /**
    * @param {number} x
    */
    set_pan_coronal_x(x) {
        wasm.glcanvas_set_pan_coronal_x(this.ptr, x);
    }
    /**
    * @param {number} y
    */
    set_pan_coronal_y(y) {
        wasm.glcanvas_set_pan_coronal_y(this.ptr, y);
    }
    /**
    * @param {number} dx
    */
    set_pan_dx(dx) {
        wasm.glcanvas_set_pan_dx(this.ptr, dx);
    }
    /**
    * @param {number} dy
    */
    set_pan_dy(dy) {
        wasm.glcanvas_set_pan_dy(this.ptr, dy);
    }
    /**
    * @param {number} slice
    */
    set_slice_transverse(slice) {
        wasm.glcanvas_set_slice_transverse(this.ptr, slice);
    }
    /**
    * @param {number} slice
    */
    set_slice_sagittal(slice) {
        wasm.glcanvas_set_slice_sagittal(this.ptr, slice);
    }
    /**
    * @param {number} slice
    */
    set_slice_coronal(slice) {
        wasm.glcanvas_set_slice_coronal(this.ptr, slice);
    }
    /**
    */
    load_shaders() {
        wasm.glcanvas_load_shaders(this.ptr);
    }
    /**
    * @param {File} file
    * @param {number} w
    * @param {number} h
    * @param {number} d
    */
    load_volume_from_file(file, w, h, d) {
        try {
            wasm.glcanvas_load_volume_from_file(this.ptr, addBorrowedObject(file), w, h, d);
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
    /**
    */
    setup_geometry() {
        wasm.glcanvas_setup_geometry(this.ptr);
    }
    /**
    */
    render() {
        wasm.glcanvas_render(this.ptr);
    }
}

export const __wbindgen_object_drop_ref = function(arg0) {
    takeObject(arg0);
};

export const __wbg_alert_5555fbce5a6ff9fc = function(arg0, arg1) {
    alert(getStringFromWasm0(arg0, arg1));
};

export const __wbindgen_string_new = function(arg0, arg1) {
    var ret = getStringFromWasm0(arg0, arg1);
    return addHeapObject(ret);
};

export const __wbg_log_86916f586434335d = function(arg0, arg1) {
    console.log(getStringFromWasm0(arg0, arg1));
};

export const __wbindgen_cb_forget = function(arg0) {
    takeObject(arg0);
};

export const __wbg_log_43f6fd50cc863d25 = function(arg0) {
    console.log(getObject(arg0));
};

export const __wbindgen_cb_drop = function(arg0) {
    const obj = takeObject(arg0).original;
    if (obj.cnt-- == 1) {
        obj.a = 0;
        return true;
    }
    var ret = false;
    return ret;
};

export const __wbg_instanceof_WebGl2RenderingContext_1f3735f620a46ed0 = function(arg0) {
    var ret = getObject(arg0) instanceof WebGL2RenderingContext;
    return ret;
};

export const __wbg_bufferData_6549623b1921a65d = function(arg0, arg1, arg2, arg3) {
    getObject(arg0).bufferData(arg1 >>> 0, getObject(arg2), arg3 >>> 0);
};

export const __wbg_texImage3D_61a8d06c94e3b714 = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10) {
    try {
        getObject(arg0).texImage3D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8 >>> 0, arg9 >>> 0, getObject(arg10));
    } catch (e) {
        handleError(e)
    }
};

export const __wbg_activeTexture_a028007a12293386 = function(arg0, arg1) {
    getObject(arg0).activeTexture(arg1 >>> 0);
};

export const __wbg_attachShader_305577eef1795451 = function(arg0, arg1, arg2) {
    getObject(arg0).attachShader(getObject(arg1), getObject(arg2));
};

export const __wbg_bindBuffer_dd644867600dd01b = function(arg0, arg1, arg2) {
    getObject(arg0).bindBuffer(arg1 >>> 0, getObject(arg2));
};

export const __wbg_bindTexture_0816769faad5e92e = function(arg0, arg1, arg2) {
    getObject(arg0).bindTexture(arg1 >>> 0, getObject(arg2));
};

export const __wbg_clear_58479a778c092864 = function(arg0, arg1) {
    getObject(arg0).clear(arg1 >>> 0);
};

export const __wbg_clearColor_949566ffaa5fb96c = function(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).clearColor(arg1, arg2, arg3, arg4);
};

export const __wbg_compileShader_45710a0ce6f0c07c = function(arg0, arg1) {
    getObject(arg0).compileShader(getObject(arg1));
};

export const __wbg_createBuffer_976d5f2090e9b4e8 = function(arg0) {
    var ret = getObject(arg0).createBuffer();
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

export const __wbg_createProgram_7dce303a3ca4aaec = function(arg0) {
    var ret = getObject(arg0).createProgram();
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

export const __wbg_createShader_4a9e685c994bbdae = function(arg0, arg1) {
    var ret = getObject(arg0).createShader(arg1 >>> 0);
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

export const __wbg_createTexture_72648c03c7fa1750 = function(arg0) {
    var ret = getObject(arg0).createTexture();
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

export const __wbg_drawArrays_6051def3c6695806 = function(arg0, arg1, arg2, arg3) {
    getObject(arg0).drawArrays(arg1 >>> 0, arg2, arg3);
};

export const __wbg_drawElements_427ff273a1d052d9 = function(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).drawElements(arg1 >>> 0, arg2, arg3 >>> 0, arg4);
};

export const __wbg_enableVertexAttribArray_11b8883880c5dc6e = function(arg0, arg1) {
    getObject(arg0).enableVertexAttribArray(arg1 >>> 0);
};

export const __wbg_getProgramInfoLog_9a9b27354754fb8d = function(arg0, arg1, arg2) {
    var ret = getObject(arg1).getProgramInfoLog(getObject(arg2));
    var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};

export const __wbg_getProgramParameter_91518b8ba0773684 = function(arg0, arg1, arg2) {
    var ret = getObject(arg0).getProgramParameter(getObject(arg1), arg2 >>> 0);
    return addHeapObject(ret);
};

export const __wbg_getShaderInfoLog_d35460ddd4fc5752 = function(arg0, arg1, arg2) {
    var ret = getObject(arg1).getShaderInfoLog(getObject(arg2));
    var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};

export const __wbg_getShaderParameter_7be7bfb09e311949 = function(arg0, arg1, arg2) {
    var ret = getObject(arg0).getShaderParameter(getObject(arg1), arg2 >>> 0);
    return addHeapObject(ret);
};

export const __wbg_getUniformLocation_34cdcb1c7d68bf1a = function(arg0, arg1, arg2, arg3) {
    var ret = getObject(arg0).getUniformLocation(getObject(arg1), getStringFromWasm0(arg2, arg3));
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

export const __wbg_linkProgram_c6b3aa4d4b30a5e6 = function(arg0, arg1) {
    getObject(arg0).linkProgram(getObject(arg1));
};

export const __wbg_shaderSource_0e9274d7500d354f = function(arg0, arg1, arg2, arg3) {
    getObject(arg0).shaderSource(getObject(arg1), getStringFromWasm0(arg2, arg3));
};

export const __wbg_texParameteri_87fcd3e492a1e4dd = function(arg0, arg1, arg2, arg3) {
    getObject(arg0).texParameteri(arg1 >>> 0, arg2 >>> 0, arg3);
};

export const __wbg_uniform1f_6e9ab56dc8f65c9e = function(arg0, arg1, arg2) {
    getObject(arg0).uniform1f(getObject(arg1), arg2);
};

export const __wbg_uniform1i_9a7856dfa4d25de9 = function(arg0, arg1, arg2) {
    getObject(arg0).uniform1i(getObject(arg1), arg2);
};

export const __wbg_useProgram_6201d054f7b93dbe = function(arg0, arg1) {
    getObject(arg0).useProgram(getObject(arg1));
};

export const __wbg_vertexAttribPointer_b32d32aae9201729 = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
    getObject(arg0).vertexAttribPointer(arg1 >>> 0, arg2, arg3 >>> 0, arg4 !== 0, arg5, arg6);
};

export const __wbg_viewport_08b88cd0ea10990b = function(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).viewport(arg1, arg2, arg3, arg4);
};

export const __wbg_instanceof_Window_a633dbe0900c728a = function(arg0) {
    var ret = getObject(arg0) instanceof Window;
    return ret;
};

export const __wbg_document_07444f1bbea314bb = function(arg0) {
    var ret = getObject(arg0).document;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

export const __wbg_getElementById_633c94a971ae0eb9 = function(arg0, arg1, arg2) {
    var ret = getObject(arg0).getElementById(getStringFromWasm0(arg1, arg2));
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

export const __wbg_result_4f99115c0a8ff657 = function(arg0) {
    try {
        var ret = getObject(arg0).result;
        return addHeapObject(ret);
    } catch (e) {
        handleError(e)
    }
};

export const __wbg_onload_35bb6a560977bae7 = function(arg0, arg1) {
    getObject(arg0).onload = getObject(arg1);
};

export const __wbg_new_83ddc3220fe2272a = function() {
    try {
        var ret = new FileReader();
        return addHeapObject(ret);
    } catch (e) {
        handleError(e)
    }
};

export const __wbg_readAsArrayBuffer_6b8eee67f132eb47 = function(arg0, arg1) {
    try {
        getObject(arg0).readAsArrayBuffer(getObject(arg1));
    } catch (e) {
        handleError(e)
    }
};

export const __wbg_instanceof_HtmlCanvasElement_c6a06fc9a851a478 = function(arg0) {
    var ret = getObject(arg0) instanceof HTMLCanvasElement;
    return ret;
};

export const __wbg_getContext_2151b76e11a6eb39 = function(arg0, arg1, arg2) {
    try {
        var ret = getObject(arg0).getContext(getStringFromWasm0(arg1, arg2));
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    } catch (e) {
        handleError(e)
    }
};

export const __wbg_instanceof_ArrayBuffer_d851e92b8b88a310 = function(arg0) {
    var ret = getObject(arg0) instanceof ArrayBuffer;
    return ret;
};

export const __wbg_newnoargs_ebdc90c3d1e4e55d = function(arg0, arg1) {
    var ret = new Function(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
};

export const __wbg_call_804d3ad7e8acd4d5 = function(arg0, arg1) {
    try {
        var ret = getObject(arg0).call(getObject(arg1));
        return addHeapObject(ret);
    } catch (e) {
        handleError(e)
    }
};

export const __wbg_globalThis_48a5e9494e623f26 = function() {
    try {
        var ret = globalThis.globalThis;
        return addHeapObject(ret);
    } catch (e) {
        handleError(e)
    }
};

export const __wbg_self_25067cb019cade42 = function() {
    try {
        var ret = self.self;
        return addHeapObject(ret);
    } catch (e) {
        handleError(e)
    }
};

export const __wbg_window_9e80200b35aa30f8 = function() {
    try {
        var ret = window.window;
        return addHeapObject(ret);
    } catch (e) {
        handleError(e)
    }
};

export const __wbg_global_7583a634265a91fc = function() {
    try {
        var ret = global.global;
        return addHeapObject(ret);
    } catch (e) {
        handleError(e)
    }
};

export const __wbindgen_is_undefined = function(arg0) {
    var ret = getObject(arg0) === undefined;
    return ret;
};

export const __wbg_buffer_f897a8d316863411 = function(arg0) {
    var ret = getObject(arg0).buffer;
    return addHeapObject(ret);
};

export const __wbg_newwithbyteoffsetandlength_b0113130daafc7e9 = function(arg0, arg1, arg2) {
    var ret = new Uint16Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
    return addHeapObject(ret);
};

export const __wbg_newwithbyteoffsetandlength_7ccfa06426575282 = function(arg0, arg1, arg2) {
    var ret = new Float32Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
    return addHeapObject(ret);
};

export const __wbg_newwithbyteoffset_618efb438fcb4bf9 = function(arg0, arg1) {
    var ret = new Uint16Array(getObject(arg0), arg1 >>> 0);
    return addHeapObject(ret);
};

export const __wbindgen_object_clone_ref = function(arg0) {
    var ret = getObject(arg0);
    return addHeapObject(ret);
};

export const __wbindgen_boolean_get = function(arg0) {
    const v = getObject(arg0);
    var ret = typeof(v) === 'boolean' ? (v ? 1 : 0) : 2;
    return ret;
};

export const __wbindgen_debug_string = function(arg0, arg1) {
    var ret = debugString(getObject(arg1));
    var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};

export const __wbindgen_throw = function(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

export const __wbindgen_rethrow = function(arg0) {
    throw takeObject(arg0);
};

export const __wbindgen_memory = function() {
    var ret = wasm.memory;
    return addHeapObject(ret);
};

export const __wbindgen_closure_wrapper199 = function(arg0, arg1, arg2) {
    var ret = makeMutClosure(arg0, arg1, 18, __wbg_adapter_24);
    return addHeapObject(ret);
};

