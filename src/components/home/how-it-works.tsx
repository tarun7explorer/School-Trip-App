import { ArrowDownRight, ArrowRight, ClipboardList, Compass, MessageCircleMore } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Compass,
    title: "Explore a destination",
    description: "Browse the learning themes for Hyderabad, Jaipur and Delhi, then open the destination that interests your school.",
  },
  {
    number: "02",
    icon: ClipboardList,
    title: "Share your school's interest",
    description: "When registration is available, a teacher can share school and contact details along with an approximate student count.",
  },
  {
    number: "03",
    icon: MessageCircleMore,
    title: "Continue the conversation",
    description: "MB Learning can follow up to understand what your school needs and discuss verified programme details.",
  },
];

export function HowItWorks() {
  return (
    <section className="how-section section-wrap" id="how-it-works" aria-labelledby="how-title">
      <div className="section-heading how-heading">
        <div><p className="eyebrow">A SIMPLE PLACE TO START</p><h2 id="how-title">From first idea<br />to shared interest.</h2></div>
        <p className="section-intro">School trip planning starts with a conversation. The platform is designed to make exploring and expressing interest clear for teachers.</p>
      </div>
      <div className="steps-grid">
        {steps.map(({ number, icon: Icon, title, description }, index) => (
          <article className="step-card" key={number}>
            <div className="step-top"><span className="step-number">{number}</span><span className="step-icon"><Icon size={21} strokeWidth={1.6} aria-hidden="true" /></span></div>
            <h3>{title}</h3>
            <p>{description}</p>
            {index < steps.length - 1 && <ArrowDownRight className="step-arrow" size={20} aria-hidden="true" />}
          </article>
        ))}
      </div>
      <p className="phase-note">Interest registration is not enabled yet. This phase introduces the destinations and public site experience.</p>
      <a href="#trips" className="text-link how-link">Explore the trip themes <ArrowRight size={16} aria-hidden="true" /></a>
    </section>
  );
}
