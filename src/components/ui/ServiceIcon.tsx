import { Briefcase, Gavel, Users, Building2, Landmark, Lightbulb } from "lucide-react";
import type { LucideProps } from "lucide-react";
import type { Service } from "../../data/services";

const iconMap: Record<Service["icon"], typeof Briefcase> = {
  briefcase: Briefcase,
  gavel: Gavel,
  users: Users,
  building: Building2,
  landmark: Landmark,
  lightbulb: Lightbulb,
};

interface ServiceIconProps extends LucideProps {
  icon: Service["icon"];
}

export function ServiceIcon({ icon, ...rest }: ServiceIconProps) {
  const Icon = iconMap[icon];
  return <Icon aria-hidden="true" {...rest} />;
}
