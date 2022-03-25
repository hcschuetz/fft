import { ComplexArray, getComplex, makeComplexArray, setComplex } from "fft/dst/complex/ComplexArray";

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
    func: async (size: number, direction: number = 1) => {
      console.log(name, "A")
      const module = await import(`fft/dst_cpp_js/${name}`);
      console.log(name, "B")
      const instance = await (module.default)();
      const input = instance._malloc(size * 16);
      const output = instance._malloc(size * 16);
      const fft = instance._prepare_fft(size);
      // TODO Use finalization (FinalizationRegistry) to call
      //   instance._free(input)
      //   instance._free(output)
      //   instance._delete_fft(fft)
      // to avoid a memory leak?
      // But probably the memory can be garbage-collected together with the
      // instance anyway.
      // (And we have no need to free input/output/fft before the instance.)
    
      const out = makeComplexArray(size);

      return (data: ComplexArray) => {
        // TODO avoid data reshuffling (in particular for benchmarks)
        for (let i = 0; i < size; i++) {
          const {re, im} = getComplex(data, i);
          const addr = input + 16 * i;
          instance.setValue(addr    , re, "double");
          instance.setValue(addr + 8, im, "double");
        }

        instance._run_fft(fft, input, output, direction);

        for (let i = 0; i < size; i++) {
          const addr = output + 16 * i;
          setComplex(out, i, {
            re: instance.getValue(addr    , "double"),
            im: instance.getValue(addr + 8, "double"),
          });
        }

        return out;
      };
    },
  }
});
