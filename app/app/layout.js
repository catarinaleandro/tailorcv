import './globals.css';
export const metadata = { title: 'TailorCV', description: 'Tailor a CV to a job posting from your own evidence, with an audit that flags unsupported claims.' };
export default function RootLayout({ children }) {
  return (<html lang="en"><body>{children}</body></html>);
}
