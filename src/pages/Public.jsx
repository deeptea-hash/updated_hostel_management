import { Link } from 'react-router-dom';
import { GardenArt, HeroArt, Photo, Pic, ReceptionArt, RoomArt } from '../art.jsx';

const CATS = [
  ['Training attendees', 'Officers attending a scheduled training session', 'Check-in from the afternoon before training begins and check-out by the afternoon of the day after it ends. Longer stays need administrative approval.'],
  ['Special guests (VIP)', 'Supreme Court Judges, High Court Judges and Faculty', 'Priority allotment to designated suites.'],
  ['Non-training guests', 'Officers visiting for other official or personal reasons', 'Maximum stay of 3 days, charged at fixed state rates.'],
];
const STEPS = ['You are nominated for a training session or request a stay.', 'Sign in and confirm your arrival dates. Declare any family members or attendants travelling with you.',
  'The front desk allots a room according to your official rank.', 'You receive a stay confirmation.', 'At check-out, paid guests receive a room-charge invoice.'];

export function Home() {
  const feats = [['calendar', 'Confirm your arrival', 'Confirm your dates online before you travel.'], ['users', 'Declare accompanying persons', 'List family members or attendants in advance.'],
    ['scales', 'Allotment by rank', 'Rooms are allotted fairly according to official rank.'], ['lock', 'Private records', 'Guest details are visible only to authorised staff.']];
  return (
    <>
      <section className="hero hero-split">
        <div><p className="eyebrow">Official guest house portal</p><h2>Guest House and Hostel Management</h2>
          <p>Online room allotment, check-in and check-out for judicial officers, dignitaries and other authorised guests.</p>
          <div className="hero-actions"><Link className="btn gold" to="/login">Sign in</Link><Link className="btn line" to="/rules">Stay rules</Link></div></div>
        <div className="hero-pic"><Photo src="/images/hero.jpg" alt="The academy building"><HeroArt /></Photo></div>
      </section>
      <div className="facts">{[['3', 'guest categories'], ['3 days', 'maximum paid stay'], ['Same rank', 'required to share a room'], ['Online', 'arrival confirmation']].map(([n, l]) => <div key={l}><b>{n}</b><span>{l}</span></div>)}</div>
      <h2 className="sec">What you can do</h2>
      <div className="cards">{feats.map(([i, t, d]) => <div className="card" key={t}><span className="ico-circle"><Pic n={i} /></span><h3>{t}</h3><p>{d}</p></div>)}</div>
      <h2 className="sec">Our facilities</h2>
      <div className="gallery">
        <figure><Photo src="/images/reception.jpg" alt="Reception"><ReceptionArt /></Photo><figcaption>Front desk</figcaption></figure>
        <figure><Photo src="/images/rooms.jpg" alt="Guest room"><RoomArt /></Photo><figcaption>Comfortable, well-kept rooms</figcaption></figure>
        <figure><Photo src="/images/gardens.jpg" alt="Gardens"><GardenArt /></Photo><figcaption>Quiet gardens</figcaption></figure>
      </div>
      <div className="notice-box">
        <h3>Notices</h3>
        <ul>
          <li>Rooms are allotted by official rank. Guests do not choose a room category.</li>
          <li>Mess and food charges are billed separately and are not part of this system.</li>
          <li>Please declare accompanying family members or attendants before arrival.</li>
        </ul>
      </div>
      <h2 className="sec">Guest categories</h2>
      <div className="panel scroll"><table><thead><tr><th>Category</th><th>Who</th><th>Stay rule</th></tr></thead>
        <tbody>{CATS.map((c) => <tr key={c[0]}><td><b>{c[0]}</b></td><td>{c[1]}</td><td>{c[2]}</td></tr>)}</tbody></table></div>
      <h2 className="sec">How it works</h2>
      <ol className="steps-list">{STEPS.map((s) => <li key={s}>{s}</li>)}</ol>
    </>);
}

export function Rules() {
  return (
    <div className="panel prose">
      <h2>Stay rules</h2>
      <h3>Room allotment</h3>
      <ul><li>Rooms are allotted by the guest's official rank or tier.</li><li>Where two guests share a room, they must hold exactly the same rank.</li>
        <li>Special guests are considered first for designated suites.</li><li>The administration may change a room allotment at any time.</li></ul>
      <h3>Length of stay</h3>
      <ul><li>Training attendees: from the afternoon before the session to the afternoon after it ends. Extensions are approved manually by the administration.</li>
        <li>Non-training guests: up to 3 days.</li></ul>
      <h3>Charges</h3>
      <ul><li>Training attendees and special guests are not charged for the room.</li><li>Non-training guests pay fixed state rates for the nights stayed.</li><li>Mess and food billing is handled separately.</li></ul>
      <h3>Accompanying persons</h3>
      <ul><li>Declare family members or attendants on the portal before arrival.</li></ul>
    </div>);
}

export function Contact() {
  return (
    <div className="panel prose">
      <h2>Contact us</h2>
      <p><b>Front desk:</b> [telephone number]<br /><b>Email:</b> [official email address]<br /><b>Address:</b> [address of the guest house]<br /><b>Hours:</b> [office hours]</p>
      <h3 id="help">Help</h3><p>Forgotten your password or cannot sign in? Contact the front desk. Accounts are issued by the administration office.</p>
      <h3 id="accessibility">Accessibility</h3><p>Use the text size and contrast controls at the top of every page. Every page can be used with a keyboard. Report problems to the front desk.</p>
      <h3 id="privacy">Privacy policy</h3><p>Guest and officer records, including the identity of special guests, are visible only to authorised staff. Each access to guest details is recorded.</p>
      <h3 id="disclaimer">Disclaimer</h3><p>The content of this site is for the use of authorised guests and staff. Room allotment is at the discretion of the administration.</p>
    </div>);
}
