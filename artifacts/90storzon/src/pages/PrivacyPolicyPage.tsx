import { useEffect } from "react";

export default function PrivacyPolicyPage() {
  useEffect(() => { document.title = "Privacy Policy — 90StorZon"; }, []);

  const sections = [
    { title: "Information We Collect", content: "We collect information you provide directly to us (such as name and email during registration), and information collected automatically (such as pages visited and referring website) for analytics purposes." },
    { title: "How We Use Your Information", content: "We use the information we collect to: provide and improve our services, personalize your experience, send you account-related notifications, and analyze usage patterns to improve the platform." },
    { title: "Information Sharing", content: "We do not sell, trade, or rent your personal identification information to others. We may share aggregate, anonymized data for analytics purposes." },
    { title: "Data Security", content: "We implement appropriate security measures to protect your personal information. Passwords are hashed using industry-standard cryptographic methods and never stored in plain text." },
    { title: "Cookies", content: "We use session cookies to maintain your login state. These cookies are essential for the authentication system to function. They expire after 7 days." },
    { title: "Third-Party Links", content: "Our website contains links to external sites. We are not responsible for the privacy practices of those sites and encourage you to read their privacy policies." },
    { title: "Your Rights", content: "You may request deletion of your account and associated data at any time by contacting us. You may also update your information via your account dashboard." },
    { title: "Contact Us", content: "If you have questions about this Privacy Policy, please contact us via our Contact page." },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-4xl font-bold text-foreground mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Privacy Policy</h1>
      <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>

      <div className="space-y-8">
        {sections.map((section) => (
          <div key={section.title}>
            <h2 className="text-xl font-semibold text-foreground mb-2">{section.title}</h2>
            <p className="text-muted-foreground leading-relaxed">{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
