export const steps: any = [
  {
    tour: 'first',
    steps: [
      {
        icon: <>👋</>,
        title: "Welcome to EazyEmailer!",
        content: <>See an overview of your emails and campaigns in Dashboard!</>,
        selector: "#dashboard",
        side: "right",
        showControls: true,
        pointerPadding: 8,
        pointerRadius: 24,
      },
      {
        icon: <>🪄</>,
        title: "Build your campaigns",
        content: (
          <>
            Create campaigns to <b>send targeted emails</b> to a specific group in your <b>contacts</b>!
          </>
        ),
        selector: "#campaigns",
        side: "right",
        showControls: true,
        pointerPadding: 8,
        pointerRadius: 24,
      },
      {
        icon: <>🎩</>,
        title: "Edit your email content!",
        content: (
          <>
            You can easily create or edit your email templates with our HTML Viewer. Just copy HTML code and paste in our editor.
          </>
        ),
        selector: "#templates",
        side: "right",
        showControls: true,
        pointerPadding: 8,
        pointerRadius: 24,
      },
      {
        icon: <>🌀</>,
        title: "Store your contacts",
        content: <>Store your contacts, add them in different groups to <b>create targeted campaigns</b> for better outreach! <br /> Track your subscribers as well!</>,
        selector: "#contacts",
        side: "right",
        showControls: true,
        pointerPadding: 8,
        pointerRadius: 24,
      },
      {
        icon: <>👉</>,
        title: "Plans and configuration",
        content: (
          <>
            Check your limits, edit your <b>email sender configuration</b> like sender name, email or <b>upgrade to a higher limit</b> from here.
          </>
        ),
        selector: "#settings",
        side: "right",
        showControls: true,
        pointerPadding: 8,
        pointerRadius: 24,
      },
    ]
  },
];