import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';
gsap.registerPlugin(ScrollTrigger);

import './Contact.css'
import contact from '../../assets/contact.png'

function Contact() {
  useGSAP(() => {
    gsap.from(".left-contact img", { x: -100, duration: 1, opacity: 0, stagger: 1, scrollTrigger: { trigger: ".left-contact img", scroll: "body", scrub: "true", start: "top 60%", end: "top 30%" } })
    gsap.from(".right-contact form", { y: 100, duration: 1, opacity: 0, stagger: 1, scrollTrigger: { trigger: ".right-contact form", scroll: "body", scrub: "true", start: "top 60%", end: "top 30%" } })
  });
  return (
    <div id="contact">
      <div className="left-contact">
        <img src={contact} alt="" />
      </div>
      <div className="right-contact">
        <form action="https://formspree.io/f/mpwdogwe" method="POST">
          <input name="username" type="text" placeholder='Name' />
          <input name="email" type="email" placeholder='Email' />
          <textarea name="message" id="textarea" placeholder='Message Me'></textarea>
          <input type="submit" id='btn' value='submit' />
        </form>
      </div>
    </div>
  )
}

export default Contact
