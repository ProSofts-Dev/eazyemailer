import { Mail, Phone, MapPin } from "lucide-react";

const CONTACT_INFO = [
  {
    icon: Mail,
    label: "Email",
    value: "support@example.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+1 (555) 123-4567",
  },
  {
    icon: MapPin,
    label: "Address",
    value: "123 Business Ave, Suite 100, City, ST 12345",
  },
];

export function ContactInfo() {
  return (
    <div className="space-y-4">
      {CONTACT_INFO.map(({ icon: Icon, label, value }) => (
        <div key={label} className="flex items-start gap-3">
          <Icon className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">{label}</p>
            <p className="text-sm text-muted-foreground">{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}