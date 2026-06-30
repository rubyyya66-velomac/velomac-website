import contactData from "./data/contact.json";
import { site } from "./site";

export const contactContent = {
  ...contactData,
  contactInfo: {
    email: site.email,
    whatsapp: site.whatsapp,
    location: site.location
  },
  form: {
    ...contactData.form,
    errorEmail: site.email
  }
};
