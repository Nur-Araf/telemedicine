import ContactContent from "@/src/components/ContactContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Teliclinicbd",
  description:
    "Send a message to Teliclinicbd. Ask about a campaign near you, offer to help as a doctor, or find out how to contribute.",
};

export default function ContactPage() {
  return <ContactContent />;
}
