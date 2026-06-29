import { site } from "./site";

export const contactContent = {
  metadata: {
    title: "Request a Flowmeter Quote | Velomac Flow Meter",
    description:
      "Send basic contact details and application requirements for a Velomac flowmeter quotation."
  },
  intro: {
    label: "Request a Quote",
    headline: "Send Site Details for Flowmeter Selection",
    description:
      "Share the product interest and any process details you already have. Velomac will review the application and follow up with the next step."
  },
  sidebar: {
    label: "Inquiry",
    headline: "Contact Information",
    helpfulDetailsTitle: "Helpful Details",
    helpfulDetailsText:
      "Fluid, pipe size, flow range, pressure, temperature, quantity, application background and any site details already available."
  },
  contactInfo: {
    email: site.email,
    whatsapp: site.whatsapp,
    location: site.location
  },
  form: {
    helperText:
      "Share what you know. Velomac will review the application and follow up with the next step.",
    fields: [
      { label: "Name", name: "name", type: "text", required: true, placeholder: "" },
      { label: "Company", name: "company", type: "text", required: true, placeholder: "" },
      { label: "Country", name: "country", type: "text", required: false, placeholder: "" },
      { label: "Email", name: "email", type: "email", required: true, placeholder: "" },
      { label: "WhatsApp / Phone", name: "whatsapp-phone", type: "text", required: false, placeholder: "" }
    ],
    productInterestLabel: "Product Interest",
    productInterestName: "product-interest",
    productInterestPlaceholder: "Select a product",
    requirementsLabel: "Your Requirements",
    requirementsName: "requirements",
    requirementsPlaceholder: "",
    attachmentLabel: "Attachment Upload (optional)",
    attachmentName: "attachment",
    submitLabel: "Submit Inquiry",
    confirmationMessage:
      "Thank you. Velomac will review your process details and contact you with the next step."
  }
};
