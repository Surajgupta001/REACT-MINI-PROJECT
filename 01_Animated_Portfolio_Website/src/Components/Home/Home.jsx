import Typical from 'react-typical'
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';

import './Home.css'
import man from '../../assets/man.png'

function Home() {

    useGSAP(() => {
        let tl = gsap.timeline();
        tl.from(".line1", { y: 80, duration: 1, opacity: 0 })
        tl.from(".line2", { y: 80, duration: 1, opacity: 0 })
        tl.from(".line3", { y: 80, duration: 1, opacity: 0 })
        gsap.from(".righthome img", { duration: 1, opacity: 0, scale: 0.5, ease: "power1.inOut" })
    });
    return (
        <div id='home'>
            <div className="lefthome">
                <div className="homedetails">
                    <div className="line1">HEY, I'M</div>
                    <div className="line2">SURAJ GUPTA</div>
                    <div className="line3">
                        <Typical
                            steps={['WEB DEVELOPER', 2000, 'FRONTEND ENGINEER', 2000, 'BACKEND ENGINEER', 2000, 'FULLSTACK DEVELOPER', 2000]}
                            loop={Infinity}
                            wrapper="span"
                            cursor='|'
                        />
                    </div>
                    <div><button>HIRE ME</button></div>
                </div>
            </div>
            <div className="righthome">
                <img src={man} alt="" />
            </div>
        </div>
    )
}

export default Home