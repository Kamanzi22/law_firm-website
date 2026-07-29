import { CheckCircle2 } from "lucide-react";
import { strings } from "../../data/strings";
import { Button } from "../ui/Button";
import type { BookingResult } from "../../lib/submitBooking";

interface SuccessScreenProps {
  result: BookingResult;
  onBookAnother: () => void;
}

export function SuccessScreen({ result, onBookAnother }: SuccessScreenProps) {
  return (
    <div className="mx-auto max-w-lg text-center" role="status">
      <CheckCircle2 className="mx-auto h-16 w-16 text-green-600" aria-hidden="true" />
      <h2 className="mt-6 font-display text-3xl font-semibold text-brand-navy">{strings.booking.successTitle}</h2>
      <p className="mt-3 text-brand-gray-600">{strings.booking.successBody}</p>

      <div className="mt-6 inline-block rounded-sm border border-brand-gray-200 bg-brand-cream px-6 py-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-gray-500">
          {strings.booking.referenceLabel}
        </p>
        <p className="mt-1 font-display text-2xl font-semibold text-brand-navy">{result.referenceNumber}</p>
      </div>

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Button to="/" variant="ghost" size="md">
          {strings.booking.backHome}
        </Button>
        <Button onClick={onBookAnother} size="md">
          {strings.booking.bookAnother}
        </Button>
      </div>
    </div>
  );
}
