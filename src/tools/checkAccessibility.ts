export function checkAccessibility(code: string) {
    const signals = {
      hasAriaLabel: code.includes("aria-label"),
      hasAriaDescribedBy: code.includes("aria-describedby"),
      hasRole: code.includes("role="),
      hasButtonElement: code.includes("<button"),
    };
  
    const issues: string[] = [];
  
    if (
      signals.hasButtonElement &&
      !signals.hasAriaLabel &&
      !signals.hasAriaDescribedBy
    ) {
      issues.push(
        "Button component does not appear to provide explicit accessibility attributes."
      );
    }
  
    return {
      signals,
      issues,
      passed: issues.length === 0,
    };
  }