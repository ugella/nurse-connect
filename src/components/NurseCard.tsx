import { Star, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Nurse } from "@/lib/types";

interface NurseCardProps {
  nurse?: Nurse;
  onBook?: (nurseId: string) => void;
}

const defaultNurse: Nurse = {
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
};

const NurseCard = ({ nurse = defaultNurse, onBook }: NurseCardProps) => {
  return (
    <Card className="w-full bg-white">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={nurse.imageUrl} alt={nurse.name} />
              <AvatarFallback>{nurse.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center">
                <h3 className="font-semibold text-lg">{nurse.name}</h3>
                {nurse.isVerified && (
                  <CheckCircle className="h-4 w-4 text-blue-500 ml-2" />
                )}
              </div>
              <p className="text-sm text-gray-500">{nurse.specialty}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400" />
            <span className="ml-1 text-sm font-medium">{nurse.rating}</span>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Location:</span> {nurse.location}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Rate:</span> ${nurse.hourlyRate}/hr
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Availability:</span>{" "}
            {nurse.availability}
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            {nurse.specialties.map((specialty) => (
              <Badge key={specialty} variant="secondary">
                {specialty}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-4">
        <Button className="w-full" onClick={() => onBook?.(nurse.id)}>
          Book Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NurseCard;
