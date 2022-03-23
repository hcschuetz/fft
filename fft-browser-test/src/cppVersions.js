// TODO convert to TypeScript
import { getComplex, makeComplexArray, setComplex } from "fft/dst/complex/ComplexArray";

const modules = `
  fft01 fft02
  fft44 fft47 fft47pointers fft48
  fft99b fft99c
`.trim().split(/\s+/);

export const cppVersions = () => modules.map(name => {
  const name_cpp = name + "_cpp";
  return {
    name: name_cpp,
    actions: "tb", // TODO make configurable
    basedOn: [],
    comment: "C++ code compiled by emscripten",
    func: async (size, direction = 1) => {
      const module = await import(`fft_cpp_js/${name}.mjs`);
      const instance = await (module.default)();
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
