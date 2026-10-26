import { ArrowUpRight, BookOpen, Eye, Lightbulb } from "lucide-react";

const benefits = [
  {
    icon: Eye,
    title: "Notice more",
    description: "A new setting gives students something tangible to observe, compare and ask questions about.",
  },
  {
    icon: Lightbulb,
    title: "Connect ideas",
    description: "Places, people and objects can help link classroom topics with the world students experience.",
  },
  {
    icon: BookOpen,
    title: "Learn together",
    description: "Shared experiences create room for discussion, reflection and different points of view.",
  },
];

export function WhyEducationalTravel() {
  return (
    <section className="why-section" id="about" aria-labelledby="why-title">
      <div className="why-inner">
        <div className="why-intro">
          <p className="eyebrow eyebrow-light">WHY EDUCATIONAL TRAVEL</p>
          <h2 id="why-title">A change of place<br />can change the <em>view.</em></h2>
          <p>Learning can continue beyond a textbook. Exploring a place together invites students to look closely, make connections and carry new questions back to the classroom.</p>
          <span className="why-note"><span className="why-note-mark">“</span>Learning begins with curiosity.</span>
        </div>
        <div className="benefits-list">
          {benefits.map(({ icon: Icon, title, description }, index) => (
            <article className="benefit-row" key={title}>
              <span className="benefit-icon"><Icon size={20} strokeWidth={1.6} aria-hidden="true" /></span>
              <div><span className="benefit-number">0{index + 1}</span><h3>{title}</h3><p>{description}</p></div>
              <ArrowUpRight className="benefit-arrow" size={17} aria-hidden="true" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
