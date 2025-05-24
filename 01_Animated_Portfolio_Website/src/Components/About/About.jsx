import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';
gsap.registerPlugin(ScrollTrigger);

import Card from '../Card/Card'
import './About.css'

import mern from '../../assets/mern.png'
import dsa from '../../assets/dsa.png'
import java from '../../assets/java.png'

function About() {
  useGSAP(() => {
    gsap.from(".circle", { x: -100, duration: 1, opacity: 0, stagger: 1, scrollTrigger: { trigger: ".circle", scroll: "body", scrub: "true", start: "top 60%", end: "top 30%" } })
    gsap.from(".line", { x: -100, duration: 1, opacity: 0, stagger: 1, scrollTrigger: { trigger: ".line", scroll: "body", scrub: "true", start: "top 60%", end: "top 30%" } })
    gsap.from(".about-details h1", { x: -100, duration: 1, opacity: 0, stagger: 1, scrollTrigger: { trigger: ".about-details h1", scroll: "body", scrub: "true", start: "top 60%", end: "top 30%" } })
    gsap.from(".about-details ul", { y: 100, duration: 1, opacity: 0, stagger: 1, scrollTrigger: { trigger: ".about-details ul", scroll: "body", scrub: "true", start: "top 60%", end: "top 30%" } })
    gsap.from(".rightabout", { x: 100, duration: 1, opacity: 0, stagger: 1, scrollTrigger: { trigger: ".rightabout", scroll: "body", scrub: "true", start: "top 60%", end: "top 30%" } })
  });
  return (
    <div id='about'>
      <div className="leftabout">
        <div className="circle-line">
          <div className="circle"></div>
          <div className="line"></div>
          <div className="circle"></div>
          <div className="line"></div>
          <div className="circle"></div>
        </div>
        <div className="about-details">
          <div className="personal-info">
            <h1>Personal Info</h1>
            <ul>
              <li><span>Name</span> : Suraj Gupta</li>
              <li><span>Age</span> : 22 YEARS</li>
              <li><span>Address</span> : India</li>
              <li><span>Phone</span> : +91 1234567890</li>
            </ul>
          </div>
          <div className="education-info">
            <h1>Education Info</h1>
            <ul>
              <li><span>Degree</span> : B.TECH</li>
              <li><span>Branch</span> : CSE</li>
              <li><span>Collage</span> : KIIT</li>
              <li><span>CGPA</span> : 8.7</li>
            </ul>
          </div>
          <div className="skill-info">
            <h1>Skills</h1>
            <ul>
              <li>MERN STACK WEB DEVELOPER</li>
              <li>DATA STRUCTURE & ALGORITHMS</li>
              <li>CYBER SECURITY</li>
              <li>MACHINE LEARNING</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="rightabout">
        <Card title="MERN Stack Web Developer" image={mern} />
        <Card title="Data Structure & Algorithms" image={dsa} />
        <Card title="Java" image={java} />
      </div>
    </div>
  )
}

export default About
