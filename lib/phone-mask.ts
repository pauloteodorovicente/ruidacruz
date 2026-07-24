// Máscara simples baseada em template: "9" consome um dígito digitado,
// qualquer outro caractere é literal (espaço, parêntese, hífen).
export function extractDigits(value: string): string {
  return value.replace(/\D/g, "");
}

export function maskDigitCount(mask: string): number {
  return (mask.match(/9/g) ?? []).length;
}

export function applyMask(digits: string, mask: string): string {
  let result = "";
  let di = 0;
  for (let mi = 0; mi < mask.length && di < digits.length; mi++) {
    if (mask[mi] === "9") {
      result += digits[di];
      di++;
    } else {
      result += mask[mi];
    }
  }
  return result;
}

// Placeholder de exemplo (não é um número real) só pra ilustrar o formato:
// "999 999 999" -> "123 456 789".
export function examplePlaceholder(mask: string): string {
  let n = 0;
  return mask.replace(/9/g, () => {
    n++;
    return String(((n - 1) % 9) + 1);
  });
}
