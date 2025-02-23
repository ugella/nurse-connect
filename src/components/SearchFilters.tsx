import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { DatePickerWithRange } from "./ui/date-picker-with-range";
import { DateRange } from "@/lib/types";

interface SearchFiltersProps {
  onSearch: (term: string) => void;
  onSpecialtyChange: (specialty: string) => void;
  onServiceTypeChange: (type: string) => void;
  onDateRangeChange: (range: DateRange) => void;
}

const specialties = [
  "All Specialties",
  "ICU",
  "Emergency",
  "Pediatrics",
  "Critical Care",
  "NICU",
  "Family Care",
  "Trauma",
];

const serviceTypes = [
  "All Services",
  "Shift Coverage",
  "Live-in Care",
  "Specialized Care",
];

const SearchFilters = ({
  onSearch,
  onSpecialtyChange,
  onServiceTypeChange,
  onDateRangeChange,
}: SearchFiltersProps) => {
  const [date, setDate] = useState<DateRange | undefined>();

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          placeholder="Search nurses..."
          onChange={(e) => onSearch(e.target.value)}
          className="w-full"
        />
        <Select onValueChange={onSpecialtyChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select Specialty" />
          </SelectTrigger>
          <SelectContent>
            {specialties.map((specialty) => (
              <SelectItem key={specialty} value={specialty}>
                {specialty}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={onServiceTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Service Type" />
          </SelectTrigger>
          <SelectContent>
            {serviceTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DatePickerWithRange
          date={date}
          onDateChange={(newDate) => {
            setDate(newDate);
            if (newDate?.from && newDate?.to) {
              onDateRangeChange(newDate);
            }
          }}
        />
      </div>
    </div>
  );
};

export default SearchFilters;
