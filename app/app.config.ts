export default defineAppConfig({
  ui: {
    colors: {
      primary: "blue",
      neutral: "zinc",
    },
    button: {
      defaultVariants: {
        size: "xl",
      },
    },
    input: {
      defaultVariants: {
        size: "xl",
      },
    },
    link: {
      compoundVariants: [
        {
          active: false,
          disabled: false,
          class: ["text-primary", "font-medium", "underline"],
        },
      ],
    },
    card: {
      defaultVariants: {
        variant: "subtle",
      },
    },
    alert: {
      defaultVariants: {
        variant: "soft",
      },
    },
  },
});
