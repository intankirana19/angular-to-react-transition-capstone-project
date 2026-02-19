import { useState } from 'react';
import { cloneDateRange } from '@/shared/lib/dateRange';
import { type DateRangeValue } from '@/shared/types/dateRange';

type UseFilterDialogDraftStateOptions = {
  allValue: string; // FILTER[0]: nilai default saat filter belum aktif
  baseSelectValue: string; // FILTER[0]: snapshot select filter aktif dari page
  baseDateRange: DateRangeValue | undefined; // FILTER[0]: snapshot date filter aktif dari page
  onApplySelectValue: (value: string) => void; // FILTER[0]: callback commit select filter ke page
  onApplyDateRange: (value: DateRangeValue | undefined) => void; // FILTER[0]: callback commit date filter ke page
};

// FILTER[1]: Hook reusable untuk alur draft FILTER di dialog saat open/edit/apply/clear
export function useFilterDialogDraftState({
  allValue,
  baseSelectValue,
  baseDateRange,
  onApplySelectValue,
  onApplyDateRange,
}: UseFilterDialogDraftStateOptions) {
  const [isDialogOpen, setDialogOpen] = useState(false); // FILTER[2]: state buka/tutup dialog
  const [draftSelectValue, setDraftSelectValue] = useState(allValue); // FILTER[3]: draft select filter sebelum di-apply
  const [draftDateRange, setDraftDateRange] = useState<DateRangeValue | undefined>(undefined); // FILTER[4]: draft date filter sebelum di-apply

  function onDialogOpenChange(open: boolean) {
    setDialogOpen(open); // FILTER[5]: update state visibilitas dialog

    if (open) {
      setDraftSelectValue(baseSelectValue); // FILTER[6]: sync draft select dari filter aktif saat dialog dibuka
      setDraftDateRange(cloneDateRange(baseDateRange)); // FILTER[7]: sync draft range dari filter aktif saat dialog dibuka
    }
  }

  function applyDraft() {
    onApplySelectValue(draftSelectValue); // FILTER[8]: commit draft select ke filter aktif
    onApplyDateRange(cloneDateRange(draftDateRange)); // FILTER[9]: commit draft range ke filter aktif
    setDialogOpen(false); // FILTER[10]: tutup dialog setelah apply
  }

  function clearDraft() {
    setDraftSelectValue(allValue); // FILTER[11]: reset draft select tanpa ubah filter aktif
    setDraftDateRange(undefined); // FILTER[12]: reset draft range tanpa ubah filter aktif
  }

  return {
    isDialogOpen, // FILTER[13]: status buka/tutup dialog
    onDialogOpenChange, // FILTER[14]: handler open change + sync draft
    draftSelectValue, // FILTER[15]: nilai draft select filter
    setDraftSelectValue, // FILTER[16]: setter draft select filter
    draftDateRange, // FILTER[17]: nilai draft date filter
    setDraftDateRange, // FILTER[18]: setter draft date filter
    applyDraft, // FILTER[19]: commit draft ke state filter aktif
    clearDraft, // FILTER[20]: reset draft filter
  };
}
