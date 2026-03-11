import servicesContent from "@/data/services.content.json";

export type Service = {
  id: string;
  title: string;
  startingPrice: string;
  description: string;
  cta: string;
};

type ServicesContent = {
  services: Service[];
  servicePricingNotes: string[];
};

const typedServicesContent = servicesContent as ServicesContent;

export const services = typedServicesContent.services;
export const servicePricingNotes = typedServicesContent.servicePricingNotes;
