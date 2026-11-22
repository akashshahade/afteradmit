export type PasswordChecks = {
  length: boolean;
  upper: boolean;
  lower: boolean;
  number: boolean;
  special: boolean;
};

export function passwordChecks(password: string): PasswordChecks {
  return {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
}

export function passwordScore(password: string) {
  const c = passwordChecks(password);
  return [c.length, c.upper, c.lower, c.number, c.special].filter(Boolean).length;
}

export function isPasswordStrong(password: string) {
  const c = passwordChecks(password);
  return c.length && c.upper && c.lower && c.number && c.special;
}

export const PASSWORD_RULES: { key: keyof PasswordChecks; label: string }[] = [
  { key: "length", label: "At least 8 characters" },
  { key: "upper", label: "One uppercase letter" },
  { key: "lower", label: "One lowercase letter" },
  { key: "number", label: "One number" },
  { key: "special", label: "One special character (!@#$…)" },
];
