export default defineAppConfig({
  ui: {
    colors: {
      neutral: "neutral",
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
  },
});
