import { Nurse } from "@/lib/types";
import NurseCard from "./NurseCard";

interface NurseGridProps {
  nurses?: Nurse[];
  onBook: (nurseId: string) => void;
}

const defaultNurses: Nurse[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    specialty: "Registered Nurse",
    rating: 4.8,
    hourlyRate: 45,
    location: "San Francisco, CA",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=nurse1",
    isVerified: true,
    availability: "Available next week",
    specialties: ["ICU", "Emergency", "Pediatrics"],
  },
];

const NurseGrid = ({ nurses = defaultNurses, onBook }: NurseGridProps) => {
  if (!nurses || nurses.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No nurses found matching your criteria
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {nurses.map((nurse) => (
        <NurseCard key={nurse.id} nurse={nurse} onBook={onBook} />
      ))}
    </div>
  );
};

export default NurseGrid;
