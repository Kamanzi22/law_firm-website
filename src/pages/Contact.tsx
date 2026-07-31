import { useState, type FormEvent } from "react";
import { MapPin, Phone, Mail, Clock, CheckCircle2 } from "lucide-react";
import { Seo } from "../components/seo/Seo";
import { Button } from "../components/ui/Button";
import { ContactHero } from "../components/heroes/ContactHero";
import { strings } from "../data/strings";
import { isRequired, isValidEmail, isValidPhone } from "../lib/validation";
import { submitContactMessage } from "../lib/submitContactMessage";
import { useAppData } from "../lib/DataProvider";

interface ContactFormState {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

type ContactFormErrors = Partial<Record<keyof ContactFormState, string>>;

const initialState: ContactFormState = { name: "", email: "", phone: "", subject: "", message: "" };

export function Contact() {
  const { firm } = useAppData();
  const [form, setForm] = useState<ContactFormState>(initialState);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  function validate(): boolean {
    const next: ContactFormErrors = {};
    if (!isRequired(form.name)) next.name = "Please enter your name.";
    if (!isValidEmail(form.email)) next.email = "Please enter a valid email address.";
    if (!isValidPhone(form.phone)) next.phone = "Please enter a valid phone number.";
    if (!isRequired(form.subject)) next.subject = "Please enter a subject.";
    if (!isRequired(form.message)) next.message = "Please enter a message.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    await submitContactMessage(form);
    setIsSubmitting(false);
    setIsSubmitted(true);
    setForm(initialState);
  }

  function updateField<K extends keyof ContactFormState>(field: K, value: ContactFormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  return (
    <>
      <Seo title={strings.contact.pageHeading} description={strings.contact.pageSubheading} path="/contact" />

      <ContactHero />

      <section className="bg-brand-cream py-20">
        <div className="mx-auto grid max-w-7xl gap-16 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <h2 className="font-display text-2xl font-semibold text-brand-navy">{strings.contact.officeHeading}</h2>
            <ul className="mt-6 space-y-4 text-brand-gray-600">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-gold-dark" aria-hidden="true" />
                <span>
                  {firm.address.line1}, {firm.address.line2}
                  <br />
                  {firm.address.city}, {firm.address.country}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0 text-brand-gold-dark" aria-hidden="true" />
                <a href={`tel:${firm.phoneHref}`} className="hover:text-brand-gold-dark">{firm.phone}</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 shrink-0 text-brand-gold-dark" aria-hidden="true" />
                <a href={`mailto:${firm.email}`} className="hover:text-brand-gold-dark">{firm.email}</a>
              </li>
            </ul>

            <h2 className="mt-10 flex items-center gap-2 font-display text-2xl font-semibold text-brand-navy">
              <Clock className="h-5 w-5 text-brand-gold-dark" aria-hidden="true" />
              {strings.contact.hoursHeading}
            </h2>
            <ul className="mt-4 space-y-2 text-brand-gray-600">
              {firm.hours.map((entry) => (
                <li key={entry.day} className="flex justify-between gap-6 border-b border-brand-gray-200 py-2 text-sm">
                  <span className="font-medium text-brand-navy">{entry.day}</span>
                  <span>{entry.hours}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 overflow-hidden rounded-sm" style={{ aspectRatio: "1200 / 700" }}>
              <img
                src="/images/map-placeholder.svg"
                alt="Map placeholder showing office location"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold text-brand-navy">{strings.contact.formHeading}</h2>

            {isSubmitted ? (
              <div className="mt-6 flex items-start gap-3 rounded-sm border border-green-600/30 bg-green-50 p-5">
                <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-green-700" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-green-800">{strings.contact.formSuccessTitle}</p>
                  <p className="mt-1 text-sm text-green-700">{strings.contact.formSuccessBody}</p>
                </div>
              </div>
            ) : (
              <form className="mt-6 space-y-5" onSubmit={handleSubmit} noValidate>
                <div>
                  <label htmlFor="contact-name" className="block text-sm font-medium text-brand-navy">
                    {strings.contact.formName}
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "contact-name-error" : undefined}
                    className="mt-1.5 w-full rounded-sm border border-brand-gray-300 bg-white px-4 py-2.5 text-brand-navy focus-visible:border-brand-gold-dark"
                  />
                  {errors.name && (
                    <p id="contact-name-error" className="mt-1.5 text-sm text-red-600">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-email" className="block text-sm font-medium text-brand-navy">
                      {strings.contact.formEmail}
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      value={form.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? "contact-email-error" : undefined}
                      className="mt-1.5 w-full rounded-sm border border-brand-gray-300 bg-white px-4 py-2.5 text-brand-navy focus-visible:border-brand-gold-dark"
                    />
                    {errors.email && (
                      <p id="contact-email-error" className="mt-1.5 text-sm text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="contact-phone" className="block text-sm font-medium text-brand-navy">
                      {strings.contact.formPhone}
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      aria-invalid={Boolean(errors.phone)}
                      aria-describedby={errors.phone ? "contact-phone-error" : undefined}
                      className="mt-1.5 w-full rounded-sm border border-brand-gray-300 bg-white px-4 py-2.5 text-brand-navy focus-visible:border-brand-gold-dark"
                    />
                    {errors.phone && (
                      <p id="contact-phone-error" className="mt-1.5 text-sm text-red-600">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-subject" className="block text-sm font-medium text-brand-navy">
                    {strings.contact.formSubject}
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    value={form.subject}
                    onChange={(e) => updateField("subject", e.target.value)}
                    aria-invalid={Boolean(errors.subject)}
                    aria-describedby={errors.subject ? "contact-subject-error" : undefined}
                    className="mt-1.5 w-full rounded-sm border border-brand-gray-300 bg-white px-4 py-2.5 text-brand-navy focus-visible:border-brand-gold-dark"
                  />
                  {errors.subject && (
                    <p id="contact-subject-error" className="mt-1.5 text-sm text-red-600">
                      {errors.subject}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-sm font-medium text-brand-navy">
                    {strings.contact.formMessage}
                  </label>
                  <textarea
                    id="contact-message"
                    rows={5}
                    value={form.message}
                    onChange={(e) => updateField("message", e.target.value)}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? "contact-message-error" : undefined}
                    className="mt-1.5 w-full rounded-sm border border-brand-gray-300 bg-white px-4 py-2.5 text-brand-navy focus-visible:border-brand-gold-dark"
                  />
                  {errors.message && (
                    <p id="contact-message-error" className="mt-1.5 text-sm text-red-600">
                      {errors.message}
                    </p>
                  )}
                </div>

                <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
                  {isSubmitting ? strings.common.loading : strings.contact.formSubmit}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
