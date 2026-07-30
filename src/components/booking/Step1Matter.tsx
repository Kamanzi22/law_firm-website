import { strings } from "../../data/strings";
import { ServiceIcon } from "../ui/ServiceIcon";
import { useAppData } from "../../lib/DataProvider";
import type { BookingFormState, BookingFormErrors } from "./types";

interface Step1Props {
  value: BookingFormState["matterType"];
  onChange: (value: string) => void;
  error?: BookingFormErrors["matterType"];
}

export function Step1Matter({ value, onChange, error }: Step1Props) {
  const { services } = useAppData();

  return (
    <fieldset>
      <legend className="font-display text-2xl font-semibold text-brand-navy">{strings.booking.step1Title}</legend>
      <p className="mt-1 text-brand-gray-500">{strings.booking.step1Subtitle}</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2" role="radiogroup" aria-label={strings.booking.step1Title}>
        {services.map((service) => {
          const isSelected = value === service.slug;
          return (
            <label
              key={service.slug}
              className={`flex cursor-pointer items-start gap-4 rounded-sm border-2 p-5 transition-colors ${
                isSelected ? "border-brand-gold-dark bg-brand-gold/5" : "border-brand-gray-200 hover:border-brand-gray-300"
              }`}
            >
              <input
                type="radio"
                name="matterType"
                value={service.slug}
                checked={isSelected}
                onChange={() => onChange(service.slug)}
                className="sr-only"
              />
              <div
                className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-sm ${
                  isSelected ? "bg-brand-gold-dark text-white" : "bg-brand-navy/5 text-brand-navy"
                }`}
              >
                <ServiceIcon icon={service.icon} className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-brand-navy">{service.name}</p>
                <p className="mt-1 text-sm text-brand-gray-500">{service.shortDescription}</p>
              </div>
            </label>
          );
        })}
      </div>

      {error && (
        <p role="alert" className="mt-3 text-sm text-red-600">
          {error}
        </p>
      )}
    </fieldset>
  );
}
