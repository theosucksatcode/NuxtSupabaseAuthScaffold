const PASSWORD_REQUIREMENTS = [
  { regex: /.{8,}/, text: "At least 8 characters" },
  { regex: /\d/, text: "At least 1 number" },
  { regex: /[a-z]/, text: "At least 1 lowercase letter" },
  { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
  { regex: /[^a-zA-Z0-9]/, text: "At least 1 symbol" },
];

export function usePasswordStrength() {
  const passwordValue = ref("");
  const strength = computed(() =>
    PASSWORD_REQUIREMENTS.map((req) => ({
      met: req.regex.test(passwordValue.value),
      text: req.text,
    })),
  );
  return { passwordValue, strength };
}
