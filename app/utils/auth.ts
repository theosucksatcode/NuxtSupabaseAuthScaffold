export function emailOnInput(e: Event) {
  const input = e.target as HTMLInputElement;
  input.value = input.value.toLowerCase();
}
