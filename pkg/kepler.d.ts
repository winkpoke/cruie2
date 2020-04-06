/* tslint:disable */
/* eslint-disable */
/**
* @param {string} name 
*/
export function greet(name: string): void;
/**
* @param {string} canvas_id 
*/
export function start(canvas_id: string): void;
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
* @param {number} window 
*/
  set_window(window: number): void;
/**
* @param {number} level 
*/
  set_level(level: number): void;
/**
* @param {number} scale 
*/
  set_scale_transverse(scale: number): void;
/**
* @param {number} scale 
*/
  set_scale_sagittal(scale: number): void;
/**
* @param {number} scale 
*/
  set_scale_coronal(scale: number): void;
/**
* @param {number} x 
*/
  set_pan_transverse_x(x: number): void;
/**
* @param {number} y 
*/
  set_pan_transverse_y(y: number): void;
/**
* @param {number} x 
*/
  set_pan_sagittal_x(x: number): void;
/**
* @param {number} y 
*/
  set_pan_sagittal_y(y: number): void;
/**
* @param {number} x 
*/
  set_pan_coronal_x(x: number): void;
/**
* @param {number} y 
*/
  set_pan_coronal_y(y: number): void;
/**
* @param {number} dx 
*/
  set_pan_dx(dx: number): void;
/**
* @param {number} dy 
*/
  set_pan_dy(dy: number): void;
/**
* @param {number} slice 
*/
  set_slice_transverse(slice: number): void;
/**
* @param {number} slice 
*/
  set_slice_sagittal(slice: number): void;
/**
* @param {number} slice 
*/
  set_slice_coronal(slice: number): void;
/**
*/
  load_shaders(): void;
/**
* @param {File} file 
* @param {number} w 
* @param {number} h 
* @param {number} d 
*/
  load_volume_from_file(file: File, w: number, h: number, d: number): void;
/**
*/
  setup_geometry(): void;
/**
*/
  render(): void;
  level: number;
  pan_coronal_x: number;
  pan_coronal_y: number;
  pan_sagittal_x: number;
  pan_sagittal_y: number;
  pan_transverse_x: number;
  pan_transverse_y: number;
  scale_coronal: number;
  scale_sagittal: number;
  scale_transverse: number;
  slice_coronal: number;
  slice_sagittal: number;
  slice_transverse: number;
  window: number;
}
