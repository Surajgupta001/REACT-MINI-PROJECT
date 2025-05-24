import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';
gsap.registerPlugin(ScrollTrigger);

import Card from '../Card/Card'

import va from '../../assets/va.png'
import fw from '../../assets/fw.png'
import cb from '../../assets/cb.png'
import tti from '../../assets/tti.png'
import br from '../../assets/br.png'
import ise from '../../assets/ise.png'

import './Project.css'

function Project() {
  useGSAP(() => {
    gsap.from("#experience", { y: 100, duration: 1, opacity: 0, stagger: 1, scrollTrigger: { trigger: "#experience", scroll: "body", scrub: "true", start: "top 80%", end: "top 30%" } })
    gsap.from(".slider", { y: 100, duration: 1, opacity: 0, stagger: 1, scrollTrigger: { trigger: ".slider", scroll: "body", scrub: "true", start: "top 80%", end: "top 30%" } })
  });
  return (
    <div id="projects">
      <h1 id='experience'>2+ YEARS EXPERIENCED IN PROJECTS</h1>
      <div className="slider">
        <Card title="VIRTUAL ASSISTANT" image={va} />
        <Card title="AI POWERED FITNESS WEBSITE" image={fw} />
        <Card title="AI CHATBOT" image={cb} />
        <Card title="AI TEXT TO IMAGE" image={tti} />
        <Card title="AI BACKGROUND REMOVER" image={br} />
        <Card title="IMAGE SEARCH ENGINE" image={ise} />
      </div>
    </div>
  )
}

export default Project
