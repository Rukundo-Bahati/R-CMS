import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin } from "lucide-react";

export default function Placeholder() {
  const { portal, section } = useParams<{ portal?: string; section?: string }>();
  const navigate = useNavigate();

  const formatSectionName = (name?: string) => {
    if (!name) return "Section";
    return name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-md text-center">
        <div className="mb-6 p-4 bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
          <MapPin className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {formatSectionName(section)}
        </h2>
        <p className="text-gray-600 mb-6">
          This page is coming soon. Let us know what you'd like to see here, and
          we'll get it built for you!
        </p>
        <Button
          onClick={() => navigate(-1)}
          variant="outline"
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </Button>
      </div>
    </div>
  );
}
