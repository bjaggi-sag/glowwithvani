export type Service = {
  id: string;
  title: string;
  startingPrice: string;
  description: string;
  cta: string;
};

export const services: Service[] = [
  {
    id: "soft-glam-event",
    title: "Soft Glam / Event Makeup",
    startingPrice: "Starting at CAD 100",
    description:
      "Perfect for parties, events, dinners, birthdays, and special occasions. Includes a polished, camera-ready glam look tailored to you.",
    cta: "Request Booking"
  },
  {
    id: "photoshoot-content",
    title: "Photoshoot / Content Makeup",
    startingPrice: "Starting at CAD 150",
    description:
      "Ideal for branding shoots, creative shoots, studio work, and content creation. Designed to photograph beautifully under professional lighting.",
    cta: "Request Booking"
  },
  {
    id: "bridal-makeup",
    title: "Bridal Makeup",
    startingPrice: "Starting at CAD 400",
    description:
      "Luxury bridal makeup service focused on flawless, long-lasting wear for your wedding day, with a personalized glam approach.",
    cta: "Request Booking"
  },
  {
    id: "bridal-trial",
    title: "Bridal Trial",
    startingPrice: "Starting at CAD 100",
    description:
      "A dedicated bridal preview session to refine and finalize your wedding-day look in advance.",
    cta: "Request Booking"
  }
];

export const servicePricingNotes = [
  "Travel fees may apply depending on location.",
  "Custom bridal and group packages available upon request."
];
