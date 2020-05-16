/* tslint:disable */
/* eslint-disable */
/**
* @param {string} name 
*/
export function greet(name: string): void;
/**
*/
export enum ViewType {
  TRANSVERSE,
  SAGITTAL,
  CORONAL,
}
export class GlCanvas {
  free(): void;
/**
* @param {string} canvas_id 
* @param {number} width 
* @param {number} height 
* @param {number} win 
* @param {number} level 
* @returns {GlCanvas} 
*/
  static new(canvas_id: string, width: number, height: number, win: number, level: number): GlCanvas;
/**
* @param {number} w 
* @param {number} h 
*/
  set_canvas_dim(w: number, h: number): void;
/**
* @param {number} s0 
* @param {number} s1 
* @param {number} s2 
*/
  set_shift(s0: number, s1: number, s2: number): void;
/**
* @returns {Float32Array} 
*/
  get_shift(): Float32Array;
/**
* @param {number} window 
*/
  set_window(window: number): void;
/**
* @returns {number} 
*/
  get_window(): number;
/**
* @param {number} level 
*/
  set_level(level: number): void;
/**
* @returns {number} 
*/
  get_level(): number;
/**
* @param {number} scale 
*/
  set_scale_transverse(scale: number): void;
/**
* @returns {number} 
*/
  get_scale_transverse(): number;
/**
* @param {number} scale 
*/
  set_scale_sagittal(scale: number): void;
/**
* @returns {number} 
*/
  get_scale_sagittal(): number;
/**
* @param {number} scale 
*/
  set_scale_coronal(scale: number): void;
/**
* @returns {number} 
*/
  get_scale_coronal(): number;
/**
* @param {number} x 
* @param {number} y 
*/
  set_pan_transverse(x: number, y: number): void;
/**
* @param {number} x 
*/
  set_pan_transverse_x(x: number): void;
/**
* @returns {number} 
*/
  get_pan_transverse_x(): number;
/**
* @param {number} y 
*/
  set_pan_transverse_y(y: number): void;
/**
* @returns {number} 
*/
  get_pan_transverse_y(): number;
/**
* @param {number} x 
*/
  set_pan_sagittal_x(x: number): void;
/**
* @returns {number} 
*/
  get_pan_sagittal_x(): number;
/**
* @param {number} y 
*/
  set_pan_sagittal_y(y: number): void;
/**
* @returns {number} 
*/
  get_pan_sagittal_y(): number;
/**
* @param {number} x 
*/
  set_pan_coronal_x(x: number): void;
/**
* @returns {number} 
*/
  get_pan_coronal_x(): number;
/**
* @param {number} z 
*/
  set_pan_coronal_y(z: number): void;
/**
* @returns {number} 
*/
  get_pan_coronal_y(): number;
/**
* @param {number} slice 
*/
  set_slice_transverse(slice: number): void;
/**
* @returns {number} 
*/
  get_slice_transverse(): number;
/**
* @param {number} slice 
*/
  set_slice_sagittal(slice: number): void;
/**
* @returns {number} 
*/
  get_slice_sagittal(): number;
/**
* @param {number} slice 
*/
  set_slice_coronal(slice: number): void;
/**
* @returns {number} 
*/
  get_slice_coronal(): number;
/**
* @param {number} k 
*/
  set_blend(k: number): void;
/**
* @param {ArrayBuffer} buffer 
* @param {number} w 
* @param {number} h 
* @param {number} d 
* @param {number} spacing_x 
* @param {number} spacing_y 
* @param {number} spacing_z 
*/
  load_primary(buffer: ArrayBuffer, w: number, h: number, d: number, spacing_x: number, spacing_y: number, spacing_z: number): void;
/**
* @param {ArrayBuffer} buffer 
* @param {number} w 
* @param {number} h 
* @param {number} d 
* @param {number} spacing_x 
* @param {number} spacing_y 
* @param {number} spacing_z 
*/
  load_secondary(buffer: ArrayBuffer, w: number, h: number, d: number, spacing_x: number, spacing_y: number, spacing_z: number): void;
/**
*/
  setup_geometry(): void;
/**
*/
  render(): void;
  level: number;
  window: number;
}
