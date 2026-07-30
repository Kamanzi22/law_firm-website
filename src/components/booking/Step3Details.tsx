import { strings } from "../../data/strings";
import type { BookingFormState, BookingFormErrors, PreferredLanguage } from "./types";

type Step3Values = Pick<BookingFormState, "name" | "email" | "phone" | "language" | "description" | "consent">;

interface Step3Props {
  values: Step3Values;
  onChange: (field: keyof Step3Values, value: string | boolean) => void;
  errors: Pick<BookingFormErrors, "name" | "email" | "phone" | "description" | "consent">;
}

const languages: PreferredLanguage[] = ["English", "French", "Kinyarwanda"];

export function Step3Details({ values, onChange, errors }: Step3Props) {
  return (
    <div>
      <h2 className="font-display text-2xl font-semibold text-brand-navy">{strings.booking.step3Title}</h2>
      <p className="mt-1 text-brand-gray-500">{strings.booking.step3Subtitle}</p>

      <div className="mt-6 space-y-5">
        <div>
          <label htmlFor="booking-name" className="block text-sm font-medium text-brand-navy">
            {strings.booking.nameLabel}
          </label>
          <input
            id="booking-name"
            type="text"
            value={values.name}
            onChange={(e) => onChange("name", e.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "booking-name-error" : undefined}
            className="mt-1.5 w-full rounded-sm border border-brand-gray-300 bg-white px-4 py-2.5 text-brand-navy focus-visible:border-brand-gold-dark"
          />
          {errors.name && (
            <p id="booking-name-error" role="alert" className="mt-1.5 text-sm text-red-600">
              {errors.name}
            </p>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="booking-email" className="block text-sm font-medium text-brand-navy">
              {strings.booking.emailLabel}
            </label>
            <input
              id="booking-email"
              type="email"
              value={values.email}
              onChange={(e) => onChange("email", e.target.value)}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "booking-email-error" : undefined}
              className="mt-1.5 w-full rounded-sm border border-brand-gray-300 bg-white px-4 py-2.5 text-brand-navy focus-visible:border-brand-gold-dark"
            />
            {errors.email && (
              <p id="booking-email-error" role="alert" className="mt-1.5 text-sm text-red-600">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="booking-phone" className="block text-sm font-medium text-brand-navy">
              {strings.booking.phoneLabel}
            </label>
            <input
              id="booking-phone"
              type="tel"
              value={values.phone}
              onChange={(e) => onChange("phone", e.target.value)}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? "booking-phone-error" : undefined}
              className="mt-1.5 w-full rounded-sm border border-brand-gray-300 bg-white px-4 py-2.5 text-brand-navy focus-visible:border-brand-gold-dark"
            />
            {errors.phone && (
              <p id="booking-phone-error" role="alert" className="mt-1.5 text-sm text-red-600">
                {errors.phone}
              </p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="booking-language" className="block text-sm font-medium text-brand-navy">
            {strings.booking.languageLabel}
          </label>
          <select
            id="booking-language"
            value={values.language}
            onChange={(e) => onChange("language", e.target.value as PreferredLanguage)}
            className="mt-1.5 w-full rounded-sm border border-brand-gray-300 bg-white px-4 py-2.5 text-brand-navy focus-visible:border-brand-gold-dark sm:w-1/2"
          >
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="booking-description" className="block text-sm font-medium text-brand-navy">
            {strings.booking.descriptionLabel}
          </label>
          <textarea
            id="booking-description"
            rows={4}
            placeholder={strings.booking.descriptionPlaceholder}
            value={values.description}
            onChange={(e) => onChange("description", e.target.value)}
            aria-invalid={Boolean(errors.description)}
            aria-describedby={errors.description ? "booking-description-error" : undefined}
            className="mt-1.5 w-full rounded-sm border border-brand-gray-300 bg-white px-4 py-2.5 text-brand-navy focus-visible:border-brand-gold-dark"
          />
          {errors.description && (
            <p id="booking-description-error" role="alert" className="mt-1.5 text-sm text-red-600">
              {errors.description}
            </p>
          )}
        </div>

        <div>
          <label className="flex items-start gap-3 text-sm text-brand-gray-600">
            <input
              type="checkbox"
              checked={values.consent}
              onChange={(e) => onChange("consent", e.target.checked)}
              aria-invalid={Boolean(errors.consent)}
              aria-describedby={errors.consent ? "booking-consent-error" : undefined}
              className="mt-0.5 h-4 w-4 shrink-0 accent-[#5c7a32]"
            />
            <span>{strings.booking.consentLabel}</span>
          </label>
          {errors.consent && (
            <p id="booking-consent-error" role="alert" className="mt-1.5 text-sm text-red-600">
              {errors.consent}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
