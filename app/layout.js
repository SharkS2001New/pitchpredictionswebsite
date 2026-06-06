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
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
