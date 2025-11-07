declare module 'react-date-range' {
  import { Component, CSSProperties } from 'react';

  export interface DateRangeType {
    startDate: Date;
    endDate: Date;
    key: string;
    color?: string;
    autoFocus?: boolean;
    disabled?: boolean;
    showDateDisplay?: boolean;
  }

  export interface RangeKeyDict {
    selection: {
      startDate: Date;
      endDate: Date;
      key: string;
    };
  }

  export interface DateRangeProps {
    ranges?: DateRangeType[];
    onChange?: (ranges: RangeKeyDict) => void;
    showDateDisplay?: boolean;
    showMonthAndYearPickers?: boolean;
    showSelectionPreview?: boolean;
    showPreview?: boolean;
    moveRangeOnFirstSelection?: boolean;
    months?: number;
    direction?: 'horizontal' | 'vertical';
    rangeColors?: string[];
    disabledDates?: Date[];
    minDate?: Date;
    maxDate?: Date;
    editableDateInputs?: boolean;
    dragSelectionEnabled?: boolean;
    scroll?: {
      enabled?: boolean;
      calendarHeight?: number;
    };
    calendarFocus?: 'forwards' | 'backwards';
    className?: string;
    classNames?: {
      [key: string]: string;
    };
    style?: CSSProperties;
    [key: string]: unknown; // Allow additional props
  }

  export class DateRange extends Component<DateRangeProps> {}
}

