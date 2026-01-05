//Allocating a fixed space of 8 bytes
const buffer = new ArrayBuffer(8);
// console.log(buffer);

const float = {
  int_8: new Int8Array(buffer), //  8/8 = 1 byte per element = 8 bytes -> 8/1 = 8
  uint_8: new Uint8Array(buffer), // 8/8 = 1 byte per element = 8 bytes -> 8/1 = 8
  int_16: new Int16Array(buffer), // 16/8 = 2 byte per element = 4 bytes -> 16/2 = 8
  uint_16: new Uint16Array(buffer), // 16/8 = 2 byte per element = 4 bytes -> 16/2 = 8
  uint_32: new Uint32Array(buffer), // 32/8 = 4 byte per element = 2 bytes -> 32/4 = 8
  float_32: new Float32Array(buffer), // 32/8 = 4 byte per element = 2 bytes -> 32/4 = 8
  bint_64: new BigUint64Array(buffer), // 64/8 = 8 byte per element = 1 bytes -> 64/8 = 8
};
console.log((float.int_16[0] = 20));
console.log(float);
const no_of_bytes = {
  int_8: Int8Array.BYTES_PER_ELEMENT,
  uint_8: Uint8Array.BYTES_PER_ELEMENT,
  uint_16: Uint16Array.BYTES_PER_ELEMENT,
};
console.log(no_of_bytes);
