// These simplistic implementations suffice for now
// as these functions are not called in performance-critical code.
// Otherwise we might use something like
// - memset() from https://embeddedartistry.com/blog/2017/03/22/memset-memcpy-memcmp-and-memmove/
// - memcpy() from https://opensource.apple.com/source/xnu/xnu-2050.7.9/libsyscall/wrappers/memcpy.c
// Or call the linker in such a way that it takes these functions
// from the std lib but still leaving cos and sin unresolved

typedef unsigned long size_t;

typedef unsigned char* byte_ptr_t;

void* memset(void* dst, int val, size_t n) {
  byte_ptr_t dst_ = (byte_ptr_t) dst;
  for (size_t i = 0; i < n; i++) {
    dst_[i] = val;
  }
  return dst;
}

void* memcpy(void* dst, const void* src, size_t n) {
  byte_ptr_t dst_ = (byte_ptr_t) dst;
  byte_ptr_t src_ = (byte_ptr_t) src;
  for (size_t i = 0; i < n; i++) {
    dst_[i] = src_[i];
  }
  return dst;
}

void* memmove(void* dst, const void* src, size_t n) {
  byte_ptr_t dst_ = (byte_ptr_t) dst;
  byte_ptr_t src_ = (byte_ptr_t) src;

  if (dst_ == src_ || n == 0) {
    // do nothing
  } else if (dst_ > src_) { // Is this condition ok also for corner cases?
    for (long i = n - 1; i != -1; i--) {
      dst_[i] = src_[i];
    }
  } else {
    for (size_t i = 0; i < n; i++) {
      dst_[i] = src_[i];
    }
  }
  return dst;
}

// We might also provide malloc/free here
// - home-grown or
// - Doug Lea's malloc or
// - something a simplistic as the malloc in
//   https://surma.dev/things/c-to-webassembly/
