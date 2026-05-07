import Link from "next/link";

const sections = [
    {
        title: "Information We Collect",
        content: [
            "When you place an order or contact us, we may collect your name, email address, WhatsApp number or Line ID, delivery or pick-up details, order items, payment proof image, payment-related notes, and messages you send to us.",
            "We do not ask customers to sign in with Google, and customers do not grant this website access to their Google account.",
        ],
    },
    {
        title: "How We Use Information",
        content: [
            "We use the information you provide to process orders, confirm payment proof, manage product stock, arrange delivery or pick-up, send order confirmation emails, respond to support requests, prevent misuse, and keep records needed for operational, accounting, or legal purposes.",
        ],
    },
    {
        title: "Google API Services",
        content: [
            "This website uses Google API Services through Solar Chapter's authorized Google account to support order operations. Order details may be recorded in Google Sheets, payment proof images may be uploaded to Google Drive, and order confirmation emails may be sent through Gmail.",
            "Solar Chapter's use and transfer of information received from Google APIs to any other app will adhere to the Google API Services User Data Policy, including the Limited Use requirements.",
        ],
    },
    {
        title: "How We Share Information",
        content: [
            "We do not sell your personal information. We may share information with service providers that help us operate the website and process orders, including Vercel for website hosting and Google services for Sheets, Drive, and Gmail.",
            "We may also disclose information when required by law, to protect our rights, or to prevent fraud, abuse, or security issues.",
        ],
    },
    {
        title: "Data Storage And Security",
        content: [
            "Order information and payment proof files may be stored in Google Workspace services used by Solar Chapter. Access is limited to authorized team members who need the information to process orders and operate the project.",
            "No online system can be guaranteed completely secure, but we use reasonable administrative and technical measures to protect the information we handle.",
        ],
    },
    {
        title: "Data Retention",
        content: [
            "We keep order information for as long as needed to complete the order, provide support, maintain operational records, and meet legal or accounting requirements. When information is no longer needed, we may delete it or retain it only in an aggregated or de-identified form.",
        ],
    },
    {
        title: "Your Choices",
        content: [
            "You may contact us to request access, correction, or deletion of personal information you provided. We may need to keep some records when required for legitimate operational, legal, or accounting reasons.",
        ],
    },
    {
        title: "Changes To This Policy",
        content: [
            "We may update this Privacy Policy from time to time. The updated version will be posted on this page with a new last updated date.",
        ],
    },
];

export default function PrivacyPolicyPage() {
    return (
        <main className="bg-white text-slate-600">
            <section className="mx-auto max-w-4xl px-6 py-14 sm:py-20">
                <Link href="/" className="text-sm font-medium text-slate-500 hover:text-slate-900">
                    &lt; Back to home
                </Link>

                <div className="mt-8">
                    <p className="text-sm font-medium uppercase tracking-wide text-slate-400">Solar Chapter</p>
                    <h1 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">Privacy Policy</h1>
                    <p className="mt-3 text-sm text-slate-400">Last updated: May 7, 2026</p>
                    <p className="mt-6 leading-7">
                        This Privacy Policy explains how Solar Chapter collects, uses, stores, and shares information
                        when you use the Kain Makna order website at{" "}
                        <Link href="https://solchap-makna.vercel.app/" className="font-medium text-slate-700 underline">
                            https://solchap-makna.vercel.app/
                        </Link>.
                    </p>
                </div>

                <div className="mt-10 space-y-9">
                    {sections.map((section) => (
                        <section key={section.title}>
                            <h2 className="text-xl font-semibold text-slate-900">{section.title}</h2>
                            <div className="mt-3 space-y-3 leading-7">
                                {section.content.map((paragraph) => (
                                    <p key={paragraph}>{paragraph}</p>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>

                <section className="mt-10 border-t border-slate-200 pt-8">
                    <h2 className="text-xl font-semibold text-slate-900">Contact Us</h2>
                    <p className="mt-3 leading-7">
                        If you have questions about this Privacy Policy or your personal information, contact us at{" "}
                        <Link href="mailto:solchap.makna@gmail.com" className="font-medium text-slate-700 underline">
                            solchap.makna@gmail.com
                        </Link>.
                    </p>
                </section>
            </section>
        </main>
    );
}
