'use client'

import { useState, useRef } from "react";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/card";
import { useLanguage } from "@/shared/components/LanguageProvider";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';

interface Booking {
  id: string;
  startDate: string;
  endDate: string;
  customerName: string;
  customerEmail: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  totalPrice: number;
  notes?: string;
}

interface Car {
  id: string;
  photo: string;
  make: string;
  model: string;
  year: number;
  transmission: string;
  fuel: string;
  seats: number;
  price: number;
  status: 'active' | 'draft' | 'inactive';
  lastUpdate: string;
  bookings: Booking[];
}

interface CarCalendarViewProps {
  cars: Car[];
}

type CalendarEvent = {
  extendedProps: Record<string, unknown>;
  title: string;
  start: Date | null;
  end: Date | null;
};

export const CarCalendarView = ({ cars }: CarCalendarViewProps) => {
  const { t } = useLanguage();
  const calendarRef = useRef<FullCalendar>(null);
  const [viewMode, setViewMode] = useState<'dayGridMonth' | 'timeGridWeek' | 'listWeek'>('dayGridMonth');

  // Convert all bookings from all cars to FullCalendar events
  const events = cars.flatMap(car => 
    car.bookings.map(booking => {
      const getEventColor = (status: string) => {
        switch (status) {
          case 'confirmed': return '#10b981'; // green-500
          case 'pending': return '#f59e0b'; // yellow-500
          case 'cancelled': return '#ef4444'; // red-500
          default: return '#6b7280'; // gray-500
        }
      };

      return {
        id: booking.id,
        title: `${car.make} ${car.model} - ${booking.customerName}`,
        start: booking.startDate,
        end: booking.endDate,
        backgroundColor: getEventColor(booking.status),
        borderColor: getEventColor(booking.status),
        textColor: '#ffffff',
        extendedProps: {
          carId: car.id,
          car: car,
          customerName: booking.customerName,
          customerEmail: booking.customerEmail,
          status: booking.status,
          totalPrice: booking.totalPrice,
          notes: booking.notes
        }
      };
    })
  );

  const handleEventClick = (info: { event: CalendarEvent }) => {
    const event = info.event;
    const extendedProps = event.extendedProps;
    
    // You can add a modal or detailed view here
    console.log('Event clicked:', {
      car: extendedProps.car,
      customer: extendedProps.customerName,
      customerEmail: extendedProps.customerEmail,
      status: extendedProps.status,
      totalPrice: extendedProps.totalPrice,
      notes: extendedProps.notes,
      start: event.start,
      end: event.end
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5" />
          {t('vendor.carAvailabilityCalendar')}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {t('vendor.viewManageAvailability')}
        </p>
        
        {/* View Mode Toggle */}
        <div className="flex gap-2 mt-4">
          <Button
            variant={viewMode === 'dayGridMonth' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('dayGridMonth')}
          >
            {t('vendor.month')}
          </Button>
          <Button
            variant={viewMode === 'timeGridWeek' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('timeGridWeek')}
          >
            {t('vendor.week')}
          </Button>
          <Button
            variant={viewMode === 'listWeek' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('listWeek')}
          >
            {t('vendor.list')}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[600px]">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
            initialView={viewMode}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,listWeek'
            }}
            events={events}
            eventClick={handleEventClick}
            height="100%"
            dayMaxEvents={3}
            moreLinkClick="popover"
            eventDisplay="block"
            eventTextColor="#ffffff"
            eventBorderColor="transparent"
            eventBackgroundColor="#3b82f6"
            // Custom styling
            themeSystem="standard"
            buttonText={{
              today: t('vendor.today'),
              month: t('vendor.month'),
              week: t('vendor.week'),
              day: t('vendor.day'),
              list: t('vendor.list')
            }}
            // Responsive options
            aspectRatio={1.8}
            // Event rendering
            eventDidMount={(info: { event: CalendarEvent; el: HTMLElement }) => {
              // Add custom styling or tooltips
              const event = info.event;
              const status = event.extendedProps.status;
              
              // Add status indicator
              if (status === 'pending') {
                info.el.style.borderStyle = 'dashed';
              } else if (status === 'cancelled') {
                info.el.style.opacity = '0.6';
              }
            }}
          />
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>{t('vendor.confirmedBooking')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded border-dashed border-2"></div>
            <span>{t('vendor.pendingBooking')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded opacity-60"></div>
            <span>{t('vendor.cancelledBooking')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
