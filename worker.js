onmessage = async (event) => {
  const { data, code, duration } = event.data;

  let result;
  try {
    const asyncFunction = new Function(
      "data",
      "code",
      `
        return (async () => {
          let PERF__ops = 0;
          let PERF__start = Date.now();
          let PERF__end = Date.now() + ${duration};
          ${data}
  
          while (Date.now() < PERF__end) {
            ${code}
            PERF__ops++;
          }
          return PERF__ops;
        })();
      `
    );

    result = await asyncFunction(data, code);
  } catch (error) {
    result = 0;
    console.error(error);
  }

  postMessage(result);
};
