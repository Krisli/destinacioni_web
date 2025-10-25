'use client'

import { useState, useRef, useEffect } from 'react';
import { DateRange, RangeKeyDict } from 'react-date-range';
import { Calendar, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/shared/components/card';
import { cn } from '@/lib/utils';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

interface AirbnbDatePickerProps {
  startDate?: Date | null;
  endDate?: Date | null;
  onChange: (startDate: Date | null, endDate: Date | null) => void;
  disabledDates?: Date[];
  minDate?: Date;
  maxDate?: Date;
  minNights?: number;
  maxNights?: number;
  className?: string;
  placeholder?: string;
}

export const AirbnbDatePicker = ({
  startDate,
  endDate,
  onChange,
  disabledDates = [],
  minDate,
  maxDate,
  minNights = 1,
  maxNights,
  className,
  placeholder = "Select dates"
}: AirbnbDatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [ranges, setRanges] = useState([
    {
      startDate: startDate || new Date(),
      endDate: endDate || new Date(),
      key: 'selection',
    }
  ]);
  
  const pickerRef = useRef<HTMLDivElement>(null);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRangeChange = (ranges: RangeKeyDict) => {
    const selection = ranges.selection;
    if (selection) {
      setRanges([selection]);
      onChange(selection.startDate, selection.endDate);
    }
  };

  const clearSelection = () => {
    setRanges([{
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    }]);
    onChange(null, null);
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDisplayText = (): string => {
    if (startDate && endDate) {
      return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    } else if (startDate) {
      return `${formatDate(startDate)} - Select end date`;
    }
    return placeholder;
  };

  const isDateDisabled = (date: Date): boolean => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return disabledDates.some(disabledDate => 
      date.toDateString() === disabledDate.toDateString()
    );
  };

  return (
    <div className={cn("relative", className)} ref={pickerRef}>
      {/* Trigger Button */}
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-start text-left font-normal h-12"
      >
        <Calendar className="mr-3 h-4 w-4 text-muted-foreground" />
        <span className={cn(
          "flex-1",
          !startDate && "text-muted-foreground"
        )}>
          {getDisplayText()}
        </span>
        {startDate && endDate && (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              clearSelection();
            }}
            className="ml-2 h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </Button>

      {/* Date Picker Dropdown */}
      {isOpen && (
        <Card className="absolute top-full left-0 z-50 mt-2 shadow-xl border-0">
          <CardContent className="p-0">
            <div className="bg-white rounded-lg overflow-hidden">
              {/* Custom Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground">Select dates</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Date Range Picker */}
              <div className="p-4">
                <DateRange
                  editableDateInputs={false}
                  onChange={handleRangeChange}
                  moveRangeOnFirstSelection={false}
                  ranges={ranges}
                  months={2}
                  direction="horizontal"
                  showDateDisplay={false}
                  showMonthAndYearPickers={false}
                  showPreview={true}
                  disabledDates={disabledDates}
                  minDate={minDate}
                  maxDate={maxDate}
                  rangeColors={['#ef4444']} // Primary color
                  className="airbnb-date-picker"
                />
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-4 border-t border-border bg-muted/20">
                <div className="text-sm text-muted-foreground">
                  {minNights > 1 && `Minimum ${minNights} nights`}
                  {maxNights && ` • Maximum ${maxNights} nights`}
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => setIsOpen(false)}
                    disabled={!startDate || !endDate}
                    className="bg-primary hover:bg-primary-hover"
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Custom CSS for Airbnb-like styling */}
      <style jsx global>{`
        .airbnb-date-picker .rdrDefinedRangesWrapper {
          display: none;
        }
        
        .airbnb-date-picker .rdrDateDisplayWrapper {
          display: none;
        }
        
        .airbnb-date-picker .rdrCalendarWrapper {
          background: white;
        }
        
        .airbnb-date-picker .rdrMonth {
          padding: 0 8px;
        }
        
        .airbnb-date-picker .rdrMonthAndYearWrapper {
          padding: 16px 8px;
        }
        
        .airbnb-date-picker .rdrMonthAndYearPickers {
          font-weight: 600;
          font-size: 16px;
        }
        
        .airbnb-date-picker .rdrNextPrevButton {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          width: 32px;
          height: 32px;
        }
        
        .airbnb-date-picker .rdrNextPrevButton:hover {
          background: #f8fafc;
        }
        
        .airbnb-date-picker .rdrDay {
          border-radius: 8px;
          margin: 2px;
          font-weight: 500;
        }
        
        .airbnb-date-picker .rdrDay:hover {
          background: #f1f5f9;
        }
        
        .airbnb-date-picker .rdrDay.rdrDayInRange {
          background: #fef2f2;
          color: #ef4444;
        }
        
        .airbnb-date-picker .rdrDay.rdrDayStartOfRange,
        .airbnb-date-picker .rdrDay.rdrDayEndOfRange {
          background: #ef4444;
          color: white;
          border-radius: 8px;
        }
        
        .airbnb-date-picker .rdrDay.rdrDayStartOfRange {
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
        }
        
        .airbnb-date-picker .rdrDay.rdrDayEndOfRange {
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
        }
        
        .airbnb-date-picker .rdrDay.rdrDayDisabled {
          background: #f8fafc;
          color: #cbd5e1;
        }
        
        .airbnb-date-picker .rdrWeekDay {
          font-weight: 600;
          color: #64748b;
          font-size: 12px;
        }
        
        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .airbnb-date-picker .rdrMonths {
            flex-direction: column;
          }
          
          .airbnb-date-picker .rdrMonth {
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
};