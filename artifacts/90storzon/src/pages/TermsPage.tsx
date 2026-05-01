import { useEffect } from "react";

export default function TermsPage() {
  useEffect(() => { document.title = "Terms & Conditions — 90StorZon"; }, []);

  const sections = [
    { title: "Acceptance of Terms", content: "By accessing or using 90StorZon, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our service." },
    { title: "Use of Services", content: "You agree to use our services only for lawful purposes. You must not use the platform to distribute harmful content, violate any laws, or infringe on the rights of others." },
    { title: "User Accounts", content: "You are responsible for maintaining the confidentiality of your account credentials. You are responsible for all activities that occur under your account." },
    { title: "Intellectual Property", content: "The content, design, and tools on 90StorZon are the intellectual property of 90StorZon. You may not reproduce or distribute them without written permission." },
    { title: "Free Tools", content: "Our tools are provided 'as is' without warranty of any kind. While we strive for accuracy, we do not guarantee the results of any calculator or tool." },
    { title: "Shop & Products", content: "Product purchases redirect to external stores. We are not responsible for transactions conducted on third-party platforms. Always review the external seller's terms." },
    { title: "Limitation of Liability", content: "90StorZon shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform." },
    { title: "Changes to Terms", content: "We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms." },
    { title: "Contact", content: "For questions about these Terms, please contact us via our Contact page." },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-4xl font-bold text-foreground mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Terms &amp; Conditions</h1>
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
