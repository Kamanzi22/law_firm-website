import { strings } from "../../data/strings";
import { formatDateLong, formatTime12h } from "../../lib/format";
import { useAppData } from "../../lib/DataProvider";
import type { BookingFormState } from "./types";

interface Step4Props {
  values: BookingFormState;
  onEditStep: (step: number) => void;
}

const modeLabels: Record<string, string> = {
  "in-person": strings.booking.modeInPerson,
  video: strings.booking.modeVideo,
  phone: strings.booking.modePhone,
};

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-6 py-2 text-sm">
      <span className="text-brand-gray-500">{label}</span>
      <span className="text-right font-medium text-brand-navy">{value}</span>
    </div>
  );
}

export function Step4Review({ values, onEditStep }: Step4Props) {
  const { getServiceBySlug } = useAppData();
  const service = getServiceBySlug(values.matterType);

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold text-brand-navy">{strings.booking.step4Title}</h2>
      <p className="mt-1 text-brand-gray-500">{strings.booking.step4Subtitle}</p>

      <div className="mt-6 space-y-6">
        <section className="rounded-sm border border-brand-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-brand-navy">{strings.booking.stepLabels[0]}</h3>
            <button
              type="button"
              onClick={() => onEditStep(1)}
              className="text-sm font-medium text-brand-gold-dark hover:text-brand-navy"
            >
              {strings.booking.editStep}
            </button>
          </div>
          <ReviewRow label="Practice area" value={service?.name ?? "—"} />
        </section>

        <section className="rounded-sm border border-brand-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-brand-navy">{strings.booking.stepLabels[1]}</h3>
            <button
              type="button"
              onClick={() => onEditStep(2)}
              className="text-sm font-medium text-brand-gold-dark hover:text-brand-navy"
            >
              {strings.booking.editStep}
            </button>
          </div>
          <ReviewRow label="Mode" value={modeLabels[values.mode] ?? "—"} />
          <ReviewRow label="Date" value={formatDateLong(values.date)} />
          <ReviewRow label="Time" value={formatTime12h(values.time)} />
        </section>

        <section className="rounded-sm border border-brand-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-brand-navy">{strings.booking.stepLabels[2]}</h3>
            <button
              type="button"
              onClick={() => onEditStep(3)}
              className="text-sm font-medium text-brand-gold-dark hover:text-brand-navy"
            >
              {strings.booking.editStep}
            </button>
          </div>
          <ReviewRow label="Name" value={values.name} />
          <ReviewRow label="Email" value={values.email} />
          <ReviewRow label="Phone" value={values.phone} />
          <ReviewRow label="Language" value={values.language} />
          <div className="pt-2">
            <p className="text-sm text-brand-gray-500">Matter description</p>
            <p className="mt-1 text-sm text-brand-navy">{values.description}</p>
          </div>
        </section>
      </div>
    </div>
  );
}
