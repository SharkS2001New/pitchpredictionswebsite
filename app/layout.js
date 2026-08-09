import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../styles/globals.css";
import "../styles/new-styles.css";
import "../styles/matchdetails.css";
import "../styles/PopularTips.css";
import "../styles/auth-css.css";
import "../styles/blog.css";

export const metadata = {
  metadataBase: new URL("https://www.pitchpredictions.com"),
  icons: {
    icon: [
      { url: "/pitch_predictions_icons.ico", sizes: "any" },
      { url: "/pitch-predictions-icon-32.png", type: "image/png", sizes: "32x32" },
    ],
    shortcut: ["/pitch_predictions_icons.ico"],
    apple: [{ url: "/pitch-predictions-apple-touch.png", sizes: "180x180" }],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
