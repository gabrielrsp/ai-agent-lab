export function checkTypes(code: string) {
    const signals = {
      hasInterface: code.includes("interface "),
      hasTypeAlias: code.includes("type "),
      hasTypedProps: /Props\b/.test(code),
      hasGenericReact: /React\.FC</.test(code),
    };
  
    const hasTypes = Object.values(signals).some(Boolean);
  
    return {
      hasTypes,
      signals,
      message: hasTypes
        ? "TypeScript typing detected."
        : "No explicit typing detected.",
    };
  }