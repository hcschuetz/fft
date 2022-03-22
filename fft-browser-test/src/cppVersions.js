// TODO convert to TypeScript
import { getComplex, makeComplexArray, setComplex } from "fft/dst/complex/ComplexArray";

import fft01 from "fft_cpp_js/fft01.js";
import fft02 from "fft_cpp_js/fft02.js";
import fft44 from "fft_cpp_js/fft44.js";
import fft47 from "fft_cpp_js/fft47.js";
import fft47pointers from "fft_cpp_js/fft47pointers.js";
import fft48 from "fft_cpp_js/fft48.js";
import fft99b from "fft_cpp_js/fft99b.js";
import fft99c from "fft_cpp_js/fft99c.js";

const modules = {
  fft01, fft02,
  fft44, fft47, fft47pointers, fft48,
  fft99b, fft99c,
}

export const cppVersions = () => Object.entries(modules).map(([name, module]) => {
  const name_cpp = name + "_cpp";
  return {
    name: name_cpp,
    actions: "tb", // TODO make configurable
    basedOn: [],
    comment: "C++ code compiled by emscripten",
    func: async (size, direction = 1) => {
      // TODO import module dynamically here
      // (just like we have it for hand-written JS implementations)
      const instance = await (module)();
      const input = instance._malloc(size * 16);
      const output = instance._malloc(size * 16);
      const fft = instance._prepare_fft(size);
      // TODO Use finalization (FinalizationRegistry) to call
      // instance._free(input)
      // instance._free(output)
      // instance._delete_fft(fft)
    
      const out = makeComplexArray(size);

      return data => {
        // TODO avoid data reshuffling (in particular for benchmarks)
        for (let i = 0; i < size; i++) {
          const {re, im} = getComplex(data, i);
          instance.setValue(input + 16 * i    , re, "double");
          instance.setValue(input + 16 * i + 8, im, "double");
        }

        instance._run_fft(fft, input, output, direction);

        for (let i = 0; i < size; i++) {
          setComplex(out, i, {
            re: instance.getValue(output + 16 * i    , "double"),
            im: instance.getValue(output + 16 * i + 8, "double"),
          });
        }

        return out;
      };
    },
  }
});
