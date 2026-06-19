import ScrollReelTestimonials, { type ScrollReelTestimonial } from './ui/scroll-reel-testimonials';
import avatarMale from '../assets/images/avatar-male.svg';
import avatarFemale from '../assets/images/avatar-female.svg';
import photoRaymond from '../assets/images/raymond-feng.jpg';
import photoSteven from '../assets/images/steven-zhang.jpg';

type Gender = 'male' | 'female';

type Person = {
  quote: string;
  name: string;
  role: string;
  // Picks the anonymous avatar when no real photo is supplied. Flip to
  // 'female' to use the female avatar.
  gender: Gender;
  // Drop in a real headshot URL/import to override the anonymous avatar.
  photo?: string;
  // Paste a LinkedIn URL to show a clickable LinkedIn icon on that card.
  linkedin?: string;
};

const people: Person[] = [
  {
    quote:
      'For the eight years I have known Ethan, he has always been a diligent, outgoing, and personable friend whom I can depend on. What stands out to me the most is his honesty and willingness to learn - his discipline, reliability, and curiosity make him a valued member of any team he is a part of.',
    name: 'Raymond Feng',
    role: 'Anatomy & Cell Biology - McGill University',
    gender: 'male',
    photo: photoRaymond,
  },
  {
    quote:
      'Ethan has a thing for seeing and expressing appreciation for the skills he sees in others. In a workplace that will translate to being very analytical. Also a goat.',
    name: 'Steven Zhang',
    role: 'Family Friend',
    gender: 'male',
    linkedin: 'https://www.linkedin.com/in/steven-zhang-742a3a329',
    photo: photoSteven,
  },
  {
    quote: 'Working with Ethan has been a pleasure.',
    name: 'Jun Ma',
    role: 'Teammate - VEX Robotics Team 604X',
    gender: 'male',
    linkedin: 'https://www.linkedin.com/in/haojunma1/'
  },
  {
    quote:
      'Ethan is one of the most diligent and disciplined people I’ve ever worked with. His dedication and passion shines through, and he’s also one of the kindest souls I know.',
    name: 'Alvin Li',
    role: 'Mechatronics Engineering Student at the University of Waterloo',
    gender: 'male',
    linkedin: 'https://www.linkedin.com/in/alvinli7',
  },
  {
    quote:
      'What sets Ethan apart from others is his strong commitment and never-ending determination. Whenever a mechanism fails or an autonomous bug appears, he puts himself through hours of testing until the robot is ready for the tournament. His commitment keeps the whole group moving forward despite obstacles and sets an example for others to follow.',
    name: 'Alan Li',
    role: 'Student at UBC',
    gender: 'male',
    linkedin: 'https://www.linkedin.com/in/alan-li-08a4143a6',
  },
];

const avatarFor = (p: Person) =>
  p.photo ?? (p.gender === 'female' ? avatarFemale : avatarMale);

export default function Testimonials() {
  const items: ScrollReelTestimonial[] = people.map((p) => ({
    quote: p.quote,
    author: p.name,
    role: p.role,
    image: avatarFor(p),
    alt: `${p.name} - portrait`,
    linkedin: p.linkedin,
  }));

  return (
    <section className="section py-20 bg-transparent" id="testimonials">
      <div className="w-full max-w-[var(--maxw)] mx-auto px-5 md:px-[var(--gutter)]">

        {/* Header */}
        <div className="section-head reveal mb-12">
          <span className="section-no">04 - In their words</span>
          <h2 className="h2 font-display text-[2.7rem] leading-none tracking-tight">
            What others <span className="text-accent italic font-normal">say.</span>
          </h2>
        </div>

        {/* One featured testimonial at a time - counter-rotating scroll reel,
            clicks into place; arrows or left/right keys to navigate. */}
        <div className="flex justify-center">
          <ScrollReelTestimonials testimonials={items} autoPlay autoPlayMs={6000} />
        </div>

      </div>
    </section>
  );
}
