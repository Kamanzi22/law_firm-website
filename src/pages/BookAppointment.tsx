import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Seo } from "../components/seo/Seo";
import { Button } from "../components/ui/Button";
import { ProgressBar } from "../components/booking/ProgressBar";
import { Step1Matter } from "../components/booking/Step1Matter";
import { Step2Schedule } from "../components/booking/Step2Schedule";
import { Step3Details } from "../components/booking/Step3Details";
import { Step4Review } from "../components/booking/Step4Review";
import { SuccessScreen } from "../components/booking/SuccessScreen";
import { strings } from "../data/strings";
import { submitBooking, type BookingResult } from "../lib/submitBooking";
import { isRequired, isValidEmail, isValidPhone, isValidBookingDate } from "../lib/validation";
import { useAppData } from "../lib/DataProvider";
import { initialBookingForm, type BookingFormState, type BookingFormErrors, type ConsultationMode, type PreferredLanguage } from "../components/booking/types";

const TOTAL_STEPS = 4;

export function BookAppointment() {
  const { getServiceBySlug, bookingSettings } = useAppData();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<BookingFormState>(initialBookingForm);
  const [errors, setErrors] = useState<BookingFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<BookingResult | null>(null);

  useEffect(() => {
    const matterParam = searchParams.get("matter");
    if (matterParam && getServiceBySlug(matterParam)) {
      setForm((prev) => ({ ...prev, matterType: matterParam }));
    }
    // Only read the prefill once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  function updateForm<K extends keyof BookingFormState>(field: K, value: BookingFormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validateStep(targetStep: number): boolean {
    const next: BookingFormErrors = {};

    if (targetStep === 1) {
      if (!isRequired(form.matterType)) next.matterType = "Please select a matter type.";
    }

    if (targetStep === 2) {
      if (!form.mode) next.mode = "Please choose a consultation mode.";
      if (!isValidBookingDate(form.date, bookingSettings)) {
        next.date = form.date
          ? "Please choose a weekday that is today or later."
          : "Please select a date.";
      }
      if (!form.time) next.time = "Please select a time.";
    }

    if (targetStep === 3) {
      if (!isRequired(form.name)) next.name = "Please enter your full name.";
      if (!isValidEmail(form.email)) next.email = "Please enter a valid email address.";
      if (!isValidPhone(form.phone)) next.phone = "Please enter a valid phone number.";
      if (!isRequired(form.description)) next.description = "Please briefly describe your matter.";
      if (!form.consent) next.consent = "Please confirm consent to proceed.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleNext() {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
    }
  }

  function handleBack() {
    setStep((prev) => Math.max(prev - 1, 1));
  }

  function handleEditStep(targetStep: number) {
    setStep(targetStep);
  }

  async function handleSubmit() {
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) return;

    setIsSubmitting(true);
    const bookingResult = await submitBooking({
      matterType: form.matterType,
      mode: form.mode as "in-person" | "video" | "phone",
      date: form.date,
      time: form.time,
      name: form.name,
      email: form.email,
      phone: form.phone,
      language: form.language,
      description: form.description,
      consent: form.consent,
    });
    setIsSubmitting(false);
    setResult(bookingResult);
  }

  function handleBookAnother() {
    setForm(initialBookingForm);
    setErrors({});
    setResult(null);
    setStep(1);
  }

  return (
    <>
      <Seo title={strings.booking.pageHeading} description={strings.booking.pageSubheading} path="/book" />

      <section className="bg-brand-teal py-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl font-semibold text-brand-navy sm:text-4xl">
            {strings.booking.pageHeading}
          </h1>
          <p className="mt-3 text-brand-navy/80">{strings.booking.pageSubheading}</p>
        </div>
      </section>

      <section className="bg-brand-cream py-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {result ? (
            <SuccessScreen result={result} onBookAnother={handleBookAnother} />
          ) : (
            <>
              <ProgressBar currentStep={step} />

              <div className="mt-10 rounded-sm border border-brand-gray-200 bg-white p-6 sm:p-8">
                {step === 1 && (
                  <Step1Matter
                    value={form.matterType}
                    onChange={(value) => updateForm("matterType", value)}
                    error={errors.matterType}
                  />
                )}

                {step === 2 && (
                  <Step2Schedule
                    mode={form.mode}
                    date={form.date}
                    time={form.time}
                    onChangeMode={(mode: ConsultationMode) => updateForm("mode", mode)}
                    onChangeDate={(date) => updateForm("date", date)}
                    onChangeTime={(time) => updateForm("time", time)}
                    errors={{ mode: errors.mode, date: errors.date, time: errors.time }}
                    settings={bookingSettings}
                  />
                )}

                {step === 3 && (
                  <Step3Details
                    values={{
                      name: form.name,
                      email: form.email,
                      phone: form.phone,
                      language: form.language,
                      description: form.description,
                      consent: form.consent,
                    }}
                    onChange={(field, value) => {
                      if (field === "language") {
                        updateForm("language", value as PreferredLanguage);
                      } else if (field === "consent") {
                        updateForm("consent", value as boolean);
                      } else {
                        updateForm(field, value as string);
                      }
                    }}
                    errors={{
                      name: errors.name,
                      email: errors.email,
                      phone: errors.phone,
                      description: errors.description,
                      consent: errors.consent,
                    }}
                  />
                )}

                {step === 4 && <Step4Review values={form} onEditStep={handleEditStep} />}

                <div className="mt-10 flex items-center justify-between border-t border-brand-gray-200 pt-6">
                  {step > 1 ? (
                    <Button type="button" variant="ghost" onClick={handleBack}>
                      {strings.booking.back}
                    </Button>
                  ) : (
                    <span />
                  )}

                  {step < TOTAL_STEPS ? (
                    <Button type="button" onClick={handleNext}>
                      {strings.booking.next}
                    </Button>
                  ) : (
                    <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
                      {isSubmitting ? strings.booking.submitting : strings.booking.submit}
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
