import { Building2, Video, Phone as PhoneIcon } from "lucide-react";
import { strings } from "../../data/strings";
import type { BookingSettingsData, ConsultationModeValue } from "../../data/bookingSettings";
import { minDateString, generateBusinessHourSlots } from "../../lib/validation";
import { formatTime12h, describeBusinessDays } from "../../lib/format";
import type { BookingFormState, BookingFormErrors, ConsultationMode } from "./types";

interface Step2Props {
  mode: BookingFormState["mode"];
  date: BookingFormState["date"];
  time: BookingFormState["time"];
  onChangeMode: (mode: ConsultationMode) => void;
  onChangeDate: (date: string) => void;
  onChangeTime: (time: string) => void;
  errors: Pick<BookingFormErrors, "mode" | "date" | "time">;
  settings: BookingSettingsData;
}

const modeConfig: Record<ConsultationModeValue, { label: string; icon: typeof Building2 }> = {
  "in-person": { label: strings.booking.modeInPerson, icon: Building2 },
  video: { label: strings.booking.modeVideo, icon: Video },
  phone: { label: strings.booking.modePhone, icon: PhoneIcon },
};

export function Step2Schedule({
  mode,
  date,
  time,
  onChangeMode,
  onChangeDate,
  onChangeTime,
  errors,
  settings,
}: Step2Props) {
  const timeSlots = generateBusinessHourSlots(settings.businessStartTime, settings.businessEndTime);

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold text-brand-navy">{strings.booking.step2Title}</h2>
      <p className="mt-1 text-brand-gray-500">{strings.booking.step2Subtitle}</p>

      <fieldset className="mt-6">
        <legend className="sr-only">Consultation mode</legend>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3" role="radiogroup" aria-label="Consultation mode">
          {settings.modes.map((value) => {
            const option = modeConfig[value];
            const isSelected = mode === value;
            const Icon = option.icon;
            return (
              <label
                key={value}
                className={`flex cursor-pointer flex-col items-center gap-2 rounded-sm border-2 p-5 text-center transition-colors ${
                  isSelected ? "border-brand-gold bg-brand-gold/5" : "border-brand-gray-200 hover:border-brand-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="mode"
                  value={value}
                  checked={isSelected}
                  onChange={() => onChangeMode(value)}
                  className="sr-only"
                />
                <Icon
                  className={`h-6 w-6 ${isSelected ? "text-brand-gold-dark" : "text-brand-navy"}`}
                  aria-hidden="true"
                />
                <span className="font-medium text-brand-navy">{option.label}</span>
              </label>
            );
          })}
        </div>
        {errors.mode && (
          <p role="alert" className="mt-3 text-sm text-red-600">
            {errors.mode}
          </p>
        )}
      </fieldset>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="booking-date" className="block text-sm font-medium text-brand-navy">
            {strings.booking.dateLabel}
          </label>
          <input
            id="booking-date"
            type="date"
            value={date}
            min={minDateString()}
            onChange={(e) => onChangeDate(e.target.value)}
            aria-invalid={Boolean(errors.date)}
            aria-describedby={errors.date ? "booking-date-error" : "booking-date-hint"}
            className="mt-1.5 w-full rounded-sm border border-brand-gray-300 bg-white px-4 py-2.5 text-brand-navy focus-visible:border-brand-gold"
          />
          <p id="booking-date-hint" className="mt-1.5 text-xs text-brand-gray-400">
            {describeBusinessDays(settings.businessDays)}
          </p>
          {errors.date && (
            <p id="booking-date-error" role="alert" className="mt-1.5 text-sm text-red-600">
              {errors.date}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="booking-time" className="block text-sm font-medium text-brand-navy">
            {strings.booking.timeLabel}
          </label>
          <select
            id="booking-time"
            value={time}
            onChange={(e) => onChangeTime(e.target.value)}
            aria-invalid={Boolean(errors.time)}
            aria-describedby={errors.time ? "booking-time-error" : undefined}
            className="mt-1.5 w-full rounded-sm border border-brand-gray-300 bg-white px-4 py-2.5 text-brand-navy focus-visible:border-brand-gold"
          >
            <option value="">Select a time</option>
            {timeSlots.map((slot) => (
              <option key={slot} value={slot}>
                {formatTime12h(slot)}
              </option>
            ))}
          </select>
          {errors.time && (
            <p id="booking-time-error" role="alert" className="mt-1.5 text-sm text-red-600">
              {errors.time}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
